function Player(x, y, direction) {
  this.x = x
  this.y = y
  this.lastX = 0
  this.lastY = 0
  this.speed = 100
  this.direction = direction
  this.lastDirection = 0
  this.rotate = function (angle) {
    // % CIRCLE so it's never bigger than 2pi
    this.direction = (this.direction + angle + CIRCLE) % (CIRCLE);
  }

  this.hitWall = function(x, y){
    let xBlock = Math.floor(x / blockSize)
    let yBlock = Math.floor(y / blockSize)
    return map[yBlock * gridSize + xBlock] === 1;
  }

  this.walk = function (distance) {
    let dx = Math.cos(-this.direction) * distance;
    let dy = - Math.sin(-this.direction) * distance;
    let newX = this.x + dx
    let newY = this.y + dy
    if(!this.hitWall(newX, this.y)) {
      this.lastX = this.x
      this.x = newX
    }
    if(!this.hitWall(this.x, newY)){
      this.lastY = this.y
      this.y = newY
    }

  }
  this.update = function (dt) {
    dt = dt / 1000
    if (controls.states.left) this.rotate(-Math.PI * dt); // -180 degrees per second
    if (controls.states.right) this.rotate(Math.PI * dt); // 180 degrees per second
    if (controls.states.forward) this.walk(this.speed * dt); // speed * time = distance
    if (controls.states.backward) this.walk(-this.speed * dt);
  };
}