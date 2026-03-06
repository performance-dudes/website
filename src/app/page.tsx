export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-24">
        <h1 className="text-4xl font-bold mb-8">Performance Dudes</h1>
        <pre className="text-lg leading-relaxed mb-8 font-mono text-gray-600">
{`They quote 6 months.
We deliver in 6 weeks.
You pay for 3 months.
Everybody wins.`}
        </pre>
        <p className="text-lg leading-relaxed">
          We&apos;re a software engineering crew that uses AI the way it&apos;s meant to be
          used — not as a buzzword on a slide deck, but as the engine that makes
          everything faster.
        </p>
      </section>

      {/* The Problem */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">The problem with traditional consultancies</h2>
        <p className="text-lg leading-relaxed mb-4">
          Traditional consultancies added &ldquo;AI&rdquo; to their website and kept billing by
          the hour. They sell time, not outcomes. When AI makes their team faster,
          they pocket the difference and charge you the same.
        </p>
        <p className="text-lg leading-relaxed">
          That&apos;s the difference between painting flames on a horse-drawn carriage
          and actually building a racing car.
        </p>
      </section>

      {/* Comparison */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">Us vs. them</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 pr-4"></th>
                <th className="py-3 pr-4 text-gray-400 font-normal">Traditional Consultancy</th>
                <th className="py-3 font-normal">Performance Dudes</th>
              </tr>
            </thead>
            <tbody className="text-base">
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">Timeline</td>
                <td className="py-3 pr-4 text-gray-400">6–24 months</td>
                <td className="py-3">6 weeks</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">Pricing</td>
                <td className="py-3 pr-4 text-gray-400">T&M — they win when it takes longer</td>
                <td className="py-3">Fixed price — we win when we&apos;re fast</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">Team</td>
                <td className="py-3 pr-4 text-gray-400">5 juniors, 1 senior on calls</td>
                <td className="py-3">Small senior team. Everyone ships.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">When they leave</td>
                <td className="py-3 pr-4 text-gray-400">Knowledge walks out the door</td>
                <td className="py-3">AI-ready codebase. Your team continues.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">AI usage</td>
                <td className="py-3 pr-4 text-gray-400">Copilot in the IDE, same old process</td>
                <td className="py-3">AI-native from architecture to delivery</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* What We Do */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-8">What we do</h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold mb-2">Build</h3>
            <p className="text-lg leading-relaxed">
              You have an idea. We make it real. Fixed price, fast, and when we&apos;re
              done your team can take it from here — because the codebase is AI-ready
              and your developers trained alongside us.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Replace Your SaaS</h3>
            <p className="text-lg leading-relaxed">
              You&apos;re paying for software you use 20% of. We build a custom tool that
              fits exactly, in weeks. You own it. No per-seat pricing. No vendor
              lock-in. The subscription pays for the build, then it&apos;s free forever.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Performance Audit</h3>
            <p className="text-lg leading-relaxed">
              Not sure where to start? We inspect your project like a mechanic before
              a race. &ldquo;Here&apos;s why you&apos;re slow. Here&apos;s what we&apos;d fix. Here&apos;s what it
              would cost.&rdquo; One to two weeks, fixed price, no commitment beyond that.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Team Upgrade</h3>
            <p className="text-lg leading-relaxed">
              Your team is good but slow. We don&apos;t replace them — we upgrade their
              setup: AI tooling, workflows, codebase structure, engineering practices.
              Same people, 3–5x faster.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Autopilot for the Boring Stuff</h3>
            <p className="text-lg leading-relaxed">
              Library updates. Missing tests. Stale docs. Security patches. Nobody
              wants to do it, but it has to get done. We make your codebase AI-ready,
              then the chores handle themselves. Your developers go back to what they
              love: building features.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Race Strategy</h3>
            <p className="text-lg leading-relaxed">
              You have 10 ideas. We tell you which 3 actually move the needle — and in
              what order. Then we build them.
            </p>
          </div>
        </div>
      </section>

      {/* The Racing Car */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-6">The racing car</h2>
        <p className="text-lg leading-relaxed mb-6">
          We&apos;re the pit crew. Not the driver — that&apos;s you. We get in, do the job,
          and get out. The car runs better than before we touched it. And you don&apos;t
          need us to drive the next lap.
        </p>
        <pre className="font-mono text-base leading-relaxed text-gray-600">
{`The Car       = your AI-ready codebase
The Pit Crew  = us
The Driver    = your team
The Fuel      = AI

A great car makes any driver fast.
An AI-ready codebase makes any developer productive.`}
        </pre>
      </section>

      {/* How We're Different */}
      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-8">How we&apos;re different</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-1">We share the AI advantage</h3>
            <p className="text-base leading-relaxed text-gray-600">
              When AI makes us faster, we don&apos;t pocket the difference and bill the
              same hours. We charge less than traditional consultancies and deliver
              faster. Both sides benefit.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">We make you independent</h3>
            <p className="text-base leading-relaxed text-gray-600">
              Most consultancies create dependency by design — knowledge stays in
              their heads so you have to keep paying. We encode knowledge in the
              codebase. After we leave, AI tools can explain every decision to your
              team.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">We&apos;re honest about AI</h3>
            <p className="text-base leading-relaxed text-gray-600">
              It makes us fast, not magic. Senior engineers still make the decisions.
              AI generates, humans judge. We won&apos;t tell you everything can be
              automated — we&apos;ll tell you what can and what can&apos;t.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">We eat our own cooking</h3>
            <p className="text-base leading-relaxed text-gray-600">
              Fixed price means we absorb our own inefficiency. If we&apos;re slow, we
              lose money. If we&apos;re fast, we earn margin. That&apos;s the kind of
              incentive alignment you want from people building your software.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 pt-8 text-gray-400 text-sm">
        Performance Dudes. We get things done.
      </footer>
    </main>
  );
}
