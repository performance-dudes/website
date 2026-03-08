import Link from "next/link";

export default function HomeDe() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-24">
        <h1 className="text-4xl font-bold mb-8">Performance Dudes</h1>
        <p className="text-xl leading-relaxed">
          Wir beschleunigen Softwareentwicklung mit AI. F&uuml;r Teams aus
          Engineering, Operations und dar&uuml;ber hinaus. Wir bauen, modernisieren
          und machen Projekte zukunftsf&auml;hig. Schnell, zum Festpreis, und so,
          dass euer Team danach eigenst&auml;ndig weiterarbeiten kann.
        </p>
      </section>

      {/* Racing Car */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">Gebaut f&uuml;r ambitionierte Fahrer</h2>
        <p className="text-lg leading-relaxed mb-4">
          Ihr habt Ideen. Gro&szlig;e Ideen. Aber euer Projekt kommt nicht hinterher.
          Jede &Auml;nderung dauert Monate. Die Leute, die es gebaut haben, sind
          l&auml;ngst weg. Und niemand traut sich, anzufassen, was sie hinterlassen haben.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Wir geben euch den Rennwagen, den ihr braucht. Die Geschwindigkeit, die
          ihr euch immer gew&uuml;nscht habt, damit eure Ideen Wirklichkeit werden.
          Leicht. Wendig. AI als Motor, damit euer Team so schnell fahren kann wie
          euer Ehrgeiz.
        </p>
        <pre className="font-mono text-base leading-relaxed text-gray-600 mb-6">
{`Das Auto      = euer Projekt
Der Motor     = AI
Die Boxencrew = wir
Der Fahrer    = euer Team`}
        </pre>
        <p className="text-lg leading-relaxed">
          Wir sind die Boxencrew. Wir kommen, bauen das Auto, tunen den Motor
          und geben euch den Schl&uuml;ssel. Wochen statt Monate. Und wenn wir gehen,
          braucht euer Team uns nicht mehr am Steuer. Das Auto wurde f&uuml;r euch gebaut.
        </p>
      </section>

      {/* Woran wir glauben */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-8">Woran wir glauben</h2>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            <span className="font-semibold">Geschwindigkeit hei&szlig;t: Ballast abwerfen.</span>{" "}
            Nicht Abk&uuml;rzungen nehmen, sondern Verschwendung eliminieren. Lange
            Freigabeketten, aufgebl&auml;hte Prozesse, Meetings, die eine Nachricht
            h&auml;tten sein k&ouml;nnen. Wir r&auml;umen das alles aus dem Weg, damit
            euer Team sich auf das Wesentliche konzentrieren kann.
          </p>
          <p>
            <span className="font-semibold">Wissen geh&ouml;rt ins Projekt, nicht in die K&ouml;pfe einzelner.</span>{" "}
            Wenn jemand geht, sollte das Wissen nicht mitgehen. Wir verankern alles
            direkt im Projekt: Fachkontext, Entscheidungen, Konventionen. So kann
            jedes Teammitglied und jedes AI-Tool sofort einsteigen und beitragen.
          </p>
          <p>
            <span className="font-semibold">AI generiert. Menschen entscheiden.</span>{" "}
            AI macht uns schnell. Nicht leichtsinnig. Erfahrene Engineers treffen
            die Entscheidungen. Wir sagen euch immer ehrlich, was AI kann und was
            nicht, denn Vertrauen beginnt mit Ehrlichkeit.
          </p>
          <p>
            <span className="font-semibold">Wir sind erfolgreich, wenn euer Team erfolgreich ist.</span>{" "}
            Wir sind nicht hier, um Abh&auml;ngigkeiten zu schaffen. Wir sind hier,
            um eure Leute f&auml;higer zu machen, eure Projekte wartbarer und eure
            Organisation schneller. Mit oder ohne uns.
          </p>
        </div>
      </section>

      {/* Was wir tun */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-8">Was wir tun</h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold mb-2">Bauen</h3>
            <p className="text-lg leading-relaxed">
              Ihr habt eine Idee. Wir setzen sie um. Festpreis, schnell, und danach
              &uuml;bernimmt euer Team. Das Projekt ist AI-ready und eure Leute waren
              von Anfang an dabei.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Bauen, was wirklich passt</h3>
            <p className="text-lg leading-relaxed">
              Standardsoftware kann oft zu viel und passt zu wenig. Mit AI ist es
              schneller und g&uuml;nstiger als gedacht, ein eigenes Tool zu bauen, das
              genau zu euren Anforderungen passt. Es geh&ouml;rt euch. Keine
              Lizenzkosten pro Nutzer. Kein Vendor Lock-in.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Performance Audit</h3>
            <p className="text-lg leading-relaxed">
              Unsicher, wo anfangen? Wir schauen uns euer Projekt an und sagen euch,
              was wir sehen: was euch ausbremst, was wir &auml;ndern w&uuml;rden und was
              es kosten w&uuml;rde. Ein kurzes Engagement, Festpreis, keine
              Verpflichtung dar&uuml;ber hinaus.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Team Upgrade</h3>
            <p className="text-lg leading-relaxed">
              Euer Team ist gut, aber nicht so schnell, wie es sein k&ouml;nnte. Wir
              ersetzen niemanden. Wir upgraden das Setup: AI-Tooling, Workflows,
              Projektstruktur und Practices. Gleiche Leute, deutlich schneller.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Autopilot f&uuml;r die Routinearbeit</h3>
            <p className="text-lg leading-relaxed">
              Updates, Tests, Dokumentation, Security-Patches. Dinge, die niemand
              machen will, aber jeder braucht. Wir richten euer Projekt so ein, dass
              AI die Routinearbeit &uuml;bernimmt. Euer Team konzentriert sich auf das,
              was als N&auml;chstes kommt.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Race Strategy</h3>
            <p className="text-lg leading-relaxed">
              Ihr habt 10 Ideen. Wir helfen euch, die 3 zu finden, die wirklich
              etwas bewegen, und in welcher Reihenfolge. Dann bauen wir sie.
            </p>
          </div>
        </div>
      </section>

      {/* So funktioniert es */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">So funktioniert es</h2>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            <span className="font-semibold">Wir reden.</span>{" "}
            Kein Pitch Deck, kein wochenlanger Sales-Prozess. Ein Gespr&auml;ch
            dar&uuml;ber, was ihr braucht und ob wir die Richtigen daf&uuml;r sind.
          </p>
          <p>
            <span className="font-semibold">Wir scopen es.</span>{" "}
            Ein klares Angebot mit Festpreis, konkreten Liefergegenst&auml;nden und
            definierten Abnahmekriterien. Ihr wisst, was ihr bekommt und was es kostet.
          </p>
          <p>
            <span className="font-semibold">Wir bauen es.</span>{" "}
            Euer Team arbeitet von Anfang an mit uns. W&ouml;chentliche Demos von
            funktionierendem Fortschritt. Keine Folien, keine Statusberichte.
          </p>
          <p>
            <span className="font-semibold">Es geh&ouml;rt euch.</span>{" "}
            Wenn wir fertig sind, geh&ouml;rt das Projekt euch. AI-ready, dokumentiert,
            getestet. Euer Team macht ohne uns weiter. Und wenn die n&auml;chste Idee
            kommt, sind wir nur ein Gespr&auml;ch entfernt.
          </p>
        </div>
      </section>

      {/* Wer wir sind */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">Wer wir sind</h2>
        <p className="text-lg leading-relaxed mb-4">
          Ein Kollektiv erfahrener Engineers und Berater mit einem gemeinsamen
          Ansatz: AI-native Softwareentwicklung. Jeder von uns bringt jahrelange
          Erfahrung aus verschiedenen Branchen, Tech-Stacks und Teamstrukturen mit.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          F&uuml;r jedes Engagement kommen wir als professionelle Einheit zusammen.
          Klein genug, um schnell zu sein. Erfahren genug, um mit dem Wichtigen
          betraut zu werden.
        </p>
        <p className="text-lg leading-relaxed">
          Der Name ist verspielt. Die Arbeit ist es nicht. Wir haben ehrlich Spa&szlig;
          an dem, was wir tun, und diese Energie sp&uuml;rt man in dem, was wir liefern.
        </p>
      </section>

      {/* CTA */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-4">Lass uns reden</h2>
        <p className="text-lg leading-relaxed mb-6">
          Ihr habt ein Projekt, eine Idee oder einfach eine Frage? Wir freuen
          uns, davon zu h&ouml;ren. Kein Druck, kein Pitch. Einfach ein Gespr&auml;ch
          dar&uuml;ber, was m&ouml;glich ist.
        </p>
        <p className="text-lg">
          <a href="mailto:hello@performance-dudes.com" className="underline font-semibold">
            hello@performance-dudes.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 pt-8 text-gray-400 text-sm flex justify-between">
        <span>Performance Dudes. We get things done.</span>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-600">English</Link>
          <a href="/impressum" className="hover:text-gray-600">Impressum</a>
        </div>
      </footer>
    </main>
  );
}
