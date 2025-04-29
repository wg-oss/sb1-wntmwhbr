import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Award, Calendar, Briefcase } from 'lucide-react';
import { Post, User } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  currentUser: User;
  users: User[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onProfileClick: (userId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  users,
  onLike,
  onComment,
  onProfileClick
}) => {
  const [commentText, setCommentText] = useState('');
  const postUser = users.find(u => u.id === post.userId);
  const isLiked = post.likes.includes(currentUser.id);

  const getPostIcon = () => {
    switch (post.type) {
      case 'certification':
        return <Award className="text-blue-500" />;
      case 'work-anniversary':
        return <Calendar className="text-green-500" />;
      case 'project-update':
        return <Briefcase className="text-purple-500" />;
      default:
        return null;
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <img
          src={postUser?.photo}
          alt={postUser?.name}
          className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => postUser && onProfileClick(postUser.id)}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 
              className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => postUser && onProfileClick(postUser.id)}
            >
              {postUser?.name}
            </h3>
            {getPostIcon()}
          </div>
          <p className="text-sm text-gray-500">
            {postUser?.role === 'contractor' ? postUser?.company : `${postUser?.company}`}
          </p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700">{post.content}</p>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
        <span>{post.likes.length} likes</span>
        <span>{post.comments.length} comments</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 pt-2 border-t">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 text-sm font-medium ${
            isLiked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <Heart size={20} className={isLiked ? 'fill-current' : ''} />
          Like
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-500">
          <MessageSquare size={20} />
          Comment
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-500">
          <Share2 size={20} />
          Share
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-3 pt-2">
        {post.comments.map(comment => {
          const commentUser = users.find(u => u.id === comment.userId);
          return (
            <div key={comment.id} className="flex gap-3">
              <img
                src={commentUser?.photo}
                alt={commentUser?.name}
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => commentUser && onProfileClick(commentUser.id)}
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p 
                    className="font-medium text-sm cursor-pointer hover:text-blue-600"
                    onClick={() => commentUser && onProfileClick(commentUser.id)}
                  >
                    {commentUser?.name}
                  </p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="flex gap-3 pt-2">
          <img
            src={currentUser.photo}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onProfileClick(currentUser.id)}
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
    </div>
  );
};

export default PostCard;