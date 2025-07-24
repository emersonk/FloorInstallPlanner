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
  too_short?: boolean; // Indicates if the cut is below the minimum plank length
  too_narrow?: boolean; // Indicates if the row is below the minimum first/last row width
  too_close_butt_joint?: boolean; // Indicates if butt joint offset is violated
  laid_order?: number; // Order in which the plank was laid (for display)
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
  // Track butt joint positions for each row (excluding expansion gap border)
  const butt_joints_by_row: number[][] = [];

  // Track the order in which planks are laid
  let laidOrderCounter = 1;

  for (let r = 0; r < total_rows; r++) {
    const row: PlankCell[] = [];
    // Track butt joint positions (in mm from left wall) for this row
    const butt_joints: number[] = [];

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

      // Check if this is the first or last row (excluding expansion gap border)
      const is_first_row = r === 1;
      const is_last_row = r === total_rows - 2;
      let too_narrow = false;
      if ((is_first_row || is_last_row) && plank_width_mm < min_first_last_row_width_mm) {
        too_narrow = true;
      }

      // Last column (cut plank)
      if (c === total_cols - 2 && last_col_length > 0) {
        const too_short = last_col_length < min_plank_length_mm;
        // Butt joint at the end of this cut plank (distance from left wall)
        const butt_joint_pos = expansion_gap_mm + (c - 1) * plank_length_mm + last_col_length;
        butt_joints.push(butt_joint_pos);

        row.push({
          type: "cut",
          row: r,
          col: c,
          length_mm: last_col_length,
          width_mm: plank_width_mm,
          is_end_cut: true,
          too_short,
          too_narrow,
          laid_order: laidOrderCounter++
        });
        continue;
      }

      // Last row (cut plank)
      if (r === total_rows - 2 && last_row_width > 0) {
        const too_short = last_row_width < min_plank_length_mm;
        // Butt joint at the end of this cut plank (distance from left wall)
        const butt_joint_pos = expansion_gap_mm + (c - 1) * plank_length_mm + plank_length_mm;
        butt_joints.push(butt_joint_pos);

        // For last row, check if the width of the cut is too narrow
        const last_row_too_narrow = last_row_width < min_first_last_row_width_mm;
        row.push({
          type: "cut",
          row: r,
          col: c,
          length_mm: plank_length_mm,
          width_mm: last_row_width,
          is_end_cut: true,
          too_short,
          too_narrow: last_row_too_narrow,
          laid_order: laidOrderCounter++
        });
        continue;
      }

      // Full plank
      // Butt joint at the end of this full plank (distance from left wall)
      const butt_joint_pos = expansion_gap_mm + (c - 1) * plank_length_mm + plank_length_mm;
      // Only add butt joint if not the last column (otherwise it's a cut plank)
      if (c < total_cols - 2) {
        butt_joints.push(butt_joint_pos);
      }

      row.push({
        type: "full",
        row: r,
        col: c,
        length_mm: plank_length_mm,
        width_mm: plank_width_mm,
        too_narrow,
        laid_order: laidOrderCounter++
      });
    }
    cells.push(row);
    butt_joints_by_row.push(butt_joints);
  }

  // Enforce minimum butt joint offset between adjacent rows
  for (let r = 2; r < total_rows - 1; r++) { // skip expansion gap and first row
    const prev_joints = butt_joints_by_row[r - 1];
    const curr_joints = butt_joints_by_row[r];
    for (let c = 0; c < curr_joints.length; c++) {
      const curr_pos = curr_joints[c];
      for (let p = 0; p < prev_joints.length; p++) {
        const prev_pos = prev_joints[p];
        if (Math.abs(curr_pos - prev_pos) < input.min_butt_joint_offset_mm) {
          // Find the cell in this row/col that ends at curr_pos
          for (let cell of cells[r]) {
            // Only flag cut or full planks (not expansion gap)
            if ((cell.type === "cut" || cell.type === "full") && !cell.too_close_butt_joint) {
              // Calculate the end position of this cell
              const cell_start = expansion_gap_mm + (cell.col - 1) * plank_length_mm;
              const cell_end = cell_start + cell.length_mm;
              if (Math.abs(cell_end - curr_pos) < 1e-6) {
                cell.too_close_butt_joint = true;
              }
            }
          }
        }
      }
    }
  }

  return {
    rows: total_rows,
    cols: total_cols,
    cells
  };
}
