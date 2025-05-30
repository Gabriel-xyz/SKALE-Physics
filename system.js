import { Body } from "./body.js";
import RBush from "./external/rbush.js";
import { contains, intersects, separate } from "./intersect.js";
export class System extends RBush {
	bodies = []
	constructor(maxEntries = 9) {
		super(maxEntries)
	}
	update(dt) {
		// TODO after optimizing my current system, i still need to test it against clearing and rebuilding the rtree every tick and see which is faster
		// move things according to their velocity
		// clear rtree?
		// loop through all bodies whose bb changed
		// get broadphase potentials
		// check intersection and do separation
		// rebuild rtree?

		let body, potentials, bb
		// TODO check performance impact of iterating all bodies versus iterating dynamic array and static array separately
		for (let i = 0; i < this.bodies.length; i++) {
			body = this.bodies[i]
			if (!body.shapeChanged || !body.dynamic || !body.active) continue
			potentials = this.search(body) // TODO how am i supposed to deal with the fact that search() returns bounding boxies not bodies. it doesnt even return shapes it returns actual bounding boxes
			// TODO would that trick where you do while()/pop() make this faster?
			// TODO surprising intersects() and separate() and this entire loop in general have almost no performance impact. comment it out and see
			for (let i2 = 0; i2 < potentials.length; i2++) {
				bb = potentials[i2]
				if(bb.shape.body == body) continue
				if (intersects(body.shape, bb.shape.body)) {
					separate(body, bb)
				}
			}
			body.shapeChanged = false
		}
	}
	createBody(config) {
		config.system = this
		let body = new Body(config)
		this.insert(body)
		return body
	}
	bodyRemoveCount = 0
	insert(body) {
		if (!body.inserted) this.bodies.push(body)
		let shape = body.shape
		if (body.inserted) {
			if(contains(shape.bb,shape)) return shape.bb // no need to remove and reinsert if body has not moved beyond its padded bb
			super.remove(shape.bb)
			this.bodyRemoveCount++
		}
		shape.refreshBB()
		body.inserted = true
		return super.insert(shape.bb)
	}
	// TODO i need a preexisting array of all shapes for this to work efficiently so i dont have to create an array of all shapes every tick just to use this function
	load(shapes) {
		super.load(shapes)
	}
	remove(body) {
		if (body.inserted) {
			this.bodies.splice(this.bodies.indexOf(body), 1)
		}
		body.inserted = false
		super.remove(body.shape.bb)
	}
	search(body) {
		return super.search(body.shape) // yep you read that right im pretty sure we search against the shape not the shape's bb
	}
	// TODO i dont suspect this will be much use but it could be worth testing as a phase BEFORE using search() to see if theres even any reason to search, which may be an optimization depending how much faster collides() is than search()
	collides(body) {
		return super.collides(body.shape) // yes, shape, not bb
	}
	getPotentials(body) {
		return filter(this.search(body), candidate => candidate !== body.shape.bb)
	}
}