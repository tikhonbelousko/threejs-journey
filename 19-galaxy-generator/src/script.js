import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 320 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 3,
  branches: 5,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 3,
  densityPower: 5,
  insideColor: '#ffaa43',
  outsideColor: '#122664',
}

let material = null
let geometry = null
let points = null

const generateGalaxy = () => {
  if (points !== null) {
    material.dispose()
    geometry.dispose()
    scene.remove(points)
  }

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  const insideColor = new THREE.Color(parameters.insideColor)
  const outsideColor = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; ++i) {
    const radius = Math.random() * parameters.radius
    // const radius = Math.pow(Math.random(), parameters.densityPower) * parameters.radius
    const branchAngle = ((Math.PI * 2) / parameters.branches) * (i % parameters.branches)
    const spinAngle = radius * parameters.spin

    // Positions
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness *
      // (radius / parameters.radius) *
      (Math.random() < 0.5 ? -1 : 1)
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness *
      // (radius / parameters.radius) *
      (Math.random() < 0.5 ? -1 : 1)
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness *
      // (radius / parameters.radius) *
      (Math.random() < 0.5 ? -1 : 1)

    positions[i * 3] = Math.sin(branchAngle + spinAngle) * radius + randomX
    positions[i * 3 + 1] = randomY
    positions[i * 3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ

    // Colors
    const color = insideColor.clone().lerp(outsideColor, radius / parameters.radius)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  points = new THREE.Points(geometry, material)
  scene.add(points)
}

generateGalaxy()

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(1).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'densityPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
