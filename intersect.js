// TODO never separate static bodies or triggers, idk if this is where i would check the static flag or elsewhere
export function separate(a, b) {

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
// TODO this function is worthless if i intend to clear and rebuild the tree every tick
export function contains(a, b) {
	return !(b.minX < a.minX || b.minY < a.minY || b.maxX > a.maxX || b.maxY > a.maxY)
}
// check if they share any collision layers, if they dont then they pass right through each other and are not even considered intersecting either (which is for the purpose of triggers, a trigger can only be triggered if you share a layer with the trigger)
export function sameLayer(a, b) {

}