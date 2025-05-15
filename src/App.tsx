import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Heart, Users, Home, MessageSquare, Search, ArrowLeft, Wrench, Hammer, Trees, Sofa, Calendar } from 'lucide-react';
import { User as ProfileIcon } from 'lucide-react';
import ContractorCard from './components/ContractorCard';
import NetworkSection from './components/NetworkSection';
import Feed from './components/Feed';
import MessagingInterface from './components/MessagingInterface';
import ProfileSection from './components/ProfileSection';
import LoginPage from './components/LoginPage';
import ScheduleMeeting from './components/ScheduleMeeting';
import MeetingManagementPage from './components/MeetingManagementPage';
import ContractorPreferences from './components/ContractorPreferences';
import { contractors, realtors } from './data/users';
import { posts as initialPosts } from './data/posts';
import { User, Contractor, Realtor, Connection, MeetingRequest, PortfolioItem, Post, BookedSlot } from './types';

// Define the replacement URLs for portfolio images
const failingImageUrls: Record<string, string> = {
  'https://images.unsplash.com/photo-1593698054469-2bb6f7b1f5d5?auto=format&fit=crop&q=80&w=500':
    'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?auto=format&fit=crop&q=80&w=500':
    'https://images.pexels.com/photos/279607/pexels-photo-279607.jpeg?auto=compress&cs=tinysrgb&w=500&h=500 possibili fit=crop',
};

// Update contractors data with proper type assertions
const updatedContractors: Contractor[] = contractors.map((contractor) => {
  if (contractor.id === 'c4') {
    const updatedPortfolio = contractor.portfolio.length > 0
      ? contractor.portfolio.map((project) => ({
          ...project,
          images: project.images.map(image => failingImageUrls[image] || image),
        }))
      : [
          {
            id: 'proj1-c4',
            title: 'Home Renovation',
            description: 'A complete home renovation project.',
            images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'],
            completionDate: '2023-10-01',
          },
        ];

    const updatedPosts = contractor.posts && contractor.posts.length > 0
      ? contractor.posts.map((post) => ({
          ...post,
          type: post.type as 'project-update' | 'certification' | 'general' | 'project-showcase',
          images: post.images.map(image => failingImageUrls[image] || image),
        }))
      : [
          {
            id: `p1-c4`,
            userId: contractor.id,
            content: 'Check out my latest home renovation project!',
            images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'],
            createdAt: '2024-01-15T10:00:00Z',
            type: 'project-showcase' as const,
            likes: [],
            comments: [],
          },
        ];

    return {
      ...contractor,
      portfolio: updatedPortfolio,
      posts: updatedPosts,
    } as Contractor;
  }

  return {
    ...contractor,
    portfolio: contractor.portfolio.map(project => ({
      ...project,
      images: project.images.map(image => failingImageUrls[image] || image),
    })),
  } as Contractor;
});

// Update ActiveSection type to include all possible values
type ActiveSection = 'feed' | 'swipe' | 'network' | 'profile' | 'search' | 'messages' | 'viewProfile';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Update AppUser interface to include password
interface AppUser {
  id: string;
  role: 'realtor' | 'contractor';
  username?: string;
  email: string;
  password?: string;
  name: string;
  photo: string;
  company: string;
  specialty?: string;
  specialties?: string[];
  connections: Connection[];
  portfolio: PortfolioItem[];
  posts: Post[];
  availability?: {
    workingHours: { start: string; end: string };
    workingDays: number[];
    meetingDuration: number;
    bookedSlots: BookedSlot[];
  };
  certifications?: string[];
  bio?: string;
  yearsExperience?: number;
  pendingMeetings?: MeetingRequest[];
  rating?: number;
}

const getTimeSince = (timestamp: string): string => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    return `${diffInWeeks}w`;
  }
};

