import Terrain from './terrain'


describe('Terrain', () => {

  let terrain

  beforeEach(() => {
    terrain = new Terrain()
    terrain.getRandomOffsetForHeight = () => 0
    // +Y ⬇️
    // +X ➡️
  });

  it('should rejects grids that are wrong size ', () => {
    expect(() => new Terrain().init(7)).toThrow('Grid size not valid')
  });

  it('should be able to retrieve corner values 3x3', () => {
    
    terrain.init([
      [4, 0, 3],
      [0, 0, 0],
      [1, 0, 2]
    ])
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'NW')).toBe(1)
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'NE')).toBe(2)
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'SE')).toBe(3)
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'SW')).toBe(4)
  })

  it('should be able to retrieve corner values 5x5', () => {
    terrain.init([
      [4, 0, 0, 0, 3],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 2]

    ])
    expect(terrain.getHeightForSizeAndDirection(2, 2, 5, 'NW')).toBe(1)
    expect(terrain.getHeightForSizeAndDirection(2, 2, 5, 'NE')).toBe(2)
    expect(terrain.getHeightForSizeAndDirection(2, 2, 5, 'SE')).toBe(3)
    expect(terrain.getHeightForSizeAndDirection(2, 2, 5, 'SW')).toBe(4)
  })

  it('should be able to retrieve corner values of 3x3 within a 5x5', () => {
    terrain.init([
      [4, 0, 3, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 2, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ])
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'NW')).toBe(1)
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'NE')).toBe(2)
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'SE')).toBe(3)
    expect(terrain.getHeightForSizeAndDirection(1, 1, 3, 'SW')).toBe(4)
  })

  it('should complete all square values 3x3', () => {
    terrain.init([
      [2, 0, 4],
      [0, 0, 0],
      [6, 0, 8]
    ])
    terrain.run(3)
    expect(terrain.getHeight(1, 1)).toBe(5)
  });

  it('should be able to retrieve diamond values 3x3', () => {
    terrain.init([
      [1, 0, 1],
      [0, 2, 0],
      [3, 0, 1]
    ])
    expect(terrain.getHeightForSizeAndDirection(0, 1, 3, 'N')).toBe(3)
    expect(terrain.getHeightForSizeAndDirection(0, 1, 3, 'E')).toBe(2)
    expect(terrain.getHeightForSizeAndDirection(0, 1, 3, 'S')).toBe(1)
    expect(terrain.getHeightForSizeAndDirection(0, 1, 3, 'W')).toBeUndefined()  
  })

  it('should not blow up reading off-grid', () => {
    terrain.init([
      [1]
    ])
    expect(terrain.getHeightForSizeAndDirection(0, 0, 3, 'N')).toBeUndefined()
    expect(terrain.getHeightForSizeAndDirection(0, 0, 3, 'S')).toBeUndefined()
    expect(terrain.getHeightForSizeAndDirection(0, 0, 3, 'W')).toBeUndefined()
    expect(terrain.getHeightForSizeAndDirection(0, 0, 3, 'E')).toBeUndefined()
  })

  it('should set diamond value 3 points', () => {
    terrain.init([
      [1, 0, 0],
      [0, 2, 0],
      [3, 0, 0]
    ])
    terrain.runDiamond(0, 1, 3)
    expect(terrain.getHeight(0, 1)).toBe(2)
  });

  it('should set diamond value 4 points', () => {
    terrain.init([
      [0, 6, 0],
      [8, 0, 4],
      [0, 2, 0]
    ])
    terrain.runDiamond(1, 1, 3)
    expect(terrain.getHeight(1, 1)).toBe(5)
  });

  it('should set diamond value 3 points 5x5', () => {
    terrain.init([
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1]
    ])
    terrain.runDiamond(0, 2, 5)
    expect(terrain.getHeight(0, 2)).toBe(1)

  });

  it('should complete ALL 3x3', () => {
    terrain.init([
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ])
    terrain.run(3)
    expect(terrain.grid).toStrictEqual(new Array(3).fill(1).map(() => new Array(3).fill(1)))
  });

  it('should complete ALL 5x5', () => {
    terrain.init([
      [4, 0, 0, 0, 4],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [4, 0, 0, 0, 4]
    ])
    terrain.run(5)
    expect(terrain.grid).toStrictEqual(new Array(5).fill(4).map(() => new Array(5).fill(4)))
  });
 



});

