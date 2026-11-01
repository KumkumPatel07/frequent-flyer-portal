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
