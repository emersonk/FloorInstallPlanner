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
  cut_for_butt_joint?: boolean; // Indicates if this plank was cut to enforce butt joint offset
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
 * Implements stair-stepping (staggered) starting rows and auto-corrects butt joint violations by cutting planks.
 */
export function calculateFloorPlanGrid(input: FloorPlanInput): FloorPlanGrid {
  const {
    room_length_mm,
    room_width_mm,
    plank_length_mm,
    plank_width_mm,
    expansion_gap_mm,
    min_first_last_row_width_mm,
    min_plank_length_mm,
    min_butt_joint_offset_mm
  } = input;

  // Calculate usable room dimensions (subtract expansion gaps on all sides)
  const usable_length = room_length_mm - 2 * expansion_gap_mm;
  const usable_width = room_width_mm - 2 * expansion_gap_mm;

  // Calculate number of rows (plank widths)
  const rows = Math.floor(usable_width / plank_width_mm);
  const last_row_width = usable_width - rows * plank_width_mm;

  // Total grid size (add 2 for expansion gap border)
  const total_rows = rows + 2;

  // Helper: Generate staggered starting offsets for first 3 rows
  const stagger_offsets = [
    0,
    Math.floor(plank_length_mm / 3),
    Math.floor((2 * plank_length_mm) / 3)
  ];

  // Build grid
  const cells: PlankCell[][] = [];

  // Track previous row's butt joints (in mm from left wall)
  let prev_butt_joints: number[] = [];

  // Track leftover piece to propagate to next row
  let leftover_piece_length: number | null = null;

  for (let r = 0; r < total_rows; r++) {
    const row: PlankCell[] = [];
    let y = r === 0 ? 0 : expansion_gap_mm + (r - 1) * plank_width_mm;
    let row_width = plank_width_mm;
    let is_first_row = r === 1;
    let is_last_row = r === total_rows - 2;
    if (r === 0 || r === total_rows - 1) {
      // Expansion gap border
      for (let c = 0, x = 0; x < room_length_mm;) {
        let cell_length = (c === 0 || x + plank_length_mm > room_length_mm) ? expansion_gap_mm : plank_length_mm;
        row.push({
          type: "expansion_gap",
          row: r,
          col: c,
          length_mm: cell_length,
          width_mm: plank_width_mm
        });
        x += cell_length;
        c++;
      }
      cells.push(row);
      continue;
    }
    if (is_last_row && last_row_width > 0) {
      row_width = last_row_width;
    }
    let x = expansion_gap_mm;
    let c = 1;
    let used_leftover = false;
    let start_offset = 0;

    // If a leftover piece is available and valid, use it as the starting plank (override stagger)
    if (leftover_piece_length && leftover_piece_length >= min_plank_length_mm) {
      start_offset = 0;
      used_leftover = true;
    } else if (r - 1 < stagger_offsets.length) {
      start_offset = stagger_offsets[r - 1];
    } else {
      start_offset = stagger_offsets[(r - 1) % stagger_offsets.length];
    }
    x += start_offset;

    let butt_joints: number[] = [];
    let plank_idx = 0;
    let carry_cut = leftover_piece_length && leftover_piece_length >= min_plank_length_mm ? leftover_piece_length : 0;

    while (x < room_length_mm - expansion_gap_mm - 1e-6) {
      let max_plank_length = Math.min(plank_length_mm, room_length_mm - expansion_gap_mm - x);
      let plank_length = max_plank_length;

      // If we have a leftover piece, use it as the first plank
      if (carry_cut && used_leftover) {
        plank_length = carry_cut;
        carry_cut = 0;
        used_leftover = false;
      }

      // Enforce min plank length for start/end/cut
      if (plank_length < min_plank_length_mm) {
        plank_length = min_plank_length_mm;
      }

      // Butt joint correction: ensure this plank's end is not too close to any in prev row
      let cut_for_butt_joint = false;
      if (prev_butt_joints.length > 0) {
        for (let prev of prev_butt_joints) {
          if (
            Math.abs(x + plank_length - prev) < min_butt_joint_offset_mm &&
            x + plank_length < room_length_mm - expansion_gap_mm - 1e-6
          ) {
            // Cut plank so butt joint is at least min_butt_joint_offset_mm away
            plank_length = prev - x - min_butt_joint_offset_mm;
            cut_for_butt_joint = true;
            break;
          }
        }
      }

      // Enforce min plank length after correction
      if (plank_length < min_plank_length_mm) {
        plank_length = min_plank_length_mm;
      }
      if (plank_length > max_plank_length) {
        plank_length = max_plank_length;
      }

      // Don't overrun the wall
      if (x + plank_length > room_length_mm - expansion_gap_mm) {
        plank_length = room_length_mm - expansion_gap_mm - x;
      }

      // Mark too_short if needed
      let too_short = plank_length < min_plank_length_mm;

      // Mark too_narrow for first/last row
      let too_narrow = false;
      if ((is_first_row || is_last_row) && row_width < min_first_last_row_width_mm) {
        too_narrow = true;
      }

      // Add plank cell
      row.push({
        type: plank_length === plank_length_mm ? "full" : "cut",
        row: r,
        col: c,
        length_mm: plank_length,
        width_mm: row_width,
        is_end_cut: x + plank_length >= room_length_mm - expansion_gap_mm - 1e-6,
        too_short,
        too_narrow,
        cut_for_butt_joint
      });

      butt_joints.push(x + plank_length);

      // If this plank was cut (not full length), propagate leftover to next row
      if (plank_length < plank_length_mm && x + plank_length < room_length_mm - expansion_gap_mm - 1e-6) {
        leftover_piece_length = plank_length_mm - plank_length;
      } else {
        leftover_piece_length = null;
      }

      x += plank_length;
      c++;
      plank_idx++;
    }
    cells.push(row);
    prev_butt_joints = butt_joints;
  }

  // Normalize all rows to the same number of columns for grid rendering
  const max_cols = Math.max(...cells.map(row => row.length));
  for (let row of cells) {
    while (row.length < max_cols) {
      row.push({
        type: "expansion_gap",
        row: row[0]?.row ?? 0,
        col: row.length,
        length_mm: expansion_gap_mm,
        width_mm: plank_width_mm
      });
    }
  }

  return {
    rows: total_rows,
    cols: max_cols,
    cells
  };
}
