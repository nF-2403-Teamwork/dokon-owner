import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createMarket, listMarkets, renewMarket, updateMarket } from '../api/admin.api';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../auth/AuthContext';
import { PLAN_PRICES } from '../data/plans';

const PAGE_SIZE = 10;

function planLabel(plan) {
  return plan === 'pro' ? 'Pro' : "Oddiy";
}

function statusOf(market) {
  if (!market.active) return { tone: 'neutral', label: "O'chirilgan" };
  const daysLeft = (new Date(market.subscriptionExpiresAt) - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysLeft < 0) return { tone: 'danger', label: 'Muddati tugagan' };
  if (daysLeft < 5) return { tone: 'warning', label: `${Math.ceil(daysLeft)} kun qoldi` };
  return { tone: 'success', label: 'Faol' };
}

export function AdminMarketsPage() {
  const { logout } = useAuth();
  const [markets, setMarkets] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);
  const [newPlan, setNewPlan] = useState('starter');

  function reload() {
    setLoading(true);
    listMarkets({ page, limit: PAGE_SIZE })
      .then((data) => {
        setMarkets(data.markets);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }

  useEffect(reload, [page]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.target);
    const payload = {
      name: form.get('name'),
      slug: form.get('slug'),
      months: Number(form.get('months') || 1),
      plan: newPlan,
      ownerName: form.get('ownerName'),
      ownerUsername: form.get('ownerUsername'),
      ownerPassword: form.get('ownerPassword'),
    };
    try {
      const res = await createMarket(payload);
      setCreated({ slug: res.market.slug, username: res.owner.username, password: payload.ownerPassword });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRenew(market) {
    await renewMarket(market._id, 1);
    reload();
  }

  async function handleToggleActive(market) {
    await updateMarket(market._id, { active: !market.active });
    reload();
  }

  return (
    <div className="min-h-screen bg-brand-radial p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Do'konlar"
          subtitle="Obunalar va do'kon kodlarini boshqarish"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" onClick={logout}>
                Chiqish
              </Button>
              <Button onClick={() => { setCreating(true); setCreated(null); setError(''); setNewPlan('starter'); }}>
                + Yangi do'kon
              </Button>
            </div>
          }
        />

        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Kod</th>
                <th>Reja</th>
                <th>Holat</th>
                <th>Obuna tugaydi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => {
                const status = statusOf(m);
                return (
                  <tr key={m._id} className="animate-fade-up" style={{ '--i': i }}>
                    <td className="font-medium">
                      <Link to={`/markets/${m._id}`} className="hover:text-primary hover:underline">
                        {m.name}
                      </Link>
                    </td>
                    <td className="font-mono text-sm text-base-content/70">{m.slug}</td>
                    <td>
                      <Badge tone={m.plan === 'pro' ? 'primary' : 'neutral'}>{planLabel(m.plan)}</Badge>
                    </td>
                    <td>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </td>
                    <td className="text-base-content/70">
                      {new Date(m.subscriptionExpiresAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <button className="btn btn-ghost btn-sm" onClick={() => handleRenew(m)}>
                        +1 oy uzaytirish
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggleActive(m)}>
                        {m.active ? "O'chirish" : 'Yoqish'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && markets.length === 0 && (
            <div className="py-10 text-center text-base-content/50">Hali do'kon yo'q.</div>
          )}
          <Pagination page={page} limit={PAGE_SIZE} total={total} onChange={setPage} />
        </div>
      </div>

      {creating && (
        <Modal title="Yangi do'kon yaratish" onClose={() => setCreating(false)}>
          {created ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm">
                Do'kon yaratildi. Egasi quyidagi maʼlumotlar bilan kiradi:
              </p>
              <div className="rounded-field bg-base-200 p-3 font-mono text-sm">
                <div>Kod: {created.slug}</div>
                <div>Login: {created.username}</div>
                <div>Parol: {created.password}</div>
              </div>
              <p className="text-xs text-base-content/50">
                Parol faqat shu yerda ko'rsatiladi — qayta ko'rish imkoni yo'q, egasiga hoziroq yuboring.
              </p>
              <div className="mt-2 flex justify-end">
                <Button onClick={() => setCreating(false)}>Yopish</Button>
              </div>
            </div>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={handleCreate}>
              <label className="block">
                <span className="mb-1 block text-sm text-base-content/60">Do'kon nomi</span>
                <input className="input input-bordered w-full" name="name" required autoFocus />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-base-content/60">
                  Do'kon kodi <span className="text-base-content/40">(login uchun, masalan: aziz)</span>
                </span>
                <input className="input input-bordered w-full" name="slug" required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-base-content/60">Obuna muddati (oy)</span>
                <input className="input input-bordered w-full" name="months" type="number" min="1" defaultValue={1} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-base-content/60">Reja</span>
                <div className="join w-full">
                  <button
                    type="button"
                    className={`btn join-item flex-1 ${newPlan === 'starter' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setNewPlan('starter')}
                  >
                    Oddiy — {PLAN_PRICES.starter.toLocaleString()} so'm/oy
                  </button>
                  <button
                    type="button"
                    className={`btn join-item flex-1 ${newPlan === 'pro' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setNewPlan('pro')}
                  >
                    Pro — {PLAN_PRICES.pro.toLocaleString()} so'm/oy
                  </button>
                </div>
              </label>
              <div className="divider my-0">Do'kon egasi</div>
              <label className="block">
                <span className="mb-1 block text-sm text-base-content/60">Ism</span>
                <input className="input input-bordered w-full" name="ownerName" required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-base-content/60">Login</span>
                <input className="input input-bordered w-full" name="ownerUsername" required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-base-content/60">Parol</span>
                <input className="input input-bordered w-full" name="ownerPassword" type="password" required />
              </label>
              {error && <p className="text-sm text-error">{error}</p>}
              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setCreating(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit">Yaratish</Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
