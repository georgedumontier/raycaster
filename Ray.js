function Ray(x, y, direction) {
  this.x = x
  this.y = y
  this.direction = direction
  this.intersection = null
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
    let currColumn = Math.floor(player.x / blockSize) // column containing player
    let currRow = Math.floor(player.y / blockSize) // row containing player
    let isLeft = this.direction > (Math.PI / 2) && this.direction < (Math.PI * 3 / 2) // looking left
    let isUp = this.direction > (Math.PI) // looking right
    let dx = isLeft ? player.x - currColumn * blockSize : (currColumn + 1) * blockSize - player.x // horizontal distance to intersection
    let dy = isUp ? player.y - currRow * blockSize : (currRow + 1) * blockSize - player.y // vertical distance to intersection
    let xInterceptDist = Math.abs((dy / (Math.cos(this.direction)))) // distance to x axis intersection
    let yInterceptDist = Math.abs((dx / (Math.cos(this.direction)))) // distance to Y axis intersection

    let nextInterceptDist = xInterceptDist < yInterceptDist ? xInterceptDist : yInterceptDist
    function findIntersect(x, y, direction) {
      // console.log(xInterceptDist < yInterceptDist)
      // should be able to use the point slope formula
      // y − y1 = m(x − x1)
      // interceptY - y = tan(direction) * (interceptX - x)
      let interceptX = 0
      let interceptY = 0
      if(nextInterceptDist === xInterceptDist){ // horizontal line intersection
        interceptY = isUp ? y - dy : y + dy
        interceptX = ((interceptY - y) * Math.tan(direction)) + x

      } else { // vertical line intersection
        interceptX = isLeft ? x - dx : x + dx
        interceptY = ((interceptX - x) * Math.tan(direction)) + y

      }


      return [interceptX, interceptY]
    }
    console.log(`${currColumn} , ${currRow} - isLeft:${isLeft}, isUp: ${isUp} -- dx: ${dx}, dy: ${dy} -- Intercepts: ${xInterceptDist} , ${yInterceptDist} ${xInterceptDist < yInterceptDist ? 'horizontal line' : 'vertical line'}`)
    return findIntersect(this.x, this.y, this.direction)


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