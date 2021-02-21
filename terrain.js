class Terrain {

  constructor(){
    // [rows, cols]
    this.directionLookup = {
      NE: [-1, 1],
      SE: [1, 1],
      SW: [1, -1],
      NW: [-1, -1],
      N: [-1, 0],
      E: [0, 1],
      S: [1, 0],
      W: [0, -1]
    }
  }

  init(gridOrSize){
    if (typeof gridOrSize === 'object') {
      this.grid = gridOrSize
      return
    }
    const gridSize = gridOrSize
    if (!(Math.log2(gridSize - 1) % 1 === 0)){
      throw new Error('Grid size not valid')
    }
    this.grid = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill(0))
  }

  runSquare(x, y, size){
    const corners = []
    corners.push(this.get(x, y, size, 'NW'))
    corners.push(this.get(x, y, size, 'NE'))
    corners.push(this.get(x, y, size, 'SE'))
    corners.push(this.get(x, y, size, 'SW'))
    const average = this.average(corners)
    // if (this.grid[x][y] === 0){
      let height = average + this.getRandomOffsetForHeight(size)
      if (height < 0) height = 0
      this.set(x, y, height)
    // }
  }

  runDiamond(x, y, size){
    const points = []
    points.push(this.get(x, y, size, 'N'))
    points.push(this.get(x, y, size, 'E'))
    points.push(this.get(x, y, size, 'S'))
    points.push(this.get(x, y, size, 'W'))
    const onGridPoints = points.filter(point => point !== undefined)
    const average = this.average(onGridPoints)
    // if (this.grid[x][y] === 0){
      let height = average + this.getRandomOffsetForHeight(size)
      if (height < 0) height = 0
      this.set(x, y, height)
    // }
  }

  set(x, y, value){
    this.grid[x][y] = value
  }

  getRandomOffsetForHeight(size){
    return randomIntFromInterval(0, size * 2) - 0.5 * size * 2
  }

  average(numbers){
    return numbers.reduce((acc, cur) => acc + cur) / numbers.length
  }

  get(x, y, sideLength, direction){
    const jump = Math.floor(sideLength / 2)
    const cornerX = this.directionLookup[direction][0] * jump + x
    const cornerY = this.directionLookup[direction][1] * jump + y
    return this.grid[cornerX]?.[cornerY]
  }

  run(size){
    const middle = Math.floor(size / 2)
    if (middle < 1) return
    for (let x = middle; x < this.grid.length; x += size){
      for (let y = middle; y < this.grid.length; y += size){
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

function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}


export default Terrain