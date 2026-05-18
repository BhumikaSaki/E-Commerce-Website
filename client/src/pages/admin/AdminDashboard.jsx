import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import Pagination from '../../components/Pagination.jsx';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState({ paginatedData: [], currentPage: 1, totalPages: 1 });
  const [orders, setOrders] = useState({ paginatedData: [], currentPage: 1, totalPages: 1 });
  const [userPage, setUserPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users', { params: { page: userPage, limit: 8 } }),
          api.get('/admin/orders', { params: { page: orderPage, limit: 8 } }),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userPage, orderPage]);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats?.totalProducts, color: 'bg-brand-600' },
    { label: 'Total Orders', value: stats?.totalOrders, color: 'bg-amber-500' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, color: 'bg-violet-600' },
  ];

  return (
    <div className="page-container">
      <h1 className="mb-8 text-3xl font-bold">Admin dashboard</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card overflow-hidden">
            <div className={`h-1 ${c.color}`} />
            <div className="p-5">
              <p className="text-sm text-stone-500">{c.label}</p>
              <p className="mt-1 text-2xl font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats?.monthlyRevenue?.length > 0 && (
        <div className="card mb-10 p-6">
          <h2 className="mb-4 text-lg font-semibold">Monthly revenue</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Recent orders</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-stone-50">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">User</th>
                <th className="p-3">Total</th>
                <th className="p-3">Paid</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="p-3 font-mono text-xs">{o._id.slice(-8)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {o.user?.avatar && <img src={o.user.avatar} alt="" className="h-8 w-8 rounded-full" />}
                      {o.user?.name}
                    </div>
                  </td>
                  <td className="p-3">${o.totalPrice?.toFixed(2)}</td>
                  <td className="p-3">{o.isPaid ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Users</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-stone-50">
              <tr>
                <th className="p-3">Photo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.paginatedData.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="p-3">
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0f766e&color=fff`}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.isAdmin ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={users.currentPage}
          totalPages={users.totalPages}
          onPageChange={setUserPage}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">All orders</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-stone-50">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Total</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.paginatedData.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="p-3">
                    <Link to={`/order/${o._id}`} className="text-brand-700 hover:underline">
                      {o._id.slice(-8)}
                    </Link>
                  </td>
                  <td className="p-3">{o.user?.name || '—'}</td>
                  <td className="p-3">${o.totalPrice?.toFixed(2)}</td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={orders.currentPage}
          totalPages={orders.totalPages}
          onPageChange={setOrderPage}
        />
      </section>
    </div>
  );
}

export default AdminDashboard;
