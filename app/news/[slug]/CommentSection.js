"use client";
import { useState, useEffect } from 'react';

export default function CommentSection({ newsId }) {
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?newsId=${newsId}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsId, userName, commentText }),
    });
    setUserName('');
    setCommentText('');
    fetchComments();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded border border-gray-200 shadow-sm">
        <h3 className="font-bold mb-4 text-[#001d38]">Add a Comment</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:border-[#cc0000] transition"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="What are your thoughts?"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full border p-3 rounded h-24 focus:outline-none focus:border-[#cc0000] transition"
            required
          />
        </div>
        <button type="submit" className="bg-[#cc0000] text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
          Post Comment
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="font-bold text-[#001d38]">{comment.userName}</h4>
              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-700">{comment.commentText}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>}
      </div>
    </div>
  );
}
