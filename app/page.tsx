// app/page.tsx

'use client';
import Header from "@/components/Header";
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define types for the Jikan API response
interface AnimeImage {
  jpg: {
    image_url: string;
    large_image_url: string;
    small_image_url: string;
  }
}

interface AnimeGenre {
  mal_id: number;
  name: string;
  type: string;
  url: string;
}

interface Anime {
  mal_id: number;
  title: string;
  url: string;
  images: AnimeImage;
  score: number;
  type: string;
  episodes: number | null;
  genres: AnimeGenre[];
  season: string;
  year: number;
  status: string;
}

interface JikanResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    }
  }
}

export default function AnimePage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    hasNextPage: boolean;
    totalItems: number;
    itemsPerPage: number;
  }>({
    totalPages: 1,
    hasNextPage: false,
    totalItems: 0,
    itemsPerPage: 24
  });

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setIsLoading(true);
        // Added sfw=true parameter to filter out adult content
        const response = await fetch(`https://api.jikan.moe/v4/seasons/now?page=${currentPage}&limit=24&sfw=true&continuing=false`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data: JikanResponse = await response.json();
        
        // Remove duplicate entries based on mal_id
        const uniqueAnime = removeDuplicates(data.data, 'mal_id');
        
        setAnimeList(uniqueAnime);
        setPagination({
          totalPages: data.pagination.last_visible_page,
          hasNextPage: data.pagination.has_next_page,
          totalItems: data.pagination.items.total,
          itemsPerPage: data.pagination.items.per_page
        });
      } catch (err) {
        console.error('Error fetching anime data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Function to remove duplicates from an array based on a key
  const removeDuplicates = (array: any[], key: string) => {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (

    <div className="container mx-auto py-8 px-4">
    <Header />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Current Anime Season</h1>
        
        {/* Pagination Controls - Top */}
        {!isLoading && !error && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-sm px-4">
              {currentPage} / {pagination.totalPages}
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNextPage} 
              disabled={!pagination.hasNextPage}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <div className="h-64 bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading anime data: {error}</p>
          <p className="mt-2 text-sm">
            The Jikan API has rate limits. Please try refreshing in a moment.
          </p>
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animeList.map((anime, index) => (
              <Card key={`${anime.mal_id}-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64 w-full">
                  <img 
                    src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardContent className="p-4">
                    <a href={anime.url} target="_blank" rel="noopener noreferrer">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-1">{anime.title}</h2>
                    </a>
                  <div className="flex items-center mb-3 text-sm">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{anime.score ? anime.score.toFixed(1) : 'N/A'}</span>
                    <span className="mx-2">•</span>
                    <span>{anime.type || 'Unknown'}</span>
                    {anime.episodes && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{anime.episodes} eps</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {anime.genres.slice(0, 3).map(genre => (
                      <Badge key={`${anime.mal_id}-${genre.mal_id}`} variant="secondary" className="text-xs">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination Controls - Bottom */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {animeList.length} of {pagination.totalItems} anime
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePreviousPage} 
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm px-4">
                {currentPage} / {pagination.totalPages}
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleNextPage} 
                disabled={!pagination.hasNextPage}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}