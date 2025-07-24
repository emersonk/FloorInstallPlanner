# activeContext.md

## Purpose
Tracks current work focus, recent changes, next steps, active decisions, important patterns, and project insights.

---

### Current Work Focus
Implementing and refining the flooring layout visualization. Ensuring the grid accurately reflects input parameters and constraints, and is clear and user-friendly.

### Recent Changes
- Implemented TypeScript engine to output a grid of planks and expansion gaps.
- Added color-coded, labeled CSS grid visualization in Astro.
- Verified visualization renders correctly with legend and input parameters.

### Next Steps
- Document the visualization approach and grid structure in systemPatterns.md.
- Update progress.md to reflect the completed visualization milestone.
- Plan and implement additional constraints (e.g., butt joint offset, min plank length).
- Consider enhancements: interactivity, exporting cut lists, improved styling.
- Continue to update memory bank files as work progresses.

### Active Decisions & Considerations
- Use AstroJS for static site generation.
- Use TypeScript for the layout engine.
- Use CSS grid for visualization.
- All input dimensions in mm.
- Documentation-first, memory bank-driven workflow.

### Important Patterns & Preferences
- Modular, well-documented code.
- Clear separation between data (JSON), logic (TypeScript), and presentation (Astro/CSS).
- Maintain up-to-date documentation in the memory bank.

### Learnings & Project Insights
- Early documentation clarifies requirements and constraints.
- A strong foundation in architecture and workflow will accelerate future development.
