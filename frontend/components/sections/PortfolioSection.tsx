'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { projectsApi } from '@/lib/api';

const categories = ['All', 'Shopify', 'Full Stack', 'Frontend', 'Backend'];

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail?: { url: string };
  technologies: string[];
  liveUrl?: string;
  category: string;
  featured: boolean;
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    projectsApi.getAll()
      .then((res) => {
        setProjects(res.data);
        setFiltered(res.data);
      })
      .catch(() => {
        // Demo projects if API not connected
        const demo: Project[] = [
          { _id: '1', title: 'Fashion Store Shopify', shortDescription: 'Premium fashion brand with custom product pages', description: '', thumbnail: undefined, technologies: ['Shopify', 'Liquid', 'GSAP'], liveUrl: '#', category: 'shopify', featured: true },
          { _id: '2', title: 'SaaS Dashboard', shortDescription: 'Full stack analytics dashboard with real-time data', description: '', thumbnail: undefined, technologies: ['Next.js', 'Node.js', 'MongoDB'], liveUrl: '#', category: 'fullstack', featured: false },
          { _id: '3', title: 'E-commerce API', shortDescription: 'RESTful backend for multi-vendor marketplace', description: '', thumbnail: undefined, technologies: ['Express', 'MongoDB', 'JWT'], liveUrl: '#', category: 'backend', featured: false },
          { _id: '4', title: 'Custom Shopify App', shortDescription: 'Shopify embedded app with billing integration', description: '', thumbnail: undefined, technologies: ['Shopify API', 'React', 'Node.js'], liveUrl: '#', category: 'shopify', featured: true },
          { _id: '5', title: 'Portfolio CMS', shortDescription: 'Full-featured content management system', description: '', thumbnail: undefined, technologies: ['Next.js', 'MongoDB', 'Cloudinary'], liveUrl: '#', category: 'fullstack', featured: false },
          { _id: '6', title: 'Landing Page Builder', shortDescription: 'Drag-and-drop landing page builder tool', description: '', thumbnail: undefined, technologies: ['React', 'Tailwind', 'DnD Kit'], liveUrl: '#', category: 'frontend', featured: false },
        ];
        setProjects(demo);
        setFiltered(demo);
      })
      .finally(() => setLoading(false));
  }, []);

  const filterProjects = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') return setFiltered(projects);
    const map: Record<string, string> = { 'Shopify': 'shopify', 'Full Stack': 'fullstack', 'Frontend': 'frontend', 'Backend': 'backend' };
    setFiltered(projects.filter(p => p.category === map[cat]));
  };

  const placeholderGradients = [
    'from-[#0D1F0D] to-[#0A0A0A]',
    'from-[#0D0D1F] to-[#0A0A0A]',
    'from-[#1F0D0D] to-[#0A0A0A]',
    'from-[#1F1D0D] to-[#0A0A0A]',
    'from-[#0D1F1A] to-[#0A0A0A]',
    'from-[#1A0D1F] to-[#0A0A0A]',
  ];

  return (
    <section id="portfolio" className="py-24 bg-[#050505]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-[#1a1a1a]" />
            <span className="font-mono text-xs text-primary tracking-widest uppercase">04 / Portfolio</span>
            <div className="h-px flex-1 bg-[#1a1a1a]" />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="font-display text-5xl lg:text-7xl text-white">
              SELECTED <span className="text-primary">WORK</span>
            </h2>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => filterProjects(cat)}
                  className={`px-4 py-2 font-mono text-xs tracking-wider uppercase transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-black'
                      : 'border border-[#222] text-gray-500 hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-64 bg-[#111]" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group relative bg-[#0A0A0A] overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className={`relative h-52 bg-gradient-to-br ${placeholderGradients[i % 6]} overflow-hidden`}>
                    {project.thumbnail?.url ? (
                      <Image
                        src={project.thumbnail.url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="font-display text-4xl text-white/10">
                          {project.title.slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary text-xs"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          Live
                        </a>
                      )}
                    </div>

                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-3 left-3 bg-primary text-black px-2 py-1 font-mono text-[10px] tracking-wider">
                        FEATURED
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl text-white mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {project.shortDescription || project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tech) => (
                        <span key={tech} className="font-mono text-[10px] text-gray-600 border border-[#1a1a1a] px-2 py-1">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-600">
            <p className="font-mono text-sm">No projects in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
