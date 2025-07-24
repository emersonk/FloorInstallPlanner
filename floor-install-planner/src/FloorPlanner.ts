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

  // Build grid (no expansion gap border)
  const cells: PlankCell[][] = [];
  // Track butt joint positions for each row
  const butt_joints_by_row: number[][] = [];

  // Track the order in which planks are laid
  let laidOrderCounter = 1;

  for (let r = 0; r < rows; r++) {
    const row: PlankCell[] = [];
    // Track butt joint positions (in mm from left wall) for this row
    const butt_joints: number[] = [];

    // Check if this is the first or last row
    const is_first_row = r === 0;
    const is_last_row = r === rows - 1;
    let too_narrow = false;
    if ((is_first_row || is_last_row) && plank_width_mm < min_first_last_row_width_mm) {
      too_narrow = true;
    }

    for (let c = 0; c < cols; c++) {
      // Full plank
      // Butt joint at the end of this full plank (distance from left wall)
      const butt_joint_pos = c * plank_length_mm + plank_length_mm;
      butt_joints.push(butt_joint_pos);

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

    // Last column (cut plank)
    if (last_col_length > 0) {
      const too_short = last_col_length < min_plank_length_mm;
      const butt_joint_pos = cols * plank_length_mm + last_col_length;
      butt_joints.push(butt_joint_pos);

      row.push({
        type: "cut",
        row: r,
        col: cols,
        length_mm: last_col_length,
        width_mm: plank_width_mm,
        is_end_cut: true,
        too_short,
        too_narrow,
        laid_order: laidOrderCounter++
      });
    }

    cells.push(row);
    butt_joints_by_row.push(butt_joints);
  }

  // Last row (cut planks)
  if (last_row_width > 0) {
    const row: PlankCell[] = [];
    const butt_joints: number[] = [];
    for (let c = 0; c < cols; c++) {
      const too_short = plank_length_mm < min_plank_length_mm;
      const last_row_too_narrow = last_row_width < min_first_last_row_width_mm;
      const butt_joint_pos = c * plank_length_mm + plank_length_mm;
      butt_joints.push(butt_joint_pos);

      row.push({
        type: "cut",
        row: rows,
        col: c,
        length_mm: plank_length_mm,
        width_mm: last_row_width,
        is_end_cut: true,
        too_short,
        too_narrow: last_row_too_narrow,
        laid_order: laidOrderCounter++
      });
    }
    // Last cell (corner cut)
    if (last_col_length > 0) {
      const too_short = last_col_length < min_plank_length_mm;
      const last_row_too_narrow = last_row_width < min_first_last_row_width_mm;
      const butt_joint_pos = cols * plank_length_mm + last_col_length;
      butt_joints.push(butt_joint_pos);

      row.push({
        type: "cut",
        row: rows,
        col: cols,
        length_mm: last_col_length,
        width_mm: last_row_width,
        is_end_cut: true,
        too_short,
        too_narrow: last_row_too_narrow,
        laid_order: laidOrderCounter++
      });
    }
    cells.push(row);
    butt_joints_by_row.push(butt_joints);
  }

  // Enforce minimum butt joint offset between adjacent rows
  for (let r = 1; r < butt_joints_by_row.length; r++) { // skip first row
    const prev_joints = butt_joints_by_row[r - 1];
    const curr_joints = butt_joints_by_row[r];
    for (let c = 0; c < curr_joints.length; c++) {
      const curr_pos = curr_joints[c];
      for (let p = 0; p < prev_joints.length; p++) {
        const prev_pos = prev_joints[p];
        if (Math.abs(curr_pos - prev_pos) < input.min_butt_joint_offset_mm) {
          // Find the cell in this row/col that ends at curr_pos
          for (let cell of cells[r]) {
            // Only flag cut or full planks
            if ((cell.type === "cut" || cell.type === "full") && !cell.too_close_butt_joint) {
              // Calculate the end position of this cell
              const cell_start = cell.col * input.plank_length_mm;
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
    rows: cells.length,
    cols: cells[0]?.length || 0,
    cells
  };
}
