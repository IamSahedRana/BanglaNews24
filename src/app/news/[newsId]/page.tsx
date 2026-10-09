import { notFound } from "next/navigation";
import Image from "next/image";

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

const extractText = (content: ArticleContent): string => {
  if (!content) return "";
  if (typeof content === "string") return content;
  
  if (content.blocks && Array.isArray(content.blocks)) {
    return content.blocks
      .map((block: ContentBlock) => block.data?.text || block.text || "")
      .join("\n"); 
  }
  
  return ""; 
};

// Helper to precisely match the "৯ অক্টোবর, ২০২৬ এ ২:০৯ AM" layout
const formatBengaliDateTime = (isoString?: string | null) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  
  // Format the Date part
  const bnDate = date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Get English Time (e.g., "2:09 AM")
  const enTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  // Convert just the numbers in the time to Bengali digits to match your screenshot
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const bnTime = enTime.replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
  
  return `${bnDate} এ ${bnTime}`;
};

const NewsDetails = async ({ params }: { params: { newsId: string } }) => {
  const { newsId } = await params;

  const res = await fetch(`https://news-api-v2.vercel.app/api/article/${newsId}`, {
    next: { revalidate: 60 } 
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const news = data.data;

  if (!news) {
    notFound();
  }

  const safeText = extractText(news.text);
  const safeDescription = extractText(news.summary) || extractText(news.description);

  const paragraphs = safeText.split('\n').filter((p: string) => p.trim() !== '');
  const wordCount = safeText.split(/\s+/).filter(Boolean).length;
  
  // Changed to use `firstPublished` from the API based on your instructions
  const publishDateStr = news.firstPublished || news.publishedAt;
  const formattedDate = formatBengaliDateTime(publishDateStr);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        <h1 className="text-3xl md:text-[40px] font-bold text-gray-900 leading-snug mb-4">
          {news.title}
        </h1>

        {safeDescription && (
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
            {safeDescription}
          </p>
        )}

        {/* Date and Word Count perfectly matching the reference image layout */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 my-6 border-y border-gray-200 py-3">
          {news.author && <span>{news.author}</span>}
          
          <div className="flex items-center gap-3">
            {formattedDate && <span>{formattedDate}</span>}
            <span>{wordCount} শব্দ</span>
          </div>
        </div>

        {(news.image || news.imageUrl) && (
          <div className="mb-10 bg-gray-50 pb-3 rounded-b-lg">
            <div className="relative w-full h-[300px] md:h-[500px]">
              <Image
                src={news.image || news.imageUrl}
                alt={news.title}
                fill
                unoptimized
                className="object-cover bg-gray-100"
              />
            </div>
            <p className="text-center text-gray-500 text-sm mt-3 px-2">
              {news.caption || "সংগৃহীত ছবি"}
            </p>
          </div>
        )}

        <article className="text-gray-800 space-y-6">
          {paragraphs.length > 0 ? (
            paragraphs.map((para: string, index: number) => (
              <p 
                key={index} 
                className="text-lg md:text-xl leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))
          ) : (
            <p className="text-lg md:text-xl leading-relaxed text-justify">
              {safeText}
            </p>
          )}
        </article>

      </main>
    </div>
  );
};

export default NewsDetails;