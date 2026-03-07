export default function Imprint() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Imprint</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Information according to Section 5 TMG</h2>
        <p className="text-base leading-relaxed">
          Felix Böhm<br />
          Josephsplatz 8<br />
          90403 Nürnberg
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Contact</h2>
        <p className="text-base leading-relaxed">
          Email: <a href="mailto:contact@performance-dudes.de" className="underline">contact@performance-dudes.de</a>
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Liability for content</h2>
        <p className="text-base leading-relaxed">
          The contents of our pages were created with the greatest care. However,
          we cannot guarantee the accuracy, completeness, or timeliness of the
          content. As a service provider, we are responsible for our own content
          on these pages in accordance with general laws pursuant to Section 7(1)
          TMG. According to Sections 8 to 10 TMG, however, we are not obligated
          as a service provider to monitor transmitted or stored third-party
          information or to investigate circumstances that indicate illegal
          activity. Obligations to remove or block the use of information under
          general law remain unaffected. However, liability in this regard is
          only possible from the point in time at which a concrete infringement
          of the law becomes known. If we become aware of any such infringements,
          we will remove this content immediately.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Liability for links</h2>
        <p className="text-base leading-relaxed">
          Our website contains links to external websites of third parties over
          whose content we have no influence. Therefore, we cannot accept any
          liability for this third-party content. The respective provider or
          operator of the pages is always responsible for the content of the
          linked pages. The linked pages were checked for possible legal
          violations at the time of linking. Illegal content was not recognizable
          at the time of linking. However, permanent content control of the
          linked pages is not reasonable without concrete evidence of an
          infringement of the law. If we become aware of any infringements, we
          will remove such links immediately.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Copyright</h2>
        <p className="text-base leading-relaxed">
          The content and works created by the site operators on these pages are
          subject to German copyright law. Duplication, processing, distribution,
          or any form of commercialization of such material beyond the scope of
          the copyright law requires the prior written consent of its respective
          author or creator. Downloads and copies of this site are only permitted
          for private, non-commercial use. Insofar as the content on this site
          was not created by the operator, the copyrights of third parties are
          respected. In particular, third-party content is marked as such. Should
          you nevertheless become aware of a copyright infringement, please
          inform us accordingly. If we become aware of any infringements, we will
          remove such content immediately.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Data protection</h2>
        <p className="text-base leading-relaxed">
          The use of our website is generally possible without providing personal
          data. Insofar as personal data (such as name, address, or email
          addresses) is collected on our pages, this is always done on a
          voluntary basis as far as possible. This data will not be passed on to
          third parties without your express consent. We point out that data
          transmission over the Internet (e.g., communication by email) can have
          security gaps. Complete protection of data against access by third
          parties is not possible. The use of contact data published within the
          framework of the imprint obligation by third parties for sending
          unsolicited advertising and information materials is hereby expressly
          prohibited. The operators of the pages expressly reserve the right to
          take legal action in the event of the unsolicited sending of
          advertising information, such as spam emails.
        </p>
      </section>

      <footer className="border-t border-gray-200 pt-8 mt-16">
        <a href="/" className="text-gray-400 text-sm hover:text-gray-600">
          &larr; Back to home
        </a>
      </footer>
    </main>
  );
}
