/**
 * Section-Wise Modular Profile Architecture
 * Every section is an independent, self-contained component with clean typed props.
 */

// 1. Hero Section
export { default as SchoolHeroSection } from './SchoolHeroSection';
export type { SchoolHeroSectionProps } from './SchoolHeroSection';

// 2. About Section
export { default as SchoolAboutSection } from './SchoolAboutSection';
export type { SchoolAboutSectionProps } from './SchoolAboutSection';

// 3. Vision & Mission Section
export { default as SchoolVisionMissionSection } from './SchoolVisionMissionSection';
export type { SchoolVisionMissionSectionProps } from './SchoolVisionMissionSection';

// 4. Principal Message Section
export { default as SchoolPrincipalMessageSection } from './SchoolPrincipalMessageSection';
export type { SchoolPrincipalMessageSectionProps } from './SchoolPrincipalMessageSection';

// 5. Management Message Section
export { default as SchoolManagementMessageSection } from './SchoolManagementMessageSection';
export type { SchoolManagementMessageSectionProps } from './SchoolManagementMessageSection';

// 6. Important Information & Accreditation Section
export { default as SchoolImportantInfoSection } from './SchoolImportantInfoSection';
export type { SchoolImportantInfoSectionProps } from './SchoolImportantInfoSection';

// 7. Academic Results Section
export { default as SchoolBoardResultsSection } from './SchoolBoardResultsSection';

// 8. Facilities Section
export { default as SchoolFacilitiesSection } from './SchoolFacilitiesSection';
export type { SchoolFacilitiesSectionProps } from './SchoolFacilitiesSection';

// 9. School Campus & Gallery Section
export { default as SchoolCampusSection } from './SchoolCampusSection';
export type { SchoolCampusSectionProps } from './SchoolCampusSection';

// 9b. Campus Tour (Single YouTube Video) Section
export { default as SchoolCampusTourSection } from './SchoolCampusTourSection';
export type { SchoolCampusTourSectionProps } from './SchoolCampusTourSection';

// 10. Fee & Admissions Section
export { default as SchoolFeeSection } from './SchoolFeeSection';
export type { SchoolFeeSectionProps } from './SchoolFeeSection';

// 11. Contact Departments & Desks Section
export { default as SchoolContactDetailSection } from './SchoolContactDetailSection';
export type { SchoolContactDetailSectionProps } from './SchoolContactDetailSection';

// 12. Address & Geospatial Map Section
export { default as SchoolAddressMapSection } from './SchoolAddressMapSection';
export type { SchoolAddressMapSectionProps } from './SchoolAddressMapSection';

// 13. Frequently Asked Questions (FAQ) Section
export { default as SchoolFaqSection } from '@/components/schools/template/SchoolFaqSection';
export type { SchoolFaqSectionProps, AuthenticFaqProps } from '@/components/schools/template/SchoolFaqSection';

// 14. Reviews & Ratings Section
export { default as SchoolReviewsSection } from './SchoolReviewsSection';
export type { SchoolReviewsSectionProps } from './SchoolReviewsSection';

// 15. Footer Section
export { default as SchoolFooterSection } from './SchoolFooterSection';
export type { SchoolFooterSectionProps } from './SchoolFooterSection';

// Viewport Lazy Section Loader
export { default as LazySection } from './LazySection';

// Legacy compatibility aliases
export { default as SchoolPrinciplesSection } from './SchoolVisionMissionSection';
export { default as SchoolPrincipalSection } from './SchoolPrincipalMessageSection';
export { default as SchoolQuickProfileSection } from './SchoolImportantInfoSection';
export { default as SchoolFacilitiesTab } from './SchoolFacilitiesSection';
export { default as SchoolGalleryTab } from './SchoolCampusSection';
export { default as SchoolAdmissionsTab } from './SchoolFeeSection';
export { default as SchoolReviewsTab } from './SchoolReviewsSection';
export { default as SchoolContactTab } from './SchoolContactTab';
export { default as SchoolCareersTab } from './SchoolCareersTab';
export type { SchoolCareersTabProps } from './SchoolCareersTab';
