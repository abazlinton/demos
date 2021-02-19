import { terrainPallette } from './terrainPallette'
import PropTypes from 'prop-types';
import {mesh, boxGeometry, meshBasicMaterial} from 'react-three-fiber'


const Column = ({ baseHeight, scaleFactor, position }) => {

  const color = terrainPallette[baseHeight]
  const height = baseHeight * scaleFactor
  return (
    <mesh>
      <boxGeometry
        args={[1, height, 1]}
        position={position}
      />

      {/* TODO: generate materials in advance? */}
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

Column.propTypes = {
  baseHeight: PropTypes.number.isRequired,
  scaleFactor: PropTypes.number.isRequired,
  position: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
}

export default Column