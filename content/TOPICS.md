# Topic pool

The weekly writer takes the first `queued` topic from the queue, unless a rule below says to skip it. After it writes the post, it changes the status to `in PR` with the date and slug. When the post is live, change it to `published`.

Rules for the writer:

- Rotate pillars. Do not use the same pillar two weeks in a row.
- Skip a topic marked `needs notes` if `content/NOTES.md` does not have the facts it needs. Take the next one.
- Never mention the current employer. Talk about the role in general.
- Add new ideas at the bottom of the queue. Keep at least 8 topics `queued`.

## Pillars

| Code | Pillar | Who reads it |
| --- | --- | --- |
| SHIP | Shipping software: releases, CI/CD, migrations, incidents | Engineers, tech leads |
| POV | Point of view: problems in our industry and where it goes next | Engineers, managers, founders |
| HEALTH | Migraine and health tech: living with it, measuring it, building for it | Patients, health-tech people, a wide audience |
| BUILD | Side projects and AI tools: what I built and what I learned | Makers, indie developers |
| CAREER | Ten years in engineering: growth, mentoring, working in Berlin | Juniors, mid-level engineers, career switchers |

## Queue

| # | Status | Pillar | Working title | Angle | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | published 2026-11-08 | BUILD | How I build side projects with AI: 7 rules that work | Rules from three live projects | `building-a-side-project-with-ai` |
| 2 | queued | SHIP | Boring deploys are the goal | Why a good release is a non-event. Small batches, automation, fast rollback. What "boring" looks like on a dashboard. | |
| 3 | queued | HEALTH | HIT-6, MIDAS, MSQ-21: what your neurologist asks, in plain words | Explain the three questionnaires, what each measures, why a diary makes them honest. Link primary sources. Not medical advice. | |
| 4 | queued | POV | Who learns to code when AI writes the code? | The junior developer problem. What teams lose when nobody struggles with the basics, and what tech leads can do about it. | |
| 5 | queued | SHIP | Database migrations without downtime, explained simply | Expand and contract in four steps, with one small SQL example. The mistakes that cause outages. | |
| 6 | queued | BUILD | I let six AI personas argue about a stock | How Parley works, why debate beats one answer, why it is educational only, what local-first means here. | |
| 7 | queued | CAREER | From fullstack developer to tech lead: what I would tell myself ten years ago | Five honest lessons. What mattered less than I thought. | needs notes: 2 to 3 real moments |
| 8 | queued | POV | Code review when half the code is AI-written | What changes for the reviewer. Review intent, not syntax. Smaller PRs, stronger tests. | |
| 9 | queued | HEALTH | Health data is not ad data | Why a migraine diary must be privacy-first. What "privacy-first" means in practice, in plain words. | |
| 10 | queued | SHIP | Blameless incident reviews: find causes, not people | How to run one, the questions that work, how lessons become real changes. | |
| 11 | queued | BUILD | Claude, Gmail and German paperwork | Why I built Claude Life OS. Letters, deadlines, Kündigungsfristen. Paperwork as a systems problem. | |
| 12 | queued | POV | Can AI decide if a deploy is safe? | AI risk-scoring for releases in general terms. What signals work, where it fails, why a human stays in the loop. No employer details. | |
| 13 | queued | HEALTH | Designing an app for people on their worst day | Dim mode, one-tap logging, no forms during an attack. Design for low energy and light sensitivity. | |
| 14 | queued | SHIP | Feature flags are debt with interest | Flags help, old flags hurt. A simple rule for flag lifetime and cleanup. | |
| 15 | queued | CAREER | What a finance degree taught me about engineering | Trade-offs, cost, risk. How an MSc in Finance changes how I see technical decisions. | needs notes: a real example |
| 16 | queued | POV | Internal tools are products. Most teams forget this | Why internal tools fail: no owner, no users talked to, no roadmap. How to treat developers as customers. | |
| 17 | queued | HEALTH | Medication overuse headache: why counting days matters | General explanation with links to IHS and NHS. How a diary makes the pattern visible. Not medical advice. | |
| 18 | queued | SHIP | Moving from the cloud to bare metal: when it makes sense | When the move pays off, what you lose, what to measure first. Based on a real migration, no company details. | |
| 19 | queued | BUILD | Local-first apps: keep the data on the user's device | What local-first means, why I like it for Parley, the trade-offs. | |
| 20 | queued | POV | The release engineer of 2030 | A prediction. Less manual sign-off, more policy and judgement. What skills to build now. | |
| 21 | queued | CAREER | Four languages at work: what it changes | Ukrainian, English, German, Russian. Clear writing beats perfect grammar. Why simple English matters in global teams. | needs notes: real moments |
| 22 | queued | SHIP | A 1000x faster query and what was wrong before | The usual reasons for slow queries, how to find them, how to keep them fast. | needs notes: what the fix was |
| 23 | queued | HEALTH | Why I built a migraine diary | The personal reason behind Migraine.Club. | needs notes: the real reason, only if you want it public |
| 24 | queued | POV | Testing culture is a team habit, not a tool | How a team got about 60% fewer production bugs. Habits, not frameworks. | needs notes: what changed in the team |
