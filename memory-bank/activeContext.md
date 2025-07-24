# activeContext.md

## Purpose
Tracks current work focus, recent changes, next steps, active decisions, important patterns, and project insights.

---

### Current Work Focus
Debugging a persistent grey area in the grid visualization. Discovered that the issue is not with page layout or CSS, but with the grid data: some rows in the grid have fewer cells than others, causing the CSS grid to render empty columns with a grey background. Focus is now on normalizing the grid data or fixing the layout engine to ensure all rows have the same number of cells.

### Recent Changes
- Identified that the grey area in the visualization is due to inconsistent row lengths in the grid data, not a layout or CSS issue.
- Removed all color coding and the legend from the visualization.
- Each plank now displays its dimensions and the order it was laid, inside the cell.
- Added a new interactive "Add Next Plank" button that reveals planks one by one in lay order.
- Implemented the interactive reveal using Astro Islands and vanilla JavaScript (no external frameworks).
- Updated the grid rendering to be fully SSR-compatible and minimal.

### Next Steps
- Normalize the grid data so all rows have the same number of cells, or update the layout engine to ensure consistent row lengths.
- Consider further UI/UX polish (e.g., animation, progress indicator, reset button).
- Gather user feedback for additional features or improvements.
- Continue to update memory bank and documentation as features are added or changed.
- Review and refactor code for clarity and maintainability.

### Active Decisions & Considerations
- Use AstroJS for static site generation and SSR, with Astro Islands for client-side interactivity.
- Use TypeScript for the layout engine.
- Use CSS grid for visualization.
- All input dimensions in mm.
- No color coding or legend; focus on clarity and minimalism.
- Documentation-first, memory bank-driven workflow.

### Important Patterns & Preferences
- Modular, well-documented code.
- Clear separation between data (JSON), logic (TypeScript), and presentation (Astro/CSS/JS).
- Use of Astro Islands for minimal, targeted interactivity.
- Maintain up-to-date documentation in the memory bank.

### Learnings & Project Insights
- Moving from static, color-coded visualization to interactive, stepwise plank laying improves clarity and user engagement.
- Astro Islands and vanilla JS are sufficient for targeted interactivity without extra framework overhead.
- A strong foundation in architecture and workflow will accelerate future development.
