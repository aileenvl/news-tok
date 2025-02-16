import { useState, useEffect, useCallback } from 'react';
import { Content } from '@/types/content';
import { OramaClient } from '@oramacloud/client';

interface FacetConfig {
  order?: 'DESC' | 'ASC';
  limit?: number;
  offset?: number;
}

interface FacetValue {
  values: Record<string, number>;
}

interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface OramaDocument {
  id: string;
  title: string;
  content: string;
  date: string;
  source: string;
  url: string;
  upvotes: number;
}

// Transform Orama document to our Content type
function transformToContent(doc: OramaDocument): Content {
  return {
    id: doc.id,
    title: doc.title,
    summary: doc.content.slice(0, 200) + '...', // Take first 200 chars as summary
    imageUrl: '/placeholder.svg?height=600&width=600', // Default placeholder for now
    author: {
      username: `@${doc.source.toLowerCase().replace(/\s+/g, '_')}`,
    },
    date: doc.date,
    likes: doc.upvotes,
    comments: 0, // Default since we don't have this data
    isBookmarked: false // Default since we don't have this data
  };
}

// Type guard to check if a document matches OramaDocument interface
function isOramaDocument(doc: unknown): doc is OramaDocument {
  const isValid = typeof doc === 'object' &&
    doc !== null &&
    typeof (doc as any).id === 'string' &&
    typeof (doc as any).title === 'string' &&
    typeof (doc as any).content === 'string' &&
    typeof (doc as any).date === 'string' &&
    typeof (doc as any).source === 'string' &&
    typeof (doc as any).url === 'string' &&
    typeof (doc as any).upvotes === 'number';

  if (!isValid) {
    console.log('Invalid Orama document:', doc);
  }
  return isValid;
}

const client = new OramaClient({
  endpoint: 'https://cloud.orama.run/v1/indexes/ai-agent-mufnf3',
  api_key: process.env.NEXT_PUBLIC_ORAMA_API_KEY || ''
});

export function useSearch({ query = '', page = 1, limit = 10 }: SearchParams = {}) {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const searchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchTerm = query?.trim() || '';
      const offset = (page - 1) * limit;

      console.log('Search params:', { searchTerm, page, limit, offset });

      const result = await client.search({
        term: searchTerm,
        limit,
        offset,
        mode: 'fulltext' as const,
      });

      console.log('Search result hits:', result.hits.length);
      
      if (!result || !Array.isArray(result.hits)) {
        throw new Error('Invalid response format from search');
      }

      const validContent = result.hits
        .map(hit => hit.document as unknown)
        .filter(isOramaDocument)
        .map(transformToContent);

      console.log('Valid content items:', validContent.length);

      const total = typeof result.count === 'number' ? result.count : 0;

      setContent(validContent);
      setTotalCount(total);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search content. Please try again.');
      setTotalCount(0);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [query, page, limit]);

  useEffect(() => {
    const timeoutId = setTimeout(searchContent, 300);
    return () => clearTimeout(timeoutId);
  }, [searchContent]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    content,
    loading,
    error,
    totalCount,
    currentPage: page,
    totalPages,
  };
}
