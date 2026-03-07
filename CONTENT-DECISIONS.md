# Website Content Decisions

## Source alignment

All website content must align with the brand and strategy documents in the `orga` repo:

| Website section | Aligned to | Key takeaway |
|---|---|---|
| Hero | `docs/mission.md` | "We accelerate software development through AI" — for clients AND teams |
| Racing car | `brand/racing-car-analogy.md` | The analogy is our brand hook, but the message is empowerment, not just speed |
| Values | `docs/principles.md` | Honest, transparent, knowledge belongs in the project, help others adopt |
| What we do | `docs/mission.md` + `strategy/offering-model.md` | Three pillars: make AI-ready, build AI-native, help teams adopt |
| How it works | `docs/how-we-work.md` | Collective of senior freelancers, iterate fast, adapt tooling to client |
| AI-ready | `docs/ai-ready.md` | Core concept. Not a buzzword — a measurable project state |

## Audience

The website speaks to two readers simultaneously:

1. **CEO / business leader** — cares about budget, speed, risk, independence from vendors
2. **IT lead / engineering manager** — cares about maintainability, team productivity, AI adoption, no lock-in

Both need to feel: "These people are honest, competent, and won't waste my time."

## Content principles

### Speak about us, not against others
- No competitor bashing. No "us vs them" tables.
- Show what we believe and how we work. The contrast is implicit.

### CEO-readable first, technical second
- Top of page: business language (speed, cost, independence, risk)
- Further down: more specific (AI-ready, codebases, engineering practices)
- A CEO should understand the first 3 sections without any technical background

### Broader than software development
- Mission includes dev, ops, devops, security, and non-IT teams
- "AI adoption" is the umbrella — software delivery is our strongest lane but not the only one
- Language should say "teams" not just "developers" where appropriate

### Trust through honesty, not claims
- No vanity metrics we can't back up
- "AI generates, humans judge" — this is our honest position
- We say what AI can't do, not just what it can
- Principles doc says "Professional on the outside, fun on the inside" — the website should feel confident and warm, not corporate

### Show the customer journey
- A convinced reader needs to know: "What happens if I say yes?"
- Low-friction entry: conversation, not a sales process

### Social proof builds over time
- For now: team experience and background, honest about being early
- As we grow: case studies, logos, specific numbers
- Never fabricate or exaggerate

## Section structure (current)

```
1. Hero              — one line: who we are and what we do
2. Racing car        — the analogy, the emotional hook
3. We believe        — values from principles.md, trust-building
4. What we do        — products, accessible language
5. How it works      — customer journey: say yes → what happens
6. Who we are        — team, experience, credibility
7. Let's talk        — CTA
```

## Decisions log

### Hero
- **Decision:** Lead with mission, not pricing.
- **Why:** Pricing ("6 weeks, 3 months") is a sales argument, not an identity. The hero should say who we are.
- **Aligned to:** mission.md — "We accelerate software development through AI"
- **Extended:** Added "for teams across engineering, operations, and beyond" to signal broader scope per user request.

### Racing car analogy
- **Decision:** Keep as the second section. It's the emotional hook.
- **Why:** It's memorable, it explains the relationship (pit crew / driver), and it sets the tone.
- **Change:** Engine = AI (was "Fuel" in earlier versions). Engine is more central, more powerful.
- **Aligned to:** brand/racing-car-analogy.md

### Removed "Us vs them" comparison table
- **Decision:** Replaced with "We believe" values section.
- **Why:** Talking about competitors is defensive. Talking about values is confident. The contrast is implied — a reader who's been burned by consultancies will recognize what we're offering without us naming the problem.
- **Aligned to:** principles.md — speed over ceremony, knowledge in the project, help others adopt

### Products
- **Decision:** Keep all 6, but reframe for mixed audience.
- **Changes:**
  - "Replace Your SaaS" → "Build what fits" — less aggressive, same idea
  - "Autopilot for the Boring Stuff" → clearer for non-dev audience
  - "Team Upgrade" — broadened beyond dev teams
  - All descriptions avoid jargon where possible
- **Aligned to:** strategy/offering-model.md product lines

### Added "How it works"
- **Decision:** New section showing customer journey.
- **Why:** A CEO who's convinced needs to know next steps. Removing friction = more conversations.
- **Aligned to:** how-we-work.md — "deliver, learn, improve, repeat"

### Added "Who we are"
- **Decision:** New section for credibility.
- **Why:** Zero social proof = zero trust. Even founding team background helps.
- **Aligned to:** how-we-work.md — "collective of freelance developers and consultants"

### Added CTA
- **Decision:** End with a simple "Let's talk" + contact.
- **Why:** Every page needs a next step. Ours is a conversation, not a form.

### Removed "How we're different"
- **Decision:** Folded the best points into "We believe" section.
- **Why:** "How we're different" is still comparative framing. Values stand on their own.

## Future considerations

- **Case studies:** As we complete engagements, add real examples with permission. Numbers, timelines, outcomes. This is the strongest trust signal.
- **Blog / thinking:** Thought leadership from principles.md ("Innovation as a Habit"). Publish how we work, what we learn. Builds SEO and credibility.
- **Non-IT examples:** As we work with non-engineering teams, add those stories. Broadens the audience.
- **Pricing page:** Market research shows almost nobody publishes prices. Could be a differentiator — radical transparency. Decide after first engagements establish price anchors.
- **Testimonials:** Collect from day one. Even informal quotes from early clients.
- **Multi-language:** German market is primary. Consider DE version when content stabilizes.
- **Visual identity:** Content-first approach is deliberate. Brand design comes after the message is right. Don't let design drive content.
