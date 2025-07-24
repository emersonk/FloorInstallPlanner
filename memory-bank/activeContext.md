# activeContext.md

## Purpose
Tracks current work focus, recent changes, next steps, active decisions, important patterns, and project insights.

---

### Current Work Focus
Finalizing and validating all core installation constraints in the visualization. Ensuring the grid highlights violations of minimum plank length, minimum first/last row width, and minimum butt joint offset.

### Recent Changes
- Implemented and visualized minimum plank length constraint ("Too Short").
- Implemented and visualized minimum first/last row width constraint ("Too Narrow").
- Implemented and visualized minimum butt joint offset constraint ("Joint Too Close").
- Updated legend and color-coding for all constraints.

### Next Steps
- Update systemPatterns.md and progress.md to document the completed constraint logic and visualization.
- Review and refactor code for clarity and maintainability.
- Add or improve tooltips, labels, and summary statistics if desired.
- Plan for further enhancements or testing as needed.
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
