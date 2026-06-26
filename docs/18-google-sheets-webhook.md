# 18 — Google Sheets Webhook (Orders Mirror)

## Why

Every order is also pushed to a Google Sheet (in addition to Postgres + COD Network) so the non-technical team has a live, filterable, exportable view of orders without needing access to the database.

## Setup (one-time, by user/owner)

1. Create a new Google Sheet titled "Al Nadara — Orders".
2. Add a header row with these columns (column letter = order field):

   `A: timestamp_utc | B: order_ref | C: status | D: customer_name | E: customer_phone | F: items | G: subtotal_kwd | H: upsell_total_kwd | I: shipping_kwd | J: grand_total_kwd | K: currency | L: utm_source | M: utm_medium | N: utm_campaign | O: utm_content | P: landing_url | Q: referrer | R: codnetwork_status | S: notes`

3. Extensions → Apps Script.
4. Paste the script below.
5. Set a script property `WEBHOOK_SECRET` = a long random string (Project Settings → Script properties). Use the same value in backend env `SHEETS_WEBHOOK_SECRET`.
6. Deploy → New deployment → Type "Web app" → Execute as **Me**, Access **Anyone**. Copy the deploy URL.
7. Put the URL in backend env: `SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfy.../exec`.

### Apps Script

```javascript
function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var expected = props.getProperty('WEBHOOK_SECRET');
    var got = e.parameter.secret;
    if (!expected || got !== expected) {
      return ContentService.createTextOutput(JSON.stringify({ok:false, error:'unauthorized'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var body = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Try update if order_ref already exists; otherwise append.
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var refIdx = headers.indexOf('order_ref');
    var foundRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][refIdx] === body.order_ref) { foundRow = i + 1; break; }
    }

    var row = [
      new Date().toISOString(),
      body.order_ref,
      body.status,
      body.customer_name,
      body.customer_phone,
      JSON.stringify(body.items),
      body.subtotal_kwd,
      body.upsell_total_kwd,
      body.shipping_kwd,
      body.grand_total_kwd,
      body.currency,
      body.utm.source || '',
      body.utm.medium || '',
      body.utm.campaign || '',
      body.utm.content || '',
      body.landing_url || '',
      body.referrer || '',
      body.codnetwork_status || '',
      body.notes || ''
    ];

    if (foundRow > 0) {
      sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Backend integration

`backend/src/alnadara/services/sheets_webhook.py`:

```python
async def push_order(self, order: Order, notes: str = "") -> None:
    url = self.settings.sheets_webhook_url
    if not url:
        return  # disabled
    body = {
        "order_ref": order.order_ref,
        "status": order.status,
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone_e164,
        "items": [
            {"sku": i.sku, "title_ar": i.title_ar, "qty": i.bundle_size, "line_total_kwd": float(i.line_total_kwd)}
            for i in order.items
        ],
        "subtotal_kwd": float(order.subtotal_kwd),
        "upsell_total_kwd": float(order.upsell_total_kwd),
        "shipping_kwd": float(order.shipping_kwd),
        "grand_total_kwd": float(order.grand_total_kwd),
        "currency": order.currency,
        "utm": {
            "source": order.utm_source, "medium": order.utm_medium,
            "campaign": order.utm_campaign, "content": order.utm_content,
        },
        "landing_url": order.landing_url,
        "referrer": order.referrer,
        "codnetwork_status": order.codnetwork_status,
        "notes": notes,
    }
    # secret is passed as querystring because Apps Script reads e.parameter
    full_url = f"{url}?secret={self.settings.sheets_webhook_secret}"
    resp = await self._post_with_retries(full_url, body, retries=3)
    order.sheets_webhook_sent_at = utcnow()
    order.sheets_webhook_status = "ok" if resp.get("ok") else "failed"
```

## When we push

- Initial order creation (right after `POST /v1/orders` persists).
- Upsell added (`POST /v1/orders/{ref}/upsell`) — re-pushes the order so the sheet row updates with new grand total.
- COD Network status webhook updates (status, codnetwork_status).

Each push is upsert by `order_ref` (handled by the Apps Script).

## Failure handling

- 3 retries with exponential backoff.
- On final failure → log to `event_log` table with payload + error.
- Manual replay via `POST /internal/orders/{ref}/resend-sheets`.

## Privacy

- Sheet access restricted to brand owner + 1-2 trusted team members.
- Apps Script webhook deployment is "Anyone" but protected by `WEBHOOK_SECRET` query param.
- Customer data in the sheet should follow same retention policy as Postgres (24 months).

## Alternative considered

Direct Google Sheets API integration via service account — rejected for v1 due to extra setup (GCP project, service account keys, OAuth scopes). The Apps Script webhook is simpler and works for our scale.
