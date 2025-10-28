# Playwright Test Suite

This directory contains end-to-end tests for the portfolio website using [Playwright](https://playwright.dev/).

## Test Coverage

The test suite covers:

- **Page Load**: Verifies the homepage loads correctly with proper title and header
- **Theme Toggle**: Tests day/night mode switching functionality
- **Project Display**: Ensures projects are displayed in a grid with proper elements
- **Media Interactions**: Tests clicking on project media (images/videos)
- **Footer**: Verifies footer content is present
- **Responsive Layout**: Tests different viewport sizes (mobile, tablet, desktop)
- **Accessibility**: Checks for proper ARIA labels and alt text on images
- **Video Elements**: Verifies video attributes (autoplay, loop, muted, etc.)

## Prerequisites

Before running the tests, you need to install Playwright browsers:

```bash
npx playwright install
```

Or install only Chromium (which is configured by default):

```bash
npx playwright install chromium
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

## Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the project.

Key configuration details:
- Tests are located in the `tests/` directory
- Base URL: `http://localhost:5173`
- Browser: Chromium (Desktop Chrome)
- The dev server starts automatically before tests run
- HTML reporter is enabled

## Writing New Tests

To add new tests, create a new `.spec.ts` file in the `tests/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('my new test', async ({ page }) => {
  await page.goto('/');
  // Your test code here
});
```

## CI/CD Integration

The tests are configured to work in CI environments:
- Retries failed tests twice on CI
- Uses single worker on CI for stability
- Fails build if `test.only` is accidentally left in code

To run tests in CI, ensure the `CI` environment variable is set:

```bash
CI=true npm test
```
