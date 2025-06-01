// TODO get some circles in the demo
import './index.js'
import { System } from './system.js';
import { randomRadian } from './util.js';
import { Box } from './shape.js';
const canvas = document.createElement('canvas');
canvas.width = 1700;
canvas.height = 1000;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
const system = new System(12);
for (let i = 0; i < 100; i++) {
  system.createBody({
    active: true,
    dynamic: false,
    pos: { x: canvas.width * Math.random(), y: canvas.height * Math.random() },
    scale: { x: 64, y: 64 },
    angle: randomRadian()
  })
}
for (let i = 0; i < 100; i++) {
  system.createBody({
    active: true,
    dynamic: true,
    pos: { x: canvas.width * Math.random(), y: canvas.height * Math.random() },
    scale: { x: 64, y: 64 },
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
        body.shape.minX,
        body.shape.minY,
        body.shape.maxX - body.shape.minX,
        body.shape.maxY - body.shape.minY
      );
    } else if ('r' in body.shape) { // render circles, when i finally add them
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
    // draw bounding box
    if (body.dynamic) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // transparent white
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(body.shape.bb.minX, body.shape.bb.minY, body.shape.bb.maxX - body.shape.bb.minX, body.shape.bb.maxY - body.shape.bb.minY);
      ctx.stroke();
    }

    ctx.restore();
  }
}
let previous = performance.now(), times = [], lastLog = 0, dt = 1 / 60
function gameLoop() {
  requestAnimationFrame(gameLoop);
  let count = 0
  for (let i = 0; i < system.bodies.length; i++) {
    let body = system.bodies[i]
    if (!body.dynamic) continue
    body.move(64)
    if (body.x < 0 || body.x > canvas.width) {
      body.x = canvas.width * Math.random()
    }
    if (body.y < 0 || body.y > canvas.height) {
      body.y = canvas.height * Math.random()
    }
    if (Math.random() < 0.01) body.angle = randomRadian()
    count++
    // if (count >= 2000) break
  }
  system.update(dt*1);
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