# design-system

The shared visual language of the platform, and one of its flagship pieces. It holds the components,
design tokens, documentation and shared frontend tooling, published as versioned packages that every
frontend uses.

## Responsibilities

- Reusable, accessible UI components
- Design tokens for color, typography, spacing, elevation and border radius, plus themes (including
  dark mode) and responsive behavior
- Accessibility standards
- The documentation site at `docs.rsl-commerce.test`
- A playground where you change the tokens (primary and secondary color, border radius, spacing
  scale, typography, dark mode) and watch the components update live
- Shared lint, formatting, stylesheet and TypeScript configuration for the other repositories
- Publishing the packages and the documentation site

## Does not own

- Application screens or business logic. The applications compose components into pages.
- Data fetching or any knowledge of the API.

## Works with

- **storefront, admin and checkout.** They consume its packages.
- **platform.** It serves the documentation site locally.

## Git hooks

Run `.githooks/setup` once after cloning. It turns on the committed hooks, which use
[git-secrets](https://github.com/awslabs/git-secrets#installing-git-secrets) to refuse any commit
that contains a secret.

## Status

Planning. No code yet.

## License

[MIT](LICENSE)
