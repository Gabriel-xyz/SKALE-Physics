import RBush from './external/rbush.js';
const staticTree = new RBush(10)
const dynamicTree = new RBush(18)
let dynamicObjects = [], denseTiles = 500 * 500 * 0.2, players = 200, npcs = 2000, projectiles = 1000, mapDecor = 500 * 500 * 0.05, mapItems = 2000
for (let i = 0; i < 62500; i++) {
	let x = 500 * Math.random()
	let y = 500 * Math.random()
	let object = { minX: x, maxX: x+1, minY: y, maxY: y+1 }
	staticTree.insert(object)
}
for (let i = 0; i < 6000; i++) {
	let x = 500 * Math.random()
	let y = 500 * Math.random()
	let object = { minX: x, maxX: x+1, minY: y, maxY: y+1 }
	dynamicObjects.push(object)
	dynamicTree.insert(object)
}
let tick = 0, now = performance.now(), previous = now, dt = 0, movedObjects = [], times = [], lastLog = 0
const loop = () => {
	setImmediate(loop)
	now = performance.now(), dt = now - previous, previous = now





	dynamicTree.clear()
	for (let i = 0; i < 2000; i++) {
		var o = dynamicObjects[Math.floor(Math.random() * dynamicObjects.length)]
		o.minX = Math.random() * 500
		o.minY = Math.random() * 500
		o.maxX = o.minX+1
		o.maxY = o.minY+1
		movedObjects.push(o)
	}
	dynamicTree.load(dynamicObjects)
	// console.log(staticTree.all().length,dynamicTree.all().length,movedObjects.length)
	for (let o of movedObjects) {
		var overlaps = [...dynamicTree.search(o), ...staticTree.search(o)]
	}
	movedObjects = []








	tick++
	times.push(1000 / dt)
	if (times.length > 500) times.shift()
	let n = 0
	for (let n2 of times) {
		n += n2
	}
	if (now - lastLog > 1000) {
		lastLog = now
		console.log(n / times.length, times.length)
	}
}
loop()