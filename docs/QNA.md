# ❓ Frequently Asked Questions ❓

This document provides answers to some of the most common questions about Provue, its parent company Pazago, their shared AI stack, and the Backend Developer role.

---

## 🎤 Interview Prep

### 🙋 Tell me about yourself?

I'm a backend-leaning engineer who thrives on calming chaotic workflows with resilient services. Over the last few years I've specialised in shipping AI-assisted products end-to-end—scoping the domain with stakeholders, wiring Fastify/Express APIs, and instrumenting them so we can prove reliability to customers just as fast as we ship features.

### About Me

I’m _Jai Kapoor_, a lifelong learner who sees programming as a way to navigate and make sense of life. Writing code taught me how to think clearly, accept setbacks, and keep refining my approach—skills that matter far beyond the screen.

Outside work, I’m a _chess player_, which keeps me focused on strategy, foresight, and calm decision-making. I’m also drawn to \*_Soulslike games_ and titles with _deep mechanics_ like Black Myth: Wukong and Cyberpunk 2077. They reward patience, observation, and timing—the same qualities I try to bring to my own projects and everyday life.

What drives me is growth through curiosity. Whether it’s building software, exploring a complex game system, or learning from daily challenges, I try to move forward one deliberate step at a time. I believe _India can become a premier engineering powerhouse_, and I want to contribute to that vision—through discipline, insight, and quiet determination.

### 💪 What are your two strengths?

- **Systems thinking:** I instinctively look for shared abstractions—like our `query` and `connectRedis` helpers—so teams get consistent patterns instead of bespoke one-offs.
- **Operational rigor:** I pair every feature with observability hooks and feedback loops, which keeps outages rare and makes AI behaviour auditable.

### 🧱 What are two weaknesses you're working on?

- I can over-index on polishing internal tooling; I now time-box those detours and demo value early to be sure the effort is warranted.
- I'm less experienced with native mobile stacks, so I partner closely with frontend/mobile peers and invest time in design docs that bridge the gap. I'm currently learning React Native

### 🎯 Why should we hire you?

Because I make things. I understand this business and will build solutions—not simply write code. Point me at a trade-lane bottleneck and I’ll map the workflow, stand up the Fastify/Express endpoints, wire Postgres and Redis with the right guardrails, and prototype the agent on Qwen/DeepSeek 16B locally before we burn hosted tokens. I care less about memorising syntax and more about solving exporters’ real problems systemically.

### 📘 What is your favourite subject?

Distributed systems—especially the intersection of data consistency, caching strategies, and AI inference. I enjoy mapping how replicas, queues, and caches interact so user-facing experiences stay responsive even under load.

### 🤝 Tell me about a critical project you delivered as a team. What did you learn?

At Clarion we built NeuraHire, an AI-driven hiring platform. As part of a small squad I owned the assessment ingestion service, coordinating with data science for model outputs and frontend for candidate flows. We adopted a shared contract-testing suite and daily playback demos, which kept us aligned and gave leadership confidence to roll out nationwide pilots.

### 🛠️ Tell me about a time you failed. What did you learn?

Earlier in my career, in Flexera, I pushed a feature that quietly degraded cache hit rates because I skipped a load test. We caught it in production when latency spiked. I introduced regression alerts, wrote a replay script to simulate peak traffic, and made load tests part of our release checklist. Since then I treat performance validation as a first-class requirement, not a nice-to-have.

---

## 🏢 About Provue & Pazago

### 🤔 What is Provue's core business?

Provue.ai is a **free AI-powered finance platform** designed to revolutionize financial research for the Indian market. It transforms complex financial documents into actionable insights, audiobooks, and structured workflows, helping investors make faster, more informed decisions. Its core features include **Playbooks** for distilled expert wisdom, **Actions** for instant stock analysis, **Context** for personalized AI memory, and **Studio** for audio content generation in regional languages.[1][2][3]

### 🚀 What is Pazago's mission?

