import { intersects, separate } from "./intersect.js"
import { Box } from "./shape.js"
// TODO signs point to static and dynamic bodies needing to be separate classes. too many things will need conditionally checked and be slow. for example you're not even allowed to move static objects by x/y after creation
// IMPORTANT: turns out Bodies dont have multiple Shapes (compound colliders), instead GameObjects have multiple Bodies (compound bodies) each with one Shape. think about it, if Bodies have multiple Shapes then those Shapes are stuck in formation, they cant move physically independently of each other because only bodies physically move, for example some spider monster with procedural physically moving legs, Bodies move physically not Shapes. so the GameObject has multiple Bodies and GameObject will have its own move()/etc functions that call the same function on all of its bodies at once (aka gameobject.move() calls body.move() for each body) that move all its bodies at once, and other functions to move specific bodies in its compound body, using physics, or setting its position depending on context, both for example for spider legs.
export class Body {
	vel = { x: 0, y: 0 }
	accel = { x: 0, y: 0 }
	impulse = { x: 0, y: 0 }
	constructor(config) {
		this.system = config.system
		this.dynamic = config.dynamic ?? true
		this.shape = config.shape ?? new Box(config, this)
		// TODO make active flag actually do something
		this.active = config.active ?? true // false = accel/vel wont be applied this tick and body is noncollidable
		this.maxSpeed = config.maxSpeed ?? Infinity
		this.angle = config.angle ?? 0 // exists solely for the move() function right now, has nothing to do with rotation
		this.damping = config.damping ?? 0.3
		this.bounce = config.bounce ?? 0.7
		this.mass = config.mass ?? 1
	}
	// the reason bodies have their own intersects/separates functions is to handle compound colliders. whereas shapes their own individual functions too
	// TODO uhh actually bodies dont have compound colliders, gameobjects would have compound bodies
	intersects(body) {
		return intersects(this.shape, body.shape)
	}
	separate(body) {
		return separate(this.shape, body.shape)
	}
	get x() {
		return this.shape.minX;
	}
	set x(x) {
		this.shape.setPos(x, this.shape.minY)
	}
	get y() {
		return this.shape.minY;
	}
	set y(y) {
		this.shape.setPos(this.shape.minX, y)
	}
	setPos(x, y) {
		this.shape.setPos(x, y)
		return this
	}
	translate(x, y) {
		this.shape.setPos(this.shape.minX + x, this.shape.minY + y)
		return this
	}
	move(speed = 0) {
		let moveX = Math.cos(this.angle) * speed;
		let moveY = Math.sin(this.angle) * speed;
		this.accel.x = moveX
		this.accel.y = moveY
	}
	setAccel(x, y) {
		this.accel.x = x
		this.accel.y = y
	}
	setVel(x, y) {
		this.vel.x = x
		this.vel.y = y
	}
	addForce(x, y) {
		this.vel.x += x
		this.vel.y += y
	}
	addImpulse(x, y) {
		this.impulse.x += x;
		this.impulse.y += y;
	}
	setScale(x, y) {
		this.shape.setScale(x, y)
		return this
	}
}