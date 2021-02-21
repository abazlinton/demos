import { getHeight } from './index.js'

describe('index functions', () => {


  it('calculate highest height', () => {
    const terrainPallette = [null, null]
    const gradientIndex = 0
    const height = getHeight(gradientIndex, terrainPallette)
    expect(height).toBe(8)
  });

  it('calculate lowest height', () => {
    const terrainPallette = [null, null]
    const gradientIndex = 1
    const height = getHeight(gradientIndex, terrainPallette)
    expect(height).toBe(4)
  });

})