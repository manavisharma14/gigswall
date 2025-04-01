import React, { useEffect, useState } from 'react';

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/jobs/applied', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error fetching applied jobs:', err));
  }, []);

  return (
    <section className="py-20 px-4 pt-36 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          My Applied Jobs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <p className="text-center w-full text-gray-500 dark:text-gray-400 col-span-full">
              You haven't applied to any jobs yet.
            </p>
          ) : (
            jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <h4 className="font-bold text-lg text-yellow-600 dark:text-yellow-300">{job.title}</h4>
                <p className="text-gray-700 dark:text-gray-300">{job.desc}</p>
                <p className="text-green-600 dark:text-green-400 font-semibold">💰 ${job.budget}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default AppliedJobs;
