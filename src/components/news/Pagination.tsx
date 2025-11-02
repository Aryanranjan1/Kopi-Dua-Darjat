
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPagesToShow?: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxPagesToShow = 5 
}: PaginationProps) {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const getPageNumbers = () => {
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const half = Math.floor(maxPagesToShow / 2);
    
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);

    if (end - start < maxPagesToShow - 1) {
        start = Math.max(end - maxPagesToShow + 1, 1);
    }
    
    if (start > 1) {
        pages.push(1);
        if (start > 2) {
            pages.push('...');
        }
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < totalPages) {
        if (end < totalPages - 1) {
            pages.push('...');
        }
        pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePrevious = () => {
    if (canGoBack) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={!canGoBack}
        className="rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={index}
            variant={page === currentPage ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
            className="rounded-full"
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="flex items-center justify-center w-9 h-9">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        )
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={!canGoForward}
        className="rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
         <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}
