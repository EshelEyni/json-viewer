# Reusable AI Prompts and Code Templates

These prompts are intended to make AI-assisted work on the JSON Viewer & Editor consistent, reviewable, and efficient.

## Plan a change

```text
Read the requirement and inspect the relevant source and tests. Summarize the expected behavior, identify the smallest set of files that should change, and list important edge cases. Do not implement anything until the plan is clear. Preserve recursive rendering and keep meaningful state in Redux.
```

## Implement a feature

```text
Implement the requested feature using the existing React, TypeScript, Redux Toolkit, and Tailwind architecture. Reuse the recursive JSON types and JsonPath-based updates. Keep components focused, avoid unrelated refactoring, and add tests that verify user-visible behavior and Redux state. Finish by running build, lint, and tests.
```

## Add or change Redux behavior

```text
Update the existing json slice without adding another state-management pattern. Define a typed payload, protect state invariants, and preserve unrelated object branches. If the action changes the UI, add a reducer test and an integration test that observes the resulting store state.
```

## Debug a problem

```text
Reproduce the problem with the smallest failing test. Trace the data from the input event through the dispatched action and reducer to the rendered value. Explain the root cause before changing code, fix it at the correct layer, and retain the regression test.
```

## Review the application

```text
Review the project as a senior React developer. Prioritize requirement violations and correctness issues, followed by state design, accessibility, responsive behavior, maintainability, and test gaps. Cite exact files and lines. Separate changes required before submission from optional improvements.
```

## Component template

```tsx
import type { JsonPath, JsonValue } from '../types'

interface ExampleProps {
  path: JsonPath
  value: JsonValue
}

export function Example({ path, value }: ExampleProps) {
  return (
    <div>
      {/* Render from props and dispatch state changes through typed Redux hooks. */}
    </div>
  )
}
```

## Redux action template

```ts
interface ExamplePayload {
  path: JsonPath
  value: JsonPrimitive
}

exampleAction: (state, action: PayloadAction<ExamplePayload>) => {
  // Validate the path and update only the selected value.
}
```

## Test template

```tsx
it('updates the selected value in Redux', async () => {
  const user = userEvent.setup()
  const { store } = renderWithStore()

  await user.type(screen.getByRole('textbox'), 'updated value')

  expect(selectExpectedValue(store.getState())).toBe('updated value')
})
```

Tests should assert behavior and state transitions rather than Tailwind class names or component implementation details.
