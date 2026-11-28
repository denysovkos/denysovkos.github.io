---
title: I let six AI personas argue about a stock
seoTitle: Six AI investor personas debate a stock: how Parley works
description: Parley is a local-first terminal app where six AI investor personas debate a stock. Why debate beats one answer, and why it is for learning only.
slug: i-let-six-ai-personas-argue-about-a-stock
date: 2026-12-15
tags: Side projects, AI, Open source
keywords: AI stock debate, multi-agent debate, local-first app, terminal app, AI investor personas, Parley, LLM disagreement
ogTitle: I let six AI personas argue about a stock
ogKicker: Parley, a local-first terminal app
---

Ask one AI model "is this stock a buy?" and you get one calm, confident answer. It reads well. It sounds like it knows. That is the problem.

A confident answer hides the doubt. So I built [Parley](https://parley.trading), an open-source terminal app. You type `parley debate $TICKER`. Six AI investor personas argue about the stock, and you read the whole argument, and not just the result.

## One answer is a weak tool

When a person asks a model for advice, the model picks one view and defends it. The text is smooth. You cannot see what it left out.

I wanted the opposite. I wanted to see the case for buying, the case for selling, and the case for doing nothing, side by side. Real investors disagree all the time. A tool that hides this disagreement teaches the wrong lesson.

There is some research behind the idea. A 2023 paper, [Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325), tested several model instances that argue over answers for a few rounds. The authors report better reasoning and fewer false facts than with a single answer. This paper does not prove that Parley works. It is a different task. But it matches what I felt when I used the tool.

## How a debate works

Each of the six personas looks at the stock from its own angle, the way a different type of investor would. Each one gives a view, BUY, SELL or HOLD, and a confidence number.

Then the app combines them into one verdict. The app weights the verdict by confidence. A persona that says BUY with 0.72 counts for more than a persona that says HOLD with 0.54.

Here is the part I care about most. The app shows dissent. If one persona says SELL while four others say BUY or HOLD, you see that SELL, with its reasons. The average does not erase it.

I think this is the honest way to show a score. A single number looks precise. The spread behind it tells you how much to trust it.

<!-- AUTHOR: add a real example of a debate where one persona's dissent changed how you saw a stock, or a case where the personas were clearly wrong. Name the ticker only if you are happy to make it public. -->

## Why it runs on your machine

Parley is local-first. It runs in your terminal, and your list of stocks stays with you. I did not want an account, a server, or a feed of what people look at.

A watchlist says a lot about a person. I treat it as private data, and the simplest way to protect it is to not collect it. This is the same rule I use for my other projects. Privacy is a product decision that comes first, not a feature you add later.

I use the terminal for a plain reason. It is fast, it works with the keyboard, and it keeps the screen free of charts that look like advice. I explain more about how I choose tools for side projects in [this earlier post](/blog/building-a-side-project-with-ai/).

## Why it is for learning only

Parley is educational. It does not give financial advice. I want to be very clear about this, and the app says it too.

Language models do not know the future. They can be wrong with great confidence. Six wrong personas that agree are still wrong, only louder. A confidence number from a model is not a probability that you can bet on.

So I use the tool to ask better questions. Why does one persona fear this company? What would have to be true for the bull case to work? Then I go and read the company filings myself. If you use Parley, do the same.

<!-- AUTHOR: add one honest limit you found while building it, for example a time the verdict looked too neat or the personas copied each other. -->

I am not sure the debate format is the best one. It costs more model calls than a single answer, and the personas can drift toward the same opinion. This is a real weakness, and I keep testing it.

If you try Parley and it breaks, or the debate is dull, tell me. You can reach me [here](/#contact).
