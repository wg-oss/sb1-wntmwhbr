import React, { useState, useRef } from 'react';
import { Heart, MessageSquare, Image, UserPlus } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import { realtors, contractors } from '../data/users';
import { User } from '../types';

interface FeedProps {
  currentUser: any;
  posts: any[];
  onViewProfile: (user: any) => void;
  onPost: (newPost: any) => void;
  allUsers: User[];
  onConnect: (userId: string) => void;
}

const Feed: React.FC<FeedProps> = ({ currentUser, posts, onViewProfile, onPost, allUsers, onConnect }) => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUser = (userId: string) => {
    return allUsers.find((u) => u.id === userId);
  };

  // Compute recommended connections
  const recommendations = allUsers
    .filter(
      (user) =>
        user.id !== currentUser.id &&
        !currentUser.connections.some((conn) => conn.connectionId === user.id)
    )
    .map((user) => ({
      user,
      mutualConnections: user.connections
        .filter((conn) => conn.status === 'accepted')
        .filter((conn) =>
          currentUser.connections.some(
            (userConn) =>
              userConn.status === 'accepted' && userConn.connectionId === conn.connectionId
          )
        ).length,
    }))
    .sort((a, b) => b.mutualConnections - a.mutualConnections)
    .slice(0, 5)
    .map((item) => item.user);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (e.currentTarget.src !== 'https://via.placeholder.com/150?text=Image+Not+Found') {
      console.error('Image failed to load:', e.currentTarget.src);
    }
    e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
  };

  const renderPostContent = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    return (
      <p className="text-gray-800">
        {parts.map((part, index) => {
          if (part.startsWith('@')) {
            const username = part.substring(1);
            const user = allUsers.find((u) => u.name.replace(/\s+/g, '') === username);
            if (user) {
              return (
                <button
                  key={index}
                  onClick={() => onViewProfile && onViewProfile(user)}
                  className="text-blue-500 hover:underline font-semibold"
                >
                  {user.name}
                </button>
              );
            }
            return part;
          }
          return part;
        })}
      </p>
    );
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    const previewPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises)
      .then((base64Images) => {
        setImagePreviews(base64Images);
      })
      .catch((error) => {
        console.error('Error converting images to Base64:', error);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost = {
      id: `p${posts.length + 1}`,
      userId: currentUser.id,
      content,
      images: imagePreviews,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      type: 'general',
    };

    onPost(newPost);
    setContent('');
    setSelectedFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDaysAgo = (timestamp: string) => {
    const currentDate = new Date('2025-04-26');
    const postDate = new Date(timestamp);
    const diffTime = Math.abs(currentDate.getTime() - postDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}d`;
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Split posts into first two and the rest
  const firstTwoPosts = sortedPosts.slice(0, 2);
  const remainingPosts = sortedPosts.slice(2);

  const renderPost = (post: any) => {
    const user = getUser(post.userId);
    if (!user) return null;

    return (
      <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => onViewProfile(user)}>
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon size={24} className="text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h3
                className="font-semibold text-gray-800 cursor-pointer hover:underline"
                onClick={() => onViewProfile(user)}
              >
                {user.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {user.company || 'Freelance'}
              </p>
              <p className="text-xs text-gray-500">{getDaysAgo(post.createdAt)}</p>
            </div>
          </div>
          <div>
            {renderPostContent(post.content)}
            {post.images && post.images.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto snap-x snap-mandatory">
                {post.images.map((image: string, idx: number) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Post image ${idx + 1}`}
                    className="w-full sm:w-48 h-auto object-cover rounded-lg snap-center"
                    onError={handleImageError}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-gray-600">
              <Heart size={16} />
              <span className="text-sm">{post.likes.length} Likes</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MessageSquare size={16} />
              <span className="text-sm">{post.comments.length} Comments</span>
            </div>
          </div>
          {post.comments.length > 0 && (
            <div className="mt-2 space-y-2">
              {post.comments.map((comment: any) => {
                const commentUser = getUser(comment.userId);
                return (
                  <div key={comment.id} className="text-sm text-gray-700">
                    <span
                      className="font-semibold cursor-pointer hover:underline"
                      onClick={() => commentUser && onViewProfile(commentUser)}
                    >
                      {commentUser?.name || 'Unknown'}:
                    </span>{' '}
                    {comment.content}
                    <p className="text-xs text-gray-500">{getDaysAgo(comment.createdAt)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Posting Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border rounded resize-none h-32"
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleIconClick}
              className="p-2 text-gray-500 hover:text-blue-500 rounded-full transition-colors"
              title="Add photos"
            >
              <Image size={20} />
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          {imagePreviews.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Post
          </button>
        </form>
      </div>

      {/* First Two Posts */}
      {firstTwoPosts.map((post) => renderPost(post))}

      {/* Recommended Connections Section */}
      {recommendations.length > 0 && sortedPosts.length >= 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommended Connections</h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {recommendations.map((user) => (
              <div
                key={user.id}
                className="flex-shrink-0 w-48 bg-gray-50 rounded-lg p-4 snap-center cursor-pointer hover:bg-gray-100"
                onClick={() => onViewProfile(user)}
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
                  onError={handleImageError}
                />
                <h3 className="text-sm font-semibold text-gray-800 text-center truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-600 text-center truncate">
                  {user.role === 'contractor' ? user.specialty : user.company || 'Realtor'}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnect(user.id);
                  }}
                  className="flex items-center justify-center gap-1 mt-2 w-full px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                >
                  <UserPlus size={14} />
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Posts */}
      {remainingPosts.map((post) => renderPost(post))}
    </div>
  );
};

export default Feed;