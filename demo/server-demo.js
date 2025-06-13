import '../index.js'
import { Skale } from '../system.js'
import { randomRadian } from '../util.js'
let mapSize = 1200
let system = new Skale(mapSize)
for (let i = 0; i < 100000; i++) {
	let mask = Math.random() < 0.5 ? 1 << 0 : 1 << 1
	system.create({
		dynamic: false,
		pos: { x: mapSize * Math.random(), y: mapSize * Math.random() },
		scale: { x: 1, y: 1 },
		angle: randomRadian(),
		layerMask: mask,
		collisionMask: mask
	})
}
for (let i = 0; i < 18000; i++) {
	let mask = Math.random() < 0.5 ? 1 << 0 : 1 << 1
	system.create({
		dynamic: true,
		pos: { x: mapSize * Math.random(), y: mapSize * Math.random() },
		scale: { x: 1, y: 1 },
		angle: randomRadian(),
		layerMask: mask,
		collisionMask: mask
	})
}
let now = performance.now(), previous = now, dt = 0, times = [], lastLog = 0, tick = 0
let loop = () => {
	setImmediate(loop)
	now = performance.now(), dt = (now - previous) / 1000, previous = now
	for (let i = 0; i < system.dynamics.length; i++) {
		let body = system.dynamics[i]
		body.move(1)
		if (Math.random() < 0.002) body.angle = randomRadian()
		if (i >= 6000) break
	}
	system.step(dt, tick)

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

	tick++
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