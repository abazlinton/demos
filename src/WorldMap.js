import Column from "./Column"
import Terrain from './terrain'
import {terrainPallette} from './terrainPallette'

const WorldMap = ({ mapLength }) => {
  const terrain = new Terrain()
  const size = 2 ** mapLength
  terrain.init(size + 1)
  terrain.set(0, 0, -10)
  terrain.set(0, size, -10)
  terrain.set(size, size, -10)
  terrain.set(size, 0, -10)
  terrain.run(size + 1)
  const allHeights = terrain.grid.flat()
  const max = allHeights.reduce((highest, current) => current > highest ? current : highest)
  // const min = allHeights.reduce((lowest, current) => current < lowest ? current : lowest)
  // TODO: use map to create columns
  const columns = []
  terrain.grid.forEach((cols, z) => cols.forEach((cell, x) => {
    let gradientIndex = Math.floor(terrainPallette.length - cell / max * terrainPallette.length)
    if (gradientIndex < 0) gradientIndex = 0
    if (gradientIndex >= terrainPallette.length) gradientIndex = terrainPallette.length - 1
    const height = ((1 - (gradientIndex / terrainPallette.length)))
    // const geometry = new THREE.BoxGeometry(0.5, height, 0.5)
    // const rgb = terrainPallette[gradientIndex]
    // const material = new THREE.MeshBasicMaterial({
    //   color: rgb
    // });
    // geometry.translate(x / 4, height / 2, y / 4)
    // geometry.translate(x / 4, 0, y / 4)
    const y = height / 2

    // const column = new THREE.Mesh(geometry, material)
    // scene.add(column);
    // scene.background = sunset
    columns.push(<Column
        baseHeight={height}
        scaleFactor={8}
        position={[x , y, z ]}
        key={`${x}.${y}.${z}`}
    />)
  }))
  console.log(columns.length)
  return columns

}

export default WorldMap



