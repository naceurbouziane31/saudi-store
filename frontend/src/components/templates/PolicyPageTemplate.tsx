interface PolicyPageTemplateProps {
  title: string;
  lead: string;
  children: React.ReactNode;
}

export const PolicyPageTemplate = ({ title, lead, children }: PolicyPageTemplateProps) => (
  <>
    <section className="bg-cream py-12 lg:py-16 text-center">
      <div className="container-wide max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-display text-ink-900 mb-3">{title}</h1>
        <p className="text-lg text-ink-700">{lead}</p>
      </div>
    </section>
    <article className="container-wide max-w-3xl mx-auto py-10 lg:py-16 prose prose-headings:font-display prose-h2:text-h2 prose-h3:text-h3 prose-p:leading-relaxed prose-p:text-ink-700">
      {children}
    </article>
  </>
);
