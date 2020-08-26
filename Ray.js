function Ray(x, y, direction) {
  this.x = x
  this.y = y
  this.direction = direction
  this.findIntersect = function(x, y, dx, dy, isUp, isLeft) {
      // should be able to use the point slope formula
      // y − y1 = m(x − x1)
      let interceptX = {}
      interceptX.y = isUp ? y - dy : y + dy
      interceptX.x = ((interceptX.y - y) / Math.tan(this.direction)) + x
      interceptX.dist = Math.sqrt(Math.pow(interceptX.x - x, 2) + Math.pow(interceptX.x - x, 2))

      // vertical lines
      let interceptY = {}
      interceptY.x = isLeft ? x - dx : x + dx
      interceptY.y = ((interceptY.x - x) * Math.tan(this.direction)) + y
      interceptY.dist = Math.sqrt(Math.pow(interceptY.x - x, 2) + Math.pow(interceptY.x - x, 2))

      return interceptX.dist < interceptY.dist ? [interceptX.x, interceptX.y] : [interceptY.x, interceptY.y]
    }
  this.hitWall = function() {

  }
  this.collide = function () {
    /*
    **The idea is to check each block that our ray passes through to see if it's a wall**
    - Find where our ray intersects the nearest vertical line (the left or right edges of my blocks)
    - Find where our ray intersects the nerest horizontal line (the top or bottom edges of my blocks)
    - Take whichever one is closer and find out if it's the edge of a wall
    - If it's a wall return the end point of our ray
    - if it's not, check the next closest intersection
    - if you still don't have a wall, run it again but with the next two intersections
    */
    // constants
    let currColumn = Math.floor(this.x / blockSize) // column containing player
    let currRow = Math.floor(this.y / blockSize) // row containing player
    let isLeft = this.direction > (Math.PI / 2) && this.direction < (Math.PI * 3 / 2) // looking left
    let isUp = this.direction > (Math.PI) // looking right
    let dx = isLeft ? this.x - currColumn * blockSize : (currColumn + 1) * blockSize - this.x // horizontal distance to intersection
    let dy = isUp ? this.y - currRow * blockSize : (currRow + 1) * blockSize - this.y // vertical distance to intersection
    // let xInterceptDist = Math.abs((dy / (Math.cos(this.direction)))) // distance to intersection on the x axis
    // let yInterceptDist = Math.abs((dx / (Math.cos(this.direction)))) // distance to intersection on the y axis
    // if(isUp){ yInterceptDist = Math.abs((dx/(Math.cos(Math.PI - this.direction))))}

    // let nextInterceptDist = xInterceptDist <= yInterceptDist ? xInterceptDist : yInterceptDist

    // console.log(`direction: ${this.direction} - isLeft:${isLeft}, isUp: ${isUp} -- dx: ${dx}, dy: ${dy}`)

    let xSkip = this.x
    let ySkip = this.y
    return this.findIntersect(xSkip, ySkip, dx, dy, isUp, isLeft)
    // this.findIntersect
    //  if this.hitWall return coords
    // else add a skip and run it again until we find one


  }


  /*
    --CODE GRAVEYARD--
    Here lies my first attempt at ray casting
  */
  //   let currentColumn = Math.floor(x / blockSize)
  //   let currentRow = Math.floor(y / blockSize)
  //   let left = this.direction > (Math.PI / 2) && this.direction < (Math.PI * 3 / 2)
  //   let down = this.direction > 0 && this.direction < Math.PI
  //   let skipColumns = 0
  //   let skipRows = 0

  //   // find the distance to the next intersection with a vertical line
  //   function findXDistance(direction, x, y) {
  //     // don't look for an intersection if the lines are parallell
  //     if(direction === Math.PI / 2 || direction === 3 * Math.PI / 2) return 999999999999999
  //     //looking to the left
  //     if(left) {
  //       debugger
  //       let edgeX = (currentColumn - 1) * blockSize + blockSize - (skipColumns * blockSize)
  //       let distanceToEdge = x - edgeX

  //       return (distanceToEdge / Math.cos(direction))
  //     } else { // looking right
  //       // x position of the vertical wall it's intersecting
  //       let edgeX = ((currentColumn + 1) * blockSize) + (skipColumns * blockSize)
  //       let distanceToEdge = edgeX - x
  //       return (distanceToEdge / Math.cos(direction))
  //     }
  //   }

  //   // find the distance to the next intersection with a horizontal line
  //   function findYDistance(direction, x, y) {
  //     if(direction === 0 || direction === Math.PI) return 999999999999999
  //     // looking down
  //     if(down) {
  //       return (((currentRow + (1 + skipRows)) * blockSize) - y) / Math.sin(direction)
  //     } else { // looking up
  //       return (((currentRow - skipRows) * blockSize) - y) / Math.sin(direction)
  //     }
  //   }

  //   function findBlock(verticalIntersection, endX, endY) {
  //     // find what block I'm looking at
  //     let endColumn
  //     let endRow
  //     //looking to the left
  //     if(left && verticalIntersection) {
  //       endColumn = Math.floor(endX / blockSize) - 1
  //     } else{
  //       endColumn = Math.floor(endX / blockSize)
  //     }
  //     // looking down
  //     if(down) {
  //       endRow = Math.floor(endY / blockSize)
  //     } else{
  //       // if we're looking up and it's a horizontal line subtract one block
  //       endRow = !verticalIntersection ? Math.floor(endY / blockSize) - 1 : Math.floor(endY / blockSize)
  //     }
  //     return [endColumn, endRow]
  //   }

  //   function getEndPoints(direction, x, y){
  //     while(true){
  //       let xDistance = findXDistance(direction, x, y) // horizontal distance to next vertical line intersection
  //       let yDistance = findYDistance(direction, x, y) // vertical distance to next horizontal line intersection
  //       shorterDistance = xDistance < yDistance ? xDistance : yDistance // I want to check the shorter one first
  //       verticalIntersection = xDistance < yDistance // the ray is intersecting with a vertical line

  //       // coordinates for where the ray hits the nearest line
  //       let endX = x + shorterDistance * Math.cos(direction)
  //       let endY = y + shorterDistance * Math.sin(direction)

  //       // which block I'm looking at in columns, rows
  //       let [endColumn, endRow] = findBlock(verticalIntersection, endX, endY)

  //       console.log(`${endColumn} , ${endRow}`)

  //       // is that block a wall
  //       let isWall = map[endRow * gridSize + endColumn] === 1

  //       if(isWall){
  //         return [endX, endY]
  //       } else {
  //         return [endX, endY]
  //         if(verticalIntersection) {skipRows++} else{skipColumns++}
  //       }
  //     }
  //   }
  //   let finalCoords = getEndPoints(this.direction, this.x, this.y)
  //   return finalCoords
  // }
}