'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const techStack = ['Shopify', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind', 'Express', 'React', 'Shopify', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind', 'Express', 'React'];

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '3+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
];

export default function HeroSection() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-lines">
      {/* Cursor glow */}
      <div ref={cursorRef} className="cursor-glow hidden lg:block" />

      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 pointer-events-none">
        <div className="w-full h-full bg-primary rounded-full blur-[120px]" />
      </div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[#FF3D00] rounded-full blur-[80px]" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-24 left-6 w-16 h-16 border-t border-l border-primary/30" />
      <div className="absolute top-24 right-6 w-16 h-16 border-t border-r border-primary/30" />
      <div className="absolute bottom-20 left-6 w-16 h-16 border-b border-l border-primary/10" />
      <div className="absolute bottom-20 right-6 w-16 h-16 border-b border-r border-primary/10" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-2 h-2 bg-primary animate-pulse" />
              <span className="font-mono text-primary text-xs tracking-[0.2em] uppercase">Available for Projects</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[72px] lg:text-[96px] leading-none tracking-wide mb-6"
            >
              <span className="block text-white">SHOPIFY</span>
              <span className="block text-primary text-glow">&amp; FULL</span>
              <span className="block text-white">STACK DEV</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg"
            >
              I build premium Shopify stores, full-stack web applications, and custom software solutions 
              that help businesses scale and convert visitors into loyal customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#portfolio" className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 6l11 11L23 6"/>
                </svg>
                View My Work
              </a>
              <a href="#contact" className="btn btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Let's Talk
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#1a1a1a]"
            >
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="font-display text-3xl text-primary">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[480px] ml-auto">
              {/* Code terminal */}
              <div className="bg-[#0D0D0D] border border-[#222] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-[#FF5F57]" />
                  <div className="w-3 h-3 bg-[#FFBD2E]" />
                  <div className="w-3 h-3 bg-[#28C840]" />
                  <span className="font-mono text-xs text-gray-600 ml-4">developer.js</span>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <div><span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = {'{'}</div>
                  <div className="pl-4"><span className="text-gray-400">name:</span> <span className="text-primary">'Your Name'</span>,</div>
                  <div className="pl-4"><span className="text-gray-400">role:</span> <span className="text-primary">'Full Stack + Shopify Dev'</span>,</div>
                  <div className="pl-4"><span className="text-gray-400">skills:</span> [</div>
                  <div className="pl-8"><span className="text-green-400">'Shopify'</span>,</div>
                  <div className="pl-8"><span className="text-green-400">'Next.js'</span>,</div>
                  <div className="pl-8"><span className="text-green-400">'Node.js'</span>,</div>
                  <div className="pl-8"><span className="text-green-400">'MongoDB'</span>,</div>
                  <div className="pl-4">],</div>
                  <div className="pl-4"><span className="text-gray-400">available:</span> <span className="text-primary">true</span>,</div>
                  <div>{'}'}</div>
                  <div className="mt-4 text-gray-600">// Ready to build your next project</div>
                  <div className="flex items-center gap-1">
                    <span className="text-primary">{'>'}</span>
                    <span className="text-white animate-pulse">_</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-primary text-black px-3 py-2 font-mono text-xs font-bold">
                #1 SHOPIFY DEV
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#111] border border-[#333] px-3 py-2 font-mono text-xs text-primary">
                50+ PROJECTS ✓
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tech marquee */}
      <div className="border-t border-b border-[#1a1a1a] py-4 overflow-hidden mt-8">
        <div className="marquee-track">
          {techStack.map((tech, i) => (
            <span key={i} className="font-mono text-xs text-gray-600 tracking-widest uppercase whitespace-nowrap">
              {tech} <span className="text-primary mx-4">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
