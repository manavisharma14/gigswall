import React, { useState } from 'react';

function Login({ closeModal, switchToRegister, onLoginSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setSuccessMsg('🎉 Yay! You are now logged in.');
        setTimeout(() => {
          onLoginSuccess(); // Close modal and redirect
        }, 1500);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-800 dark:text-white"
      >
        {successMsg && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-lg shadow-lg animate-bounce">
            {successMsg}
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-300">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
