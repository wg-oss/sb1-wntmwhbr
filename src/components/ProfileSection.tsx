import React, { useState, useRef } from 'react';
import { User, Briefcase, Mail, MapPin, Edit2, Check, X, LogOut, Heart, MessageSquare, Users } from 'lucide-react';
import { Realtor, Contractor, PortfolioItem } from '../types';

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  projectId?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  type: 'project-update' | 'certification' | 'general' | 'project-showcase';
}

interface ProfileSectionProps {
  currentUser: Realtor | Contractor;
  viewingUser?: Realtor | Contractor;
  onBack?: () => void;
  onLogout?: () => void;
  posts: Post[];
  allUsers: (Realtor | Contractor)[];
  onViewProfile?: (user: Realtor | Contractor) => void;
  onAddProject?: (project: PortfolioItem) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  currentUser,
  viewingUser,
  onBack,
  onLogout,
  posts,
  allUsers,
  onViewProfile,
  onAddProject,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...currentUser });
  const [location, setLocation] = useState('San Francisco Bay Area');
  const [activeTab, setActiveTab] = useState<'posts' | 'portfolio'>('posts');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<PortfolioItem>({
    id: '',
    title: '',
    description: '',
    images: [],
    completionDate: new Date().toISOString(),
    clientFeedback: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUser = viewingUser || editedUser;
  const isOwnProfile = !viewingUser;
  const isContractor = displayUser.role === 'contractor';

  // Compute mutual connections
  const mutualConnections = viewingUser
    ? currentUser.connections
        .filter(c => c.status === 'accepted')
        .filter(c1 =>
          viewingUser.connections
            .filter(c => c.status === 'accepted')
            .some(c2 => c2.connectionId === c1.connectionId)
        )
        .map(c => allUsers.find(user => user.id === c.connectionId))
        .filter((user): user is Realtor | Contractor => user !== undefined)
    : [];

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile:', editedUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...currentUser });
  };

  const handleChange = (field: string, value: string | string[]) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (e.currentTarget.src !== 'https://via.placeholder.com/150?text=Image+Not+Found') {
      console.error('Image failed to load:', e.currentTarget.src);
    }
    e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({
          ...prev,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      alert('Title and description are required.');
      return;
    }
    const projectWithId: PortfolioItem = {
      ...newProject,
      id: `proj-${Date.now()}`,
      images: newProject.images.length > 0 ? newProject.images : ['https://via.placeholder.com/150?text=Project+Image'],
    };
    onAddProject?.(projectWithId);
    setShowAddProjectModal(false);
    setNewProject({
      id: '',
      title: '',
      description: '',
      images: [],
      completionDate: new Date().toISOString(),
      clientFeedback: '',
    });
  };

  const renderPostContent = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    return (
      <p className="text-gray-800">
        {parts.map((part, index) => {
          if (part.startsWith('@')) {
            const username = part.substring(1);
            const user = allUsers.find(u => u.name.replace(/\s+/g, '') === username);
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

  // Generate a color and initials for placeholder
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
  };

  const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 80%)`;
    return color;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl relative">
        <div className="absolute -bottom-16 left-8">
          <div className="relative group">
            {isEditing && isOwnProfile ? (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  {editedUser.photo ? (
                    <img
                      src={editedUser.photo}
                      alt={editedUser.name}
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold"
                      style={{ backgroundColor: getColorFromName(editedUser.name) }}
                    >
                      {getInitials(editedUser.name)}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="text-white" size={24} />
                  </div>
                </div>
              </>
            ) : (
              <>
                {displayUser.photo ? (
                  <img
                    src={displayUser.photo}
                    alt={displayUser.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold"
                    style={{ backgroundColor: getColorFromName(displayUser.name) }}
                  >
                    {getInitials(displayUser.name)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {isOwnProfile && (
          isEditing ? (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors"
              >
                <Edit2 size={20} />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>
          )
        )}
      </div>

      <div className="bg-white rounded-b-xl shadow-sm px-8 pt-20 pb-8">
        <div className="space-y-4">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="text-2xl font-bold text-gray-900 bg-gray-50 rounded px-2 py-1 w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{displayUser.name}</h1>
            )}
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Briefcase size={16} />
              {isEditing ? (
                <input
                  type="text"
                  value={displayUser.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="bg-gray-50 rounded px-2 py-1 flex-1"
                />
              ) : (
                displayUser.company || 'N/A'
              )}
            </p>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <MapPin size={16} />
              {isEditing ? (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-50 rounded px-2 py-1 flex-1"
                />
              ) : (
                location
              )}
            </p>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Mail size={16} />
              {displayUser.email || 'N/A'}
            </p>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-900">
                {displayUser.connections.filter(c => c.status === 'accepted').length}
              </span>
              <span className="text-gray-600 ml-1">connections</span>
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={displayUser.yearsExperience}
                    onChange={(e) => handleChange('yearsExperience', e.target.value)}
                    className="bg-gray-50 rounded px-2 py-1 w-16"
                  />
                  <span className="text-gray-600">years experience</span>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-gray-900">{displayUser.yearsExperience}</span>
                  <span className="text-gray-600 ml-1">years experience</span>
                </>
              )}
            </div>
          </div>

          {/* Mutual Connections Section */}
          {viewingUser && mutualConnections.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Users size={20} /> Mutual Connections
              </h2>
              <div className="space-y-2">
                {mutualConnections.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onViewProfile && onViewProfile(user)}
                  >
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={handleImageError}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        {user.role === 'contractor' ? user.specialty : user.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
            {isEditing ? (
              <textarea
                value={displayUser.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full h-32 bg-gray-50 rounded px-3 py-2 text-gray-600"
              />
            ) : (
              <p className="text-gray-600">{displayUser.bio || 'No bio available.'}</p>
            )}
          </div>

          {'specialties' in displayUser && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {(displayUser as Realtor).specialties.map((specialty, index) => (
                  <div key={index} className="relative group">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {specialty}
                    </span>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newSpecialties = (editedUser as Realtor).specialties.filter((_, i) => i !== index);
                          handleChange('specialties', newSpecialties);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={() => {
                      const newSpecialty = prompt('Enter new specialty:');
                      if (newSpecialty) {
                        handleChange('specialties', [...(editedUser as Realtor).specialties, newSpecialty]);
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                  >
                    + Add Specialty
                  </button>
                )}
              </div>
            </div>
          )}

          {'certifications' in displayUser && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {(displayUser as Contractor).certifications.map((cert, index) => (
                  <div key={index} className="relative group">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {cert}
                    </span>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newCertifications = (editedUser as Contractor).certifications.filter((_, i) => i !== index);
                          handleChange('certifications', newCertifications);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={() => {
                      const newCert = prompt('Enter new certification:');
                      if (newCert) {
                        handleChange('certifications', [...(editedUser as Contractor).certifications, newCert]);
                      }
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
                  >
                    + Add Certification
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Posts and Portfolio */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-semibold text-gray-800 border-b-2 ${
              activeTab === 'posts' ? 'border-blue-500 text-blue-500' : 'border-transparent'
            }`}
          >
            Posts
          </button>
          {isContractor && (
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 font-semibold text-gray-800 border-b-2 ${
                activeTab === 'portfolio' ? 'border-blue-500 text-blue-500' : 'border-transparent'
              }`}
            >
              Portfolio
            </button>
          )}
        </div>

        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="border-b pb-4 last:border-b-0">
                  {renderPostContent(post.content)}
                  {post.images && post.images.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto snap-x snap-mandatory min-w-full">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-48 h-48 object-cover rounded-lg snap-center flex-shrink-0"
                          onError={handleImageError}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
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
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-sm text-gray-700">
                          <span className="font-semibold">
                            {allUsers.find(u => u.id === comment.userId)?.name || 'Unknown'}:
                          </span>{' '}
                          {comment.content}
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No posts yet.</p>
            )}
          </div>
        )}

        {activeTab === 'portfolio' && isContractor && (
          <div className="space-y-6">
            {isOwnProfile && (
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                + Add Project
              </button>
            )}
            {(displayUser as Contractor).portfolio.length > 0 ? (
              (displayUser as Contractor).portfolio.map((project) => (
                <div key={project.id} className="border-b pb-4 last:border-b-0">
                  <h4 className="text-lg font-semibold text-gray-800">{project.title}</h4>
                  <p className="text-gray-600">{project.description}</p>
                  {project.images && project.images.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto snap-x snap-mandatory min-w-full">
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
              ))
            ) : (
              <p className="text-gray-500">No portfolio projects yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddProjectModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Project</h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  value={newProject.images[0] || ''}
                  onChange={(e) => setNewProject({ ...newProject, images: [e.target.value] })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Completion Date</label>
                <input
                  type="date"
                  value={newProject.completionDate.split('T')[0]}
                  onChange={(e) => setNewProject({ ...newProject, completionDate: new Date(e.target.value).toISOString() })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Client Feedback (optional)</label>
                <textarea
                  value={newProject.clientFeedback || ''}
                  onChange={(e) => setNewProject({ ...newProject, clientFeedback: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <button
                onClick={handleAddProject}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;