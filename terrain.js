class Terrain {

  constructor() {
    this.directionLookup = {
      NE: [1, 1],
      SE: [1, -1],
      SW: [-1, -1],
      NW: [-1, 1],
      N: [0, 1],
      E: [1, 0],
      S: [0, -1],
      W: [-1, 0]
    }
  }

  init(gridOrSize) {
    if (typeof gridOrSize === 'object') {
      this.grid = gridOrSize
      return
    }
    const gridSize = gridOrSize
    if (!(Math.log2(gridSize - 1) % 1 === 0)) {
      throw new Error('Grid size not valid')
    }
    this.grid = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill(0))
  }

  runSquare(x, y, size) {
    const corners = []
    corners.push(this.getHeightForSizeAndDirection(x, y, size, 'NW'))
    corners.push(this.getHeightForSizeAndDirection(x, y, size, 'NE'))
    corners.push(this.getHeightForSizeAndDirection(x, y, size, 'SE'))
    corners.push(this.getHeightForSizeAndDirection(x, y, size, 'SW'))
    const average = this.average(corners)
    let height = average + this.getRandomOffsetForHeight(size)
    if (height < 0) height = 0
    this.setHeight(x, y, height)
  }

  runDiamond(x, y, size) {
    const points = []
    points.push(this.getHeightForSizeAndDirection(x, y, size, 'N'))
    points.push(this.getHeightForSizeAndDirection(x, y, size, 'E'))
    points.push(this.getHeightForSizeAndDirection(x, y, size, 'S'))
    points.push(this.getHeightForSizeAndDirection(x, y, size, 'W'))
    const onGridPoints = points.filter(point => point !== undefined)
    const average = this.average(onGridPoints)
    let height = average + this.getRandomOffsetForHeight(size)
    this.setHeight(x, y, height)
    // }
  }

  setHeight(x, y, value) {
    this.grid[y][x] = value
  }

  getHeight(x, y) {
    return this.grid[y]?.[x]
  }

  getRandomOffsetForHeight(size) {
    return randomIntFromInterval(-size, size)
  }

  average(numbers) {
    return numbers.reduce((acc, cur) => acc + cur) / numbers.length
  }

  getHeightForSizeAndDirection(x, y, sideLength, direction) {
    const jump = Math.floor(sideLength / 2)
    const cornerX = this.directionLookup[direction][0] * jump + x
    const cornerY = this.directionLookup[direction][1] * jump + y
    return this.getHeight(cornerX, cornerY)
  }

  run(size) {
    const middle = Math.floor(size / 2)
    if (middle < 1) return
    for (let x = middle; x < this.grid.length; x += size) {
      for (let y = middle; y < this.grid.length; y += size) {
        this.runSquare(x, y, size)
        this.runDiamond(x, y - middle, size) // top
        this.runDiamond(x + middle, y, size) // right
        this.runDiamond(x, y + middle, size) // bottom
        this.runDiamond(x - middle, y, size) // left
      }
    }
    return this.run(middle)
  }
}

// TODO - this aint an int!
export function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}


export default Terrain