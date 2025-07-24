# systemPatterns.md

## Purpose
Documents system architecture, key technical decisions, design patterns, component relationships, and critical implementation paths.

---

### System Architecture
- Static site generated with AstroJS.
- JSON input file in the public directory provides all parameters.
- TypeScript engine processes input and computes flooring layout.
- Astro page loads engine output and renders visualization using CSS grid.

### Key Technical Decisions
- Use AstroJS for static site generation and component-based UI.
- Use TypeScript for layout logic and input validation.
- Use CSS grid for flexible, visual representation of flooring layout.
- All dimensions and calculations in millimeters for precision.
- Documentation-driven development using the memory bank.

### Design Patterns in Use
- Modular separation: data (JSON), logic (TypeScript), presentation (Astro/CSS).
- Single source of truth for input parameters (JSON).
- Stateless, deterministic layout calculation.
- Clear interface between engine output and UI rendering.

### Component Relationships
- JSON input → TypeScript engine (layout calculation) → Astro page (renders grid).
- Engine output is a data structure (e.g., 2D array) representing plank layout.
- Astro/CSS grid consumes engine output for visualization.

### Critical Implementation Paths
- Input validation and parsing from JSON.
- Application of installation constraints in layout logic.
- Calculation of plank positions, cuts, and expansion gaps.
- Transformation of layout data into a format suitable for CSS grid rendering.
- Visual differentiation of plank types and gaps in the UI.
