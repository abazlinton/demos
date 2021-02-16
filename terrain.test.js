const Terrain = require('./terrain')


describe('Terrain', () => {

  it('should rejects grids that are wrong size ', () => {
    expect(() => new Terrain().init(7)).toThrow('Grid size not valid')
  });

  it('should be able to calculate corner values 3x3', () => {
    const terrain = new Terrain()
    terrain.init([
      [1, 0, 2],
      [0, 0, 0],
      [4, 0, 3]
    ])
    expect(terrain.get(1, 1, 3, 'NW')).toBe(1)
    expect(terrain.get(1, 1, 3, 'NE')).toBe(2)
    expect(terrain.get(1, 1, 3, 'SE')).toBe(3)
    expect(terrain.get(1, 1, 3, 'SW')).toBe(4)
  })

  it('should be able to calculate corner values 5x5', () => {
    const terrain = new Terrain()
    terrain.init([
      [1, 0, 0, 0, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [4, 0, 0, 0, 3]

    ])
    expect(terrain.get(2, 2, 5, 'NW')).toBe(1)
    expect(terrain.get(2, 2, 5, 'NE')).toBe(2)
    expect(terrain.get(2, 2, 5, 'SE')).toBe(3)
    expect(terrain.get(2, 2, 5, 'SW')).toBe(4)
  })

  it('should be able to calculate corner values of 3x3 within a 5x5', () => {
    const terrain = new Terrain()
    terrain.init([
      [1, 0, 2, 0, 0],
      [0, 0, 0, 0, 0],
      [4, 0, 3, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ])
    expect(terrain.get(1, 1, 3, 'NW')).toBe(1)
    expect(terrain.get(1, 1, 3, 'NE')).toBe(2)
    expect(terrain.get(1, 1, 3, 'SE')).toBe(3)
    expect(terrain.get(1, 1, 3, 'SW')).toBe(4)
  })

  it('should set square value', () => {
    const terrain = new Terrain()
    terrain.init([
      [1, 0, 2],
      [0, 0, 0],
      [4, 0, 3]
    ])
    terrain.runSquare(1, 1, 3)
    expect(terrain.grid[1][1]).toBe(2.5)
  });

  it('should complete all square values 3x3', () => {
    const terrain = new Terrain()
    terrain.init([
      [1, 0, 2],
      [0, 0, 0],
      [4, 0, 3]
    ])
    terrain.run(3)
    expect(terrain.grid[1][1]).toBe(2.5)
  });

  it('should complete all square values 5x5', () => {
    const terrain = new Terrain()
    terrain.init(5)
    terrain.set(0, 0, 4)
    terrain.set(0, 4, 4)
    terrain.set(4, 4, 4)
    terrain.set(4, 0, 4)
    terrain.run(5)
    expect(terrain.grid[2][2]).toBe(4)
    expect(terrain.grid[1][1]).toBe(2)
    expect(terrain.grid[1][3]).toBe(2)
    expect(terrain.grid[3][3]).toBe(2)
    expect(terrain.grid[3][1]).toBe(2)
    console.log(terrain.grid)
  });

  it('should be able to calculate diamond values 3x3', () => {
    const terrain = new Terrain()
    terrain.init([
      [1, 0, 1],
      [0, 2, 0],
      [3, 0, 1]
    ])
    expect(terrain.get(0, 1, 3, 'N')).toBe(1)
    expect(terrain.get(0, 1, 3, 'E')).toBe(2)
    expect(terrain.get(0, 1, 3, 'S')).toBe(3)
    expect(terrain.get(0, 1, 3, 'W')).toBeUndefined()

   
  })

 



});

