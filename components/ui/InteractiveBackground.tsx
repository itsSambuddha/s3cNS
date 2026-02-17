"use client";

import React, { useEffect, useRef } from "react";

const InteractiveBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = 0;
        let height = 0;
        let mouse = { x: 0, y: 0 };
        // Simple pseudo-random noise state
        const noiseScale = 0.005;
        let time = 0;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: { x: number; y: number }[];
            maxHistory: number;
            color: string;
            speed: number;
            angle: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = 0;
                this.vy = 0;
                this.history = [];
                this.maxHistory = Math.random() * 20 + 10;

                // Brand colors: Blue, Cyan, Slate
                const colors = ["#2563eb", "#0ea5e9", "#64748b", "#3b82f6"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speed = Math.random() * 2 + 1;
                this.angle = 0;
            }

            update(w: number, h: number, mouseX: number, mouseY: number) {
                // Flow field calculation (pseudo-noise)
                // Use a simple sine/cosine mix based on position and time
                const angle = (Math.cos(this.x * noiseScale) + Math.sin(this.y * noiseScale) + time) * Math.PI;

                // Add flow force
                this.vx += Math.cos(angle) * 0.1;
                this.vy += Math.sin(angle) * 0.1;

                // Mouse interaction (repulsion/attraction swirling)
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    this.vx += (dx / dist) * force * 1.5;
                    this.vy += (dy / dist) * force * 1.5;
                }

                // Limit speed
                const vel = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (vel > this.speed) {
                    this.vx = (this.vx / vel) * this.speed;
                    this.vy = (this.vy / vel) * this.speed;
                }

                // Move
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges
                if (this.x < 0) { this.x = w; this.history = []; }
                if (this.x > w) { this.x = 0; this.history = []; }
                if (this.y < 0) { this.y = h; this.history = []; }
                if (this.y > h) { this.y = 0; this.history = []; }

                // History for trails
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.maxHistory) {
                    this.history.shift();
                }
            }

            draw(context: CanvasRenderingContext2D) {
                if (this.history.length < 2) return;

                context.beginPath();
                context.moveTo(this.history[0].x, this.history[0].y);
                for (let i = 1; i < this.history.length; i++) {
                    context.lineTo(this.history[i].x, this.history[i].y);
                }
                context.strokeStyle = this.color;
                // Fade opacity based on history length? No, line is fine.
                // Just use a global alpha for the stroke
                context.lineWidth = 1.5;
                context.stroke();
            }
        }

        const init = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;

            particles = [];
            const particleCount = Math.floor((width * height) / 8000); // Density
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(width, height));
            }
        };

        const animate = () => {
            time += 0.005; // Slowly shift the flow field

            // Trail effect: clear with high opacity for "short" trails or low opacity for "long" trails
            // We'll draw a semi-transparent background to fade out previous frames
            ctx.fillStyle = "rgba(248, 250, 252, 0.15)"; // Slate-50 with 15% opacity
            ctx.fillRect(0, 0, width, height);

            // ctx.clearRect(0,0,width,height); // Uncomment this for NO trails, but trails are "creative"

            particles.forEach(p => {
                p.update(width, height, mouse.x, mouse.y);
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 -z-10 bg-slate-50">
            {/* Gradient overlay to soften it */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default InteractiveBackground;
