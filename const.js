// TODO put V2, BB, and result to use
export const PADDING = 0 // remember, padding is only for dynamic objects not static, which makes sense because its to save reinsert costs
// note: PADDING is worthless if it turns out to be faster to clear and rebuild the tree every tick
export const V2 = { x: 0, y: 0 } // reusable vector2 for optimization
export const BB = { minX: 0, minY: 0, maxX: 0, maxY: 0 } // reusable bounding box for query optimization
export const result = {} // reusable collision result for optimization
export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;