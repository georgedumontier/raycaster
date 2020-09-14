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
      if(map[yBlock * gridSize + xBlock] === 1) console.log(`${xBlock}, ${yBlock}`)
      return map[yBlock * gridSize + xBlock] === 1
  }
  this.hitWallX = function(x, y) {
    let xBlock =  Math.floor(x / blockSize)
    let yBlock = Math.floor(y / blockSize) + (player.y > y ? -1 : 0)
    if(map[yBlock * gridSize + xBlock] === 1) console.log(`${xBlock},  ${yBlock}`)
    return map[yBlock * gridSize + xBlock] === 1
  }
  this.getNextXIntersect = function(lastXIntersect, xStep, isLeft, isUp){

    let newXIntercept = {}
    if(parseFloat(this.direction.toFixed(2)) == parseFloat(Math.PI.toFixed(2)) || parseFloat(this.direction.toFixed(2)) == parseFloat((2 * Math.PI).toFixed(2)) || parseFloat(Math.abs(this.direction).toFixed(2)) == 0.00) {
      newXIntercept.dist = 99999999
      return newXIntercept
    }
    newXIntercept.x = lastXIntersect.x + xStep

    newXIntercept.y = isUp ? lastXIntersect.y - blockSize : lastXIntersect.y + blockSize
    newXIntercept.dist = Math.sqrt(Math.pow(newXIntercept.x - lastXIntersect.x, 2) + Math.pow(newXIntercept.y - lastXIntersect.y, 2))
    // newXIntercept.dist = 99999999
    return newXIntercept

  }
  this.getNextYIntersect = function(lastYIntersect, yStep, isLeft, isUp){

    let newYIntercept = {}
    if(parseFloat(this.direction.toFixed(1)) == parseFloat((Math.PI / 2).toFixed(1)) || parseFloat(this.direction.toFixed(2)) == parseFloat((3 * Math.PI /2).toFixed(2))) {
      newYIntercept.dist = 99999999
      return newYIntercept
    }
    newYIntercept.x = isLeft ? lastYIntersect.x - blockSize : lastYIntersect.x + blockSize
    newYIntercept.y = lastYIntersect.y + yStep
    newYIntercept.dist = Math.sqrt(Math.pow(newYIntercept.x - lastYIntersect.x, 2) + Math.pow(newYIntercept.y - lastYIntersect.y, 2))
    return newYIntercept
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

    let xStep = Math.tan(Math.PI / 2 - this.direction) *  blockSize
    let yStep = Math.tan(this.direction) * blockSize
    if(isLeft) yStep = -yStep // second and third quadrant
    if(isUp) xStep = -xStep
    // let xStep = (1 / yStep)
    // yStep = yStep * blockSidze


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

    // return xIntersect.dist < yIntersect.dist ? [xIntersect.x, xIntersect.y] : [yIntersect.x, yIntersect.y]

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
    // console.log(`direction:${this.direction}, xStep:${xStep} , yStep:${yStep} xIntersect.dist:${xIntersect.dist}, yIntersect.dist: ${yIntersect.dist}`)
    return coords

  }
}
