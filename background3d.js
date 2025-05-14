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
<<<<<<< Updated upstream
    antialias: true,
    powerPreference: 'high-performance'
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for better performance
  
  // Coding theme particles setup - reduce particle count for performance
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800; // Reduced from 1200 for better performance
=======
    antialias: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Coding theme particles setup
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1200; // Binary-like particles
>>>>>>> Stashed changes
  
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
<<<<<<< Updated upstream
    opacity: 0.5, // Slightly reduced opacity
=======
    opacity: 0.6,
>>>>>>> Stashed changes
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
  
<<<<<<< Updated upstream
  // Throttle mouse movement for performance
  let lastMoveTime = 0;
  document.addEventListener('mousemove', (event) => {
    const now = performance.now();
    if (now - lastMoveTime < 50) return; // Only update every 50ms
    lastMoveTime = now;
    
=======
  document.addEventListener('mousemove', (event) => {
>>>>>>> Stashed changes
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  
<<<<<<< Updated upstream
  // Window resize handler with debounce
  let resizeTimeout;
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  };
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 200);
  });
  
  // Animation loop with optimized frame rate for lower powered devices
  let lastFrameTime = 0;
  const targetFPS = 30; // Limit to 30 FPS for better performance
  const frameInterval = 1000 / targetFPS;
  
  const animate = (currentTime) => {
    requestAnimationFrame(animate);
    
    // Limit frame rate for performance
    if (currentTime - lastFrameTime < frameInterval) return;
    lastFrameTime = currentTime;
    
    // Matrix-like slow falling effect - reduced movement speed
    particles.rotation.y += 0.0002;
    particles.position.y -= 0.002; // Slower falling effect
=======
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
>>>>>>> Stashed changes
    
    // Reset position when particles fall too much
    if (particles.position.y < -5) {
      particles.position.y = 5;
    }
    
<<<<<<< Updated upstream
    // Even more subtle mouse interaction
    targetX = mouseX * 0.03;
    targetY = mouseY * 0.03;
    particles.rotation.x += (targetY - particles.rotation.x) * 0.005;
    particles.rotation.y += (targetX - particles.rotation.y) * 0.005;
=======
    // Subtle mouse interaction
    targetX = mouseX * 0.05;
    targetY = mouseY * 0.05;
    particles.rotation.x += (targetY - particles.rotation.x) * 0.01;
    particles.rotation.y += (targetX - particles.rotation.y) * 0.01;
>>>>>>> Stashed changes
    
    renderer.render(scene, camera);
  };
  
<<<<<<< Updated upstream
  animate(0);
  
  // Cleanup function
  const mouseMoveHandler = document.addEventListener('mousemove', () => {});
  const resizeHandler = window.addEventListener('resize', () => {});
=======
  animate();
>>>>>>> Stashed changes
  
  return {
    destroy: () => {
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      scene.remove(particles);
      
<<<<<<< Updated upstream
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      
      clearTimeout(resizeTimeout);
=======
      window.removeEventListener('resize', null);
      document.removeEventListener('mousemove', null);
>>>>>>> Stashed changes
    }
  };
}