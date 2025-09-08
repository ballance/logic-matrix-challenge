# E2E Tests for Logic Matrix Challenge

Comprehensive end-to-end tests using Playwright to ensure all features work correctly.

## Test Coverage

### 1. Welcome Screen and Test Start (`welcome-and-start.spec.js`)
- Welcome screen display and content
- Starting the test
- Initial test screen setup
- Audio context initialization

### 2. Question Navigation (`question-navigation.spec.js`)
- Selecting answer options
- Navigating between questions
- Progress bar updates
- Timer functionality
- Level indicators
- Previous/Next button states

### 3. Pause/Resume Functionality (`pause-resume.spec.js`)
- Pause button visibility
- Pausing with button and spacebar
- Resuming with button, spacebar, Enter, and Escape
- Click-outside to resume
- Timer pause behavior
- State preservation during pause

### 4. Keyboard Navigation (`keyboard-navigation.spec.js`)
- Number keys (1-6) for option selection
- Arrow keys for option navigation
- Enter key for submission
- Spacebar for pause
- Keyboard-only test completion
- Edge cases and rapid input handling

### 5. Results and Review (`results-and-review.spec.js`)
- Results screen display
- Score calculation and display
- Performance level categorization
- Review screen navigation
- Answer status (correct/incorrect)
- Restart functionality

### 6. Full Flow (`full-flow.spec.js`)
- Complete test flow from start to finish
- Mixed input methods (mouse and keyboard)
- Edge case handling
- Accessibility verification
- Performance testing

## Running the Tests

### Install Dependencies
```bash
npm install
```

### Install Playwright Browsers
```bash
npx playwright install
```

### Run All Tests
```bash
npm test
```

### Run Tests with UI (Interactive Mode)
```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Debug Tests
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

## Test Configuration

Tests are configured in `playwright.config.js`:
- Base URL: `http://localhost:8002`
- Auto-starts development server
- Tests against Chrome, Firefox, Safari, and mobile Chrome
- Screenshots on failure
- Video recording on failure
- Trace collection on retry

## Writing New Tests

To add new tests:

1. Create a new spec file in the `tests` directory
2. Import Playwright test utilities:
   ```javascript
   const { test, expect } = require('@playwright/test');
   ```
3. Group related tests with `test.describe()`
4. Use `test.beforeEach()` for common setup
5. Write individual tests with `test()`

## Best Practices

- Keep tests independent and idempotent
- Use data-testid attributes for reliable element selection
- Test user journeys, not implementation details
- Include both happy path and edge cases
- Verify accessibility alongside functionality
- Keep tests fast and focused

## CI/CD Integration

The tests are configured to work in CI environments:
- Retries failed tests twice on CI
- Runs tests sequentially on CI for stability
- Fails if `test.only` is left in code
- Generates HTML reports for build artifacts