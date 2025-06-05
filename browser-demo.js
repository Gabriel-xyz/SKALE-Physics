import './index.js'
import { System } from './system.js';
import { randomRadian } from './util.js';
import { Box } from './shape.js';
let startTime = Date.now();
const canvas = document.createElement('canvas');
canvas.width = screen.height;
canvas.height = screen.height;
let mapSize = 400
let zoom = canvas.width / mapSize
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
const system = new System(mapSize);
for (let i = 0; i < 30000; i++) {
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
for (let i = 0; i < 15000; i++) {
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
let staticColor = 'rgb(255,0,0)'
let dynamicColor = 'rgb(0,255,0)'
let sleepingColor = 'rgb(0,150,255)'
function render() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < system.bodies.length; i++) {
    let body = system.bodies[i]
    let color
    if (body.sleeping) color = sleepingColor
    else if (body.dynamic) color = dynamicColor
    else color = staticColor
    ctx.save();
    ctx.fillStyle = color
    if (body.shape instanceof Box) {
      ctx.fillRect(
        body.shape.minX * zoom,
        body.shape.minY * zoom,
        (body.shape.maxX - body.shape.minX) * zoom,
        (body.shape.maxY - body.shape.minY) * zoom
      );
    } else { // render circles, when i finally add them
      ctx.beginPath();
      // TODO remember to use zoom
      ctx.arc(
        body.x + body.shape.r,
        body.y + body.shape.r,
        body.shape.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    // draw bounding box
    // if (body.dynamic) {
    //   ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    //   ctx.lineWidth = 1;
    //   ctx.beginPath();
    //   ctx.rect(body.shape.bb.minX * zoom, body.shape.bb.minY * zoom, (body.shape.bb.maxX - body.shape.bb.minX) * zoom, (body.shape.bb.maxY - body.shape.bb.minY) * zoom);
    //   ctx.stroke();
    // }

    ctx.restore();
  }
}
let previous = performance.now(), times = [], lastLog = 0, dt = 1 / 60
function gameLoop() {
  requestAnimationFrame(gameLoop);
  for (let i = 0; i < system.dynamics.length; i++) {
    let body = system.dynamics[i]
    // if(Date.now() - startTime < 3000) body.move(5)
    body.move(1)
    if (Math.random() < 0.002) body.angle = randomRadian()
    if (i >= 7500) break
  }
  system.step(dt);
  render();

  // let speeds = []
  // for (let i = 0; i < system.dynamics.length; i++) {
  //   let body = system.dynamics[i]
  //   let speed = Math.sqrt(body.vel.x * body.vel.x + body.vel.y * body.vel.y)
  //   speeds.push(speed)
  // }
  // let avgSpeed = 0
  // for (let n of speeds) {
  //   avgSpeed += n
  // }
  // avgSpeed /= speeds.length
  // if (Math.random() < 0.01) console.log(avgSpeed)

  let now = performance.now()
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
  if (now - lastLog > 2000) {
    lastLog = now
    console.log('fps', 1 / n, times.length)
  }
}
gameLoop();