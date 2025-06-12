import { ALL_LAYERS } from "./layers.js"
import { Box } from "./shape.js"
export class Body {
	// TODO i noticed that if you set any of these properties directly it will not awaken the body but maybe you should only ever use the setters/functions anyway idk
	vel = { x: 0, y: 0 }
	accel = { x: 0, y: 0 }
	impulse = { x: 0, y: 0 }
	layerMask = ALL_LAYERS // what bodies collide with you
	collisionMask = ALL_LAYERS // what bodies you collide with
	constructor(config) {
		this.system = config.system
		this.dynamic = config.dynamic ?? true
		this.shape = config.shape ?? new Box(config, this)
		this.active = config.active ?? true
		this.angle = config.angle ?? 0 // exists solely for the move() function, has nothing to do with rotation
		this.damping = config.damping ?? 0.5
		this.bounce = config.bounce ?? 0.8
		this.mass = config.mass ?? 1
		this.layerMask = config.layerMask ?? this.layerMask
		this.collisionMask = config.collisionMask ?? this.collisionMask
		this.shapeChangedTime = 0 // TODO this might be better on the shape instead (or not, because compound colliders? idk)
	}
	sleep(knownIndex) {
		if (this.sleeping) return
		this.sleeping = true
		let a = this.system.awakes
		let i = knownIndex ?? a.indexOf(this)
		a[i] = a.pop()
	}
	awake() {
		if (!this.sleeping) return
		this.sleeping = false
		this.system.awakes.push(this)
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
		this.awake()
	}
	setAccel(x, y) {
		this.accel.x = x
		this.accel.y = y
		this.awake()
	}
	setVel(x, y) {
		this.vel.x = x
		this.vel.y = y
		this.awake()
	}
	addForce(x, y) {
		this.vel.x += x
		this.vel.y += y
		this.awake()
	}
	addImpulse(x, y) {
		this.impulse.x += x;
		this.impulse.y += y;
		this.awake()
	}
	setScale(x, y) {
		this.shape.setScale(x, y)
	}
}