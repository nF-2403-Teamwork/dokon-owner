import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTilt } from '../hooks/useTilt';
import { Button } from '../components/Button';

const GRID_DOTS = Array.from({ length: 48 }, (_, i) => (i * 7 + 3) % 11 < 3);

export function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const tilt = useTilt();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminLogin(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral text-neutral-content lg:flex-row">
      <div className="relative flex flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:w-1/2 lg:px-16 lg:py-12">
        <div className="brand-blob -left-20 -top-24 h-72 w-72 opacity-25" />
        <div className="brand-blob -bottom-28 right-0 h-80 w-80 opacity-25" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-field font-brand text-lg"
            style={{ backgroundImage: 'var(--gradient-brand)', color: 'var(--color-primary-content)' }}
          >
            D
          </div>
          <span className="font-brand text-2xl text-gradient-brand">Do'kon</span>
        </div>

        <div className="relative z-10 my-12 max-w-sm lg:my-0">
          <div className="mb-7 grid grid-cols-8 gap-2.5">
            {GRID_DOTS.map((active, i) => (
              <span
                key={i}
                className="animate-pulse-dot h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                style={{
                  '--i': i,
                  backgroundColor: active ? 'hsl(var(--primary-h) 90% 60%)' : 'currentColor',
                  opacity: active ? 1 : 0.12,
                  boxShadow: active ? '0 0 10px hsl(var(--primary-h) 90% 60% / 0.7)' : 'none',
                }}
              />
            ))}
          </div>

          <h2 className="font-heading text-2xl font-semibold leading-tight sm:text-3xl">
            Barcha do'konlar —{' '}
            <span className="text-gradient-brand">bir nazarda</span>.
          </h2>
          <p className="mt-3 text-sm text-neutral-content/55">
            Obunalar, filiallar va faollikni yagona markazdan boshqaring.
          </p>
        </div>

        <p className="relative z-10 hidden text-xs text-neutral-content/30 lg:block">
          © {new Date().getFullYear()} Do'kon
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-base-100 px-6 py-10 text-base-content sm:px-10">
        <form
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          onSubmit={handleSubmit}
          className="tilt-card w-full max-w-sm animate-scale-in"
        >
          <h1 className="mb-1 font-heading text-2xl font-semibold">Super Admin</h1>
          <p className="mb-7 text-sm text-base-content/50">Boshqaruv markaziga kirish uchun maʼlumotlaringizni kiriting.</p>

          <label className="mb-3 block animate-fade-up" style={{ '--i': 1 }}>
            <span className="mb-1 block text-sm text-base-content/60">Login</span>
            <input
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </label>

          <label className="mb-4 block animate-fade-up" style={{ '--i': 2 }}>
            <span className="mb-1 block text-sm text-base-content/60">Parol</span>
            <input
              className="input input-bordered w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="mb-3 text-sm text-error">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Kirilmoqda...' : 'Kirish'}
          </Button>
        </form>
      </div>
    </div>
  );
}
