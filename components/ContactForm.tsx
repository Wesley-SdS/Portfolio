"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEnvelope, FaCheck, FaSpinner } from "react-icons/fa";
import MagicButton from "./MagicButton";

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm: React.FC = React.memo(() => {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="glassmorphism rounded-2xl p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <FaEnvelope className="text-2xl text-purple-500 dark:text-purple-400" />
        <h2 className="text-2xl font-bold text-foreground dark:text-slate-200">{t('title')}</h2>
      </div>

      <p className="text-foreground/80 dark:text-slate-300 mb-6">{t('description')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/80 dark:text-slate-300 mb-2">
            {t('form.name')}
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-3 rounded-lg glassmorphism border border-primary/20 text-foreground dark:text-slate-200 placeholder-muted-foreground focus:outline-none focus:border-purple-500/40 transition-colors"
            placeholder={t('form.namePlaceholder')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/80 dark:text-slate-300 mb-2">
            {t('form.email')}
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-3 rounded-lg glassmorphism border border-primary/20 text-foreground dark:text-slate-200 placeholder-muted-foreground focus:outline-none focus:border-purple-500/40 transition-colors"
            placeholder={t('form.emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground/80 dark:text-slate-300 mb-2">
            {t('form.subject')}
          </label>
          <input
            {...register('subject')}
            type="text"
            id="subject"
            className="w-full px-4 py-3 rounded-lg glassmorphism border border-primary/20 text-foreground dark:text-slate-200 placeholder-muted-foreground focus:outline-none focus:border-purple-500/40 transition-colors"
            placeholder={t('form.subjectPlaceholder')}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground/80 dark:text-slate-300 mb-2">
            {t('form.message')}
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className="w-full px-4 py-3 rounded-lg glassmorphism border border-primary/20 text-foreground dark:text-slate-200 placeholder-muted-foreground focus:outline-none focus:border-purple-500/40 transition-colors resize-none"
            placeholder={t('form.messagePlaceholder')}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.message.message}</p>
          )}
        </div>

        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-4"
          >
            <FaCheck />
            <span>{t('form.success')}</span>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
          >
            <span>{t('form.error')}</span>
          </motion.div>
        )}

        <MagicButton
          title={isSubmitting ? t('form.submitting') : t('form.submit')}
          icon={isSubmitting ? <FaSpinner className="animate-spin" /> : <FaEnvelope />}
          position="right"
          type="submit"
          disabled={isSubmitting}
          otherClasses="glassmorphism hover:glow-effect transition-all duration-300 w-full"
        />
      </form>
    </motion.div>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;
