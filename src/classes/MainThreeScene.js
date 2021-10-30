import * as THREE from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { CustomPass } from './CustomPass'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/RAF'
import MyGUI from '../utils/MyGUI'

import Helix from '../classes/Helix'
import Particles from '../classes/Particles'

class MainThreeScene {
	constructor() {
		this.bind()
		this.camera
		this.scene
		this.renderer
		this.controls
	}

	init(container) {
		this.targetElement = container;

		if(!this.targetElement) {
			console.warn('Missing \'targetElement\' property')
			return
		}
		
		this.setConfig()
		this.setDebug()
		this.setScene()
		this.setCamera()
		this.setRenderer()
		this.setPostProcess()
		this.setControls()
		this.setHelix()
		this.setParticles()

		window.addEventListener("resize", this.resizeCanvas)
		RAF.subscribe('threeSceneUpdate', this.update)
	}

	setConfig() {
			this.config = {}

			// debug
			this.config.debug = window.location.hash === '#debug'

			// pixel ratio
			this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

			// dimensions
			const boundings = this.targetElement.getBoundingClientRect()
			this.config.width = boundings.width
			this.config.height = boundings.height || window.innerHeight

			// post processing
			this.config.usePostProcessing = true;
	}

	setDebug() {
		MyGUI.hide()
		if (this.config.debug)
			MyGUI.show()
	}

	setScene() {
		this.scene = new THREE.Scene()
	}

	setCamera() {
		this.camera = new THREE.PerspectiveCamera(70, this.config.width / this.config.height, 0.1, 1000)
		this.camera.position.set(0, 0, 1.5)
	}

	setRenderer() {
		this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.debug.checkShaderErrors = true
		this.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1), 2))
		this.targetElement.appendChild(this.renderer.domElement)
	}

	setPostProcess() {
		this.postProcess = {}

		this.postProcess.renderPass = new RenderPass(this.scene, this.camera)

		const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
		// const RenderTargetClass = THREE.WebGLRenderTarget
		this.postProcess.renderTarget = new RenderTargetClass(
			this.config.width,
			this.config.height,
			{
				generateMipmaps: false,
				minFilter: THREE.LinearFilter,
				magFilter: THREE.LinearFilter,
				format: THREE.RGBFormat,
				encoding: THREE.sRGBEncoding
			}
		)

		this.postProcess.composer = new EffectComposer(this.renderer, this.renderTarget)
		this.postProcess.composer.setSize(this.config.width, this.config.height)
		this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

		// bloom
		this.postProcess.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(this.config.width, this.config.height), 
			1.5, 
			0.8, 
			0.0
		)
		this.postProcess.bloomPass.enabled = true

		// aberration
		this.postProcess.aberrationPass = new ShaderPass(CustomPass)

		// film pass
		this.postProcess.filmPass = new FilmPass(0.5, 0, 0, false)

		this.postProcess.composer.addPass(this.postProcess.renderPass)
		this.postProcess.composer.addPass(this.postProcess.bloomPass)
		this.postProcess.composer.addPass(this.postProcess.aberrationPass)
		this.postProcess.composer.addPass(this.postProcess.filmPass)
		
		if(this.config.debug) {
			const bloomFolder = MyGUI.addFolder('bloom pass')
			bloomFolder.open()
			bloomFolder.add(this.postProcess.bloomPass, 'strength', 0.0, 10.0, 0.001)
			bloomFolder.add(this.postProcess.bloomPass, 'radius', 0.0, 10.0, 0.001)
			bloomFolder.add(this.postProcess.bloomPass, 'threshold', -1.0, 1.0, 0.001)
		}
	}

	setControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enabled = true
		this.controls.maxDistance = 1500
		this.controls.minDistance = 0
	}

	setHelix() {
		Helix.init(this.scene)
	}

	setParticles() {
		Particles.init(this.scene)
	}

	update() {
		if(this.config.usePostProcessing) {
				this.postProcess.composer.render()
		} else {
				this.renderer.render(this.scene, this.camera);
		}

		Helix.update()
		Particles.update()
	}

	resizeCanvas() {
		const boundings = this.targetElement.getBoundingClientRect()
		this.config.width = boundings.width
		this.config.height = boundings.height
		this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

		this.renderer.setSize(this.config.width, this.config.height)
		this.postProcess.composer.setSize(this.config.width, this.config.height)
		this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
		this.camera.aspect = this.config.width / this.config.height
		this.camera.updateProjectionMatrix()
	}

	bind() {
		this.resizeCanvas = this.resizeCanvas.bind(this)
		this.update = this.update.bind(this)
		this.init = this.init.bind(this)
	}
}

const _instance = new MainThreeScene()
export default _instance