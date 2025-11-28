import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/admin/reports/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold">📊 Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Total Revenue" value={`$${data.totalRevenue}`} />
        <Stat title="Total Orders" value={data.totalOrders} />
        <Stat title="Top Book" value={data.topBooks[0]?.title} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">📈 Sales Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.salesByMonth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">🔥 Top Selling Books</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topBooks}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sold" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
