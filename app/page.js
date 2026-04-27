import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Search } from 'lucide-react';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const category = params?.category;

  const whereClause = { deletedAt: null };
  if (category) {
    whereClause.category = category;
  }

  const news = await prisma.news.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  const topStory = news.length > 0 ? news[0] : null;
  const latestStories = news.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breaking News Ticker */}
      <div className="bg-[#cc0000] text-white px-4 py-2 flex items-center font-bold text-sm uppercase mb-8 shadow-md">
        <span className="mr-2 animate-pulse">●</span> BREAKING NEWS: Important updates happening right now across the globe.
      </div>

      <div>
        {/* Main Content Area */}
        <div className="w-full">
          {topStory ? (
            <div className="mb-12 group">
              <Link href={`/news/${topStory.slug}`}>
                <div className="relative w-full h-[60vh] mb-4 overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={topStory.imageUrl} alt={topStory.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                    <span className="bg-[#cc0000] text-xs font-bold px-2 py-1 uppercase tracking-wider mb-3 inline-block">{topStory.category}</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{topStory.title}</h1>
                    <p className="mt-4 text-gray-300 text-lg max-w-3xl line-clamp-2">{topStory.content}</p>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <p className="text-gray-500 py-12 text-center border-2 border-dashed rounded">No news available. Add some from the admin dashboard.</p>
          )}

          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-6 uppercase text-[#001d38]">Latest Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestStories.map(story => (
              <div key={story.id} className="group">
                <Link href={`/news/${story.slug}`}>
                  <div className="relative h-48 mb-3 overflow-hidden rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.imageUrl} alt={story.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
                  </div>
                  <span className="text-[#cc0000] text-xs font-bold uppercase tracking-wider">{story.category}</span>
                  <h3 className="text-xl font-bold mt-1 group-hover:text-[#cc0000] transition line-clamp-3 leading-snug text-[#001d38]">
                    {story.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-2 font-semibold">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
