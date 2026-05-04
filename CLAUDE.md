# Algorithm Visualizer

## Project Structure

```
src/
├── app/
│   ├── api/visualize/route.ts   # Bedrock API endpoint
│   ├── layout.tsx
│   ├── page.tsx                 # Main page
│   └── globals.css
├── components/
│   ├── CodeInput.tsx            # Monaco editor
│   ├── Visualizer.tsx           # Playback + canvas
│   └── structures/              # Data structure renderers
│       ├── ArrayView.tsx
│       ├── StringView.tsx
│       ├── LinkedListView.tsx
│       ├── TreeView.tsx
│       ├── GraphView.tsx
│       ├── StackView.tsx
│       ├── HashMapView.tsx
│       ├── MatrixView.tsx
│       └── VariableView.tsx
├── hooks/
│   └── usePlayback.ts           # Playback state + keyboard shortcuts
├── lib/
│   ├── bedrock.ts               # AWS Bedrock client
│   ├── prompts.ts               # Claude system prompt
│   └── utils.ts
└── types/
    └── visualization.ts         # TypeScript interfaces
```

## Key Files

- `src/lib/prompts.ts` - System prompts: DSA classifier + visualization generator
- `src/lib/bedrock.ts` - AWS Bedrock client with DSA classification guardrail
- `src/types/visualization.ts` - AlgoTrace, Step, Structure interfaces
- `src/components/Visualizer.tsx` - Main visualizer with playback controls

## Input Guardrail

Before visualization, code is classified by Claude to check if it's DSA-related. Non-DSA code (web frameworks, API clients, ML code, etc.) is rejected with a user-friendly message.

- `classifyCode()` in bedrock.ts - Returns `{isDSA: boolean, reason: string}`
- `NotDSAError` - Custom error thrown when code is not DSA-related
- API returns `{error: string, type: 'not_dsa'}` with 400 status for rejected code
- UI shows amber warning with helpful suggestions for valid DSA topics

## Data Format

Visualization JSON schema:
```typescript
interface AlgoTrace {
  title: string;
  steps: Step[];
}

interface Step {
  description: string;
  structures: Structure[];
}

interface Structure {
  id: string;
  label: string;
  type: 'array' | 'string' | 'linked-list' | 'tree' | 'graph' | 'stack' | 'queue' | 'hash-map' | 'matrix' | 'variable';
  data: any;
  highlights?: number[];
  pointers?: Record<string, number>;
}
```

## Linked List with Cycle

Format: `{"nodes": [3, 2, 0, -4], "cycleIndex": 1}`

The cycle arrow renders from last node back to the node at cycleIndex.
