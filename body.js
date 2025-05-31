import { intersects, separate } from "./intersect.js"
import { Box } from "./shape.js"
// TODO signs point to static and dynamic bodies needing to be separate classes. too many things will need conditionally checked and be slow. for example you're not even allowed to move static objects by x/y after creation
export class Body {
	constructor(config) {
		this.system = config.system
		// TODO make active flag actually do something
		this.active = config.active ?? true // false = accel/vel wont be applied this tick and body is noncollidable
		this.dynamic = config.dynamic ?? true
		this.pos = config.pos ?? { x: 0, y: 0 }
		this.accel = config.accel ?? { x: 0, y: 0 }
		this.vel = config.vel ?? { x: 0, y: 0 }
		this.speed = config.speed ?? 0
		this.maxSpeed = config.maxSpeed ?? Infinity
		this.angle = config.angle ?? 0 // exists solely for the move() function right now, has nothing to do with rotation
		this.damping = config.damping ?? 0
		this.bounce = config.bounce ?? 0
		this.scale = config.scale ?? { x: 1, y: 1 }
		this.shape = config.shape ?? new Box(this.pos.x, this.pos.y, this.scale.x, this.scale.y)
		this.shape.body = this
		if (config.scale) {
			this.shape.refresh(this.pos.x, this.pos.y, this.scale.x, this.scale.y)
		}
	}
	// the reason bodies have their own intersects/separates functions is to handle compound colliders. whereas shapes their own individual functions too
	intersects(body) {
		return intersects(this.shape, body.shape)
	}
	separate(body){
		return separate(this.shape, body.shape)
	}
	get x() {
		return this.pos.x;
	}
	set x(x) {
		this.pos.x = x;
		this.shapeChanged = true
	}
	get y() {
		return this.pos.y;
	}
	set y(y) {
		this.pos.y = y;
		this.shapeChanged = true
	}
	move(speed = 1) {
		const moveX = Math.cos(this.angle) * speed;
		const moveY = Math.sin(this.angle) * speed;
		this.translate(moveX, moveY)
	}
	setPos(x, y) {
		this.pos.x = x
		this.pos.y = y
		this.shapeChanged = true
		return this
	}
	translate(x, y) {
		this.setPos(this.x + x, this.y + y)
		return this
	}
	setAccel() {

	}
	setVel() {

	}
	setScale(x, y) {
		this.scale.x = x
		this.scale.y = y
		this.shapeChanged = true
		return this
	}
}