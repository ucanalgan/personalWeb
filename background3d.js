import * as THREE from 'three';

// Coding Theme 3D Background Animation
export function initBackground3D() {
  // Canvas element
  const canvas = document.getElementById('bg-canvas');
  
  if (!canvas) return;
  
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Coding theme particles setup
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1200; // Binary-like particles
  
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);
  
  // Matrix code theme colors
  const colorOptions = [
    new THREE.Color('#64ffda').convertSRGBToLinear(), // primary - like matrix code
    new THREE.Color('#4dffa0').convertSRGBToLinear(), // light green
    new THREE.Color('#00ff9d').convertSRGBToLinear()  // slightly different green
  ];
  
  for (let i = 0; i < particlesCount; i++) {
    // Create a grid-like pattern for coding theme
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * 20; 
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20 - 5; // Push back a bit
    
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    
    // Binary-like sizes (small and large - like 0s and 1s)
    sizes[i] = Math.random() < 0.8 ? 0.015 : 0.03;
    
    // Random color from our code-like color options
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Shader material for better particle effect
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false
  });
  
  // Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
  
  // Camera position
  camera.position.z = 5;
  
  // Mouse movement effect - Subtle
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  
  // Window resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  
  // Animation loop - Code-like vertical movement
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Matrix-like slow falling effect
    particles.rotation.y += 0.0003;
    particles.position.y -= 0.003; // Slow falling effect like Matrix code
    
    // Reset position when particles fall too much
    if (particles.position.y < -5) {
      particles.position.y = 5;
    }
    
    // Subtle mouse interaction
    targetX = mouseX * 0.05;
    targetY = mouseY * 0.05;
    particles.rotation.x += (targetY - particles.rotation.x) * 0.01;
    particles.rotation.y += (targetX - particles.rotation.y) * 0.01;
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  return {
    destroy: () => {
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      scene.remove(particles);
      
      window.removeEventListener('resize', null);
      document.removeEventListener('mousemove', null);
    }
  };
}