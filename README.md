# JSON Viewer & Editor

A React and TypeScript application for browsing and editing a nested JSON object. The interface renders the object recursively, chooses an editor based on each value's type, and keeps data and expansion state in Redux.

## Features

- Recursive rendering for nested objects
- Expandable and collapsible object nodes
- Text inputs for strings
- Numeric inputs for numbers
- Color pickers for valid three- and six-digit hex colors
- Toggles for boolean values
- Immutable nested updates using property paths
- Loading and error states for the demo-data request
- Responsive styling with Tailwind CSS

Arrays and `null` values are outside the scope of the supplied dataset. Keys cannot be added, renamed, or deleted.

## Getting started

Requirements:

- Node.js 20.19 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run Oxlint
npm test         # Run the test suite once
npm run test:watch # Run tests in watch mode
npm run preview  # Preview the production build locally
```

## Architecture

```text
src/
├── components/
│   ├── JsonNode.tsx         # Recursively renders object nodes and leaves
│   ├── JsonValueEditor.tsx  # Selects the correct primitive-value editor
│   └── JsonViewer.tsx       # Loads data and handles request states
├── data/
│   └── data.json            # Demo JSON dataset
├── docs/
│   └── ai-prompts.md        # Reusable AI prompts and code templates
├── services/
│   └── utilService.ts       # Runtime primitive and color detection
├── store/
│   ├── hooks.ts             # Typed Redux hooks
│   ├── jsonSlice.ts         # Data loading, editing, and collapse actions
│   └── store.ts             # Redux store configuration
├── App.tsx                  # Application layout
├── main.tsx                 # React root and Redux provider
└── types.ts                 # Recursive JSON and path types
```

Repository-level AI coding and review rules are documented in [`AGENTS.md`](./AGENTS.md). Reusable prompts and templates are available in [`docs/ai-prompts.md`](./docs/ai-prompts.md).

### State flow

1. `JsonViewer` dispatches the `loadData` thunk when the application starts.
2. The thunk resolves the simulated request and stores the JSON object in the `json` slice.
3. `JsonNode` walks each object recursively and extends a path such as `product.branding.primaryColor`.
4. `JsonValueEditor` uses runtime type detection to render the appropriate controlled input.
5. An edit dispatches `updateValue` with the property's path and new primitive value.
6. Redux Toolkit uses Immer to update the selected leaf while preserving unrelated branches.
7. Expanding or collapsing an object dispatches `toggleNode`, keeping that UI state in Redux as well.

## Technology

- React 19
- TypeScript
- Vite
- Redux Toolkit and React Redux
- Tailwind CSS
