import Image from 'next/image';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProjectProps {
  title: string;
  description?: string;
  techStack?: string[];
  date?: string;
  links?: { name: string; url: string }[];
  images?: { src: string; alt: string }[];
}

const PROJECT_CONTENT: ProjectProps[] = [
  {
    title: 'INNOSCOPE',
    description:
      'Built an interactive React dashboard that allows users to explore, filter, and view Indian startup details with better user engagement. Integrated secure authentication using Node.js and Express, enabling verified users to submit ratings, share feedback, and contribute insights. Introduced startup submission features allowing founders to add their ventures, increasing system coverage and community activity.',
    techStack: [
      'React',
      'Routers',
      'Axios',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'JavaScript'
    ],
    date: 'Oct 2024 - Dec 2024',
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/arshdeep71',
      }
    ]
  },
  {
    title: 'Public Grievance System',
    description:
      'Implemented a structured grievance submission and sorting mechanism using modular C++ classes, enabling individuals to file complaints and track records efficiently. Developed separate user and admin modules to manage complaint entries, monitor status, and handle curriculum files through file-handling operations. Designed the system with reusable functions and clear header files, improving code maintainability and ensuring faster data processing across all modules.',
    techStack: [
      'C++',
      'File Handling',
      'OOP (Classes/Objects)'
    ],
    date: 'Jun 2025 – Jul 2025',
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/arshdeep71',
      }
    ]
  },
  {
    title: 'SyllabiSync',
    description:
      'Established a secure login/register workflow using PHP sessions and validation checks, enabling controlled access for faculty and administrators. Constructed an admin workspace that supports uploading, updating, and organizing curriculum files, streamlining institutional syllabus management. Crafted a responsive interface with HTML and TailwindCSS, improving navigation flow and ensuring organized syllabus browsing.',
    techStack: [
      'HTML',
      'TailwindCSS',
      'PHP',
      'MySQL',
      'JavaScript'
    ],
    date: 'Jan 2025 – Apr 2025',
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/arshdeep71',
      }
    ]
  }
];


const ProjectContent = ({ project }: { project: ProjectProps }) => {
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="text-secondary-foreground font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack && projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
                <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                <span className="font-light capitalize">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            ))}
          </div>
        </div>
      )}

      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const data = [
  {
    category: 'Startup Project',
    title: 'INNOSCOPE',
    src: '/innoscope.png',
    content: <ProjectContent project={{ title: 'INNOSCOPE' }} />,
  },
  {
    category: 'System Program',
    title: 'Public Grievance System',
    src: '/public_grievance.jpg',
    content: <ProjectContent project={{ title: 'Public Grievance System' }} />,
  },
  {
    category: 'Web App',
    title: 'SyllabiSync',
    src: '/syllabisync.png',
    content: <ProjectContent project={{ title: 'SyllabiSync' }} />,
  }
];