Pazago's mission is to make exporting as seamless as e-commerce. They want to replace manual, relationship-driven processes with structured, AI-guided systems, giving exporters predictability, transparency, and the ability to scale. 📈 By pairing automation with human oversight, they help teams graduate from spreadsheets to continuously learning trade pipelines. This provides the stable foundation and deep technical expertise from which innovative products like Provue can emerge.

### 🤖 What is Provue?

Provue is an AI-powered product line by Pazago that focuses on financial research and investment intelligence. 🧠 It combines retrieval-augmented generation, analyst-grade datasets, and conversational agents so financial professionals, retail investors, and market analysts can interrogate markets through natural language. It is currently free, desktop-only, and targets the Indian investment community with unique features like regional language audio content.[2][4][5]

---

## 💻 About the Role

### 🧑‍💻 What is the primary role of a Backend Developer at Provue?

As a Backend Developer at Pazago (Provue), I will be responsible for building and maintaining the scalable, high-performance systems that power Provue's AI features. This includes developing AI agents and MCP servers, building robust APIs for data ingestion and insight delivery, optimizing database performance (including vector databases), and ensuring seamless integrations between the AI, data, and user-facing components. 🚀

### 🛠️ What are the key technologies I would be working with?

You will be working with a variety of modern technologies, including:

- **Languages:** Node.js
- **Frameworks:** Fastify, Express.js
- **Databases:** PostgreSQL, Redis, and vector databases for AI context and memory.
- **Other:** AI/ML integration, MCP servers, Docker, and microservices to support features like Playbooks, Actions, and Studio.

### ✅ What are some of the key responsibilities?

- Develop, test, and maintain the AI agents and MCP servers that drive Provue's analytical capabilities.
- Design and implement scalable, secure, and high-performance applications for financial data processing and delivery.
- Implement authentication, authorization, and security best practices to protect sensitive financial data.
- Instrument AI feedback loops, monitoring drift, latency, and hallucination rates to ensure the reliability of financial insights.
- Conduct code reviews and provide technical mentorship to build a culture of engineering excellence.

### 🤝 How do you provide mentorship within the team?

Mentorship for me starts in code review, but it really clicks when we build something together. If a new teammate grabs the trade-lane caching flow, I’d sit with them on that first Fastify handler, show how the `connectRedis` helper keeps us safe when Redis hiccups, and jot down the logging and alert checks side by side. I also plan to run short “AI office hours” so folks can learn how to debug MCP prompts, trace agent telemetry, and basically learn-to-learn with the tooling instead of treating it like magic. Once they’ve got that run-through, I’d hand over a short checklist and let them take the next handler solo. My goal is for the follow-up review to be a quick thumbs-up—that’s when you know someone’s gone from “watching” to “owning.”

---

## 🤖 About the Technology

### 🚚 What are Shipments and Trade Lanes?

In the context of this demo, which is tailored to the import-export business of Pazago, we have two main data models:

- **Shipments:** These represent individual shipments being transported from an origin to a destination. They have a status (e.g., "In Transit", "Delivered") and an estimated delivery date. This data is served by the Fastify service.

- **Trade Lanes:** These represent common shipping routes (e.g., "Asia to North America West Coast"). They have information about the average duration of the route and common risks associated with it. This data is served by the Express service and replaces the more generic "playbooks".

### 🤔 What are MCP servers?

MCP (Multi-Context-Protocol) servers are a key part of the AI infrastructure at Pazago. They are used to integrate AI agents and manage their context. 🤖

An MCP server is a system that lets AI agents like LLMs securely access external data, tools, and APIs, enabling them to perform real-world tasks (like reading files or triggering actions). It's a bridge between AI assistants and resources, using standardized protocols for secure, context-aware communication in apps or cloud environments. MCP servers make AI agents much more useful by connecting them to real tasks and data.

### 🛠️ What tools were used to build and manage the project?

The Provue demo was built using a variety of tools, including:

- **Codex CLI:** For rapid iteration and development with AI-assisted coding loops.
- **GitHub Actions:** For continuous integration and deployment, including automated LLM-eval hooks.
- **Perplexity Server & Context7:** As MCP servers for research and context management, routing questions through external AI providers.

