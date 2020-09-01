function Ray(x, y, direction) {
  this.x = x
  this.y = y
  this.direction = direction
  this.findXIntersect = function(x, y, dy, isUp){
    let interceptX = {}
    interceptX.y = (isUp ? y - dy : y + dy)
    let slope = Math.tan(this.direction)
    slope = parseFloat(slope.toFixed(1))
    if (Math.abs(slope) == 0.0) {
      interceptX.dist = 999999999
      return interceptX
    }
    interceptX.x = ((interceptX.y - y) / slope) + x
    interceptX.dist = Math.sqrt(Math.pow(interceptX.x - x, 2) + Math.pow(interceptX.y - y, 2))


    return interceptX
  }
  this.findYIntersect = function(x, y, dx, isLeft){


    // vertical lines
    let interceptY = {}

    interceptY.x = (isLeft ? x - dx : x + dx)
    let slope = parseFloat(Math.tan(this.direction).toFixed(2))
    if (Math.abs(slope) == 1.00) {
      interceptY.dist = 9999999
      return interceptY
    }
    interceptY.y = ((interceptY.x - x) * slope) + y
    interceptY.dist = Math.sqrt(Math.pow(interceptY.x - x, 2) + Math.pow(interceptY.y - y, 2))
    return interceptY

  }
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
  this.hitWallY = function(x, y) {
      let xBlock = Math.floor(x / blockSize) + (player.x > x ? -1 : 0)
      let yBlock = Math.floor(y / blockSize)
      return map[yBlock * gridSize + xBlock] === 1
  }
  this.hitWallX = function(x, y) {
    let xBlock =  Math.floor(x / blockSize)
    let yBlock = Math.floor(y / blockSize) + (player.y > y ? -1 : 0)
    return map[yBlock * gridSize + xBlock] === 1
  }
  this.getNextXIntersect = function(lastXIntersect, xStep, isLeft, isUp){

    let newXIntercept = {}
    if(parseFloat(this.direction.toFixed(2)) == parseFloat(Math.PI.toFixed(2)) || parseFloat(this.direction.toFixed(2)) == parseFloat((2 * Math.PI).toFixed(2)) || parseFloat(Math.abs(this.direction).toFixed(2)) == 0.00) {
      newXIntercept.dist = 99999999
      return newXIntercept
    }
    newXIntercept.x = lastXIntersect.x + xStep

    newXIntercept.y = lastXIntersect.y + blockSize
    newXIntercept.dist = Math.sqrt(Math.pow(newXIntercept.x - lastXIntersect.x, 2) + Math.pow(newXIntercept.y - lastXIntersect.y, 2))
    return newXIntercept

  }
  this.getNextYIntersect = function(lastYIntersect, yStep, isLeft, isUp){

    let newYIntercept = {}
    if(parseFloat(this.direction.toFixed(1)) == parseFloat((Math.PI / 2).toFixed(1)) || parseFloat(this.direction.toFixed(2)) == parseFloat((3 * Math.PI /2).toFixed(2))) {
      newYIntercept.dist = 99999999
      return newYIntercept
    }
    newYIntercept.x = lastYIntersect.x + blockSize
    newYIntercept.y = lastYIntersect.y + yStep
    newYIntercept.dist = Math.sqrt(Math.pow(newYIntercept.x - lastYIntersect.x, 2) + Math.pow(newYIntercept.y - lastYIntersect.y, 2))
    return newYIntercept
    // isUp ? [yIntercect.x + xStep, yIntersect.y + blockSize] : [yIntersect.x + xStep, yIntersect.y + blockSize]
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

    let xIntersect = this.findXIntersect(this.x, this.y, dy, isUp, 0)
    let yIntersect = this.findYIntersect(this.x, this.y, dx, isLeft, 0)
    // let yStep = isLeft ? Math.tan(-this.direction) * blockSize : Math.tan(this.direction) * blockSize
    // let xStep = isUp ? Math.tan((Math.PI / 2 * 3 - -this.direction)) * blockSize : Math.tan((Math.PI / 2 * 3 - this.direction)) * blockSize
    function invertAngle(angle) {
      return (angle + Math.PI) % (2 * Math.PI);
    }
    // let yStep = isUp ? Math.tan(invertAngle(this.direction)) * blockSize : Math.tan(this.direction) * blockSize
    // let xStep = isLeft ? Math.tan(invertAngle(Math.PI / 2 - this.direction)) *  blockSize : Math.tan(Math.PI / 2 - this.direction) * blockSize
    let yStep = Math.atan(this.direction) * blockSize
    let xStep = Math.atan(Math.PI / 2 - this.direction) *  blockSize
    //if (isLeft) {xStep = Math.tan(this.direction) * blockSize}


    function drawSteps(steps) {

      ctx.beginPath()
      ctx.moveTo(player.x, player.y)
      ctx.lineTo(steps.xStep.x[1], steps.xStep.y[1])
      ctx.closePath()
      ctx.strokeStyle = 'purple'
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(player.x, player.y)
      ctx.lineTo(steps.yStep.x[1], steps.yStep.y[1])
      ctx.closePath()
      ctx.strokeStyle = 'blue'
      ctx.stroke()
    }


    drawSteps({
      xStep:{
        x: [this.x, isLeft ? this.x - dx : this.x + dx],
        y: [this.y, this.y]
      },
      yStep:{
        x: [this.x, this.x],
        // y: [this.y, this.y + dy]
        y: [this.y, isUp ? this.y - dy : this.y + dy]
      }
    })


    let coords = null
    let i = 0
    while(!coords){
      i++

      let nextXIntersect = this.getNextXIntersect(xIntersect, xStep, isLeft, isUp)
      let nextYIntersect = this.getNextYIntersect(yIntersect, yStep, isLeft, isUp)
      if(nextXIntersect.dist < nextYIntersect.dist){
        if(this.hitWallX(nextXIntersect.x, nextXIntersect.y)){
          coords = [nextXIntersect.x, nextXIntersect.y]
        } else{
          if(i>50) coords = [0,0]
          xIntersect = nextXIntersect
        }
      } else{
        if(this.hitWallY(nextYIntersect.x, nextYIntersect.y)) {
          coords = [nextYIntersect.x, nextYIntersect.y]
        } else{
          if(i > 50) coords =[0,0]
          yIntersect = nextYIntersect
        }
      }
    }
    console.log(`direction:${this.direction}, xStep:${xStep} , yStep:${yStep} xIntersect.dist:${xIntersect.dist}, yIntersect.dist: ${yIntersect.dist}`)
    return coords
    // return coords
    // return xIntersect.dist < yIntersect.dist ? [xIntersect.x, xIntersect.y] : [yIntersect.x, yIntersect.y]
  }
}
    // let coords = null
    // while(!coords){

    //   if(xIntersect.dist < yIntersect.dist) {
    //     if(this.hitWallX(xIntersect.x, xIntersect.y)){
    //       coords = [xIntersect.x, xIntersect.y]
    //     } else {
    //       ySkip++
    //       xIntersect = this.findXIntersect(this.x, this.y, dy, isUp, ySkip)
    //     }
    //   }
    //   else{
    //     if(this.hitWallY(yIntersect.x, yIntersect.y)){
    //       coords = [yIntersect.x, yIntersect.y]
    //     } else{
    //       xSkip++
    //       yIntersect = this.findYIntersect(this.x, this.y, dx, isLeft, xSkip)
    //     }
    //   }
    // }

    // return coords
    // this.findIntersect
    //  if this.hitWall return coords
    // else add a skip and run it again until we find one





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
