/**
 * CTA Canvas Animation - Interactive Geometric Network
 * Fignix Theme: Purple/Teal/White
 */

(function() {
    const canvas = document.getElementById('cta-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;
    const connectionDistance = 150;
    const mouse = { x: null, y: null, radius: 200 };

    // Set canvas size
    function resize() {
        const section = canvas.parentElement;
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle class
    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
        }
    }

    // Create initial particles
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connections between particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.2})`; // Accent Teal
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Connection to mouse
            if (mouse.x !== null) {
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mDistance = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mDistance < mouse.radius) {
                    const mOpacity = 1 - (mDistance / mouse.radius);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${mOpacity * 0.4})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
