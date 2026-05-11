"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  LayoutList,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  Search,
} from "lucide-react";

export default function AdminDashboard() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "THINK",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");

      if (!res.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch news error:", error);
      setNews([]);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const res = await fetch(`/api/news/${editId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error("Failed to update article");
        }

        setIsEditing(false);
        setEditId(null);
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error("Failed to publish article");
        }
      }

      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        category: "THINK",
      });

      fetchNews();
    } catch (error) {
      console.error("Submit error:", error);
      alert(error.message || "Failed to save article");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: json.url,
        }));
      } else {
        alert(json.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      category: item.category || "THINK",
    });

    setIsEditing(true);
    setEditId(item.id);
  };

  const handleTrash = async (id) => {
    if (!id) return;

    if (confirm("Are you sure you want to move this to trash?")) {
      try {
        const res = await fetch(`/api/news/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "trash",
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to move article to trash");
        }

        fetchNews();
      } catch (error) {
        console.error("Trash error:", error);
        alert(error.message || "Failed to move article to trash");
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      category: "THINK",
    });
  };

  const filteredNews = news.filter((item) => {
    const keyword = searchQuery.toLowerCase();

    const matchSearch =
      item.title?.toLowerCase().includes(keyword) ||
      item.content?.toLowerCase().includes(keyword) ||
      item.category?.toLowerCase().includes(keyword) ||
      item.createdBy?.toLowerCase().includes(keyword);

    const matchCategory =
      categoryFilter === "ALL" || item.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  const thinkCount = news.filter((n) => n.category === "THINK").length;
  const healthCount = news.filter((n) => n.category === "HEALTH").length;
  const uniqueAuthors = new Set(news.map((n) => n.createdBy).filter(Boolean))
    .size;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              NewsAdmin<span className="text-[#cc0000]">OS</span>
            </h1>
          </div>

          <div className="flex items-center space-x-5">
            <Link
              href="/"
              className="text-gray-500 hover:text-[#cc0000] transition flex items-center text-sm font-medium"
            >
              <Eye className="w-5 h-5 mr-1" />
              View Site
            </Link>

            <Link
              href="/admin/trash"
              className="text-gray-500 hover:text-red-600 transition flex items-center text-sm font-medium"
            >
              <Trash2 className="w-5 h-5 mr-1" />
              Trash
            </Link>

            <div className="h-6 w-px bg-gray-200" />

            <div className="w-9 h-9 bg-[#cc0000] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:bg-[#a30000] transition">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => setCategoryFilter("ALL")}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-t-4 p-6 transition-transform hover:-translate-y-1 duration-300 cursor-pointer ${
              categoryFilter === "ALL"
                ? "border-t-[#cc0000] ring-2 ring-[#cc0000]/20"
                : "border-t-[#001d38]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#cc0000]" />
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {news.length}
              </h3>
              <p className="text-gray-800 font-semibold mt-1">
                Total Articles
              </p>
              <p className="text-gray-400 text-sm mt-1">All time</p>
            </div>
          </div>

          <div
            onClick={() => setCategoryFilter("THINK")}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-t-4 p-6 transition-transform hover:-translate-y-1 duration-300 cursor-pointer ${
              categoryFilter === "THINK"
                ? "border-t-[#cc0000] ring-2 ring-[#cc0000]/20"
                : "border-t-[#001d38]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <LayoutList className="w-6 h-6 text-[#001d38]" />
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {thinkCount}
              </h3>
              <p className="text-gray-800 font-semibold mt-1">
                Think Category
              </p>
              <p className="text-gray-400 text-sm mt-1">articles published</p>
            </div>
          </div>

          <div
            onClick={() => setCategoryFilter("HEALTH")}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-t-4 p-6 transition-transform hover:-translate-y-1 duration-300 cursor-pointer ${
              categoryFilter === "HEALTH"
                ? "border-t-[#cc0000] ring-2 ring-[#cc0000]/20"
                : "border-t-[#001d38]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <LayoutList className="w-6 h-6 text-[#001d38]" />
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {healthCount}
              </h3>
              <p className="text-gray-800 font-semibold mt-1">
                Health Category
              </p>
              <p className="text-gray-400 text-sm mt-1">articles published</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-[#001d38] p-6 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#001d38]" />
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {uniqueAuthors || 1}
              </h3>
              <p className="text-gray-800 font-semibold mt-1">
                Active Authors
              </p>
              <p className="text-gray-400 text-sm mt-1">
                contributing writers
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-gray-50 text-[#cc0000] flex items-center justify-center mr-3">
                  <Edit className="w-4 h-4" />
                </span>
                {isEditing ? "Edit Article" : "Compose Article"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Article Title
                  </label>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#001d38]/20 focus:border-[#001d38] transition-all text-sm"
                    placeholder="Enter engaging title..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category
                    </label>

                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#001d38]/20 focus:border-[#001d38] transition-all text-sm bg-white"
                    >
                      <option value="THINK">THINK</option>
                      <option value="HEALTH">HEALTH</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Status
                    </label>

                    <select className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#001d38]/20 focus:border-[#001d38] transition-all text-sm bg-white">
                      <option>Published</option>
                      <option>Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Cover Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#001d38]/20 focus:border-[#001d38] transition-all text-sm bg-white"
                    disabled={isUploading}
                  />

                  {isUploading && (
                    <p className="text-sm text-[#cc0000] font-medium mt-2">
                      Uploading image...
                    </p>
                  )}

                  {formData.imageUrl && !isUploading && (
                    <div className="mt-3">
                      <p className="text-xs text-green-600 mb-1">
                        Image uploaded successfully
                      </p>

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Article Content
                  </label>

                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#001d38]/20 focus:border-[#001d38] transition-all text-sm h-40 resize-none"
                    placeholder="Write your article content here..."
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#cc0000] text-white font-semibold py-3 rounded-xl hover:bg-[#a30000] focus:ring-4 focus:ring-[#001d38]/20 transition-all shadow-md hover:shadow-lg"
                  >
                    {isEditing ? "Save Changes" : "Publish Article"}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full mt-3 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Articles
                  </h2>

                  <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-72">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#001d38]/20 focus:border-[#001d38] transition-all text-sm"
                      />
                    </div>

                    {categoryFilter !== "ALL" && (
                      <button
                        onClick={() => setCategoryFilter("ALL")}
                        className="text-sm font-semibold text-[#cc0000] hover:underline"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Showing:{" "}
                  <span className="font-semibold text-gray-800">
                    {categoryFilter === "ALL"
                      ? "All Articles"
                      : `${categoryFilter} Articles`}
                  </span>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Article Info
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredNews.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/80 transition group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {item.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover mr-3 border border-gray-100"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 mr-3 flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}

                            <div>
                              <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {item.title}
                              </div>

                              <div className="text-xs text-gray-500 mt-0.5">
                                ID: #{item.id?.substring(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.category === "THINK"
                                ? "bg-gray-50 text-[#001d38]"
                                : "bg-gray-50 text-[#cc0000]"
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 font-medium">
                            {item.createdBy || "System Admin"}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-[#001d38] bg-gray-50 hover:bg-gray-200 rounded-lg transition"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleTrash(item.id)}
                              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredNews.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <FileText className="w-12 h-12 mb-3 text-gray-300" />

                            <p className="text-base font-medium text-gray-900">
                              {searchQuery
                                ? "No matching articles found"
                                : "No articles found"}
                            </p>

                            <p className="text-sm mt-1">
                              {searchQuery
                                ? "Try searching with another keyword."
                                : "Get started by creating a new article."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
