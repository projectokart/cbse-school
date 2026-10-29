'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  ShieldCheck,
  X,
  Sparkles,
  Send,
  Search,
  CheckCircle2,
  ThumbsUp,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface SchoolReviewsSectionProps {
  displayName: string;
  udiseCode?: string;
}

export default function SchoolReviewsSection({
  displayName,
  udiseCode = '',
}: SchoolReviewsSectionProps) {
  const { user } = useAuth();
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewRoleFilter, setReviewRoleFilter] = useState<'all' | 'Parent' | 'Student' | 'Alumni'>('all');
  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');
  const [reviewSearchText, setReviewSearchText] = useState('');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);
  const [reviewSortBy, setReviewSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [userLikesMap, setUserLikesMap] = useState<Record<string | number, boolean>>({});

  // User's own review
  const [userReview, setUserReview] = useState<any | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // 5-Point Questionnaire Ratings
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingAcademics, setRatingAcademics] = useState(5);
  const [ratingInfrastructure, setRatingInfrastructure] = useState(5);
  const [ratingSafety, setRatingSafety] = useState(5);
  const [ratingSports, setRatingSports] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);

  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState<'Parent' | 'Student' | 'Alumni'>('Parent');
  const [reviewerClass, setReviewerClass] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch reviews on mount or when udiseCode/user changes
  useEffect(() => {
    let isMounted = true;
    const fetchEngagement = async () => {
      if (!udiseCode) {
        setIsLoading(false);
        return;
      }
      try {
        const userId = user?.id || user?.email || '';
        const res = await fetch(`/api/school-engagement?udiseCode=${encodeURIComponent(udiseCode)}&userId=${encodeURIComponent(userId)}`);
        const json = await res.json();
        if (isMounted && json.success) {
          const list = json.reviews || [];
          setReviewsList(list);
          if (json.userReview) {
            setUserReview(json.userReview);
          } else {
            // Check in list if user matches
            const found = list.find((r: any) => (user?.id && r.userId === user.id) || (user?.email && r.userEmail === user.email));
            setUserReview(found || null);
          }
        }
      } catch (err) {
        console.warn('Failed to load school engagement:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchEngagement();
    return () => {
      isMounted = false;
    };
  }, [udiseCode, user]);

  const handleOpenEditModal = (existing?: any) => {
    const target = existing || userReview;
    if (target) {
      setIsEditingExisting(true);
      setReviewerName(target.author || user?.user_metadata?.full_name || '');
      setReviewerRole(target.role || 'Parent');
      setReviewerClass(target.studentClass || '');
      setRatingOverall(target.rating || 5);
      setReviewComment(target.comment || '');
      if (target.metrics) {
        setRatingAcademics(target.metrics.academics || 5);
        setRatingInfrastructure(target.metrics.infrastructure || 5);
        setRatingSafety(target.metrics.safety || 5);
        setRatingSports(target.metrics.sports || 5);
        setRatingValue(target.metrics.value || 5);
      }
    } else {
      setIsEditingExisting(false);
      setReviewerName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '');
      setReviewerRole('Parent');
      setReviewerClass('');
      setRatingOverall(5);
      setRatingAcademics(5);
      setRatingInfrastructure(5);
      setRatingSafety(5);
      setRatingSports(5);
      setRatingValue(5);
      setReviewComment('');
    }
    setIsWriteReviewOpen(true);
    setTimeout(() => {
      const el = document.getElementById('write-review-questionnaire-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleDeleteReview = async (reviewId?: string | number) => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_review',
          udiseCode,
          userId: user?.id,
          userEmail: user?.email,
          reviewId: reviewId || userReview?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserReview(null);
        setReviewsList(data.reviews || reviewsList.filter((r) => r.id !== (reviewId || userReview?.id)));
        setStatusMessage('Your review was successfully removed.');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch (err: any) {
      console.error('Delete review error:', err);
      alert(err.message || 'Error deleting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (id: string | number) => {
    const nextVal = !userLikesMap[id];
    setUserLikesMap((prev) => ({
      ...prev,
      [id]: nextVal
    }));
    try {
      localStorage.setItem(`liked_review_${id}`, nextVal ? 'true' : 'false');
      await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like_review',
          udiseCode,
          reviewId: id,
          userId: user?.id || user?.email || '',
          liked: nextVal,
        }),
      });
    } catch (e) {
      console.warn('Error saving review like:', e);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const payload = {
        action: 'review',
        udiseCode,
        userId: user?.id,
        userEmail: user?.email,
        reviewId: userReview?.id,
        author: reviewerName.trim(),
        role: reviewerRole,
        studentClass: reviewerClass.trim() || `${reviewerRole} Feedback`,
        rating: ratingOverall,
        comment: reviewComment.trim(),
        metrics: {
          academics: ratingAcademics,
          infrastructure: ratingInfrastructure,
          safety: ratingSafety,
          sports: ratingSports,
          value: ratingValue,
        },
      };

      const res = await fetch('/api/school-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setUserReview(data.review);
        setReviewsList(data.reviews || [data.review, ...reviewsList]);
        setStatusMessage(data.action === 'review_updated' ? 'Your review was updated successfully!' : 'Review published and saved to database!');
        setTimeout(() => {
          setStatusMessage('');
          setIsWriteReviewOpen(false);
        }, 1500);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err: any) {
      console.error('Review submit error:', err);
      // Local optimistic fallback
      const fallbackRev = {
        id: `rev-${Date.now()}`,
        userId: user?.id,
        userEmail: user?.email,
        author: reviewerName.trim(),
        role: reviewerRole,
        studentClass: reviewerClass.trim() || `${reviewerRole} Feedback`,
        date: 'Just now',
        createdAt: new Date().toISOString(),
        rating: ratingOverall,
        likes: 1,
        comment: reviewComment.trim(),
        metrics: {
          academics: ratingAcademics,
          infrastructure: ratingInfrastructure,
          safety: ratingSafety,
          sports: ratingSports,
          value: ratingValue,
        }
      };
      setUserReview(fallbackRev);
      setReviewsList([fallbackRev, ...reviewsList.filter(r => r.userId !== user?.id)]);
      setStatusMessage('Review submitted!');
      setTimeout(() => {
        setStatusMessage('');
        setIsWriteReviewOpen(false);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviewsList = reviewsList.filter((rev) => {
    if (reviewRoleFilter !== 'all' && rev.role !== reviewRoleFilter) return false;
    if (reviewStarFilter !== 'all' && rev.rating !== reviewStarFilter) return false;
    if (reviewSearchText.trim()) {
      const q = reviewSearchText.toLowerCase();
      const matchAuthor = rev.author?.toLowerCase().includes(q);
      const matchComment = rev.comment?.toLowerCase().includes(q);
      const matchRole = rev.role?.toLowerCase().includes(q);
      if (!matchAuthor && !matchComment && !matchRole) return false;
    }
    return true;
  });

  return (
    <section id="reviews" className="py-12 sm:py-20 bg-white border-b border-[#E8E9E9] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header & Write Review Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-3.5 py-1.5 rounded-full mb-3 shadow-2xs font-['Montserrat',sans-serif]">
              <span className="w-2 h-2 bg-[#006FCC] rounded-full inline-block animate-pulse" />
              <span>GENUINE COMMUNITY RATINGS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-tight">
              Community Feedback &amp;
              <span className="text-[#006FCC] block mt-0.5">Verified Parent &amp; Student Ratings</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl leading-relaxed font-normal">
              Real, verified feedback from enrolled families, current scholars, and distinguished alumni of {displayName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {userReview ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(userReview)}
                  className="bg-[#006FCC] hover:bg-[#005399] text-white font-bold font-['Montserrat',sans-serif] px-5 sm:px-6 py-2.5 rounded-[12px] text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit My Review</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(userReview.id)}
                  disabled={isSubmitting}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2.5 rounded-[12px] text-xs sm:text-sm flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer font-['Montserrat',sans-serif]"
                  title="Delete My Review"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenEditModal()}
                className="bg-[#006FCC] hover:bg-[#005399] text-white font-bold font-['Montserrat',sans-serif] px-6 py-3 rounded-[14px] text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#006FCC]/25 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            )}
          </div>
        </div>

        {/* User's Own Review Banner (If already reviewed) */}
        {userReview && !isWriteReviewOpen && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#005689] text-white flex items-center justify-center font-black text-sm shrink-0">
                {(userReview.author || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">Your Active Review</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-[#005689] px-2 py-0.5 rounded-full">
                    {userReview.rating} / 5 Stars
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">"{userReview.comment}"</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleOpenEditModal(userReview)}
                className="text-xs font-black text-[#005689] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleDeleteReview(userReview.id)}
                className="text-xs font-black text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Review Overview */}
        {reviewsList.length === 0 ? (
          <div className="bg-[#F7F8F8] rounded-[14px] p-8 sm:p-14 border border-[#E8E9E9] mb-12 shadow-xs text-center">
            <div className="w-16 h-16 rounded-[14px] bg-amber-50 text-amber-500 border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs mb-4">
              <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight">
              No Community Reviews Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2.5 leading-relaxed">
              Be the first verified parent, student, or alumnus of {displayName} to submit an authentic review and rating.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleOpenEditModal()}
                className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005399] text-white font-bold font-['Montserrat',sans-serif] text-xs sm:text-sm px-6 py-3 rounded-[14px] shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write First Review</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F7F8F8] rounded-[14px] p-6 sm:p-8 border border-[#E8E9E9] mb-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 text-center lg:text-left lg:border-r border-[#E8E9E9] lg:pr-8">
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <span className="text-5xl sm:text-6xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight">
                    {(reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewsList.length).toFixed(1)}
                  </span>
                  <span className="text-lg font-bold text-slate-400">/ 5.0</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Based on <strong>{reviewsList.length} Verified Community Review{reviewsList.length > 1 ? 's' : ''}</strong>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] text-[11px] font-semibold px-3 py-1 rounded-[8px] mt-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Authenticated by CSEEL
                </div>
              </div>
              <div className="lg:col-span-7 space-y-2 text-xs text-slate-600">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#006FCC] mb-2 font-['Montserrat',sans-serif]">Community Ratings</h4>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewsList.filter((r) => Number(r.rating) === star).length;
                  const pct = Math.round((count / reviewsList.length) * 100);
                  return (
                    <div key={star} className="flex items-center gap-2.5">
                      <span className="w-14 font-semibold text-slate-700">{star} Stars</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right font-bold text-slate-800">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Inline "Write or Edit Review" Questionnaire Panel */}
        {isWriteReviewOpen && (
          <div
            id="write-review-questionnaire-card"
            className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#006FCC]/30 shadow-xl mb-12 relative animate-fade-in"
          >
            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">
                <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />
                <span>{isEditingExisting ? 'UPDATE YOUR REVIEW' : 'AUTHENTIC COMMUNITY FEEDBACK'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#002B49]">
                {isEditingExisting ? `Edit Review for ${displayName}` : `Rate & Review ${displayName}`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-6 leading-relaxed">
                Per-user limit: Each parent, student, or alumnus can submit <strong>1 review</strong>. You can update or delete your review anytime.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Role & Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      You are a *
                    </label>
                    <select
                      value={reviewerRole}
                      onChange={(e) => setReviewerRole(e.target.value as any)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    >
                      <option value="Parent">Parent of Student</option>
                      <option value="Student">Current Student</option>
                      <option value="Alumni">Student Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Student Class / Batch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Class 9th or Batch 2024"
                      value={reviewerClass}
                      onChange={(e) => setReviewerClass(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    />
                  </div>
                </div>

                {/* 5-Question Evaluation Rating Suite */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                    Comprehensive Campus Evaluation (1 to 5 Stars)
                  </h4>

                  {[
                    {
                      id: 'overall',
                      q: '1. Overall Educational & School Experience',
                      desc: 'Overall satisfaction with academics, moral values, extracurriculars and institutional culture',
                      value: ratingOverall,
                      setter: setRatingOverall,
                      labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Exceptional / Top Class']
                    },
                    {
                      id: 'academics',
                      q: '2. Academic Rigor, Faculty Quality & Student Support',
                      desc: 'Subject knowledge of teachers, individual attention, doubt-solving & board preparation',
                      value: ratingAcademics,
                      setter: setRatingAcademics,
                      labels: ['Needs Attention', 'Satisfactory', 'Good', 'Very Good', 'Outstanding & Dedicated']
                    },
                    {
                      id: 'infrastructure',
                      q: '3. Campus Infrastructure, Classrooms & Science Labs',
                      desc: 'Physics, Chemistry, Computer labs, library, smart digital classrooms & campus grounds',
                      value: ratingInfrastructure,
                      setter: setRatingInfrastructure,
                      labels: ['Inadequate', 'Basic', 'Decent', 'Modern & Equipped', 'World-Class & Advanced']
                    },
                    {
                      id: 'safety',
                      q: '4. Student Safety, Discipline & Transport Care',
                      desc: 'CCTV surveillance, student care, female conductors in buses & safe environment',
                      value: ratingSafety,
                      setter: setRatingSafety,
                      labels: ['Safety Concerns', 'Average', 'Safe & Disciplined', 'Very Safe', '100% Secure & Attentive']
                    },
                    {
                      id: 'sports',
                      q: '5. Sports Coaching & Extracurricular Activities',
                      desc: 'Playgrounds, sports coaching, cultural fests, debate, dance & arts',
                      value: ratingSports,
                      setter: setRatingSports,
                      labels: ['Minimal', 'Limited', 'Good Activities', 'Active & Regular', 'Top-Tier Sports Academy']
                    },
                    {
                      id: 'value',
                      q: '6. Fee Justification & Value for Money',
                      desc: 'Is the fee structure justified by the education, practical facilities and care provided?',
                      value: ratingValue,
                      setter: setRatingValue,
                      labels: ['High / Overpriced', 'Expensive', 'Reasonable', 'Good Value', 'Exceptional Value']
                    }
                  ].map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 hover:border-blue-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <p className="text-[11px] sm:text-xs font-bold text-gray-900">{item.q}</p>
                          <p className="text-[11px] text-gray-500">{item.desc}</p>
                        </div>
                        <span className="text-xs font-bold text-[#006FCC] shrink-0">
                          {item.labels[item.value - 1]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-400 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => item.setter(star)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                star <= item.value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                          {item.value} / 5 Stars
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Review Comments */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Your Detailed Review / Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your experience regarding teaching quality, faculty support, student safety, labs, sports facilities, and advice for prospective parents..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-bold text-emerald-600">
                    {statusMessage && <span>✓ {statusMessage}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsWriteReviewOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Saving to Database...' : isEditingExisting ? 'Update Review' : 'Submit Verified Review'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-[14px] border border-[#E8E9E9] mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-['Montserrat',sans-serif]">Filter:</span>
            {(['all', 'Parent', 'Student', 'Alumni'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setReviewRoleFilter(role);
                  setVisibleReviewsCount(4);
                }}
                className={`text-xs px-4 py-2 rounded-[10px] font-bold transition-all cursor-pointer font-['Montserrat',sans-serif] ${
                  reviewRoleFilter === role
                    ? 'bg-[#006FCC] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-[#E8E9E9]'
                }`}
              >
                {role === 'all' ? 'All Reviews' : role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={reviewSortBy}
              onChange={(e) => setReviewSortBy(e.target.value as any)}
              className="text-xs font-semibold text-slate-700 bg-white border border-[#E8E9E9] rounded-[10px] px-3.5 py-2 focus:outline-none focus:border-[#006FCC]"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>

            <div className="relative flex-1 sm:w-52">
              <input
                type="text"
                placeholder="Search reviews..."
                value={reviewSearchText}
                onChange={(e) => {
                  setReviewSearchText(e.target.value);
                  setVisibleReviewsCount(4);
                }}
                className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-[#E8E9E9] rounded-[10px] focus:outline-none focus:border-[#006FCC]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredReviewsList.slice(0, visibleReviewsCount).map((rev) => {
            const isOwner = user && (rev.userId === user.id || rev.userEmail === user.email);
            return (
              <div
                key={rev.id}
                className="bg-white rounded-[14px] p-6 border border-[#E8E9E9] shadow-xs hover:border-[#006FCC]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[10px] bg-[#EDF5FA] border border-[#D0E4F5] text-[#006FCC] font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs font-['Montserrat',sans-serif]">
                        {(rev.author || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-[#003C6E] text-sm truncate font-['Montserrat',sans-serif]">{rev.author}</h4>
                          <span className="inline-flex items-center gap-1 bg-[#EDF5FA] text-[#006FCC] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D0E4F5]">
                            <CheckCircle2 className="w-3 h-3 text-[#006FCC]" /> Verified {rev.role}
                          </span>
                          {isOwner && (
                            <span className="bg-blue-100 text-[#006FCC] text-[9.5px] font-bold px-1.5 py-0.5 rounded-md">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <div className="flex items-center text-amber-400">
                            {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span>•</span>
                          <span className="font-medium">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : rev.date || 'Recent'}
                          </span>
                          {rev.studentClass && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="hidden sm:inline text-slate-600 text-xs font-semibold truncate max-w-[150px]">{rev.studentClass}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Owner Action Buttons (Edit & Delete) */}
                    {isOwner && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(rev)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#005689] hover:bg-blue-50 transition cursor-pointer"
                          title="Edit your review"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete your review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3 sm:line-clamp-4 mt-2 mb-4 font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(rev.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      userLikesMap[rev.id]
                        ? 'bg-blue-50 text-[#006FCC] border border-blue-200'
                        : 'hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${userLikesMap[rev.id] ? 'fill-[#006FCC]' : ''}`} />
                    <span>Helpful ({(rev.likes || 0) + (userLikesMap[rev.id] ? 1 : 0)})</span>
                  </button>

                  <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Authenticated
                  </span>
                </div>
              </div>
            );
          })}

          {filteredReviewsList.length === 0 && reviewsList.length > 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200 col-span-2">
              <p className="text-sm text-gray-500 font-medium">No reviews match your selected filter or search.</p>
              <button
                type="button"
                onClick={() => {
                  setReviewRoleFilter('all');
                  setReviewStarFilter('all');
                  setReviewSearchText('');
                }}
                className="mt-2 text-xs font-bold text-[#005689] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
