[Alpha Version]

This library is 3 features away from being complete:
- Raycasting
- Circles
- Collision/Trigger Callbacks

SKALE Physics is a 2D "Arcade Physics Engine" made as fast as possible for certain types of games, not 100% realistic physics, because realism = slow. Primarily for topdown simulation games that need as many bodies on screen as possible (Dwarf Fortress, Rimworld). Those type of games do not need certain features, which allowed those features to be removed for speed:
- AABB/Circle collisions only. Faster than SAT or any other option
- Doesn't care about stacked objects looking perfect (although they still seem to look okay)
- No joints or constraints. Simulation games do not often need these
- No compound colliders

What it does have:
- Fastest JS physics engine currently in existence
- Layers (Which bodies collide with you) and Collision Layers (Which bodies you collide with)
- Body Sleeping (optimization)
- Triggers
- A version of RBush 10% faster than standard RBush
- Broadphase Padding (big optimization)
- Excellent for multiplayer games that need as many players and NPCs as possible
- You can multithread physics in a multiplayer game by making each map have its own "Physics World" on a separate thread
- Mass, Bounce, Damping, Velocity, Acceleration, Impulse
- Body pushing another
- Body imparting force onto a body it collides with
- Collide World Bounds (Can't leave bounds of "the world")

In my tests it outperformed every existing javascript physics engine by far, including box2d3-wasm.
It outperforms matterjs by far in speed.
Those libraries are designed for realistic physics simulation. They are not "Arcade Physics" "for Games".
It outperforms Phaser Arcade Physics by far.

This library can run on server or browser but it runs immensely faster on server because I designed it for my multiplayer game.