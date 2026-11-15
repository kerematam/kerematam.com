---
title: "Bug Chronicles #2: how I caused hundreds of double payments"
description: A story from five years ago. A fix to error handling in a payment UI caused a wave of double payments, because the client relied on the old behaviour, not on what the documentation said.
pubDatetime: 2025-08-31T20:06:00+03:00
timezone: Europe/Istanbul
tags:
  - debugging
  - payments
---

How I caused hundreds of double payments at one of our clients (among the top 3 online bookstores in Turkiye). This one is from 5 years ago.

## TLDR, the moral of the story

- Don't touch it if it works.
- Don't trust old documentation.
- If company loses its entire team because it can't compete on salary it provides, it will end up paying with unstable product and unhappy customers in the long run.

## What happened

I was given the task of improving observability in our product, which drove me into the deep and dark corners of our payment UI that was embedded inside our client's apps.

While digging through the code, I noticed the documentation and realized that error handling was not implemented as the docs suggested. According to the documentation, we were supposed to return a payment status in our payment hook. Instead, our APIs were throwing errors.

As a "responsible developer" I am, I did what I had to do: I fixed it. I wrapped up the development with improved observability and proper error handling.

Since this was a critical change, I scheduled a meeting with the whole team to review my code. We went through every line. But there was one catch: the entire team was new. Literally, every member of the previous UI team had left the company recently (including the person who originally wrote the docs).

The code was deployed, and I monitored the logs for a while. Everything seemed fine... until next Monday morning. I opened Slack to find a flood of mentions.

Apparently, the last code deployment with my changes had caused a wave of double payments. Thankfully, our head of integration (not sure of his exact title, something like that) quickly detected the issue, rolled back the code (we had solid infra support), and used his good client relations to calm things down before it turned into a bigger mess. He was the hero of the day (maybe week).

## So what was the real problem?

The code had never worked as documented. Our client was actually relying on the errors thrown by our code instead of the payment status values that the documentation described. So my "fix" actually broke their flow.

This post started as [a thread on X](https://x.com/kerematam/status/1962200323184841111).
