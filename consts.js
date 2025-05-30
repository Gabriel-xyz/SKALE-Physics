// TODO put V2, BB, and result to use
export const PADDING = 0.25 // its confirmed padding is an optimization now. 3 scale with 3 padding is 44 fps and 3 scale with 0 padding is 35 fps in browser test. in server test from 58 fps to 120 fps with 100,000 dynamic bodies with 1 scale and 0.25 padding
export const V2 = { x: 0, y: 0 } // reusable vector2 for optimization
export const BB = { minX: 0, minY: 0, maxX: 0, maxY: 0 } // reusable bounding box for query optimization
export const result = {} // reusable collision result for optimization
export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;