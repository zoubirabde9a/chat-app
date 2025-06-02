import * as THREE from 'three';

// Three.js Constants
const SCENE_SETTINGS = {
    BACKGROUND_COLOR: 0x000000,
    CAMERA_FOV: 75,
    CAMERA_NEAR: 0.1,
    CAMERA_FAR: 1000,
    CAMERA_POSITION: [0, 0, 5],
    STAR_COUNT: 3000,
    STAR_SIZE: 0.02,
    NEBULA_COLORS: [0x1a237e, 0x0d47a1, 0x01579b] // Deep blues only
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
        this.time = 0;
        this.animationFrameId = null;
        this.isDestroyed = false;
        this.stars = [];
        this.nebulaParticles = [];

        try {
            this.initializeScene();
            this.createStars();
            this.createNebula();
            this.animate();
        } catch (error) {
            console.error('Error initializing background animation:', error);
            this.handleInitializationError();
        }
    }

    handleInitializationError() {
        this.container.style.background = 'linear-gradient(45deg, #000000, #1a1a2e)';
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

            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
            this.container.appendChild(this.renderer.domElement);

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
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        } catch (error) {
            console.error('Error handling resize:', error);
        }
    }

    createStars() {
        try {
            const starGeometry = new THREE.BufferGeometry();
            const starMaterial = new THREE.PointsMaterial({
                size: SCENE_SETTINGS.STAR_SIZE,
                color: 0xffffff,
                transparent: true,
                opacity: 0.6,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending
            });

            const starPositions = new Float32Array(SCENE_SETTINGS.STAR_COUNT * 3);
            const starSizes = new Float32Array(SCENE_SETTINGS.STAR_COUNT);

            for (let i = 0; i < SCENE_SETTINGS.STAR_COUNT; i++) {
                const i3 = i * 3;
                starPositions[i3] = (Math.random() - 0.5) * 15;
                starPositions[i3 + 1] = (Math.random() - 0.5) * 15;
                starPositions[i3 + 2] = (Math.random() - 0.5) * 15;
                starSizes[i] = Math.random() * 1.5;
            }

            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

            this.starField = new THREE.Points(starGeometry, starMaterial);
            this.scene.add(this.starField);
        } catch (error) {
            console.error('Error creating stars:', error);
            throw error;
        }
    }

    createNebula() {
        try {
            const nebulaGeometry = new THREE.BufferGeometry();
            const nebulaMaterial = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            const particleCount = 1000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 12;
                positions[i3 + 1] = (Math.random() - 0.5) * 12;
                positions[i3 + 2] = (Math.random() - 0.5) * 12;

                const color = new THREE.Color(SCENE_SETTINGS.NEBULA_COLORS[Math.floor(Math.random() * SCENE_SETTINGS.NEBULA_COLORS.length)]);
                colors[i3] = color.r * 0.7;
                colors[i3 + 1] = color.g * 0.7;
                colors[i3 + 2] = color.b * 0.7;
            }

            nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            this.nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
            this.scene.add(this.nebula);
        } catch (error) {
            console.error('Error creating nebula:', error);
            throw error;
        }
    }

    animate() {
        if (this.isDestroyed) return;

        try {
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
            
            this.time += 0.0005; // Slower animation
            
            if (this.starField) {
                this.starField.rotation.y = this.time * 0.05;
                this.starField.rotation.x = Math.sin(this.time * 0.1) * 0.05;

                // Subtle twinkle effect
                const sizes = this.starField.geometry.attributes.size.array;
                for (let i = 0; i < sizes.length; i++) {
                    sizes[i] = Math.sin(this.time + i) * 0.3 + 1.2;
                }
                this.starField.geometry.attributes.size.needsUpdate = true;
            }

            if (this.nebula) {
                this.nebula.rotation.y = this.time * 0.02;
                this.nebula.rotation.x = Math.sin(this.time * 0.05) * 0.05;

                // Subtle nebula movement
                const positions = this.nebula.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += Math.sin(this.time + i) * 0.0005;
                    positions[i + 1] += Math.cos(this.time + i) * 0.0005;
                }
                this.nebula.geometry.attributes.position.needsUpdate = true;
            }

            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.error('Error in animation loop:', error);
            this.recoverFromError();
        }
    }

    recoverFromError() {
        try {
            this.cleanup();
            this.initializeScene();
            this.createStars();
            this.createNebula();
            this.animate();
        } catch (error) {
            console.error('Failed to recover from animation error:', error);
            this.handleInitializationError();
        }
    }

    setTyping(isTyping) {
        this.isAgentTyping = isTyping;
        if (this.nebula && this.nebula.material) {
            this.nebula.material.opacity = isTyping ? 0.4 : 0.3;
        }
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

        if (this.starField) {
            this.starField.geometry.dispose();
            this.starField.material.dispose();
        }

        if (this.nebula) {
            this.nebula.geometry.dispose();
            this.nebula.material.dispose();
        }

        if (this.scene) {
            this.scene.clear();
        }

        window.removeEventListener('resize', this.handleResize);
    }
}

export default BackgroundAnimation; 