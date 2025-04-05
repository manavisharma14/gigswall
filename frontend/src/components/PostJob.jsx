// PostJob.jsx
import React, { useState, useEffect } from 'react';
import { generateJobDescription } from '../geminiClient';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function PostJob() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    desc: '',
    budget: '',
    skills: '',
    timeline: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [descModal, setDescModal] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [application, setApplication] = useState({
    message: '',
    portfolio: '',
    availability: '',
  });

  // Fetch jobs on mount
  useEffect(() => {
    fetch('http://localhost:5001/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error('Error fetching jobs:', err));
  }, []);

  // Handle new job input changes
  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Submit new job
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
        // Successfully posted job
        setJobs([data, ...jobs]);
        // Clear fields
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

  return (
    <section
      id="postjobs"
      className="bg-white dark:bg-gray-900 py-20 px-4 pt-36 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Header section */}
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Latest Gigs
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            ➕ Create a Gig
          </button>
        </div>

        {/* Gig Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between min-h-[270px]"
            >
              {/* Title */}
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-3">
                {job.title}
              </h4>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {job.skills
                  ?.split(',')
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100
                                 text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>

              {/* Timeline & Budget */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  🕒 {job.timeline || 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  💰{' '}
                  <strong className="text-gray-800 dark:text-white">
                    ${job.budget}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex justify-between items-center">
                <button
                  onClick={() => setApplyModal(job)}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 text-sm"
                >
                  I'm Interested
                </button>

                {/* 
                  Purple-themed 'Know More' button in light mode,
                  subtle in dark mode 
                */}
                <button
                  onClick={() => setDescModal(job)}
                  className="
                    text-sm font-semibold
                    border border-purple-500
                    text-purple-600
                    px-3 py-1 rounded-lg
                    hover:bg-purple-500 hover:text-white
                    transition
                    dark:border-purple-400
                    dark:text-purple-400
                    dark:hover:bg-purple-500
                    dark:hover:text-white
                  "
                >
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE GIG MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl w-full max-w-3xl relative shadow-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-2xl text-gray-500"
              >
                &times;
              </button>
              <h3 className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mb-6">
                Post a New Gig
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['title', 'skills', 'timeline', 'budget'].map((field, i) => (
                  <input
                    key={i}
                    name={field}
                    value={newJob[field]}
                    onChange={handleChange}
                    placeholder={
                      field.charAt(0).toUpperCase() + field.slice(1)
                    }
                    className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    type={field === 'budget' ? 'number' : 'text'}
                    required
                  />
                ))}

                {/* Description + AI generation */}
                <div className="relative">
                  <textarea
                    name="desc"
                    value={newJob.desc}
                    onChange={handleChange}
                    placeholder="Job Description"
                    rows={8}
                    className="w-full px-4 py-3 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                  />
                  <div className="text-right mt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (
                          !newJob.title ||
                          !newJob.skills ||
                          !newJob.timeline
                        ) {
                          alert('Enter Title, Skills & Timeline first.');
                          return;
                        }
                        const desc = await generateJobDescription(
                          newJob.title,
                          newJob.skills,
                          newJob.timeline
                        );
                        setNewJob((prev) => ({ ...prev, desc }));
                      }}
                      className="text-sm bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                    >
                      ✨ Generate with AI
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DESCRIPTION MODAL */}
        {descModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xl relative overflow-y-auto max-h-[90vh] w-full max-w-2xl border border-purple-300 dark:border-purple-600">
              <button onClick={() => setDescModal(null)} className="absolute top-3 right-4 text-xl text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white">
                &times;
              </button>
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mb-1">📋 Job Description</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{descModal.title}</p>
                </div>
                <hr className="border-purple-200 dark:border-purple-500" />
                <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none text-left leading-relaxed text-black dark:text-white"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(descModal.desc || '')),
                  }}
                />
              </div>
            </div>
          </div>
        )}


        {/* APPLY MODAL */}
        {applyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 max-w-md w-full p-6 rounded-2xl shadow-xl relative">
              <button
                onClick={() => setApplyModal(null)}
                className="absolute top-3 right-4 text-xl text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Apply for:{' '}
                <span className="text-yellow-600 dark:text-yellow-400">
                  {applyModal.title}
                </span>
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem('token');
                  try {
                    const res = await fetch(
                      `http://localhost:5001/api/jobs/${applyModal._id}/apply`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(application),
                      }
                    );
                    const data = await res.json();
                    if (res.ok) {
                      alert('✅ Application submitted!');
                      setApplyModal(null);
                      setApplication({
                        message: '',
                        portfolio: '',
                        availability: '',
                      });
                    } else {
                      alert(data.message || '❌ Failed to apply');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Server error');
                  }
                }}
                className="space-y-3"
              >
                <textarea
                  name="message"
                  value={application.message}
                  onChange={(e) =>
                    setApplication({
                      ...application,
                      message: e.target.value,
                    })
                  }
                  placeholder="Why are you a good fit?"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                  required
                />
                <input
                  name="portfolio"
                  value={application.portfolio}
                  onChange={(e) =>
                    setApplication({
                      ...application,
                      portfolio: e.target.value,
                    })
                  }
                  placeholder="Portfolio or LinkedIn"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                  required
                />
                <input
                  name="availability"
                  value={application.availability}
                  onChange={(e) =>
                    setApplication({
                      ...application,
                      availability: e.target.value,
                    })
                  }
                  placeholder="Availability (e.g. Weekends)"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-800"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PostJob;
