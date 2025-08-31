import { ALL_LAYERS } from "./layers.js"
import { Box } from "./shape.js"
export class Body {
	// TODO turns out you can use object destructuring in the constructor like this and it would probably look better: class Person {
//     constructor({ name = "Unknown", age = 0 } = {}) {
//         this.name = name;
//         this.age = age;
//     }
// }
	constructor(config) {
		this.system = config.system
		this.shape = config.shape ?? new Box(config, this)
		// TODO i noticed that if you set any of these properties directly it will not awaken the body but maybe you should only ever use the setters/functions anyway idk
		this.vel = { x: 0, y: 0 }
		this.accel = { x: 0, y: 0 }
		this.impulse = { x: 0, y: 0 }
		this.angle = config.angle ?? 0 // exists solely for the move() function, has nothing to do with rotation
		this.damping = config.damping ?? 1
		this.bounce = config.bounce ?? 1
		this.mass = config.mass ?? 1
		this.shapeChangedTime = 0 // TODO this might be better on the shape instead (or not, because compound colliders? idk)
		this.layerMask = config.layerMask ?? ALL_LAYERS
		this.collisionMask = config.collisionMask ?? ALL_LAYERS
		this.dynamic = config.dynamic ?? true
		this.active = config.active ?? true
	}
	sleep(knownIndex) {
		if (this.sleeping) return
		this.sleeping = true
		let a = this.system.awakes
		a[knownIndex ?? a.indexOf(this)] = a.pop()
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