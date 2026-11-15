---
title: Who learns to code when AI writes the code?
seoTitle: Junior developers and AI: who learns to code now?
description: AI writes the easy code that junior developers used to learn on. What teams lose when nobody struggles with the basics, and what tech leads can do.
slug: who-learns-to-code-when-ai-writes-the-code
date: 2026-11-24
tags: AI, Engineering, Mentoring
keywords: junior developers and AI, learning to code with AI, AI coding tools juniors, mentoring junior engineers, tech lead, developer skills
ogTitle: Who learns to code when AI writes the code?
ogKicker: The junior developer problem
---

Most of us learned to code on boring tickets. A form that did not validate. A query that was slow. A bug that only happened on Fridays. Today an AI tool closes most of those tickets in a minute.

That is good for the backlog. I am not sure it is good for the people who should learn from those tickets.

I lead release engineering and developer experience, and I mentor engineers. I also use AI tools every day. I call AI a very fast junior colleague. So here is the question that bothers me. If the fast junior colleague takes all the junior work, where do the next seniors come from?

## The easy tickets were the school

Nobody planned it this way, but the small tasks were the training. A junior developer got a simple bug. They read code they did not write. They added a log line, ran it, and were wrong twice. On the third try they understood the system a little better.

That slow loop built three things that I look for in a senior engineer. They can read unfamiliar code. They can debug without a guess. They know when a result looks wrong before a test tells them.

AI tools skip the loop. You describe the problem and get a fix that often works. You learn that the fix works. You do not learn why the bug was there.

## "Juniors will learn faster with AI"

This is the most common answer I hear, and I partly agree. A patient tool that explains any line of code is a great teacher. I wish I had one ten years ago.

But "can learn" and "does learn" are different things. In early 2026, Anthropic published [a small randomised study](https://www.anthropic.com/research/AI-assistance-coding-skills) with 52 mostly junior engineers. They learned a Python library that was new to them. One group had an AI assistant, and one group wrote the code by hand.

The AI group finished about two minutes faster, and that difference was not significant. On the quiz after the task, the AI group scored 50% and the hand-coding group scored 67%. The biggest gap was on debugging questions.

The detail I find most useful is in the same study. Some people in the AI group still scored well. They asked for explanations, or they asked only conceptual questions and fixed their own errors. The people who handed the whole task to the AI scored the lowest.

So the tool is not the problem. The way people use it is the problem. A junior under deadline pressure will usually take the fastest path. Most people would.

## "We will not need many juniors anyway"

The second answer is colder. AI writes the simple code, so teams hire fewer juniors. Some data points that way. A [Stanford paper by Brynjolfsson, Chandar and Chen](https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf) found that employment fell for young workers in jobs where AI can automate tasks. Software developers are in that group. The authors say the results are early and do not prove a cause.

I think this answer is wrong even if the hiring numbers are right. Every senior engineer was a junior first. A team that stops training juniors spends its seniors and does not replace them. The bill arrives years later, when nobody remembers why.

There is a second problem. The work does not get simpler for the seniors, because somebody must still review the AI output.

A [study from METR](https://arxiv.org/abs/2507.09089) gave experienced open-source developers real tasks in their own large projects. Before the study they expected AI to make them 24% faster. With AI, they were 19% slower. Reviewing and fixing the AI suggestions took much of the time.

Review is a senior skill. It needs exactly the judgement that the boring tickets used to build.

## What the struggle teaches

I want to be precise here. I do not think pain is good on its own. Nobody needs to write a CSV parser by hand to become a good engineer.

The useful struggle is smaller and more specific. It is the moment when you have a theory, you test it, and the result says you are wrong. That moment builds a mental model of the system. An AI fix that works on the first try removes that moment.

<!-- AUTHOR: add one real moment from mentoring (no names, no company): a junior who learned something because they struggled, or one who got stuck because AI did the work. -->

In release engineering I see the same pattern from the other side. Incidents happen in the space between what the code does and what people think it does. An engineer who never debugged by hand has a bigger space like that. I can't prove that with data. It is what I expect, and it worries me.

## What tech leads can do

Don't ban AI tools for juniors. That is silly, and they will use them anyway. Change what you ask for instead.

Ask juniors to explain each change in the pull request, in their own words. What was wrong, and why does this fix it? If the explanation is vague, talk before the merge. The code may be fine. The understanding is what you review.

Keep some tasks for learning. A small, real bug with no deadline is the best kind. The rule is simple. Find the cause first, then use any tool for the fix.

Ask for the tests before the code. I think tests are the honest way to agree on what "correct" means. A junior who writes the test first must understand the problem before the AI touches it. I use the same habit in [my own side projects with AI](/blog/building-a-side-project-with-ai/).

Pair with them on debugging. Not on features, on bugs. Watching how someone else forms a theory teaches more than a long document.

None of this is new. It is normal mentoring. The difference is that the work no longer teaches by default. Now somebody has to plan it.

If you are a junior developer, use AI to ask "why?" more often than "fix this". If you lead a team, who in your team is learning right now, and on which tasks? [Tell me how you do it](/#contact).
