// src/components/Login.jsx
import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function Login({ closeModal }) {
  const [form, setForm] = useState({ email: '', password: '' });

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
        alert('Login successful!');
        window.location.reload();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      localStorage.setItem('token', token);
      alert('Google login successful!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Google login failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-24 bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-800 dark:text-white"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-300">Login</h2>

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

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        🔐 Sign in with Google
      </button>
    </form>
  );
}

export default Login;