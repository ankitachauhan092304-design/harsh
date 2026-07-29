'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, CheckCircle, AlertCircle, Loader2,
  X, ShieldAlert, FileText, Lock, Sparkles,
  User, Phone, Mail, MapPin, IndianRupee,
  MessageSquare, ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  buildEnquiryMessage,
  buildWhatsAppUrl,
  DEFAULT_WA_NUMBER,
} from '@/lib/whatsapp';

interface FormProps {
  defaultLoanType?: string;
}

const LOAN_OPTIONS = [
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'HOME', label: 'Home Loan' },
  { value: 'LAP', label: 'Loan Against Property (LAP)' },
  { value: 'PROJECT_LOAN', label: 'Project Loan' },
  { value: 'TOP_UP_LOAN', label: 'Top-up Loan' },
  { value: 'CREDIT_CARD', label: 'Credit Card Comparison' },
];

const GUJARAT_CITIES = [
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
  'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad',
  'Mehsana', 'Patan', 'Palanpur', 'Navsari', 'Valsad',
  'Bharuch', 'Morbi', 'Porbandar', 'Amreli', 'Botad',
  'Godhra', 'Veraval', 'Gandhidham', 'Bhuj', 'Dahod',
  'Himmatnagar', 'Kalol', 'Vapi', 'Sanand', 'Deesa',
  'Jetpur', 'Mahuva', 'Ankleshwar', 'Viramgam', 'Bardoli',
  'Kadi', 'Unjha', 'Dhoraji', 'Gondal', 'Pardi',
  'Vyara', 'Modasa', 'Wadhwan', 'Surendranagar', 'Borsad',
  'Khambhat', 'Dabhoi', 'Halol', 'Mangrol', 'Keshod',
  'Una', 'Dwarka', 'Mandvi', 'Mundra'
];

/** Formats a numeric string to Indian currency formatting (e.g. 100000 -> 1,00,000) */
function formatIndianCurrency(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';
  const num = Number(digits);
  return num.toLocaleString('en-IN');
}

/** Sanitize input strings against HTML / script tags */
function sanitizeInput(str: string): string {
  return str.replace(/<[^>]*>?/gm, '').replace(/\n{3,}/g, '\n\n');
}

