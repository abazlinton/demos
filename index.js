
import * as THREE from 'three';
import Terrain from './terrain'
import Stats from 'stats.js'
import { terrainPallette } from './terrainPallette'

export function getHeight(gradientIndex, terrainPallette) {
  return ((1 - (gradientIndex / terrainPallette.length)) * 16)
}

export function getGradientIndex(cellHeight, terrainPallette, heights) {
  const max = heights.reduce((highest, current) => current > highest ? current : highest)
  let gradientIndex = Math.floor(terrainPallette.length - cellHeight / max * terrainPallette.length)
  if (gradientIndex < 0) gradientIndex = 0
  if (gradientIndex >= terrainPallette.length) gradientIndex = terrainPallette.length - 1
  return gradientIndex
}

// adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_performance.html
const makeMatrix = function () {
  // These are all reused for each column so we just make them once
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const rotation = new THREE.Euler();
  const scale = new THREE.Vector3();
  const matrix = new THREE.Matrix4();
  return function (x, y, z) {
    position.x = x
    position.y = y
    position.z = z
    scale.x = scale.y = scale.z = 1
    quaternion.setFromEuler(rotation);
    matrix.compose(position, quaternion, scale);
    return matrix
  };
}();

function getTerrain() {
  const terrain = new Terrain()
  const power = 7
  const size = 2 ** power
  terrain.init(size + 1)
  terrain.setHeight(0, 0, -10)
  terrain.setHeight(0, size, -10)
  terrain.setHeight(size, size, -10)
  terrain.setHeight(size, 0, -10)
  terrain.run(size + 1)
  return terrain
}


document.addEventListener('DOMContentLoaded', () => {

  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  document.querySelector('.info').addEventListener('click', () => {
    window.location.reload()
  })

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  let width = window.innerWidth
  if (width >= 900) {
    width = 800
  } else {
    width *= 0.9
  }
  renderer.setSize(width, width);
  document.body.appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.x = 64
  camera.position.z = 64
  camera.position.y = 12
  camera.lookAt(new THREE.Vector3(16, 0, 16))
  const sunset = new THREE.Color(0xFF7433);
  const scene = new THREE.Scene();
  scene.background = sunset


  function setupTerrain() {
    const terrain = getTerrain()
    const allHeights = terrain.grid.flat()

    const meshCache = {}
    terrain.grid.forEach((col) => col.forEach((z) => {
      const gradientIndex = getGradientIndex(z, terrainPallette, allHeights)
      const currentTotal = meshCache[gradientIndex]?.total
      meshCache[gradientIndex] = currentTotal ? { total: currentTotal + 1 } : { total: 1 }
    }))


    const materialCache = {}
    const boxGeometryCache = {}
    // y in 2D terrain becomes z in 3D
    terrain.grid.forEach((row, z) => row.forEach((rawHeight, x) => {
      const gradientIndex = getGradientIndex(rawHeight, terrainPallette, allHeights)
      const finalHeight = getHeight(gradientIndex, terrainPallette)
      let boxGeometry
      if (boxGeometryCache[gradientIndex]) {
        boxGeometry = boxGeometryCache[gradientIndex]
      } else {
        boxGeometry = new THREE.BoxGeometry(1, finalHeight, 1)
        boxGeometryCache[gradientIndex] = boxGeometry
      }
      const rgb = terrainPallette[gradientIndex]
      let material
      if (materialCache[rgb]) {
        material = materialCache[rgb]
      } else {
        material = new THREE.MeshBasicMaterial({
          color: rgb
        });
        materialCache[rgb] = material
      }

      let mesh
      if (meshCache[gradientIndex].mesh) {
        mesh = meshCache[gradientIndex].mesh
        meshCache[gradientIndex].count++
      } else {
        mesh = new THREE.InstancedMesh(boxGeometry, material, meshCache[gradientIndex].total);
        meshCache[gradientIndex].count = 1
        meshCache[gradientIndex].mesh = mesh
      }

      const matrix = makeMatrix(x, 0, z)
      mesh.setMatrixAt(meshCache[gradientIndex].count, matrix)
      scene.add(mesh)
    }))
    document.querySelector('h1').innerText = ''
    renderer.render(scene, camera);
  }
  setupTerrain();

  let frameCount = 0
  let green = 150

  const panCamera = function () {
    stats.begin()
    if (camera.position.y < 20) {
      frameCount++
      camera.translateZ(0.05)
      camera.translateX(-0.02)
      green = 150 - (frameCount / 781) * 75
      const sunset = new THREE.Color(`rgb(255, ${Math.floor(green)}, 51)`);
      scene.fog = new THREE.Fog(sunset, 0, 100);
      scene.background = sunset
      requestAnimationFrame(panCamera);
    } else {
      document.querySelector('h1').innerText = 'Click here to regenerate'
    }
    renderer.render(scene, camera);
    stats.end()
  };
  panCamera()
})


