'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    number: '01',
    title: 'Shopify Development',
    description: 'Custom Shopify stores built from scratch or theme customizations with Liquid, advanced sections, and app integrations.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="0"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Full Stack Development',
    description: 'End-to-end web applications using Next.js, Node.js, Express, and MongoDB with scalable clean architecture.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Custom API Development',
    description: 'RESTful API design and development, third-party integrations, webhooks, and custom backend solutions.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Shopify Custom Coding',
    description: 'Advanced Liquid templating, custom sections, blocks, metafields, and Shopify CLI theme development.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="10" y1="13" x2="14" y2="13"/>
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Speed Optimization',
    description: 'Core Web Vitals improvements, image optimization, code splitting, lazy loading, and CDN configuration.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Bug Fixing & Maintenance',
    description: 'Rapid debugging, code refactoring, security patches, and ongoing maintenance for existing projects.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    number: '07',
    title: 'Backend Integration',
    description: 'Seamless integration of payment gateways, shipping APIs, CRM systems, and third-party services.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="8"/>
        <rect x="2" y="14" width="20" height="8"/>
        <line x1="6" y1="6" x2="6" y2="6"/>
        <line x1="6" y1="18" x2="6" y2="18"/>
      </svg>
    ),
  },
  {
    number: '08',
    title: 'Custom Software Solutions',
    description: 'Bespoke software development tailored to unique business requirements with clean, scalable architecture.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section id="services" className="py-24" ref={ref}>
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
            <span className="font-mono text-xs text-primary tracking-widest uppercase">03 / Services</span>
            <div className="h-px flex-1 bg-[#1a1a1a]" />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-display text-5xl lg:text-7xl text-white">
              WHAT I <span className="text-primary">BUILD</span>
            </h2>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
              From idea to launch — I deliver premium development services that make real business impact.
            </p>
          </div>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a]">
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-[#0A0A0A] p-8 group hover:bg-[#0D0D0D] transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-gray-700 group-hover:text-primary transition-colors">
                  {service.icon}
                </div>
                <span className="font-mono text-xs text-[#2a2a2a] group-hover:text-primary transition-colors">
                  {service.number}
                </span>
              </div>

              <h3 className="font-display text-xl mb-3 text-white group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {service.description}
              </p>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-mono tracking-wider">LEARN MORE</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
