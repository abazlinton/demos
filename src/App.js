import './App.css';
import { Canvas } from 'react-three-fiber'
import WorldMap from './WorldMap';
           
function App() {

  return (
    <div className="App">
     <h1>Please Wait...</h1>
      <Canvas>
        <WorldMap 
          mapLength={7}
        >
        </WorldMap>
      </Canvas>
    </div>
  );
}

export default App;
