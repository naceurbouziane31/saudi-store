/**
 * KWD has 3 official decimals (1 KWD = 1000 fils). We display:
 *   - whole numbers   → "29 KWD"
 *   - non-zero fils   → "29.500 KWD"
 *
 * Always render with Western Arabic numerals (Kuwait consumers use those
 * online); embed an LTR isolate so the price stays left-to-right inside an
 * RTL paragraph.
 */
const LRI = "\u2066";
const PDI = "\u2069";

const formatNumber = (value: number, locale = "en-US"): string => {
  const isWhole = Math.abs(value - Math.round(value)) < 0.0005;
  return value.toLocaleString(locale, {
    minimumFractionDigits: isWhole ? 0 : 3,
    maximumFractionDigits: 3,
  });
};

export const formatKwd = (
  value: number,
  { withSymbol = true, isolate = true }: { withSymbol?: boolean; isolate?: boolean } = {},
): string => {
  const rendered = formatNumber(value);
  const symbol = withSymbol ? " KWD" : "";
  return isolate ? `${LRI}${rendered}${symbol}${PDI}` : `${rendered}${symbol}`;
};

export const formatPerPiece = (totalKwd: number, qty: number): string =>
  `${formatKwd(totalKwd / qty)} للقطعة`;
