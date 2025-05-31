import { Body } from "./body.js";
import { PADDING } from "./const.js";
import RBush from "./external/rbush.js";
import { contains } from "./intersect.js";
let oneTree = false
let useCollides = true
let rebuildTree = false
export class System extends RBush {
	bodies = []
	dynamics = []
	statics = []
	constructor(maxEntries = 9) {
		super(maxEntries)
		this.staticTree = new RBush(10)
		this.dynamicTree = new RBush(18)
	}
	update(dt) {
		/* 
		TODO. try different PADDING. try two trees vs one. see if collides() is faster or slower. try clearing and rebuilding the tree every tick again
		fps results:
		
		one tree, dynamic reinsert:
		- 0 padding, collides false: 71
		- 0 padding, collides true: 62
		- 1 padding, collides false: 67
		- 1 padding, collides true: 60
		- 0.3 padding, collides false: 66
		- 0.3 padding, collides true: 63
		- 0.1 padding, collides false: 68
		- 0.1 padding, collides true: 62
		
		one tree, full tree rebuild
		- very slow on every test

		two trees, dynamic reinsert:
		- 0 padding, collides false: 84
		- 0 padding, collides true: 84
		- 1 padding, collides false: 88
		- 1 padding, collides true: 77
		- 0.3 padding, collides false: 85
		- 0.3 padding, collides true: 81
		- 0.1 padding, collides false: 88
		- 0.1 padding, collides true: 84

		two trees, full tree rebuild
		- collides false: 88
		- collides true: 79
		*/
		// console.log(this.staticTree.all().length,this.dynamicTree.all().length,this.statics.length,this.dynamics.length,oneTree)
		if (!rebuildTree) {
			for (let body of this.dynamics) {
				if (!body.active) continue
				// velocity etc gets applied here
				if (body.shapeChanged) {
					body.shape.refreshShape(body.pos.x, body.pos.y, body.scale.x, body.scale.y)
					if (!PADDING || !contains(body.shape.bb, body.shape)) {
						// 71 to 200 if comment this out. this means reinserting is more expensive than searching by 2-3x
						this.remove(body)
						body.shape.refreshBB(body.dynamic)
						this.insert(body)
					}
					if (!useCollides || this.collides(body)) {
						// 71 to 123 if comment this out
						let potentials
						if (oneTree) potentials = this.dynamicTree.search(body.shape)
						else potentials = [...this.dynamicTree.search(body.shape), ...this.staticTree.search(body.shape)]
						for (let bb of potentials) {
							if (bb.shape.body == body) continue
							// commenting this out has no effect on fps at all
							if (body.intersects(bb.shape.body)) {
								body.separate(bb.shape.body)
							}
						}
					}
					body.shapeChanged = false // its possible we need to leave this to true if a separation occurred so it can run separation again next tick, false if no separation occurred
				}
			}
		} else {
			this.dynamicTree.clear()
			for (let body of this.dynamics) {
				if (!body.active) continue
				// velocity etc gets applied here
				if (body.shapeChanged) {
					body.shape.refresh(body.pos.x, body.pos.y, body.scale.x, body.scale.y, body.dynamic)
					body.shapeChanged = false // its possible we need to leave this to true if a separation occurred so it can run separation again next tick, false if no separation occurred
				}
			}
			if (oneTree) this.dynamicTree.load([...this.dynamics.map(o => o.shape.bb), ...this.statics.map(o => o.shape.bb)])
			else this.dynamicTree.load(this.dynamics.map(o => o.shape.bb))
			for (let body of this.dynamics) {
				if (!useCollides || this.collides(body)) {
					// 71 to 123 if comment this out
					let potentials
					if (oneTree) potentials = this.dynamicTree.search(body.shape)
					else potentials = [...this.dynamicTree.search(body.shape), ...this.staticTree.search(body.shape)]
					for (let bb of potentials) {
						if (bb.shape.body == body) continue
						// commenting this out has no effect on fps at all
						if (body.intersects(bb.shape.body)) {
							body.separate(bb.shape.body)
						}
					}
				}
			}
		}
	}
	createBody(config) {
		config.system = this
		let body = new Body(config)
		this.insert(body)
		this.bodies.push(body)
		config.dynamic == true ? this.dynamics.push(body) : this.statics.push(body)
		return body
	}
	insert(body) {
		if (oneTree) this.dynamicTree.insert(body.shape.bb)
		else body.dynamic == true ? this.dynamicTree.insert(body.shape.bb) : this.staticTree.insert(body.shape.bb)

	}
	remove(body) {
		if (oneTree) this.dynamicTree.remove(body.shape.bb)
		else body.dynamic == true ? this.dynamicTree.remove(body.shape.bb) : this.staticTree.remove(body.shape.bb)
	}
	collides(body) {
		if (oneTree) return this.dynamicTree.collides(body.shape)
		else return this.dynamicTree.collides(body.shape) || this.staticTree.collides(body.shape)
	}
}