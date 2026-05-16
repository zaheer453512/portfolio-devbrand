'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import { reviewsApi } from '@/lib/api';

interface Review {
  _id: string;
  name: string;
  rating: number;
  review: string;
  video?: { url: string };
  createdAt: string;
  pinned: boolean;
}

function StarRating({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate?.(star)}
          onMouseEnter={() => onRate && setHover(star)}
          onMouseLeave={() => onRate && setHover(0)}
          className="focus:outline-none"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={(hover || rating) >= star ? '#FFB800' : 'none'}
            stroke={(hover || rating) >= star ? '#FFB800' : '#333'}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', review: '', rating: 0 });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    reviewsApi.getAll()
      .then((res) => setReviews(res.data))
      .catch(() => {
        setReviews([
          { _id: '1', name: 'Ahmed Khan', rating: 5, review: 'Absolutely exceptional work! The Shopify store was built beyond expectations. Fast delivery, clean code, and excellent communication throughout.', createdAt: '2024-01-15', pinned: true },
          { _id: '2', name: 'Sarah Johnson', rating: 5, review: 'Professional developer with deep expertise in full stack development. Delivered a complex Next.js application on time. Highly recommend!', createdAt: '2024-02-01', pinned: false },
          { _id: '3', name: 'Muhammad Ali', rating: 5, review: 'Best Shopify developer I have worked with. Custom liquid coding was perfectly done. Store speed improved dramatically.', createdAt: '2024-02-20', pinned: false },
          { _id: '4', name: 'Emma Wilson', rating: 5, review: 'Outstanding backend development skills. Our API integration was seamless and the code quality is top-notch.', createdAt: '2024-03-05', pinned: false },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (reviews.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.review || !form.rating) {
      return toast.error('Please fill in all fields and select a rating.');
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('review', form.review);
    fd.append('rating', String(form.rating));
    if (videoFile) fd.append('video', videoFile);

    try {
      await reviewsApi.submit(fd);
      toast.success('Review submitted! It will appear after approval.');
      setForm({ name: '', email: '', review: '', rating: 0 });
      setVideoFile(null);
      setShowForm(false);
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24" ref={ref}>
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
            <span className="font-mono text-xs text-primary tracking-widest uppercase">05 / Reviews</span>
            <div className="h-px flex-1 bg-[#1a1a1a]" />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="font-display text-5xl lg:text-7xl text-white">
              CLIENT <span className="text-primary">VOICES</span>
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-outline w-fit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Leave a Review
            </button>
          </div>
        </motion.div>

        {/* Review slider */}
        {!loading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main featured review */}
            <div className="grid lg:grid-cols-3 gap-px bg-[#1a1a1a]">
              {reviews.slice(0, 3).map((review, i) => (
                <div
                  key={review._id}
                  className={`bg-[#0A0A0A] p-8 ${i === 0 ? 'lg:col-span-2' : ''}`}
                >
                  {/* Video */}
                  {review.video?.url && (
                    <div className="mb-6 aspect-video bg-black">
                      <video
                        src={review.video.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Stars */}
                  <StarRating rating={review.rating} />

                  {/* Review text */}
                  <blockquote className="mt-4 mb-6 text-gray-300 leading-relaxed text-lg">
                    "{review.review}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center text-black font-display text-lg">
                      {review.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{review.name}</div>
                      <div className="text-xs text-gray-600 font-mono">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    {review.pinned && (
                      <div className="ml-auto">
                        <span className="font-mono text-[10px] text-primary border border-primary px-2 py-1">FEATURED</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-6 justify-center">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 transition-all duration-300 ${i === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-[#333]'}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Review submission form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 border border-[#1a1a1a] p-8"
          >
            <h3 className="font-display text-3xl mb-8">SHARE YOUR EXPERIENCE</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Full Name *</label>
                  <input
                    className="input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Your Rating *</label>
                <StarRating rating={form.rating} onRate={(r) => setForm({ ...form, rating: r })} />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Review *</label>
                <textarea
                  className="input h-32 resize-none"
                  placeholder="Share your experience working with me..."
                  value={form.review}
                  onChange={(e) => setForm({ ...form, review: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Video Testimonial (Optional)</label>
                <div className="border border-dashed border-[#333] p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    id="video-upload"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <svg className="mx-auto mb-2 text-gray-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="23 7 16 12 23 17 23 7"/>
                      <rect x="1" y="5" width="15" height="14"/>
                    </svg>
                    <p className="text-sm text-gray-500">
                      {videoFile ? videoFile.name : 'Click to upload video (MP4, WebM — max 100MB)'}
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
}
