'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const skillCategories = [
  {
    title: 'Shopify',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.337 23.979l6.839-1.538S19.197 5.809 19.18 5.678c-.017-.13-.131-.211-.228-.211s-1.993-.131-1.993-.131-.602-.602-1.131-1.049v-.245C15.828 1.554 13.8.5 12.115.5 10.83.5 9.8 1.13 9.8 1.13S7.773.5 7.22.5C3.95.5 2.26 5.23 1.74 7.58c0 0-1.44.45-1.56.49-.538.163-.538.196-.603.7L.587 24l14.75-.021zM12.115 2.015c1.196 0 2.392.782 2.848 1.889v.229c-.978-.49-2.077-.669-2.848-.669-.977 0-1.759.228-2.37.522.229-.815.979-1.971 2.37-1.971zm-5.293.783c.326 0 .685.098.978.228-.163.195-.326.456-.456.749-.554.13-1.108.261-1.63.391.293-1.207.782-1.368 1.108-1.368zM4.732 8.56l1.238-3.003c.554-.13 1.108-.261 1.63-.391l-.13.261c-.456 1.075-.815 2.23-.815 3.403 0 .196 0 .391.016.554l-1.94-.824zm7.383-4.857c.782 0 1.727.195 2.588.619v.293c-.815-.065-2.174-.13-3.24.228.099-.522.326-.977.652-1.14zM9.8 5.156c.228-.065.456-.13.7-.163.261-.033.522-.065.782-.065.326 0 .618.033.88.098-.261.098-.538.195-.815.326-.391.163-.75.359-1.075.587.293-.554.815-1.14 1.499-1.336l-1.97.553zm6.077 1.858c.554.065.978.457 1.174.929l.294 9.07-4.889 1.108-.815-2.654c.423-.13.782-.293 1.075-.49.522-.326.815-.782.815-1.303 0-1.01-.75-1.565-1.695-1.565-.392 0-.75.098-1.042.261V12.7c-.065-.228-.13-.49-.228-.685.293-.228.619-.424.978-.554 1.303-.49 2.588-.358 3.86.261l.228-2.816c-1.336-.652-2.783-.815-4.152-.423-.098-.326-.163-.652-.228-.978 1.955-.587 4.12-.261 5.72.782l-.098-2.719c-.196-.098-.391-.228-.554-.293l-.261-.261h.815l.261 2.849zm-4.855 5.85c.358.49.62 1.01.782 1.566l-1.696.391-.163-2.97c.424.098.815.555 1.077 1.013zm-1.94-1.925l.228 6.174-2.914.652-1.14-7.94c.783.684 2.109 1.01 3.826 1.114zm-4.315-.522l-1.63-.75.782-1.727 1.108.977-.26 1.5zm-.587-2.979L2.88 8.234l.13-.098L4.34 5.843l1.728.587-1.89 1.01v.98z"/>
      </svg>
    ),
    skills: ['Shopify Development', 'Shopify Liquid', 'Theme Customization', 'API Integration', 'Store Optimization', 'Product Management'],
    color: '#95BF47',
  },
  {
    title: 'Frontend',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    skills: ['HTML5 / CSS3', 'JavaScript / TypeScript', 'React / Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion'],
    color: '#61DAFB',
  },
  {
    title: 'Backend',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="8"/>
        <rect x="2" y="14" width="20" height="8"/>
        <line x1="6" y1="6" x2="6" y2="6"/>
        <line x1="6" y1="18" x2="6" y2="18"/>
      </svg>
    ),
    skills: ['Node.js', 'Express.js', 'MongoDB / Mongoose', 'REST APIs', 'JWT Authentication', 'Microservices'],
    color: '#68A063',
  },
  {
    title: 'Tools & More',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    skills: ['Figma to Code', 'Cloudinary / CDN', 'Git / GitHub', 'Speed Optimization', 'SEO Best Practices', 'Custom Software'],
    color: '#00FF94',
  },
];

export default function SkillsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="skills" className="py-24 bg-[#050505]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-[#1a1a1a]" />
            <span className="font-mono text-xs text-primary tracking-widest uppercase">02 / Skills</span>
            <div className="h-px flex-1 bg-[#1a1a1a]" />
          </div>
          <h2 className="font-display text-5xl lg:text-7xl text-white">
            TECH <span className="text-primary">ARSENAL</span>
          </h2>
        </motion.div>

        {/* Skill categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a]">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0A0A0A] p-8 group hover:bg-[#0D0D0D] transition-colors"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center mb-6 transition-colors"
                style={{ color: cat.color }}
              >
                {cat.icon}
              </div>

              <h3 className="font-display text-2xl mb-6 text-white">{cat.title}</h3>

              <ul className="space-y-3">
                {cat.skills.map((skill, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-1 h-1 bg-primary flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>

              {/* Bottom accent */}
              <div
                className="h-px mt-8 transition-all duration-500 w-0 group-hover:w-full"
                style={{ background: cat.color }}
              />
            </motion.div>
          ))}
        </div>

        {/* Proficiency bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          {[
            { label: 'Shopify Development', pct: 95 },
            { label: 'Next.js / React', pct: 90 },
            { label: 'Node.js / Express', pct: 88 },
            { label: 'MongoDB', pct: 85 },
            { label: 'Tailwind CSS', pct: 92 },
            { label: 'API Integration', pct: 90 },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="font-mono text-xs text-primary">{item.pct}%</span>
              </div>
              <div className="h-1 bg-[#1a1a1a]">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${item.pct}%` } : {}}
                  transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
