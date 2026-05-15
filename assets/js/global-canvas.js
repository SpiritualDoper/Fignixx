/**
 * Global Canvas Animation - Single Branded Cursor Follower
 * Extremely simple: Just one elegant branded shape that follows the mouse.
 */

(function() {
    const canvas = document.getElementById('global-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Disable on mobile/tablet to save performance and prevent unwanted touch behavior
    if (window.innerWidth < 1024) {
        canvas.style.display = 'none';
        return;
    }

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const follower = { x: window.innerWidth / 2, y: window.innerHeight / 2, size: 25, angle: 0 };
    
    // Theme Colors
    const colors = ['#7c4dff', '#00e5ff', '#ffeb3b', '#2196f3'];
    let currentColor = colors[0];
    let currentType = 0; // 0: Circle, 1: Semi-circle, 2: Bar

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Change shape on click for a bit of interaction
    window.addEventListener('mousedown', () => {
        currentType = (currentType + 1) % 3;
        currentColor = colors[Math.floor(Math.random() * colors.length)];
    });

    function drawShape(x, y, size, angle, type, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = color;

        if (type === 0) {
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 1) {
            // Semi-circle
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI, false);
            ctx.fill();
        } else {
            // Bar
            ctx.fillRect(-size / 4, -size, size / 2, size * 2);
        }

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Smooth follow logic (easing)
        const easing = 0.08;
        follower.x += (mouse.x - follower.x) * easing;
        follower.y += (mouse.y - follower.y) * easing;
        follower.angle += 0.02; // Constant slow rotation

        drawShape(follower.x, follower.y, follower.size, follower.angle, currentType, currentColor);

        requestAnimationFrame(animate);
    }

    animate();
})();
