function Ray(direction) {
  this.direction = direction
  this.length = null
  this.diffX = null
  this.diffY = null
  this.findXIntersect = function (x, y, dy, isUp) {
    let interceptX = {}
    interceptX.y = (isUp ? y - dy : y + dy)
    let slope = Math.tan(this.direction)
    slope = parseFloat(slope.toFixed(3))
    if (Math.abs(slope) == 0.000) {
      interceptX.dist = 999999999
      return interceptX
    }
    interceptX.x = ((interceptX.y - y) / slope) + x
    interceptX.dist = distance(interceptX.x, interceptX.y, x, y)
    return interceptX
  }
  this.findYIntersect = function (x, y, dx, isLeft) {
    let interceptY = {}
    interceptY.x = (isLeft ? x - dx : x + dx)
    let slope = parseFloat(Math.tan(this.direction).toFixed(3))
    if (Math.abs(slope) == 1.000) {
      interceptY.dist = 9999999
      return interceptY
    }
    interceptY.y = ((interceptY.x - x) * slope) + y
    interceptY.dist = distance(interceptY.x, interceptY.y, x, y)
    return interceptY
  }
  this.hitWallY = function (x, y) {
    let xBlock = Math.floor(x / blockSize) + (player.x > x ? -1 : 0)
    let yBlock = Math.floor(y / blockSize)
    return map[yBlock * gridSize + xBlock] === 1
  }
  this.hitWallX = function (x, y) {
    let xBlock = Math.floor(x / blockSize)
    let yBlock = Math.floor(y / blockSize) + (player.y > y ? -1 : 0)
    return map[yBlock * gridSize + xBlock] === 1
  }
  this.getNextXIntersect = function (lastXIntersect, xStep, isUp) {
    let newXIntercept = {}
    if (parseFloat(this.direction.toFixed(2)) == parseFloat(Math.PI.toFixed(2)) || parseFloat(this.direction.toFixed(2)) == parseFloat((2 * Math.PI).toFixed(2)) || parseFloat(Math.abs(this.direction).toFixed(2)) == 0.00) {
      newXIntercept.dist = 99999999
      return newXIntercept
    }
    newXIntercept.x = lastXIntersect.x + xStep
    newXIntercept.y = isUp ? lastXIntersect.y - blockSize : lastXIntersect.y + blockSize
    newXIntercept.dist = distance(newXIntercept.x, newXIntercept.y, player.x, player.y)
    return newXIntercept
  }
  this.getNextYIntersect = function (lastYIntersect, yStep, isLeft) {
    let newYIntercept = {}
    if (parseFloat(this.direction.toFixed(1)) == parseFloat((Math.PI / 2).toFixed(1)) || parseFloat(this.direction.toFixed(2)) == parseFloat((3 * Math.PI / 2).toFixed(2))) {
      newYIntercept.dist = 99999999
      return newYIntercept
    }
    newYIntercept.x = isLeft ? lastYIntersect.x - blockSize : lastYIntersect.x + blockSize
    newYIntercept.y = lastYIntersect.y + yStep
    newYIntercept.dist = distance(newYIntercept.x, newYIntercept.y, player.x, player.y)
    return newYIntercept
  }
  this.collide = function () {
    // constants
    let currColumn = Math.floor(player.x / blockSize) // column containing player
    let currRow = Math.floor(player.y / blockSize) // row containing player
    let isLeft = this.direction > (Math.PI / 2) && this.direction < (Math.PI * 3 / 2) // looking left
    let isUp = this.direction > (Math.PI) // looking right
    let dx = isLeft ? player.x - currColumn * blockSize : (currColumn + 1) * blockSize - player.x // horizontal distance to intersection
    let dy = isUp ? player.y - currRow * blockSize : (currRow + 1) * blockSize - player.y // vertical distance to intersection
    let xIntersect = this.findXIntersect(player.x, player.y, dy, isUp, 0)
    let yIntersect = this.findYIntersect(player.x, player.y, dx, isLeft, 0)
    let xStep = Math.tan(Math.PI / 2 - this.direction) * blockSize
    let yStep = Math.tan(this.direction) * blockSize
    if (isLeft) yStep = -yStep // second and third quadrant
    if (isUp) xStep = -xStep

    let coords = null
    let i = 0
    let nextXIntersect = xIntersect
    let nextYIntersect = yIntersect
    // console.log(`${player.x}, ${player.y}, ${player.direction}`)

    while (coords === null) {
      i++
      if (nextXIntersect.dist < nextYIntersect.dist) {
        if (this.hitWallX(nextXIntersect.x, nextXIntersect.y)) {
          this.length = nextXIntersect.dist
          coords = [nextXIntersect.x, nextXIntersect.y]
        } else {
          if (i > 50) {
            coords = [0, 0]
          }
          nextXIntersect = this.getNextXIntersect(nextXIntersect, xStep, isUp)
        }
      } else {
        if (this.hitWallY(nextYIntersect.x, nextYIntersect.y)) {
          this.length = nextYIntersect.dist
          coords = [nextYIntersect.x, nextYIntersect.y]
        } else {
          if (i > 50) {
            coords = [0, 0]
          }
          nextYIntersect = this.getNextYIntersect(nextYIntersect, yStep, isLeft)
        }
      }
    }
    // console.log(`direction:${this.direction}, xStep:${xStep} , yStep:${yStep} xIntersect.dist:${xIntersect.dist}, yIntersect.dist: ${yIntersect.dist}`)
    this.diffX = player.x - coords[0]
    this.diffY = player.y - coords[1]
    return coords
  }
}


   // function drawSteps(steps) {

    //   ctx.beginPath()
    //   ctx.moveTo(player.x, player.y)
    //   ctx.lineTo(steps.xStep.x[1], steps.xStep.y[1])
    //   ctx.closePath()
    //   ctx.strokeStyle = 'purple'
    //   ctx.stroke()

    //   ctx.beginPath()
    //   ctx.moveTo(player.x, player.y)
    //   ctx.lineTo(steps.yStep.x[1], steps.yStep.y[1])
    //   ctx.closePath()
    //   ctx.strokeStyle = 'blue'
    //   ctx.stroke()
    // }


    // drawSteps({
    //   xStep: {
    //     x: [this.x, isLeft ? this.x - dx : this.x + dx],
    //     y: [this.y, this.y]
    //   },
    //   yStep: {
    //     x: [this.x, this.x],
    //     // y: [this.y, this.y + dy]
    //     y: [this.y, isUp ? this.y - dy : this.y + dy]
    //   }
    // })

    // return xIntersect.dist < yIntersect.dist ? [xIntersect.x, xIntersect.y] : [yIntersect.x, yIntersect.y]
