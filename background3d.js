import * as THREE from 'three';

/**
 * Initialize a simple 3D background with particles
 * @returns {Object} - The three.js scene, camera, and renderer
 */
export function initBackground3D() {
  // Check if WebGL is available
  if (!document.querySelector('#background-canvas')) {
    console.log('No canvas element found for 3D background');
    return null;
  }

  // If browser doesn't support WebGL, don't initialize
  if (!THREE.WebGLRenderer.isWebGLAvailable()) {
    console.log('WebGL is not supported in this browser');
    return null;
  }

  try {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#background-canvas'),
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;

    const posArray = new Float32Array(particlesCount * 3);
    
    // Fill position array with random coordinates
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x64ffda
    });
    
    // Create the particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Position camera
    camera.position.z = 5;

    // Animation loop
    const animate = function() {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      
      renderer.render(scene, camera);
    };

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Start the animation loop
    animate();

    // Return the three.js objects for potential later use
    return {
      scene,
      camera,
      renderer,
      particlesMesh
    };
  } catch (error) {
    console.error('Error initializing 3D background:', error);
    return null;
  }
} 