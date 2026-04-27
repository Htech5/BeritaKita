"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '', category: 'THINK' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchNews = async () => {
    const res = await fetch('/api/news');
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await fetch(`/api/news/${editId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsEditing(false);
      setEditId(null);
    } else {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    setFormData({ title: '', content: '', imageUrl: '', category: 'THINK' });
    fetchNews();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (res.ok) {
        setFormData({ ...formData, imageUrl: json.url });
      } else {
        alert(json.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ title: item.title, content: item.content, imageUrl: item.imageUrl, category: item.category });
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleTrash = async (id) => {
    if (confirm('Are you sure you want to move this to trash?')) {
      await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trash' }),
      });
      fetchNews();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#001d38]">Admin Dashboard</h1>
        <div className="space-x-4">
          <Link href="/admin/trash" className="text-gray-600 hover:underline">Trash Bin</Link>
          <Link href="/" className="text-blue-600 hover:underline">View Site</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit News' : 'Create News'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border p-2 rounded">
                <option value="THINK">THINK</option>
                <option value="HEALTH">HEALTH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded" disabled={isUploading} />
              {isUploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
              {formData.imageUrl && !isUploading && (
                <div className="mt-2">
                  <p className="text-xs text-green-600 mb-1">Image uploaded successfully (or loaded)</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.imageUrl} alt="Preview" className="h-24 object-cover rounded" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border p-2 rounded h-32" required />
            </div>
            <button type="submit" className="w-full bg-[#001d38] text-white p-2 rounded hover:bg-blue-900 transition">
              {isEditing ? 'Update' : 'Create'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', content: '', imageUrl: '', category: 'THINK' }); }} className="w-full mt-2 bg-gray-300 p-2 rounded hover:bg-gray-400 transition">
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Active News</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Created By</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.title}</td>
                    <td className="p-2">{item.category}</td>
                    <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">{item.createdBy || '-'}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleTrash(item.id)} className="text-red-600 hover:underline">Trash</button>
                    </td>
                  </tr>
                ))}
                {news.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No active news found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
