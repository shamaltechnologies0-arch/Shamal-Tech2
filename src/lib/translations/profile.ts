export const profileTranslations = {
  en: {
    linkedInProfile: 'LinkedIn Profile',
    personalWebsite: 'Personal Website',
    companyProfile: 'Company Profile',
    viewCompanyProfile: 'View Company Profile (Arabic & English)',
    companyProfileArabic: 'Company Profile (Arabic)',
    companyProfileEnglish: 'Company Profile (English)',
    visitCompanyWebsite: 'Visit Company Website',
  },
  ar: {
    linkedInProfile: 'ملف لينكد إن',
    personalWebsite: 'الموقع الشخصي',
    companyProfile: 'ملف الشركة',
    viewCompanyProfile: 'عرض ملف الشركة (عربي وإنجليزي)',
    companyProfileArabic: 'ملف الشركة (عربي)',
    companyProfileEnglish: 'ملف الشركة (إنجليزي)',
    visitCompanyWebsite: 'زيارة موقع الشركة',
  },
} as const

export type ProfileTranslationKey = keyof (typeof profileTranslations)['en']