### 🏗️ What is the technology stack used at Pazago?

Pazago uses a modern and diverse technology stack tuned for AI-heavy workloads, which includes:

- **Backend:** Node.js, Fastify, Express.js, PostgreSQL, MongoDB, Redis, RabbitMQ, Kafka
- **Frontend:** React, Next.js
- **Infrastructure:** Docker, microservices
- **AI/ML:** Python, Flask, FastAPI, vector databases, fine-tuning pipelines

### 🛤️ How is the Express API structured in this demo?

The Express service is designed for simplicity. It provides the data for the 'trade lanes' feature and a health check endpoint. To avoid code duplication, it uses shared helpers for accessing the database and cache. This design keeps the main service logic clean and easy to test, ensuring that the trade lane data is always available for the AI features in the application.

### 📦 What does the Fastify server own?

The Fastify service is responsible for delivering the 'shipments' data. It's built with a focus on performance and uses a plugin-based architecture. It handles security (like CORS) and logging in a configurable way. The service combines database access and caching to deliver shipments with a set expiration time. This approach ensures that the data is served quickly, which is important for the AI features that use these shipments for summarization and other tasks. It also makes testing the service straightforward.

### 🤔 In layman's terms, what are Fastify, Express, and Redis in this project?

In this project, you can think of the backend as being split into two smaller, specialized services that work together. This is a common approach called **microservices.**

- **Fastify and Express:** These are like two different chefs in a kitchen. They both do a similar job—they take requests for data, prepare it, and send it back. In this project, one "chef" (Fastify) is responsible for handling all requests related to "shipments," while the other "chef" (Express) handles everything related to "trade lanes." They are both lightweight and efficient, but the project uses two different ones to demonstrate how different services can be used together.

- **Redis:** This is like a super-fast pantry for our chefs. Instead of going all the way to the main storage (the PostgreSQL database) every single time they need an ingredient (data), they can first check Redis. If the data is there, they can grab it much more quickly. This is called "caching," and it helps the application run faster by reducing the number of times it has to access the slower main database.

### 🔁 How is Redis used across the services?

A single, shared Redis connection is used by both backend services to improve efficiency. Each service uses specific keys to cache its data, like 'trade lanes' or 'shipments', with configurable expiration times. This caching strategy keeps frequently accessed data readily available for the AI, and it's designed to be resilient. If the cache is unavailable, the system automatically falls back to fetching data from the database, ensuring the AI continues to receive fresh information.

### 🧪 How are Express and Fastify endpoints verified?

Both the Express and Fastify services have their own set of tests written with Jest. These tests simulate the database and cache to verify the services' behavior in isolation. For Express, the tests check the service's logic directly, while for Fastify, they simulate HTTP requests to test the full request-response cycle. This comprehensive testing ensures that the APIs are reliable and that the AI features that depend on them have a solid foundation.

---

## 🙋 About Me & The Demo

### 🧠 What core skills do you bring to Provue?

My sweet spot combines:

- **Service design:** Fastify/Express APIs with clean separation between transport, domain logic, and AI-facing presentation layers.
- **Data layer pragmatism:** Postgres for transactional workloads, Redis for caching/session coordination, plus a growing toolkit around embeddings and vector search.
- **Observability-first mindset:** Structured logging, health probes, and AI-specific metrics (latency, hallucination) baked into every service so operations stay predictable.
- **AI enablement:** Integrating MCP servers and external research agents to inject intelligence without bloating the core runtime.
- **Local AI ops:** Spinning up Qwen and DeepSeek 16B models on Ollama or LM Studio so we can prototype prompt flows locally before we burn tokens on hosted providers.

### 🧪 What does this demo highlight about your approach?

I built a Next.js UI, dual Node backends, and shared DB/Redis helpers to mimic the kind of polyglot surface Provue runs in production. The demo focuses on keeping server modules composable, documenting infrastructure assumptions, wiring MCP-powered research flows so product teams can ship AI-augmented features quickly, and setting up eval hooks so we can measure quality from day one. It’s a snapshot of how I'd bootstrap a new vertical while keeping doors open for deeper testing and scale work.

