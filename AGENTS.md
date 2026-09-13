# AI Working Rules

These instructions apply to AI-assisted changes in this repository.

## Project goals

- Keep the application focused on viewing and editing the supplied nested JSON object.
- Preserve the required recursive rendering and Redux-based state flow.
- Prefer clear, assignment-sized solutions over unnecessary abstractions.
- Do not add array support or key creation, renaming, or deletion unless the requirements change.

## Code style

- Use TypeScript for application and test code.
- Use named exports for reusable components, hooks, utilities, and actions.
- Keep components small and give each component one clear responsibility.
- Prefer descriptive names such as `currentValue`, `collapsedPaths`, and `updateValue`.
- Use type-only imports when importing TypeScript types.
- Avoid `any`, non-null assertions, and unchecked type casts when narrowing is possible.
- Follow the existing formatting: two-space indentation, single quotes, and no semicolons.
- Use Tailwind utilities for component styling and keep global CSS minimal.

## React and Redux rules

- Keep JSON data and meaningful UI state in Redux.
- Use the typed `useAppDispatch` and `useAppSelector` hooks.
- Render nested objects through the recursive `JsonNode` component.
- Represent nested locations with `JsonPath`; do not hardcode dataset property names.
- Keep form inputs controlled and dispatch valid edits to the store immediately.
- Preserve immutable update behavior through Redux Toolkit reducers.
- Do not add memoization without a measured rendering problem.

## Working process

1. Read the relevant source, types, and tests before editing.
2. Restate the requirement and identify affected files.
3. Make the smallest cohesive change that satisfies the requirement.
4. Add or update tests for behavior changes.
5. Run `npm run build`, `npm run lint`, and `npm test` before declaring completion.
6. Report what changed, verification results, and any remaining risk.

## Safety and scope

- Preserve existing functionality unless the requested change replaces it.
- Do not rename or relocate public project files without updating imports and documentation.
- Do not add dependencies when the platform or existing dependencies already solve the problem.
- Never commit generated `dist` output or `node_modules`.
