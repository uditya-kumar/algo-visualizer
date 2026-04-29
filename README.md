# Algorithm Visualizer

Paste Python code, get step-by-step visualizations powered by Claude AI (AWS Bedrock).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

3. Run:
```bash
npm run dev
```

Open http://localhost:3000

## Features

- Monaco code editor with Python syntax highlighting
- AI-generated step-by-step visualization
- Playback controls (play/pause, prev/next, speed)
- Keyboard shortcuts: Space (play/pause), Arrow keys (step)

## Supported Data Structures

- Array, String, Matrix
- Linked List (with cycle support)
- Stack, Queue
- Tree, Graph
- Hash Map, Variable

## Tech Stack

- Next.js 14 + TypeScript
- AWS Bedrock (Claude)
- Tailwind CSS + shadcn/ui
- Framer Motion
