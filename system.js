import { Body } from "./body.js";
import { PADDING } from "./consts.js";
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
	update(dt) {
		// TODO. try different padding. try two trees vs one. see if collides() is faster or slower
		for (let body of this.dynamics) {
			if (!body.active) continue
			// velocity etc gets applied here
			if (body.shapeChanged) {
				body.shape.refreshShape(body.pos.x, body.pos.y, body.scale.x, body.scale.y)
				if (!PADDING || !contains(body.shape.bb, body.shape)) {
					this.remove(body)
					body.shape.refreshBB()
					this.insert(body)
				}
				if (this.collides(body)) {
					// let potentials = [...this.dynamicTree.search(body.shape), ...this.staticTree.search(body.shape)]
					let potentials = this.dynamicTree.search(body.shape)
					for (let bb of potentials) {
						if (bb.shape.body == body) continue
						if (body.intersects(bb.shape.body)) {
							body.separate(bb.shape.body)
						}
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
	collides(body) {
		// return this.dynamicTree.collides(body.shape) || this.staticTree.collides(body.shape)
		return this.dynamicTree.collides(body.shape)
	}
}