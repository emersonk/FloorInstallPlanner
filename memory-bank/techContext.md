# techContext.md

## Purpose
Documents technologies used, development setup, technical constraints, dependencies, and tool usage patterns.

---

### Technologies Used
- AstroJS (static site generator)
- TypeScript (layout engine and logic)
- CSS grid (visualization)
- Tailwind CSS for any other CSS needed
- Node.js and npm (development environment)

### Development Setup
- Requires Node.js and npm installed.
- Project scaffolded with Astro (`floor-install-planner/` directory).
- Source code in `src/`, public assets (including JSON input) in `public/`.
- Memory bank documentation in `memory-bank/`.
- Use `npm install` to install dependencies, `npm run dev` to start local server.

### Technical Constraints
- Static site: no backend or server-side processing.
- All input dimensions and calculations in millimeters.
- JSON input file must be present in the public directory at build time.
- Visualization must accurately reflect all installation constraints.

### Dependencies
- astro
- typescript
- (add additional dependencies as needed for layout logic or visualization)

### Tool Usage Patterns
- Use npm scripts for development (`npm run dev`) and build (`npm run build`).
- Maintain up-to-date documentation in the memory bank.
- Modular code organization for maintainability and clarity.
