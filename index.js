
import * as THREE from 'three';
import Terrain from './terrain'
import Stats from 'stats.js'

document.addEventListener('DOMContentLoaded', () => {

  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  document.querySelector('.info').addEventListener('click', () => {
    window.location.reload()
  })
  const terrainPallette = [
    '#FFFFFF',
    '#9C6608',
    '#885916',
    '#734C23',
    '#5F3E31',
    '#4A313E',
    '#485E2D',
    '#506C2D',
    '#4E7321',
    '#517A33',
    '#141E8B',
    '#0F1986',
  ]
  const sunset = new THREE.Color(0xFF7433);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  let width = window.innerWidth
  if (width >= 900) {
    width = 800
  } else {
    width *= 0.9
  }
  renderer.setSize(width, width);
  document.body.appendChild(renderer.domElement);

  camera.position.x = 64
  camera.position.z = 64
  camera.position.y = 12
  const materials = {}
  const boxGeometries = {}

  camera.lookAt(new THREE.Vector3(16, 0, 16))
  function setup() {

    const makeMatrix = function () {

      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const rotation = new THREE.Euler();
      const scale = new THREE.Vector3();
      return function (matrix, x, y, z) {
        position.x = x
        position.y = y
        position.z = z
        scale.x = scale.y = scale.z = 1
        quaternion.setFromEuler(rotation);
        matrix.compose(position, quaternion, scale);
      };

    }();

    const terrain = new Terrain()
    const power = 7
    const size = 2 ** power
    terrain.init(size + 1)
    terrain.set(0, 0, -10)
    terrain.set(0, size, -10)
    terrain.set(size, size, -10)
    terrain.set(size, 0, -10)
    terrain.run(size + 1)
    const allHeights = terrain.grid.flat()
    const max = allHeights.reduce((highest, current) => current > highest ? current : highest)
    const min = allHeights.reduce((lowest, current) => current < lowest ? current : lowest)
    const matrix = new THREE.Matrix4();

    function getHeight(gradientIndex) {
      return ((1 - (gradientIndex / terrainPallette.length)) * 8)
    }

    function getGradientIndex(cell) {
      let gradientIndex = Math.floor(terrainPallette.length - cell / max * terrainPallette.length)
      if (gradientIndex < 0) gradientIndex = 0
      if (gradientIndex >= terrainPallette.length) gradientIndex = terrainPallette.length - 1
      return gradientIndex
    }

    const heightTally = {}
    terrain.grid.forEach((col) => col.forEach((cell) => {
      const gradientIndex = getGradientIndex(cell)
      const currentTotal = heightTally[gradientIndex]?.total
      heightTally[gradientIndex] = currentTotal ? { total: currentTotal + 1 } : { total: 1 }
    }))

    terrain.grid.forEach((col, y) => col.forEach((cell, x) => {
      const gradientIndex = getGradientIndex(cell)
      const height = getHeight(gradientIndex)

      let boxGeometry
      if (boxGeometries[gradientIndex]) {
        boxGeometry = boxGeometries[gradientIndex]
      } else {
        boxGeometry = new THREE.BoxGeometry(1, height, 1)
        boxGeometries[gradientIndex] = boxGeometry
      }

      // console.log(boxGeometry)

      const rgb = terrainPallette[gradientIndex]

      let material
      if (materials[rgb]) {
        material = materials[rgb]
      } else {
        material = new THREE.MeshBasicMaterial({
          color: rgb
        });
        materials[rgb] = material
      }
      // const column = new THREE.Mesh(boxGeometry, material)

      let mesh
      if (heightTally[gradientIndex].mesh) {
        mesh = heightTally[gradientIndex].mesh
        heightTally[gradientIndex].count++
      } else {
        mesh = new THREE.InstancedMesh(boxGeometry, material, heightTally[gradientIndex].total);
        heightTally[gradientIndex].count = 1
        heightTally[gradientIndex].mesh = mesh
      }
      // debugger

      // const numberOfColumns = allHeights.length
      // debugger

      makeMatrix(matrix, x, height, y)
      // mesh.translateY(height)
      mesh.setMatrixAt(heightTally[gradientIndex].count, matrix)
      scene.add(mesh)


    }))
    scene.background = sunset


    document.querySelector('h1').innerText = ''
    renderer.render(scene, camera);
  }
  setup();

  let frameCount = 0
  let g = 150

  const animate = function () {
    stats.begin()
    if (camera.position.y < 20) {
      frameCount++
      camera.translateZ(0.05)
      camera.translateX(-0.02)

      g = 150 - (frameCount / 781) * 75
      const sunset = new THREE.Color(`rgb(255, ${Math.floor(g)}, 51)`);
      scene.fog = new THREE.Fog(sunset, 0, 100);
      scene.background = sunset
      // console.log(renderer.info.render.calls)
      requestAnimationFrame(animate);

    } else {
      document.querySelector('h1').innerText = 'Click here to regenerate'
    }
    renderer.render(scene, camera);
    stats.end()
  };
  animate()

})


