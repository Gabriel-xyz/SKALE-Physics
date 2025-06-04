import { Body } from "./body.js";
import { PADDING } from "./const.js";
import RBush from "./external/rbush.js";
import { sepForce, contains, intersects, separate } from "./intersect.js";
export class System extends RBush {
	bodies = []
	dynamics = []
	statics = []
	restThreshold = 0.01
	constructor(mapSize = 500, maxEntries = 10, minEntries = 2) {
		super(maxEntries, minEntries)
		this.mapSize = mapSize
	}
	update(dt) {
		dt = Math.min(dt, 1 / 10) // cap dt to prevent tunneling and far distance teleporting from one slow frame
		for (let body of this.dynamics) {
			if (!body.active) continue;
			body.vel.x += body.accel.x / body.mass * dt;
			body.vel.y += body.accel.y / body.mass * dt;
			body.vel.x += body.impulse.x / body.mass;
			body.vel.y += body.impulse.y / body.mass;
			let addX = body.vel.x * dt;
			let addY = body.vel.y * dt;
			if (addX || addY) body.shape.setPos(body.shape.minX + addX, body.shape.minY + addY);
			let damp = Math.exp(-body.damping * dt)
			body.vel.x *= damp;
			body.vel.y *= damp;
			if (Math.abs(body.vel.x) < this.restThreshold) body.vel.x = 0;
			if (Math.abs(body.vel.y) < this.restThreshold) body.vel.y = 0;
			body.accel.x = 0;
			body.accel.y = 0;
			body.impulse.x = 0;
			body.impulse.y = 0;
			// TODO i think i forgot to ignore triggers, that'd make it faster
			if (body.shape.shapeChanged) {
				let potentials = this.search(body.shape);
				for (let bb of potentials) {
					if (bb.shape.body === body) continue;
					if (intersects(body.shape, bb.shape)) {
						let sep = separate(body.shape, bb.shape);
						if (sep) sepForce(body, bb.shape.body, sep);
					}
				}
				this.collideWorldBounds(body)
				if (!PADDING || !contains(body.shape.bb, body.shape)) {
					this.remove(body.shape.bb);
					body.shape.refreshBB(body.dynamic);
					this.insert(body.shape.bb);
				}
				body.shape.shapeChanged = false;
			}
		}
	}
	collideWorldBounds(body) {
		if (body.shape.minX < 0) {
			body.shape.setPos(0, body.shape.minY);
			body.vel.x = -body.vel.x * body.bounce
		}
		if (body.shape.maxX > this.mapSize) {
			body.shape.setPos(body.shape.minX - (body.shape.maxX - this.mapSize), body.shape.minY);
			body.vel.x = -body.vel.x * body.bounce
		}
		if (body.shape.minY < 0) {
			body.shape.setPos(body.shape.minX, 0);
			body.vel.y = -body.vel.y * body.bounce
		}
		if (body.shape.maxY > this.mapSize) {
			body.shape.setPos(body.shape.minX, body.shape.minY - (body.shape.maxY - this.mapSize));
			body.vel.y = -body.vel.y * body.bounce
		}
	}
	create(config) {
		config.system = this
		let body = new Body(config)
		this.insert(body.shape.bb)
		this.bodies.push(body)
		config.dynamic == true ? this.dynamics.push(body) : this.statics.push(body)
		return body
	}
}