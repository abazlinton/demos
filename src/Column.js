import { terrainPallette } from './terrainPallette'
import PropTypes from 'prop-types'; 


const Column = function ({ baseHeight, scaleFactor }) {

  const color = terrainPallette[baseHeight]
  const height = baseHeight * scaleFactor

  return (
    <mesh>
      <boxGeometry args={[1, height, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )

}

Column.propTypes = {
  baseHeight: PropTypes.number.isRequired,
  scaleFactor: PropTypes.number.isRequired
}



export default Column