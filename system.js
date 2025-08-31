import { Body } from "./body.js";
import { PADDING } from "./const.js";
import RBush from "./external/rbush-optimized.js";
import { sepForce, contains, intersects, separate } from "./intersect.js";
export class Skale extends RBush {
	bodies = []
	dynamics = []
	statics = []
	awakes = []
	restThreshold = 0.3
	constructor(mapSize = 500, maxEntries = 11, minEntries = 2) {
		super(maxEntries, minEntries)
		this.mapSize = mapSize
	}
	step(dt, tick) {
		dt = Math.min(dt, 1 / 20) // cap dt to prevent tunneling and far distance teleporting from one slow frame
		let now = performance.now()
		let restThreshold = this.restThreshold
		for (let i = 0; i < this.awakes.length; i++) {
			let body = this.awakes[i]
			// im curious if removing inactive bodies from the awakes array entirely would result in a speedup. supposedly it will according to some youtube guy
			if (!body.active) continue;
			let { vel, accel, impulse, shape, mass, damping } = body
			vel.x += accel.x / mass * dt;
			vel.y += accel.y / mass * dt;
			vel.x += impulse.x / mass;
			vel.y += impulse.y / mass;
			let addX = vel.x * dt;
			let addY = vel.y * dt;
			if (addX || addY) shape.setPos(shape.minX + addX, shape.minY + addY);
			let damp = Math.exp(-damping * dt)
			vel.x *= damp;
			vel.y *= damp;
			if (Math.abs(vel.x) < restThreshold * dt) vel.x = 0;
			if (Math.abs(vel.y) < restThreshold * dt) vel.y = 0;
			accel.x = 0;
			accel.y = 0;
			impulse.x = 0;
			impulse.y = 0;
			if (shape.shapeChanged) {
				body.shapeChangedTime = now
				let potentials = this.search(shape) // this is literally 95% of all cpu usage per tick. i tried doing a bigger search then if nothing was anywhere close i would skip using search() for 3 ticks but that made it slower because a bigger search area takes longer, so much so that it was overall slower even if you skip 3 frames when you dont find anything
				for (let i2 = 0; i2 < potentials.length; i2++) {
					let shape2 = potentials[i2].shape
					if (shape2.body === body) continue;
					if ((body.collisionMask & shape2.body.layerMask) && intersects(shape, shape2)) {
						let sep = separate(shape, shape2);
						if (sep) sepForce(body, shape2.body, sep);
					}
				}
				this.collideWorldBounds(body)
				let bb = shape.bb
				if (!PADDING || !contains(bb, shape)) {
					this.remove(bb);
					shape.refreshBB(body.dynamic);
					this.insert(bb);
				}
				shape.shapeChanged = false;
			}
			if (now - body.shapeChangedTime > 20) {
				if (!body.sleeping) i--
				body.sleep(i)
			}
		}
	}
	collideWorldBounds(body) {
		let mapSize = this.mapSize
		let { vel, shape, bounce } = body
		let { minX, maxX, minY, maxY } = shape
		if (minX < 0) {
			shape.setPos(0, minY);
			vel.x = -vel.x * bounce
		}
		if (maxX > mapSize) {
			shape.setPos(minX - (maxX - mapSize), minY);
			vel.x = -vel.x * bounce
		}
		if (minY < 0) {
			shape.setPos(minX, 0);
			vel.y = -vel.y * bounce
		}
		if (maxY > mapSize) {
			shape.setPos(minX, minY - (maxY - mapSize));
			vel.y = -vel.y * bounce
		}
	}
	create(config) {
		config.system = this
		let body = new Body(config)
		this.insert(body.shape.bb)
		this.bodies.push(body)
		config.dynamic ? this.dynamics.push(body) : this.statics.push(body)
		if (config.dynamic) this.awakes.push(body)
		return body
	}
}