import Image from "next/image";
import Link from "next/link";

interface ContentBlock {
  text?: string;
  data?: {
    text?: string;
  };
}

interface RichTextContent {
  blocks?: ContentBlock[];
}

type ArticleContent = string | RichTextContent | null | undefined;

interface News {
  id: string;
  title: string;
  description: ArticleContent; 
  category: string;
  imageUrl: string;
  imageAlt: string;
  firstPublished?: string; // Included from list API
}

const extractText = (content: ArticleContent): string => {
  if (!content) return "";
  if (typeof content === "string") return content;
  
  if (content.blocks && Array.isArray(content.blocks)) {
    return content.blocks
      .map((block: ContentBlock) => block.data?.text || block.text || "")
      .join(" "); 
  }
  
  return ""; 
};

// Formatter to perfectly match the detail page
const formatBengaliDateTime = (isoString?: string | null) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  const bnDate = date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
  const enTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const bnTime = enTime.replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
  
  return `${bnDate} এ ${bnTime}`;
};

const MainNews = ({ news }: { news: News[] }) => {
  if (!news || news.length === 0) return null;

  const [firstNews, ...otherNews] = news;

  // Process data for the large featured news card
  const firstNewsText = extractText(firstNews.description);
  const firstNewsWordCount = firstNewsText.split(/\s+/).filter(Boolean).length;
  const firstNewsDate = formatBengaliDateTime(firstNews.firstPublished);

  return (
    <div className="flex gap-2">
      
      {/* Featured Large News Card */}
      <Link href={`/news/${firstNews.id}`}>
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <Image
              height={600}
              width={600}
              src={firstNews.imageUrl}
              alt={firstNews.imageAlt || "News Image"}
              unoptimized
            />
          </figure>
          <div className="card-body">
            <p className="text-red-600 font-semibold">{firstNews.category}</p>
            <h2 className="card-title">{firstNews.title}</h2>
            
            {/* Meta layout identical to detail page */}
            <div className="flex items-center gap-3 text-xs text-gray-500 my-1">
              {firstNewsDate && <span>{firstNewsDate}</span>}
              {firstNewsWordCount > 0 && <span>{firstNewsWordCount} শব্দ</span>}
            </div>

            <p className="line-clamp-3 mt-2">{firstNewsText}</p>
          </div>
        </div>
      </Link>

      {/* Grid of Smaller News Cards */}
      <div className="grid gap-2">
        {otherNews.slice(0, 4).map((on) => {
          // Process data for each smaller news card
          const onText = extractText(on.description);
          const onWordCount = onText.split(/\s+/).filter(Boolean).length;
          const onDate = formatBengaliDateTime(on.firstPublished);

          return (
            <Link href={`/news/${on.id}`} key={on.id} className="block">
              <div className="card bg-base-100 border border-gray-300 p-5 h-full hover:bg-gray-50 transition-colors">
                <p className="text-red-600 font-semibold mb-1">{on.category}</p>
                <div className="font-medium text-lg leading-snug">{on.title}</div>
                
                {/* Meta layout identical to detail page */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                  {onDate && <span>{onDate}</span>}
                  {onWordCount > 0 && <span>{onWordCount} শব্দ</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
    </div>
  );
};

export default MainNews;