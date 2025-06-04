import './index.js'
import { System } from './system.js'
import { randomRadian } from './util.js'
let mapSize = 1000
let system = new System(mapSize)
for (let i = 0; i < 0; i++) {
	system.create({
		dynamic: false,
		pos: { x: mapSize * Math.random(), y: mapSize * Math.random() },
		scale: { x: 1, y: 1 },
		angle: randomRadian()
	})
}
for (let i = 0; i < 10000; i++) {
	system.create({
		dynamic: true,
		pos: { x: mapSize * Math.random(), y: mapSize * Math.random() },
		scale: { x: 1, y: 1 },
		angle: randomRadian()
	})
}
let now = performance.now(), previous = now, dt = 0, times = [], lastLog = 0
let loop = () => {
	now = performance.now(), dt = (now - previous) / 1000, previous = now
	for (let i = 0; i < system.dynamics.length; i++) {
		let body = system.dynamics[i]
		body.move(1)
		if (Math.random() < 0.01) body.angle = randomRadian()
	}
	system.update(dt)

	// let speeds = []
	// for (let i = 0; i < system.dynamics.length; i++) {
	// 	let body = system.dynamics[i]
	// 	let speed = Math.sqrt(body.vel.x * body.vel.x + body.vel.y * body.vel.y)
	// 	speeds.push(speed)
	// }
	// let avgSpeed = 0
	// for (let n of speeds) {
	// 	avgSpeed += n
	// }
	// avgSpeed /= speeds.length
	// if (Math.random() < 0.01) console.log(avgSpeed)

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
	setImmediate(loop)
}
loop()