### 🧩 How does your Clarion experience with NeuraHire translate here?

At Clarion I contributed to NeuraHire, an AI-driven hiring platform that fused behavioural psychology with data science. We ran a monorepo with automated build/lint/format gates, shipped Node.js services behind PostgREST and Dockerised PostgreSQL, and fronted everything with Vue 3 + TypeScript plus a shared UI kit to keep candidate/admin dashboards cohesive. That work taught me how to operationalise emerging metrics responsibly, wire end-to-end observability, and collaborate cross-functionally under tight delivery targets—the exact muscles Provue needs as we ship AI-first workflows.

---

## 🤝 Behavioural Scenarios

### ⚖️ Tell me about a time you had to balance shipping speed with long-term maintainability.

A great example is from this very demo. I had to build two separate backend services, one with Express and one with Fastify. The immediate goal was to get data flowing to the frontend for the AI components to use. The fastest way would have been to write the data access logic separately in each service.

However, I knew that would create technical debt from day one. Any change to the database schema or caching logic would require updating two places, doubling the work and the risk of bugs.

So, I made a deliberate trade-off. I invested a bit of extra time upfront to create shared helper functions, `query` for database access and `connectRedis` for caching. This centralized the logic.

The result? The initial setup took slightly longer, but now both services are cleaner, more consistent, and easier to maintain. If we need to add a new service or change the data layer, we have a single, reliable place to make that change. This choice prioritized long-term quality and scalability over a short-term shortcut.

### 🧯 Describe a situation where something broke in production and how you handled it.

During the development of this demo, I anticipated a common production issue: cache unavailability. While this project isn't in production yet, I built it with production-readiness in mind.

**Situation:** A service that relies heavily on caching, like our shipments and trade lanes APIs, can become a single point of failure if the caching layer (Redis) goes down. The default behavior might be to throw an error, making the entire feature unusable.

**Task:** My goal was to design the system to be resilient to such failures, ensuring the application can gracefully degrade rather than fail completely.

**Action:** I implemented a 'soft-fail' mechanism in the `connectRedis` helper. Instead of letting a Redis connection error crash the application, the helper catches the error and allows the API handler to proceed without caching. The handler then fetches the data directly from the PostgreSQL database.

**Result:** If the Redis instance were to fail, the application would remain available. Users would experience slightly higher latency on the initial data load, but the core functionality would be unaffected. This proactive measure, born from experience with real-world production systems, demonstrates a commitment to building robust and resilient applications from the ground up.

### 🧭 How do you handle ambiguity when the problem isn’t fully defined?

My approach is to use AI as a partner to overcome the 'blank page syndrome' and rapidly map the problem space.

First, I **identify the 'knowns'**—the core requirements, constraints, and desired outcomes, even if they're fuzzy. I then use AI-powered tools to brainstorm and sketch out a mental map of the system. This involves generating boilerplate code, exploring different data models, and visualizing potential API contracts.

Once I have this initial map, I start **connecting the dots**. I write small, focused experiments and use the feedback from those to refine the map. For example, in this demo, I started with a vague idea of 'shipments' and 'trade lanes'. I used AI to generate some initial data structures and API endpoints, which I then refined as I built out the frontend and saw how the data would actually be used.

This iterative process of mapping and connecting the dots, with AI as a co-pilot, allows me to move from ambiguity to a clear, actionable plan quickly and effectively.

---

## 💡 Other Questions

### 💰 What is the funding situation at Pazago?

Pazago has raised a $3.5M seed round led by General Catalyst India and is a Y Combinator (W21) alumnus. 💸 That capital fuels the buildout of AI infrastructure—vector pipelines, MCP integrations, and compliance automation—across both logistics and finance products.

### 🗺️ Where is the company located?

Pazago is headquartered in **Mumbai, India**, with a secondary presence in **San Francisco, California.** 🌍 The distributed footprint lets product, AI research, and platform engineering teams follow-the-sun while staying close to customers.
