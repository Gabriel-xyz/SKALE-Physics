export function separate(shape, shape2) {
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
// TODO has to work on circles too by checking if it has a defined .r property
// TODO has to return a separation data object for separate() to use?
// TODO has to use sameLayer to check if the objects share any layer, if not theyre not intersecting
export function contains(a, b) {
	return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
}
export function intersects(a, b) {
	return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
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
