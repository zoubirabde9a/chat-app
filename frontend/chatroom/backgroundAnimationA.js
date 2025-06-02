import * as THREE from 'three';

// Three.js Constants
const SCENE_SETTINGS = {
    BACKGROUND_COLOR: 0xf0f2f5,
    CAMERA_FOV: 75,
    CAMERA_NEAR: 0.1,
    CAMERA_FAR: 1000,
    CAMERA_POSITION: [0, 0, 5],
    PARTICLE_COUNT: 1000,
    PARTICLE_SIZE: 0.02,
    PARTICLE_COLOR: 0x007bff
};

class BackgroundAnimation {
    constructor(container) {
        if (!container) {
            console.warn('No container provided for BackgroundAnimation, creating fallback container');
            container = document.createElement('div');
            container.id = 'visualization-fallback';
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.zIndex = '0';
            document.body.appendChild(container);
        }

        this.container = container;
        this.isAgentTyping = false;
        this.colorPhase = 0;
        this.animationFrameId = null;
        this.isDestroyed = false;

        try {
            this.initializeScene();
            this.createParticles();
            this.animate();
        } catch (error) {
            console.error('Error initializing background animation:', error);
            this.handleInitializationError();
        }
    }

    handleInitializationError() {
        // Fallback to a simple gradient background if Three.js fails
        this.container.style.background = 'linear-gradient(45deg, #f0f2f5, #e6e9f0)';
    }

    initializeScene() {
        try {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(SCENE_SETTINGS.BACKGROUND_COLOR);

            this.camera = new THREE.PerspectiveCamera(
                SCENE_SETTINGS.CAMERA_FOV,
                this.container.clientWidth / this.container.clientHeight,
                SCENE_SETTINGS.CAMERA_NEAR,
                SCENE_SETTINGS.CAMERA_FAR
            );
            this.camera.position.set(...SCENE_SETTINGS.CAMERA_POSITION);

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.container.appendChild(this.renderer.domElement);

            // Handle window resize
            this.handleResize = this.handleResize.bind(this);
            window.addEventListener('resize', this.handleResize);
        } catch (error) {
            console.error('Error in scene initialization:', error);
            throw error;
        }
    }

    handleResize() {
        if (this.isDestroyed) return;
        
        try {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        } catch (error) {
            console.error('Error handling resize:', error);
        }
    }

    createParticles() {
        try {
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = SCENE_SETTINGS.PARTICLE_COUNT;
            const posArray = new Float32Array(particlesCount * 3);

            for (let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 5;
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            this.particlesMaterial = new THREE.PointsMaterial({
                size: SCENE_SETTINGS.PARTICLE_SIZE,
                color: SCENE_SETTINGS.PARTICLE_COLOR
            });

            this.particlesMesh = new THREE.Points(particlesGeometry, this.particlesMaterial);
            this.scene.add(this.particlesMesh);
        } catch (error) {
            console.error('Error creating particles:', error);
            throw error;
        }
    }

    animate() {
        if (this.isDestroyed) return;

        try {
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
            
            if (this.particlesMesh) {
                this.particlesMesh.rotation.x += 0.0005;
                this.particlesMesh.rotation.y += 0.0005;

                if (this.isAgentTyping) {
                    this.colorPhase += 0.03;
                    const hue = (Math.sin(this.colorPhase) * 0.5 + 0.5) * 360;
                    const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
                    this.particlesMaterial.color = color;
                } else {
                    this.particlesMaterial.color.set(SCENE_SETTINGS.PARTICLE_COLOR);
                    this.colorPhase = 0;
                }
            }

            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.error('Error in animation loop:', error);
            // Try to recover by recreating the scene
            this.recoverFromError();
        }
    }

    recoverFromError() {
        try {
            this.cleanup();
            this.initializeScene();
            this.createParticles();
            this.animate();
        } catch (error) {
            console.error('Failed to recover from animation error:', error);
            this.handleInitializationError();
        }
    }

    setTyping(isTyping) {
        this.isAgentTyping = isTyping;
    }

    cleanup() {
        this.isDestroyed = true;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        if (this.particlesMesh) {
            this.particlesMesh.geometry.dispose();
            this.particlesMaterial.dispose();
        }

        if (this.scene) {
            this.scene.clear();
        }

        window.removeEventListener('resize', this.handleResize);
    }
}

export default BackgroundAnimation; 