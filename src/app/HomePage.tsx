import Link from "next/link";

type Content = {
  readonly hero: { readonly title: string; readonly text: string };
  readonly methodology: { readonly text: string };
  readonly racingCar: { readonly title: string; readonly p1: string; readonly p2: string; readonly diagram: string; readonly p3: string };
  readonly beliefs: { readonly title: string; readonly items: readonly { readonly bold: string; readonly text: string }[] };
  readonly products: { readonly title: string; readonly items: readonly { readonly name: string; readonly text: string; readonly badge?: string }[] };
  readonly howItWorks: { readonly title: string; readonly steps: readonly { readonly bold: string; readonly text: string }[] };
  readonly whoWeAre: { readonly title: string; readonly p1: string; readonly p2: string; readonly p3: string };
  readonly cta: { readonly title: string; readonly text: string; readonly action: string; readonly email: string };
  readonly footer: { readonly tagline: string; readonly switchLang: string; readonly switchLangHref: string; readonly imprint: string; readonly imprintHref: string };
};

export function HomePage({ t }: { t: Content }) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <section className="mb-24">
        <h1 className="text-4xl font-bold mb-8">{t.hero.title}</h1>
        <p className="text-xl leading-relaxed">{t.hero.text}</p>
      </section>

      <section className="mb-24">
        <p className="text-lg leading-relaxed text-gray-600">{t.methodology.text}</p>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">{t.racingCar.title}</h2>
        <p className="text-lg leading-relaxed mb-4">{t.racingCar.p1}</p>
        <p className="text-lg leading-relaxed mb-4">{t.racingCar.p2}</p>
        <pre className="font-mono text-base leading-relaxed text-gray-600 mb-6">
          {t.racingCar.diagram}
        </pre>
        <p className="text-lg leading-relaxed">{t.racingCar.p3}</p>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-8">{t.beliefs.title}</h2>
        <div className="space-y-6 text-lg leading-relaxed">
          {t.beliefs.items.map((item) => (
            <p key={item.bold}>
              <span className="font-semibold">{item.bold}</span>{" "}
              {item.text}
            </p>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-8">{t.products.title}</h2>
        <div className="space-y-12">
          {t.products.items.map((item, i) => (
            <div key={item.name} className={i === 0 && item.badge ? "border-l-4 border-gray-900 pl-6" : ""}>
              <h3 className="text-xl font-semibold mb-2">
                {item.name}
                {item.badge && (
                  <span className="ml-3 text-sm font-medium text-gray-500">{item.badge}</span>
                )}
              </h3>
              <p className="text-lg leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">{t.howItWorks.title}</h2>
        <div className="space-y-6 text-lg leading-relaxed">
          {t.howItWorks.steps.map((step) => (
            <p key={step.bold}>
              <span className="font-semibold">{step.bold}</span>{" "}
              {step.text}
            </p>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">{t.whoWeAre.title}</h2>
        <p className="text-lg leading-relaxed mb-4">{t.whoWeAre.p1}</p>
        <p className="text-lg leading-relaxed mb-4">{t.whoWeAre.p2}</p>
        <p className="text-lg leading-relaxed">{t.whoWeAre.p3}</p>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-4">{t.cta.title}</h2>
        <p className="text-lg leading-relaxed mb-4">{t.cta.text}</p>
        <p className="text-lg leading-relaxed mb-6">{t.cta.action}</p>
        <p className="text-lg">
          <a href={`mailto:${t.cta.email}`} className="underline font-semibold">
            {t.cta.email}
          </a>
        </p>
      </section>

      <footer className="border-t border-gray-200 pt-8 text-gray-400 text-sm flex justify-between">
        <span>{t.footer.tagline}</span>
        <div className="space-x-4">
          <Link href={t.footer.switchLangHref} className="hover:text-gray-600">
            {t.footer.switchLang}
          </Link>
          <Link href={t.footer.imprintHref} className="hover:text-gray-600">
            {t.footer.imprint}
          </Link>
        </div>
      </footer>
    </main>
  );
}
