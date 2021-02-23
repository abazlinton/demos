import Terrain from './terrain'
import { terrainPallette } from './terrainPallette'
import * as THREE from 'three'
import {randomIntFromInterval} from './terrain'

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

export function getHeight(gradientIndex, terrainPallette) {
  return ((1 - (gradientIndex / terrainPallette.length)) * 8)
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
  const position = new THREE.Vector3()
  const quaternion = new THREE.Quaternion()
  const rotation = new THREE.Euler()
  const scale = new THREE.Vector3()
  const matrix = new THREE.Matrix4()
  return function (x, y, z) {
    position.x = x
    position.y = y
    position.z = z
    scale.x = scale.y = scale.z = 1
    quaternion.setFromEuler(rotation)
    matrix.compose(position, quaternion, scale)
    return matrix
  }
}()

export function getTerrainMeshes() {
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
      })
      materialCache[rgb] = material
    }

    let mesh
    if (meshCache[gradientIndex].mesh) {
      mesh = meshCache[gradientIndex].mesh
      meshCache[gradientIndex].count++
    } else {
      mesh = new THREE.InstancedMesh(boxGeometry, material, meshCache[gradientIndex].total)
      meshCache[gradientIndex].count = 1
      meshCache[gradientIndex].mesh = mesh
    }
    const noise = randomIntFromInterval(0.1, 0.3)
    const matrix = makeMatrix(x, finalHeight - noise, z)
    mesh.setMatrixAt(meshCache[gradientIndex].count, matrix)
  }))
  return meshCache
}