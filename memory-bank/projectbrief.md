# Project Brief

**Title:** Flooring Cut Planner

**Overview:**  
Building a very simple AstroJS web application that takes flooring plank dimensions, room dimensions, and flooring installation constraints from a JSON file as input, and generates a visual reference using CSS grid of how the planks will need to be layed out.

It is a static site as the JSON input file is located in the directory.

It has a Typescript engine which dynamically generates the html and css grid required to render the flooring layout visualization based on the given flooring dimensions, room dimensions, and the constraints being followed.

All input dimensions are taken as mm.


**Installation Constraints Explained**

These parameters define the layout rules that must be followed when generating the layout.

---

### `expansion_gap`  
**Description:** The required gap left between the flooring and all vertical or fixed objects (walls, cabinets, pipes, etc.).  
**Purpose:** Allows the floor to expand and contract with temperature and humidity changes.  

---

### `max_width_without_gap`  
**Description:** The maximum allowable width of flooring (perpendicular to the plank direction) before an expansion joint is required.  
**Purpose:** Prevents stress buildup in large rooms; beyond this width, the floor must be segmented with a transition strip.  

---

### `max_length_without_gap`  
**Description:** The maximum allowable length of flooring (along the plank direction) before requiring a transition or expansion gap.  
**Purpose:** Prevents warping or buckling over long uninterrupted spans.  

---

### `min_butt_joint_offset`   
**Description:** The minimum required horizontal offset between end joints (butt joints) of planks in adjacent rows.  
**Purpose:** Ensures structural stability and avoids visible seams lining up, which looks unprofessional.  

---

### `min_plank_length`  
**Description:** The minimum usable length for any plank, typically for end cuts.  
**Purpose:** Prevents weak, stubby planks that can break or pop out under stress.  

---

### `min_first_last_row_width`  
**Description:** The minimum width allowed for the first and last row of planks.  
**Purpose:** Avoids thin slivers of planks along walls, which are visually awkward and structurally weak.  

---
