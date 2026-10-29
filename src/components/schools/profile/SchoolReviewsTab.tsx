'use client';

import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';

export interface SchoolReviewsTabProps {
  displayName: string;
}

export default function SchoolReviewsTab({
  displayName,
}: SchoolReviewsTabProps) {
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewRoleFilter, setReviewRoleFilter] = useState<'all' | 'Parent' | 'Student' | 'Alumni'>('all');
  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');
  const [reviewSearchText, setReviewSearchText] = useState('');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);
  const [reviewSortBy, setReviewSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [userLikesMap, setUserLikesMap] = useState<Record<number, boolean>>({});

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
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleToggleLike = (id: number) => {
    setUserLikesMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: reviewerName.trim(),
      role: reviewerRole,
      studentClass: reviewerClass.trim() || `${reviewerRole} Feedback`,
      date: 'Just now',
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

    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsWriteReviewOpen(false);
      setReviewerName('');
      setReviewComment('');
      setReviewerClass('');
    }, 1500);
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
    <section id="reviews" className="py-12 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Write Review Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">
              <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />
              <span>GENUINE COMMUNITY RATINGS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#002B49] tracking-tight">
              What Parents & Students Say
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              Real, verified feedback from enrolled families, current scholars, and distinguished alumni of {displayName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsWriteReviewOpen(true);
                setTimeout(() => {
                  const el = document.getElementById('write-review-questionnaire-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 80);
              }}
              className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-3 rounded-[12px] text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Review Overview */}
        {reviewsList.length === 0 ? (
          <div className="bg-[#F8FAFD] rounded-3xl p-8 sm:p-12 border border-blue-100/80 mb-10 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-white text-amber-500 border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs mb-3.5">
              <Star className="w-7 h-7 fill-amber-400/20 text-amber-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#002B49] tracking-tight">
              No Community Reviews Yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
              Be the first verified parent, student, or alumnus of {displayName} to submit an authentic review and rating.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(true)}
                className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write First Review</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F8FAFD] rounded-3xl p-6 sm:p-8 border border-blue-100/80 mb-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 text-center lg:text-left lg:border-r border-gray-200 lg:pr-8">
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-[#002B49] tracking-tight">
                    {(reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1)}
                  </span>
                  <span className="text-lg font-bold text-gray-400">/ 5.0</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Based on <strong>{reviewsList.length} Verified Community Review{reviewsList.length > 1 ? 's' : ''}</strong>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] text-[11px] font-semibold px-3 py-1 rounded-full mt-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Authenticated by CSEEL
                </div>
              </div>
              <div className="lg:col-span-7 space-y-2 text-xs text-gray-600">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#005689] mb-2">Community Ratings</h4>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewsList.filter((r) => r.rating === star).length;
                  const pct = Math.round((count / reviewsList.length) * 100);
                  return (
                    <div key={star} className="flex items-center gap-2.5">
                      <span className="w-14 font-semibold text-gray-700">{star} Stars</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right font-bold text-gray-800">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Inline "Write a Review" Questionnaire Panel */}
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
                <span>AUTHENTIC COMMUNITY FEEDBACK</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#002B49]">
                Rate & Review {displayName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-6 leading-relaxed">
                Your authentic feedback helps other parents and students make the best decision for their education. Please answer the evaluation questions below:
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
                      placeholder="e.g. Ramesh Sharma"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Class / Batch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Class 10th / Batch 2024"
                      value={reviewerClass}
                      onChange={(e) => setReviewerClass(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"
                    />
                  </div>
                </div>

                {/* 6 5-Point Questionnaire Ratings */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#005689] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Star Rating Questions (Answer on 5-Point Scale)</span>
                  </h4>

                  {[
                    {
                      id: 'overall',
                      q: '1. Overall School Experience & Recommendation',
                      desc: 'Overall experience, discipline and whether you recommend this school to others',
                      value: ratingOverall,
                      setter: setRatingOverall,
                      labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent / Highly Recommended']
                    },
                    {
                      id: 'academics',
                      q: '2. Academics & Faculty Teaching Quality',
                      desc: 'Teacher dedication, teaching quality, doubt solving & CBSE/board results',
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
                  <button
                    type="submit"
                    disabled={reviewSubmitted}
                    className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{reviewSubmitted ? 'Review Published!' : 'Submit Verified Review'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="bg-gray-50/80 p-3 sm:p-4 rounded-2xl border border-gray-200/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500 uppercase">Filter:</span>
            {(['all', 'Parent', 'Student', 'Alumni'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setReviewRoleFilter(role);
                  setVisibleReviewsCount(4);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  reviewRoleFilter === role
                    ? 'bg-[#005689] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {role === 'all' ? 'All Reviews' : role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={reviewSortBy}
              onChange={(e) => setReviewSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006FCC]"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>

            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                placeholder="Search reviews..."
                value={reviewSearchText}
                onChange={(e) => {
                  setReviewSearchText(e.target.value);
                  setVisibleReviewsCount(4);
                }}
                className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006FCC]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredReviewsList.slice(0, visibleReviewsCount).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2.5 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#005689] to-[#006FCC] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {rev.author.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{rev.author}</h4>
                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified {rev.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{rev.date}</span>
                        {rev.studentClass && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline text-slate-500 text-[10.5px] truncate max-w-[150px]">{rev.studentClass}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed line-clamp-3 sm:line-clamp-4 mt-1.5 mb-3">
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
                  <span>Helpful ({rev.likes + (userLikesMap[rev.id] ? 1 : 0)})</span>
                </button>

                <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Authenticated
                </span>
              </div>
            </div>
          ))}

          {filteredReviewsList.length === 0 && reviewsList.length > 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 font-medium">No reviews match your selected filter or search.</p>
              <button
                type="button"
                onClick={() => {
                  setReviewRoleFilter('all');
                  setReviewStarFilter('all');
                  setReviewSearchText('');
                }}
                className="mt-3 text-xs font-bold text-[#006FCC] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Load More Reviews Button */}
        {visibleReviewsCount < filteredReviewsList.length ? (
          <div className="text-center pt-8 pb-4">
            <button
              type="button"
              onClick={() => setVisibleReviewsCount((c) => c + 4)}
              className="button_secondary inline-flex items-center gap-2 bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] font-bold text-xs sm:text-sm px-8 py-3.5 rounded-[12px] shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Load More Reviews</span>
              <span className="text-xs bg-[#006FCC]/10 px-2 py-0.5 rounded-full font-bold">
                Showing {visibleReviewsCount} of {filteredReviewsList.length}
              </span>
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : filteredReviewsList.length > 0 ? (
          <div className="text-center py-8 text-xs text-gray-500 font-medium">
            ✓ You've viewed all {filteredReviewsList.length} verified community reviews
          </div>
        ) : null}
      </div>
    </section>
  );
}
