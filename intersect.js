import { separationResult } from "./const.js";

// TODO has to work on circles too by checking if it has a defined .r property
// TODO has to use sameLayer to check if the objects share any layer, if not theyre not intersecting
export function separate(shapeA, shapeB) {
	let bodyA = shapeA.body, bodyB = shapeB.body
	if (!bodyA.dynamic || shapeA.trigger || shapeB.trigger) return;
	let sep = separationResult
	const overlapX = Math.min(shapeA.maxX, shapeB.maxX) - Math.max(shapeA.minX, shapeB.minX);
	const overlapY = Math.min(shapeA.maxY, shapeB.maxY) - Math.max(shapeA.minY, shapeB.minY);
	if (overlapX <= 0 || overlapY <= 0) return
	sep.normal.x = 0
	sep.normal.y = 0
	// Find axis of minimum penetration
	let sepX = 0, sepY = 0;
	if (overlapX < overlapY) {
		sep.axis = 0 // 0 = x, 1 = y
		// Move along X axis, normal points from A to B
		const midA = (shapeA.minX + shapeA.maxX) / 2;
		const midB = (shapeB.minX + shapeB.maxX) / 2;
		if (midA < midB) {
			sepX = -overlapX;
			sep.normal.x = -1;
		} else {
			sepX = overlapX;
			sep.normal.x = 1;
		}
	} else {
		sep.axis = 1;
		// Move along Y axis, normal points from A to B
		const midA = (shapeA.minY + shapeA.maxY) / 2;
		const midB = (shapeB.minY + shapeB.maxY) / 2;
		if (midA < midB) {
			sepY = -overlapY;
			sep.normal.y = -1;
		} else {
			sepY = overlapY;
			sep.normal.y = 1;
		}
	}
	// Move both bodies proportionally to mass if both are dynamic, else move only A
	let totalMass = bodyA.mass + (bodyB.dynamic ? bodyB.mass : 0);
	let amtA = 1, amtB = 0;
	if (totalMass > 0) {
		amtA = bodyB.mass / totalMass;
		amtB = bodyA.mass / totalMass;
	}
	shapeA.setPos(shapeA.minX + sepX * amtA, shapeA.minY + sepY * amtA);
	if (bodyB.dynamic) shapeB.setPos(shapeB.minX - sepX * amtB, shapeB.minY - sepY * amtB);
	sep.overlap = sep.axis === 'x' ? Math.abs(overlapX) : Math.abs(overlapY);
	return sep
}
// Standard restitution and impulse-based collision response for AABBs
export function sepForce(bodyA, bodyB, sep) {
	if (!bodyA.dynamic && (!bodyB || !bodyB.dynamic)) return;
	let normal = sep.normal
	// Relative velocity
	const rvx = (bodyB ? bodyB.vel.x : 0) - bodyA.vel.x;
	const rvy = (bodyB ? bodyB.vel.y : 0) - bodyA.vel.y;
	const relVel = rvx * normal.x + rvy * normal.y;
	// TODO this line seems to be a source of the problem. enable it and see that bouncing stops working
	// if (relVel > 0) return; // Bodies are separating, no impulse needed
	// Restitution (bounciness), average of the two
	const restitution = (bodyA.bounce + bodyB.bounce) * 0.5;
	// Impulse magnitude
	const invMassA = bodyA.dynamic ? 1 / bodyA.mass : 0;
	const invMassB = (bodyB && bodyB.dynamic) ? 1 / bodyB.mass : 0;
	const j = -(1 + restitution) * relVel / (invMassA + invMassB || 1);
	// Apply impulse
	if (bodyA.dynamic) {
		bodyA.vel.x -= (j * normal.x) * invMassA;
		bodyA.vel.y -= (j * normal.y) * invMassA;
	}
	if (bodyB && bodyB.dynamic) {
		bodyB.vel.x += (j * normal.x) * invMassB;
		bodyB.vel.y += (j * normal.y) * invMassB;
	}
}
export function intersects(a, b) {
	// return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
	return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}
export function contains(a, b) {
	return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
}
function bboxArea(a) { return (a.maxX - a.minX) * (a.maxY - a.minY); }
function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }
function enlargedArea(a, b) {
	return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
		(Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}
function intersectionArea(a, b) {
	const minX = Math.max(a.minX, b.minX);
	const minY = Math.max(a.minY, b.minY);
	const maxX = Math.min(a.maxX, b.maxX);
	const maxY = Math.min(a.maxY, b.maxY);
	return Math.max(0, maxX - minX) *
		Math.max(0, maxY - minY);
}
// check if they share any collision layers, if they dont then they pass right through each other and are not even considered intersecting either (which is for the purpose of triggers, a trigger can only be triggered if you share a layer with the trigger)
export function sameLayer(a, b) {

}
