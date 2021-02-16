class Terrain {

  constructor(){
    // [rows, cols]
    this.directionLookup = {
      NE: [-1, 1],
      SE: [1, 1],
      SW: [1, -1],
      NW: [-1, -1]
    }
  }

  init(grid){
    if (grid.length < 3){
      throw new Error('Grid too small')
    }
    this.grid = grid
  }

  runSquare(x, y, size){
    const corners = []
    corners.push(this.get(x, y, size, 'NW'))
    corners.push(this.get(x, y, size, 'NE'))
    corners.push(this.get(x, y, size, 'SE'))
    corners.push(this.get(x, y, size, 'SW'))
    this.set(x, y, this.average(corners))
  }

  set(x, y, value){
    this.grid[x][y] = value
  }

  average(numbers){
    return numbers.reduce((acc, cur) => acc + cur) / numbers.length
  }

  get(x, y, sideLength, direction){
    const jump = Math.floor(sideLength / 2)
    const cornerX = this.directionLookup[direction][0] * jump + x
    const cornerY = this.directionLookup[direction][1] * jump + y
    return this.grid[cornerX][cornerY]
  }


}

module.exports = Terrain