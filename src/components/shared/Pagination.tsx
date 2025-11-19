
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const pageLimit = isMobile ? 1 : 2; // Show fewer pages on mobile
    const totalButtons = pageLimit * 2 + 3; // 1 (current) + 2*pageLimit + 2 (first/last)

    if (totalPages <= totalButtons) {
      // Show all pages if there aren't too many
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex case with ellipses
      pages.push(1); // Always show first page

      if (currentPage > pageLimit + 2) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - pageLimit);
      const end = Math.min(totalPages - 1, currentPage + pageLimit);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - (pageLimit + 1)) {
        pages.push('...');
      }

      pages.push(totalPages); // Always show last page
    }
    
    // Remove duplicate ellipses
    return pages.filter((page, index) => page !== '...' || pages[index - 1] !== '...');
  };

  const pages = getPageNumbers();

  return (
    <div className={cn("mt-12 flex justify-center items-center flex-wrap gap-1 sm:gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="rounded-full text-black"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => onPageChange(page)}
            className={cn("rounded-full h-9 w-9 sm:h-10 sm:w-10", currentPage === page ? '' : 'text-black')}
          >
            {page}
          </Button>
        ) : (
          <span key={`ellipsis-${index}`} className="px-1 sm:px-2 py-2 text-black">
            ...
          </span>
        )
      )}
       <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-full text-black"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
