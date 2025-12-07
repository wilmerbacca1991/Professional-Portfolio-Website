// Background Animation
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('background-animation');
        document.body.prepend(this.canvas);
        
        // Add glow overlay
        const overlay = document.createElement('div');
        overlay.classList.add('glow-overlay');
        document.body.prepend(overlay);
        
        this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
        this.particles = [];
        
        // Detect mobile/tablet devices and adjust particle count for performance
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                        || window.innerWidth <= 768;
        this.particleCount = isMobile ? 100 : 350; // Reduced count for mobile devices
        
        this.colors = [
            '#7c5cff', // Purple
            '#00e6a8', // Turquoise
            '#ff61d8', // Pink
            '#4d9fff', // Blue
            '#ffcb47', // Yellow
            '#ff7c5c', // Coral
            '#5cff7c', // Lime
            '#c47cff'  // Lavender
        ];
        
        // Interactive properties
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseMoving = false;
        this.mouseTimeout = null;
        
        this.init();
        window.addEventListener('resize', () => this.resize());
        
        // Recalculate canvas size when content loads or changes
        window.addEventListener('load', () => this.resize());
        // Watch for dynamic content changes
        const resizeObserver = new ResizeObserver(() => this.resize());
        resizeObserver.observe(document.body);
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = document.documentElement.scrollHeight; // Use full document height, not just viewport
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.canvas.width = this.width * pixelRatio;
        this.canvas.height = this.height * pixelRatio;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        // Reset any existing transform then scale to device pixel ratio
        this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 6 + 3.5, // Increased size range for thicker particles
                speedX: (Math.random() - 0.5) * 4.5,
                speedY: (Math.random() - 0.5) * 4.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 5,
                glowSize: Math.random() * 45 + 25, // Enhanced glow for more shine
                pulsePhase: Math.random() * Math.PI * 2,
                z: Math.random() * 100 // Add depth for 3D effect
            });
        }
    }

    drawStar(x, y, size, rotation, color, glowSize, depth = 1) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation * Math.PI / 180);
        
        // Apply 3D depth scaling
        const scale = 0.5 + (depth / 100) * 0.5; // Scale based on depth (0.5 to 1.0)
        const adjustedSize = size * scale;
        const adjustedGlow = glowSize * scale;
        
        // Draw glow with shadowBlur for better performance
        this.ctx.shadowBlur = adjustedGlow * 2.2; // Further increased glow blur for stronger shine
        this.ctx.shadowColor = color;
        this.ctx.globalAlpha = 0.8 + (depth / 100) * 0.2; // Even brighter particles
        
        // Draw star/cube shape
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        
        // Create cubic points (use local names to avoid shadowing parameters)
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + (Math.PI / 4);
            const px = Math.cos(angle) * adjustedSize;
            const py = Math.sin(angle) * adjustedSize;
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Sort particles by depth for proper 3D layering
        this.particles.sort((a, b) => a.z - b.z);
        
        this.particles.forEach(particle => {
            // Update position with speed based on depth (parallax effect)
            const depthFactor = 0.5 + (particle.z / 100) * 0.5;
            particle.x += particle.speedX * depthFactor;
            particle.y += particle.speedY * depthFactor;
            particle.rotation += particle.rotationSpeed;
            
            // Animate depth for 3D movement
            particle.z += Math.sin(particle.pulsePhase) * 0.5;
            if (particle.z < 0) particle.z = 0;
            if (particle.z > 100) particle.z = 100;
            
            // Pulse effect
            particle.pulsePhase += 0.03; // Slightly faster pulse
            const pulseFactor = 1 + Math.sin(particle.pulsePhase) * 0.3; // More dramatic pulse
            
            // Wrap around screen
            if (particle.x < -50) particle.x = this.width + 50;
            if (particle.x > this.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = this.height + 50;
            if (particle.y > this.height + 50) particle.y = -50;
            
            // Draw particle with depth
            this.drawStar(
                particle.x,
                particle.y,
                particle.size * pulseFactor,
                particle.rotation,
                particle.color,
                particle.glowSize * pulseFactor,
                particle.z
            );
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.background-animation')) {
        new ParticleBackground();
    }
});