export default function ContactForm({ defaultLoanType = 'PERSONAL' }: FormProps) {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', city: '',
    loanType: defaultLoanType, loanAmount: '',
    message: '', consent: false, honeypot: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpeningWA, setIsOpeningWA] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [savedLeadId, setSavedLeadId] = useState<string>('');
  const [savedLeadNumber, setSavedLeadNumber] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  // City Autocomplete state
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [highlightedCityIdx, setHighlightedCityIdx] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityContainerRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Filtered cities list for autocomplete
  const filteredCities = GUJARAT_CITIES.filter((city) =>
    city.toLowerCase().includes(formData.city.trim().toLowerCase())
  );

  // Close city dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityContainerRef.current && !cityContainerRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Validation Rules ──────────────────────────────────────────────────────
  const validateField = useCallback((name: string, value: string | boolean): string => {
    switch (name) {
      case 'name': {
        const strVal = String(value).trim();
        if (!strVal) return 'Full name is required.';
        if (strVal.length < 2) return 'Please enter a valid full name.';
        if (strVal.length > 60) return 'Name cannot exceed 60 characters.';
        if (!/^[a-zA-Z\s\.\-']+$/.test(strVal)) return 'Please enter a valid full name.';
        return '';
      }
      case 'phone': {
        const digits = String(value).replace(/\D/g, '');
        if (!digits) return 'Mobile number is required.';
        if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
          return 'Enter a valid 10-digit mobile number.';
        }
        return '';
      }
      case 'email': {
        const emailVal = String(value).trim();
        if (!emailVal) return ''; // Optional
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailVal)) {
          return 'Enter a valid email address.';
        }
        return '';
      }
      case 'city': {
        const cityVal = String(value).trim();
        if (!cityVal) return 'City is required.';
        return '';
      }
      case 'loanAmount': {
        const digits = String(value).replace(/\D/g, '');
        if (!digits) return 'Loan amount is required.';
        const amountNum = Number(digits);
        if (amountNum < 50000) return 'Minimum loan amount is ₹50,000.';
        if (amountNum > 100000000) return 'Maximum loan amount is ₹10,00,00,000.';
        return '';
      }
      case 'loanType': {
        if (!value) return 'Please select a loan category.';
        return '';
      }
      case 'consent': {
        if (!value) return 'Please provide authorization to proceed.';
        return '';
      }
      default: return '';
    }
  }, []);

  const validateAll = useCallback(() => {
    const fields = ['name', 'phone', 'email', 'city', 'loanAmount', 'loanType', 'consent'] as const;
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = field === 'consent' ? formData.consent : formData[field];
      const err = validateField(field, val as string | boolean);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Handle blur event: mark field as touched and validate
  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'name') {
      const cleaned = formData.name.trim().replace(/\s+/g, ' ');
      setFormData((prev) => ({ ...prev, name: cleaned }));
      setErrors((prev) => ({ ...prev, name: validateField('name', cleaned) }));
      return;
    }
    const val = name === 'consent' ? formData.consent : (formData as Record<string, unknown>)[name];
    const err = validateField(name, val as string | boolean);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  // Input Restrictions while typing (Live validation only if field has been touched)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const restricted = value.replace(/[^a-zA-Z\s\.\-']/g, '').slice(0, 60);
      setFormData((prev) => ({ ...prev, name: restricted }));
      if (touched.name) {
        setErrors((prev) => ({ ...prev, name: validateField('name', restricted) }));
      }
      return;
    }

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      if (touched.phone) {
        setErrors((prev) => ({ ...prev, phone: validateField('phone', digits) }));
      }
      return;
    }

    if (name === 'email') {
      const lower = value.toLowerCase().replace(/\s/g, '');
      setFormData((prev) => ({ ...prev, email: lower }));
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateField('email', lower) }));
      }
      return;
    }

    if (name === 'city') {
      setFormData((prev) => ({ ...prev, city: value }));
      setShowCityDropdown(true);
      setHighlightedCityIdx(-1);
      if (touched.city) {
        setErrors((prev) => ({ ...prev, city: validateField('city', value) }));
      }
      return;
    }

    if (name === 'loanAmount') {
      const digits = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, loanAmount: digits }));
      if (touched.loanAmount) {
        setErrors((prev) => ({ ...prev, loanAmount: validateField('loanAmount', digits) }));
      }
      return;
    }

    if (name === 'message') {
      const sanitized = sanitizeInput(value).slice(0, 500);
      setFormData((prev) => ({ ...prev, message: sanitized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, consent: checked }));
    setTouched((prev) => ({ ...prev, consent: true }));
    setErrors((prev) => ({ ...prev, consent: validateField('consent', checked) }));
  };

  // City Autocomplete selection
  const selectCity = (city: string) => {
    setFormData((prev) => ({ ...prev, city }));
    setShowCityDropdown(false);
    setTouched((prev) => ({ ...prev, city: true }));
    setErrors((prev) => ({ ...prev, city: validateField('city', city) }));
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCityDropdown || filteredCities.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedCityIdx((prev) => (prev < filteredCities.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedCityIdx((prev) => (prev > 0 ? prev - 1 : filteredCities.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedCityIdx >= 0 && highlightedCityIdx < filteredCities.length) {
        e.preventDefault();
        selectCity(filteredCities[highlightedCityIdx]);
      }
    } else if (e.key === 'Escape') {
      setShowCityDropdown(false);
    }
  };

  // ── File Handling ────────────────────────────────────────────────────────
  const processFiles = useCallback((selectedFiles: File[]) => {
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    selectedFiles.forEach((file) => {
      const sizeMb = file.size / (1024 * 1024);
      const isAllowedType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      
      if (!isAllowedType) {
        fileErrors.push(`${file.name}: Only PDF, JPG, and PNG files are allowed.`);
        return;
      }
      if (sizeMb > 5) {
        fileErrors.push(`${file.name}: File size exceeds 5MB limit.`);
        return;
      }
      validFiles.push(file);
    });

    if (fileErrors.length > 0) {
      setErrors((prev) => ({ ...prev, general: fileErrors.join(' ') }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.general;
        return copy;
      });
    }

    validFiles.forEach((file) => {
      const key = `${file.name}-${file.size}`;
      setUploadProgress((prev) => ({ ...prev, [key]: 0 }));
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) { progress = 100; clearInterval(interval); }
        setUploadProgress((prev) => ({ ...prev, [key]: Math.min(progress, 100) }));
      }, 120);
    });

    setFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      return [...prev, ...validFiles.filter((f) => !existing.has(`${f.name}-${f.size}`))];
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      const key = `${removed.name}-${removed.size}`;
      setUploadProgress((p) => { const c = { ...p }; delete c[key]; return c; });
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  // ── Submit → Save Lead → Open WhatsApp ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    // Mark ALL fields as touched when Submit is clicked
    setTouched({ name: true, phone: true, email: true, city: true, loanAmount: true, loanType: true, consent: true });
    
    // Validate all fields
    if (!validateAll()) return;

    const lastSubmission = localStorage.getItem('last_lead_sub');
    if (lastSubmission && Date.now() - Number(lastSubmission) < 60000) {
      setErrors({ general: 'Request already received. Please wait 1 minute before submitting again.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('IDLE');

    let leadId = `lead-${Date.now()}`;
    let leadNumber = '';

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email,
        city: formData.city.trim(),
        loanType: formData.loanType,
        loanAmount: Number(formData.loanAmount),
        employmentType: 'SALARIED',
        monthlyIncome: 0,
        remarks: formData.message,
        source: 'WEBSITE_FORM',
        landingPage: typeof window !== 'undefined' ? window.location.pathname : '/',
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        leadId = result.leadId || leadId;
        leadNumber = result.leadNumber || '';
      }
    } catch (err) {
      console.warn('API submission notice (falling back to client generation):', err);
    }

    if (!leadNumber) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const seq = String(Math.floor(Math.random() * 900000 + 100000));
      leadNumber = `WF-${yyyy}${mm}${dd}-${seq}`;
    }

    setSavedLeadId(leadId);
    setSavedLeadNumber(leadNumber);
    localStorage.setItem('last_lead_sub', Date.now().toString());

    // Save lead object into localStorage so it displays immediately in Admin Portal (/admin)
    const newLeadObj = {
      id: leadId,
      leadNumber,
      name: formData.name.trim(),
      phone: formData.phone,
      email: formData.email,
      city: formData.city.trim(),
      employmentType: 'SALARIED',
      monthlyIncome: 0,
      loanType: formData.loanType.toUpperCase(),
      loanAmount: Number(formData.loanAmount) || 0,
      status: 'NEW',
      priority: 'HIGH',
      tags: 'Website Form',
      remarks: formData.message || 'Inquiry submitted via React form.',
      source: 'WEBSITE_FORM',
      whatsappClicked: true,
      whatsappClickedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const storedLeads = JSON.parse(localStorage.getItem('wf_leads') || '[]');
      storedLeads.unshift(newLeadObj);
      localStorage.setItem('wf_leads', JSON.stringify(storedLeads));
    } catch (err) {
      console.error('Failed to save lead to localStorage:', err);
    }

    // Background submit to Google Webhook / Google Sheets if configured
    const targetWebhook = localStorage.getItem('wf_google_webhook_url') || 'https://script.google.com/macros/s/AKfycbyc__n3C9_6t3Vz0y7H8sL78xR1yN2vQ95Z6k0M2o4h9G3F5J1wB3N2/exec';
    if (targetWebhook) {
      const googleBody = new URLSearchParams({
        leadNumber,
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email,
        city: formData.city.trim(),
        loanType: formData.loanType,
        loanAmount: formData.loanAmount,
        remarks: formData.message || '',
        submittedAt: new Date().toISOString(),
      }).toString();
      fetch(targetWebhook, {
        method: 'POST',
        mode: 'no-cors',
        body: googleBody,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).catch((e) => console.log('Google sheet submit background notice:', e));
    }

    confetti({
      particleCount: 120, spread: 80,
      origin: { y: 0.55 },
      colors: ['#0B4F9C', '#00A86B', '#6366f1', '#f59e0b'],
    });

    setSubmitStatus('SUCCESS');

    setIsOpeningWA(true);
    const waMessage = buildEnquiryMessage({
      leadNumber,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      loanType: formData.loanType,
      loanAmount: Number(formData.loanAmount),
      remarks: formData.message,
    });
    setTimeout(() => {
      const waUrl = buildWhatsAppUrl(waMessage, DEFAULT_WA_NUMBER);
      window.location.href = waUrl;
      setIsOpeningWA(false);
    }, 800);

    setFormData({ name: '', phone: '', email: '', city: '', loanType: defaultLoanType, loanAmount: '', message: '', consent: false, honeypot: '' });
    setFiles([]); setTouched({}); setErrors({});
    setIsSubmitting(false);
  };

  const handleManualWhatsApp = () => {
    if (!savedLeadNumber) return;
    const waMessage = buildEnquiryMessage({
      leadNumber: savedLeadNumber,
      name: formData.name || 'Customer',
      phone: formData.phone || '',
      email: formData.email || '',
      city: formData.city || '',
      loanType: defaultLoanType,
      loanAmount: 0,
    });
    const waUrl = buildWhatsAppUrl(waMessage, DEFAULT_WA_NUMBER);
    window.location.href = waUrl;
    if (savedLeadId) fetch(`/api/leads/${savedLeadId}/whatsapp`, { method: 'POST' }).catch(() => {});
  };

  // Field CSS styling - ONLY shows error styling if touched[name] is true!
  const fieldClass = (name: string) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-sm font-medium outline-none transition-all duration-200 placeholder:text-slate-300 ${
      touched[name] && errors[name]
        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200 bg-rose-50/20'
        : touched[name] && !errors[name] && (formData as Record<string, unknown>)[name]
        ? 'border-emerald-400 focus:border-emerald-500 ring-1 ring-emerald-100'
        : 'border-slate-200 focus:border-[#0B4F9C] focus:ring-2 focus:ring-[#0B4F9C]/10'
    }`;

  // Error message rendering - ONLY renders if field has been touched!
  const renderErrorMsg = (name: string) =>
    touched[name] && errors[name] ? (
      <motion.span
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] font-semibold text-rose-500 flex items-center gap-1 mt-0.5"
      >
        <AlertCircle size={10} className="shrink-0" />
        {errors[name]}
      </motion.span>
    ) : null;

  // Green checkmark rendering - ONLY renders if field is touched and valid
  const renderValidMark = (name: string) =>
    touched[name] && !errors[name] && (formData as Record<string, unknown>)[name] ? (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
        <CheckCircle size={15} />
      </motion.div>
    ) : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 relative overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#0B4F9C] via-[#6366f1] to-[#00A86B]" />

      <div className="p-6 md:p-10">
        <AnimatePresence mode="wait">
          {/* ── SUCCESS STATE ──────────────────────────────────────────────── */}
          {submitStatus === 'SUCCESS' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="flex flex-col items-center text-center py-14 gap-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-[#00A86B] flex items-center justify-center shadow-2xl shadow-emerald-200">
                  <CheckCircle size={36} className="text-white" strokeWidth={2.5} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-0 rounded-full bg-emerald-400/30"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-2xl font-black text-slate-800 font-poppins">Consultation Initiated! 🎉</h3>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed mt-2">
                  Lead <strong className="text-slate-700 font-mono">{savedLeadNumber}</strong> has been registered in our CRM.
                  Our senior advisor will reach out within <strong className="text-slate-700">2 working hours</strong>.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={handleManualWhatsApp}
                  disabled={isOpeningWA}
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-green-200 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isOpeningWA ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  )}
                  Open WhatsApp Chat
                </button>

                <button
                  onClick={() => { setSubmitStatus('IDLE'); setSavedLeadId(''); setSavedLeadNumber(''); }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>

              <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Lock size={9} className="text-[#00A86B]" />
                Your data is protected · Lead Ref: {savedLeadNumber}
              </p>
            </motion.div>
          ) : (
            /* ── FORM ───────────────────────────────────────────────────── */
            <motion.form
              key="form"
              id="contactForm"
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Honeypot */}
              <input type="text" name="honeypot" value={formData.honeypot} onChange={handleInputChange} className="hidden" autoComplete="off" tabIndex={-1} />

              {/* Header */}
              <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B4F9C] to-[#6366f1] flex items-center justify-center">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 font-poppins">Request Free Consultation</h3>
                </div>
                <p className="text-xs text-slate-500 pl-10">
                  Submit your details — we save your enquiry and open WhatsApp instantly.
                </p>
              </div>

              {/* General error */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex gap-2 items-center"
                  >
                    <ShieldAlert size={16} className="text-rose-500 shrink-0" />
                    <span>{errors.general}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={11} /> Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('name')}
                      placeholder="e.g. Harsh Parmar"
                      maxLength={60}
                      className={fieldClass('name')}
                      aria-invalid={touched.name && !!errors.name}
                    />
                    {renderValidMark('name')}
                  </div>
                  {renderErrorMsg('name')}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Phone size={11} /> Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm font-bold text-slate-400 select-none pointer-events-none">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="98249 75488"
                      maxLength={10}
                      className={`${fieldClass('phone')} pl-12`}
                      aria-invalid={touched.phone && !!errors.phone}
                    />
                    {renderValidMark('phone')}
                  </div>
                  {renderErrorMsg('phone')}
                </div>
              </div>

              {/* Row 2: Email + City (Autocomplete) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={11} /> Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="name@example.com"
                      className={fieldClass('email')}
                      aria-invalid={touched.email && !!errors.email}
                    />
                    {renderValidMark('email')}
                  </div>
                  {renderErrorMsg('email')}
                </div>

                {/* City Autocomplete */}
                <div className="flex flex-col gap-1 relative" ref={cityContainerRef}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={11} /> City (Gujarat) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={cityInputRef}
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onFocus={() => setShowCityDropdown(true)}
                      onBlur={() => handleBlur('city')}
                      onKeyDown={handleCityKeyDown}
                      placeholder="e.g. Ahmedabad, Surat"
                      className={fieldClass('city')}
                      autoComplete="off"
                      aria-autocomplete="list"
                      aria-expanded={showCityDropdown}
                      aria-invalid={touched.city && !!errors.city}
                    />
                    {renderValidMark('city')}
                  </div>
                  {renderErrorMsg('city')}

                  {/* Autocomplete Dropdown */}
                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute left-0 right-0 top-[100%] mt-1 max-h-48 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl z-50 divide-y divide-slate-50"
                      >
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city, idx) => (
                            <div
                              key={city}
                              onMouseDown={() => selectCity(city)}
                              className={`px-4 py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-between transition-colors ${
                                highlightedCityIdx === idx ? 'bg-[#0B4F9C]/10 text-[#0B4F9C]' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span>{city}</span>
                              <span className="text-[10px] text-slate-400 font-normal">Gujarat</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-xs font-semibold text-slate-400 text-center">
                            No matching city found.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Row 3: Loan Type + Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loan Category */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ChevronDown size={11} /> Loan Category <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('loanType')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:border-[#0B4F9C] focus:ring-2 focus:ring-[#0B4F9C]/10 transition-all cursor-pointer appearance-none"
                    >
                      {LOAN_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {renderErrorMsg('loanType')}
                </div>

                {/* Amount with Indian Currency formatting display */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <IndianRupee size={11} /> Required Amount <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="loanAmount"
                      value={formData.loanAmount ? formatIndianCurrency(formData.loanAmount) : ''}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('loanAmount')}
                      placeholder="e.g. 5,00,000"
                      className={`${fieldClass('loanAmount')} pl-8`}
                      aria-invalid={touched.loanAmount && !!errors.loanAmount}
                    />
                    {renderValidMark('loanAmount')}
                  </div>
                  {renderErrorMsg('loanAmount')}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare size={11} /> Special Requirements (Optional)
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">{formData.message.length}/500</span>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={500}
                  placeholder="Share credit history, turnover, or other details to help us find the best match..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:border-[#0B4F9C] focus:ring-2 focus:ring-[#0B4F9C]/10 transition-all resize-none placeholder:text-slate-300"
                />
              </div>

              {/* Drag & Drop Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Upload size={11} /> Upload Documents (Optional)
                </label>
                <motion.div
                  ref={dropZoneRef}
                  animate={{
                    borderColor: isDragging ? '#0B4F9C' : '#e2e8f0',
                    backgroundColor: isDragging ? 'rgba(11,79,156,0.04)' : 'rgba(248,250,252,0.5)',
                    scale: isDragging ? 1.01 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                  onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver} onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer flex flex-col items-center gap-2 group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDragging ? 'bg-[#0B4F9C] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-[#0B4F9C]/10 group-hover:text-[#0B4F9C]'}`}>
                    <Upload size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 group-hover:text-[#0B4F9C] transition-colors">
                      {isDragging ? 'Drop files here…' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Payslips, ITR, Bank Statements · PDF, PNG, JPG ≤ 5MB</p>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </motion.div>

                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid gap-2 mt-1">
                      {files.map((file, index) => {
                        const key = `${file.name}-${file.size}`;
                        const progress = uploadProgress[key] ?? 100;
                        const isComplete = progress >= 100;
                        return (
                          <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: index * 0.05 }} className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
                            <div className="flex justify-between items-center p-2.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isComplete ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                                  {isComplete ? <CheckCircle size={14} className="text-emerald-600" /> : <FileText size={14} className="text-[#0B4F9C]" />}
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold text-slate-700 line-clamp-1 max-w-[180px]">{file.name}</p>
                                  <p className="text-[10px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB · {isComplete ? 'Ready' : `${Math.round(progress)}%`}</p>
                                </div>
                              </div>
                              <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
                                <X size={12} />
                              </button>
                            </div>
                            {!isComplete && (
                              <div className="h-1 bg-slate-200 mx-2.5 mb-2 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-[#0B4F9C] to-[#6366f1] rounded-full" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Consent */}
              <div className="flex flex-col gap-1 pt-1">
                <label className={`flex items-start gap-3 cursor-pointer text-xs font-medium leading-relaxed rounded-xl p-3 border transition-all ${formData.consent ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                  <input type="checkbox" checked={formData.consent} onChange={handleCheckboxChange} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0B4F9C] focus:ring-[#0B4F9C] shrink-0 cursor-pointer" />
                  <span>I authorize <strong>Whitestone Fincorp</strong> and its banking partners to contact me via phone, email, SMS, or WhatsApp. I confirm the details provided are accurate.</span>
                </label>
                {renderErrorMsg('consent')}
              </div>

              {/* API Error */}
              <AnimatePresence>
                {submitStatus === 'ERROR' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex gap-2 items-center"
                  >
                    <ShieldAlert size={16} className="text-rose-500 shrink-0" />
                    <span>Connection error. Please retry or WhatsApp us directly at +91 98249 75488.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B4F9C] via-[#1a5fb4] to-[#0B4F9C] hover:from-[#0a4485] hover:to-[#0a4485] text-white font-bold text-sm shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group btn-shine"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-700" />
                {isSubmitting ? (
                  <><Loader2 size={17} className="animate-spin" /><span>Saving & Opening WhatsApp…</span></>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Submit & Chat on WhatsApp</span>
                  </>
                )}
              </button>

              {/* Trust micro-line */}
              <p className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <Lock size={9} className="text-[#00A86B]" />
                Lead saved to CRM first · 256-bit SSL · No spam · No hidden charges
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
