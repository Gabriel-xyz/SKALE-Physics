import { Body } from "./body.js";
import { PADDING } from "./const.js";
import RBush from "./external/rbush.js";
import { applyImpulse, contains, intersects, separate } from "./intersect.js";
export class System extends RBush {
	bodies = []
	dynamics = []
	statics = []
	constructor(maxEntries = 9) {
		super(maxEntries)
		this.dynamicTree = new RBush(10)
	}
	update(dt) {
		for (let body of this.dynamics) {
			if (!body.active) continue;
			body.vel.x += body.accel.x * dt;
			body.vel.y += body.accel.y * dt;
			body.vel.x += body.impulse.x / body.mass;
			body.vel.y += body.impulse.y / body.mass;
			let damp = Math.pow(1 - body.damping, dt);
			body.vel.x *= damp;
			body.vel.y *= damp;
			let addX = body.vel.x * dt;
			let addY = body.vel.y * dt;
			if (addX || addY) {
				body.shape.setPos(body.shape.minX + addX, body.shape.minY + addY);
			}
			// if (Math.abs(body.vel.x) < 0.001) body.vel.x = 0;
			// if (Math.abs(body.vel.y) < 0.001) body.vel.y = 0;
			body.accel.x = 0;
			body.accel.y = 0;
			body.impulse.x = 0;
			body.impulse.y = 0;
			if (body.shape.shapeChanged) {
				let potentials = this.dynamicTree.search(body.shape);
				for (let bb of potentials) {
					if (bb.shape.body === body) continue;
					if (intersects(body.shape, bb.shape)) {
						const sep = separate(body.shape, bb.shape, body, bb.shape.body);
						if (sep) {
							applyImpulse(body, bb.shape.body, sep.normal, sep);
						}
					}
				}
				if (!PADDING || !contains(body.shape.bb, body.shape)) {
					this.remove(body);
					body.shape.refreshBB(body.dynamic);
					this.insert(body);
				}
				body.shape.shapeChanged = false;
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