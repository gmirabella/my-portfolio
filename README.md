# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Testing

This project includes a comprehensive Playwright test suite for end-to-end testing. To run the tests:

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run tests
npm test

# Run tests with UI mode
npm run test:ui

# Run tests in headed mode
npm run test:headed
```

See [tests/README.md](tests/README.md) for more information about the test suite.
