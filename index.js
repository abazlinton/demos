
import * as THREE from 'three';
import Stats from 'stats.js'
import { getTerrainMeshes } from './terrainMeshes'

const stats = new Stats();
let frameCount = 0

document.addEventListener('DOMContentLoaded', () => {

  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  document.querySelector('.info').addEventListener('click', () => {
    window.location.reload()
  })
  const renderer = getRenderer()
  document.body.appendChild(renderer.domElement)
  const scene = getScene()
  const terrain = getTerrainMeshes()
  Object.values(terrain).forEach(dataForMesh => scene.add(dataForMesh.mesh))
  const wideSea = getWiderSea()
  scene.add(wideSea);
  // const axesHelper = new THREE.AxesHelper( 128 );
  // scene.add( axesHelper );
  const camera = getCamera()
  runFrame(renderer, scene, camera)
})

function getCamera() {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.x = 64
  camera.position.z = 64
  camera.position.y = 12
  camera.lookAt(new THREE.Vector3(16, 0, 16))
  return camera
}

function getRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  let width = window.innerWidth
  if (width >= 900) {
    width = 800
  } else {
    width *= 0.9
  }
  renderer.setSize(width, width);
  return renderer
}

function getScene() {
  const sunset = new THREE.Color(0xFF7433);
  const scene = new THREE.Scene();
  scene.background = sunset
  document.querySelector('h1').innerText = ''
  return scene
}
// TODO: stop rendering at some point!
function runFrame(renderer, scene, camera) {
  stats.begin()
  frameCount++
  panCamera(camera)
  const { sunset, fog } = getSunset(frameCount)
  scene.fog = fog
  scene.background = sunset
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(() => runFrame(renderer, scene, camera))
}

const getSunset = function () {
  let green = 150
  return function (frameCount) {
    green = 150 - (frameCount / 781) * 75
    const sunset = new THREE.Color(`rgb(255, ${Math.floor(green)}, 51)`);
    const fog = new THREE.Fog(sunset, 0, 100);
    return { sunset, fog }
  }
}()

function panCamera(camera) {
  if (camera.position.y < 20) {
    camera.translateZ(0.05)
    camera.translateX(-0.02)
  } else {
    document.querySelector('.info').innerText = 'Click here to regenerate'
  }
};

function getWiderSea() {
  const geometry = new THREE.PlaneGeometry(256, 256);
  const material = new THREE.MeshBasicMaterial({ color: 0x0F1986, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = 0.7853981634 * 2
  plane.position.y = 1.3
  plane.position.x = 128 - 64
  plane.position.z = 128 - 64
  return plane
}




