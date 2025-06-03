import './index.js'
import { System } from './system.js'
import { randomRadian } from './util.js'
let system = new System()
let mapSize = 1200
for (let i = 0; i < 60000; i++) {
	system.create({
		active: true,
		dynamic: false,
		pos: { x: mapSize * Math.random(), y: mapSize * Math.random() },
		scale: { x: 1, y: 1 },
		angle: randomRadian()
	})
}
for (let i = 0; i < 8000; i++) {
	system.create({
		active: true,
		dynamic: true,
		pos: { x: mapSize * Math.random(), y: mapSize * Math.random() },
		scale: { x: 1, y: 1 },
		angle: randomRadian()
	})
}
let now = performance.now(), previous = now, dt = 0, times = [], lastLog = 0
let loop = () => {
	setImmediate(loop)
	now = performance.now(), dt = (now - previous) / 1000, previous = now
	for (let i = 0; i < 2000; i++) {
		let body = system.dynamics[i]
		body.move(1)
		if (body.x < 0 || body.x > mapSize) {
			body.x = mapSize * Math.random()
		}
		if (body.y < 0 || body.y > mapSize) {
			body.y = mapSize * Math.random()
		}
		if (Math.random() < 0.01) body.angle = randomRadian()
	}
	system.update(dt)

	times.push(1 / dt)
	if (times.length > 500) times.shift()
	let n = 0
	for (let n2 of times) {
		n += n2
	}
	if (now - lastLog > 2000) {
		lastLog = now
		console.log(n / times.length, times.length)
	}
}
loop()