'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is Next.js?',
    answer: 'Next.js is a React framework that enables server-side rendering and static site generation for building modern web applications.',
  },
  {
    question: 'How do I install Next.js?',
    answer: 'You can install Next.js using npm or yarn by running `npx create-next-app@latest` or `yarn create next-app`.',
  },
  {
    question: 'Is Next.js free to use?',
    answer: 'Yes, Next.js is an open-source framework maintained by Vercel and the community.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="font-medium">{faq.question}</span>
              <span>{openIndex === index ? '▲' : '▼'}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
