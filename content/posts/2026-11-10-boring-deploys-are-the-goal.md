---
title: Boring deploys are the goal
seoTitle: Boring deploys are the goal: how to ship safely
description: A good release is a non-event. Here is how small batches, automation and fast rollback make deploys boring, and what that looks like on a dashboard.
slug: boring-deploys-are-the-goal
date: 2026-11-10
tags: Release engineering, CI/CD, Engineering
keywords: boring deploys, safe deployments, small batches, fast rollback, release engineering, CI/CD, deployment frequency
ogTitle: Boring deploys are the goal
ogKicker: A good release is a non-event
---

If your release is exciting, something is wrong. Nobody should clap when a deploy ends. Nobody should hold their breath while it runs.

I work in release engineering. My job is to make releases dull. I think this is the best compliment a deploy can get: "Did that already go out?"

## Why big releases hurt

A big release collects many changes. Each change is small and safe on its own. Together they are a pile that nobody can hold in their head.

When the pile breaks something, the question is "which change did it?" That question is slow to answer. You have a long diff, many authors, and a clock that runs while users wait.

[Martin Fowler](https://martinfowler.com/bliki/FrequencyReducesDifficulty.html) has a short note on this: when something is painful, do it more often. Pain pushes the team to make the step easier. Rare releases make the pain bigger and the habit weaker.

I have seen teams react to a bad release with more sign-offs and more meetings. I understand why. But I don't think it works. A manual sign-off asks a person to judge a huge change in an hour. That person cannot do it well. The ritual only moves the blame.

<!-- AUTHOR: add one real moment from a big, manually signed-off release (no company or people names): what went wrong, how long it took to find the cause. -->

## Small batches do most of the work

The best tool I know is also the simplest. Ship less per deploy.

A deploy with one small change has a short list of suspects. If it fails, the cause is almost always that change. You find it in minutes, not hours. You also revert a small change with little fear.

This is why I say small changes are safe changes. It is not a slogan for me. It is how I decide where to spend time. I would rather make deploys cheap than make reviews longer.

Small batches ask for a few habits in the team:

- Merge to the main branch often, in small pieces.
- Keep unfinished work behind a switch, so it can ship but stay off.
- Never let a change wait for a "release day".

## Automate the steps you fear

Pick the step in your release that makes people nervous. Often it is the step a person does by hand, from memory, once a week. Automate that step first.

A script does not forget the third item on the checklist. It does the same thing at 10:00 on Tuesday and at 17:45 on Friday. That is what I want from a release. The same result, every time.

Automation also makes the process visible. You can read it, review it and improve it. A hand-made process lives in one person's head, and that person goes on holiday.

I am not saying "remove all humans". People still decide what to ship and when to stop. But a person should not be the part that carries the steps. A person should be the part that checks the result.

## Make rollback the easy path

Every deploy needs a way back that is faster than the way forward.

The [Google SRE book](https://sre.google/sre-book/release-engineering/) describes release engineering as a discipline of its own. One idea there matches my own view: releases should be repeatable and automated, so that nobody depends on one person's tricks.

Rollback puts this idea to the test. If going back means a long meeting, people will wait and hope. If going back means one command, people will use it early. Early rollback is cheap. Late rollback is a bad day.

Before any release I ask one question. "How do we undo this, and how long does it take?" If the answer is vague, the release is not ready. Database changes are the hard case here, because a schema change does not always revert as easily as code. I plan those in steps, and I will write about that in a later post.

## What boring looks like on a dashboard

A boring deploy has a clear signature in the data. The [DORA research](https://dora.dev/guides/dora-metrics-four-keys/) names four measures. How often you deploy. How long a change takes to reach production. How often a deploy fails. How fast you recover.

I look at them as a group. If I only watch speed, I may push teams to rush. If I only watch failures, I may push them to stop deploying. The healthy picture has many small deploys, a short wait from commit to production, few failures, and short recovery.

On a good day, the dashboard is flat and quiet. The deploy count goes up in small steps. The error line stays where it was. Nobody opens a channel for an incident.

That flat line is the goal. It looks like nothing happened. A lot of work went into making nothing happen.

## The hard part is not technical

I will be honest. The tools are not the main problem. Most teams I know can set up a pipeline.

The hard part is trust. A manager who has seen a bad release will ask for a gate. A developer who got blamed once will batch changes "to be safe". Both choices are human, and both make releases riskier.

So I spend as much time on blameless incident reviews as on pipelines. If a failure leads to blame, people hide risk. If it leads to a fix in the process, people ship smaller things, more often.

<!-- AUTHOR: add one real example of a team that moved from big releases to frequent deploys, if you have one (numbers only if they are true and public). -->

What is the most boring deploy you remember? [Tell me](/#contact). I like those stories.
