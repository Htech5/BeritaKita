import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CommentSection from './CommentSection';

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  
  const article = await prisma.news.findUnique({
    where: { slug }
  });

  if (!article || article.deletedAt) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <span className="text-[#cc0000] font-bold text-sm tracking-wider uppercase mb-2 block">
          {article.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#001d38] leading-tight mb-4">
          {article.title}
        </h1>
        <div className="text-gray-500 font-semibold text-sm mb-6 pb-6 border-b border-gray-200">
          Published {new Date(article.createdAt).toLocaleString()}
          {article.createdBy && (
            <span className="ml-4 pl-4 border-l border-gray-300">
              Created by: {article.createdBy}
            </span>
          )}
        </div>
      </div>

      <div className="mb-10 relative w-full h-[50vh] rounded overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.imageUrl} alt={article.title} className="object-cover w-full h-full" />
      </div>

      <div className="prose max-w-none text-lg leading-relaxed text-gray-800 mb-16 space-y-6">
        {article.content.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <div className="border-t-4 border-[#001d38] pt-8 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-[#001d38]">Conversation</h2>
        <CommentSection newsId={article.id} />
      </div>
    </div>
  );
}
