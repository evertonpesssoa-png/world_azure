// import './style.css'

import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/exemples/jsm/controls/OrbitControls.js";

// import  { Geometry, TetrahedronGeometry } from 'three'

 /**
  * Base
  */
  // Debug
  
  
  // Canvas
  const canvas = document.querySelector('canvas.webgl')
  
  // Scene 
  const scene = new THREE.Scene()
  
  //Galaxy
  const paremeters = {}
  paremeters .count = 100000;
  paremeters.size = 0.01;
  paremeters.radius = 2.15;
  paremeters.branches = 3;
  paremeters.spin = 3;
  paremeters.randomness = 5;
  paremeters.randomnessPower = 4;
  paremeters.insideColor = '#ff6030';
  paremeters.outsideColor = '#0949f0'
  
  let material = null;
  let geometry = null;
  let points = null;
  
  const generateGalaxy = () => {
  
  if(points != null){
  	geometry.dispose();
  	material.dispose();
  	scene.remove(points);
  	
  }
  
  material = new THREE.PointsMaterial({
  	size: parameters.size,
  	size.Attenuation: true,
  	depthWrite: false,
  	blending: THREE.AdditiveBlending,
  	vertexColors: true
  	
  })
  
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  
  const colors = new Float32Array(parameters.count * 3);
  const colorInside = new THREE.Color (parameters.insideColor);
  const colorOutside = new THREE.Color (parameters.outsideColor);
  
  for(let i=0; i<parameters.count; i++){
  	const i3 = i*3;
  	const radius = Math.pow(Math.random()*parameters.randomness, Math.random()*parameters.radius);
  	const spinAngle = radius*parameters.spin;
  	const branchAngle = ((i%parameters.branches)/parameters.branches)*Math.PI*2;
  	
  	
  	
  	const negPos = [1, -1];
  	const randomX = Math.pow(Math.randow(), parameters.randomnessPower)*negPos[Math.floor(Math.random () * negPos.
  	const randomY = Math.pow(Math.randow(), parameters.randomnessPower)*negPos[Math.floor(Math.random () * negPos.
  	const randomZ = Math.pow(Math.randow(), parameters.randomnessPower)*negPos[Math.floor(Math.random () * negPos.
  	
  	position[i3] = Math.cos(branchAngle + spinAngle)*(radius) + randomX;
  	position[i3+1] = randomY;
  	position[i3+2] = Math.sin(branchAngle + spinAngle)*(radius) + randomZ;
  	
  	const mixeColor = colorInside.clone();
  	mixecolor.lerp(colorOutside, Math.random()*radius/parameters.radius);
  	
  	
  	colors[i3] = mixeColor.r;
  	colors[i3+1] = mixeColor.g;
  	colors[i3+2] = mixeColor.b;
  	
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(positions, 3));
  
  points = new THREE.Points(geometry, material);
  scene.add(points);
  
  }
  
  generateGalaxy();
  
  /**
  
   * Test cube
   
  /**
  
  * sizes
  
  */
  
  const sizes = {
  		width.window.innerWidth,
  		heigth.window.innerHeigth,
  }
  
  window.addEventListener('resize', () => {
  
 		// Updates sizes
 		sizes.width = window.innerWidth
 		sizes.heigth = window.inneraHeigth
 		
 		// Update camera
 		camera.aspect = sizes.width / sizes.heigth
 		camera.updateProjectionMatrix()
 		
 		// Update render
 		
 /**
 * camera
 */
 
 // Base camera
 const camera = new
 THREE.PerspectiveCamera(75, sizes.width / sizes.heigth, 0.1, 100)
 camera.position.x = 3
 camera.position.y = 3
 camera.position.z = 3
 scene.add(camera)
  
// Controls 
 
 const camera = new OrbitControls(camera, canvas)
 controls.enableDamping = true
 
 /** 
 * renderer
 */
 const renderer = new THREE.webGLRender({
 		canvas: canvas
 })
 
 renderer.setSize(sizes.width, sizes.heigth)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 
 /**
  * Animate
  */
  
  const clock = new THREE.Clock()
  
  const tick = () =>
  {
  		const elapsedTime = clock.getElapsedTime()
  		
  		// Update controls
  		controls.update()
  		
  		camera.position.x = Math.cos(elapsedTime*0.05);
  		camera.position.z = Math.cos(elapsedTime*0.05);
  		camera.lookAt(0, 0, 0);
  		
  		// Render
  		renderer.render(scene, camera)
  		
  		// call tick again on the next frame
  		window.requestAnimationFrame(tick)
  		
  }
  
  tick()
  		
  	
  
  
 
 		
 		
 	
  


  
  
  	
  
  
  
  
  
  