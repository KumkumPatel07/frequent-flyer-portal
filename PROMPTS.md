# Project Prompts Log

## Phase 2: Member Profile & Tier Status (TDD RED Phase)

```text
We are starting Phase 2 of ticket ENG-163087.

Implement the Member Profile & Tier Status feature using strict Test-Driven Development.

FIRST, write tests ONLY. Do not implement the UI or application logic yet.

Requirements to test:

1. Display a member profile with member name, member ID, current tier, and active miles.
2. Support four tiers: Silver, Gold, Platinum, and Diamond.
3. Display progress toward the next tier.
4. Show the next tier name and miles required to reach it.
5. Handle the highest tier (Diamond) without showing an invalid next-tier target.
6. Handle missing or empty member data with a clear "No data found" message.
7. Ensure all interactive elements have accessible labels and can be accessed using the keyboard.

Testing rules:

* Use Vitest and React Testing Library already configured in this project.
* Prefer accessible queries such as getByRole and getByLabelText.
* Add tests in appropriate test files under src.
* Do not modify application components to make tests pass.
* Do not install additional dependencies.
* Update the root PROMPTS.md with the exact prompt used for this phase.
* Run npm run test:run and report the results.

Expected result: Feature tests should fail because the feature has not been implemented yet. This is the RED phase of TDD.

At the end, report:

1. Files created or modified.
2. Number of passing and failing tests.
3. Whether failures are due to missing feature implementation.
4. Any configuration or unrelated errors.

Stop after the RED phase. Do not implement anything.
```

## Phase 2: Member Profile & Tier Status (TDD GREEN Phase - Implementation)

```text
Continue ticket ENG-163087, Phase 2: Member Profile & Tier Status.

The RED phase is complete and committed. Now implement the MemberProfile component to make all 10 failing acceptance tests pass.

Important instructions:

1. First inspect:

   * src/components/MemberProfile.tsx
   * src/components/MemberProfile.test.tsx
   * PROMPTS.md
   * Existing project styling and architecture.

2. Implement the actual MemberProfile UI and business logic. Replace the null stub.

3. Requirements:

   * Display member name, member ID, current tier, and active miles.
   * Support Silver, Gold, Platinum, and Diamond tiers.
   * Show an accessible progress bar toward the next tier.
   * Show next tier name and remaining miles.
   * Diamond must display a completed/highest-tier state without an invalid next-tier target.
   * Missing or null member data must display "No data found".
   * All interactive elements must have accessible labels and keyboard support.
   * Use clean monochromatic corporate styling.
   * Follow consistent 16px and 32px spacing.
   * Do not introduce rogue hardcoded hex colors.
   * Ensure responsive layout.

4. Security:

   * Sanitize text inputs before storing them in state.
   * Avoid dangerouslySetInnerHTML.
   * Do not introduce XSS vulnerabilities.

5. Testing:

   * Run npm run test:run.
   * All 12 tests (10 feature + 2 baseline) must pass.
   * Run npm run build.
   * Run npm run lint.
   * Fix any errors without weakening or deleting tests.

6. Update PROMPTS.md with the exact implementation prompt used.

7. Do not modify unrelated application features.

8. Do not install additional dependencies unless absolutely necessary.

Stop after implementation and verification. Report changed files, test results, build results, lint results, and any remaining limitations.
```

## Phase 3: Flight Activity & Miles Ledger (TDD RED Phase)

```text
 Continue the End-to-End Frequent Flyer Portal project, ticket ENG-163087.

Phase 2 is complete and committed. Start Phase 3: Flight Activity & Miles Ledger.

STRICT TDD RULE: Create tests first. Do not implement the actual UI or business logic yet.

Requirements:

1. Display a flight activity ledger containing:

   * Flight number
   * Departure and arrival locations
   * Flight date
   * Miles earned or redeemed
   * Transaction type (Earned or Redeemed)

2. Correctly distinguish earned miles from redeemed miles.

3. Display multiple flight transactions in a structured, accessible table.

4. Provide an accessible search/filter control to filter transactions by flight number or route.

5. Display "No data found" when the list is empty or a search returns no matching transactions.

6. Display a visible loading indicator when the component is in a loading state.

7. Handle missing or malformed transaction data safely without crashing.

8. Ensure interactive elements have accessible labels and support keyboard navigation.

9. Sanitize text values before storing them in state. Avoid dangerouslySetInnerHTML.

Implementation instructions:

* Inspect the existing test setup and Phase 2 component conventions.
* Create src/components/FlightActivity.test.tsx.
* Create only the minimum TypeScript type contracts or temporary null stub needed for tests to compile.
* Do not implement the actual UI, styling, filtering logic, or business logic.
* Do not weaken or delete existing tests.
* Do not install additional dependencies.
* Update root PROMPTS.md with the exact prompt used.
* Run npm run test:run.
* Confirm the new feature tests fail because the feature is not implemented.
* Confirm existing tests remain passing.

Stop after the RED phase.

Report:

1. Files created or modified.
2. Number of passing and failing tests.
3. Whether failures are expected feature-related failures.
4. Build and lint results.
5. Any configuration errors.
```

