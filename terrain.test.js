const Terrain = require('./terrain')


describe('Terrain', () => {

  it('should rejects grids that are too small ', () => {
    expect(() => new Terrain().init([])).toThrow('Grid too small')
    expect(() => new Terrain().init([1, 1])).toThrow('Grid too small')
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


});

