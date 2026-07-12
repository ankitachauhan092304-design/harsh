'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappNumber = '919824975488';
  const message = encodeURIComponent("Hello Whitestone Fincorp, I would like to inquire about loan consultation services.");
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      aria-label="Contact us on WhatsApp"
    >
      {/* Ripple Ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping group-hover:animate-none -z-10" />
      
      {/* Icon */}
      <MessageSquare size={24} className="fill-white stroke-none" />

      {/* Tooltip */}
      <div className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-md">
        Chat with a Loan Advisor
      </div>
    </motion.a>
  );
}
