add layers (detect-collisions repo has good example of layers)

add circles

put half circles in demos to make them run faster
put some layers in there to make them run faster
make some triggers to make it run faster

switch to typescript

try some other broadphases and see if they outperform rbush for my usecase for example quadtree-ts

add raycasting from detect-collisions repo

we need a collision callback that is called whenever an intersection occurs and is used for triggers and collisions. or perhaps a separate callback for triggers and separate for colliders. not sure if it should be one global callback or each body can have its own callback, or both