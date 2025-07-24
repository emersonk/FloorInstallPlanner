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
 * For proof of concept: fills the room with full planks, cut planks at edges, and expansion gap border.
 */
export function calculateFloorPlanGrid(input: FloorPlanInput): FloorPlanGrid {
  const {
    room_length_mm,
    room_width_mm,
    plank_length_mm,
    plank_width_mm,
    expansion_gap_mm,
    min_first_last_row_width_mm,
    min_plank_length_mm
  } = input;

  // Calculate usable room dimensions (subtract expansion gaps on all sides)
  const usable_length = room_length_mm - 2 * expansion_gap_mm;
  const usable_width = room_width_mm - 2 * expansion_gap_mm;

  // Calculate number of full planks per row/col
  const cols = Math.floor(usable_length / plank_length_mm);
  const rows = Math.floor(usable_width / plank_width_mm);

  // Calculate remaining space for cut planks (at right and bottom edges)
  const last_col_length = usable_length - cols * plank_length_mm;
  const last_row_width = usable_width - rows * plank_width_mm;

  // Total grid size (add 2 for expansion gap border)
  const total_rows = rows + 2;
  const total_cols = cols + 2;

  // Build grid
  const cells: PlankCell[][] = [];
  for (let r = 0; r < total_rows; r++) {
    const row: PlankCell[] = [];
    for (let c = 0; c < total_cols; c++) {
      // Expansion gap border
      if (r === 0 || r === total_rows - 1 || c === 0 || c === total_cols - 1) {
        row.push({
          type: "expansion_gap",
          row: r,
          col: c,
          length_mm: (c === 0 || c === total_cols - 1) ? expansion_gap_mm : plank_length_mm,
          width_mm: (r === 0 || r === total_rows - 1) ? expansion_gap_mm : plank_width_mm
        });
        continue;
      }

      // Last column (cut plank)
      if (c === total_cols - 2 && last_col_length > 0) {
        row.push({
          type: "cut",
          row: r,
          col: c,
          length_mm: last_col_length,
          width_mm: plank_width_mm,
          is_end_cut: true
        });
        continue;
      }

      // Last row (cut plank)
      if (r === total_rows - 2 && last_row_width > 0) {
        row.push({
          type: "cut",
          row: r,
          col: c,
          length_mm: plank_length_mm,
          width_mm: last_row_width,
          is_end_cut: true
        });
        continue;
      }

      // Full plank
      row.push({
        type: "full",
        row: r,
        col: c,
        length_mm: plank_length_mm,
        width_mm: plank_width_mm
      });
    }
    cells.push(row);
  }

  return {
    rows: total_rows,
    cols: total_cols,
    cells
  };
}
