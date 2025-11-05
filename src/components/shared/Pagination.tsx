
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
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
    const pageLimit = 3; // How many numbers to show around current page
    const totalButtons = pageLimit * 2 + 1; // e.g., 1 ... 4 5 6 ... 10

    if (totalPages <= totalButtons + 2) {
      // Show all pages if there aren't too many
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex case with ellipses
      pages.push(1); // Always show first page
      if (currentPage > pageLimit + 1) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - pageLimit);
      const end = Math.min(totalPages - 1, currentPage + pageLimit);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - pageLimit) {
        pages.push('...');
      }

      pages.push(totalPages); // Always show last page
    }
    
    // Remove duplicate ellipses
    return pages.filter((page, index) => page !== '...' || pages[index - 1] !== '...');
  };

  const pages = getPageNumbers();

  return (
    <div className={cn("mt-12 flex justify-center items-center space-x-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => onPageChange(page)}
            className="rounded-full"
          >
            {page}
          </Button>
        ) : (
          <span key={`ellipsis-${index}`} className="px-4 py-2">
            ...
          </span>
        )
      )}
       <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
