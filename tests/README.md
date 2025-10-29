# Test Suite

This project uses [Vitest](https://vitest.dev/) as the testing framework for unit tests.

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

## Test Coverage

### Utility Functions (`lib/`)

- ✅ **utils.ts** - Class name merging and Tailwind utilities
- ✅ **formatShortDate.tsx** - Date formatting with suffixes
- ✅ **getBaseUrl.ts** - Environment-based URL resolution
- ✅ **toc-utils.ts** - Table of contents utilities (slugify, extract headings)
- ✅ **subscription.ts** - User subscription access control
- ✅ **structured-data.ts** - Schema.org JSON-LD generators

### Components (`components/`)

- ✅ **DifficultyTag** - Challenge difficulty badge component

### Hooks (`hooks/`)

- ✅ **useChallenges** - Challenge data fetching and management hook

## Test Structure

```
lib/__tests__/
├── formatShortDate.test.ts
├── getBaseUrl.test.ts
├── structured-data.test.ts
├── subscription.test.ts
├── toc-utils.test.ts
└── utils.test.ts

components/ui/__tests__/
└── DifficultyTag.test.tsx

hooks/__tests__/
└── useChallenges.test.ts
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Hook Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('should return data', async () => {
    const { result } = renderHook(() => useMyHook());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## Configuration

- **vitest.config.ts** - Main Vitest configuration
- **vitest.setup.ts** - Global test setup (mocks, cleanup)

## Best Practices

1. **Arrange-Act-Assert** - Structure tests clearly
2. **Test behavior, not implementation** - Focus on what users/consumers experience
3. **Mock external dependencies** - Keep tests fast and isolated
4. **Use descriptive test names** - Explain what is being tested and expected
5. **Test edge cases** - Cover error states, empty inputs, boundary conditions
6. **Keep tests focused** - One assertion per test when possible

## CI/CD Integration

Tests automatically run on:

- Pre-commit (via husky)
- Pull requests
- Production deployments

## Next Steps: E2E Testing

For end-to-end testing of user flows, consider adding:

- [Playwright](https://playwright.dev/)
- [Cypress](https://www.cypress.io/)

Focus E2E tests on:

- Authentication flows (sign up, sign in)
- Challenge browsing and viewing
- Subscription upgrades
- Payment flows
