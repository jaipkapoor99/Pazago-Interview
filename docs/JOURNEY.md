# Journey to Provue Demo

Nikhil, I wanted to give you the quick origin story behind the Provue demo I’m bringing to our conversation. It started with a blank folder, the job description, and the hunch that if I could approximate the feel of Provue, our interview would dive straight into the fun stuff. That’s why I paired Fastify and Express from day one, spun up a Next.js entry point for context, and brought Postgres in early—I wanted you to see real data flows, not placeholder arrays.

From there I kept layering in the pieces I figured you would probe. Each time a script complained, it earned a spot in `package.json`. Empty tables reminded me how fast a demo can fall apart, so migrations and seeds showed up next. The README and extra docs in `docs/` are notes to future-us so we can retrace decisions without spelunking through commits.

The more I polished it for you, the more production-ready it felt. Codex CLI was the main driver here because it let me iterate fast, keep context, and ship without breaking rhythm. GitHub Actions now meet every push, formatting and linting run by default, and Postgres hums along on the latest version. Dependency updates moved from “maybe later” to “of course,” because I expect you to ask about upkeep. The result is a stack that actually compiles, serves believable data, and tells a cohesive story about how I’d build with you.

Codex kept me moving whenever scope tried to creep. I used it to scaffold Fastify routes, generate Express handlers, and sanity-check TypeScript types without detouring into documentation. It handled lint nagging, rewrote Postgres queries on the fly, and even helped me spot config drift in `package.json` before it mattered. Having that AI pair-programming loop meant I could stay focused on trade-offs instead of syntax trivia.

The Multi-Context-Protocol (MCP) servers became quiet teammates in the process. I leaned on the Perplexity server when I needed quick research bursts about Provue’s niche, and tapped Context7 when I ran into schema edge cases, migration caveats, or Fastify quirks. They let me stay in flow so I could keep tightening the experience you’re about to see. Codex stitched all of that together into a single workflow, so every AI touchpoint—MCP lookup, code generation, refactor—fed straight back into the repo without wasted motion.

So that’s the journey you’re stepping into: a rough sketch that sharpened into a tidy demo because I kept picturing the conversation we’ll have. I’m excited to walk you through it and hear where you’d like to take it next.
