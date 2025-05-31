// TODO get some circles in the demo
import './index.js'
import { System } from './system.js';
import { deg2rad, randomRadian } from './util.js';
import { Box, Circle } from './shape.js';
const canvas = document.createElement('canvas');
canvas.width = 1080;
canvas.height = 950;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
const system = new System(12);
// TODO bug, something is wrong with static objects. notice how any dynamic objects nearby them cease to move for some reason
for (let i = 0; i < 600; i++) {
  system.createBody({
    active: true,
    dynamic: false,
    pos: { x: canvas.width * Math.random(), y: canvas.height * Math.random() },
    scale: { x: 12*Math.random()+6, y: 12*Math.random()+6 },
    angle: randomRadian()
  })
}
for (let i = 0; i < 400; i++) {
  system.createBody({
    active: true,
    dynamic: true,
    pos: { x: canvas.width * Math.random(), y: canvas.height * Math.random() },
    scale: { x: 12, y: 12 },
    angle: randomRadian()
  })
}
function render() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const body of system.bodies) {
    ctx.save();
    ctx.fillStyle = body.dynamic ? '#3498db' : '#e74c3c';
    if (body.shape instanceof Box) {
      ctx.fillRect(
        body.x,
        body.y,
        body.scale.x,
        body.scale.y
      );
    } else if ('r' in body.shape) {
      ctx.beginPath();
      ctx.arc(
        body.x + body.shape.r,
        body.y + body.shape.r,
        body.shape.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.restore();
  }
}
let previous = performance.now(), times = [], lastLog = 0, dt = 0.016
function gameLoop() {
  requestAnimationFrame(gameLoop);
  let count = 0
  for (let i = 0; i < system.bodies.length; i++) {
    let body = system.bodies[i]
    if (!body.dynamic) continue
    body.move(24 * dt)
    if (body.x < 0 || body.x > canvas.width) {
      body.x = canvas.width * Math.random()
    }
    if (body.y < 0 || body.y > canvas.height) {
      body.y = canvas.height * Math.random()
    }
    if (Math.random() < 0.01) body.angle = randomRadian()
    count++
    if (count >= 2000) break
  }
  system.update(dt);
  render();

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