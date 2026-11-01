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


