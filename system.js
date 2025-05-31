import { Body } from "./body.js";
import RBush from "./external/rbush.js";
import { contains } from "./intersect.js";
export class System extends RBush {
	bodies = []
	dynamics = []
	statics = []
	constructor(maxEntries = 9) {
		super(maxEntries)
		this.staticTree = new RBush(10)
		this.dynamicTree = new RBush(18)
	}
	// TODO i suspect there is something incorrect in the intersect or separate function, by looking at the simulation in the browser
	update(dt) {
		// TODO two trees is 123 fps. one tree is 150 fps. ive thoroughly tested two trees versus one and one is always faster
		for (let body of this.dynamics) {
			// if (!body.active) continue
			// velocity etc gets applied here
			if (body.shapeChanged) {
				body.shape.refresh(body.pos.x, body.pos.y, body.scale.x, body.scale.y)
				// this is the 'padding' optimization. a shape does not need reinserted if it is still contained in its bounding box after moving
				if (!contains(body.shape.bb, body.shape)) {
					this.system.remove(body)
					this.system.insert(body)
				}
				// let potentials = [...this.dynamicTree.search(body.shape), ...this.staticTree.search(body.shape)]
				let potentials = this.dynamicTree.search(body.shape)
				for (let bb of potentials) {
					if (bb.shape.body == body) continue
					if (body.intersects(bb.shape.body)) {
						body.separate(bb.shape.body)
					}
				}
				body.shapeChanged = false // its possible we need to leave this to true if a separation occurred so it can run separation again next tick, false if no separation occurred
			}
		}
	}
	createBody(config) {
		config.system = this
		let body = new Body(config)
		this.insert(body)
		this.bodies.push(body)
		config.dynamic == true ? this.dynamics.push(body) : this.statics.push(body)
		return body
	}
	insert(body) {
		// body.dynamic == true ? this.dynamicTree.insert(body.shape.bb) : this.staticTree.insert(body.shape.bb)
		this.dynamicTree.insert(body.shape.bb)
	}
	remove(body) {
		// body.dynamic == true ? this.dynamicTree.remove(body.shape.bb) : this.staticTree.remove(body.shape.bb)
		this.dynamicTree.remove(body.shape.bb)
	}
	// TODO optimization idea, make rbush.search use a reusable array instead of making a new one every query
	search(body) {
		return super.search(body.shape)
	}
	// TODO i dont suspect this will be much use but it could be worth testing as a phase BEFORE using search() to see if theres even any reason to search, which may be an optimization depending how much faster collides() is than search()
	collides(body) {
		return super.collides(body.shape)
	}
}