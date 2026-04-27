"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminTrash() {
  const [trashedNews, setTrashedNews] = useState([]);

  const fetchTrashedNews = async () => {
    // We need an API route for fetching trashed news or we can filter in the GET /api/news if we update it.
    // Let's assume we create a separate GET or just use a query param.
    // Actually, I should create a specific route for trash or update the GET route to accept ?trash=true.
    const res = await fetch('/api/news/trash');
    if (res.ok) {
      const data = await res.json();
      setTrashedNews(data);
    }
  };

  useEffect(() => {
    fetchTrashedNews();
  }, []);

  const handleRestore = async (id) => {
    await fetch(`/api/news/${id}/restore`, { method: 'PATCH' });
    fetchTrashedNews();
  };

  const handleHardDelete = async (id) => {
    if (confirm('WARNING: This will permanently delete the item. Are you sure?')) {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      fetchTrashedNews();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#001d38]">Trash Bin</h1>
        <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">Deleted At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trashedNews.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{new Date(item.deletedAt).toLocaleDateString()}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleRestore(item.id)} className="text-green-600 hover:underline">Restore</button>
                    <button onClick={() => handleHardDelete(item.id)} className="text-red-600 hover:underline">Delete Forever</button>
                  </td>
                </tr>
              ))}
              {trashedNews.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">Trash is empty.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
