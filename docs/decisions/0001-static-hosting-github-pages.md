# 0001. Host the app as a static site on GitHub Pages

- **Status:** Accepted
- **Date:** 2026-05-09
- **Deciders:** lordrequiem

## Context

We need a publicly reachable, low-cost, low-maintenance e-commerce sandbox whose only
purpose is to serve as a stable target for QA training and test automation. The
audience does not need real persistence, real authentication, or multi-user shared
state. Determinism and reproducibility matter far more than realism. The team already
uses Git and GitHub.

## Decision

We will build the app as a fully client-side static site (HTML/CSS/JS, no server-side
code) and host it on GitHub Pages, with all "fake account" and "fake order" state held
in the browser (localStorage via Zustand) and seeded from committed data.

## Consequences

- Positive: zero infrastructure to operate, free hosting, trivial deploys via a GitHub
  Action, and a deterministic environment that resets cleanly. This removes a whole
  class of test flakiness coming from a live backend.
- Positive: nothing sensitive can leak server-side because there is no server.
- Negative / trade-offs: no real shared persistence, no genuine auth, no server-side
  validation to demonstrate. If a future use case needs any of these, GitHub Pages will
  not suffice and we will need to migrate hosting (revisit with a new ADR).
- Follow-up: document the reset mechanism clearly so trainees and automated suites can
  return to a known state.

## Alternatives considered

- **A small backend (Node/serverless) + managed DB** — rejected: adds operational
  burden, cost, and non-determinism for no pedagogical gain at this stage.
- **A third-party demo shop (e.g. SauceDemo)** — rejected: we want a target we fully
  control, can brand, and can seed with our own intentional bugs.
