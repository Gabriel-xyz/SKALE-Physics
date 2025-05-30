import './index.js'
import { System } from './system.js'
import { randomRadian } from './util.js'
let system = new System(9)
for (let i = 0; i < 100000; i++) {
	system.createBody({
		active: true,
		dynamic: true,
		pos: { x: 500 * Math.random(), y: 500 * Math.random() },
		scale: { x: 1, y: 1 },
		angle: randomRadian()
	})
}
let now = performance.now(), previous = performance.now(), dt = 0.16, times = [], lastLog = 0
let loop = () => {
	setImmediate(loop)
	for (let i = 0; i < Math.min(2000, system.bodies.length); i++) {
		let body = system.bodies[i]
		if (!body.dynamic) continue
		body.move(2 * dt)
		if (body.x < 0 || body.x > 500) {
			body.x = 500 * Math.random()
		}
		if (body.y < 0 || body.y > 500) {
			body.y = 500 * Math.random()
		}
	}
	system.update(dt)

	now = performance.now()
	dt = (now - previous) / 1000
	previous = now
	times.push(dt)
	if (times.length > 200) {
		times.shift()
	}
	let n = 0
	for (let n2 of times) {
		n += n2
	}
	n /= times.length
	if (now - lastLog > 1000) {
		lastLog = now
		console.log('fps', 1 / n, times.length)
	}
}
loop()