export function separate(body,body2) {
	let shape = body.shape
	let shape2 = body2.shape
	if (!body.dynamic || shape.trigger || shape2.trigger) return;
	// Calculate overlap on each axis
	const overlapX = Math.min(shape.maxX - shape2.minX, shape2.maxX - shape.minX);
	const overlapY = Math.min(shape.maxY - shape2.minY, shape2.maxY - shape.minY);
	// If there's no overlap, return
	if (overlapX <= 0 || overlapY <= 0) {
		return;
	}
	// Separate along the axis with the smallest overlap
	if (overlapX < overlapY) {
		// X-axis separation
		const midX1 = (shape.minX + shape.maxX) / 2;
		const midX2 = (shape2.minX + shape2.maxX) / 2;
		if (midX1 < midX2) {
			shape.minX -= overlapX;
			shape.maxX -= overlapX;
		} else {
			shape.minX += overlapX;
			shape.maxX += overlapX;
		}
	} else {
		// Y-axis separation
		const midY1 = (shape.minY + shape.maxY) / 2;
		const midY2 = (shape2.minY + shape2.maxY) / 2;
		if (midY1 < midY2) {
			shape.minY -= overlapY;
			shape.maxY -= overlapY;
		} else {
			shape.minY += overlapY;
			shape.maxY += overlapY;
		}
	}
	// its important not to set body.x/y here so long as those remain setters because they do things that interfere and make it janky so we do it this way to avoid the setters
	body.pos.x = shape.minX
	body.pos.y = shape.minY
	body.markShapeChanged()
}
// TODO has to work on circles too by checking if it has a defined .r property
// TODO has to return a separation data object for separate() to use
// TODO has to use sameLayer to check if the objects share any layer, if not theyre not intersecting
export function intersects(a, b) {
	return !notIntersects(a, b)
}
// supposedly using this is faster because || instead of &&. !notIntersects() means they do intersect
export function notIntersects(a, b) {
	return b.minX > a.maxX || b.minY > a.maxY || b.maxX < a.minX || b.maxY < a.minY
}
// TODO make work on circles
// TODO integrate sameLayer check
export function contains(a, b) {
	return !(b.minX < a.minX || b.minY < a.minY || b.maxX > a.maxX || b.maxY > a.maxY)
}
// check if they share any collision layers, if they dont then they pass right through each other and are not even considered intersecting either (which is for the purpose of triggers, a trigger can only be triggered if you share a layer with the trigger)
export function sameLayer(a, b) {

}
