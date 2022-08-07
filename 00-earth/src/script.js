import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import * as lil from 'lil-gui'

/**
 * Costants
 */
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Base
 */
const canvas = document.querySelector('canvas.canvas')
const scene = new THREE.Scene()

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000)
camera.position.set(0, 15, 50)

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setSize(size.width, size.height)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputEncoding = THREE.sRGBEncoding
renderer.physicallyCorrectLights = true
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Lights
 */
const sunlight = new THREE.DirectionalLight(0xffffff, 3.5)
sunlight.position.set(10, 20, 10)
sunlight.castShadow = true
scene.add(sunlight)

const pmrem = new THREE.PMREMGenerator(renderer)
const envMapTexture = new RGBELoader().setDataType(THREE.FloatType).load('/old_room_2k.hdr', () => {
  const envMap = pmrem.fromEquirectangular(envMapTexture).texture

  /**
   * Objects
   */
  const textureLoader = new THREE.TextureLoader()
  const textures = {
    bump: textureLoader.load('/earthbump.jpg'),
    map: textureLoader.load('/earthmap.jpg'),
    spec: textureLoader.load('/earthspec.jpg'),
  }

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10, 70, 70),
    new THREE.MeshPhysicalMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      bumpMap: textures.bump,
      bumpScale: 0.05,
      envMap,
      envMapIntensity: 0.4,
      clearcoat: 0.5,
      sheen: 1,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color(0xff8a00).convertSRGBToLinear(),
    }),
  )
  sphere.receiveShadow = true
  scene.add(sphere)

  renderer.setAnimationLoop(() => {
    controls.update()
    renderer.render(scene, camera)
  })
})
