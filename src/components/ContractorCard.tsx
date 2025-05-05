import React, { useState, useEffect, useMemo } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Star, Folder, Calendar, Users, X, MessageCircle } from 'lucide-react';
import { Contractor, User } from '../types';
import { realtors, contractors } from '../data/users';
import ReactDOM from 'react-dom';

interface ContractorCardProps {
  contractor: Contractor;
  currentUser: User;
  onSchedule: () => void;
  onMessage: () => void;
  onViewProfile?: () => void;
  onDisableSwipe?: () => void;
  onEnableSwipe?: () => void;
  onPopUpChange?: (isOpen: boolean) => void;
}

interface Review {
  id: string;
  reviewerId: string;
  rating: number;
  text: string;
  date: string;
  helpfulCount: number;
  unhelpfulCount: number;
}

const ContractorCard: React.FC<ContractorCardProps> = ({
  contractor,
  currentUser,
  onSchedule,
  onMessage,
  onViewProfile,
  onDisableSwipe,
  onEnableSwipe,
  onPopUpChange,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const handleWriteReview = () => {
    // Add your review writing logic here
    console.log('Write review clicked');
  };
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const contractorReviews: Record<string, Review[]> = {
    'c1': [
      {
        id: 'r1-c1',
        reviewerId: 'r1',
        rating: 4.9,
        text: 'John transformed our kitchen with incredible attention to detail. A true professional!',
        date: '2024-02-15',
        helpfulCount: 10,
        unhelpfulCount: 0,
      },
      {
        id: 'r2-c1',
        reviewerId: 'r2',
        rating: 4.6,
        text: 'Reliable and skilled. The project timeline was met perfectly.',
        date: '2024-01-20',
        helpfulCount: 5,
        unhelpfulCount: 1,
      },
      {
        id: 'r3-c1',
        reviewerId: 'r3',
        rating: 4.8,
        text: 'Fantastic work on our home renovation. Highly recommend John!',
        date: '2024-03-05',
        helpfulCount: 8,
        unhelpfulCount: 0,
      },
      {
        id: 'r4-c1',
        reviewerId: 'r4',
        rating: 4.7,
        text: 'John did an amazing job on our patio. Very impressed with his craftsmanship!',
        date: '2024-04-10',
        helpfulCount: 12,
        unhelpfulCount: 0,
      },
    ],
    'c2': [
      {
        id: 'r1-c2',
        reviewerId: 'r1',
        rating: 4.7,
        text: "Sarah's plumbing expertise saved our project. Quick and efficient!",
        date: '2024-02-10',
        helpfulCount: 9,
        unhelpfulCount: 0,
      },
      {
        id: 'r2-c2',
        reviewerId: 'r2',
        rating: 4.9,
        text: 'Outstanding service. Sarah fixed complex issues with ease.',
        date: '2024-01-15',
        helpfulCount: 11,
        unhelpfulCount: 0,
      },
      {
        id: 'r3-c2',
        reviewerId: 'r3',
        rating: 4.5,
        text: 'Great communication and quality work on our bathroom install.',
        date: '2024-03-12',
        helpfulCount: 7,
        unhelpfulCount: 1,
      },
      {
        id: 'r4-c2',
        reviewerId: 'r4',
        rating: 4.8,
        text: 'Sarah was fantastic to work with. Our plumbing issues were resolved perfectly!',
        date: '2024-04-15',
        helpfulCount: 10,
        unhelpfulCount: 0,
      },
    ],
    'default': [
      {
        id: 'r1-default',
        reviewerId: 'r1',
        rating: 4.8,
        text: 'Excellent work and professionalism. Would collaborate again!',
        date: '2024-02-01',
        helpfulCount: 8,
        unhelpfulCount: 0,
      },
      {
        id: 'r2-default',
        reviewerId: 'r2',
        rating: 4.7,
        text: 'Solid performance on our recent project. Very satisfied.',
        date: '2024-01-25',
        helpfulCount: 6,
        unhelpfulCount: 1,
      },
      {
        id: 'r3-default',
        reviewerId: 'r3',
        rating: 4.6,
        text: 'Dependable and skilled. Completed the job to high standards.',
        date: '2024-03-08',
        helpfulCount: 9,
        unhelpfulCount: 0,
      },
      {
        id: 'r4-default',
        reviewerId: 'r4',
        rating: 4.9,
        text: 'Exceeded expectations on our project. Highly recommended!',
        date: '2024-04-20',
        helpfulCount: 12,
        unhelpfulCount: 0,
      },
    ],
  };

  const allUsers = [...contractors, ...realtors];

  // Consistent shuffle based on contractor ID
  const reviews = useMemo(() => {
    const reviewsList = contractorReviews[contractor.id] || contractorReviews['default'];
    const seed = contractor.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...reviewsList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((seed + i) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [contractor.id]);

  const contractorConnections = (contractor.connections || [])
    .filter((conn) => conn.status === 'accepted')
    .length;

  // Get Emma's direct connections (the people she's connected to)
  const emmaConnections = (currentUser.connections || [])
    .filter(conn => conn.status === 'accepted')
    .map(conn => conn.connectionId);

  // Get all users that the contractor is connected to
  const contractorConnectionsList = (contractor.connections || [])
    .filter(conn => conn.status === 'accepted')
    .map(conn => conn.connectionId);

  // Count mutual connections: people who are connected to Emma's connections
  // (i.e., if contractor is connected to John or Michael, they are mutual)
  const mutualConnections = contractorConnectionsList
    .filter(id => emmaConnections.includes(id))
    .length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (onPopUpChange) {
      onPopUpChange(showPortfolio || showReviews);
    }
  }, [showPortfolio, showReviews, onPopUpChange]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (e.currentTarget.src !== 'https://via.placeholder.com/150?text=Image+Not+Found') {
      console.error('Image failed to load:', e.currentTarget.src);
    }
    e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setShowHint(false);
    },
    onSwipedRight: () => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setShowHint(false);
    },
    trackMouse: true,
    delta: 10,
  });

  const handleOpenPortfolio = () => {
    console.log(`Opening portfolio for ${contractor.name} (ID: ${contractor.id})`);
    setShowPortfolio(true);
    if (onDisableSwipe) {
      onDisableSwipe();
    }
  };

  const handleClosePortfolio = () => {
    setShowPortfolio(false);
    if (onEnableSwipe) {
      onEnableSwipe();
    }
  };

  const handleViewAllReviews = () => {
    setShowReviews(true);
    if (onDisableSwipe) {
      onDisableSwipe();
    }
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
    if (onEnableSwipe) {
      onEnableSwipe();
    }
  };

  const slides = [
    {
      content: (
        <div className="flex flex-col h-full">
          <div className="relative h-full">
            <img
              src={contractor.photo}
              alt={contractor.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col px-0 pt-4 pb-0">
              <div className="flex-1" />
              <div className="-mt-36 px-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white">{contractor.rating.toFixed(1)}</span>
                  </div>
                  <button 
                    onClick={onViewProfile}
                    className="text-2xl font-bold text-white hover:underline focus:outline-none"
                  >
                    {contractor.name}
                  </button>
                </div>
                <div className="mt-1">
                  {contractor.certifications.length > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-blue-100">
                      <span>
                        {contractor.certifications.slice(0, 2).join(', ')}
                        {contractor.certifications.length > 2 && (
                          <span className="ml-1 bg-blue-900 bg-opacity-50 px-1 py-0.5 rounded-full">
                            +{contractor.certifications.length - 2} more
                          </span>
                        )}
                      </span>
                    </div>
                  ) : null}
                </div>
                {contractorConnections > 0 && (
                  <div className="flex items-center gap-2 mt-2 mb-4">
                    <Users size={16} className="text-white" />
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">
                        {contractorConnections} Connection{contractorConnections !== 1 ? 's' : ''}
                      </span>
                      {mutualConnections > 0 && (
                        <span className="flex items-center gap-1 text-xs text-blue-300 bg-blue-900 bg-opacity-50 px-2 py-0.5 rounded-full">
                          <Users size={12} />
                          {mutualConnections} Mutual
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-auto w-full bg-white rounded-t-3xl -mt-6 relative z-10">
                <div className="flex justify-center gap-2 mt-2 pt-3">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index);
                        setShowHint(false);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentSlide === index ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2 px-4 pt-2 pb-4">
                  <button
                    onClick={onMessage}
                    className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </button>
                  <button
                    onClick={onSchedule}
                    className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm sm:text-base"
                  >
                    <Calendar size={18} />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      content: contractor.posts[0] ? (
        <div className="flex flex-col h-full">
          <div className="relative h-full">
            <img
              src={contractor.posts[0].images[0]}
              alt={`${contractor.name}'s featured project`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col px-0 pt-4 pb-0">
              <div className="flex-1" />
              <div className="-mt-36 px-4 mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {contractor.portfolio[0]?.title || 'Featured Project'}
                </h3>
                <p className="text-gray-200">
                  Posted: {new Date(contractor.posts[0].createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="mt-auto w-full bg-white rounded-t-3xl -mt-6 relative z-10">
                <div className="flex justify-center gap-2 mt-2 pt-3">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentSlide === index ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2 px-4 pt-2 pb-4">
                  <button
                    onClick={handleOpenPortfolio}
                    className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 bg-blue-500 text-white rounded-xl transition-colors text-sm sm:text-base"
                  >
                    <Folder size={18} />
                    <span>View Portfolio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-center items-center p-4">
          <p className="text-gray-500">No posts available.</p>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col h-full bg-white">
          <div className="p-3 sm:p-4 flex-1 relative flex flex-col max-h-[calc(100%-96px)]">

            {reviews.length > 0 ? (
              <div className="relative flex-1">
                <div className="space-y-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-0% via-white/80 via-75% to-white to-100% pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-semibold text-gray-800">Client Reviews</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-semibold text-gray-900">{contractor.rating.toFixed(1)}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= Math.round(contractor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleWriteReview}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                    >
                      Write a review
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </button>
                  </div>
                  {reviews.slice(0, 2).map((review) => {
                    const reviewer = allUsers.find((user) => user.id === review.reviewerId);
                    const isMutualConnection = (currentUser.connections || []).some(
                      (conn) => conn.connectionId === review.reviewerId && conn.status === 'accepted'
                    );
                    return (
                      <div key={review.id} className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-2xl font-bold text-gray-600">{reviewer?.name?.[0] || 'A'}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900 text-lg">{reviewer?.name || 'Anonymous'}</h4>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-5 h-5 ${star <= Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="text-sm text-gray-500 hover:text-gray-700">
                                  {review.helpfulCount} Helpful
                                </button>
                                <button className="text-sm text-gray-500 hover:text-gray-700">
                                  {review.unhelpfulCount} Unhelpful
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 text-gray-600">
                              <p className="text-base leading-relaxed">{review.text}</p>
                              <div className="mt-2 text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {reviews.slice(0, 3).map((review, index) => {
                    if (index === 2) {
                      return (
                        <div key={review.id} className="bg-white rounded-xl shadow-sm p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-600">{allUsers.find((user) => user.id === review.reviewerId)?.name?.[0] || 'A'}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900 text-lg">{allUsers.find((user) => user.id === review.reviewerId)?.name || 'Anonymous'}</h4>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className={`w-5 h-5 ${star <= Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="text-sm text-gray-500 hover:text-gray-700">
                                    {review.helpfulCount} Helpful
                                  </button>
                                  <button className="text-sm text-gray-500 hover:text-gray-700">
                                    {review.unhelpfulCount} Unhelpful
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 text-gray-600">
                                <p className="text-base leading-relaxed line-clamp-2">{review.text}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No reviews available yet</p>
                <p className="mt-2 text-gray-400">Be the first to leave a review</p>
              </div>
            )}
          </div>
          <div className="p-3 sm:p-4 border-t bg-white relative z-10">
            <div className="flex justify-center gap-2 mb-3">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentSlide === index ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleViewAllReviews}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl transition-colors"
            >
              <Star size={18} />
              <span>View All Reviews</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const renderPortfolioPopUp = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
      onClick={handleClosePortfolio}
    >
      <div
        className="bg-white rounded-xl w-[90vw] max-w-md h-[70vh] min-h-[50vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 rounded-t-xl z-10">
          <h3 className="text-lg font-semibold text-gray-800">{contractor.name}'s Portfolio</h3>
          <button
            onClick={handleClosePortfolio}
            className="text-gray-600 hover:text-gray-800 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-6 pt-4">
          {contractor.portfolio.length > 0 ? (
            <div className="space-y-6">
              {contractor.portfolio.map((project) => (
                <div key={project.id} className="border-b pb-4 last:border-b-0">
                  <h4 className="text-lg font-semibold text-gray-800">{project.title}</h4>
                  <p className="text-gray-600">{project.description}</p>
                  {project.images && project.images.length > 0 && (
                    <div
                      className="mt-2 flex gap-2 overflow-x-auto snap-x snap-mandatory min-w-full"
                      onTouchStart={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {project.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-48 h-48 object-cover rounded-lg snap-center flex-shrink-0"
                          onError={handleImageError}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Completed: {new Date(project.completionDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  {project.clientFeedback && (
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Client Feedback:</span> {project.clientFeedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No portfolio projects yet.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderReviewsPopUp = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
      onClick={handleCloseReviews}
    >
      <div
        className="bg-white rounded-xl w-[90vw] max-w-md h-[70vh] min-h-[50vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 rounded-t-xl z-10">
          <h3 className="text-lg font-semibold text-gray-800">{contractor.name}'s Reviews</h3>
          <button
            onClick={handleCloseReviews}
            className="text-gray-600 hover:text-gray-800 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-6 pt-4">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => {
                const reviewer = allUsers.find((user) => user.id === review.reviewerId);
                const isMutualConnection = (currentUser.connections || []).some(
                  (conn) => conn.connectionId === review.reviewerId && conn.status === 'accepted'
                );
                return (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{reviewer?.name || 'Anonymous'}</span>
                        {isMutualConnection && (
                          <span className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                            <Users size={12} />
                            Mutual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-700">{Math.round(review.rating)}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                    <p className="text-sm text-gray-400 mt-2">{review.date}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
        <div className="relative h-full">
          {showPortfolio || showReviews ? (
            <div className="bg-gray-100 w-full h-full overflow-hidden">
              <div
                className="flex h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="min-w-full h-full">
                    {slide.content}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              {...swipeHandlers}
              className="bg-gray-100 w-full h-full overflow-hidden"
            >
              <div
                className="flex h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="min-w-full h-full">
                    {slide.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render pop-ups using a portal */}
      {showPortfolio && typeof document !== 'undefined' && document.body
        ? ReactDOM.createPortal(renderPortfolioPopUp(), document.body)
        : null}

      {showReviews && typeof document !== 'undefined' && document.body
        ? ReactDOM.createPortal(renderReviewsPopUp(), document.body)
        : null}
    </div>
  );
};

export default ContractorCard;