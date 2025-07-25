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
- Engine output is a 2D array of PlankCell objects, each with type (full, cut, expansion_gap), position, and size.
- Each PlankCell may be flagged for constraint violations:
  - `too_short` (min plank length)
  - `too_narrow` (min first/last row width)
  - `too_close_butt_joint` (min butt joint offset)
- Astro/CSS grid consumes this output, mapping each cell to a color-coded `<div>` in a CSS grid.
- Legend and tooltips provide user guidance and clarity.

### Critical Implementation Paths
- Input validation and parsing from JSON.
- Application of installation constraints in layout logic:
  - Minimum plank length: flag cut planks shorter than allowed (`too_short`, red)
  - Minimum first/last row width: flag planks in first/last row if too narrow (`too_narrow`, purple)
  - Minimum butt joint offset: flag planks where end joints in adjacent rows are too close (`too_close_butt_joint`, orange)
- Calculation of plank positions, cuts, and expansion gaps.
- Output: 2D array of PlankCell objects, with metadata for type, size, position, and constraint violations.
- Astro page renders a CSS grid, mapping each PlankCell to a `<div>` with color and label.
- Color-coding: blue for full planks, yellow for cut planks, red for too short, purple for too narrow, orange for joint too close, gray for expansion gaps.
- Legend and tooltips clarify cell meaning for the user.
