import './App.css';
import { Canvas } from 'react-three-fiber'
import Column from './Column';
           
function App() {

  return (
    <div className="App">
     <h1>Please Wait...</h1>
      <Canvas>
        <Column 
          baseHeight={4}
          scaleFactor={1}
        />
      </Canvas>
    </div>
  );
}

export default App;
