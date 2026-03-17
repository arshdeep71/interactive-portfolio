'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Download } from 'lucide-react';

export function Contact() {
  // Contact information
  const contactInfo = {
    name: 'Arshdeep Singh',
    email: 'arshdeepsingh07711@gmail.com',
    handle: '@arshdeep71',
    socials: [
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/arshdeep71',
      },
      {
        name: 'Github',
        url: 'https://github.com/arshdeep71',
      },
    ],
  };

  // Function to handle opening links
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto mt-8 w-full">
      <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Contacts
          </h2>
          <span className="mt-2 sm:mt-0">
            {contactInfo.handle}
          </span>
        </div>

        {/* Email Section */}
        <div className="mt-8 flex flex-col md:mt-10">
          <div
            className="group mb-5 cursor-pointer"
            onClick={() => openLink(`mailto:${contactInfo.email}`)}
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
                {contactInfo.email}
              </span>
              <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Social Links & CV */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-5 sm:gap-x-8 mt-4">
            {contactInfo.socials.map((social) => (
              <button
                key={social.name}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
                onClick={() => openLink(social.url)}
                title={social.name}
              >
                {social.name}
              </button>
            ))}

            <a
              href="/ARSHcv.pdf"
              download="Arshdeep_Singh_CV.pdf"
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-transform hover:bg-neutral-800 active:scale-95 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
