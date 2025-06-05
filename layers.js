export const ALL_LAYERS = 0xFFFFFFFF
// example of defining layers. projects using this would define their own layers. only layers 0-31 are valid
export const LAYER1 = 1 << 0
export const LAYER2 = 1 << 1
export const LAYER3 = 1 << 2
// body.collisionMask = EXAMPLE_LAYER_0 | EXAMPLE_LAYER_1 (this means it collides on layer 0 and 1 but not 2)
// body.collisionMask = ALL_LAYERS

// if collisionMask of one body shares layer with layerMask of another body, then the first body can collide with the second body
export const layersCollide = (collisionMask, layerMask) => collisionMask & layerMask
export function setLayerMask(body, layers = []) {
	body.layerMask = 0;
	for (let layer of layers) {
		if (layer >= 0 && layer < 32) {
			this.layerMask |= (1 << layer);
		}
	}
}
// sometimes it would be convenient to just pass in [body.layerMask] to make them match
export function setCollisionMask(body, layers = []) {
	body.collisionMask = 0;
	for (let layer of layers) {
		if (layer >= 0 && layer < 32) {
			body.collisionMask |= (1 << layer);
		}
	}
}
export function addLayerMask(body, layer) {
	if (layer >= 0 && layer < 32) {
		body.layerMask |= (1 << layer);
	}
}
export function removeLayerMask(body, layer) {
	if (layer >= 0 && layer < 32) {
		body.layerMask &= ~(1 << layer);
	}
}
export function addCollisionMask(body, layer) {
	if (layer >= 0 && layer < 32) {
		body.collisionMask |= (1 << layer);
	}
}
export function removeCollisionMask(body, layer) {
	if (layer >= 0 && layer < 32) {
		body.collisionMask &= ~(1 << layer);
	}
}