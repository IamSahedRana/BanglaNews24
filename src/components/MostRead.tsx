import Link from "next/link";

interface MostReadNews {
  id: string;
  title: string;
}

const MostRead = async () => {
  const res = await fetch("https://news-api-v2.vercel.app/api/news/most-read", {
    next: { revalidate: 60 } // Optional: caches the most read list for 60 seconds
  });
  const data = await res.json();

  const news: MostReadNews[] = data.data;

  return (
    <div className="card p-4 bg-base-100 border border-gray-300">
      <h1 className="font-bold text-red-700 mb-4 border-b pb-2">সর্বাধিক পঠিত</h1>

      <div className="grid gap-4">
        {news.map((n, i) => (
          <Link href={`/news/${n.id}`} key={n.id} className="block group">
            <div className="flex gap-3 items-start">
              {/* Number indicator */}
              <p className="text-2xl font-bold text-red-600 leading-none mt-1">
                {i + 1}
              </p>
              {/* Headline with hover effect */}
              <h2 className="font-medium text-gray-800 group-hover:text-red-600 transition-colors duration-200">
                {n.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MostRead;