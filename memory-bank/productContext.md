# productContext.md

## Purpose
Defines the "why" behind the project, the problems it solves, how it should work, and user experience goals.

---

### Why This Project Exists
The project exists to help visualize the cuts that a user may have to make when installing laminate or hardwood floors.

### Problems It Solves
There are many constraints with regards to spacing and alignment when installing plank floorings, and these necessitate planning the cuts to the flooring made ahead of time. This tool exists to make that planning easier.

### How It Should Work
Because this is just a proof of concept, a JSON file containing all the necessary parameters is located in the Astro.JS public directory. When Astro.JS is init, loads the parameter file, and renders the CSS grid layout representing the floors onto the index.html file.