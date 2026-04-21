import React, { useState } from 'react';

const STORAGE_KEY = 'nomis-auth';
const USER = 'nomis';
const PASS = 'nomis';

function isAuthorized(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function setAuthorized(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(isAuthorized);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (ok) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === USER && password === PASS) {
      setAuthorized();
      setOk(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ons-bg p-6">
      <div className="w-full max-w-sm rounded-lg border border-ons-border bg-white p-8 shadow-md">
        <h1 className="text-xl font-semibold text-ons-text mb-1">Nomis PoC</h1>
        <p className="text-sm text-ons-text/80 mb-6">Sign in to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nomis-user" className="block text-sm font-medium text-ons-text mb-1">
              Username
            </label>
            <input
              id="nomis-user"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              className="w-full rounded border border-ons-border px-3 py-2 text-ons-text focus:outline-none focus:ring-2 focus:ring-ons-link"
            />
          </div>
          <div>
            <label htmlFor="nomis-pass" className="block text-sm font-medium text-ons-text mb-1">
              Password
            </label>
            <input
              id="nomis-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full rounded border border-ons-border px-3 py-2 text-ons-text focus:outline-none focus:ring-2 focus:ring-ons-link"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              Invalid username or password.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded bg-ons-blue py-2.5 text-sm font-medium text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ons-link focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
