add layers

add circles

theres a bug where fps drops forever because of the collide world bounds functionality causing bodies to fly around super fast increasing the amount of collisions or something
- actually just make proper collide world bounds logic where it doesnt randomly teleport you somewhere else on the map, it just doesnt let you proceed any further, it does the smallest separation possible to put you back in

need functionality to handle teleports. a movement greater than a certain amount in a tick should automatically count as a teleport. perhaps if the x movement is greater than 0.5x or 1x the width of the aabb. same for y but height. maybe a teleport cancels out all forces or something, velocity=0 etc. it puts you at the new location, and zeroes out all forces, idk

switch to typescript

try some other broadphases and see if they outperform rbush for my usecase for example quadtree-ts

add world bounds handling

figure out how sleeping works and if we need it

i noticed a lot of optimizations i can make it rbush.js

add raycasting from detect-collisions repo

we need a collision callback that is called whenever an intersection occurs and is used for triggers and collisions. or perhaps a separate callback for triggers and separate for colliders. not sure if it should be one global callback or each body can have its own callback, or both