// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import { SectionHeading } from "@/components/shared/section-heading";
// import { Container } from "@/components/shared/container";
// import type { Project } from "@/lib/strapi";

// export function FeaturedProjects({ projects }: { projects: Project[] }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const displayCount = 2;
//   const totalGroups = Math.ceil(projects.length / displayCount);

//   useEffect(() => {
//     if (totalGroups <= 1) return;
//     const timer = setInterval(() => {
//       setActiveIndex((current) => (current + 1) % totalGroups);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [totalGroups]);

//   const goToNext = () =>
//     setActiveIndex((current) => (current + 1) % totalGroups);
//   const goToPrev = () =>
//     setActiveIndex((current) => (current - 1 + totalGroups) % totalGroups);

//   const displayedProjects = projects.slice(
//     activeIndex * displayCount,
//     (activeIndex + 1) * displayCount,
//   );

//   return (
//     <section className="py-20">
//       <Container className="space-y-10">
//         <SectionHeading
//           label="Dự án"
//           title="Dự án nổi bật"
//           description="Những dự án được chọn lọc thể hiện phong cách thiết kế và chất lượng thi công của ICEP."
//         />
//         <div className="relative">
//           <div className="grid gap-6 md:grid-cols-2">
//             {displayedProjects.map((project) => (
//               <Link
//                 key={project.slug}
//                 href={`/du-an/${project.slug}`}
//                 className="group relative overflow-hidden rounded-2xl border border-border/70 bg-muted/40"
//               >
//                 <div className="relative aspect-[16/10]">
//                   <Image
//                     src={project.coverImage.url}
//                     alt={project.coverImage.alt}
//                     fill
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                     className="object-cover transition duration-500 group-hover:scale-[1.04]"
//                     placeholder="blur"
//                     blurDataURL={project.coverImage.blurDataURL}
//                   />
//                 </div>
//                 <div className="flex items-center justify-between gap-4 p-5">
//                   <div>
//                     <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
//                       {project.category}
//                     </p>
//                     <h3 className="text-xl font-semibold">{project.title}</h3>
//                   </div>
//                   <span className="text-sm text-muted-foreground">Xem</span>
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {totalGroups > 1 && (
//             <>
//               <button
//                 type="button"
//                 onClick={goToPrev}
//                 className="absolute -left-16 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-2 text-gray-800 transition hover:bg-amber-600 hover:text-white"
//                 aria-label="Dự án trước"
//               >
//                 <ChevronLeft className="h-6 w-6" />
//               </button>
//               <button
//                 type="button"
//                 onClick={goToNext}
//                 className="absolute -right-16 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-2 text-gray-800 transition hover:bg-amber-600 hover:text-white"
//                 aria-label="Dự án kế tiếp"
//               >
//                 <ChevronRight className="h-6 w-6" />
//               </button>
//             </>
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// }