## Phase 3: Flight Activity & Miles Ledger (TDD GREEN Phase - Implementation)

```text
Continue ticket ENG-163087, Phase 3: Flight Activity & Miles Ledger.

The RED phase is complete and committed. Now implement FlightActivity to make all 10 new acceptance tests pass.

Before implementation, inspect:

* src/components/FlightActivity.tsx
* src/components/FlightActivity.test.tsx
* src/components/MemberProfile.tsx
* src/components/MemberProfile.css
* PROMPTS.md

REQUIREMENTS:

1. Render an accessible, structured flight activity table containing:

   * Flight number
   * Departure and arrival locations
   * Flight date
   * Transaction type (Earned or Redeemed)
   * Miles

2. Clearly distinguish earned and redeemed miles using appropriate positive/negative indicators and accessible text.

3. Support multiple flight transactions.

4. Implement accessible search/filter functionality for flight number and route.

5. Show "No data found" when:

   * Transactions are empty.
   * Search produces no matching results.

6. Show a visible, accessible loading indicator when isLoading is true.

7. Handle missing or malformed transaction records safely without crashing.

8. Sanitize search input and text values before storing them in state. Avoid dangerouslySetInnerHTML.

9. Ensure keyboard accessibility and appropriate ARIA labels.

DESIGN:

* Follow the existing monochromatic corporate design.
* Reuse existing CSS variables and design conventions where practical.
* Maintain consistent 16px and 32px spacing.
* Responsive layout for mobile and desktop.
* Avoid rogue hardcoded hex colors.

TDD RULES:

* Do not modify, weaken, or delete existing tests.
* Do not install unnecessary dependencies.
* Do not modify unrelated components.
* Update PROMPTS.md with the exact implementation prompt.
* Run npm run test:run. All 22 tests must pass.
* Run npm run build.
* Run npm run lint.
* Fix all errors without weakening tests.

Stop after implementation and verification.

Report changed files, test results, build results, lint results, and remaining limitations.
```

## Phase 4: Reward Flight Search & Miles Redemption Calculator (TDD RED Phase)

```text
Continue the End-to-End Frequent Flyer Portal project.

Ticket: ENG-163087
Phase 4: Reward Flight Search & Miles Redemption Calculator.

Phase 3 is complete and committed. Follow strict Test-Driven Development.

IMPORTANT: Write tests ONLY. Do not implement the UI or business logic yet.

Acceptance criteria:

1. Render an accessible reward flight search form.
2. Provide accessible origin, destination, and travel date inputs.
3. Validate missing and invalid search fields and prevent invalid submission.
4. Display matching reward flights with:

   * Flight number
   * Origin and destination
   * Travel date
   * Required miles
5. Display "No data found" when no reward flights match.
6. Calculate whether the member has sufficient miles for redemption.
7. Display a clear error when available miles are insufficient.
8. Prevent redemption when the member does not have enough miles.
9. Provide a redemption confirmation action for eligible flights.
10. Display an accessible loading state during asynchronous search/redemption operations.
11. Handle malformed data safely.
12. Sanitize text inputs before storing them in state. Avoid dangerouslySetInnerHTML.
13. Ensure keyboard accessibility and accessible labels.

Implementation instructions:

* Inspect existing project architecture and testing conventions.
* Reuse existing TypeScript and Vitest setup.
* Create src/components/RewardSearch.test.tsx.
* Create only minimum type contracts or a temporary null stub if required for compilation.
* Do not implement actual UI, styling, search logic, or redemption logic.
* Do not modify existing tests.
* Do not install additional dependencies.
* Update PROMPTS.md with the exact prompt used.
* Run npm run test:run and verify that new feature tests fail for expected implementation-related reasons.
* Existing tests must remain passing.
* Run build and lint to check for unrelated errors.

Stop after the RED phase and report all results.
```

## Phase 4: Reward Flight Search & Miles Redemption Calculator (TDD GREEN Phase - Implementation)

