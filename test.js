let dynamics = []
for (let i = 0; i < 600000; i++) {
	dynamics.push({
		active: true,
		dynamic: false,
		pos: { x: 500 * Math.random(), y: 500 * Math.random() },
		scale: { x: 1, y: 1 },
	})
}
let now = performance.now()
for (let i = 0; i < 100; i++) {
	for(let o of dynamics){
		if(Math.random() > 0.1) continue
		o.changed = true
		o.scale.x += Math.random() * 5 - 5
		o.scale.y += Math.random() * 5 - 5
		o.pos.x += Math.random() * 5 - 5
		o.pos.y += Math.random() * 5 - 5
	}
	for (let o of dynamics) {
		if (!o.changed || !o.active) continue
		o.changed = false
		o.scale.x += Math.random() * 5 - 5
		o.scale.y += Math.random() * 5 - 5
		o.pos.x += Math.random() * 5 - 5
		o.pos.y += Math.random() * 5 - 5
		o.dynamic = true
		o.active = true
	}
}
console.log(performance.now() - now)

now = performance.now()
for(let i = 0;i<100;i++){
	let changed = []
	for(let o of dynamics){
		if(Math.random() > 0.1) continue
		changed.push(o)
		o.scale.x += Math.random() * 5 - 5
		o.scale.y += Math.random() * 5 - 5
		o.pos.x += Math.random() * 5 - 5
		o.pos.y += Math.random() * 5 - 5
	}
	for (let o of changed) {
		o.scale.x += Math.random() * 5 - 5
		o.scale.y += Math.random() * 5 - 5
		o.pos.x += Math.random() * 5 - 5
		o.pos.y += Math.random() * 5 - 5
		o.dynamic = true
		o.active = true
	}
}
console.log(performance.now() - now)