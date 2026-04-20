'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/strapi';

interface RelatedProjectsCarouselProps {
  projects: Project[];
}

export function RelatedProjectsCarousel({
  projects,
}: RelatedProjectsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);
  const MIN_DRAG_DISTANCE = 5; // Minimum pixels to move before considering it a drag

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({ left: 0, behavior: 'auto' });
    checkScroll();
  }, [projects.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const firstCard = container.querySelector('a');
      const cardWidth = firstCard
        ? (firstCard as HTMLElement).getBoundingClientRect().width
        : 0;
      const containerStyles = window.getComputedStyle(container);
      const gap = parseFloat(containerStyles.columnGap || containerStyles.gap || '0');
      const scrollAmount = cardWidth + gap;
      const newScrollLeft =
        container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      
      // Update button states after scroll
      setTimeout(checkScroll, 100);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Check if clicking on a link or button - if so, don't start drag
    const target = e.target as HTMLElement;
    const linkOrButton = target.closest('a') || target.closest('button');
    
    if (linkOrButton) {
      return;
    }
    
    setIsDragging(true);
    setDragStartX(e.pageX);
    setDragStartScrollLeft(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const dragDistance = e.pageX - dragStartX;
    
    // Only scroll if drag distance exceeds minimum threshold
    if (Math.abs(dragDistance) > MIN_DRAG_DISTANCE) {
      container.scrollLeft = dragStartScrollLeft - dragDistance;
      checkScroll();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    checkScroll();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    checkScroll();
  };

  if (projects.length === 0) return null;

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold">Các Dự Án Nổi Bật Khác</h2>
      <div className="flex items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="flex-shrink-0 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth flex-1 pb-4 cursor-grab active:cursor-grabbing select-none snap-x snap-mandatory"
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth', scrollbarWidth: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/du-an/${project.slug}`}
              className="group relative basis-[85%] min-w-[85%] max-w-[85%] overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg sm:basis-[calc((100%-1.5rem)/2)] sm:min-w-[calc((100%-1.5rem)/2)] sm:max-w-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-4.5rem)/4)] lg:min-w-[calc((100%-4.5rem)/4)] lg:max-w-[calc((100%-4.5rem)/4)] flex-shrink-0 pointer-events-auto snap-start"
              draggable="false"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.coverImage.url}
                  alt={project.coverImage.alt || project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                  draggable="false"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {project.title}
                </h3>
                {/* <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {project.summary}
                </p> */}
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 font-semibold">
                  Xem chi tiết
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="flex-shrink-0 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-800" />
        </button>
      </div>
    </div>
  );
}
