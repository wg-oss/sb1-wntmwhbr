import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Star, Calendar, MessageSquare } from 'lucide-react';
import { Contractor, User } from '../types';

interface ContractorCardProps {
  contractor: Contractor;
  currentUser: User;
  onSchedule: () => void;
}

const ContractorCard: React.FC<ContractorCardProps> = ({
  contractor,
  onSchedule,
}) => {
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState<number>(0);
  const [showReviews, setShowReviews] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentPortfolioIndex < (contractor.portfolio?.length - 1)) {
        setCurrentPortfolioIndex((prev: number) => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (currentPortfolioIndex > 0) {
        setCurrentPortfolioIndex((prev: number) => prev - 1);
      }
    },
    trackMouse: true,
    delta: 10,
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (e.currentTarget.src !== 'https://via.placeholder.com/150?text=Image+Not+Found') {
      e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
    }
  };

  return (
    <div className="relative w-full h-full max-h-[600px] min-h-[450px] md:max-h-[700px]">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-start gap-4">
          <img
            src={contractor.photo}
            alt={contractor.name}
            className="w-16 h-16 rounded-full object-cover"
            onError={handleImageError}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{contractor.name}</h2>
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{contractor.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{contractor.specialty}</p>
          </div>
        </div>

        {/* Portfolio Carousel */}
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0" {...swipeHandlers}>
            {contractor.portfolio.length > 0 ? (
              <div className="relative h-full">
                <img
                  src={contractor.portfolio[currentPortfolioIndex]?.images?.[0]}
                  alt={contractor.portfolio[currentPortfolioIndex]?.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {contractor.portfolio[currentPortfolioIndex]?.title}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-sm sm:text-base">No portfolio items available</p>
              </div>
            )}
          </div>
          
          {/* Portfolio Navigation Dots */}
          {contractor.portfolio.length > 1 && (
            <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex justify-center gap-2 z-10">
              {contractor.portfolio.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPortfolioIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentPortfolioIndex === index ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  aria-label={`Go to portfolio item ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Schedule & Reviews Buttons - sticky for mobile */}
        <div className="p-3 sm:p-4 border-t bg-white relative z-20 sticky bottom-0 flex gap-2">
          <button
            onClick={onSchedule}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Calendar size={16} className="sm:size-18" />
            <span>Schedule Meeting</span>
          </button>
          <button
            onClick={() => setShowReviews(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 active:bg-yellow-600 transition-colors text-sm sm:text-base"
            aria-label="Show Reviews"
          >
            <Star size={18} />
            <span>Reviews</span>
          </button>
        </div>

        {/* Reviews Modal */}
        {showReviews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative flex flex-col items-center">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => setShowReviews(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Client Reviews</h3>
              <div className="w-full max-h-72 overflow-y-auto space-y-4">
                {contractor.generalReviews && contractor.generalReviews.length > 0 ? (
                  contractor.generalReviews.map((review, idx) => (
                    <div key={idx} className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < Math.round(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        ))}
                        <span className="ml-auto text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-700 text-sm mb-2">{review.content}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 text-sm">{review.reviewer}</span>
                        {review.mutual && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Mutual connection</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center">No reviews yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorCard;