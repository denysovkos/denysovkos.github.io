---
title: Code review when half the code is AI-written
seoTitle: Code review for AI-written code: review the intent
description: AI-written diffs look clean and pass the tests, so syntax review finds little. How I review intent instead, with one small example of a bug that hides well.
slug: code-review-when-half-the-code-is-ai-written
date: 2026-12-08
tags: Code review, AI, Engineering
keywords: code review AI-generated code, reviewing AI code, AI pull requests, code review checklist, small pull requests, tests first
ogTitle: Code review when half the code is AI-written
ogKicker: Review the intent, not the syntax
---

AI-written code rarely has typos. The names are good, the formatting is clean, and the tests pass. So the old review comments, like "rename this" or "add a semicolon here", mostly disappear.

The bugs do not disappear. They move to places that a quick read does not reach. Here is one small pull request that shows the problem, and the review order I think works better.

## A pull request that looks fine

This is a made-up example, but I think the pattern is common. A developer asks an AI tool to "make the refund check simpler". Here is the function before the change.

```js
const DAY = 86_400_000 // one day in milliseconds

function canRefund(order, now = Date.now()) {
  if (order.status !== 'paid') return false
  const days = (now - order.paidAt) / DAY
  return days <= 30
}
```

And here is the function after the change.

```js
const DAY = 86_400_000 // one day in milliseconds

const canRefund = (order, now = Date.now()) =>
  now - order.paidAt <= 30 * DAY
```

The new version is shorter. It is easier to read. The tests for the 30-day window still pass. The pull request description says "Simplify the refund check, no change in behaviour".

But the status check is gone. An order that is already refunded now passes the check again. Nobody typed a bug. The tool removed a line that looked like noise to it.

A reviewer who reads for style approves this in ten seconds. I think that is the real risk with AI code. It looks like code from a careful senior engineer, so we review it with less care.

## Start from the intent, not from the diff

So change the order in which you read a pull request. Read the description and the linked task first. Ask one question. What must be true after this change that was not true before?

Only then open the diff, and compare it with that sentence. Does the code do what the description says? Does it do anything else?

The refund example fails this test at once. "No change in behaviour" is a claim. The diff changes behaviour for one kind of order. The question is not "is this code good?" The question is "is this code honest about what it does?"

The [Google code review guide](https://google.github.io/eng-practices/review/reviewer/looking-for.html) puts the design of a change first, before the details. I agree with that order, and I think AI makes it more important. The details are now the part that a machine already polished.

## Read the tests before the code

Next, read the tests. I think tests are the honest way to agree on what "correct" means. With AI code, they are also the fastest way to see what the author really checked.

In the refund example, all the tests are about dates. No test checks that a refunded order stays refunded. So the deleted line had no protection. The tool did not break a test. It found the gap between the tests.

So look for the test that is missing. A failing test is easy to see. Ask for one test for each rule that matters to the business. A rule with no test is a rule that the next prompt can delete.

## Look hard at what was deleted

Then read the red lines more slowly than the green lines.

AI tools like to "clean up". They remove checks that look extra, merge two branches of an if, or drop an error case that seems impossible. Each change can be fine. Each change can also remove a rule that somebody added after an incident.

For every deleted condition, ask "why was this here?" If nobody knows, `git blame` usually does. It shows who added the line and in which commit. Five minutes there is cheaper than a bad night.

<!-- AUTHOR: add one real moment (no company, no names) when a review caught a deleted check or a "simplification" that changed behaviour, if you have one. -->

## Small pull requests matter more now

The last point is not new, but AI makes it urgent. AI tools write a lot of code fast. A developer can open a pull request with 1,500 lines before lunch.

Nobody reviews 1,500 lines well. People scroll, they trust the green tests, and they approve. I believe small changes are safe changes, in deploys and in reviews. A small diff is one that a tired person can still check properly.

The [2025 DORA report](https://dora.dev/dora-report-2025/) describes AI as an amplifier. It makes strong teams stronger and weak processes weaker. Review is one of those processes. If your team already approves big pull requests without reading them, AI will give you more of them.

So ask for one intent per pull request. A refactor and a feature go in separate pull requests. "Simplify" never hides inside "add".

## The reviewer keeps the responsibility

I call AI a very fast junior colleague. It writes clean code, and it does not understand why your rules exist. Somebody on the team must understand that, and in a pull request that person is the reviewer.

This changes what a good review comment is. "Nice refactor" helps nobody. "This removes the status check, was that on purpose?" can save a weekend.

I wrote about the same idea from the author's side in [how I build side projects with AI](/blog/building-a-side-project-with-ai/). If you review a lot of AI-written code, what do you look at first? [Tell me](/#contact).
