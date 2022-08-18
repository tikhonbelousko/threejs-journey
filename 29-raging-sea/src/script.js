import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {
  uLowColor: '#186691',
  uHighColor: '#9bd8ff',
}

gui.addColor(debugObject, 'uLowColor').onChange(c => {
  waterMaterial.uniforms.uLowColor.value.set(c)
})

gui.addColor(debugObject, 'uHighColor').onChange(c => {
  waterMaterial.uniforms.uHighColor.value.set(c)
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 128 * 4, 128 * 4)

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3.0 },
    uSmallWavesIterations: { value: 4.0 },
    uSmallWavesSpeed: { value: 0.5 },

    uLowColor: { value: new THREE.Color(debugObject.uLowColor) },
    uHighColor: { value: new THREE.Color(debugObject.uHighColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
  },
})

gui
  .add(waterMaterial.uniforms.uBigWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uBigWavesElevation')

gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
  .min(1)
  .max(20)
  .step(0.0001)
  .name('uBigWavesFrequencyX')

gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
  .min(1)
  .max(20)
  .step(0.0001)
  .name('uBigWavesFrequencyY')

gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uBigWavesSpeed')

gui
  .add(waterMaterial.uniforms.uColorOffset, 'value')
  .min(-1)
  .max(1)
  .step(0.001)
  .name('uColorOffset')

gui
  .add(waterMaterial.uniforms.uColorMultiplier, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uColorMultiplier')

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.0001)
  .name('uSmallWavesElevation')

gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
  .min(0)
  .max(100)
  .step(0.0001)
  .name('uSmallWavesFrequency')

gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, 'value')
  .min(0)
  .max(10)
  .step(1)
  .name('uSmallWavesIterations')

gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
  .min(0)
  .max(2)
  .step(0.0001)
  .name('uSmallWavesSpeed')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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

  water.material.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
