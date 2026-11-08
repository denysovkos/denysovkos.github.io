---
title: How I build side projects with AI: 7 rules that work
seoTitle: How to build a side project with AI: 7 practical rules
description: How I build real side projects with AI coding tools, and what I recommend. Keep the scope small, write the spec first, test everything, and stay the engineer.
slug: building-a-side-project-with-ai
date: 2026-11-08
tags: AI, Side projects, Engineering
keywords: build side project with AI, AI coding tools, AI pair programming, side project tips, shipping side projects, Migraine.Club
ogTitle: Building a side project with AI
ogKicker: 7 rules that work
---

I build side projects with AI tools. Three of them are live now: [Migraine.Club](https://www.migraine.club), a migraine diary that makes summaries for doctors, [Parley](https://parley.trading), a terminal app where AI investor personas debate a stock, and [Claude Life OS](https://github.com/denysovkos/claude-life-os), a Claude skill for personal paperwork.

AI did not build these projects for me. It changed how I build them. Some things got much faster. Some things I now do more carefully than before.

Here are the seven rules that I follow. Each rule has what I do, and what I recommend to you.

## 1. Start with a problem, not with a tool

I never start with "I want to build something with AI". I start with a problem that I, or people near me, have.

Migraine.Club started with one question. How can a person show their doctor clear data about their migraines? Every feature answers that question: the one-tap log, the doctor summary, and the dim mode for bad days.

My recommendation: write your problem in one sentence before you open any tool. When the problem is clear, the AI gets clear instructions. When the problem is not clear, the AI writes a lot of code that nobody needs.

## 2. Write the spec before the prompt

AI is fast. A bad plan also becomes code fast.

Now I write a short spec before I ask for code. It is one page or less. It has four parts:

- who the user is, and what their problem is,
- what the feature must do,
- what the feature must not do,
- how I will know that it works.

Then I give the spec to the AI. The result is much better. And I have something to check the result against.

My recommendation: keep the specs in the repository, next to the code. The next prompt can use them too.

## 3. Keep each task small

I give the AI one small task at a time. "Add a button that exports the last 30 days as a PDF" is a good task. "Build the reports module" is not a good task.

Small tasks give small diffs. I can read a small diff in two minutes. Nobody really reads a diff with 2,000 lines. That is how bugs get into production.

My recommendation: if you cannot describe the task in two sentences, split it. Release engineering taught me the same rule. Small changes are safe changes.

## 4. You are still the engineer

The AI writes the code. I own the code.

I read every diff. I run it. I ask "why?" when something looks strange. If I cannot explain a piece of code, I do not merge it.

AI sounds very sure, also when it is wrong. It can use an API that does not exist. It can remove a check "to make the code simpler".

My recommendation: review AI code like code from a new colleague. Be friendly, but check everything. You are the last check before your users.

## 5. Let the tests decide

For me, tests are the best way to agree with an AI about what "correct" means.

I ask for the tests first, or together with the code. Then I run them. When a test fails, I give the error output back to the AI. This loop is fast and honest. A test does not care how sure the answer sounds.

This is very important in Migraine.Club. The app shows scores like HIT-6 and MIDAS. A wrong score is worse than no score.

My recommendation: everything that calculates or stores data needs tests with known inputs and known results, before real people see it.

## 6. Make the hard decisions yourself

Some decisions are not for the AI: privacy, security, the data model, and what the product promises to its users.

Migraine.Club is privacy-first. I made that decision on day one, and it shaped everything after it. Parley is local-first for a similar reason. A tool does not know what your users trust you with.

My recommendation: write these decisions in your spec as rules. Then the AI follows them, and you can see quickly when it does not.

## 7. Ship early, then make it better

A side project that is not online helps nobody. I put a first version live as soon as it does one thing well.

Real users show you what is important. Usually it is not what you expected. Parley is a terminal app. It does not need a website to be useful.

My recommendation: pick the smallest form that works. A small web app or a command-line tool is enough for version one.

## What AI changed for me

Before AI tools, my side projects often stopped in the boring middle part. Forms, settings pages, configuration, glue code. Now that part takes evenings, not weeks.

So my time goes to the parts that matter: the problem, the decisions and the review.

I think of AI as a very fast junior colleague. I give it clear tasks. I check its work. I keep the responsibility.

## My checklist

- One problem, in one sentence.
- A one-page spec before the first prompt.
- One small task per prompt.
- Read and run every diff.
- Tests for everything that calculates or stores data.
- Privacy and security decisions made by you.
- A live first version, as early as possible.

Do you build something with AI in your free time? [Tell me about it](/#contact). I read every message.
