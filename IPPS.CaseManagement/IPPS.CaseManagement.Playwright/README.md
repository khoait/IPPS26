# Overview

Playwright tests are used to test the UI of Model Driven Apps.

Devs should write tests to cover the code changes in their stories/bug fixes including typescript and plugins.

# Installation

1. In terminal, install playwright with the below command

   ```
   npx playwright install --with-deps
   ```

2. run NPM install to install all dependencies

   ```
   npm install
   ```

3. Install `Playwright Test for VSCode` extension

# Setup

## .env File

create a .env file at root level to setup environment variables

```
TenantId=<courts tenant id>
ClientId=<application user id>
ClientSecret=<application user secret>

DataverseUrl=<dataverse environment url>
TestUserName=<test username>
TestUserPassword=<test user pw>
```

> NOTE: do not check in .env file to source control

## Folder Structure

`tests` is the main folder containing all playwright code

- **auth**: credentials and session details
- **config**: environment-specific configs
- **fixtures**: custom fixtures or setup hooks to create a page context that can be shared across multiple tests
- **pages**: contains page object models. to abstract components on a page in a class
- **tests**: all the test files
- **utils**: utility functions

## Test Types

| Type       | Description                                                      | Purpose                                           |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| Smoke      | Minimal set of tests verifying basic app load & key paths        | Quick feedback on deploys or merges               |
| Regression | Covers core workflows & critical features end-to-end.Text        | Confidence before release                         |
| Full E2E   | All flows, edge cases, integrations, and cross-browser runs.Text | Deep validation before staging/production release |

### Triggers

#### Pull Request (PR) / Feature Branch

Fast feedback for developers and detects obvious breakages early.

**Trigger:** On every PR to main (or mainline branch).

**Run:**

- Smoke tests only (--grep @smoke)
- Headless mode
- Single browser (Chromium)

#### Main Branch / Sprint Branch (Post-Merge)

Continuous integration of the entire app. Validates that integrated code still works together.

**Trigger:** On merge to main/sprint

**Run:**

- Regression suite (wider coverage)
- Run against local or test environment

#### Staging Deployment

Verify end-to-end flows against a deployed environment. Catch integration issues before production

**Trigger:\*** After a staging deploy completes successfully.

**Run:**

- Full E2E suite
- Use environment variables

#### PRODUCTION?
