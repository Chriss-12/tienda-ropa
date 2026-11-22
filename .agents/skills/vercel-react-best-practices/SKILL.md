---
name: vercel-react-best-practices
description: Performance guidance for React and TypeScript implementation and review.
source: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
---
# React best practices
Start independent async operations together and avoid request waterfalls. Defer awaits until needed. Handle loading, error, and empty states. Avoid broad imports when direct imports exist; lazy-load large noncritical features. Avoid components declared inside components. Derive values during render instead of syncing duplicate state with effects; put interaction logic in event handlers. Use memoization when it solves meaningful repeated work, not by default. Keep subscriptions and effect dependencies focused. Follow the installed React version. Based on Vercel's React Best Practices skill; upstream has additional rules and examples.
