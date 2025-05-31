import { PADDING } from "./const.js"
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
	refresh(x = 0, y = 0, scaleX = 1, scaleY = 1,usePadding=false) {
		this.refreshShape(x, y, scaleX, scaleY)
		this.refreshBB(usePadding)
	}
	refreshShape(x = 0, y = 0, scaleX = 1, scaleY = 1) {
		this.minX = x
		this.minY = y
		this.maxX = x + scaleX
		this.maxY = y + scaleY
	}
	refreshBB(usePadding=false) {
		let padding = usePadding ? PADDING : 0
		this.bb.minX = this.minX - padding
		this.bb.minY = this.minY - padding
		this.bb.maxX = this.maxX + padding
		this.bb.maxY = this.maxY + padding
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
	refresh(x = 0, y = 0, r = 1,usePadding=false) {
		this.refreshShape(x, y, r)
		this.refreshBB(usePadding)
	}
	refreshShape(x = 0, y = 0, r = 1) {
		this.minX = x
		this.minY = y
		this.r = r
	}
	refreshBB(usePadding=false) {
		let padding = usePadding?PADDING:0
		this.bb.minX = this.minX - this.r - padding
		this.bb.minY = this.minY - this.r - padding
		this.bb.maxX = this.maxX + this.r + padding
		this.bb.maxY = this.maxY + this.r + padding
	}
}