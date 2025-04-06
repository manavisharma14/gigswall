// Profile.jsx with Socket.io chat trigger
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Chat from './Chat';

function Profile() {
  const url = "https://peergigbe.onrender.com";
  const [user, setUser] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState([]);
  const socket = io(url); // Connect socket

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(url + '/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching profile:', err));

    fetch(url + '/api/jobs/applied', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAppliedJobs(data))
      .catch((err) => console.error('Error fetching applied jobs:', err));

    fetch(url + '/api/jobs/posted/responses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPostedJobs(data))
      .catch((err) => console.error('Error fetching posted job responses:', err));

    return () => socket.disconnect();
  }, []);

  const toggleExpand = (id) => {
    setExpandedJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (jobId, userId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(url + `/api/jobs/${jobId}/applications/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedJobsRes = await fetch(url + '/api/jobs/posted/responses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedJobs = await updatedJobsRes.json();
        setPostedJobs(updatedJobs);

        if (newStatus === 'Accepted') {
          socket.emit('gig-accepted', { jobId, userId });
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const getAvatarUrl = (gender = 'other', email = '') => {
    const maleImages = ['/avatars/male1.png', '/avatars/male2.png', '/avatars/male3.png'];
    const femaleImages = ['/avatars/female1.png', '/avatars/female2.png', '/avatars/female3.png'];
    const defaultImages = ['/avatars/male1.png', '/avatars/female1.png'];

    const pickFrom =
      gender === 'female' ? femaleImages : gender === 'male' ? maleImages : defaultImages;

    const hash = Array.from(email).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return pickFrom[hash % pickFrom.length];
  };

  return (
    <section className="min-h-screen pt-36 pb-20 px-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition duration-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/2 w-full flex flex-col items-center md:items-start text-center md:text-left">
            {user ? (
              <>
                <img
                  src={getAvatarUrl(user.gender, user.email)}
                  alt="Avatar"
                  className="w-52 h-52 rounded-full mb-6 object-cover shadow-xl"
                />
                <h2 className="text-4xl font-extrabold">{user.name}</h2>
                <p className="text-lg mt-1">{user.email}</p>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
                  🎓 Department: {user.department}
                </p>
                <p className="text-sm text-gray-400 italic mt-1">
                  Pronouns: {user.gender === 'male' ? 'he/him' : user.gender === 'female' ? 'she/her' : 'they/them'}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          <div className="md:w-1/2 w-full">
            <h2 className="text-2xl font-bold mb-6">Applied gigs</h2>
            <div className="space-y-6">
              {appliedJobs.length > 0 ? (
                appliedJobs.map((job) => {
                  const applicant = job.applicants?.find(app => app.user === user?._id);
                  const isAccepted = applicant?.status === 'Accepted';
                  return (
                    <div
                      key={job._id}
                      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition hover:shadow-lg"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300">🛠️ Skills:</span>
                        {job.skills?.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        💰 <span className="font-medium">Budget:</span> ${job.budget}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        📌 <strong>Status:</strong> {applicant?.status || 'Pending'}
                      </p>
                      {isAccepted && (
                        <div className="mt-4">
                          <Chat jobId={job._id} senderId={user._id} receiverId={job.createdBy} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">You haven’t applied to any jobs yet.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6"> Gigs you've Posted & responses</h2>
          {postedJobs.length > 0 ? (
            postedJobs.map((job) => (
              <div key={job._id} className="bg-white dark:bg-gray-800 p-6 mb-8 rounded-xl shadow-lg border dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">📝 {job.title}</h3>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">💰 Budget: ${job.budget}</p>
                  </div>
                  <button
                    onClick={() => toggleExpand(job._id)}
                    className="text-sm px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 dark:bg-indigo-700 dark:text-white dark:hover:bg-indigo-600"
                  >
                    {expandedJobs.includes(job._id) ? 'Hide Applicants' : `View Applicants (${job.applicants.length})`}
                  </button>
                </div>

                {expandedJobs.includes(job._id) && (
                  <div className="mt-6">
                    {job.applicants.length > 0 ? (
                      <div className="grid gap-4">
                        {job.applicants.map((app, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <p><strong>Name:</strong> {app.user?.name}</p>
                            <p><strong>Email:</strong> {app.user?.email}</p>
                            <p><strong>Department:</strong> {app.user?.department}</p>
                            <p><strong>Message:</strong> {app.message}</p>
                            <p><strong>Portfolio:</strong> <a href={app.portfolio} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{app.portfolio}</a></p>
                            <p><strong>Availability:</strong> {app.availability}</p>
                            <p><strong>Status:</strong> {app.status || 'Pending'}</p>
                            {app.status === 'Accepted' && user && (
                              <div className="mt-4">
                                <Chat jobId={job._id} senderId={user._id} receiverId={app.user._id} />
                              </div>
                            )}
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleStatusChange(job._id, app.user._id, 'Accepted')}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${app.status === 'Accepted' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                              >
                                Accepted
                              </button>
                              <button
                                onClick={() => handleStatusChange(job._id, app.user._id, 'Rejected')}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${app.status === 'Rejected' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                              >
                                Rejected
                              </button>
                              <button
                                onClick={() => handleStatusChange(job._id, app.user._id, 'Pending')}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${app.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                              >
                                Pending
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No applicants yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">You haven’t posted any jobs yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
