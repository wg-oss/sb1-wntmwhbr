import React, { useState } from 'react';
import { Users, UserPlus, MessageSquare } from 'lucide-react';
import { Connection, User } from '../types';
import { realtors, contractors } from '../data/users';

interface NetworkSectionProps {
  currentUser: User;
  onViewProfile: (user: User) => void;
}

const NetworkSection: React.FC<NetworkSectionProps> = ({ currentUser, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState<'connections' | 'suggestions' | 'company'>('connections');
  const allUsers = [...realtors, ...contractors];

  // Suggestions: Users not connected to currentUser
  const suggestions = allUsers.filter(
    (user) =>
      user.id !== currentUser.id &&
      !currentUser.connections.some((conn) => conn.connectionId === user.id),
  );

  // Company: Users from the same company as currentUser (excluding currentUser)
  const companyUsers = allUsers.filter(
    (user) =>
      user.id !== currentUser.id &&
      user.company &&
      currentUser.company &&
      user.company.toLowerCase() === currentUser.company.toLowerCase(),
  );

  const getMutualConnections = (user: User) => {
    return user.connections
      .filter((conn) => conn.status === 'accepted')
      .filter((conn) =>
        currentUser.connections.some(
          (userConn) =>
            userConn.status === 'accepted' && userConn.connectionId === conn.connectionId,
        ),
      );
  };

  const handleConnect = (userId: string) => {
    console.log(`Sending connection request to ${userId}`);
  };

  const handleMessage = (userId: string) => {
    console.log(`Opening message with ${userId}`);
  };

  const renderUserCard = (user: User, showConnectButton: boolean = false, showMessageButton: boolean = false) => {
    const isConnected = currentUser.connections.some(
      (conn) => conn.connectionId === user.id && conn.status === 'accepted',
    );

    return (
      <div
        key={user.id}
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onViewProfile(user)}
      >
        <div className="flex items-center gap-4">
          <img
            src={user.photo}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{user.company || user.specialty}</span>
            </div>
            {showConnectButton && !isConnected && (
              <p className="text-sm text-blue-500 mt-1">
                {getMutualConnections(user).length} mutual connection
                {getMutualConnections(user).length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {showConnectButton && !isConnected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleConnect(user.id);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
            >
              <UserPlus size={14} />
              Connect
            </button>
          )}
          {showMessageButton && isConnected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMessage(user.id);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
            >
              <MessageSquare size={14} />
              Message
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderConnection = (conn: Connection) => {
    const user = allUsers.find((u) => u.id === conn.connectionId);
    if (!user) return null;

    return (
      <div
        key={conn.id}
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onViewProfile(user)}
      >
        <div className="flex items-center gap-4">
          <img
            src={user.photo}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{user.company || user.specialty}</span>
            </div>
          </div>
          {conn.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Accepting connection ${conn.id}`);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
            >
              Accept
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="text-blue-500" />
          <h2 className="text-lg font-semibold">Network</h2>
        </div>
        <div className="text-sm text-gray-600">
          {currentUser.connections.filter((c) => c.status === 'accepted').length} connections
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap">
        <button
          className={`px-2 py-2 rounded-lg text-sm sm:px-4 sm:text-base ${
            activeTab === 'connections'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('connections')}
        >
          Connections
        </button>
        <button
          className={`px-2 py-2 rounded-lg text-sm sm:px-4 sm:text-base ${
            activeTab === 'suggestions'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggested
        </button>
        <button
          className={`px-2 py-2 rounded-lg text-sm sm:px-4 sm:text-base ${
            activeTab === 'company'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('company')}
        >
          Company
        </button>
      </div>

      {activeTab === 'connections' ? (
        <div className="space-y-4">
          {currentUser.connections
            .filter((conn) => conn.status === 'accepted' || conn.status === 'pending')
            .map((conn) => renderConnection(conn))}
        </div>
      ) : activeTab === 'suggestions' ? (
        <div className="space-y-4">
          {suggestions.map((user) =>
            renderUserCard(user, true, false)
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentUser.company || 'No Company Set'}
          </h3>
          {companyUsers.length > 0 ? (
            companyUsers.map((user) =>
              renderUserCard(user, true, true)
            )
          ) : (
            <div className="space-y-4">
              {renderUserCard(currentUser, false, false)}
              <p className="text-gray-500 text-center">
                You’re the only one from {currentUser.company || 'your company'} here so far.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkSection;