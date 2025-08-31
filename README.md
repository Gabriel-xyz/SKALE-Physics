BUG: A new bug has come seemingly out of nowhere, even though months ago I had it working perfectly, but now I run it and there's a bug even though I haven't changed anything. The bug seems to be, from what I'm observing but haven't extensively checked yet, that an awake body can be pushed over a sleeping body, thus intersecting it, this is not desired, it seems to be an awake body pushes the other awake body causing it to intersect the sleeping body. I'm pretty sure this should make the sleeping body wake up, maybe that's the best way to handle it, but I haven't looked at this code in so long I don't remember. The most I did was disable sleeping, and from what I saw that seemed to make the bug not occur. Another thing I tried is altering the main loop to loop through the 'dynamics' array instead of the 'awakes' array, which is what it originally did at some point, before I made it loop only through the 'awakes' array as a supposed optimization, and if it loops through the 'dynamics' array the bug seems to go away, which I guess makes sense because if I never loop through the sleeping bodies because I only loop through the 'awakes' array then there won't be an intersection test against the sleeping body? I don't remember enough to be sure about any of these statements but there ya go. Easiest solution is to loop through 'dynamics' which is the original behavior anyway, otherwise perhaps a solution can be though of to fix this more intelligently.

# SKALE Physics 🚀

![Alpha Version](https://img.shields.io/badge/Version-Alpha-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Language](https://img.shields.io/badge/Language-JavaScript-yellow)

A zero-dependency 2D **Arcade Physics Engine** for games, designed for massive simulation games like *Dwarf Fortress* or *Rimworld* needing many thousands of moving bodies at once. Built for speed, it prioritizes performance over realistic physics, enabling 50,000+ bodies at 60 FPS when running as a server. This screenshot is 30,000 static bodies (🟥), 15,000 dynamic bodies (9000 moving (🟩) and 6000 only moving if collided against (🟦))

![SKALE Physics Demo](https://raw.githubusercontent.com/Gabriel-xyz/SKALE-Physics/main/demo/screenshot.jpg)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Missing Features](#missing-features)
- [Performance](#performance)
- [Benchmarks](#benchmarks)

## Overview
SKALE Physics is made for certain genres of games requiring massive numbers of bodies without realism, namely massive simulation games and multiplayer games. It achieves this by removing features simulation games rarely need, and using arcade-style physics rather than realistic simulations.

On a 2014 CPU (i5 4690K), in browser, it handles:
- **40,000 static boxes** 🟥
- **10,000 dynamic boxes** (6,000 moving 🟩, 4,000 sleeping 🟦)
- **60 FPS** in the browser, with even better performance on servers (rendering is the bottleneck).

## Features
SKALE Physics includes:

| Feature | Description |
|---------|-------------|
| **High Performance** | Fastest JavaScript physics engine, outperforming Box2D WASM, Matter.js, and Phaser Arcade Physics. |
| **Collision Detection** | AABB/Circle collisions only for maximum speed (no SAT). |
| **Layers** | Define which bodies collide with each other using collision and layer masks. |
| **Body Sleeping** | Optimizes performance by putting non-moving bodies to sleep. |
| **Triggers** | Support for trigger bodies. |
| **Optimized RBush** | Optimized RBush implementation, 10% faster than RBush. |
| **Broadphase Padding** | Significant optimization for collision detection. |
| **Physics Properties** | Mass, bounce, damping, velocity, acceleration, impulse. |
| **World Bounds** | Bodies can't leave the defined world boundaries. |
| **Wall Sliding** | Smooth sliding along walls. |
| **Data-Oriented Design** | Optimized for speed with minimal overhead. |
| **Multithreading** | Each map can have its own "Physics World" on a separate thread for multiplayer games. |
| **Body Interactions** | Bodies can push or impart forces on each other. |

## Missing Features
The library is in alpha and lacks three features for completion:
- Raycasting
- Circle Colliders
- Collision/Trigger Callbacks

It works great for games that don’t require these features, but it could use a more comprehensive API.

## Performance
SKALE Physics is designed for:
- **Massive simulation games** needing many thousands of bodies (e.g., *Dwarf Fortress*, *Rimworld*).
- **Multiplayer games** requiring very high NPC/player counts across many maps (multithreaded physics worlds per map).
- **Browser or server** environments, with superior performance on servers due to browser rendering bottlenecks.

It sacrifices features like joints, constraints, stable stacking, and compound colliders (although I'm considering compound colliders) for speed, as these are rarely used in the type of massive simulation games this physics engine was made for.

In a way this library is as if you wanted 2D RPG movement in your game then later decided you want physics just in case.

## Benchmarks
| Environment | Static Bodies | Dynamic Bodies | FPS | Hardware |
|-------------|---------------|----------------|-----|----------|
| **Server**  | 40,000        | 20,000 (12,000 moving, 8,000 sleeping) | 62  | i5 4690K (2014) |
| **Browser** | 20,000        | 10,000 (6,000 moving, 4,000 sleeping) | 60  | i5 4690K (2014) |