```text
Continue ticket ENG-163087, Phase 4: Reward Flight Search & Miles Redemption Calculator.

The RED phase is complete and committed.

Now implement RewardSearch to make all 11 Phase 4 tests pass.

First inspect:

* src/components/RewardSearch.tsx
* src/components/RewardSearch.test.tsx
* Existing MemberProfile and FlightActivity components and CSS
* PROMPTS.md

REQUIREMENTS:

1. Implement an accessible reward flight search form with:

   * Origin
   * Destination
   * Travel date

2. Validate all required fields and prevent invalid submissions. Highlight invalid fields in red and provide accessible error messages.

3. Display matching reward flights with:

   * Flight number
   * Origin and destination
   * Travel date
   * Required miles

4. Show "No data found" when no flights match.

5. Calculate whether the member has sufficient miles for redemption.

6. Show a clear insufficient-miles message and prevent redemption when miles are insufficient.

7. Allow eligible members to confirm redemption.

8. Show an accessible loading indicator during asynchronous search and redemption operations.

9. Handle malformed flight data safely.

10. Sanitize text inputs before storing them in state. Avoid dangerouslySetInnerHTML.

11. Ensure keyboard accessibility and accessible labels.

DESIGN:

* Follow the existing monochromatic corporate design system.
* Reuse existing CSS variables and spacing conventions.
* Use consistent 16px/32px spacing.
* Ensure responsive layout.
* Avoid rogue hardcoded hex colors.

TDD RULES:

* Do not modify, weaken, or delete any existing tests.
* Do not install unnecessary dependencies.
* Do not modify unrelated features.
* Update PROMPTS.md with the exact implementation prompt.
* Run npm run test:run. All 33 tests must pass.
* Run npm run build.
* Run npm run lint.
* Fix all errors without weakening tests.

Stop after implementation and verification.

Report all changed files, test results, build results, lint results, and remaining limitations.
```

## Phase 5: Portal Composition & End-to-End Integration (TDD RED Phase)

```text
Continue ticket ENG-163087: End-to-End Frequent Flyer Portal.

Start Phase 5: Portal Composition & End-to-End Integration — TDD RED phase.

IMPORTANT: Tests first. Do not implement the actual integration yet.

First inspect the existing project:

* src/App.tsx
* src/App.test.tsx
* src/components/MemberProfile.tsx
* src/components/FlightActivity.tsx
* src/components/RewardSearch.tsx
* Their existing test files
* Existing CSS and design tokens
* PROMPTS.md

Understand existing component props and data contracts before writing integration tests.

OBJECTIVE:

Create integration acceptance tests for the complete Frequent Flyer Portal.

TEST REQUIREMENTS:

1. Main dashboard renders the Member Profile, Flight Activity, and Reward Search sections together.

2. Member information and available miles are shared consistently across the portal.

3. Reward flight search works inside the integrated dashboard.

4. A successful redemption:

   * Updates the member's available miles.
   * Updates the flight/miles ledger appropriately.
   * Prevents redemption when the balance is insufficient.
   * Keeps profile and ledger data consistent.

5. Primary action completion logs exactly:
   [Analytics] User interacted with End-to-End Frequent Flyer Portal

6. Empty data states display "No data found".

7. Loading states are accessible and visible during asynchronous operations.

8. Invalid data and malformed records do not crash the portal.

9. All interactive elements remain keyboard accessible and properly labelled.

10. Verify the portal can initialize without errors when persisted data is missing or malformed.

TDD RULES:

* Create integration tests before implementation.
* Use the existing Vitest and React Testing Library setup.
* Do not modify or weaken existing component tests.
* Do not change existing component implementations in this RED phase.
* Use temporary typed stubs only if necessary.
* Do not introduce unnecessary dependencies.
* Append the exact prompt to PROMPTS.md.

VERIFICATION:

Run:

* npm run test:run
* npm run build
* npm run lint

Expected:

* New integration tests should fail for missing integration functionality.
* All existing 33 tests must continue passing!
```

## Phase 5: Portal Composition & End-to-End Integration (TDD GREEN Phase - Implementation)

