import { DEG2RAD, RAD2DEG } from "./const.js";
export function magnitude(v2) {
	return Math.sqrt(v2.x * v2.x + v2.y * v2.y)
}
export function deg2rad(degrees) {
	return degrees * DEG2RAD;
}
export function rad2deg(radians) {
	return radians * RAD2DEG;
}
export function randomRadian() {
  return Math.random() * Math.PI * 2;
}
export function distance(bodyA, bodyB) {
	const xDiff = bodyA.x - bodyB.x;
	const yDiff = bodyA.y - bodyB.y;
	return Math.hypot(xDiff, yDiff);
}