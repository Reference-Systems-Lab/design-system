# Agent instructions: design-system

The design system supplies the components, tokens, documentation and shared tooling for every
frontend. Read the root [`AGENTS.md`](../AGENTS.md) as well; this file wins where the two conflict.

## Boundaries

- No business logic, no API calls and no application-specific components. If only one application
  needs something, it probably belongs in that application.
- Styling flows from tokens. Components never hard-code values that a token covers.

## Rules

- Accessibility is a requirement, not a polish step.
- Packages are versioned. A breaking change gets a major version and says so.
- Every component is documented.
