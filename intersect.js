export function separate(shape,shape2) {
	if (!shape.body.dynamic || shape.trigger || shape2.trigger) return;
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
	shape.body.pos.x = shape.minX
	shape.body.pos.y = shape.minY
}
// TODO has to work on circles too by checking if it has a defined .r property
// TODO has to return a separation data object for separate() to use?
// TODO has to use sameLayer to check if the objects share any layer, if not theyre not intersecting
export function intersects(box1, box2) {
    return (box1.maxX >= box2.minX && box1.minX <= box2.maxX) && (box1.maxY >= box2.minY && box1.minY <= box2.maxY);
}
// TODO make work on circles
// TODO integrate sameLayer check
export function contains(shape, shape2) {
	return !(shape2.minX < shape.minX || shape2.minY < shape.minY || shape2.maxX > shape.maxX || shape2.maxY > shape.maxY)
}
// check if they share any collision layers, if they dont then they pass right through each other and are not even considered intersecting either (which is for the purpose of triggers, a trigger can only be triggered if you share a layer with the trigger)
export function sameLayer(a, b) {

}
