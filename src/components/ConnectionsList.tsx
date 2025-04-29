import React from 'react';
import { User, Connection } from '../types';
import { UserCheck, Clock, Building2 } from 'lucide-react';

interface ConnectionsListProps {
  connections: Connection[];
  users: User[];
  onAcceptConnection?: (connectionId: string) => void;
  onUserClick?: (user: User) => void;
}

const ConnectionsList: React.FC<ConnectionsListProps> = ({
  connections,
  users,
  onAcceptConnection,
  onUserClick
}) => {
  const getUser = (userId: string) => users.find(user => user.id === userId);

  return (
    <div className="space-y-4">
      {connections.map((connection) => {
        const connectedUser = getUser(connection.connectionId);
        if (!connectedUser) return null;

        return (
          <div
            key={connection.id}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onUserClick?.(connectedUser)}
          >
            <div className="flex items-center gap-4">
              <img
                src={connectedUser.photo}
                alt={connectedUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{connectedUser.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 size={14} />
                  <span>{connectedUser.company}</span>
                </div>
                {connection.workHistory && (
                  <p className="text-sm text-gray-500 mt-1">
                    {connection.workHistory.relationship === 'colleague' ? 'Colleague at ' : 'Worked together at '}
                    {connection.workHistory.companyName}
                  </p>
                )}
              </div>
              {connection.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-500" />
                  {onAcceptConnection && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptConnection(connection.id);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                    >
                      Accept
                    </button>
                  )}
                </div>
              ) : (
                <UserCheck size={16} className="text-green-500" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectionsList;