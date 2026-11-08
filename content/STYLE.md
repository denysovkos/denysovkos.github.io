# Writing style

Every post on denysov.me follows these rules. They are mandatory. `npm run lint:posts` checks the rules that a script can check. The rest is your job as the writer.

Two goals:

1. **Clear.** Follow ASD-STE100 (Simplified Technical English). A reader with B1 English must understand every sentence on the first read.
2. **Human.** It must read like one person wrote it from their own experience, with opinions, doubts and real details. It must not read like a generated article.

The two goals help each other. STE removes filler. Human voice removes the generic tone.

## Part 1. ASD-STE100 rules

| # | Rule | Limit |
| --- | --- | --- |
| 1 | One idea per sentence. | |
| 2 | Short sentences. | 20 words for instructions, 25 words for descriptions. Hard limit 25. |
| 3 | One topic per paragraph. | Max 6 sentences. Most paragraphs have 2 to 4. |
| 4 | Active voice. Name who does the action. | "I deleted the flag", not "The flag was deleted". |
| 5 | Simple tenses: present, simple past, simple future. | No "would have been", no "had been doing". |
| 6 | Instructions use the imperative. | "Write the spec first." |
| 7 | Keep articles and small words. | "Open the file", not "Open file". |
| 8 | No noun clusters longer than three words. | Not "release pipeline risk score threshold". Say "the threshold for the risk score". |
| 9 | One word, one meaning. Use the same word for the same thing in the whole post. | Do not switch between "deploy", "release" and "rollout" for the same action. |
| 10 | Common words. Prefer the short, concrete word. | "use" not "utilize", "help" not "facilitate", "start" not "commence". |
| 11 | Explain each technical term the first time you use it, in one short sentence. | |
| 12 | Lists for steps and checklists only, not for arguments. | |

## Part 2. Human voice rules

### Do

- **Write from experience.** Use "I" for what I did and saw. Use "you" for the reader. Every post has at least one concrete moment: a decision, a mistake, a number, a conversation, a bad day.
- **Use only true details.** Personal facts come from `content/NOTES.md` or from the public site. Never invent an anecdote, a number, a quote, a colleague or a result. If the post needs a story that is not in the notes, mark it: `<!-- AUTHOR: add a real example of X -->`, and say so in the PR.
- **Have an opinion.** Say what I think and why. Disagree with common advice when I really disagree.
- **Admit limits.** "I am not sure about this part." "This did not work for me." Real people have doubts.
- **Vary the rhythm.** Mix very short sentences with longer ones, inside the STE limit. A three-word sentence is fine. So is a fragment, sometimes.
- **Use plain contractions where they sound natural:** don't, I'm, it's, can't. Do not force them.
- **Start fast.** The first sentence is a fact, a scene or a claim. No warm-up.
- **End when the point is made.** The last paragraph can be one short line, or a question to the reader. No summary of what I just said.
- **Vary the structure between posts.** Not every post is "N rules". Use a story, an argument, a how-to, a teardown, a prediction, a letter to my younger self.

### Don't

These are the typical signs of generated text. Readers and detectors notice them.

- **No filler openers:** "In today's fast-paced world", "In the ever-evolving landscape of", "Have you ever wondered", "Let's dive in", "In this article, we will explore".
- **No filler closers:** "In conclusion", "To sum up", "At the end of the day", "The bottom line is", "Happy coding!".
- **No buzzwords:** delve, tapestry, landscape (unless it is about land), realm, navigate (unless it is about maps), leverage, utilize, robust, seamless, cutting-edge, game-changer, unlock, unleash, empower, elevate, harness, foster, paramount, pivotal, crucial, vital, myriad, plethora, embark, journey (for a project), testament, synergy, holistic, transformative, revolutionize, supercharge.
- **No hedging stack:** "It's important to note that", "It's worth mentioning", "Moreover", "Furthermore", "Additionally", "Notably", "Ultimately".
- **No "not only X, but also Y"** and no "It's not just X, it's Y" constructions.
- **No automatic groups of three.** Do not list three adjectives or three benefits by habit.
- **No em dashes (—) and no semicolons.** Use a full stop or a comma.
- **No bold in body text,** except a maximum of one or two key terms per post.
- **No rhetorical question in every section.**
- **No emoji** in the body.
- **No made-up statistics,** and no "studies show" without a link to the study.
- **No moral at the end of every section.** Let some sections just stop.
- **Do not mention my employer or employer projects.** Talk about the role and the experience in general ("at a large company", "in one team I worked with"), never the company name or its internal systems.

## Part 3. Facts and safety

- **Health topics** (migraine and others): general information only. Link to primary sources (WHO, IHS, NHS, peer-reviewed papers). Add one line: "This is not medical advice. Talk to your doctor." Never suggest doses or treatments.
- **Links:** link to the original source, not to a blog that repeats it. Two to six external links per post is normal.
- **Code:** every snippet must run or be clearly marked as pseudo-code.
- **People:** do not name colleagues, managers or companies in a negative story.

## Part 4. Shape of a post

- 700 to 1,200 words. Reading time 4 to 6 minutes.
- Title: specific, under 60 characters if possible, with the main search phrase near the start. No clickbait.
- `description`: 120 to 155 characters. It is the Google snippet. It says what the reader gets.
- 3 to 6 `##` sections. Headings say something ("Small diffs are honest diffs"), not just a label ("Introduction").
- One internal link to another post or project on the site where it fits.
- The last line can invite a reply: link to `/#contact`.

## Part 5. Self-check before the PR

1. `npm run lint:posts` passes.
2. Read the post aloud. Every sentence sounds like something I would say to a colleague over coffee.
3. Find the most generic paragraph. Rewrite it with a real detail, or delete it.
4. Check every personal claim against `content/NOTES.md`. List the claims that need my confirmation in the PR description.
5. Check that the structure is different from the last two posts.