```text
Continue ticket ENG-163087, Phase 5: Portal Composition & End-to-End Integration — TDD GREEN phase.

The RED phase is complete and committed.

Now implement the integrated Frequent Flyer Portal so all 41 existing tests pass.

FIRST inspect:

* src/PortalIntegration.test.tsx
* src/components/FrequentFlyerPortal.tsx
* src/App.tsx and src/App.test.tsx
* src/components/MemberProfile.tsx and its tests
* src/components/FlightActivity.tsx and its tests
* src/components/RewardSearch.tsx and its tests
* All related CSS files
* PROMPTS.md

Understand all existing component props, data contracts, and test expectations before implementation.

IMPLEMENTATION REQUIREMENTS:

1. PORTAL COMPOSITION

* Render MemberProfile, FlightActivity, and RewardSearch together in the main portal.
* Create a clean, responsive dashboard layout.
* Integrate the portal into App.tsx.

2. SHARED STATE

* Maintain one consistent member record and available miles balance.
* Pass the correct data to all child components.
* Initialize safely if persisted data is missing or malformed.

3. REDEMPTION FLOW
   When a member successfully redeems a reward flight:

* Deduct the required miles from available balance.
* Update MemberProfile immediately.
* Add the corresponding redemption transaction to FlightActivity.
* Prevent redemption if the balance is insufficient.
* Prevent duplicate or invalid redemption.
* Keep all displayed data consistent.

4. PERSISTENCE

* Persist relevant portal state using localStorage.
* Handle missing, malformed, or inaccessible stored data safely.
* Do not store secrets or real personal information.
* Keep initial demo data clearly fictional.

5. ANALYTICS
   When the primary portal action successfully completes, log exactly:

[Analytics] User interacted with End-to-End Frequent Flyer Portal

Do not log this message for failed or cancelled actions.

6. EMPTY AND LOADING STATES

* Display "No data found" where appropriate.
* Show accessible loading indicators during asynchronous operations.
* Prevent duplicate actions while an operation is in progress.

7. ACCESSIBILITY AND SECURITY

* Preserve keyboard navigation and accessible labels.
* Use semantic HTML.
* Sanitize user text before storing it in state.
* Never use dangerouslySetInnerHTML.
* Handle malformed records safely.

8. DESIGN

* Maintain the existing monochromatic corporate design system.
* Reuse existing CSS variables.
* Use consistent 16px/32px spacing.
* Responsive desktop and mobile layouts.
* No rogue hardcoded hex colors.

TDD RULES:

* Do not modify, weaken, skip, or delete any existing tests.
* Do not change the expected analytics message.
* Do not introduce unnecessary dependencies.
* Keep implementation maintainable and typed.
* Append the exact implementation prompt to PROMPTS.md.

VERIFICATION:

Run:

1. npm run test:run
2. npm run build
3. npm run lint

Expected:

* All 41 tests pass.
* Production build succeeds.
* ESLint has zero warnings and errors.

If any test fails, investigate and fix the implementation without weakening tests.

STOP after implementation and verification.

Report changed files, test results, build results, lint results, persistence behavior, and any remaining limitations.
```



## Phase 6: Final Polish & Accessibility (TDD RED Phase)

```text
Continue ticket ENG-163087 — End-to-End Frequent Flyer Portal.

Start Phase 6: Final Polish & Accessibility — TDD RED phase.

An audit has identified high- and medium-priority issues. Create acceptance tests for these improvements before implementing any fixes.

FIRST inspect the existing source code and all test files.

NEW TEST REQUIREMENTS:

1. REDEMPTION PERSISTENCE

* Redeemed flight IDs must survive browser refresh.
* Previously redeemed flights must remain disabled after reloading.
* Malformed redeemed-flight storage must fall back safely.
* Prevent duplicate redemption after refresh.

2. HEADING ACCESSIBILITY

* The application should have a clear heading hierarchy.
* Keep one primary page heading.
* Update the existing App smoke test appropriately if necessary.
* Do not weaken existing assertions.

3. TIER BENEFITS INTERACTION

* Clicking "View Tier Benefits" must open an accessible dialog or equivalent interface.
* Benefits content must be appropriate for the member's current tier.
* Dialog must support keyboard interaction and accessible dismissal.

4. FORM ERROR ASSOCIATION

* Invalid RewardSearch inputs must reference the relevant error message through aria-describedby.
* Preserve aria-invalid and role="alert".

5. AIRPORT FORMATTING

* Remove special-case rendering that converts duplicate LHR values differently.
* Ensure all airport codes are rendered consistently.

6. DOCUMENT METADATA

* Add testable expectations for the page title and meta description.
* Verify theme-color metadata exists.

TDD RULES:

* Create or update tests only.
* Do not implement source-code fixes yet.
* Do not weaken or skip existing tests.
* Do not modify unrelated features.
* Append the exact prompt to PROMPTS.md.

Run:

* npm run test:run
* npm run build
* npm run lint

Expected:

* New tests should fail for the identified missing functionality.
* Existing 41 tests should continue passing, except an explicitly updated heading assertion that preserves equivalent coverage.
* Build and lint should remain clean.

Report changed files, total test count, expected failures, and verification results.

STOP after RED phase.
```
