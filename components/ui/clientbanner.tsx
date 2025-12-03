'use client'
import { useTranslation } from "@/lib/useTranslation";
export const ClientBanner = () => {
  const { t } = useTranslation();
  return <>{t('banner_collega')}</>;
}