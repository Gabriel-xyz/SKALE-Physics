switch to typescript

figure out how sleeping works and if we need it

ive now confirmed in the detect-collisions repo that the only difference between statics and dynamics is that separate() will return if the body you called it on is static (because statics dont separate from things), if it doesnt return then separate() will do a tree search to find potentials and then separate from those, meaning statics do avoid the tree search to find potentials but not much else, because statics and dynamics are still both in the same rtree, theyre not even in two separate branches of it, and when System iterates over bodies it has to iterate over both statics and dynamics at once instead of just dynamics or just dynamics that moved this tick, when appropriate

i noticed a lot of optimizations i can make it rbush.js

possible rbush optimization: i noticed rbush has a private function called _condense that goes through nodes and removes empty ones. _condense is called every single time you use rbush.remove(). i usually would clear and rebuild the rtree every tick, however _condense shows promise of me not having to do that, instead i would make remove() not call condense, and then at the end of the tick condense everything at once

rbush has a function called createNode(children[]) which from what i can tell is what we need if we want to store statics and dynamics in the same tree instead of two trees, but im just guessing. _splitRoot (split root node) might also be what we need but it uses createNode internally btw

add raycasting from detect-collisions repo

we need a collision callback that is called whenever an intersection occurs and is used for triggers and collisions. or perhaps a separate callback for triggers and separate for colliders. not sure if it should be one global callback or each body can have its own callback, or both

its possible we would benefit from a 'midphase' in between the broadphase and narrowphase and that could be a distance check before checking collisions or idk what else

we could still allow bodies to have compound colliders (shapes = []), i dont think its that complicated, its just if a dynamic object moves, and any of its compound colliders collided and it separates, then every other collider in the array also moves the same distance as the one that separated. if multiple of them need separated in that tick then for each one that needs separated that same x/y change from the separation is applied to all of them

if clearing and rebuilding the rtree every tick proves to be the indisputably fastest way then there is tons of optimizations we can make to rbush.js with that in mind, for example we can remove all logic about collapsing nodes when rbush.remove() is called. and if im not mistaken we would never have to call rbush.remove() before calling rbush.insert() because if we cleared the rtree then whatever we would normally call remove() on would definitely not be in there

remember, if clearing and rebuilding every tick is the fastest way then anywhere there is code that removes a bb before reinserting it can go away for optimizations because if the tree is cleared obviously it doesnt need removed before being inserted. likewise padding becomes pointless and is a system that can go away because the tree was cleared so no point checking padding