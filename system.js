import { Body } from "./body.js";
import { PADDING } from "./const.js";
import RBush from "./external/rbush.js";
import { sepForce, contains, intersects, separate } from "./intersect.js";
export class System extends RBush {
	bodies = [] // TODO this can be a Set if we never need to iterate over it
	dynamics = []
	statics = []
	restThreshold = 0.0001
	constructor(maxEntries = 9, worldBounds = { minX: -Infinity, minY: -Infinity, maxX: Infinity, maxY: Infinity }) {
		super(maxEntries)
		this.tree = new RBush(9)
		this.worldBounds = worldBounds
	}
	update(dt) {
		dt = Math.min(dt, 1 / 10) // cap dt to prevent tunneling and far distance teleporting from one slow frame
		for (let body of this.dynamics) {
			if (!body.active) continue;
			body.vel.x += body.accel.x / body.mass * dt;
			body.vel.y += body.accel.y / body.mass * dt;
			body.vel.x += body.impulse.x / body.mass;
			body.vel.y += body.impulse.y / body.mass;
			let damp = Math.exp(-body.damping * dt);
			// let damp = Math.pow(1 - body.damping, dt); // TODO seems like if damping is 1 you literally can not move ever no matter the forces above
			body.vel.x *= damp;
			body.vel.y *= damp;
			// TODO add a per body max speed option
			// TODO have a speed property on the body to show you how fast its going, not calculated here but probably a getter on the body that calculates as needed
			let max = 100
			if (body.vel.x > max) body.vel.x = max
			if (body.vel.y > max) body.vel.y = max
			if (body.vel.x < -max) body.vel.x = -max
			if (body.vel.y < -max) body.vel.y = -max
			let addX = body.vel.x * dt;
			let addY = body.vel.y * dt;
			if (addX || addY) body.shape.setPos(body.shape.minX + addX, body.shape.minY + addY);
			if (Math.abs(body.vel.x) < this.restThreshold) body.vel.x = 0;
			if (Math.abs(body.vel.y) < this.restThreshold) body.vel.y = 0;
			body.accel.x = 0;
			body.accel.y = 0;
			body.impulse.x = 0;
			body.impulse.y = 0;
			if (body.shape.shapeChanged) {
				let potentials = this.tree.search(body.shape);
				for (let bb of potentials) {
					if (bb.shape.body === body) continue;
					if (intersects(body.shape, bb.shape)) {
						let sep = separate(body.shape, bb.shape);
						if (sep) sepForce(body, bb.shape.body, sep);
					}
				}
				if (!PADDING || !contains(body.shape.bb, body.shape)) {
					this.tree.remove(body.shape.bb);
					body.shape.refreshBB(body.dynamic);
					this.tree.insert(body.shape.bb);
				}
				body.shape.shapeChanged = false;
			}
		}
	}
	create(config) {
		config.system = this
		let body = new Body(config)
		this.tree.insert(body.shape.bb)
		this.bodies.push(body)
		config.dynamic == true ? this.dynamics.push(body) : this.statics.push(body)
		return body
	}
	collides(body) {
		return this.tree.collides(body.shape)
	}
}