import { getHeight, getGradientIndex } from './index.js'

describe('index functions', () => {


  it('calculate highest height', () => {
    const terrainPallette = ["moutain top", "sea"]
    const gradientIndex = 0
    const height = getHeight(gradientIndex, terrainPallette)
    expect(height).toBe(16)
  });

  it('calculate lowest height', () => {
    const terrainPallette = ["moutain top", "sea"]
    const gradientIndex = 1
    const height = getHeight(gradientIndex, terrainPallette)
    expect(height).toBe(8)
  });

  it('can get correct gradient index', () => {
    const heights = [-1, 1]
    const terrainPallette = ["moutain top", "sea"]
    const cell = heights[0]
    const gradientIndex = getGradientIndex(cell, terrainPallette, heights)
    expect(gradientIndex).toBe(1)
  })

  it('can get correct gradient index - sea for lowest - 2 gradients', () => {
    const heights = [1, -2, -3, 4]
    const terrainPallette = ["moutain top", "sea"]
    const cell = heights[2]
    const gradientIndex = getGradientIndex(cell, terrainPallette, heights)
    expect(gradientIndex).toBe(1)
  })

  it('can get correct gradient index - sea for lowest - 3 gradients', () => {
    const heights = [1, -2, -3, 4]
    const terrainPallette = ["moutain top", "grass", "sea"]
    const cell = heights[2]
    const gradientIndex = getGradientIndex(cell, terrainPallette, heights)
    expect(gradientIndex).toBe(2)
  })


  it('can get correct gradient index - sea for lowest - all negative heights', () => {
    const heights = [-1, -2, -3, -99, -100]
    const terrainPallette = ["moutain top", "grass", "sea"]
    const cell = heights[4]
    const gradientIndex = getGradientIndex(cell, terrainPallette, heights)
    expect(gradientIndex).toBe(2)
  })

})