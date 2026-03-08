import Link from "next/link";

type ImprintSection = {
  readonly title: string;
  readonly text?: string;
  readonly html?: string;
};

type Content = {
  readonly imprintPage: {
    readonly title: string;
    readonly backLink: string;
    readonly backHref: string;
    readonly sections: readonly ImprintSection[];
  };
};

export function ImprintPage({ t }: { t: Content }) {
  const p = t.imprintPage;
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">{p.title}</h1>

      {p.sections.map((section) => (
        <section key={section.title} className="mb-12">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          {section.html ? (
            <p
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
          ) : (
            <p className="text-base leading-relaxed whitespace-pre-line">
              {section.text}
            </p>
          )}
        </section>
      ))}

      <footer className="border-t border-gray-200 pt-8 mt-16">
        <Link href={p.backHref} className="text-gray-400 text-sm hover:text-gray-600">
          {p.backLink}
        </Link>
      </footer>
    </main>
  );
}
