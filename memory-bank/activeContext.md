# activeContext.md

## Purpose
Tracks current work focus, recent changes, next steps, active decisions, important patterns, and project insights.

---

### Current Work Focus
Implementing and refining an interactive, stepwise floor installation visualization. The grid now starts empty, and planks are revealed one at a time in lay order via a button, with each plank displaying its dimensions and order. The visualization is minimal, with no color coding or legend.

### Recent Changes
- Removed all color coding and the legend from the visualization.
- Each plank now displays its dimensions and the order it was laid, inside the cell.
- Added a new interactive "Add Next Plank" button that reveals planks one by one in lay order.
- Implemented the interactive reveal using Astro Islands and vanilla JavaScript (no external frameworks).
- Updated the grid rendering to be fully SSR-compatible and minimal.

### Next Steps
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
