import { PADDING } from "./consts.js"
class Shape {
	bb = { shape: this }
	constructor(trigger = false) {
		this.trigger = trigger
	}
}
export class Box extends Shape {
	constructor(x = 0, y = 0, scaleX = 1, scaleY = 1, trigger = false) {
		super(trigger)
		this.refresh(x, y, scaleX, scaleY)
	}
	refresh(x = 0, y = 0, scaleX = 1, scaleY = 1) {
		this.refreshShape(x, y, scaleX, scaleY)
		this.refreshBB()
	}
	refreshShape(x = 0, y = 0, scaleX = 1, scaleY = 1) {
		this.minX = x
		this.minY = y
		this.maxX = x + scaleX
		this.maxY = y + scaleY
	}
	refreshBB() {
		this.bb.minX = this.minX - PADDING
		this.bb.minY = this.minY - PADDING
		this.bb.maxX = this.maxX + PADDING
		this.bb.maxY = this.maxY + PADDING
	}
}
export class Circle extends Shape {
	constructor(x = 0, y = 0, r = 1, trigger = false) {
		this.minX = x
		this.minY = y
		this.r = r
		super(trigger)
		this.refresh(x, y, r)
	}
	refresh(x = 0, y = 0, r = 1) {
		this.refreshShape(x, y, r)
		this.refreshBB()
	}
	refreshShape(x = 0, y = 0, r = 1) {
		this.minX = x
		this.minY = y
		this.r = r
	}
	refreshBB() {
		this.bb.minX = this.minX - this.r - PADDING
		this.bb.minY = this.minY - this.r - PADDING
		this.bb.maxX = this.maxX + this.r + PADDING
		this.bb.maxY = this.maxY + this.r + PADDING
	}
}