add layers

add circles

switch to typescript

try some other broadphases and see if they outperform rbush for my usecase for example quadtree-ts

add world bounds handling

figure out how sleeping works and if we need it

i noticed a lot of optimizations i can make it rbush.js

add raycasting from detect-collisions repo

we need a collision callback that is called whenever an intersection occurs and is used for triggers and collisions. or perhaps a separate callback for triggers and separate for colliders. not sure if it should be one global callback or each body can have its own callback, or both