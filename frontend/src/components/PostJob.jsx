// PostJob.jsx
import React, { useState, useEffect } from 'react';

function PostJob() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', desc: '', budget: '', skills: '', timeline: '' });
  const [showModal, setShowModal] = useState(false);
  const [applyModal, setApplyModal] = useState(null);
  const [application, setApplication] = useState({
    message: '',
    portfolio: '',
    availability: ''
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error('Error fetching jobs:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleAppChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5001/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });

      const data = await res.json();
      if (res.ok) {
        setJobs([data, ...jobs]);
        setNewJob({ title: '', desc: '', budget: '', skills: '', timeline: '' });
        setShowModal(false);
      } else {
        alert(data.message || 'Failed to post job');
      }
    } catch (err) {
      console.error('Post job error:', err);
      alert('Server error while posting job');
    }
  };

  const handleApply = (job) => {
    setApplyModal(job);
  };

  const submitApplication = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${applyModal._id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(application)
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Application sent!');
        setApplyModal(null);
        setApplication({ message: '', portfolio: '', availability: '' });
      } else {
        alert(data.message || 'Could not apply');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <section id="postjobs" className="bg-white dark:bg-gray-900 py-20 px-4 pt-36 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Latest Gigs</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg border border-gray-600 hover:bg-gray-800 transition-all"
          >
            ➕ Create a Gig
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative shadow-xl transition-colors duration-300">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-500 dark:text-gray-300 text-xl font-bold hover:text-gray-800 dark:hover:text-white"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-yellow-600 dark:text-yellow-400">Post a New Gig</h3>
              <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={newJob.title} onChange={handleChange} placeholder="Job Title"
                  className="w-full mb-3 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
                <textarea name="desc" value={newJob.desc} onChange={handleChange} placeholder="Description"
                  className="w-full mb-3 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
                <input type="text" name="skills" value={newJob.skills} onChange={handleChange} placeholder="Required Skills"
                  className="w-full mb-3 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" />
                <input type="text" name="timeline" value={newJob.timeline} onChange={handleChange} placeholder="Timeline (e.g., 1 week)"
                  className="w-full mb-3 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" />
                <input type="number" name="budget" value={newJob.budget} onChange={handleChange} placeholder="Budget"
                  className="w-full mb-4 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
                <button type="submit" className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-black-600 transition">
                  Post
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {jobs.map((job, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition duration-200">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{job.title}</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{job.desc}</p>
              {job.skills && <p className="text-sm text-gray-500 dark:text-gray-400">Skills: {job.skills}</p>}
              {job.timeline && <p className="text-sm text-gray-500 dark:text-gray-400">Timeline: {job.timeline}</p>}
              <p className="text-gray-600 dark:text-gray-200 font-semibold"> ${job.budget}</p>
              <button
                onClick={() => handleApply(job)}
                className="mt-3 bg-slate-700 text-white px-4 py-1 rounded hover:bg-slate-800 text-sm"
              >
                I'm Interested
              </button>
            </div>
          ))}
        </div>

        {applyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative shadow-xl">
              <button
                onClick={() => setApplyModal(null)}
                className="absolute top-2 right-3 text-gray-500 dark:text-gray-300 text-xl font-bold hover:text-gray-800 dark:hover:text-white"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Apply for: {applyModal.title}
              </h3>
              <textarea name="message" value={application.message} onChange={handleAppChange} placeholder="Why are you a good fit?"
                className="w-full mb-3 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
              <input name="portfolio" value={application.portfolio} onChange={handleAppChange} placeholder="Portfolio or LinkedIn"
                className="w-full mb-3 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
              <input name="availability" value={application.availability} onChange={handleAppChange} placeholder="Availability (e.g. weekends)"
                className="w-full mb-4 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" />
              <button onClick={submitApplication} className="w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-800">
                Submit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PostJob;