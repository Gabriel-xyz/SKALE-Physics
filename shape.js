import { PADDING } from "./const.js"
class Shape {
	bb = { shape: this, minX: 0, minY: 0, maxX: 0, maxY: 0 }
	constructor(trigger = false) {
		this.trigger = trigger
	}
}
export class Box extends Shape {
	constructor(config, body) {
		super(config.trigger ?? false)
		this.body = body
		this.setPos(config.pos.x, config.pos.y)
		this.setScale(config.scale.x, config.scale.y)
		this.refreshBB()
	}
	setPos(x = 0, y = 0) {
		this.maxX += x - this.minX
		this.maxY += y - this.minY
		this.minX = x
		this.minY = y
		this.shapeChanged = true
		this.body.awake()
	}
	setScale(x = 1, y = 1) {
		this.maxX = this.minX + x
		this.maxY = this.minY + y
		this.shapeChanged = true
		this.body.awake()
	}
	refreshBB() {
		let padding = this.body.dynamic ? PADDING : 0
		this.bb.minX = this.minX - padding
		this.bb.minY = this.minY - padding
		this.bb.maxX = this.maxX + padding
		this.bb.maxY = this.maxY + padding
	}
}