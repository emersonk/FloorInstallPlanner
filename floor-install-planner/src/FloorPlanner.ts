/**
 * FloorPlanner.ts
 * Core engine for calculating flooring layout based on input JSON and installation constraints.
 */

export interface FloorPlanInput {
  room_length_mm: number;
  room_width_mm: number;
  plank_length_mm: number;
  plank_width_mm: number;
  expansion_gap_mm: number;
  max_width_without_gap_mm: number;
  max_length_without_gap_mm: number;
  min_butt_joint_offset_mm: number;
  min_plank_length_mm: number;
  min_first_last_row_width_mm: number;
}

export type PlankType = "full" | "cut" | "expansion_gap";

export interface PlankCell {
  type: PlankType;
  row: number;
  col: number;
  length_mm: number;
  width_mm: number;
  is_end_cut?: boolean;
}

export interface FloorPlanGrid {
  rows: number;
  cols: number;
  cells: PlankCell[][];
}

/**
 * Loads and validates the floorplan input from a JSON object.
 */
export function parseFloorPlanInput(data: any): FloorPlanInput {
  // Basic validation (expand as needed)
  const requiredFields = [
    "room_length_mm",
    "room_width_mm",
    "plank_length_mm",
    "plank_width_mm",
    "expansion_gap_mm",
    "max_width_without_gap_mm",
    "max_length_without_gap_mm",
    "min_butt_joint_offset_mm",
    "min_plank_length_mm",
    "min_first_last_row_width_mm"
  ];
  for (const field of requiredFields) {
    if (typeof data[field] !== "number" || isNaN(data[field])) {
      throw new Error(`Invalid or missing field: ${field}`);
    }
  }
  return data as FloorPlanInput;
}

/**
 * Calculates the flooring layout grid.
 * (Placeholder: returns an empty grid for now)
 */
export function calculateFloorPlanGrid(input: FloorPlanInput): FloorPlanGrid {
  // TODO: Implement layout calculation logic
  return {
    rows: 0,
    cols: 0,
    cells: []
  };
}
