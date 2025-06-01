// TODO has to work on circles too by checking if it has a defined .r property
// TODO has to return a separation data object for separate() to use?
// TODO has to use sameLayer to check if the objects share any layer, if not theyre not intersecting

// mine, the other is ai
export function separate2(shape, shape2) {
	if (!shape.body.dynamic || shape.trigger || shape2.trigger) return;
	// Calculate overlap on each axis
	const overlapX = Math.min(shape.maxX - shape2.minX, shape2.maxX - shape.minX);
	const overlapY = Math.min(shape.maxY - shape2.minY, shape2.maxY - shape.minY);
	// If there's no overlap, return
	if (overlapX <= 0 || overlapY <= 0) {
		return;
	}
	let minX = shape.minX, minY = shape.minY, maxX = shape.maxX, maxY = shape.maxY;
	// Separate along the axis with the smallest overlap
	if (overlapX < overlapY) {
		// X-axis separation
		const midX1 = (minX + maxX) / 2;
		const midX2 = (shape2.minX + shape2.maxX) / 2;
		if (midX1 < midX2) {
			minX -= overlapX;
			maxX -= overlapX;
		} else {
			minX += overlapX;
			maxX += overlapX;
		}
	} else {
		// Y-axis separation
		const midY1 = (minY + maxY) / 2;
		const midY2 = (shape2.minY + shape2.maxY) / 2;
		if (midY1 < midY2) {
			minY -= overlapY;
			maxY -= overlapY;
		} else {
			minY += overlapY;
			maxY += overlapY;
		}
	}
	shape.setPos(minX, minY)
}
// ai example
// Returns {normal: {x, y}, overlap: value, axis: 'x'|'y'} or null if no overlap
export function separate(shapeA, shapeB, bodyA, bodyB) {
	if (!bodyA.dynamic || shapeA.trigger || shapeB.trigger) return null;
	// Calculate overlap on both axes
	const overlapX = Math.min(shapeA.maxX, shapeB.maxX) - Math.max(shapeA.minX, shapeB.minX);
	const overlapY = Math.min(shapeA.maxY, shapeB.maxY) - Math.max(shapeA.minY, shapeB.minY);
	if (overlapX <= 0 || overlapY <= 0) return null; // no overlap
	// Find axis of minimum penetration
	let sepX = 0, sepY = 0;
	let normal = { x: 0, y: 0 };
	let axis;
	if (overlapX < overlapY) {
		axis = 'x';
		// Move along X axis, normal points from A to B
		const midA = (shapeA.minX + shapeA.maxX) / 2;
		const midB = (shapeB.minX + shapeB.maxX) / 2;
		if (midA < midB) {
			sepX = -overlapX;
			normal.x = -1;
		} else {
			sepX = overlapX;
			normal.x = 1;
		}
	} else {
		axis = 'y';
		// Move along Y axis, normal points from A to B
		const midA = (shapeA.minY + shapeA.maxY) / 2;
		const midB = (shapeB.minY + shapeB.maxY) / 2;
		if (midA < midB) {
			sepY = -overlapY;
			normal.y = -1;
		} else {
			sepY = overlapY;
			normal.y = 1;
		}
	}
	// Move both bodies proportionally to mass if both are dynamic, else move only A
	let totalMass = (bodyA.dynamic ? bodyA.mass : 0) + (bodyB && bodyB.dynamic ? bodyB.mass : 0);
	let amtA = 1, amtB = 0;
	if (bodyA.dynamic && bodyB && bodyB.dynamic && totalMass > 0) {
		amtA = bodyB.mass / totalMass;
		amtB = bodyA.mass / totalMass;
	}
	if (bodyA.dynamic) shapeA.setPos(shapeA.minX + sepX * amtA, shapeA.minY + sepY * amtA);
	if (bodyB && bodyB.dynamic) shapeB.setPos(shapeB.minX - sepX * amtB, shapeB.minY - sepY * amtB);
	return { normal, overlap: axis === 'x' ? Math.abs(overlapX) : Math.abs(overlapY), axis };
}
// Standard restitution and impulse-based collision response for AABBs
export function applyImpulse(bodyA, bodyB, sep) {
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
