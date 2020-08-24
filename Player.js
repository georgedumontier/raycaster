function Player(x, y, direction) {
  this.x = x
  this.y = y
  this.speed = 175
  this.direction = direction
  this.rotate = function (angle) {
    // Add the extra 360 in case it was negative?
    // % CIRCLE so it's never bigger than 2pi
    this.direction = (this.direction + angle + CIRCLE) % (CIRCLE);
  }
  this.walk = function (distance) {
    // distance is the time since last frame times the speed
    // distance = distance * 30
    // cosine = adjacent / hypotenuse
    // Math.cos(Math.PI / 6) = .866
    // the adjacent side (x axis) is .866 times longer than the hypotenuse
    // for every 1 unit we move at a 30 degree angle, we move .866 units on the x axis
    // we use negative direction because of the y axis being reversed in canvas compared to geometry. In geometry counter-clockwise is positive, but in canvas it's negative
    let dx = Math.cos(-this.direction) * distance;
    // sine = opposite / hypotenuse
    // Math.sin(Math.PI /6) = .5
    // the hypotenuse is twice as long as the opposite side
    // for every 1 unit we move at a 30 degree angle we move .5 units on the y axis
    let dy = - Math.sin(-this.direction) * distance;// make it negative because down is positive in canvas
    this.x += dx
    this.y += dy
    // if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
    // if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
    // this.paces += distance;
  }
  this.update = function (dt) {
    dt = dt / 1000
    if (controls.states.left) this.rotate(-Math.PI * dt); // -180 degrees per second
    if (controls.states.right) this.rotate(Math.PI * dt); // 180 degrees per second
    if (controls.states.forward) this.walk(this.speed * dt); // speed * time = distance
    if (controls.states.backward) this.walk(-this.speed * dt);
  };
}