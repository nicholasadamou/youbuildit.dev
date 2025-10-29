# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 🧪 Unit Tests (`test.yml`)

Runs the unit test suite on every push and pull request to `main` and `develop` branches.

**What it does:**

- Runs on Node.js 18.x and 20.x (matrix strategy)
- Installs dependencies with pnpm
- Runs ESLint for code quality checks
- Runs unit tests with Vitest
- Generates code coverage reports
- Uploads coverage to Codecov (optional)

**Triggers:**

- Push to `main` or `develop`
- Pull requests targeting `main` or `develop`

**Requirements:**

- No secrets required for basic functionality
- Optional: `CODECOV_TOKEN` secret for coverage uploads

### 🔄 Content Sync (`sync-content.yml`)

Triggers a rebuild when challenge content is updated in the database.

**What it does:**

- Listens for content update events
- Triggers a Vercel rebuild
- Can be manually triggered via workflow_dispatch

**Triggers:**

- Manual trigger via GitHub Actions UI
- External webhook with `content-updated` event

## Setting Up Codecov (Optional)

If you want to track code coverage over time:

1. **Sign up for Codecov:**
   - Go to [codecov.io](https://codecov.io/)
   - Sign in with your GitHub account
   - Add your repository

2. **Get your Codecov token:**
   - In Codecov, go to your repository settings
   - Copy the upload token

3. **Add the token to GitHub Secrets:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: Your Codecov token

4. **View coverage reports:**
   - Coverage will be uploaded automatically on every test run
   - View trends and reports at codecov.io

## Monitoring Workflows

### View Workflow Runs

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. Select a workflow from the left sidebar
4. View individual runs and their logs

### Status Badge

The unit tests badge is displayed in the README.md:

```markdown
![Unit Tests](https://github.com/youbuildit/youbuildit.dev/actions/workflows/test.yml/badge.svg)
```

This badge will show:

- ✅ Green checkmark if tests pass
- ❌ Red X if tests fail
- ⚪ Gray circle if tests are running

## Troubleshooting

### Tests Failing in CI but Passing Locally

**Common causes:**

- Different Node.js versions (CI tests on 18.x and 20.x)
- Missing environment variables
- Timezone differences (ensure tests use UTC or relative dates)
- Race conditions in async tests

**Solutions:**

- Run tests locally with the same Node.js version
- Check GitHub Actions logs for specific errors
- Ensure all tests are deterministic and not dependent on system time/locale

### Slow Test Runs

**Optimization tips:**

- Tests run in parallel by default in Vitest
- Use `pnpm install --frozen-lockfile` to skip dependency resolution
- Consider splitting tests into multiple jobs if needed

### Linter Failures

If the linter step fails:

```bash
# Fix locally
pnpm lint:fix

# Commit the fixes
git add .
git commit -m "fix: lint errors"
git push
```

## Best Practices

1. **Keep workflows fast** - Optimize test runs and use caching
2. **Fail fast** - Run linter before tests to catch issues quickly
3. **Matrix testing** - Test on multiple Node.js versions
4. **Clear naming** - Use descriptive step names for easy debugging
5. **Security** - Never commit secrets, always use GitHub Secrets
