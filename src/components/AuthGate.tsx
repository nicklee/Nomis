import { useState, type FormEvent, type ReactNode } from 'react';

const STORAGE_KEY = 'nomis-authenticated';
const EXPECTED_USER = 'nomis';
const EXPECTED_PASS = 'nomis';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (user === EXPECTED_USER && pass === EXPECTED_PASS) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore quota / private mode */
      }
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-ons-bg">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-ons-border bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-ons-text mb-1">Sign in</h1>
        <p className="text-sm text-ons-text/70 mb-6">Enter your credentials to continue.</p>

        <label className="block text-sm font-medium text-ons-text mb-1">Username</label>
        <input
          name="username"
          autoComplete="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full rounded border border-ons-border px-3 py-2 mb-4 text-ons-text focus:outline-none focus:ring-2 focus:ring-ons-link/40"
        />

        <label className="block text-sm font-medium text-ons-text mb-1">Password</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full rounded border border-ons-border px-3 py-2 mb-4 text-ons-text focus:outline-none focus:ring-2 focus:ring-ons-link/40"
        />

        {error ? (
          <p className="text-sm text-red-700 mb-4" role="alert">
            Incorrect username or password.
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded bg-ons-link py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
