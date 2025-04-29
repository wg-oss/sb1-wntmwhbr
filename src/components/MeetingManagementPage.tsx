import React, { useState } from 'react';
import { User, Contractor, MeetingRequest, BookedSlot } from '../types';
import { ChevronRight, X } from 'lucide-react';

interface MeetingManagementPageProps {
  currentUser: Contractor;
  allUsers: User[];
}

interface MeetingDetails {
  date: string;
  startTime: string;
  endTime: string;
  realtorId: string;
  status: 'pending' | 'accepted' | 'declined' | 'confirmed';
  notes: string;
  id?: string; // For pending meetings
}

const MeetingManagementPage: React.FC<MeetingManagementPageProps> = ({ currentUser, allUsers }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'schedule'>('upcoming');
  const [pendingMeetings, setPendingMeetings] = useState<MeetingRequest[]>(currentUser.pendingMeetings || []);
  const [upcomingMeetings, setUpcomingMeetings] = useState<BookedSlot[]>(currentUser.availability.bookedSlots || []);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetails | null>(null);

  const handleAcceptMeeting = (meetingId: string) => {
    const meeting = pendingMeetings.find(m => m.id === meetingId);
    if (!meeting) return;

    // Update the pending meeting status to accepted
    const updatedPending = pendingMeetings.filter(m => m.id !== meetingId);
    setPendingMeetings(updatedPending);

    // Add to upcoming meetings (bookedSlots)
    const newBookedSlot: BookedSlot = {
      date: meeting.date,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      realtorId: meeting.realtorId,
      status: 'confirmed',
      notes: meeting.notes,
    };
    setUpcomingMeetings([...upcomingMeetings, newBookedSlot]);
    setSelectedMeeting(null); // Close the popup
  };

  const handleDeclineMeeting = (meetingId: string) => {
    const updatedPending = pendingMeetings.map(m =>
      m.id === meetingId ? { ...m, status: 'declined' as const } : m
    );
    setPendingMeetings(updatedPending);
    setSelectedMeeting(null); // Close the popup
  };

  const handleUpdateNotes = (
    meetingId: string,
    newNotes: string,
    type: 'pending' | 'upcoming'
  ) => {
    if (type === 'pending') {
      const updatedPending = pendingMeetings.map(m =>
        m.id === meetingId ? { ...m, notes: newNotes } : m
      );
      setPendingMeetings(updatedPending);
      if (selectedMeeting && selectedMeeting.id === meetingId) {
        setSelectedMeeting({ ...selectedMeeting, notes: newNotes });
      }
    } else {
      const updatedUpcoming = upcomingMeetings.map(m =>
        m.date === meetingId ? { ...m, notes: newNotes } : m
      );
      setUpcomingMeetings(updatedUpcoming);
      if (selectedMeeting && `${selectedMeeting.date}-${selectedMeeting.startTime}` === meetingId) {
        setSelectedMeeting({ ...selectedMeeting, notes: newNotes });
      }
    }
  };

  const getRealtorName = (realtorId: string) => {
    const realtor = allUsers.find(user => user.id === realtorId);
    return realtor ? realtor.name : 'Unknown';
  };

  const simplifyDateTime = (date: string, startTime: string) => {
    const dateObj = new Date(date);
    const timeParts = startTime.split(':');
    dateObj.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
    return dateObj.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const formatDateTime = (date: string, startTime: string) => {
    const dateObj = new Date(date);
    const timeParts = startTime.split(':');
    dateObj.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  // Combine and sort all meetings for the Schedule tab
  const allMeetings = [
    ...pendingMeetings.map(m => ({
      date: m.date,
      startTime: m.startTime,
      endTime: m.endTime,
      realtorId: m.realtorId,
      status: m.status,
      notes: m.notes,
      id: m.id,
    })),
    ...upcomingMeetings.map(m => ({
      date: m.date,
      startTime: m.startTime,
      endTime: m.endTime,
      realtorId: m.realtorId,
      status: m.status,
      notes: m.notes,
    })),
  ].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    dateA.setHours(timeA[0], timeA[1]);
    dateB.setHours(timeB[0], timeB[1]);
    return dateA.getTime() - dateB.getTime();
  });

  const openMeetingDetails = (meeting: MeetingDetails) => {
    setSelectedMeeting(meeting);
  };

  const closeMeetingDetails = () => {
    setSelectedMeeting(null);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-4 text-center font-semibold ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 text-center font-semibold ${
            activeTab === 'pending'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-2 px-4 text-center font-semibold ${
            activeTab === 'schedule'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Schedule
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'upcoming' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Meetings</h2>
          {upcomingMeetings.length === 0 ? (
            <p className="text-gray-500">No upcoming meetings.</p>
          ) : (
            upcomingMeetings.map(meeting => (
              <div
                key={`${meeting.date}-${meeting.startTime}`}
                onClick={() => openMeetingDetails(meeting)}
                className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {getRealtorName(meeting.realtorId)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {simplifyDateTime(meeting.date, meeting.startTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-500">Confirmed</span>
                  <ChevronRight size={20} className="text-gray-500" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Meeting Requests</h2>
          {pendingMeetings.length === 0 ? (
            <p className="text-gray-500">No pending meeting requests.</p>
          ) : (
            pendingMeetings.map(meeting => (
              <div
                key={meeting.id}
                onClick={() => openMeetingDetails({ ...meeting, id: meeting.id })}
                className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {getRealtorName(meeting.realtorId)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {simplifyDateTime(meeting.date, meeting.startTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      meeting.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                    }`}
                  >
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </span>
                  <ChevronRight size={20} className="text-gray-500" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
          {allMeetings.length === 0 ? (
            <p className="text-gray-500">No meetings scheduled.</p>
          ) : (
            allMeetings.map(meeting => (
              <div
                key={`${meeting.date}-${meeting.startTime}`}
                onClick={() => openMeetingDetails(meeting)}
                className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {getRealtorName(meeting.realtorId)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {simplifyDateTime(meeting.date, meeting.startTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      meeting.status === 'confirmed'
                        ? 'text-green-500'
                        : meeting.status === 'pending'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </span>
                  <ChevronRight size={20} className="text-gray-500" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Popup for Meeting Details */}
      {selectedMeeting && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeMeetingDetails}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Meeting with {getRealtorName(selectedMeeting.realtorId)}
              </h3>
              <button onClick={closeMeetingDetails} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Date & Time:</strong>{' '}
              {formatDateTime(selectedMeeting.date, selectedMeeting.startTime)} - {selectedMeeting.endTime}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Status:</strong>{' '}
              {selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
            </p>
            {activeTab !== 'schedule' ? (
              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-1">
                  <strong>Notes:</strong>
                </label>
                <textarea
                  value={selectedMeeting.notes}
                  onChange={(e) =>
                    handleUpdateNotes(
                      selectedMeeting.id || `${selectedMeeting.date}-${selectedMeeting.startTime}`,
                      e.target.value,
                      activeTab === 'pending' ? 'pending' : 'upcoming'
                    )
                  }
                  placeholder="Add notes for this meeting..."
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            ) : (
              selectedMeeting.notes && (
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Notes:</strong> {selectedMeeting.notes}
                </p>
              )
            )}
            {activeTab === 'pending' && selectedMeeting.status === 'pending' && selectedMeeting.id && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAcceptMeeting(selectedMeeting.id!)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeclineMeeting(selectedMeeting.id!)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingManagementPage;