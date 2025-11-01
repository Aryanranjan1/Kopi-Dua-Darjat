'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

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
  
  const pageNumbers = [];
  // Logic to display page numbers, e.g., [1, '...', 4, 5, 6, '...', 10]
  // For simplicity, we'll show a few pages around the current one.
  const pagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  return (
    <div className="flex items-center justify-center gap-2 mt-16">
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

      {startPage > 1 && (
        <>
          <Button variant="ghost" onClick={() => onPageChange(1)} className="rounded-full">1</Button>
          {startPage > 2 && <span className="text-muted-foreground">...</span>}
        </>
      )}

      {pageNumbers.map(page => (
         <Button
          key={page}
          variant={currentPage === page ? 'default' : 'ghost'}
          onClick={() => onPageChange(page)}
          className="rounded-full"
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
         <>
          {endPage < totalPages -1 && <span className="text-muted-foreground">...</span>}
          <Button variant="ghost" onClick={() => onPageChange(totalPages)} className="rounded-full">{totalPages}</Button>
        </>
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
