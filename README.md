SKALE Physics 🚀
  
A high-performance 2D Arcade Physics Engine optimized for games, designed for top-down simulation games like Dwarf Fortress or Rimworld. Built for speed, it prioritizes performance over realistic physics, enabling thousands of bodies on screen at 60 FPS, even on older hardware.

Table of Contents

Overview
Features
Missing Features
Performance
Use Cases
Benchmarks
Why SKALE Physics?

Overview
SKALE Physics is a JavaScript-based 2D physics engine tailored for games requiring massive numbers of bodies, such as multiplayer top-down simulation games. It achieves unmatched performance by focusing on arcade-style physics rather than realistic simulations, removing unnecessary features for speed.
On a 2014 CPU (i5 4690K), it handles:

20,000 static boxes (red) 🟥
10,000 dynamic boxes (5,000 moving (green) 🟩, 5,000 sleeping (blue) 🟦)
60 FPS in the browser, with even better performance on servers (rendering is the bottleneck).

Features
SKALE Physics is optimized for speed and includes:



Feature
Description



High Performance
Fastest JavaScript physics engine, outperforming Box2D WASM, Matter.js, and Phaser Arcade Physics.


Collision Detection
AABB/Circle collisions only for maximum speed.


Layers
Define which bodies collide with each other using collision and layer masks.


Body Sleeping
Optimizes performance by deactivating static bodies.


Triggers
Support for trigger-based interactions.


Optimized RBush
Custom RBush implementation, 10% faster than standard.


Broadphase Padding
Significant optimization for collision detection.


Physics Properties
Mass, bounce, damping, velocity, acceleration, impulse.


World Bounds
Bodies can't leave the defined world boundaries.


Wall Sliding
Smooth sliding along walls.


Data-Oriented Design
Optimized for speed with minimal overhead.


Multithreading
Each map can have its own "Physics World" on a separate thread for multiplayer games.


Body Interactions
Bodies can push or impart forces on each other.


Missing Features
The library is in alpha and lacks three features for completion:

Raycasting
Circle Colliders
Collision/Trigger Callbacks

It works perfectly for games that don’t require these features.
Performance
SKALE Physics is designed for:

Top-down simulation games needing thousands of bodies (e.g., Dwarf Fortress, Rimworld).
Multiplayer games requiring high NPC/player counts.
Browser or server environments, with superior performance on servers due to rendering bottlenecks.

It sacrifices features like joints, constraints, and compound colliders for speed, as these are rarely needed in arcade-style simulation games.
Use Cases

Multiplayer Games: Supports massive player/NPC counts with multithreaded physics worlds.
Top-Down RPGs: Ideal for games needing simple physics alongside 2D movement.
Simulation Games: Optimized for large-scale simulations with many dynamic bodies.

Benchmarks



Environment
Static Bodies
Dynamic Bodies
FPS
Hardware



Server
0
20,000 (12,000 moving, 8,000 sleeping)
62
i5 4690K (2014)


Browser
20,000
10,000 (6,000 moving, 4,000 sleeping)
60
i5 4690K (2014)


Why SKALE Physics?

Outperforms competitors: Beats Box2D WASM, Matter.js, and Phaser Arcade Physics in speed.
Arcade-focused: Tailored for games, not realistic physics simulations.
Scalable: Handles thousands of bodies, perfect for large-scale or multiplayer games.
Lightweight: Optimized for both browser and server, with server-side performance excelling.

