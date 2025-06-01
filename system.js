import { Body } from "./body.js";
import { PADDING } from "./const.js";
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
		for (let body of this.dynamics) {
			if (!body.active) continue
			body.vel.x += body.accel.x
			body.vel.y += body.accel.y
			let addX = body.vel.x * dt + body.impulse.x
			let addY = body.vel.y * dt + body.impulse.y
			if (addX || addY) body.shape.setPos(body.shape.minX + addX, body.shape.minY + addY)
			body.vel.x *= 1 - body.damping
			body.vel.y *= 1 - body.damping
			if (body.vel.x < 0.0001) body.vel.x = 0
			if (body.vel.y < 0.0001) body.vel.y = 0
			body.accel.x = 0
			body.accel.y = 0
			body.impulse.x = 0
			body.impulse.y = 0
			if (body.shape.shapeChanged) {
				let potentials
				potentials = this.dynamicTree.search(body.shape)
				for (let bb of potentials) {
					if (bb.shape.body == body) continue
					if (body.intersects(bb.shape.body)) {
						body.separate(bb.shape.body)
					}
				}
				if (!PADDING || !contains(body.shape.bb, body.shape)) {
					this.remove(body)
					body.shape.refreshBB(body.dynamic)
					this.insert(body)
				}
				body.shape.shapeChanged = false
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
		this.dynamicTree.insert(body.shape.bb)

	}
	remove(body) {
		this.dynamicTree.remove(body.shape.bb)
	}
	collides(body) {
		return this.dynamicTree.collides(body.shape)
	}
}