// Update helper function to properly handle role type
const convertAppUserToUser = (appUser: AppUser): User => {
  if (appUser.role === 'contractor') {
    const contractor: Contractor = {
      id: appUser.id,
      name: appUser.name,
      email: appUser.email,
      photo: appUser.photo,
      specialty: appUser.specialty || 'General Contractor',
      certifications: appUser.certifications || [],
      bio: appUser.bio || '',
      yearsExperience: appUser.yearsExperience || 0,
      connections: appUser.connections || [],
      posts: appUser.posts || [],
      portfolio: appUser.portfolio || [],
      availability: appUser.availability || {
        workingHours: { start: '09:00', end: '17:00' },
        workingDays: [1, 2, 3, 4, 5],
        meetingDuration: 30,
        bookedSlots: []
      },
      pendingMeetings: appUser.pendingMeetings || [],
      role: 'contractor',
      company: appUser.company,
      rating: appUser.rating || 0
    };
    return contractor;
  } else {
    const realtor: Realtor = {
      id: appUser.id,
      name: appUser.name,
      email: appUser.email,
      photo: appUser.photo,
      company: appUser.company,
      specialties: appUser.specialties || [],
      bio: appUser.bio || '',
      yearsExperience: appUser.yearsExperience || 0,
      connections: appUser.connections || [],
      role: 'realtor'
    };
    return realtor;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('feed');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleContractor, setScheduleContractor] = useState<Contractor | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [previousSection, setPreviousSection] = useState<ActiveSection>('feed');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isSwipeDisabled] = useState(false);
  const [contractorsData, setContractorsData] = useState<Contractor[]>(updatedContractors);
  const [tempUsers, setTempUsers] = useState<AppUser[]>([]);
  const [contractorPreferences, setContractorPreferences] = useState<{
    distance: number;
    specialty: string;
    experience: number;
  }>({
    distance: 50,
    specialty: 'All',
    experience: 5,
  });
  const [hasVisitedSwipe, setHasVisitedSwipe] = useState(false);
  const [hasSeenPreferences, setHasSeenPreferences] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const handleLogin = (userData: { id: string; role: 'realtor' | 'contractor'; username?: string; email?: string; password?: string }) => {
    if (userData.email && userData.password) {
      const baseUser: AppUser = {
        id: userData.id,
        role: userData.role,
        username: userData.username,
        email: userData.email,
        name: userData.username || 'New User',
        photo: '/default-avatar.png',
        company: 'New Company',
        connections: [],
        portfolio: [],
        posts: [],
        specialty: userData.role === 'contractor' ? 'General Contractor' : undefined,
        specialties: userData.role === 'realtor' ? [] : undefined,
        certifications: userData.role === 'contractor' ? [] : undefined,
        bio: '',
        yearsExperience: 0,
        pendingMeetings: [],
        rating: 0,
        availability: {
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: [1, 2, 3, 4, 5],
          meetingDuration: 30,
          bookedSlots: []
        }
      };
      setCurrentUser(baseUser);
      setIsAuthenticated(true);
      setHasSeenPreferences(false);
      return;
    }

    const predefinedUser = userData.role === 'realtor'
      ? realtors.find(r => r.id === userData.id)
      : contractorsData.find(c => c.id === userData.id);

    if (predefinedUser) {
      const connections = predefinedUser.connections?.map(c => typeof c === 'string' ? {
        id: c,
        userId: userData.id,
        connectionId: c,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        workHistory: {
          relationship: 'project-collaboration' as const
        }
      } : c) || [];
      const user: AppUser = {
        ...predefinedUser,
        username: userData.username,
        connections,
        photo: predefinedUser.photo || '/default-avatar.png',
        company: predefinedUser.company || 'New Company',
        specialty: userData.role === 'contractor' ? (predefinedUser as Contractor).specialty || 'General Contractor' : undefined,
        specialties: userData.role === 'realtor' ? (predefinedUser as Realtor).specialties || [] : undefined,
        portfolio: userData.role === 'contractor' ? (predefinedUser as Contractor).portfolio || [] : [],
        posts: userData.role === 'contractor' ? (predefinedUser as Contractor).posts || [] : [],
      };
      setCurrentUser(user);
      setIsAuthenticated(true);
      setHasSeenPreferences(false);
      return;
    }

    const tempUser = tempUsers.find(u => u.id === userData.id);
    if (tempUser) {
      const newUser: AppUser = {
        id: tempUser.id,
        role: tempUser.role,
        username: tempUser.username,
        email: tempUser.email,
        name: tempUser.username || 'New User',
        photo: '/default-avatar.png',
        company: 'New Company',
        connections: [],
        portfolio: [],
        posts: [],
        specialty: tempUser.role === 'contractor' ? 'General Contractor' : undefined,
        specialties: tempUser.role === 'realtor' ? [] : undefined,
        certifications: tempUser.role === 'contractor' ? [] : undefined,
        bio: '',
        yearsExperience: 0,
        pendingMeetings: [],
        rating: 0,
        availability: {
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: [1, 2, 3, 4, 5],
          meetingDuration: 30,
          bookedSlots: []
        }
      };
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setHasSeenPreferences(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveSection('feed');
  };

  const handleMessage = (user: User) => {
    if (user.role === 'contractor') {
      const contractor: Contractor = {
        ...user,
        certifications: user.certifications || [],
        bio: user.bio || '',
        yearsExperience: user.yearsExperience || 0,
        pendingMeetings: user.pendingMeetings || [],
        rating: user.rating || 0,
        connections: user.connections || [],
        posts: user.posts || [],
        portfolio: user.portfolio || [],
        availability: user.availability || {
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: [1, 2, 3, 4, 5],
          meetingDuration: 30,
          bookedSlots: []
        }
      };
      setSelectedContractor(contractor);
      setActiveSection('messages' as ActiveSection);
    }
  };

  const handleSchedule = (user: User) => {
    if (user.role === 'contractor') {
      const contractor: Contractor = {
        ...user,
        certifications: user.certifications || [],
        bio: user.bio || '',
        yearsExperience: user.yearsExperience || 0,
        pendingMeetings: user.pendingMeetings || [],
        rating: user.rating || 0,
        connections: user.connections || [],
        posts: user.posts || [],
        portfolio: user.portfolio || [],
        availability: user.availability || {
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: [1, 2, 3, 4, 5],
          meetingDuration: 30,
          bookedSlots: []
        }
      };
      setScheduleContractor(contractor);
      setShowSchedule(true);
    }
  };

  const handleScheduleMeeting = (slot: { date: string; startTime: string; endTime: string; realtorId: string; status: 'confirmed' }) => {
    if (scheduleContractor?.availability) {
      const updatedContractor: Contractor = {
        ...scheduleContractor,
        availability: {
          ...scheduleContractor.availability,
          bookedSlots: [
            ...scheduleContractor.availability.bookedSlots,
            { ...slot, notes: '' },
          ],
        }
      };
      setContractorsData(prev =>
        prev.map(c => (c.id === scheduleContractor.id ? updatedContractor : c))
      );
      if (currentUser?.id === scheduleContractor.id) {
        const updatedUser: AppUser = {
          ...currentUser,
          availability: updatedContractor.availability,
          pendingMeetings: updatedContractor.pendingMeetings,
          rating: updatedContractor.rating,
          specialty: updatedContractor.specialty,
          certifications: updatedContractor.certifications,
          bio: updatedContractor.bio,
          yearsExperience: updatedContractor.yearsExperience,
          connections: updatedContractor.connections,
          posts: updatedContractor.posts,
          portfolio: updatedContractor.portfolio
        };
        setCurrentUser(updatedUser);
      }
    }
    setShowSchedule(false);
    setScheduleContractor(null);
  };

  const handleViewProfile = (user: User, fromSection: ActiveSection) => {
    setViewingUser(user);
    setPreviousSection(fromSection);
    setActiveSection('viewProfile' as ActiveSection);
  };

  const handleBackFromProfile = () => {
    setActiveSection(previousSection);
    setViewingUser(null);
  };

  const handlePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleAddProject = (project: PortfolioItem) => {
    if (currentUser?.role === 'contractor') {
      const updatedContractor: Contractor = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        photo: currentUser.photo,
        specialty: currentUser.specialty || 'General Contractor',
        certifications: currentUser.certifications || [],
        bio: currentUser.bio || '',
        yearsExperience: currentUser.yearsExperience || 0,
        connections: currentUser.connections || [],
        posts: currentUser.posts || [],
        portfolio: [...currentUser.portfolio, project],
        availability: currentUser.availability || {
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: [1, 2, 3, 4, 5],
          meetingDuration: 30,
          bookedSlots: []
        },
        pendingMeetings: currentUser.pendingMeetings || [],
        role: 'contractor',
        company: currentUser.company,
        rating: currentUser.rating || 0
      };
      setContractorsData(prev =>
        prev.map(c => (c.id === currentUser.id ? updatedContractor : c))
      );
      const updatedUser: AppUser = {
        ...currentUser,
        portfolio: updatedContractor.portfolio
      };
      setCurrentUser(updatedUser);
    }
  };

  const handleConnect = (userId: string) => {
    console.log(`Sending connection request to ${userId}`);
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => {
      if (!isSwipeDisabled && currentProfileIndex < contractorsData.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      }
    },
    onSwipedDown: () => {
      if (!isSwipeDisabled && currentProfileIndex > 0) {
        setCurrentProfileIndex(prev => prev - 1);
      }
    },
    trackMouse: true,
    delta: 10,
  });

  const handlePreferencesChange = (preferences: {
    distance: number;
    specialty: string;
    experience: number;
  }): void => {
    setContractorPreferences(preferences);
    // For future implementation of contractor filtering
    console.log('Preferences updated:', contractorPreferences);
  };

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
    if (section === 'swipe' && !hasVisitedSwipe && currentUser?.role === 'realtor') {
      setHasVisitedSwipe(true);
    }
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginPage 
      onLogin={handleLogin} 
      tempUsers={tempUsers.map(user => ({
        id: user.id,
        username: user.username || '',
        email: user.email || '',
        password: user.password || '',
        role: user.role,
      }))} 
      setTempUsers={setTempUsers as React.Dispatch<React.SetStateAction<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: 'realtor' | 'contractor';
      }[]>>} 
    />;
  }

  const allUsers = [...contractorsData, ...realtors];
  const searchResults = searchQuery.trim() !== ''
    ? allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ('specialty' in user && user.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('specialties' in user && user.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];

  const specialties = [...new Set(contractorsData.map((contractor) => contractor.specialty))];

  const specialtyIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    "Kitchen Remodeling": Hammer as React.ComponentType<{ size?: number; className?: string }>,
    "Bathroom Remodeling": Wrench as React.ComponentType<{ size?: number; className?: string }>,
    "Custom Carpentry": Hammer as React.ComponentType<{ size?: number; className?: string }>,
    "Interior Design & Renovation": Sofa as React.ComponentType<{ size?: number; className?: string }>,
    "Outdoor Living Spaces": Trees as React.ComponentType<{ size?: number; className?: string }>,
  };

  const conversations: { userId: string; chats: { recipient: User; messages: Message[] }[] }[] = [
    {
      userId: 'r1',
      chats: [
        {
          recipient: contractorsData.find(c => c.id === 'c1')!,
          messages: [
            {
              id: 'm1',
              senderId: 'r1',
              content: 'Hi John, loved your recent kitchen project!',
              timestamp: '2024-03-10T13:00:00Z',
            },
            {
              id: 'm2',
              senderId: 'c1',
              content: 'Thanks, Emma! Let me know if you have any clients needing a remodel.',
              timestamp: '2024-03-10T13:15:00Z',
            },
          ],
        },
        {
          recipient: contractorsData.find(c => c.id === 'c2')!,
          messages: [
            {
              id: 'm3',
              senderId: 'r1',
              content: 'Hey Sarah, I have a client who needs plumbing work. Are you available?',
              timestamp: '2025-04-26T03:08:00Z',
            },
            {
              id: 'm4',
              senderId: 'c2',
              content: 'Hi Emma, yes I\'m available! Let\'s discuss the details.',
              timestamp: '2025-04-26T03:13:00Z',
            },
          ],
        },
      ],
    },
    {
      userId: 'c1',
      chats: [
        {
          recipient: realtors.find(r => r.id === 'r1')!,
          messages: [
            {
              id: 'm5',
              senderId: 'r1',
              content: 'Hi John, loved your recent kitchen project!',
              timestamp: '2024-03-10T13:00:00Z',
            },
            {
              id: 'm6',
              senderId: 'c1',
              content: 'Thanks, Emma! Let me know if you have any clients needing a remodel.',
              timestamp: '2024-03-10T13:15:00Z',
            },
            {
              id: 'm7',
              senderId: 'c1',
              content: 'I have some availability next week if you have any projects.',
              timestamp: '2024-03-11T09:00:00Z',
            },
          ],
        },
        {
          recipient: realtors.find(r => r.id === 'r2')!,
          messages: [
            {
              id: 'm8',
              senderId: 'c1',
              content: 'Hey Michael, I saw your post about investment properties. I\'d love to collaborate on a renovation!',
              timestamp: '2025-04-27T10:00:00Z',
            },
            {
              id: 'm9',
              senderId: 'r2',
              content: 'Hi John, that sounds great! Let\'s set up a meeting to discuss.',
              timestamp: '2025-04-27T10:30:00Z',
            },
          ],
        },
      ],
    },
  ];

  const userConversations = conversations.find(conv => conv.userId === currentUser.id)?.chats || [];

  const getUserPosts = (user: User) => {
    return posts.filter(post => post.userId === user.id);
  };

  const renderContractorCard = (contractor: Contractor) => {
    // Convert AppUser to User based on role
    const user: User = currentUser.role === 'contractor' 
      ? {
          ...currentUser,
          specialty: currentUser.specialty || 'General Contractor',
          certifications: currentUser.certifications || [],
          connections: currentUser.connections || [],
          posts: currentUser.posts || [],
          portfolio: currentUser.portfolio || [],
          availability: currentUser.availability || {
            workingHours: { start: '09:00', end: '17:00' },
            workingDays: [1, 2, 3, 4, 5],
            meetingDuration: 30,
            bookedSlots: []
          }
        } as Contractor
      : {
          ...currentUser,
          specialties: currentUser.specialties || [],
          connections: currentUser.connections || []
        } as User;

    return (
      <ContractorCard
        contractor={contractor}
        currentUser={user}
        onSchedule={() => handleSchedule(contractor)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative">
      {activeSection !== 'swipe' || currentUser.role === 'contractor' ? (
        <header className="bg-white shadow-sm sticky top-0 z-40 h-[56px]">
          <div className="px-4 py-4 flex justify-between items-center">
            {activeSection === 'messages' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSection('feed')}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-semibold">Messages</h1>
              </div>
            ) : activeSection === 'viewProfile' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackFromProfile}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-semibold">{viewingUser?.name}</h1>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-blue-500 font-poppins tracking-tight">
                ContractMatch
              </h1>
            )}
            <div className="flex items-center gap-4">
              {(activeSection === 'feed' || activeSection === 'network' || activeSection === 'profile' || activeSection === 'search' || activeSection === 'swipe' || activeSection === 'messages') && (
                <button
                  onClick={() => setActiveSection('messages' as ActiveSection)}
                  className={`p-2 rounded-full ${activeSection === 'messages' ? 'text-blue-500' : 'text-gray-600'} hover:text-gray-800`}
                >
                  <MessageSquare size={20} />
                </button>
              )}
            </div>
          </div>
        </header>
      ) : null}

      <main className={`${activeSection === 'swipe' && currentUser.role !== 'contractor' ? '' : 'pb-[65px]'}`}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {activeSection === 'feed' ? (
            <Feed
              currentUser={convertAppUserToUser(currentUser)}
              posts={posts}
              onViewProfile={(user) => handleViewProfile(user, 'feed' as ActiveSection)}
              onPost={handlePost}
              allUsers={allUsers}
              onConnect={handleConnect}
            />
          ) : activeSection === 'swipe' ? (
            currentUser.role === 'contractor' ? (
              <MeetingManagementPage
                currentUser={currentUser as Contractor}
                allUsers={allUsers}
              />
            ) : (
              <>
                <ContractorPreferences
                  onPreferencesChange={handlePreferencesChange}
                  specialties={specialties}
                  initialOpen={!hasSeenPreferences && activeSection === 'swipe'}
                  onClose={() => setHasSeenPreferences(true)}
                />
                <div 
                  {...swipeHandlers}
                  className="fixed left-0 right-0 top-0 bottom-[65px] overflow-hidden z-10"
                >
                  <div
                    className="h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateY(-${currentProfileIndex * 100}%)` }}
                  >
                    {contractorsData.map((contractor) => {
                      return (
                        <div
                          key={contractor.id}
                          className="h-full flex items-center justify-center"
                        >
                          {renderContractorCard(contractor)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )
          ) : activeSection === 'network' ? (
            <div className="flex-1">
              <NetworkSection
                currentUser={convertAppUserToUser(currentUser)}
                onViewProfile={(user) => handleViewProfile(user, 'network' as ActiveSection)}
              />
            </div>
          ) : activeSection === 'search' ? (
            <div className="space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for realtors or contractors..."
                className="w-full bg-gray-50 rounded-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewProfile(user, 'search' as ActiveSection)}
                    >
                      <img
                        src={user.photo || 'https://via.placeholder.com/40'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-600">
                          {user.role === 'contractor' ? user.specialty : user.company || 'Realtor'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-500 text-center">No results found. Explore by specialty:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {specialties.map((specialty) => {
                      const Icon = specialtyIcons[specialty] || Wrench;
                      return (
                        <button
                          key={specialty}
                          onClick={() => setSearchQuery(specialty)}
                          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <Icon size={24} className="text-blue-500 mb-2" />
                          <span className="text-sm text-gray-800 text-center">{specialty}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : activeSection === 'profile' ? (
            <ProfileSection
              currentUser={convertAppUserToUser(currentUser)}
              onLogout={handleLogout}
              posts={getUserPosts(convertAppUserToUser(currentUser))}
              allUsers={allUsers}
              onViewProfile={(user) => handleViewProfile(user, 'profile' as ActiveSection)}
              onAddProject={handleAddProject}
            />
          ) : activeSection === 'messages' ? (
            <div className="space-y-4">
              {userConversations.map((chat) => (
                <div
                  key={chat.recipient.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleMessage(chat.recipient)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={chat.recipient.photo || 'https://via.placeholder.com/40'}
                      alt={chat.recipient.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <h3 className="font-semibold text-gray-800">{chat.recipient.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {chat.messages.length > 0
                      ? getTimeSince(chat.messages[chat.messages.length - 1].timestamp)
                      : 'No messages'}
                  </span>
                </div>
              ))}
            </div>
          ) : activeSection === 'viewProfile' && viewingUser ? (
            <ProfileSection
              currentUser={convertAppUserToUser(currentUser)}
              viewingUser={viewingUser}
              onBack={handleBackFromProfile}
              posts={getUserPosts(viewingUser)}
              allUsers={allUsers}
              onViewProfile={(user) => handleViewProfile(user, 'viewProfile' as ActiveSection)}
              onAddProject={handleAddProject}
            />
          ) : null}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 h-[65px]">
        <div className="flex justify-around items-center h-full">
          <button
            onClick={() => setActiveSection('feed')}
            className={`p-2 rounded-full ${activeSection === 'feed' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => setActiveSection('search')}
            className={`p-2 rounded-full ${activeSection === 'search' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <Search size={24} />
          </button>
          <button
            onClick={() => handleSectionChange('swipe')}
            className={`p-2 rounded-full ${activeSection === 'swipe' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            {currentUser.role === 'contractor' ? <Calendar size={24} /> : <Heart size={24} />}
          </button>
          <button
            onClick={() => setActiveSection('network')}
            className={`p-2 rounded-full ${activeSection === 'network' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <Users size={24} />
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`p-2 rounded-full ${activeSection === 'profile' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <ProfileIcon size={24} />
          </button>
        </div>
      </nav>

      {selectedContractor && (
        <MessagingInterface
          currentUser={convertAppUserToUser(currentUser)}
          recipient={selectedContractor}
          onClose={() => setSelectedContractor(null)}
          onViewProfile={(user) => handleViewProfile(user, 'messages' as ActiveSection)}
          initialMessages={
            userConversations.find(chat => chat.recipient.id === selectedContractor.id)?.messages || []
          }
        />
      )}

      {showSchedule && scheduleContractor && (
        <div className="fixed inset-0 z-50">
          <ScheduleMeeting
            contractor={scheduleContractor}
            onClose={() => {
              setShowSchedule(false);
              setScheduleContractor(null);
            }}
            onSchedule={handleScheduleMeeting}
            currentUserId={currentUser.id}
          />
        </div>
      )}
    </div>
  );
}

export default App;