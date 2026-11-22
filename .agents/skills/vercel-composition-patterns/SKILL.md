---
name: vercel-composition-patterns
description: Build reusable React component APIs with scalable composition.
source: https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns
---
# React composition patterns
Use when building shared components, providers, or refactoring components with many boolean props. Prefer composition and explicit variants over boolean prop proliferation. Use compound components when related parts need shared state and flexible layout. Lift state to the nearest common owner; providers should expose small typed interfaces. Prefer children composition when clearer than render props. Follow this project's React version and avoid abstraction when a simple component is clearer. Based on Vercel's React Composition Patterns skill.
