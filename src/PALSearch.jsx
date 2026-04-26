import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ExternalLink, Clock, X, Filter, Star, TrendingUp, Info, FileText, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const PAL_POLICIES = [
  // HR - Pay
  { id: 1, title: 'Allowances — Teaching Service', category: 'HR - Pay', tags: ['allowance', 'salary loading', '17.5%', 'higher duties', 'first aid', 'remote schools'], summary: 'Allowances for teaching service employees including the 17.5% salary loading paid annually in December.', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines', popular: true,
    tabs: { overview: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/overview', policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines', resources: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/resources' },
    resources: [
      { title: 'Allowance Administration Procedure (Word)', note: 'last updated 31 December 2018' },
      { title: 'List of Remote Schools (Word)', note: 'last updated 9 September 2019' },
      { title: 'List of Remote Schools (PDF)', note: 'last updated 9 September 2019' },
      { title: 'Payment of Allowances — Teaching Service Form (Word)', note: '' }
    ],
  chapters: [
    { title: 'Leave purchase allowance (education support class) — 72.47%, 30 days, 228 hours, education support, fortnightly, lump sum', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines' },
    { title: 'First aid allowance (education support class) — 60%, first aid qualification, education support, pro rata', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines' },
    { title: 'Intensive care allowance (education support class) — Victorian Government Schools Agreement 2022, special school, level 1 range 2 subdivision 4, intensive attendant care', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines' },
    { title: 'Special schools allowance — $727 per annum, special school, assistant principals, visiting teachers, pro rata', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines' },
    { title: 'Nurse equipment allowance (education support class) — $500, 3,000 km, Victorian School Nursing Program, lump sum', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines' },
    { title: 'Remote allowance — remote category A, remote category B, designated remote schools', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines' },
    { title: 'Remote category B — dependants, 16 years, spouse, full-time student, pro rata', url: 'https://www2.education.vic.gov.au/pal/allowances-teaching-service/policy-and-guidelines' }
  ],
},
  { id: 2, title: 'Remuneration — Teaching Service', category: 'HR - Pay', tags: ['remuneration', 'salary', 'pay', 'promotion', 'transfer', 'progression', 'commencement salary'], summary: 'Salary on employment, transfer and promotion. Progression cycles operate May to April.', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines', popular: true,
    tabs: { overview: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/overview', policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines', resources: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/resources' },
    chapters: [
      { title: 'Introduction', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/introduction' },
      { title: 'Salary package', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/salary-package' },
      { title: 'Salary on employment, transfer or promotion', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/remuneration-employment-transfer-or' },
      { title: 'Principal class salary review', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/principal-class-salary-review' },
      { title: 'Annual progression', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/annual-progression' },
      { title: 'Accelerated progression', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/accelerated-progression' },
      { title: 'Salary underpayments', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/salary-underpayments' },
      { title: 'Salary overpayments', url: 'https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/salary-overpayments' }
    ],
    resources: [
      { title: 'Commencement Salary Calculator for Classroom Teachers', note: '' },
      { title: 'Salary Progression Administration Procedures (Word)', note: '' },
      { title: 'Salary Range Review Procedures (Word)', note: '' }
    ]
  },
  { id: 3, title: 'Special Payments — Teaching Service', category: 'HR - Pay', tags: ['special payments', 'attraction', 'retention', 'task payment', '925', '10000'], summary: 'Special payments for teacher, paraprofessional or ES class employees for additional tasks or attraction/retention. Range $925 to $10,000 per annum.', url: 'https://www2.education.vic.gov.au/pal/special-payments/policy' },
  { id: 3.5, title: 'Higher Duties — Teaching Service', category: 'HR - Pay', tags: ['higher duties', 'hda', 'acting', 'assigned position'], summary: 'Higher duties allowance when assigned to a higher-remuneration position and performing at least half its duties. Typically for vacancies of 5+ consecutive working days.', url: 'https://www2.education.vic.gov.au/pal/higher-duties-teaching-service/policy-and-guidelines',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Selection Payment Payment during periods of leave — 3 months, merit-based, expressions of interest, Recruitment in Schools, selection panel', href: 'https://www2.education.vic.gov.au/pal/higher-duties-teaching-service/policy-and-guidelines https://www2.education.vic.gov.au/pal/higher-duties-teaching-service/policy-and-guidelines https://www2.education.vic.gov.au/pal/higher-duties-teaching-service/policy-and-guidelines' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/higher-duties-teaching-service/policy-and-guidelines#rpl-main' }
  ],
},
  { id: 4, title: 'Salary Packaging — Teaching Service', category: 'HR - Pay', tags: ['packaging', 'novated lease', 'superannuation', 'salary sacrifice', 'maxxia'], summary: 'Salary packaging arrangements for teaching service employees. Administered by Maxxia Pty Ltd since 1 November 2022.', url: 'https://www2.education.vic.gov.au/pal/salary-packaging-teaching-service/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/salary-packaging-teaching-service/overview#rpl-main' }
  ],
},
  { id: 5, title: 'Overpayments', category: 'HR - Pay', tags: ['overpayment', 'recovery', 'debt'], summary: 'Managing and recovering overpayments to employees.', url: 'https://www2.education.vic.gov.au/pal/overpayments/policy' },
  // HR - Leave
  { id: 6, title: 'Personal Leave — Teaching Service', category: 'HR - Leave', tags: ['sick leave', 'carers leave', 'personal leave', 'illness', '114 hours', 'medical certificate', 'family violence', 'compassionate leave', 'bereavement', '2 days'], summary: 'Personal leave for illness, caring, family violence support, and compassionate/bereavement leave (2 days under NES). Accrues at 114 hours per completed year of service.', url: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance', popular: true,
    tabs: { overview: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/overview', policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance', resources: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/resources' },
    resources: [
      { title: 'Apply via eduPay Employee Self Service (ESS)', note: 'primary method' },
      { title: 'Leave Administration Procedure (Word)', note: '' },
      { title: 'Australian Health Practitioner Regulation Agency (AHPRA)', note: 'list of registered practitioners' }
    ],
  chapters: [
    { title: 'Introduction', url: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance' },
    { title: 'Personal leave entitlement — 114 hours, 22.8 hours, pro rata, carer\'s, prior service', url: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance' },
    { title: 'Applications for personal leave — required document, Medical Advisory Service, statutory declaration, delegate, without pay', url: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance' },
    { title: 'Required document — medical certificate, statutory declaration, Health Practitioner Regulation National Law, registered health practitioner', url: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance' },
    { title: 'Fitness for duty — 13 weeks, independent medical assessment, fitness for duty, treating practitioner, delegate', url: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance' },
    { title: 'Other related leave provisions — long service leave, Christmas vacation, 4 weeks, public holidays, re-credited', url: 'https://www2.education.vic.gov.au/pal/personal-leave-teaching-service/policy-and-guidance' }
  ],
},
  { id: 7, title: 'Long Service Leave — Teaching Service', category: 'HR - Leave', tags: ['lsl', 'long service', '7 years', '10 years', 'edupay ess', '495 hours', '3 months'], summary: '495.7 hours (3 months) LSL after 10 years eligible service; 247.8 hours (1.5 months) per 5 years thereafter. Pro-rata access after 7 years. View on eduPay ESS.', url: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/policy-and-guidelines', popular: true,
    tabs: { overview: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/overview', policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/policy-and-guidelines', resources: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/resources' },
    chapters: [
      { title: 'Entitlement — 495.6967 hours, 10 years, 7 years, 247.84835 hours, eduPay, payment in lieu', url: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/policy-and-guidelines' },
      { title: 'Granting long service leave — 2 terms, half pay, payment in advance, Regional Director, parental absence', url: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/policy-and-guidelines' },
      { title: 'Commuting long service leave to salary — 228 hours, 6 weeks, financial hardship, commutation, Regional Director', url: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/policy-and-guidelines' },
      { title: 'School vacations and Public Holidays during LSL — school vacation, education support, public holidays, school term', url: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/policy-and-guidelines' },
      { title: 'Illness or injury during long service leave — personal leave, restored credits, extension', url: 'https://www2.education.vic.gov.au/pal/long-service-leave-teaching-service/policy-and-guidelines' }
    ],
    resources: [
      { title: 'View entitlement on eduPay Employee Self Service (ESS)', note: '' },
      { title: 'Long Service Leave Election form', note: 'for cessation' },
      { title: 'Apply via eduPay ESS', note: 'lodge at least 2 terms before commencement' }
    ]
  },
  { id: 8, title: 'Annual Leave — Teaching Service', category: 'HR - Leave', tags: ['annual leave', 'holiday', '20 days', '152 hours', 'vacation', 'recreation leave'], summary: '152 hours (20 days) per year full-time. Accrues through eduPay. ES class: 228 hours (30 days) additional paid leave.', url: 'https://www2.education.vic.gov.au/pal/annual-leave-teaching-service/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Annual leave — 152 hours, 20 days, 0.07665978, 1 February 2023, eduPay, ESS', url: 'https://www2.education.vic.gov.au/pal/annual-leave-teaching-service/policy' },
    { title: 'Additional paid leave — education support class', url: 'https://www2.education.vic.gov.au/pal/annual-leave-teaching-service/policy' },
    { title: 'Further information', url: 'https://www2.education.vic.gov.au/pal/annual-leave-teaching-service/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/annual-leave-teaching-service/policy#rpl-main' }
  ],
},
  { id: 9, title: 'Parental Absence — Teaching Service', category: 'HR - Leave', tags: ['maternity', 'paternity', 'parental', 'adoption', 'partner leave', 'keeping in touch'], summary: 'Paid and unpaid parental absence including maternity, paternity, partner and adoption leave. Includes lactation breaks, keeping in touch days, Commonwealth PLP.', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/leave-entitlements', popular: true,
    chapters: [
      { title: 'Introduction — 7 years, Victorian Government Schools Agreement 2022, Fair Work Act 2009, prenatal, pre-adoption, maternity', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/introduction' },
      { title: 'Definitions — 16 years, 6 months, domestic partner, multiple birth, qualifying service', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/definitions-1' },
      { title: 'Parental absence — 7 years, 8 weeks, multiple birth, 7th birthday, National Employment Standards', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/parental-absence' },
      { title: 'Leave entitlements — Appendix 1, parental absence', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/leave-entitlements' },
      { title: 'Leave preceding parental absence — 38 hours, 15.2 hours, 2 days, prenatal, pre-adoption, routine medical appointments', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/leave-preceding-parental-absence' },
      { title: 'Resumption of duty — 21 days, school vacation, part-time, fixed term, ongoing employee', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/resumption-duty' },
      { title: 'Keeping in touch days — 10 days, keeping in touch, Fair Work Ombudsman, unpaid parental absence', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/keeping-touch-days' },
      { title: 'Commonwealth Parental Leave Pay scheme — Dad and Partner Pay, Commonwealth, Human Services, financial support', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/commonwealth-parental-leave-pay-scheme' },
      { title: 'Casual employment — 12 months, casual employee, regular and systematic, National Employment Standards', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/casual-employment' },
      { title: 'Appendix 1 – Leave summary — National Employment Standards, parental absence entitlements, Agreement', url: 'https://www2.education.vic.gov.au/pal/parental-absence-teaching-service/policy-and-guidelines/appendix-1' }
    ],
    resources: [
      { title: 'Sample letter for temporary resumption', note: '' },
      { title: 'Parental Leave administration procedures', note: '' },
      { title: 'Parental Absence Application — Teaching Service', note: '' }
    ],
  tabs: [ 'Skip to main content' ],
},
  { id: 10, title: 'Leave Without Pay — Teaching Service', category: 'HR - Leave', tags: ['lwop', 'unpaid leave'], summary: 'Applying for and taking leave without pay. Includes teaching whilst on LWOP and early resumption.', url: 'https://www2.education.vic.gov.au/pal/leave-without-pay-teaching-service/policy' },
  { id: 11, title: 'Absent Without Leave', category: 'HR - Leave', tags: ['absent', 'awol', 'unauthorised', 'abandonment'], summary: 'Managing unauthorised absence from duty. Continued absence may lead to cessation of employment.', url: 'https://www2.education.vic.gov.au/pal/absent-without-leave/policy-and-guidelines',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Introduction — registered mail, written notification, cessation date, sudden illness, satisfactory evidence', url: 'https://www2.education.vic.gov.au/pal/absent-without-leave/policy-and-guidelines' },
    { title: 'Abandonment of employment — 3 calendar months, 20 working days, section 2.4.34(1), Education and Training Reform Act 2006, Schools People Services, 1800 641 943, Merit Protection Boards, VIT, WWC Check', url: 'https://www2.education.vic.gov.au/pal/absent-without-leave/policy-and-guidelines' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/absent-without-leave/policy-and-guidelines#rpl-main' }
  ],
},
  { id: 12, title: 'Family Violence — Information for Employees', category: 'HR - Leave', tags: ['family violence', 'domestic violence', 'support', 'leave'], summary: 'Paid family violence leave available without prior approval. Confidential support available via WCOs.', url: 'https://www2.education.vic.gov.au/pal/family-violence-information-employees/policy-and-guidelines/leave',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Introduction — Family Violence Protection Act 2008, Victorian Government Schools Agreement 2022, Victorian Public Service Enterprise Agreement 2020, intimate partners, siblings', url: 'https://www2.education.vic.gov.au/pal/family-violence-information-employees/policy-and-guidelines/introduction' },
    { title: 'Supporting the employee — 1300 338 465, 20 days, 12 months, WCO, Workplace Support Plan, Schools People Services', url: 'https://www2.education.vic.gov.au/pal/family-violence-information-employees/policy-and-guidelines/supporting-employee' },
    { title: 'Privacy and confidentiality — Privacy and Data Protection Act 2014, Family Violence Protection Act 2008, Health Records Act 2001, sealed envelope, privacy officer', url: 'https://www2.education.vic.gov.au/pal/family-violence-information-employees/policy-and-guidelines/privacy-and-confidentiality' },
    { title: 'Roles and responsibilities', url: 'https://www2.education.vic.gov.au/pal/family-violence-information-employees/policy-and-guidelines/roles-and-responsibilities' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/family-violence-information-employees/policy-and-guidelines/leave#rpl-main' }
  ],
},
  { id: 13, title: 'Recognition of Prior Service for Leave Purposes — Teaching Service', category: 'HR - Leave', tags: ['prior service', 'recognition', 'leave accrual', 'previous employment'], summary: 'How prior service is recognised for personal, annual and long service leave purposes.', url: 'https://www2.education.vic.gov.au/pal/recognition-prior-service-leave-purposes-teaching-service/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/recognition-prior-service-leave-purposes-teaching-service/overview#rpl-main' }
  ],
},
  { id: 14, title: 'Cessation of Employment — Teaching Service', category: 'HR - Leave', tags: ['cessation', 'termination', 'resignation', 'retirement', 'payout', 'payment in lieu'], summary: 'Payment of unused annual leave, LSL and allowances on cessation of employment.', url: 'https://www2.education.vic.gov.au/pal/cessation-employment-teaching-service/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/cessation-employment-teaching-service/overview#rpl-main' }
  ],
},
  { id: 15, title: 'Attendance and Working Hours — Teaching Service', category: 'HR - Leave', tags: ['working hours', 'attendance', 'lunch break', 'start date', 'hours', 'time in lieu'], summary: 'Working hours, lunch breaks (30 min min, 11:30am-2:30pm), and the common start date for school employees.', url: 'https://www2.education.vic.gov.au/pal/attendance-and-working-hours-teaching-service/policy-and-guidelines',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Teacher class — 7 hours, 10 minutes, 30 minutes, 11:30am to 2:30pm, parent-teacher meetings', url: 'https://www2.education.vic.gov.au/pal/attendance-and-working-hours-teaching-service/policy-and-guidelines' },
    { title: 'Education support class — 7.6 hours, 7:00am, 6:00pm, 30 minutes, 11:30am to 2:30pm, Monday to Friday', url: 'https://www2.education.vic.gov.au/pal/attendance-and-working-hours-teaching-service/policy-and-guidelines' },
    { title: 'Common Start Date (Beginning of School Year) — 5 days, 38 hours, clause 24(5)(a)(ii), Victorian Government Schools Agreement 2022, common start date', url: 'https://www2.education.vic.gov.au/pal/attendance-and-working-hours-teaching-service/policy-and-guidelines' },
    { title: 'Attendance during additional paid leave period — 6 days, 30 days, 52/52, 51/52, 10 July 2013, leave purchase allowance', url: 'https://www2.education.vic.gov.au/pal/attendance-and-working-hours-teaching-service/policy-and-guidelines' },
    { title: 'Common start date — 38 hours, 1 February 2023, clause 24(5)(a)(ii), additional paid leave, leave without pay', url: 'https://www2.education.vic.gov.au/pal/attendance-and-working-hours-teaching-service/policy-and-guidelines' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/attendance-and-working-hours-teaching-service/policy-and-guidelines#rpl-main' }
  ],
},
  { id: 16, title: 'Study Leave — Teaching Service', category: 'HR - Leave', tags: ['study leave', 'professional development', 'qualifications'], summary: 'Study leave with or without pay may be granted to teaching service employees.', url: 'https://www2.education.vic.gov.au/pal/study-leave-teaching-service/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/study-leave-teaching-service/overview#rpl-main' }
  ],
},

  // HR - Recruitment
  { id: 17, title: 'Recruitment in Schools', category: 'HR - Recruitment', tags: ['recruitment', 'hiring', 'vacancy', 'selection', 'school jobs vic', 'applicant pool', 'ongoing', 'fixed term', 'diversity', 'inclusion', 'aboriginal', 'torres strait islander', 'position descriptions', 'ministerial order 1388'], summary: 'Recruitment and selection for school-based positions. Manage via School Jobs Vic. Child safety screening required before offer. Template position descriptions available.', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines', resources: 'https://www2.education.vic.gov.au/pal/recruitment-schools/resources' },
    chapters: [
      { title: 'Introduction', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines' },
      { title: 'Translation to ongoing employment', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines/translation-ongoing-employment' },
      { title: 'Managing and advertising vacancies', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines/advertising-vacancies' },
      { title: 'Qualifications', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines' },
      { title: 'Applicant selection', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines/selection' },
      { title: 'Suitability for child connected work', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines/suitability-of-child-connected-work' },
      { title: 'Employment, promotion or transfer', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines/employment-promotion-or-transfer' },
      { title: 'Transfers and promotions', url: 'https://www2.education.vic.gov.au/pal/recruitment-schools/policy-and-guidelines' }
    ],
    resources: [
      { title: 'Recruitment in Schools Guide (PDF and Word)', note: '' },
      { title: 'Fixed Term Teacher Vacancy Ready Reckoner (Excel)', note: 'up to 2030 school year — School Jobs Vic and payroll' },
      { title: 'Hire or Rehire Employment Checklist (Word)', note: 'eduPay system processes' },
      { title: 'Suitability for Child Connected Work template (Word)', note: '' },
      { title: 'Tips for interviews (Word)', note: '' },
      { title: 'Translation to Ongoing Employment (Word)', note: '' },
      { title: 'Template position descriptions', note: 'available for most standard positions on School Jobs Vic' },
      { title: 'Forms — Teaching Service and HR Administration', note: 'offer letters, selection reports, consent forms' },
      { title: 'School Jobs Vic', note: 'search and apply for vacancies or advertise online' },
      { title: 'Applicant Help — School Jobs Vic', note: 'HRWeb — applicant User Guides and Fact Sheets' },
      { title: 'School Jobs Vic Help for Recruiters', note: 'staff login required — Recruiter User Guide, Hints and Tips, Interactive Tutorial' },
      { title: 'Contact: diversity@education.vic.gov.au', note: 'inclusive recruitment advice — Equal Opportunity Act 2010' }
    ]
  },
  { id: 18, title: 'Workforce Support and Initiatives for Schools', category: 'HR - Recruitment', tags: ['workforce', 'graduate teachers', 'international teachers', 'cwss', '5650', 'retention'], summary: 'Department initiatives including Graduate Teacher Recruitment ($5,650 incentive), International Teacher Recruitment and Central Workforce Support Service.', url: 'https://www2.education.vic.gov.au/pal/workforce-support-and-initiatives-schools/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/workforce-support-and-initiatives-schools/overview#rpl-main' }
  ],
},
  { id: 19, title: 'Workforce Planning for Schools', category: 'HR - Recruitment', tags: ['workforce planning', 'staffing', 'planning framework'], summary: 'Framework, phases and tools to support schools with workforce planning.', url: 'https://www2.education.vic.gov.au/pal/workforce-planning-schools/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/workforce-planning-schools/overview#rpl-main' }
  ],
},
  { id: 20, title: 'Transfer and Promotion for Teaching Service', category: 'HR - Recruitment', tags: ['transfer', 'promotion', 'movement', 'fixed term'], summary: 'Permanent and temporary transfers and promotions in the teaching service.', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Permanent transfer or promotion - Teaching Service', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines/permanent-transfer-or-promotion-teaching-service' },
    { title: 'Temporary transfer — 12 months, higher duties allowance, parental absence replacement, fixed term, base school', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines/temporary-transfer' },
    { title: 'Transfer or promotion to the public service — VPS, fixed term, school vacation model, corporate leave model, leave without pay, progression cycle', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines/transfer-or-promotion-to-the-public-service' },
    { title: 'Suitability for transfer or promotion — delegate of the Secretary, suitability, transfer or promotion', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines/suitability-for-transfer-or-promotion' },
    { title: 'Suitability for child connected work — Ministerial Order 1359, clause 10.2(d)(ii), child connected work check, child safety screening, Recruitment in Schools', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines/suitability-for-child-connected-work' },
    { title: 'Documentation for transfer or promotion — assistant principal, People and Workplace Relations, contract of employment, written communication', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines/documentation-for-transfer-or-promotion' },
    { title: 'Administrative transfer of an ongoing employee — section 2.4.3(3)(h), Education and Training Reform Act 2006, Schools Recruitment Unit, 1800 641 943, Public Sector Standards Commissioner, VPSC', url: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines/administrative-transfer-of-an-ongoing-employee' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/transfer-and-promotion-teaching-service/policy-and-guidelines#rpl-main' }
  ],
},
  { id: 21, title: 'Suitability for Child Connected Work', category: 'HR - Recruitment', tags: ['wwcc', 'working with children', 'child connected', 'screening', 'ministerial order 1359'], summary: 'Ministerial Order 1359 Clause 10.2(d)(ii). Suitability check required for preferred candidate before offer.', url: 'https://www2.education.vic.gov.au/pal/suitability-child-connected-work/policy', popular: true },
  { id: 22, title: 'Flexible Work', category: 'HR - Recruitment', tags: ['flexible work', 'part-time', 'job share', 'remote', 'fwct', 'working remotely'], summary: 'Flexible work arrangements including part-time, job-share, remote work and the Flexible Work for Classroom Teachers pilot (launched 2025).', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/flexible-work-arrangements',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Introduction', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/introduction' },
    { title: 'The flexible work guiding principles — guiding principles, work-life balance, school workforce', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/flexible-work-guiding-principles' },
    { title: 'Legislative context — Fair Work Act 2009, Section 65, NES, Victorian Equal Opportunity, 12 months service', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/1-legislative-context' },
    { title: 'Roles and responsibilities — principal responsibilities, employee responsibilities', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/3-roles-and-responsibilities' },
    { title: 'Supportive climate for flexibility — school climate, work-life balance, workforce plans, life cycle, career stage', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/4-supportive-climate-flexibility' },
    { title: 'An employee guide to requesting flexible work arrangements — telecommuting, working remotely, 2 days, business manager, proposal, work-life balance', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/5-employee-guide-requesting-flexible-work-arrangements' },
    { title: 'A guide to managing requests for flexible work arrangements — Fair Work Act, NES, part-time transition, leadership position, procedural fairness', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/6-guide-managing-requests-flexible-work-arrangements' },
    { title: 'Implementation — communication strategies, buddy system, shared calendars, full-time colleagues, review', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/7-implementation' },
    { title: 'Review and improve — monitoring, criteria, feedback, school community, uptake', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/8-review-and-improve' },
    { title: 'Review of decisions — grievances, dispute resolution, Teaching Service review', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/9-review-decisions' },
    { title: 'Appendix 1 — Overview of flexible work in schools', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/10-appendix-1-overview-flexible-work-schools' },
    { title: 'Appendix 2 — Overview of key flexible work options', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/11-appendix-2-overview-key-flexible-work-options' },
    { title: 'Flexible Work for Classroom Teachers Funding — $20,000 grant, 12 months, 2025 pilot, job-share, cross-over day, 30 June 2026', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/flexible-work-for-classroom-teachers' },
    { title: 'References — Fair Work Ombudsman, VEOHRC, Business Victoria, VPSC All Roles Flex', url: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/12-references' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/flexible-work/policy-and-guidelines/flexible-work-arrangements#rpl-main' }
  ],
},
  { id: 23, title: 'Employment and Sponsorship of Overseas Workers', category: 'HR - Recruitment', tags: ['overseas', 'sponsorship', 'visa', 'international', 'migration'], summary: 'Sponsoring and employing overseas workers including migration support for international teachers.', url: 'https://www2.education.vic.gov.au/pal/employment-and-sponsorship-overseas-workers/policy' },
  { id: 53, title: 'Forms — Teaching Service and HR Administration', category: 'HR - Recruitment', tags: ['forms', 'hr forms', 'offer letters', 'selection reports', 'employment forms', 'national police record', 'superannuation', 'prior service', 'compassionate transfer', 'excess', 'additional access', 'mss security'], summary: 'All HR/recruitment/employment forms including offer letters, selection panel reports, staff management forms, and eduPay access management.', url: 'https://www2.education.vic.gov.au/pal/forms-teaching-service-and-hr-administration/resources',
    tabs: { resources: 'https://www2.education.vic.gov.au/pal/forms-teaching-service-and-hr-administration/resources' },
    resources: [
      { title: 'Executive Class Selection Panel Report', note: '' },
      { title: 'School Based Staff — Selection Panel Report', note: '' },
      { title: 'School Checklist — Selection Documentation Retention', note: '' },
      { title: 'Offer of ongoing employment — teacher class', note: '' },
      { title: 'Offer of fixed term employment — teacher class', note: '' },
      { title: 'Offer of ongoing employment — education support class', note: '' },
      { title: 'Offer of fixed term employment — education support class', note: '' },
      { title: 'Hire or Rehire Employment Checklist', note: '' },
      { title: 'Suitability for Child Connected Work template (Word)', note: '' },
      { title: 'Employment in the Teaching Service — Validation of Personal Information (Word and PDF)', note: '' },
      { title: 'Consent to Check and Release National Police Record (Word and PDF)', note: '' },
      { title: 'Superannuation Standard Choice Form', note: 'ESS preferred — use this form only if ESS cannot be accessed' },
      { title: 'Request for Recognition of Prior Service for Leave Purpose', note: '' },
      { title: 'Request for Change to Hours or Work Schedule', note: '' },
      { title: 'Temporary resumption of an employee from family leave (Word)', note: 'draft letter for schools' },
      { title: 'School Level Consultation — Potential Excess', note: '' },
      { title: 'Application for Compassionate Transfer Status', note: '' },
      { title: 'MSS-QRG-Security Management Guide (PDF)', note: 'staff login required — eduPay additional access management for principals' },
      { title: 'Schools Recruitment: 1800 641 943', note: 'schools.recruitment@education.vic.gov.au — short-term vacancy assistance' }
    ]
  },
  { id: 53.5, title: 'Principal Selection', category: 'HR - Recruitment', tags: ['principal selection', 'principal recruitment', 'panel handbook', 'school council confidentiality', 'selection panel report', 'principal selection panel'], summary: 'Principal class selection — panel handbook, confidentiality statement, shortlisted applicants individual report template, Selection Panel Report and Recommendation. School councils are involved.', url: 'https://www2.education.vic.gov.au/pal/principal-selection/overview',
    tabs: { resources: 'https://www2.education.vic.gov.au/pal/principal-selection/resources' },
    resources: [
      { title: 'Principal Selection Panel Member Handbook', note: '' },
      { title: 'School Council Confidentiality Statement', note: '' },
      { title: 'Shortlisted applicants individual report template', note: '' },
      { title: 'Selection Panel Report and Recommendation', note: '' }
    ]
  },
  // HR - Performance
  { id: 24, title: 'Performance and Development for Teacher Class Employees', category: 'HR - Performance', tags: ['pdp', 'performance', 'development', 'teacher', 'soe', 'statement of expectation', 'goal setting', 'apst', 'australian professional standards', 'aip', 'ssp', 'mid-cycle review', 'end-cycle review', 'whole-of-practice', '4 goals'], summary: '2026 allows choice between Statement of Expectation (SoE) and Performance and Development Plan (PDP). Calendar year cycle; progression cycle May to April. 4 goals aligned to APST Domains + Student Outcomes.', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/overview',
    tabs: { overview: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/overview', policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/policy-and-guidelines/whole-practice', resources: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/resources' },
    chapters: [
      { title: 'A whole-of-practice approach', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/policy-and-guidelines/whole-practice' },
      { title: 'The performance and development approach', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/policy-and-guidelines/performance-and-0' },
      { title: 'Goal setting', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/policy-and-guidelines/goal-setting' },
      { title: 'Performance and development and the Annual Implementation Plan', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/policy-and-guidelines/performance-and' },
      { title: 'Support and resources', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-teacher-class-employees/policy-and-guidelines/support-and-resources' }
    ],
    resources: [
      { title: '2025/2026 Statement of Expectation — Guide for teachers', note: '' },
      { title: 'Performance and Development Guidelines for Teacher Class Employees', note: '' },
      { title: 'Annotated PDP Template for Teacher Class Employees (Figure 3)', note: 'includes Professional Knowledge, Professional Engagement, Student Outcomes goal fields' },
      { title: 'PDP documentation in eduPay', note: 'records formal review conversations (mid-cycle and end-cycle)' },
      { title: 'Australian Professional Standards for Teachers (AITSL)', note: '' },
      { title: 'Classroom Practice Continuum (AITSL)', note: '' },
      { title: 'Goal setting guides and sample goals', note: '' },
      { title: 'Reflection templates, video case studies, online modules', note: '' },
      { title: 'Victorian Academy for Teaching and Leadership Professional Learning Catalogue', note: '' },
      { title: 'Contact: school.leadership@education.vic.gov.au', note: 'for further PDP information' }
    ]
  },
  { id: 25, title: 'Performance and Development for Principal Class Employees', category: 'HR - Performance', tags: ['pdp', 'performance', 'principal', 'assistant principal', 'seil', 'calendar year', 'bastow', 'victorian academy', 'end-cycle review'], summary: 'Performance and development for principal class on calendar year cycle. SEIL involvement for end-cycle reviews. Professional learning via Victorian Academy for Teaching and Leadership (formerly Bastow).', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/performance-and-development-approach',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/performance-and-development-approach', resources: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/resources' },
    resources: [
      { title: 'Performance and Development Plans templates for principal class', note: 'staff login required — performance and development intranet' },
      { title: 'Bastow Institute of Educational Leadership / Victorian Academy for Teaching and Leadership', note: 'professional learning catalogue' },
      { title: 'Goal setting guides and sample goals for principals', note: '' },
      { title: 'Performance and development supports for principal class employees', note: '' },
      { title: 'Contact: school.leadership@education.vic.gov.au', note: '' }
    ],
  chapters: [
    { title: '2021 Statement of Expectation for Principal Class Employees — PDP, eduPay, Tutor Learning Initiative, student wellbeing, teaching programs', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/2021-statement-expectation' },
    { title: '2022 Statement of Expectation for Principal Class Employees — PDP, eduPay, Victorian Curriculum F-10, AIP, key improvement strategies', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/2022-statement-expectation' },
    { title: '2023 Statement of Expectation for Principal Class Employees — PDP, eduPay, Victorian Curriculum F-10, AIP, school climate', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/2023-statement-of-expectation-for-principal-class-employees' },
    { title: '2024 Statement of Expectation for Principal Class Employees — SoE, PDP, eduPay, AIP, SEIL, 30 April 2024', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/2024-statement-expectation' },
    { title: '2025 Statement of Expectation for Principals — SoE, PDP, eduPay, AIP, SEIL, 30 April 2025, semester 2', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/2025-statement-of-expectations-principals' },
    { title: 'Introduction — Australian Professional Standard, Leithwood 2004, whole-of-practice approach, PDP cycle, core accountabilities', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/introduction' },
    { title: 'The distinct role of principals — Dufour and Marzano 2011, Robinson 2009, Day and Sammons 2013, evidence-based reflection', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/distinct-role-principals' },
    { title: 'The Framework for Improving Student Outcomes, whole school planning and the Annual Implementation Plan — FISO, AIP, 4 year strategic plan, SEILs, EILs, SRP', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/framework-improving-student-outcomes-whole' },
    { title: 'Performance and development and the Annual Implementation Plan — AIP, SSP, PDP, SPOT, 4 years, milestones', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/performance-and-development-and-annual' },
    { title: 'Department\'s Values — VPS Values, Department of Education and Training, public sector values', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/departments-values' },
    { title: 'Online Performance and Development Plan — online PDP, 2017, aggregate data, contractual arrangement', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/online-pdp' },
    { title: 'Goal setting — Australian Professional Standard, Domains of Principal Practice, Leadership Practices', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/goal-setting' },
    { title: 'A whole-of-practice approach — Australian Professional Standard, SSP, AIP, PDP, 4 goals, Leadership Practices', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/whole-practice-approach' },
    { title: 'The performance and development approach — step-by-step guide, performance and development cycle', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/performance-and-development-approach' },
    { title: 'Support and resources — AITSL, Teacher Class, Online PDP, self-reviews', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/support-and-resources' },
    { title: 'Other information — VGSA 2017, remuneration progression, 1 May, 6 months service', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/other-information' },
    { title: '2026 Statement of Expectation for Principals — SoE, PDP, eduPay, AIP, SEIL, 30 April 2026, semester 2', url: 'https://www2.education.vic.gov.au/pal/performance-and-development-principal-class/policy-and-guidelines/2026-statement-of-expectation-for-principals' }
  ],
},
  { id: 26, title: 'Performance and Development for Education Support Class Employees', category: 'HR - Performance', tags: ['pdp', 'performance', 'education support', 'esc', 'soe', 'business manager', 'business manager capability framework', 'koorie engagement support officer', 'kesso'], summary: '2026 allows choice between Statement of Expectation (SoE) and PDP. Business Manager Capability Framework applies. KESSO (Koorie Engagement Support Officers) have specific arrangements.', url: 'https://www2.education.vic.gov.au/pal/performance-development-education-support/overview',
    resources: [
      { title: 'Performance and Development Guidelines for Education Support Class Employees', note: 'includes KESSO arrangements' },
      { title: 'Business Manager Capability Framework', note: '' },
      { title: 'Performance and development supports for education support class employees', note: '' },
      { title: 'Performance and development supports for Koorie engagement support officers', note: '' },
      { title: 'Contact: school.leadership@education.vic.gov.au', note: '' }
    ],
  tabs: [ 'Skip to main content' ],
},

  // HR - Conduct
  { id: 27, title: 'Managing Conduct and Unsatisfactory Performance in the Teaching Service', category: 'HR - Conduct', tags: ['conduct', 'misconduct', 'unsatisfactory performance', 'discipline', 'etra', 'local resolution', 'conduct and integrity division', 'reportable conduct', 'employee conduct branch', 'sexual assault', 'criminal offences', 'disciplinary appeals board', 'merit protection board', 'support period', 'secretary delegate'], summary: 'Managing conduct or performance concerns through local resolution, misconduct under ETRA Division 10 of Part 2.4, and unsatisfactory performance. Reportable conduct and sexual assault/criminal allegations must go to Employee Conduct Branch/Victoria Police.', url: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/overview', popular: true,
    tabs: { overview: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/overview', policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/policy-and-guidelines/', resources: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/resources' },
    chapters: [
      { title: 'Part 1 — Introduction', url: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/policy-and-guidelines/' },
      { title: 'Part 2 — Managing conduct or performance concerns through a local resolution procedure', url: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/policy-and-guidelines/' },
      { title: 'Part 3 — Managing misconduct under Division 10 of Part 2.4 of the ETRA', url: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/policy-and-guidelines/' },
      { title: 'Part 4 — Managing unsatisfactory performance', url: 'https://www2.education.vic.gov.au/pal/complaints-misconduct-and-unsatisfactory-performance/policy-and-guidelines/part-4-managing-unsatisfactory-performance' }
    ],
    resources: [
      { title: 'Informal complaint or local resolution meeting template (DOCX)', note: 'for Part 2 local resolution procedure' },
      { title: 'Monitoring and supervision template — risk mitigation plan (DOCX)', note: 'staff login required' },
      { title: 'Complaints, misconduct and unsatisfactory performance guidelines (PDF)', note: 'comprehensive downloadable guide' },
      { title: 'Human Resources — complaint procedure FAQs (PDF)', note: '' },
      { title: 'Conduct and Integrity Division: 03 7034 6768', note: 'for sexual harassment, reportable conduct, bullying' },
      { title: 'Employee Conduct Branch', note: 'contact for misconduct matters, sexual assault/criminal allegations, reportable conduct' },
      { title: 'Merit Protection Board', note: 'for formal grievances about employment decisions' }
    ]
  },
  { id: 28, title: 'Grievances — Teaching Service', category: 'HR - Conduct', tags: ['grievance', 'complaint', 'dispute'], summary: 'Grievance resolution processes for teaching service employees.', url: 'https://www2.education.vic.gov.au/pal/grievances-teaching-service/policy' },
  { id: 29, title: 'Human Rights Charter', category: 'HR - Conduct', tags: ['human rights', 'charter', 'respectful workplace', 'inclusion'], summary: 'Charter of Human Rights and Responsibilities obligations for Victorian public sector workers.', url: 'https://www2.education.vic.gov.au/pal/human-rights-charter/policy' },
  { id: 30, title: 'Workplace Contact Officer (WCO) Network', category: 'HR - Conduct', tags: ['wco', 'workplace contact officer', 'support', 'confidential'], summary: 'Workplace Contact Officers — confidential contact for harassment, discrimination, bullying, victimisation or family violence support.', url: 'https://www2.education.vic.gov.au/pal/workplace-contact-officer-wco-network/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/workplace-contact-officer-wco-network/overview#rpl-main' }
  ],
},
  { id: 31, title: 'Sexual Harassment — Employees', category: 'HR - Conduct', tags: ['sexual harassment', 'harassment', 'conduct and integrity'], summary: 'Sexual harassment is unlawful and not tolerated. Report to principal/manager or Conduct and Integrity Division (03 7034 6768).', url: 'https://www2.education.vic.gov.au/pal/sexual-harassment/overview',
  tabs: [ 'Skip to main content' ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/sexual-harassment/overview#rpl-main' }
  ],
},
  { id: 32, title: 'Workplace Bullying', category: 'HR - Conduct', tags: ['bullying', 'workplace', 'psychological', 'ohs'], summary: 'Preventing workplace bullying as a psychological safety obligation under OHS Act 2004.', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1 What is bullying? — repeated unreasonable behaviour, email, social media, criminal offence, Department\'s Values', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/1-what-bullying' },
    { title: '2 What isn’t bullying — reasonable management actions', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/2-what-isnt-bullying' },
    { title: '3 Responsibilities — OHS Act 2004, EWSS, Respectful and Inclusive Workplaces, eLearn modules, HSR', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/3-responsibilities-department' },
    { title: '4 How to report bullying — HSR, principal\'s delegate, formal complaint, anonymous reporting, written allegations', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/4-how-report-bullying' },
    { title: '5 Responding to reports of bullying — Conduct and Integrity Division, disciplinary proceedings, complaints resolution, misconduct', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/5-responding-reports-bullying' },
    { title: '6 Support and assistance — HSR, union representative, department services, complaint resolution', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/6-support-and-assistance' },
    { title: '7 Further application — volunteers, school council employees, contractors, Workplace Bullying Policy', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/7-further-application' },
    { title: '8 Legislation, codes of practice, standards and guidance — Equal Opportunity Act 2010, Fair Work Act 2009, OHS Act 2004', url: 'https://www2.education.vic.gov.au/pal/workplace-bullying/procedure/8-legislation-codes-practice-standards-and-guidance' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/workplace-bullying/policy#rpl-main' }
  ],
},
  { id: 33, title: 'Equal Opportunity — Employees', category: 'HR - Conduct', tags: ['equal opportunity', 'discrimination', 'victimisation', 'vilification', 'protected attributes'], summary: 'Equal opportunity obligations, protected attributes and avoiding discrimination or victimisation.', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity/policy' },
  { id: 34, title: 'Inclusive Workplaces', category: 'HR - Conduct', tags: ['inclusive', 'diversity', 'disability', 'accessibility', 'workforce diversity'], summary: 'Creating inclusive workplaces for employees with disabilities and from diverse backgrounds.', url: 'https://www2.education.vic.gov.au/pal/inclusive-workplaces/policy' },
  { id: 35, title: 'Respectful Workplaces', category: 'HR - Conduct', tags: ['respectful', 'bullying', 'harassment', 'discrimination'], summary: 'Reporting bullying, harassment, discrimination or victimisation. Contact Conduct and Integrity Division 03 7034 6768.', url: 'https://www2.education.vic.gov.au/pal/respectful-workplaces/policy' },
  { id: 36, title: 'Industrial Action — Teaching Service', category: 'HR - Conduct', tags: ['industrial action', 'strike', 'stopwork', 'protected action'], summary: 'Industrial action arrangements, stopwork action, and duty of care obligations during action.', url: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/duty-care',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Introduction — stopwork action, casual relief teachers, 3 hours minimum, parent supervision, voluntary workers', url: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/introduction' },
    { title: 'Notification to parents — stopwork action, day before, supervision arrangements, dismissal arrangements', url: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/notification-parents' },
    { title: 'Duty of care — duty of care, Personal Liability, legal indemnity, school premises, students\' care', url: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/duty-care' },
    { title: 'Student dismissal — compulsory school age, dismissal, parent notification, supervision', url: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/student-dismissal' },
    { title: 'Industrial action — stopwork action, work bans, protected action ballot, Fair Work Act 2009, 48 hours notice, Regional Director', url: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/industrial-action' },
    { title: 'Reporting requirements — online notification forms, 48 hours, statewide, regional, district, Regional Director', url: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/reporting-requirements' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/industrial-action-teaching-service/policy-and-guidelines/duty-care#rpl-main' }
  ],
},

  // Finance (37-52, plus 41.5, 41.6, 41.7, 41.8)
  { id: 37, title: 'Finance Manual — Financial Management for Schools', category: 'Finance', tags: ['finance manual', 'fmvgs', 'cases21', 'school finance', 'accounting', 'reconciliation', 'budget', 'trading', 'gst', 'bank', 'business manager', 'business process guide', 'chart of accounts', 'petty cash', 'electronic funds', 'purchasing card', 'school purchasing card', 'spc', 'end of year', 'eoy', 'balance day adjustment', 'financial handover', 'insurance', 'travel insurance', 'vmia', 'victorian managed insurance authority', 'section 21', 'sash', 'school administration support hub', 'mygovid', 'westpac'], summary: 'The comprehensive finance manual for Victorian Government Schools covering all aspects of financial management. 20 sections plus extensive downloadable templates. Section 21 covers insurance arrangements including travel insurance via VMIA.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/finance-manual/policy', guidance: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance', resources: 'https://www2.education.vic.gov.au/pal/finance-manual/resources' },
    chapters: [
      { title: 'Section 2 — Governance', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance' },
      { title: 'Section 3 — Risk Management', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management' },
      { title: 'Section 4 — Internal Controls', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls' },
      { title: 'Section 5 — School Council Financial Assurance Program', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program' },
      { title: 'Section 6 — Budget Management', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management' },
      { title: 'Section 7 — Chart of Accounts', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts' },
      { title: 'Section 8 — Bank Accounts', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts' },
      { title: 'Section 9 — Funding Sources', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources' },
      { title: 'Section 10 — Receivables Management and Cash Handling', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling' },
      { title: 'Section 11 — Expenditure Management', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management' },
      { title: 'Section 12 — Trading Operations', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations' },
      { title: 'Section 13 — Asset and Inventory Management', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management' },
      { title: 'Section 14 — Liabilities Management', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management' },
      { title: 'Section 15 — Taxation', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation' },
      { title: 'Section 16 — Reporting Performance', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance' },
      { title: 'Section 17 — End of Year (31 December)', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december' },
      { title: 'Section 18 — End of Financial Year Reporting (30 June)', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june' },
      { title: 'Section 19 — Financial Handover', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover' },
      { title: 'Section 20 — Opening, Closing and Merging Schools', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools' },
      { title: 'Section 21 — Insurance Arrangements', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
    ],
    resources: [
      { title: 'Finance Manual — Financial Management for Schools (PDF)', note: 'complete downloadable version', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-financial-management-for-schools-1858' },
      { title: 'School Banking', note: 'staff login required — HYIA Amendment of Signatories, HYIA Funds Transfer, Intellilink Quick Guide, Maintaining a School Purchasing Card Facility, Merchant Facility, Online Banking, SPC Bank Contacts and FAQs' },
      { title: 'Ministerial guidelines and directions (PDF)', note: 'School Purchasing Card', url: 'https://content.sdp.education.vic.gov.au/media/card-minister-direct-726' },
      { title: 'Schools purchasing and virtual cards guidelines and procedures (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/schools-purchasing-and-virtual-cards-guidelines-and-procedures-2442' },
      { title: 'Undertaking by the cardholder (DOCX)', note: 'for purchasing card holders', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-undertaking-by-cardholder-1860' },
      { title: 'A guide to budget management in Victorian government schools (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/financial-budget-management-docx-740' },
      { title: 'A guide to budget management in Victorian government schools (PDF)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/financial-budget-management-pdf-741' },
      { title: 'Annual master budget summary with monthly cashflow template (XLSM)', note: 'Excel macro-enabled budget template', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-annual-master-budget-summary-with-monthly-cash-flow-template-1855' },
      { title: 'Cash budget spreadsheet user guide (PDF)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/cash-budget-spreadsheet-user-guide-1405' },
      { title: 'Budget submission proforma (XLSX)', note: 'Excel budget submission template', url: 'https://content.sdp.education.vic.gov.au/media/cases21-budget-submission-proforma-1315' },
      { title: 'Asset status change request form (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-asset-status-change-request-form-1856' },
      { title: 'Financial commitment summary guidelines (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/financial-commitment-summary-guidelines-1861' },
      { title: 'Operating statement — practical example and explanation (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-operating-statement-docx-717' },
      { title: 'Operating statement — practical example and explanation (PDF)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-operating-statement-pdf-718' },
      { title: 'The balance sheet — practical example and explanation (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-the-balance-sheet-docx-722' },
      { title: 'The balance sheet — practical example and explanation (PDF)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-the-balance-sheet-pdf-723' },
      { title: 'Tracked balance tool — monthly version (XLSM)', note: 'Excel tool for monthly balance tracking', url: 'https://content.sdp.education.vic.gov.au/media/cases21-probalance-tool-month-733' },
      { title: 'Tracking subprogram balances (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-tracked-balances-docx-724' },
      { title: 'Tracking subprogram balances (PDF)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-tracked-balances-pdf-725' },
      { title: 'Accounting concepts for CASES21 finance (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-accounting-concepts-714' },
      { title: 'Cash handling best practice controls (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/cash-handling-best-practice-controls-738' },
      { title: 'Cash handling authorised form — fundraising collection (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/cash-handling-authorised-form-fundraising-collection-735' },
      { title: 'Cash handling authorised form — sale of items (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/cash-handling-authorised-form-sale-of-items-736' },
      { title: 'Cash handling authorised form — ticket sales not at office (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/cash-handling-authorised-form-ticket-sales-not-at-office-737' },
      { title: 'Chart of accounts for Victorian government schools (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-chart-of-accounts-for-victorian-government-schools-docx-809' },
      { title: 'Chart of accounts for Victorian government schools (PDF)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-chart-of-accounts-for-victorian-government-schools-pdf-810' },
      { title: 'Financial handover statement (DOCX)', note: 'for outgoing principals', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-financial-handover-statement-template-1857' },
      { title: 'Financial reporting for schools (DOC)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-financial-reporting-for-schools-docx-1308' },
      { title: 'Financial reporting for schools (PDF)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-financial-reporting-for-schools-pdf-1309' },
      { title: 'Guide to school council and finance motions (PDF)', note: 'agenda items and motions for school council', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-school-council-motions-808' },
      { title: 'GST and FBT information', note: 'staff login required — on edugate' },
      { title: 'GST calculator (XLS)', note: 'Excel GST calculator', url: 'https://content.sdp.education.vic.gov.au/media/cases21-pro-gst-calculator-734' },
      { title: 'Journal generator (XLSM)', note: 'Excel macro-enabled journal generator', url: 'https://content.sdp.education.vic.gov.au/media/c21-journal-generator-715' },
      { title: 'myGovID website', note: 'for business tax authentication' },
      { title: 'Reimbursement request form (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/reimbursement-request-form-748' },
      { title: 'School activities reconciliation (DOCX)', note: 'reconciliation template for school council presentation', url: 'https://content.sdp.education.vic.gov.au/media/school-activities-reconciliation-2937' },
      { title: 'School activities costing (DOCX)', note: 'costing template for school activities', url: 'https://content.sdp.education.vic.gov.au/media/school-activities-costing-2938' },
      { title: 'School certification checklist', note: 'staff login required — edugate' },
      { title: 'School electronic funds management guidelines (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/school-electronic-funds-management-guidelines-2435' },
      { title: 'School cash reserve benchmark policy and guidelines (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/school-cash-reserve-benchmark-policy-guidelines-2268' },
      { title: 'Segregation of duties — cash checklist (DOCX)', note: '', url: 'https://content.sdp.education.vic.gov.au/media/c21-segregation-of-duty-cash-checklist-719' },
      { title: 'Trading profit and loss (examples and proforma)', note: 'P and L template for trading operations', url: 'https://content.sdp.education.vic.gov.au/media/trading-act-proforma-2013-750' },
      { title: 'CASES21 Finance business process guides', note: 'staff login required — includes Families, Sundry Debtors, Creditors, Assets, General Ledger, Budgets, End of Period, Balance Day Adjustments, End of Year, Batches, Handy Hints, Calendar, Purchase Requisitions' },
      { title: 'Cash handling — policy template', note: 'School Policy Templates Portal' },
      { title: 'Electronic funds management — policy template', note: 'School Policy Templates Portal' },
      { title: 'Petty cash — template policy', note: 'School Policy Templates Portal' },
      { title: 'School purchasing card — template policy', note: 'School Policy Templates Portal' },
      { title: 'eCases', note: 'staff login required — web app for school staff to access CASES21' },
      { title: 'CASES21 Portal', note: 'staff login required — user guides, useful links, troubleshooting recordings and data request form' },
      { title: 'CASES21 Training', note: 'financial training for principals' },
      { title: 'DE Services Portal', note: 'staff login required — raise a ticket for CASES21 IT support' },
      { title: 'Financial support and strategic management for schools', note: 'staff login required — SharePoint' },
      { title: 'Tax resources', note: 'staff login required — edugate' },
      { title: 'Professional development in financial management', note: 'staff login required — edugate' },
      { title: 'Schools targeted funding portal', note: 'staff login required' },
      { title: 'School Administration Support Hub (SASH)', note: 'staff login required — centralised support for small schools (up to 200 students); helps with finance and payroll admin' },
      { title: 'Contact: schools.finance.support@education.vic.gov.au', note: 'School Purchasing Card and Schools Financial Management enquiries' },
      { title: 'Contact: schools.certification@education.vic.gov.au', note: 'Schools Certification Checklist enquiries' },
      { title: 'Contact: tax@education.vic.gov.au', note: 'Taxation enquiries' },
      { title: 'Contact: insurance.enquiries@education.vic.gov.au', note: 'Insurance enquiries including travel insurance, VMIA coverage, claims' },
      { title: 'Section 21 — Insurance Arrangements', note: 'covers VMIA (Victorian Managed Insurance Authority) coverage, domestic and international travel insurance, property, liability, personal accident' },
      { title: 'Contact: schools.targeted.funding.governance@education.vic.gov.au', note: 'Schools Targeted Funding Governance' },
      { title: 'Contact: vicgovernmentservice@westpac.com.au', note: 'Westpac general enquiries' }
    ]
  },
  { id: 38, title: 'Finance Manual — Section 9 Funding Sources', category: 'Finance', tags: ['funding', 'sources', 'contributions', 'building fund', 'library fund', 'dgr', 'srp', 'cash grant', '70001', 'schools targeted funding portal', '74408', '74409', '74410'], summary: 'SRP, targeted funding, parent contributions. Use CASES21 GL code 70001 for SRP Cash Grant receipts. DGR endorsement required for building/library funds. Curriculum Contributions GL 74408, Extra-Curricular 74409, Other 74410.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance — ETRA 2006, Financial Management Act 1994, GST Act 1999, FBT Act 1986, Income Tax Assessment Act 1997', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance' },
    { title: 'Section 3 Risk Management — Risk Management Schools Policy, fraud, corruption, zero tolerance', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management' },
    { title: 'Section 4 Internal Controls — CASES21, segregation of duties, invoice approval, fraud prevention', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls' },
    { title: 'Section 5 School Council Financial Assurance Program — SCFA, AUPs, SIA, Assurance Branch, OPSEC, 03 7022 0044', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program' },
    { title: 'Section 6 Budget Management — indicative cash budget, SRP, school council approval, 2026 budget, variance analysis', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management' },
    { title: 'Section 7 Chart of Accounts — CASES21, Chart of Accounts, Victorian Government Schools, miscoding errors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts' },
    { title: 'Section 8 Bank Accounts — school council name, ABN, SPC, panel bank, cash flow budget', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts' },
    { title: 'Section 10 Receivables Management and Cash Handling — EFTPOS, BPAY, CASES21, sundry debtors, Parent Payments policy, GST codes', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling' },
    { title: 'Section 11 Expenditure Management — Procurement Schools, Travel, Gifts Benefits Hospitality, Travel and Personal Expenses', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management' },
    { title: 'Section 12 Trading Operations — canteen, out of school hours care, kindergartens, Legal Services 9637 3146, taxation treatment', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations' },
    { title: 'Section 13 Asset and Inventory Management — CASES21 Finance, Financial Management Act 1994, Part 5, asset register, accounting standards', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management' },
    { title: 'Section 14 Liabilities Management — accounts payable, revenue in advance, co-operative loans, ABN, CASES21 Section 3 Creditors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management' },
    { title: 'Section 15 Taxation — Section 24AK, Income Tax Assessment Act 1936, ABN, GST, ABR Business Search', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation' },
    { title: 'Section 16 Reporting Performance — bank reconciliation, monthly, CASES21, principal certified, overdrawn', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance' },
    { title: 'Section 17 End of Year (31 December) — 31 December, CASES21, EOY, Section 11 End of Year, rollover, 1 January', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december' },
    { title: 'Section 18 End of Financial Year Reporting (30 June) — 30 June, CASES21, Code 12005 Prepaid expenses, accounts receivable, accounts payable', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june' },
    { title: 'Section 19 Financial Handover — DOCX handover statement, CASES21, asset register, stocktake, two terms', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover' },
    { title: 'Section 20 Opening, Closing and Merging Schools — SFLO, Westpac, High Yield Investment, SPC, CASES21 setup, Regional Finance Officer', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools' },
    { title: 'Section 21 Insurance Arrangements — VMIA, 30 June, SCIP, $3.625 billion, $3 million self-insured, SECS, Reinstatement Fund', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 39, title: 'Finance Manual — Section 11 Expenditure Management', category: 'Finance', tags: ['expenditure', 'purchase order', 'petty cash', 'purchasing card', 'imprest', 'delegations', 'reimbursement request form', 'payment voucher', 'accounts payable'], summary: 'Expenditure controls, purchase orders, purchasing cards, petty cash (imprest system). Use Reimbursement Request Form before processing in CASES21. Attach POs, invoices, quotes to payment vouchers and mark paid immediately.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance — ETRA 2006, Financial Management Act 1994, GST Act 1999, FBT Act 1986, Income Tax Assessment Act 1997', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance' },
    { title: 'Section 3 Risk Management — Risk Management Schools Policy, fraud, corruption, zero tolerance', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management' },
    { title: 'Section 4 Internal Controls — CASES21, segregation of duties, invoice approval, fraud prevention', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls' },
    { title: 'Section 5 School Council Financial Assurance Program — SCFA, AUPs, SIA, Assurance Branch, OPSEC, 03 7022 0044', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program' },
    { title: 'Section 6 Budget Management — indicative cash budget, SRP, school council approval, 2026 budget, variance analysis', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management' },
    { title: 'Section 7 Chart of Accounts — CASES21, Chart of Accounts, Victorian Government Schools, miscoding errors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts' },
    { title: 'Section 8 Bank Accounts — school council name, ABN, SPC, panel bank, cash flow budget', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts' },
    { title: 'Section 9 Funding Sources — SRP, enrolment-based, quarterly instalments, remittance advices, annual reconciliation', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources' },
    { title: 'Section 10 Receivables Management and Cash Handling — EFTPOS, BPAY, CASES21, sundry debtors, Parent Payments policy, GST codes', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling' },
    { title: 'Section 12 Trading Operations — canteen, out of school hours care, kindergartens, Legal Services 9637 3146, taxation treatment', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations' },
    { title: 'Section 13 Asset and Inventory Management — CASES21 Finance, Financial Management Act 1994, Part 5, asset register, accounting standards', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management' },
    { title: 'Section 14 Liabilities Management — accounts payable, revenue in advance, co-operative loans, ABN, CASES21 Section 3 Creditors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management' },
    { title: 'Section 15 Taxation — Section 24AK, Income Tax Assessment Act 1936, ABN, GST, ABR Business Search', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation' },
    { title: 'Section 16 Reporting Performance — bank reconciliation, monthly, CASES21, principal certified, overdrawn', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance' },
    { title: 'Section 17 End of Year (31 December) — 31 December, CASES21, EOY, Section 11 End of Year, rollover, 1 January', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december' },
    { title: 'Section 18 End of Financial Year Reporting (30 June) — 30 June, CASES21, Code 12005 Prepaid expenses, accounts receivable, accounts payable', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june' },
    { title: 'Section 19 Financial Handover — DOCX handover statement, CASES21, asset register, stocktake, two terms', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover' },
    { title: 'Section 20 Opening, Closing and Merging Schools — SFLO, Westpac, High Yield Investment, SPC, CASES21 setup, Regional Finance Officer', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools' },
    { title: 'Section 21 Insurance Arrangements — VMIA, 30 June, SCIP, $3.625 billion, $3 million self-insured, SECS, Reinstatement Fund', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 40, title: 'Finance Manual — Section 12 Trading Operations', category: 'Finance', tags: ['trading operations', 'canteen', 'uniform shop', 'gst', 'taxation'], summary: 'Trading operations and taxation treatment. School council must nominate tax treatment annually.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance — ETRA 2006, Financial Management Act 1994, GST Act 1999, FBT Act 1986, Income Tax Assessment Act 1997', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance' },
    { title: 'Section 3 Risk Management — Risk Management Schools Policy, fraud, corruption, zero tolerance', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management' },
    { title: 'Section 4 Internal Controls — CASES21, segregation of duties, invoice approval, fraud prevention', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls' },
    { title: 'Section 5 School Council Financial Assurance Program — SCFA, AUPs, SIA, Assurance Branch, OPSEC, 03 7022 0044', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program' },
    { title: 'Section 6 Budget Management — indicative cash budget, SRP, school council approval, 2026 budget, variance analysis', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management' },
    { title: 'Section 7 Chart of Accounts — CASES21, Chart of Accounts, Victorian Government Schools, miscoding errors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts' },
    { title: 'Section 8 Bank Accounts — school council name, ABN, SPC, panel bank, cash flow budget', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts' },
    { title: 'Section 9 Funding Sources — SRP, enrolment-based, quarterly instalments, remittance advices, annual reconciliation', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources' },
    { title: 'Section 10 Receivables Management and Cash Handling — EFTPOS, BPAY, CASES21, sundry debtors, Parent Payments policy, GST codes', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling' },
    { title: 'Section 11 Expenditure Management — Procurement Schools, Travel, Gifts Benefits Hospitality, Travel and Personal Expenses', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management' },
    { title: 'Section 13 Asset and Inventory Management — CASES21 Finance, Financial Management Act 1994, Part 5, asset register, accounting standards', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management' },
    { title: 'Section 14 Liabilities Management — accounts payable, revenue in advance, co-operative loans, ABN, CASES21 Section 3 Creditors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management' },
    { title: 'Section 15 Taxation — Section 24AK, Income Tax Assessment Act 1936, ABN, GST, ABR Business Search', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation' },
    { title: 'Section 16 Reporting Performance — bank reconciliation, monthly, CASES21, principal certified, overdrawn', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance' },
    { title: 'Section 17 End of Year (31 December) — 31 December, CASES21, EOY, Section 11 End of Year, rollover, 1 January', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december' },
    { title: 'Section 18 End of Financial Year Reporting (30 June) — 30 June, CASES21, Code 12005 Prepaid expenses, accounts receivable, accounts payable', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june' },
    { title: 'Section 19 Financial Handover — DOCX handover statement, CASES21, asset register, stocktake, two terms', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover' },
    { title: 'Section 20 Opening, Closing and Merging Schools — SFLO, Westpac, High Yield Investment, SPC, CASES21 setup, Regional Finance Officer', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools' },
    { title: 'Section 21 Insurance Arrangements — VMIA, 30 June, SCIP, $3.625 billion, $3 million self-insured, SECS, Reinstatement Fund', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 41, title: 'Finance Manual — Section 13 Asset and Inventory Management', category: 'Finance', tags: ['assets', 'inventory', 'cases21', 'asset register', 'depreciation', '5000', 'asset status change'], summary: 'Asset management. Add to CASES21 Asset Register within 30 days. Portable/attractive items $5,000+ tracked. Use Asset status change request form.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance — ETRA 2006, Financial Management Act 1994, GST Act 1999, FBT Act 1986, Income Tax Assessment Act 1997', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance' },
    { title: 'Section 3 Risk Management — Risk Management Schools Policy, fraud, corruption, zero tolerance', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management' },
    { title: 'Section 4 Internal Controls — CASES21, segregation of duties, invoice approval, fraud prevention', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls' },
    { title: 'Section 5 School Council Financial Assurance Program — SCFA, AUPs, SIA, Assurance Branch, OPSEC, 03 7022 0044', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program' },
    { title: 'Section 6 Budget Management — indicative cash budget, SRP, school council approval, 2026 budget, variance analysis', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management' },
    { title: 'Section 7 Chart of Accounts — CASES21, Chart of Accounts, Victorian Government Schools, miscoding errors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts' },
    { title: 'Section 8 Bank Accounts — school council name, ABN, SPC, panel bank, cash flow budget', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts' },
    { title: 'Section 9 Funding Sources — SRP, enrolment-based, quarterly instalments, remittance advices, annual reconciliation', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources' },
    { title: 'Section 10 Receivables Management and Cash Handling — EFTPOS, BPAY, CASES21, sundry debtors, Parent Payments policy, GST codes', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling' },
    { title: 'Section 11 Expenditure Management — Procurement Schools, Travel, Gifts Benefits Hospitality, Travel and Personal Expenses', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management' },
    { title: 'Section 12 Trading Operations — canteen, out of school hours care, kindergartens, Legal Services 9637 3146, taxation treatment', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations' },
    { title: 'Section 14 Liabilities Management — accounts payable, revenue in advance, co-operative loans, ABN, CASES21 Section 3 Creditors', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management' },
    { title: 'Section 15 Taxation — Section 24AK, Income Tax Assessment Act 1936, ABN, GST, ABR Business Search', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation' },
    { title: 'Section 16 Reporting Performance — bank reconciliation, monthly, CASES21, principal certified, overdrawn', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance' },
    { title: 'Section 17 End of Year (31 December) — 31 December, CASES21, EOY, Section 11 End of Year, rollover, 1 January', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december' },
    { title: 'Section 18 End of Financial Year Reporting (30 June) — 30 June, CASES21, Code 12005 Prepaid expenses, accounts receivable, accounts payable', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june' },
    { title: 'Section 19 Financial Handover — DOCX handover statement, CASES21, asset register, stocktake, two terms', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover' },
    { title: 'Section 20 Opening, Closing and Merging Schools — SFLO, Westpac, High Yield Investment, SPC, CASES21 setup, Regional Finance Officer', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools' },
    { title: 'Section 21 Insurance Arrangements — VMIA, 30 June, SCIP, $3.625 billion, $3 million self-insured, SECS, Reinstatement Fund', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 41.5, title: 'Finance Manual — Section 6 Budget Management', category: 'Finance', tags: ['budget', 'indicative budget', 'confirmed srp', 'cash flow budget', 'variance analysis', 'finance committee'], summary: 'Budget process. Enter indicative cash budget into CASES21 before first school council meeting; update once Confirmed SRP is released. Reconcile CASES21 budget to school council-approved budget.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance Section 3 Risk Management Section 4 Internal Controls Section 5 School Council Financial Assurance Program Section 6 Budget Management Section 7 Chart of Accounts Section 8 Bank Accounts Section 9 Funding Sources Section 10 Receivables Management and Cash Handling Section 11 Expenditure Management Section 12 Trading Operations Section 13 Asset and Inventory Management Section 14 Liabilities Management Section 15 Taxation Section 16 Reporting Performance Section 17 End of Year (31 December) Section 18 End of Financial Year Reporting (30 June) Section 19 Financial Handover Section 20 Opening, Closing and Merging Schools Section 21 Insurance Arrangements — ETRA 2006, Financial Management Act 1994, GST Act 1999, FBT Act 1986, Income Tax Assessment Act 1997', href: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 41.6, title: 'Finance Manual — Section 7 Chart of Accounts', category: 'Finance', tags: ['chart of accounts', 'coding', 'cases21', 'sub program', 'general ledger', 'schools finance and resources branch'], summary: 'All schools must adopt the standard Chart of Accounts for Victorian Government Schools. Correct coding is critical for reporting accuracy. Do not create Sub Program codes that already exist at GL level.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance Section 3 Risk Management Section 4 Internal Controls Section 5 School Council Financial Assurance Program Section 6 Budget Management Section 7 Chart of Accounts Section 8 Bank Accounts Section 9 Funding Sources Section 10 Receivables Management and Cash Handling Section 11 Expenditure Management Section 12 Trading Operations Section 13 Asset and Inventory Management Section 14 Liabilities Management Section 15 Taxation Section 16 Reporting Performance Section 17 End of Year (31 December) Section 18 End of Financial Year Reporting (30 June) Section 19 Financial Handover Section 20 Opening, Closing and Merging Schools Section 21 Insurance Arrangements — Education and Training Reform Act 2006, Financial Management Act 1994, Schedule B, principal class, school council', href: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 41.7, title: 'Finance Manual — Section 17 End of Year (31 December)', category: 'Finance', tags: ['end of year', 'eoy', '31 december', 'rollover', 'balance day adjustment', 'p drive', 'creditors'], summary: 'EOY financial policy. Review/clean up Families module for exiting students before Admin EOY. EOY rollover not before 1 Jan. Store EOY files on P drive. Enter all unpaid December invoices into CASES21 creditors.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance Section 3 Risk Management Section 4 Internal Controls Section 5 School Council Financial Assurance Program Section 6 Budget Management Section 7 Chart of Accounts Section 8 Bank Accounts Section 9 Funding Sources Section 10 Receivables Management and Cash Handling Section 11 Expenditure Management Section 12 Trading Operations Section 13 Asset and Inventory Management Section 14 Liabilities Management Section 15 Taxation Section 16 Reporting Performance Section 17 End of Year (31 December) Section 18 End of Financial Year Reporting (30 June) Section 19 Financial Handover Section 20 Opening, Closing and Merging Schools Section 21 Insurance Arrangements — Education and Training Reform Act 2006, Financial Management Act 1994, Schedule B, principal class, school council', href: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 41.8, title: 'Finance Manual — Section 19 Financial Handover', category: 'Finance', tags: ['handover', 'financial handover statement', 'outgoing principal', 'stocktake', 'incoming principal'], summary: 'Outgoing principals ensure CASES21 records (including asset register) are up to date and reflect the handover statement. Incoming principals verify correctness and stocktake major accountable items.', url: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Section 2 Governance Section 3 Risk Management Section 4 Internal Controls Section 5 School Council Financial Assurance Program Section 6 Budget Management Section 7 Chart of Accounts Section 8 Bank Accounts Section 9 Funding Sources Section 10 Receivables Management and Cash Handling Section 11 Expenditure Management Section 12 Trading Operations Section 13 Asset and Inventory Management Section 14 Liabilities Management Section 15 Taxation Section 16 Reporting Performance Section 17 End of Year (31 December) Section 18 End of Financial Year Reporting (30 June) Section 19 Financial Handover Section 20 Opening, Closing and Merging Schools Section 21 Insurance Arrangements — Education and Training Reform Act 2006, Financial Management Act 1994, Schedule B, principal class, school council', href: 'https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-2-governance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-3-risk-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-4-internal-controls https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-5-school-council-financial-assurance-program https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-6-budget-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-7-chart-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-8-bank-accounts https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-9-funding-sources https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-10-receivables-management-and-cash-handling https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-11-expenditure-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-12-trading-operations https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-13-asset-and-inventory-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-14-liabilities-management https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-15-taxation https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-16-reporting-performance https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-17-end-year-31-december https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-18-end-financial-year-reporting-30-june https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-19-financial-handover https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-20-opening-closing-and-merging-schools https://www2.education.vic.gov.au/pal/finance-manual/guidance/section-21-insurance-arrangements' }
  ],
},
  { id: 42, title: 'Procurement — Schools', category: 'Finance', tags: ['procurement', 'purchasing', 'suppliers', 'tender', 'quotes', 'value for money', 'probity', 'accountability', 'capability', 'department-managed panels', 'contract templates', 'short form goods', 'short form services', 'uniform supplier', 'child safety attestation'], summary: 'Mandatory procurement policy. Four principles: value for money, probity, accountability, capability. Use department-managed panels and contract templates.', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy', resources: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/resources' },
    resources: [
      { title: 'Schools procurement procedures (PDF)', note: 'staff login required' },
      { title: 'Schools procurement tools and templates', note: 'staff login required' },
      { title: 'Child safety attestation template (DOCX)', note: 'for suppliers' },
      { title: 'Contract template — short form goods', note: '' },
      { title: 'Contract template — short form services', note: '' },
      { title: 'Contract template — provision of services', note: '' },
      { title: 'Contract template — provision of teaching services', note: '' },
      { title: 'Contract template — school uniform supplier', note: '' },
      { title: 'Purchase order template', note: '' },
      { title: 'Licence and agreement templates', note: 'Legal Division intranet' },
      { title: 'Department-managed panels', note: 'staff login required — agreements with panels of suppliers across multiple categories' }
    ],
  chapters: [
    { title: 'Details — VGPB, source-to-contract, purchase-to-pay, Finance Manual, contract management', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy' },
    { title: '1. Procurement principles — value for money, conflict of interest, probity, school council, Conflict of Interest Policy', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy' },
    { title: '2. Determining the market engagement approach — SPB, Schools Procurement Branch, public tender, procurement thresholds, exemption', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy' },
    { title: '3. Rules of use — Department-managed panels, SPB, rules of use, exemption criteria, escalation', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy' },
    { title: '4. Procurement tools and templates — Resources tab, Schools procurement procedures, mandatory templates', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy' },
    { title: '5. Contracting — school councils, contract templates, supplier standard form, Licence and Agreement Templates, business manager', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy' },
    { title: 'Relevant legislation — VGPB, purchasing, school councils, 30 January 2026', url: 'https://www2.education.vic.gov.au/pal/procurement-in-schools/policy' }
  ],
},
  { id: 43, title: 'Travel', category: 'Finance', tags: ['travel', 'business travel', 'interstate', 'international', 'travel insurance', 'vmia', 'victorian managed insurance authority', 'foi'], summary: 'Travel policy for Department business travel. Subject to FOI and parliamentary scrutiny. Travel insurance coverage via VMIA; see Finance Manual Section 21.', url: 'https://www2.education.vic.gov.au/pal/travel/policy', popular: true,
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1. Key policy requirements summary — Travel Request Authorisation, TRA, regional travel registrar, travel application system, DOCX', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/1-key-policy-requirements-summary' },
    { title: '2. Travel quotes — CTM, Corporate Travel Management, 2 quotes, best price of the day, EFT, SPC', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/2-travel-quotes' },
    { title: '3. Travel funding — DE, sponsored travel, Gifts Benefits and Hospitality Registry, duty of care, section 4.2', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/3-travel-funding' },
    { title: '4. Travel approvals — TRA, 5 consecutive nights, 12 weeks, school travel application system, lead traveller', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/4-travel-approvals' },
    { title: '5. Travel booking — CTM, best price of the day, Corporate Travel Management, travel approver', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/5-travel-booking' },
    { title: '6. Travel options — TRA, CTM, teleconferencing, videoconferencing, SPC Registration Guide', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/6-travel-options' },
    { title: '7. Travel preparation — CTM, DFAT Smartraveller, VMIA business travel policy, GP, vaccinations', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/7-travel-preparation' },
    { title: '8. During travel — DE, excess baggage, Uber, taxis, rideshare, cab charge, Work-Related Driving', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/8-during-travel' },
    { title: '9. Reporting — post-travel report, 14 days, RD approval, DOCX, lead traveller', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/9-reporting' },
    { title: '10. Key contacts — CTM, VMIA, 03 9270 6900, 61 2 8330 1222, insurance.enquiries@education.vic.gov.au', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/10-key-contacts' },
    { title: '11. Definitions — base location, interstate, New Zealand, pre-travel request, school-based staff', url: 'https://www2.education.vic.gov.au/pal/travel/guidance/definitions' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/travel/policy#rpl-main' }
  ],
},
  { id: 44, title: 'Travel and Personal Expenses — Teaching Service', category: 'Finance', tags: ['travel', 'expenses', 'reimbursement', 'accommodation', 'meals', 'relocation', 'private vehicle', '24km', 're-establishment allowance', 'ministerial order 1388', 'ato rates', 'travel insurance', 'vmia'], summary: 'Travel and personal expense reimbursement. Must travel 24km+ from base location. Rates capped at ATO limits. Re-establishment allowance: $1,083 with dependants / $541 without. Travel insurance via VMIA.', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/overview',
    tabs: { overview: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/overview', policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/overview', resources: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/resources' },
    chapters: [
      { title: 'Introduction', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/overview' },
      { title: 'Personal expenses — meals, accommodation, incidentals, ATO, base location, dependants', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/personal-expenses' },
      { title: 'Travel expenses — base location, public transport, Travel Rules of Use, work-related travel, school-based staff', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/travel-expenses' },
      { title: 'Mileage allowance — private vehicle, comprehensive insurance, ATO, PAYG, payroll, Travel Expenses Claim Form', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/mileage-allowance' },
      { title: 'Relocation expenses — $55,000, household furniture, comprehensive insurance, ATO, dependant, 16 years', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/relocation-expenses' },
      { title: 'Reimbursement of expenses — ATO rates, official receipts, advance, per diem, delegate', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/reimbursement-expenses' },
      { title: 'Expenses to attend interview — Student Resource Package, teleconferencing, paraprofessional, excess employee, redeployment', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/expenses-attend-interview' },
      { title: 'Other expenses — delegate, reasonable expenses', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/other-expenses' }
    ],
    resources: [
      { title: 'Application to use a private vehicle on official duty (DOCX)', note: '' },
      { title: 'Travel Expenses Claim Form — School Based Staff (DOCX)', note: '' },
      { title: 'Application for payment of relocation expenses (DOCX)', note: '' },
      { title: 'Travel and Personal Expenses Administration Procedures (DOCX)', note: '' },
      { title: 'Work-related Driving Checklist (DOCX)', note: '' },
      { title: 'Ministerial Order 1388 Part 7', note: 'legislative basis for expense reimbursement' }
    ]
  },
  { id: 45, title: 'Gifts, Benefits and Hospitality', category: 'Finance', tags: ['gifts', 'benefits', 'hospitality', 'gift test', 'sponsored travel', 'ceremonial', 'token', 'non-token'], summary: 'Mandatory policy. Default is to politely decline. Thanks is enough. Use the GIFT test.', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/policy', popular: true,
    chapters: [
      { title: 'Minimum accountabilities — Thanks is enough, conflict of interest, reputational risk, business associates, suppliers', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/minimum-accountabilities' },
      { title: 'Definitions — HOST test, school community, business associates', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/definitions' },
      { title: 'Management of offers — Public Administration Act 2004, misconduct, Conflict of Interest, Managing Conduct and Unsatisfactory Performance, Audit and Risk Committee', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/management-of-offers-of-gifts-benefits-and-hospitality' },
      { title: 'GIFT test — VPSC, Standing Directions of the Minister for Finance 2018, token, non-token, public sector', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/management-of-offers-of-gifts-benefits-and-hospitality' },
      { title: 'Requirement to refuse offers — authorised delegate, business associate, ceremonial gifts, loyalty programs, foreign government', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/management-of-offers-of-gifts-benefits-and-hospitality' },
      { title: 'Requirement to declare offers', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/management-of-offers-of-gifts-benefits-and-hospitality' },
      { title: 'Sponsored travel and conference offers', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/management-of-offers-of-gifts-benefits-and-hospitality' },
      { title: 'Management of the provision of gifts', url: 'https://www2.education.vic.gov.au/pal/gifts-benefits-and-hospitality/guidance/management-of-the-provision-of-gifts-benefits-and-hospitality' }
    ],
    resources: [
      { title: 'Gifts, Benefits and Hospitality Registry System', note: 'staff login required — to declare an offer' },
      { title: 'School hospitality expense approval form (DOCX)', note: 'staff login required' },
      { title: 'LearnED online learning', note: 'search gifts benefits and hospitality' },
      { title: 'Contact: gifts@education.vic.gov.au', note: 'for school council register requests' }
    ],
  tabs: [ 'Skip to main content' ],
},
  { id: 46, title: 'Student Resource Package — Managing the Budget', category: 'Finance', tags: ['srp', 'student resource package', 'funding', 'budget', 'salary charging'], summary: 'Managing the school budget through the SRP. Includes salary charging rules.', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-managing-budget/overview' },
  { id: 47, title: 'Student Resource Package — School Infrastructure', category: 'Finance', tags: ['srp', 'infrastructure', 'maintenance', 'mmw', 'rfe', 'smp'], summary: 'SRP funding for school infrastructure including MMW allocations.', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Contract Cleaning (Reference 28) — metropolitan, regional, SRP, quarterly grant, facility schedule, consumables', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/contract-cleaning-reference-28' },
    { title: 'Cross Infection Prevention Allowance (Reference 29) — $14,569, Core Index Stages 1-3, special developmental schools, physical disability, CASES21', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/cross-infection-prevention' },
    { title: 'Grounds Allowance (Reference 31) — Rolling Facilities Evaluation, School Maintenance Plan portal, grounds area, m2', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/grounds-allowance-reference-31' },
    { title: 'Building Area Allowance (Reference 32) — VSBA, Confirmed cycle, square metres, campus level, cash funding', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/building-area-allowance-reference' },
    { title: 'Split-site/Multi-site Allowance (Reference 33) — 75%, 2026, 2029, primary, P-12, secondary, Specialist, Language Schools', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/split-site/multi-site-allowance' },
    { title: 'Utilities (Reference 34) — SRP, quarterly cash grant, CASES21, historical spending, indexation', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/utilities-reference-34' },
    { title: 'Maintenance and Minor Works (Reference 35) — MMW, Rolling Facilities Evaluation, RFE, 5-year School Maintenance Plan, AIMS, ESM, 03 7022 2212', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/maintenance-reference-35' },
    { title: 'Annual Contracts (Reference 36) — AIMS, work orders, MMW, Reference 35, air conditioning', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/annual-contracts-and-essential' },
    { title: 'Workers\' Compensation (Reference 37) — 0.5%, $25,000, 1 January 2022, 30 June 2024, 2024/2025, SRP', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/workers-compensation-reference-37' },
    { title: 'Wage Supplement (Reference 159) — 5%, $585, regional schools, cleanable area, award rate, 2025', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/wage-supplement-reference-159' },
    { title: 'Quality Improvement (Reference 160) — 4-hour shift, 11, 44 hours, metropolitan, regional, school fetes, 2025', url: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/guidance/quality-improvement-reference-160' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/student-resource-package-srp-school-infrastructure/policy#rpl-main' }
  ],
},
  { id: 48, title: 'Parent Payments', category: 'Finance', tags: ['parent payment', 'fees', 'charges', 'voluntary contributions', 'curriculum contributions', 'extra-curricular', 'byod', 'digital learning', 'financial help for families'], summary: 'Free instruction required; contributions voluntary without coercion. 2 categories: Curriculum Contributions and Other Contributions, plus optional Extra-Curricular Items. From 2027, no BYOD for F-6.', url: 'https://www2.education.vic.gov.au/pal/parent-payment/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/parent-payment/policy', guidance: 'https://www2.education.vic.gov.au/pal/parent-payment/guidance', resources: 'https://www2.education.vic.gov.au/pal/parent-payment/resources' },
    chapters: [
      { title: 'Finance requirements — BYOD, Foundation to Grade 6, 2027, Finance Manual, curriculum contributions, once per term', url: 'https://www2.education.vic.gov.au/pal/parent-payment/guidance/finance-requirements' },
      { title: 'Communication requirements — BYOD, 2027, parent payment arrangements template, DOCX, secondary schools, specialist schools', url: 'https://www2.education.vic.gov.au/pal/parent-payment/guidance/communication-requirements' },
      { title: 'Applying the policy to specific examples — BYOD, 2027, CASES21, third-party software, alternative form of instruction, user-pays', url: 'https://www2.education.vic.gov.au/pal/parent-payment/guidance/applying-the-policy-to-specific-examples' }
    ],
    resources: [
      { title: 'Parent payment arrangements template (Primary) (DOCX)', note: 'staff login required — mandatory template' },
      { title: 'Parent payment arrangements template (Secondary) (DOCX)', note: 'staff login required — mandatory template' },
      { title: 'Parent payment arrangements template (Specialist) (DOCX)', note: 'staff login required — mandatory template' },
      { title: 'Parent payment category examples (Primary) (DOCX)', note: 'staff login required' },
      { title: 'Parent payment category examples (Secondary) (DOCX)', note: 'staff login required' },
      { title: 'Parent payment category examples (Specialist) (DOCX)', note: 'staff login required' },
      { title: 'Parent Payments Policy Financial Transaction Guide (DOCX)', note: 'staff login required' },
      { title: 'Parent Payments Policy — Implementation and Communication Guide (DOCX)', note: 'staff login required' },
      { title: 'Financial Help for Families policy', note: 'must be applied when implementing Parent Payments' }
    ]
  },
  { id: 49, title: 'Fundraising Activities (including fetes)', category: 'Finance', tags: ['fundraising', 'fete', 'raffle', 'donations', 'parents club'], summary: 'Fundraising funds held by school council in trust for stated purpose. School council approval required.', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Details — activity organisers, risk assessment, Reporting and Managing School Incidents, school community', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'School council – approving or rejecting a school-related fundraising proposal — school council, parents\' club, committee, school council minutes, recommendation', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Commercial operators — school council, written agreement, Amusement Rides Attractions and Fireworks, Contractors Insurance and Contract Arrangements', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Fundraising methods — Deductible Gift Recipient, Victorian Gambling and Casino Control Commission, raffle, bingo, Finance Manual section 9, section 15', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Amusement rides, attractions and fireworks — amusement rides, fireworks, jumping castles, inflatable, school fete, third-party operators', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Sale of alcohol at school events — Alcohol at School Events, Liquor Control Victoria', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Fundraising event budget — fundraising wheel, GST, budget, expected costs, revenue', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Allocation and use of funds raised — school council, sub-program account, CASES21, regulation 58(1)(a), regulation 58(1)(b), parents\' club', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'School-level policy on fundraising — Fundraising Policy template, School Policy Templates Portal, school council', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Fundraising for charitable causes — principal, charitable cause, school council powers, external charity', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' },
    { title: 'Relevant legislation — Education and Training Reform Regulations 2017, Fundraising Act 1998, 24 November 2025', url: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/fundraising-activities-including-fetes/policy#rpl-main' }
  ],
},
  { id: 50, title: 'Sponsorship', category: 'Finance', tags: ['sponsorship', 'sponsors', 'advertising', '25000'], summary: 'Sponsorship arrangements. Sponsorships over $25,000 must be evaluated within 3 months of conclusion.', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Details — Victorian Government Sponsorship Policy, Part 2.3, Education and Training Reform Act 2006, Finance Manual, Section 9.8', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'What is sponsorship? — sponsor, money, goods, services, logo placement, naming rights', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'Sponsorship criteria — sponsorship criteria, incoming, outgoing, school council assessment', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'Sponsorship principles — Victorian Government sponsorship principles, inappropriate activities, commercial organisations, media organisations', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'Finalising contracts and financials — confirmation letter, contract, CASES21, 74580, Other Locally Raised Funds', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'Evaluation — $25,000, 3 months, Communications Division, sponsorship@education.vic.gov.au', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'Useful tools and references — Guidance tab, Resources tab', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'Definitions and examples — sponsor, advertiser, publisher, Partnerships Victoria, logo placement, naming rights', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' },
    { title: 'Relevant legislation — Education and Training Reform Act 2006, Part 2.3, Ministerial Order 1280, Privacy and Data Protection Act 2014', url: 'https://www2.education.vic.gov.au/pal/sponsorship/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/sponsorship/policy#rpl-main' }
  ],
},
  { id: 51, title: 'Parents Clubs', category: 'Finance', tags: ['parents club', 'fundraising', 'community'], summary: 'Parents clubs under ETR Regulations 2017. Fundraising requires school council approval.', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Forming a parents’ club — Education and Training Reform Regulations 2017, interim committee, minister\'s approval, formation process', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/guidance/forming-parents-club' },
    { title: 'Parents\' club constitution and operational requirements — Model Parents\' Club Constitution, 2019 model constitution, recession, annual general meeting', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/guidance/parents-club-constitution-and-operational-requirements' },
    { title: 'Membership — Schedule 1, registration form, annual general meeting, voting eligibility', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/guidance/membership' },
    { title: 'Financial management requirements — Education and Training Reform Regulations 2017, CASES21 sub-program, school council, committed funds, fundraising', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/guidance/financial-management-requirements' },
    { title: 'Insurance — WorkCover, workers\' compensation, volunteers, departmental insurance', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/guidance/insurance' },
    { title: 'Dissolution of a parents\' club — voluntary dissolution, automatic dissolution, school merger, demerger, finance sub-committee', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/guidance/dissolution-parents-club' },
    { title: 'Resolving conflict — club president, conflict, School Council Conduct and Conflict of Interest', url: 'https://www2.education.vic.gov.au/pal/parent-clubs/guidance/resolving-conflict' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/parent-clubs/policy#rpl-main' }
  ],
},
  { id: 52, title: 'Calculators and Ready Reckoners', category: 'Finance', tags: ['calculator', 'ready reckoner', 'salary calculator', 'dual roles', 'time in lieu'], summary: 'HR administration tools including commencement salary calculator, fixed term vacancy ready reckoner, dual role allowance calculator.', url: 'https://www2.education.vic.gov.au/pal/calculators-and-ready-reckoners/resources',
    resources: [
      { title: 'Commencement Salary Calculator (Classroom Teachers)', note: '' },
      { title: 'Fixed Term Teacher Vacancy Ready Reckoner (up to 2030)', note: '' },
      { title: 'Dual Role Allowance Calculator', note: 'for employees in 2 job functions' },
      { title: 'School activity time in lieu spreadsheet', note: 'for camps and school activities' }
    ],
  tabs: [ 'Skip to main content' ],
},
  // School Council
  { id: 54, title: 'School Council — Powers and Functions', category: 'School Council', tags: ['school council', 'powers', 'functions', 'governance', 'wwcc'], summary: 'School council powers and functions. From 2026, most council members require a WWCC.', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy', popular: true,
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Details — Ministerial Order 1280, body corporate, constituting Order, school council powers', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' },
    { title: 'School council functions, powers and objectives — Education and Training Reform Act 2006, Education and Training Reform Regulations 2017, Ministerial Order 1280, Child Safe Standards', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' },
    { title: 'Functions of school council — Executive Officer, school council president, officer bearers', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' },
    { title: 'Powers of school council — Education and Training Reform Act 2006, Education and Training Reform Regulations 2017, Ministerial Order 1280', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' },
    { title: 'Objectives of school council — Ministerial Order 1280, section 2.3.4, Education and Training Reform Act 2006', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' },
    { title: 'Delegation of school council powers, duties and functions — Education and Training Reform Regulations 2017, school budget, Annual Report, Minister for Education, Template instrument of delegation', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' },
    { title: 'Confidentiality — confidentiality, council deliberations, councillor duties', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' },
    { title: 'Relevant legislation — Education and Training Reform Regulations 2017, Ministerial Order 1280, Ministerial Order 1359, Ministerial Direction 145, Ministerial Order 1006, Ministerial Order 1039', url: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/school-council-powers-and-functions/policy#rpl-main' }
  ],
},
  { id: 54.5, title: 'School Council — Meetings', category: 'School Council', tags: ['school council', 'meetings', 'agenda', 'minutes', 'templates', 'chair', 'president', 'extraordinary meeting', 'public meeting'], summary: '8 sample agenda and minutes templates (one per regular meeting). Meetings chaired by president. Records must be kept: agendas, reports, minutes, correspondence.', url: 'https://www2.education.vic.gov.au/pal/school-council-meetings/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/school-council-meetings/policy', guidance: 'https://www2.education.vic.gov.au/pal/school-council-meetings/guidance', resources: 'https://www2.education.vic.gov.au/pal/school-council-meetings/resources' },
    chapters: [
      { title: 'Meeting protocols', url: 'https://www2.education.vic.gov.au/pal/school-council-meetings/guidance/meeting-protocols' }
    ],
    resources: [
      { title: 'Sample agenda and minutes template — Meeting 1 (DOCX)', note: 'self-assessment tool, election of office bearers, meeting dates, delegation of powers, training' },
      { title: 'Sample agenda and minutes template — Meeting 2 (DOCX)', note: 'co-option of community members, endorsement of annual report by 30 April, child safe standards training' },
      { title: 'Sample agenda and minutes template — Meeting 3 (DOCX)', note: 'Gifts, Benefits and Hospitality register' },
      { title: 'Sample agenda and minutes template — Meeting 4 (DOCX)', note: 'reviewing insurance arrangements' },
      { title: 'Sample agenda and minutes template — Meeting 5 (DOCX)', note: 'standard school council governance' },
      { title: 'Sample agenda and minutes template — Meeting 6 (DOCX)', note: 'approval of annual parent payment request, permission to write off charges' },
      { title: 'Sample agenda and minutes template — Meeting 7 (DOCX)', note: 'indicative cash budget, parent payment arrangements, preparation of annual report' },
      { title: 'Sample agenda and minutes template — Meeting 8 (DOCX)', note: 'final meeting before election' },
      { title: 'Guide to School Council Finance Motions (PDF)', note: 'agenda items specific to school council operations', url: 'https://content.sdp.education.vic.gov.au/media/finance-manual-school-council-motions-808' },
      { title: 'Improving school governance induction checklist (DOCX)', note: 'for first meeting of new school council' },
      { title: 'School council governance induction (PPTX)', note: 'presentation for first meeting' }
    ]
  },

  // Students - Engagement
  { id: 55, title: 'Student Engagement', category: 'Students', tags: ['engagement', 'behaviour', 'wellbeing', 'inclusion', 'student wellbeing', 'universal strategies', 'targeted strategies', 'individual strategies', 'school values', 'statement of values', 'corporal punishment', 'bullying', 'attendance'], summary: 'Basis for local Student Engagement Policies. Corporal punishment prohibited under ETR Act. Policy must cover engagement strategies (universal, targeted, individual), behavioural expectations, bullying, attendance. Review every 2-3 years.', url: 'https://www2.education.vic.gov.au/pal/student-engagement/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/student-engagement/policy', guidance: 'https://www2.education.vic.gov.au/pal/student-engagement/guidance', resources: 'https://www2.education.vic.gov.au/pal/student-engagement/resources' },
    chapters: [
      { title: 'What to include', url: 'https://www2.education.vic.gov.au/pal/student-engagement/guidance/2-what-include' }
    ],
    resources: [
      { title: 'Student Wellbeing and Engagement Policy template', note: 'staff login required — School Policy Templates Portal, modify for local circumstances' },
      { title: 'Statement of Values and School Philosophy template', note: 'staff login required — School Policy Templates Portal' },
      { title: 'Related: Behaviour – Students policy', note: 'for PCMS, SWPBS, BSP templates, tiered supports' }
    ]
  },
  { id: 55.5, title: 'Behaviour — Students', category: 'Students', tags: ['behaviour', 'positive behaviour', 'pcms', 'positive classroom management strategies', 'swpbs', 'school-wide positive behaviour support', 'bsp', 'behaviour support plan', 'tiered response', 'detention', 'withdrawal of privileges', 'respectful safe engaged', 'shared expectations'], summary: 'Evidence-informed behaviour support. Positive Classroom Management Strategies (PCMS - 8 practices) and School-Wide Positive Behaviour Support (SWPBS - 7 essential features). Must consider non-punitive interventions first.', url: 'https://www2.education.vic.gov.au/pal/behaviour-students/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/behaviour-students/policy', guidance: 'https://www2.education.vic.gov.au/pal/behaviour-students/guidance', resources: 'https://www2.education.vic.gov.au/pal/behaviour-students/resources' },
    chapters: [
      { title: '12. Respectful, safe, engaged: shared expectations to support student behaviour', url: 'https://www2.education.vic.gov.au/pal/behaviour-students/guidance/respectful-safe-engaged-shared-expectations-to-support-student-behaviour' }
    ],
    resources: [
      { title: 'Respectful, safe, engaged: shared expectations to support student behaviour statement', note: 'released 10 November 2025 — optional acknowledgement at enrolment/annual permissions' },
      { title: 'Behaviour Support Plan (BSP) template', note: 'available on Resources tab' },
      { title: 'Positive Classroom Management Strategies (PCMS) — Getting Started Guide (PDF)', note: '8 evidence-informed practices for teachers' },
      { title: 'PCMS Placemat (PDF)', note: 'quick-access resource with hyperlinks to step-by-step process' },
      { title: 'PCMS 6-module e-learning on LearnED', note: '6 hours, voluntary, on-demand' },
      { title: 'School-Wide Positive Behaviour Support (SWPBS) overview', note: 'flexible, all school types — 7 essential features' },
      { title: 'Sample communication templates for parents and carers', note: '' },
      { title: 'Positive Classroom Management Strategies (schools.vic.gov.au/pcms)', note: '' },
      { title: 'Contact: positive.behaviour@education.vic.gov.au', note: 'Phone: 03 7022 1383' }
    ]
  },
  { id: 55.6, title: 'Bullying Prevention and Response', category: 'Students', tags: ['bullying', 'cyberbullying', 'cybersafety', 'bully stoppers', 'esmart', 'harassment', 'online safety', 'duty of care'], summary: 'Principals must address bullying as part of the Student Engagement Policy or via a standalone policy. Use the Bullying response step-by-step guide. Bully Stoppers and eSmart Schools are key supporting programs.', url: 'https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy', resources: 'https://www2.education.vic.gov.au/pal/bullying-prevention-response/resources' },
    resources: [
      { title: 'Bullying prevention policy template', note: 'staff login required — School Policy Templates Portal, modify for local context' },
      { title: 'Bullying response step-by-step guide (DOCX)', note: 'one-page summary for staff — identify and respond to incidents including online' },
      { title: 'Bullying behaviour response template (DOCX)', note: 'optional — document behaviour and response, can attach to eduSafe report' },
      { title: 'Bully Stoppers online toolkit', note: 'department resource — advice sheets on cyberbullying and cybersafety, classroom activities, survey tool' },
      { title: 'Bully Stoppers step-by-step guide for schools (PDF)', note: 'for responding to online incidents affecting students' },
      { title: 'eSmart Schools', note: 'Alannah and Madeline Foundation initiative — Positive Digital Cultures/Practices Units, free for Victorian schools' },
      { title: 'Bullying. No Way! website', note: 'national resource for Australian schools' },
      { title: 'Safe Socials', note: 'resources to support students to be safe online' }
    ],
  chapters: [
    { title: 'Summary Details Legal requirements Local school bullying prevention policy Communication of policy Policy review Definitions Relevant legislation Contacts', href: 'https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy https://www2.education.vic.gov.au/pal/bullying-prevention-response/policy' }
  ],
},
  { id: 56, title: 'Enrolment', category: 'Students', tags: ['enrolment', 'admission', 'placement', 'enrollment', 'foundation', 'prep', 'year 6 to 7', 'neighbourhood school', 'zone', 'specialist school', 'international student', 'find my school', 'cases21', 'application form', 'appeal'], summary: 'Enrolment requirements, 2-stage Application/Enrolment forms, and Placement Policy. Use department-supplied forms only; no tests or interviews before placement offers.', url: 'https://www2.education.vic.gov.au/pal/enrolment/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/enrolment/policy', guidance: 'https://www2.education.vic.gov.au/pal/enrolment/guidance', resources: 'https://www2.education.vic.gov.au/pal/enrolment/resources' },
    chapters: [
      { title: 'Overview of enrolment in Victorian government schools — age 6, age 17, section 2.2.13, section 2.2.14, designated neighbourhood school', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/introduction-enrolment-victorian-government-schools' },
      { title: 'Eligibility to enrol in a Victorian government school — International Student Program, ISP, Education and Training Reform Act 2006, age eligibility', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/eligibility-enrol-victorian-government-school' },
      { title: 'Fairness and equity — fair, equitable, state and federal laws, placement decisions', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/fairness-and-equity' },
      { title: 'School age requirements and age exemptions — age 6, age 17, Education and Training Reform Act 2006, age exemption, principal', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/school-age-requirements' },
      { title: 'School zones — Find my School, metropolitan Melbourne, Ballarat, Bendigo, Geelong, Minister for Education', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/designated-neighbourhood-schools-and-school-zones' },
      { title: 'Placement Policy — Foundation, Year 12, designated neighbourhood school, single-sex schools, Designated Purpose Settings', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/placement-policy' },
      { title: 'Determining permanent residence — permanent address, in-zone, out-of-zone, proof of address, weekdays', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/determining-permanent-residence' },
      { title: 'Restricting enrolments — EMIP, enrolment management implementation plan, local school, building infrastructure', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/restricting-enrolments' },
      { title: 'Appealing enrolment decisions — Foundation, Year 12, Appeals information pack, written appeal, grounds for appeal', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/appealing-enrolment-decisions' },
      { title: 'Application and enrolment forms — 2024 school year, application form, enrolment form, Year 6 to 7 placement, Placement Policy', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/application-enrolment-forms' },
      { title: 'Processing enrolment forms and supporting documentation — CASES21, supporting documents, privacy collection notice, Enrolment documentation checklist', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/enrolment-process-documentation-and-other-requirements' },
      { title: 'Foundation (Prep) enrolment — 2027 enrolments, Term 4 2025, 31 July 2026, 28 August 2026, 11 September 2026', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/foundation-prep-enrolment' },
      { title: 'Year 6 to 7 placement — Year 7, Statewide placement timeline, 2026 to 2027, primary and secondary schools', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/year-6-to-7-placement' },
      { title: 'Student transfers between schools — CASES21, principal approval, 6 months, principal course of study, International Education Division', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/student-transfers-between-schools' },
      { title: 'Enrolment in specialist schools and other specialist education settings — specialist schools, supported inclusion schools, Minister for Education, regional directors, School Policy Templates Portal', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/enrolment-specialist-schools' },
      { title: 'Concurrent enrolment process (youth justice and secure welfare) — Parkville College, youth justice, secure welfare, CASES21, VSR, Victorian Student Register', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/concurrent-enrolment-process-youth-justice-and-secure-welfare' },
      { title: 'Temporary enrolments – emergency school closures — host school, base school, emergency closure, floods, bushfires', url: 'https://www2.education.vic.gov.au/pal/enrolment/guidance/temporary-enrolments-emergency-school-closures' }
    ],
    resources: [
      { title: 'Form to enrol in a Victorian government school (DOCX and PDF)', note: 'staff login required — on CASES21 Portal' },
      { title: 'Application outcome communications to parents and carers (DOCX)', note: 'staff login required — email templates' },
      { title: 'Email templates to support enrolment offers (DOCX)', note: 'staff login required' },
      { title: 'Sample wording for requesting evidence of permanent residential address (DOCX)', note: 'staff login required — for conditional offers' },
      { title: 'Non-standard enrolment — appeal application form (DOCX)', note: 'staff login required — for specialist settings' },
      { title: 'Review of non-standard enrolment form (DOCX)', note: 'staff login required — for specialist settings' },
      { title: 'Student exit form (DOCX)', note: '' },
      { title: 'CASES21 instructions: Transferring students from flood impacted schools (DOCX)', note: 'staff login required' },
      { title: 'Statewide Foundation enrolment timeline for 2026-27 (DOCX)', note: 'staff login required' },
      { title: 'Foundation enrolment template website content (DOCX)', note: 'staff login required' },
      { title: 'Year 6 to 7 Statewide placement timeline for 2026-27 (DOCX)', note: 'staff login required' },
      { title: 'Template school website content (DOCX) — Year 6 to 7', note: 'staff login required' },
      { title: 'Specialist school disability verification request form (DOCX)', note: 'staff login required' },
      { title: 'Enrolment — specialist schools policy template', note: 'staff login required — School Policy Templates Portal' },
      { title: 'Supported inclusion school enrolment policy template', note: 'staff login required' },
      { title: 'School Enrolment Guidelines: Guide for School Attendance Officers (PDF)', note: '' },
      { title: 'Referral form — student not enrolled or home schooling (DOCX)', note: '' },
      { title: 'Year 7 placement application form', note: 'on Moving from primary to secondary school webpage' },
      { title: 'Find My School', note: 'determine designated neighbourhood schools and zones' },
      { title: 'ImmiCard', note: 'for visa holders without a passport' },
      { title: 'International Student Program Quality Standards', note: 'ESOS National Code compliance' },
      { title: 'Privacy and Information Sharing Policy', note: 'standard statements for parents and carers upon enrolment' }
    ]
  },
  { id: 57, title: 'Attendance', category: 'Students', tags: ['attendance', 'absence', 'truancy', 'compulsory', 'cases21', 'ecases21', 'attendance register', 'unexplained absence', 'school attendance officer', 'whereabouts unknown', '5 days', 'reasonable excuse', 'panorama', 'staying in education'], summary: 'Compulsory school attendance for ages 6-17. Record attendance 2x daily (primary) or every class (secondary). Same-day parent/carer notification of unexplained absences required. Half day = 2+ hours of instruction.', url: 'https://www2.education.vic.gov.au/pal/attendance/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/attendance/policy', guidance: 'https://www2.education.vic.gov.au/pal/attendance/guidance', resources: 'https://www2.education.vic.gov.au/pal/attendance/resources' },
    chapters: [
      { title: '5 Requirements for attendance', url: 'https://www2.education.vic.gov.au/pal/attendance/guidance/5-requirements-attendance' }
    ],
    resources: [
      { title: 'Schools guide to attendance (SGTA) (DOCX)', note: 'whole school approach — 5 key elements' },
      { title: 'Attendance and absence recording guide (PDF)', note: 'staff login required' },
      { title: 'Documented roles and responsibilities table (DOCX)', note: '' },
      { title: 'Referral form: Principal to school attendance officer — whereabouts of student unknown (DOCX)', note: 'staff login required' },
      { title: 'Referral form: Principal to school attendance officer — 5 days unexplained absence (DOCX)', note: 'staff login required' },
      { title: 'Things to consider prior to making a referral to a school attendance officer (DOCX)', note: 'staff login required' },
      { title: 'Attendance referrals for students in out-of-home care (DOCX)', note: 'staff login required' },
      { title: 'Attendance Policy template', note: 'staff login required — School Policy Templates Portal' },
      { title: 'Panorama dashboard', note: 'attendance pattern monitoring' },
      { title: 'Staying in Education dashboard', note: 'attendance pattern monitoring' },
      { title: 'CASES21 or eCASES21', note: 'required for attendance recording (or CASES21-compatible third party)' }
    ]
  },
  { id: 58, title: 'Exemption from School Attendance and Enrolment', category: 'Students', tags: ['exemption', 'leaving school', 'year 10', 'ministerial order 705'], summary: 'Exemption processes under ETRA and Ministerial Order 705.', url: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1. Exemption categories — age 6, Year 10, Ministerial Order 713, Regional Director, Principal, entertainment industry', url: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/guidance/1-exemption-categories' },
    { title: '2. Exemption process – students who have completed Year 10 and will participate full-time in approved education or training and/or employment — Year 10, Ministerial Order 705, Part 1, Exemption from School Application form, Victorian Early Leaver Connection Initiative', url: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/guidance/2-exemption-process-students-who-have' },
    { title: '3. Exemption process – students who have not completed Year 10 and will participate full-time in approved education or training and/or employment — Year 10, Ministerial Order 705, Part 2, regional director, Child Employment Act 2003', url: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/guidance/3-exemption-process-students-who-have-not' },
    { title: '4. Exemption process – Students employed or seeking employment during school hours in the entertainment industry — Ministerial Order 714, 12 months, Wage Inspectorate, 1800 287 287, entertainment industry', url: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/guidance/4-exemption-process-students-who-have-not' },
    { title: '5. Exemption process – if leaving school is in best interests of the student — Ministerial Order 715, Ministerial Order 705, Manager Youth Pathways and Transitions, regional director', url: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/guidance/5-exemption-process-if-leaving-school-best' },
    { title: '6. Career Advice Service – transition support for exempted students who will participate in full-time approved education or training and/or employment — VELCI, Skills and Jobs Centre, Koorie, Career Advice Service, target areas', url: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/guidance/career-advice-service-transition-support-for-exempted-students-who-will-participate-in-full-time' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/exemption-school-attendance-and-enrolment/policy#rpl-main' }
  ],
},
  { id: 59, title: 'Suspensions', category: 'Students', tags: ['suspension', 'discipline', 'behaviour', 'ministerial order 1125', 'notice of suspension', 'relevant person', 'regional director approval', '5 days', '15 days', 'grounds for suspension', 'exceptional grounds', 'outside school activity', '7 years'], summary: 'Student suspension under Ministerial Order 1125. Must consider alternatives first. Principal authority (cannot be delegated). RD approval required for >5 consecutive days or >15 days total in a year. Records retained 7 years.', url: 'https://www2.education.vic.gov.au/pal/suspensions/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/suspensions/policy', guidance: 'https://www2.education.vic.gov.au/pal/suspensions/guidance', resources: 'https://www2.education.vic.gov.au/pal/suspensions/resources' },
    chapters: [
      { title: 'Overview / Introduction — Ministerial Order 1125, Suspension process flowchart, Map of key mental health and wellbeing support', url: 'https://www2.education.vic.gov.au/pal/suspensions/guidance/introduction' },
      { title: 'Suspension considerations — Ministerial Order 1125, grounds for suspension, online behaviour, exceptional circumstances', url: 'https://www2.education.vic.gov.au/pal/suspensions/guidance/1-suspension-considerations' },
      { title: 'Suspension process — principal, grounds for suspension, investigation, criminal investigations', url: 'https://www2.education.vic.gov.au/pal/suspensions/guidance/1-suspension-process' },
      { title: 'Identifying a support person (relevant person) — relevant person, mature minor, out-of-home-care, under 18', url: 'https://www2.education.vic.gov.au/pal/suspensions/guidance/3-identifying-support-person-relevant-person' },
      { title: 'Appoint a relevant person — relevant person, mature minor, suitable persons list, executive director, regional director', url: 'https://www2.education.vic.gov.au/pal/suspensions/guidance' }
    ],
    resources: [
      { title: 'Ministerial Order 1125 (PDF)', note: 'Procedures for Suspension and Expulsion of Students in Government Schools' },
      { title: 'Suspension process flowchart (PDF)', note: 'staff login required — summary of procedural requirements' },
      { title: 'Suspension process checklist (DOCX)', note: 'staff login required' },
      { title: 'Notice of suspension (DOCX and PDF)', note: 'staff login required — mandatory notice template' },
      { title: 'Exceptional grounds — outside school activity quick reference guide (PDF and DOCX)', note: 'staff login required — prompts and examples' },
      { title: 'Application for regional director approval of suspension', note: 'staff login required — for >5 consecutive / >15 total days' },
      { title: 'Parent brochure — procedures following suspension (PDF)', note: '' },
      { title: 'Map of key mental health and wellbeing support (PDF and DOCX)', note: '' },
      { title: 'Principles of administrative decision making (PDF)', note: 'staff login required' },
      { title: 'Legal Division: 03 9637 3146', note: 'legal.services@education.vic.gov.au — for disability, separated parents, complex cases' },
      { title: 'LOOKOUT Education Support Centres', note: 'for students in out-of-home care' },
      { title: 'Koorie Engagement Support Officer (KESO)', note: 'must be engaged for Koorie students' }
    ]
  },
  { id: 60, title: 'Expulsions', category: 'Students', tags: ['expulsion', 'discipline', 'ministerial order 1125', 'principal authority', 'secretary approval', 'appeals', 'koorie', 'nccd', 'out-of-home care', 'disability', 'overseas student', 'charter of human rights'], summary: 'Student expulsion under Ministerial Order 1125. Only principals can decide (cannot be delegated). Students aged 8 or less require Secretary approval. Additional actions for Koorie, out-of-home care, disability (NCCD), and overseas students.', url: 'https://www2.education.vic.gov.au/pal/expulsions/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/expulsions/policy', guidance: 'https://www2.education.vic.gov.au/pal/expulsions/guidance', resources: 'https://www2.education.vic.gov.au/pal/expulsions/resources' },
    resources: [
      { title: 'Ministerial Order 1125 (PDF)', note: 'Procedures for Suspension and Expulsion of Students in Government Schools' },
      { title: 'Exceptional Grounds — outside school activity quick reference guide (PDF)', note: 'staff login required' },
      { title: 'Legal Division: 03 9637 3146', note: 'legal.services@education.vic.gov.au' }
    ],
  chapters: [
    { title: 'Overview — Victorian government school, procedural fairness, priority cohorts, transition support', url: 'https://www2.education.vic.gov.au/pal/expulsions/guidance/introduction' },
    { title: 'Interventions and supports — Student Support Services, out-of-home care, Koorie students, area team, last resort', url: 'https://www2.education.vic.gov.au/pal/expulsions/guidance/interventions-and-support' },
    { title: 'Reflect and investigate — Principal expulsion checklist, Ministerial Order 1125, Charter of Human Rights and Responsibilities Act 2006, anti-discrimination', url: 'https://www2.education.vic.gov.au/pal/expulsions/guidance/reflect-and-investigate' },
    { title: 'Behaviour support and intervention meeting — behaviour support and intervention meeting, Information for parents and carers, Information for students, remote meeting', url: 'https://www2.education.vic.gov.au/pal/expulsions/guidance/behaviour-support-and-intervention-meeting' },
    { title: 'Decision — regional engagement coordinator, area team, regional approved support person, 5 days, allocated teacher', url: 'https://www2.education.vic.gov.au/pal/expulsions/guidance/decision' },
    { title: 'Supported transition — supported transition plan, student absence learning plan, regional engagement coordinator, 1 month, compulsory school age', url: 'https://www2.education.vic.gov.au/pal/expulsions/guidance/supported-transition' },
    { title: 'Appeals — Notice of expulsion, expulsion appeal form, Ministerial Order 1125, Expulsion appeal process, Principal expulsion checklist', url: 'https://www2.education.vic.gov.au/pal/expulsions/guidance/appeals' }
  ],
},
  { id: 61, title: 'Equal Opportunity and Human Rights — Students', category: 'Students', tags: ['equal opportunity', 'students', 'discrimination', 'disability harassment', 'reasonable adjustments'], summary: 'Equal opportunity for students including reasonable adjustments for disability.', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Details — Charter of Human Rights and Responsibilities 2016, anti-discrimination laws, protected attributes, race, gender identity, disability', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy' },
    { title: 'Bullying, unlawful discrimination, sexual harassment, disability harassment, vilification, victimisation and other forms of inappropriate behaviour — bullying, sexual harassment, disability harassment, vilification, victimisation, Student Engagement Policy', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy' },
    { title: 'Students with disability — reasonable adjustments, Students with Disability, Student Support Groups, IEPs, Student Support Services', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy' },
    { title: 'Supporting students from culturally and linguistically diverse backgrounds — Intercultural Capability Curriculum, Foundation to Year 10, VCAA, interpreting and translation services', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy' },
    { title: 'Charter of Human Rights and Responsibilities — Charter of Human Rights and Responsibilities, 20 basic rights, public authority, procedural obligation', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy' },
    { title: 'Definitions — antisemitism, protected attribute, direct discrimination, indirect discrimination, sexual harassment', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy' },
    { title: 'Contacts — Legal Division, 03 9637 3146, legal.services@education.vic.gov.au, Inclusive Education Division, Safe Schools, 03 9637 3699', url: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/equal-opportunity-human-rights-students/policy#rpl-main' }
  ],
},
  { id: 62, title: 'Duty of Care', category: 'Students', tags: ['duty of care', 'negligence', 'reasonable precautions', 'child abuse', 'presumption of liability', 'supervision', 'students at risk', 'yard duty', 'foreseeable risk'], summary: 'Legal duty of care to students. Reasonable precautions required to minimise foreseeable risks. Since July 2017, presumption of liability for child abuse claims — staff must prove reasonable precautions were taken.', url: 'https://www2.education.vic.gov.au/pal/duty-of-care/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/duty-of-care/policy', guidance: 'https://www2.education.vic.gov.au/pal/duty-of-care/guidance', resources: 'https://www2.education.vic.gov.au/pal/duty-of-care/resources' },
    resources: [
      { title: 'Students at Risk Tool', note: 'public access' },
      { title: 'Students at Risk Planning Tool', note: 'staff login required' },
      { title: 'Related: Supervision of Students policy', note: '' }
    ],
  chapters: [
    { title: 'Details — non-delegable, foreseeable harm, yard duty roster, lunchtime supervision', url: 'https://www2.education.vic.gov.au/pal/duty-of-care/policy' },
    { title: 'Duty of care to students outside the school — school hours, school grounds, 350 metres, bus stop, teacher-student relationship', url: 'https://www2.education.vic.gov.au/pal/duty-of-care/policy' },
    { title: 'Policies and duty of care — yard duty, supervision policies, child safety policies, negligence claim', url: 'https://www2.education.vic.gov.au/pal/duty-of-care/policy' },
    { title: 'Legal background — tort of negligence, balance of probabilities, 1 July 2017, presumption of liability, child abuse', url: 'https://www2.education.vic.gov.au/pal/duty-of-care/policy' },
    { title: 'Related legislation', url: 'https://www2.education.vic.gov.au/pal/duty-of-care/policy' }
  ],
},
  { id: 62.5, title: 'Supervision of Students', category: 'Students', tags: ['supervision', 'yard duty', 'yard duty roster', 'duty of care', 'playground', 'before school', 'after school'], summary: 'Staff supervision of students including yard duty. Principal must establish and monitor a system for supervision shared amongst staff. Use the Yard duty and supervision policy template.', url: 'https://www2.education.vic.gov.au/pal/supervision-students/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/supervision-students/policy', guidance: 'https://www2.education.vic.gov.au/pal/supervision-students/guidance', resources: 'https://www2.education.vic.gov.au/pal/supervision-students/resources' },
    resources: [
      { title: 'Yard duty and supervision policy template', note: 'staff login required — School Policy Templates Portal, modify for local circumstances' }
    ],
  chapters: [
    { title: 'Summary Details Child Safe Standards Supervision responsibilities during school hours Supervision responsibilities before and after school', href: 'https://www2.education.vic.gov.au/pal/supervision-students/policy https://www2.education.vic.gov.au/pal/supervision-students/policy https://www2.education.vic.gov.au/pal/supervision-students/policy https://www2.education.vic.gov.au/pal/supervision-students/policy https://www2.education.vic.gov.au/pal/supervision-students/policy' }
  ],
},
  { id: 63, title: 'Health Care Needs', category: 'Students', tags: ['health care', 'medical', 'conditions', 'care plan', 'student health support plan', 'medical condition', 'medication', 'consent', 'first aid'], summary: 'Supporting students with identified health care needs. Schools must have processes for gathering medical info, Student Health Support Plans, consent for medication, and appropriate first aid.', url: 'https://www2.education.vic.gov.au/pal/health-care-needs/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/health-care-needs/policy', resources: 'https://www2.education.vic.gov.au/pal/health-care-needs/resources' },
    resources: [
      { title: 'ASCIA Action Plan for Anaphylaxis (RED)', note: 'completed by parents or carers with medical practitioner — provided to school' },
      { title: 'ASCIA Action Plan for Allergic Reactions (GREEN)', note: 'for mild-moderate allergies — completed by parents or carers' },
      { title: 'Individual allergic reactions management plan (DOCX)', note: 'completed by school for each student with allergies' },
      { title: 'Individual anaphylaxis management plan (DOCX)', note: 'completed by school for each student at risk of anaphylaxis' },
      { title: 'Annual risk management checklist (DOCX)', note: 'for MO 706 compliance monitoring' }
    ],
  chapters: [
    { title: '1. The 4 stages of developing a Student Health Support Plan — 4 stages, Student Health Support Plan, anaphylaxis management plan, enrolment', url: 'https://www2.education.vic.gov.au/pal/health-care-needs/guidance/4-stages-developing-student-health-support-plan' },
    { title: '2. Complex medical care supports — complex medical care, Disability Inclusion Tier 2, WHO definitions, Epilepsy, first aid', url: 'https://www2.education.vic.gov.au/pal/health-care-needs/guidance/complex-medical-care-supports' },
    { title: '3. Supporting students during transition between hospital, home and school — hospital, home, school transition, curriculum, classroom teacher', url: 'https://www2.education.vic.gov.au/pal/health-care-needs/guidance/supporting-students-during-transition-between-hospital-home-and' },
    { title: '4. Supporting students with long term special education and other support needs — long term special education, IEPs, attendance, information exchange, equipment upgrade', url: 'https://www2.education.vic.gov.au/pal/health-care-needs/guidance/supporting-students-long-term-special-education-and-other-support' }
  ],
},
  { id: 64, title: 'Anaphylaxis', category: 'Students', tags: ['anaphylaxis', 'allergy', 'epipen', 'anapen', 'jext', 'neffy', 'ministerial order 706', 'ascia', 'adrenaline', 'individual anaphylaxis management plan', 'royal childrens hospital', 'risk minimisation', 'twice-yearly briefing', '22579vic', 'adrenaline auto-injector'], summary: 'Ministerial Order 706. Schools with a student at risk must have an Anaphylaxis Management Policy, twice-yearly staff briefings, individual plans, annual risk checklist. RCH Advisory Line: 1300 725 911.', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/anaphylaxis/policy', guidance: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance', resources: 'https://www2.education.vic.gov.au/pal/anaphylaxis/resources' },
    chapters: [
      { title: '1. Introduction — Ministerial Order 706, Education Training Reform Act 2006, 80%, Victorian schools, allergens', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/1-introduction' },
      { title: '2. Glossary of terms — ASCIA, EpiPen, EpiPen Jr, Anapen 500, Jext 150, Jext 300, Neffy', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/2-glossary-terms' },
      { title: '3. Medical information about anaphylaxis — 9 foods, 95%, 10 to 18-year-old, allergens, insect stings, bee stings', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/3-medical-information-about-anaphylaxis' },
      { title: '4. Legal obligations for schools in relation to anaphylaxis — Section 4.3.1(6)(c), MO 706, ASCIA e-training, Schedule 6, duty of care', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/4-legal-obligations-schools-relation-anaphylaxis' },
      { title: '5. Staff training — Clause 12 MO 706, 30 days, Option 1, online training, anaphylaxis supervisor', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/5-staff-training' },
      { title: '6. School anaphylaxis management policy — Clause 6 MO 706, multiple campuses, template policy, school anaphylaxis management policy', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/6-school-anaphylaxis-management-policy' },
      { title: '7. Individual anaphylaxis management plans — Clause 7 MO 706, ASCIA Action Plan RED, individual management plan, parent consultation', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/7-individual-anaphylaxis-management-plans' },
      { title: '8. Risk minimisation strategies — Clause 8 MO 706, peanuts, tree nuts, prevention strategies, parent responsibilities', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/8-risk-minimisation-strategies' },
      { title: '9. School planning and emergency response — ASCIA Action Plan RED, emergency response, camps, excursions, first aid integration', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/9-school-planning-and-emergency-response' },
      { title: '10. Adrenaline autoinjectors for general use — Clause 10 MO 706, backup autoinjector, chemist, no prescription, school expense', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/10-adrenaline-autoinjectors-general-use' },
      { title: '11. Communication plan — Clause 11 MO 706, communication plan, twice per year, casual relief, volunteers', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/11-communication-plan' },
      { title: '12. Annual risk management checklist — Clause 13 MO 706, annual checklist, principal approval, compliance monitoring', url: 'https://www2.education.vic.gov.au/pal/anaphylaxis/guidance/12-annual-risk-management-checklist' }
    ],
    resources: [
      { title: 'Anaphylaxis policy template', note: 'staff login required — on School Policy Templates Portal' },
      { title: 'Guidance for developing a school anaphylaxis management policy (DOCX)', note: '' },
      { title: 'Template: Individual Anaphylaxis Management Plan (DOCX)', note: 'must be completed by school for each student diagnosed at risk' },
      { title: 'ASCIA Action Plan for Anaphylaxis (RED)', note: 'completed by parents or carers with medical practitioner' },
      { title: 'Ministerial Order 706 (DOCX and PDF)', note: 'Anaphylaxis Management in Victorian schools' },
      { title: 'ASCIA e-training', note: 'free anaphylaxis training — prerequisite for 22579VIC Verifying Correct Use of Adrenaline Injectors' },
      { title: 'Annual risk management checklist (DOC)', note: 'completed start of each year to monitor MO 706 compliance' },
      { title: 'Risk management strategies (PDF)', note: 'created by Allergy and Anaphylaxis Australia' },
      { title: '22579VIC Verifying Correct Use of Adrenaline Injectors', note: 'accredited course — requires ASCIA e-training in prior 12 months' },
      { title: 'RCH Anaphylaxis Support Advisory Line: 1300 725 911 or 03 9345 4235', note: 'Mon-Fri 8:30am-5:00pm — anaphylaxisadviceline@rch.org.au' }
    ]
  },
  { id: 65, title: 'Allergies', category: 'Students', tags: ['allergy', 'allergic reaction', 'ascia', 'action plan', 'green plan', 'mild allergy', 'moderate allergy', 'individual allergic reactions risk management plan'], summary: 'Policy applies to students with an ASCIA Action Plan for Allergic Reactions (Green Plan). Schools must develop an Individual Allergic Reactions Risk Management Plan for each Green Plan student.', url: 'https://www2.education.vic.gov.au/pal/allergies/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/allergies/policy', resources: 'https://www2.education.vic.gov.au/pal/allergies/resources' },
    resources: [
      { title: 'Individual Allergic Reactions Risk Management Plan template (DOCX)', note: 'schools complete for students with a Green Plan' },
      { title: 'ASCIA Action Plan for Allergic Reactions (Green Plan)', note: 'completed by medical practitioner — provided by parents or carers' },
      { title: 'Medical information form — day excursions (DOCX)', note: 'asks parents about allergies before camps/excursions' },
      { title: 'Ideas on risk minimisation strategies in the school and/or childcare environment (PDF)', note: 'staff login required — list of achievable risk minimisation procedures' },
      { title: 'Allergy and Anaphylaxis Australia', note: 'about living with Anaphylaxis' },
      { title: 'ASCIA (Australasian Society of Clinical Immunology and Allergy)', note: 'Anaphylaxis e-training, guidelines, risk minimisation strategies for schools' },
      { title: 'Royal Children Hospital: Department of Allergy and Immunology', note: 'fact sheets on specific allergies' },
      { title: 'RCH Anaphylaxis Support Advisory Line: 1300 725 911 or 03 9345 4235', note: 'Mon-Fri 8:30am-5:00pm — all allergy and anaphylaxis management enquiries' }
    ],
  chapters: [
    { title: 'Details — Green Plan, mild to moderate, food allergy, insect sting, duty of care', url: 'https://www2.education.vic.gov.au/pal/allergies/policy' },
    { title: 'ASCIA Action Plan for Allergic Reactions (Green Plan) – Overview — ASCIA Action Plan, Green Plan, medical practitioner, adrenaline auto-injector', url: 'https://www2.education.vic.gov.au/pal/allergies/policy' },
    { title: 'Strategies for schools in managing students with a Green Plan — Individual Allergic Reaction Risk Management Plan, Green Plan, general use auto-injector', url: 'https://www2.education.vic.gov.au/pal/allergies/policy' },
    { title: 'Responding to severe allergic reactions — asthma, bronchodilator, food allergy, anaphylaxis first aid, adrenaline auto-injector', url: 'https://www2.education.vic.gov.au/pal/allergies/policy' },
    { title: 'Strategies — Green Plan, Individual Allergic Reactions Risk Management Plan, prevention strategies, allergens', url: 'https://www2.education.vic.gov.au/pal/allergies/policy' },
    { title: 'Definitions — ASCIA, allergens, dust mites, pollen, mild to moderate signs', url: 'https://www2.education.vic.gov.au/pal/allergies/policy' },
    { title: 'Relevant legislation', url: 'https://www2.education.vic.gov.au/pal/allergies/policy' }
  ],
},
  { id: 66, title: 'Asthma', category: 'Students', tags: ['asthma', 'reliever', 'inhaler', 'asthma action plan', 'student health support plan', 'thunderstorm asthma', 'asthma kit', 'asthma australia', 'spacer'], summary: 'Students bring own reliever medication stored in asthma kit with action plan and spacer. Schools must have Asthma Action Plan for all students diagnosed with asthma. Annual review required.', url: 'https://www2.education.vic.gov.au/pal/asthma/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/asthma/policy', resources: 'https://www2.education.vic.gov.au/pal/asthma/resources' },
    resources: [
      { title: 'Asthma policy template', note: 'staff login required — School Policy Templates Portal' },
      { title: 'Asthma Action Plan', note: 'completed by medical practitioner, provided by parents or carers' },
      { title: 'Student Health Support Plan', note: 'for detailing school support, strategies, staff allocation' },
      { title: 'Asthma Australia: Asthma First Aid', note: 'free 1-hour online training module for general school staff' },
      { title: 'Asthma — resources for Victorian schools', note: 'Asthma Australia portal' },
      { title: 'Better Health Channel — Asthma action', note: '' },
      { title: 'Better Health Channel — Thunderstorm asthma', note: 'including multicultural resources' },
      { title: 'National Asthma Council Australia — inner-west schools training', note: 'optional free training for Maribyrnong, Hobson Bay, Brimbank' }
    ],
  chapters: [
    { title: 'Treating an asthma attack — 000, ambulance, asthma attack, asthma first aid, undiagnosed students', url: 'https://www2.education.vic.gov.au/pal/asthma/guidance/treating-asthma-attack' },
    { title: 'Puffer cleaning guide — after every use', url: 'https://www2.education.vic.gov.au/pal/asthma/guidance/puffer-cleaning-guide-after-every-use' },
    { title: 'Asthma – key information — flare-up, triggers, grass pollen season, epidemic thunderstorm asthma, symptoms', url: 'https://www2.education.vic.gov.au/pal/asthma/guidance/asthma-key-information' }
  ],
},
  { id: 67, title: 'Immunisation', category: 'Students', tags: ['immunisation', 'vaccination', 'exclusion', 'public health'], summary: 'Immunisation and exclusion under Public Health and Wellbeing Regulations.', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Details — infectious diseases, prevention, public health authorities', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy' },
    { title: 'Primary students — primary students, National Immunisation Program Schedule, childhood vaccinations', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy' },
    { title: 'All students', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy' },
    { title: 'School responsibilities – exclusion processes — Public Health and Wellbeing Regulations 2019, Chief Health Officer, exclusion table, vaccine-preventable disease', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy' },
    { title: 'Supporting the Victorian Secondary School Immunisation Program — Secondary School Immunisation Program, local council, National Immunisation Program Schedule, contact details', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy' },
    { title: 'Definitions — vaccination, immunisation, exclusion, vaccine', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy' },
    { title: 'Relevant legislation — Education and Training Reform Regulations 2017, Family Law Act 1975, Public Health and Wellbeing Act 2008', url: 'https://www2.education.vic.gov.au/pal/immunisation/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/immunisation/policy#rpl-main' }
  ],
},
  { id: 68, title: 'Head Lice', category: 'Students', tags: ['head lice', 'nits', 'exclusion'], summary: 'Head lice exclusion until day after treatment commences. Eggs alone not cause for exclusion.', url: 'https://www2.education.vic.gov.au/pal/head-lice/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Control of head lice in schools — live head lice, exclusion, Public Health and Wellbeing Regulations 2019, school exclusion table, eggs', url: 'https://www2.education.vic.gov.au/pal/head-lice/policy' },
    { title: 'Prevention of head lice in schools — prevention, transmission, parent collaboration, furniture, clothing', url: 'https://www2.education.vic.gov.au/pal/head-lice/policy' },
    { title: 'Parent or carer detection and treatment responsibilities — parents, carers, detection, treatment', url: 'https://www2.education.vic.gov.au/pal/head-lice/policy' },
    { title: 'Definitions — Pediculosis, wingless insects, human scalp, direct contact', url: 'https://www2.education.vic.gov.au/pal/head-lice/policy' },
    { title: 'Relevant legislation', url: 'https://www2.education.vic.gov.au/pal/head-lice/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/head-lice/policy#rpl-main' }
  ],
},
  { id: 69, title: 'Mental Health in Schools', category: 'Students', tags: ['mental health', 'wellbeing', 'students', 'mhp', 'mental health practitioner', 'mental health toolkit', 'whole-school', 'nip it in the bud', 'student wellbeing boost'], summary: 'Role of schools in supporting student mental health. All Victorian government secondary schools (and specialist with secondary enrolments) funded for ongoing school-based Mental Health Practitioner (MHP).', url: 'https://www2.education.vic.gov.au/pal/mental-health-schools/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/mental-health-schools/policy', resources: 'https://www2.education.vic.gov.au/pal/mental-health-schools/resources' },
    resources: [
      { title: 'Map of key mental health and wellbeing support', note: 'universal, early intervention/cohort-specific, targeted tiers' },
      { title: 'Mental health and wellbeing toolkit', note: 'links existing resources, guidance and programs' },
      { title: 'Student Wellbeing Boost — guidance for Victorian government schools (PDF)', note: '' },
      { title: 'Voice to Parliament information for schools factsheet (DOCX)', note: 'for Aboriginal and Torres Strait Islander students' },
      { title: 'Mental health support fact sheets for families', note: '19 languages available — for holidays and identifying signs' },
      { title: 'Mental Health Practitioners (MHP) in Secondary Schools initiative', note: 'direct counselling + whole-school approaches' },
      { title: 'NIP it in the bud! early intervention framework', note: 'whole-school depression/anxiety/self-harm response' }
    ],
  chapters: [
    { title: 'The Mental Health in Primary Schools initiative — MHWL, 2023 to 2026, VIT registered teachers, University of Melbourne, low-fee non-government, campus enrolments', url: 'https://www2.education.vic.gov.au/pal/mental-health-schools/policy' },
    { title: 'Mental Health Practitioners in Secondary Schools — MHP, secondary schools, specialist schools, wellbeing teams, ongoing role', url: 'https://www2.education.vic.gov.au/pal/mental-health-schools/policy' },
    { title: 'Mental health and wellbeing toolkit — Mental health and wellbeing toolkit, parents, students, schools', url: 'https://www2.education.vic.gov.au/pal/mental-health-schools/policy' }
  ],
},
  { id: 70, title: 'Mental Health Fund and Menu', category: 'Students', tags: ['mental health', 'fund', 'menu', 'tiers', 'schools mental health menu', 'schools mental health fund', 'school mental health planning tool', 'tier 1', 'tier 2', 'tier 3', 'royal commission', 'recommendation 17', 'credit and cash transfers'], summary: 'Schools Mental Health Fund ($217.8M over 4 years) and evidence-based Menu of programs across 3 tiers (universal / early intervention / targeted support). Only Menu items eligible for Fund use.', url: 'https://www2.education.vic.gov.au/pal/mental-health-fund-menu/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/mental-health-fund-menu/policy', guidance: 'https://www2.education.vic.gov.au/pal/mental-health-fund-menu/guidance', resources: 'https://www2.education.vic.gov.au/pal/mental-health-fund-menu/resources' },
    chapters: [
      { title: 'Schools Mental Health Fund and Menu objectives', url: 'https://www2.education.vic.gov.au/pal/mental-health-fund-menu/guidance/schools-mental-health-fund-and-menu-objectives' },
      { title: '2. Schools Mental Health Menu — tiers and categories', url: 'https://www2.education.vic.gov.au/pal/mental-health-fund-menu/guidance/schools-mental-health-menu' }
    ],
    resources: [
      { title: 'Schools Mental Health Menu', note: 'publicly available — all endorsed programs, staff, resources across 3 tiers' },
      { title: 'School Mental Health Planning Tool', note: 'supports decision-making for Menu purchases' },
      { title: 'Whole-school approaches factsheet', note: 'Tier 1 guidance' },
      { title: 'Credit and Cash Transfers — SRP', note: 'school allocation set automatically by SRP' }
    ]
  },
  { id: 71, title: 'Mental Health in Primary Schools initiative', category: 'Students', tags: ['mental health', 'primary schools', 'mhwl'], summary: 'Mental Health and Wellbeing Leader role in primary schools.', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Mental Health and Wellbeing Leader role — MHWL, Tier 1, Tier 2, whole-school approach, not clinical, no allied health', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/guidance/mental-health-wellbeing-leader-role' },
    { title: 'Mental Health in Primary Schools funding — SRP Reference 130, eduPay, project code 245006, PWO transition, 2023 to 2026', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/guidance/mental-health-primary-schools-funding' },
    { title: 'Mental Health and Wellbeing Leader recruitment — MHWL, VIT, School Jobs Vic, Classroom Teacher Range 2, onboarding checklist', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/guidance/mental-health-wellbeing-leader-recruitment' },
    { title: 'Mental Health in Primary Schools training program — University of Melbourne, Faculty of Education, 3 people team, Module 1, Learning Leader, Canvas', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/guidance/mental-health-primary-schools-training-program' },
    { title: 'Setting the Mental Health and Wellbeing Leader up for success — FISO 2.0, Mental Health Planning Tool, Tier 1, Tier 2, Annual Implementation Plan, Multi-Tiered Systems of Support', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/guidance/setting-mental-health-wellbeing-leader-success' },
    { title: 'Primary Welfare Officer transition — PWO, MHiPS, 2023 to 2026, registered teachers, Recruitment in Schools policy', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/guidance/primary-welfare-officer-transition' },
    { title: 'Regional mental health branch support — RMHB, regional mental health branch, MHiPS implementation', url: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/guidance/regional-mental-health-branch-support' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/mental-health-primary-schools-initiative/policy#rpl-main' }
  ],
},
  { id: 72, title: 'Disability Inclusion Funding and Support', category: 'Students', tags: ['disability', 'inclusion', 'tier 1', 'tier 2', 'dsf'], summary: 'Disability Inclusion tiered funding and school-level support.', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Overview of the Disability Inclusion funding model — 3 tiers, Tier 1, Tier 2, SRP, reasonable adjustments, vision for inclusion', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/overview-disability-inclusion-funding-model' },
    { title: 'Target group for Tier 2 school-level support — Tier 2, NCCD, supplementary, substantial, extensive adjustments, mainstream school', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/target-group-tier-2-school-level-support' },
    { title: 'Tier 2 school-level funding expenditure requirements — Tier 2, $5,000 GST, CRT replacement, adaptive technology, minor modifications', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/tier-2-school-level-funding-expenditure' },
    { title: 'Planning for expenditure — 4 key principles, whole-of-school, in-class, allied health, evidence-based practices', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/planning-expenditure-2021' },
    { title: 'Tier 2 funding use case studies — Loddon Campaspe, Bayside Peninsula, 225 enrolments, 1,800 enrolments, Tier 2 case studies', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/tier-2-funding-use-case-studies' },
    { title: 'Requirements for reporting of Tier 2 expenditure — Tier 2, CASES21, eduPay, monthly reporting, expenditure instructions', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/requirements-reporting-tier-2-expenditure' },
    { title: 'Tier 3 student-level funding — Tier 3, Disability Inclusion Profile, complex needs, parent/carer participation', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/tier-3-student-level-funding' },
    { title: 'Disability Inclusion Transition Funding — Level 5, Level 6, PSD, Tier 3, Regional Implementation Team, transition funding', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/guidance/disability-inclusion-transition-funding' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/disability-inclusion-funding-support/policy#rpl-main' }
  ],
},
  { id: 73, title: 'Disability Inclusion Profile', category: 'Students', tags: ['disability inclusion profile', 'dip', 'profile', 'funding', 'tier 3', 'levels of adjustment', 'functional needs', 'difs portal', 'facilitator', 'student support group', 'ssg', 'profile tips', 'profile asist', 'ables', 'appeal'], summary: 'Profile process for determining individual student Tier 3 funding. Led by trained facilitator with SSG. 6 functional needs domains covering 31 school-related activities. Moderation and QA for consistency.', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/policy', guidance: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance', resources: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/resources' },
    chapters: [
      { title: 'The purpose of a Disability Inclusion Profile meeting and process — SSG, 6 domains, facilitator, levels of adjustment, functional needs, strengths-based', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance/purpose-disability-inclusion-profile-meeting' },
      { title: 'Identifying students to undertake a Disability Inclusion Profile — Out-of-Home Care, Koorie Education, Youth Justice, facilitator service, prioritising', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Requesting a Disability Inclusion Profile meeting — DIFS Portal, Tier 3 funding, registration form, facilitator service, deteriorating medical conditions', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Supporting information required for a Disability Inclusion Profile Process — Profile ASIST, 15 documents, substantial adjustments, extensive adjustments, supporting information', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance/supporting-information-required-disability-inclusion' },
      { title: 'Scheduling a Disability Inclusion Profile meeting — DIFS, 90 minutes, 10 weeks, 12 months, SSG, pre-prep', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance/scheduling-disability-inclusion-profile-meeting' },
      { title: 'Preparing for a Disability Inclusion Profile meeting — roles and responsibilities', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Participating in the Disability Inclusion Profile meeting — roles and responsibilities', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance/participating-disability-inclusion-profile-meeting-roles' },
      { title: 'Finalising the Disability Inclusion Profile — 5 school days, facilitator service, Behaviour Support Plan, supporting information, extensions', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Notification of Disability Inclusion Profile outcome — DIFS Portal, 4 school weeks, profile report, School Resource Notification, interpreter', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Steps following notification of Disability Inclusion Profile outcome — principal, SSG, IEP, behaviour support plan, functional behaviour analysis, resource allocation', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Requesting a subsequent Disability Inclusion Profile — 2 years, 7 years, 24 months, Tier 3 funding, SSG, subsequent profile', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Appealing a Disability Inclusion Profile outcome — Tier 3 funding, threshold, validation pathway, contact@difs.com.au, new and substantial information', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' },
      { title: 'Enrolment in specialist schools — specialist schools, Enrolment policy, requirements', url: 'https://www2.education.vic.gov.au/pal/disability-inclusion-profile/guidance' }
    ],
    resources: [
      { title: 'Levels of adjustment (PDF)', note: 'reference for profile meetings' },
      { title: 'Disability Inclusion Profile Meeting guide (PDF)', note: '' },
      { title: 'Functional Needs Domain Table (PDF)', note: '6 domains covering 31 activities' },
      { title: 'School-wide adjustments form (DOCX)', note: 'optional — captures school-level adjustments, policies, resources, supports' },
      { title: 'Profile Adjustments and Supporting Information Summary Tool (Profile ASIST) (DOCX)', note: 'optional — supports collation of supporting information' },
      { title: 'Disability Inclusion Profile — Teacher Identification of Personalised Strategies (Profile TIPS) (DOCX)', note: 'optional — prompts for teachers to identify individualised strategies' },
      { title: 'Student voice tool (DOCX)', note: 'discusses strengths, aspirations, functional needs, adjustments' },
      { title: 'Inclusive student voice toolkit (DOCX)', note: 'accessible, multi-modal tools for students with disability' },
      { title: 'Disability Inclusion Easy English guide (PDF)', note: 'explains profile process for students' },
      { title: 'Disability Inclusion social script — primary (DOCX)', note: 'explains profile meeting with easy English and photos' },
      { title: 'My Disability Inclusion Profile meeting at secondary school (DOCX)', note: 'version for secondary students' },
      { title: 'Disability Inclusion Profile — Easy English for Parents — About the DIP Meeting (PDF)', note: '' },
      { title: 'Disability Inclusion Profile — parent voice tool (DOCX)', note: '' },
      { title: 'DIFS Portal', note: 'staff login required — upload supporting information (max 15 documents recommended)' },
      { title: 'Abilities Based Learning and Education Support (ABLES)', note: 'assessment/reporting suite + professional learning modules' },
      { title: 'Disability Inclusion 101 professional learning series', note: 'live webinars' },
      { title: 'Disability Inclusion eLearning modules', note: 'on-demand for school staff' },
      { title: 'Regional Implementation Team / Disability Coordinator contacts (DOCX)', note: '' }
    ]
  },
  { id: 74, title: 'Visiting Teacher Service', category: 'Students', tags: ['visiting teacher', 'vts', 'diverse learners', 'inclusion'], summary: 'Visiting Teacher Service supporting students with disability and diverse learners.', url: 'https://www2.education.vic.gov.au/pal/visiting-teacher-service/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Eligibility and supports provided by the Visiting Teacher Service — VTS, Disability Inclusion, classroom teachers, physical disability, health care needs, eligibility criteria', url: 'https://www2.education.vic.gov.au/pal/visiting-teacher-service/guidance/eligibility-supports-provided-by-visiting-teacher-service' },
    { title: 'Referring to the Visiting Teacher Service — VTS, SOCS, HWKC, Visiting Teacher Manager, consent form, online referral', url: 'https://www2.education.vic.gov.au/pal/visiting-teacher-service/guidance/referring-to-visiting-teacher-service' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/visiting-teacher-service/policy#rpl-main' }
  ],
},
  // Child Safety
  { id: 75, title: 'Child Safe Standards', category: 'Child Safety', tags: ['child safe', 'child safety', 'standards', 'ministerial order 1359', '11 standards', 'protect', 'child safety champion', 'action list', 'bullying prevention'], summary: 'Child Safe Standards under Ministerial Order 1359. 11 compulsory minimum standards for all Victorian schools. Use Child Safety Action List to implement.', url: 'https://www2.education.vic.gov.au/pal/child-safe-standards/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/child-safe-standards/policy', guidance: 'https://www2.education.vic.gov.au/pal/child-safe-standards/guidance', resources: 'https://www2.education.vic.gov.au/pal/child-safe-standards/resources' },
    resources: [
      { title: 'Ministerial Order 1359 (PDF)', note: 'Implementing the Child Safe Standards — Managing the risk of child abuse in schools' },
      { title: 'Child Safety Action List (DOCX)', note: 'government schools — checklist to implement all 11 Standards' },
      { title: 'School Policy Templates Portal', note: 'staff login required — templates for bullying prevention, child safety responding, complaints, digital learning, wellbeing, supervision, visitors and volunteers' },
      { title: 'PROTECT website', note: 'templates, guidance and checklists for child safe organisation' },
      { title: 'Child Safe Standards training resources', note: 'PowerPoint presentations for school councils, school staff, and volunteers' },
      { title: 'Guidance for child safety champions', note: '' },
      { title: 'Template newsletter and website text', note: 'staff login required — to support community consultation on child safety policies' },
      { title: 'Contact: child.safe.schools@education.vic.gov.au', note: 'for help meeting the Standards' }
    ],
  chapters: [
    { title: 'The Child Safe Standards — 11 standards, MO 1359, VRQA, registration, child abuse, framework', url: 'https://www2.education.vic.gov.au/pal/child-safe-standards/policy' },
    { title: 'Relevant legislation — Education and Training Reform Act 2006, MO 1359, child abuse', url: 'https://www2.education.vic.gov.au/pal/child-safe-standards/policy' }
  ],
},
  { id: 76, title: 'Child Abuse (including grooming) — Identification and Response', category: 'Child Safety', tags: ['child abuse', 'grooming', 'protect', 'critical actions', 'reportable conduct', '4 critical actions', 'mandatory reporting', 'disclosure', 'victoria police', 'child protection', 'failure to disclose', 'maram', 'fviss', 'orange door'], summary: 'Use the 4 Critical Actions to identify and respond to child abuse (including grooming). Failure to report physical or sexual abuse may be a criminal offence. Report staff-involved abuse to Victoria Police (000).', url: 'https://www2.education.vic.gov.au/pal/protecting-children/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/protecting-children/policy', guidance: 'https://www2.education.vic.gov.au/pal/protecting-children/guidance/', resources: 'https://www2.education.vic.gov.au/pal/protecting-children/resources' },
    chapters: [
      { title: 'Recognising different types of child abuse', url: 'https://www2.education.vic.gov.au/pal/protecting-children/guidance/' },
      { title: 'Making a report or referral — the Four Critical Actions', url: 'https://www2.education.vic.gov.au/pal/protecting-children/guidance/making-report-or-referral-four-critical-actions' },
      { title: 'Reporting to Child Protection — process and escalation', url: 'https://www2.education.vic.gov.au/pal/protecting-children/guidance/' },
      { title: 'Training requirements', url: 'https://www2.education.vic.gov.au/node/3637' }
    ],
    resources: [
      { title: 'PROTECT 4 Critical Actions reference sheet — abuse by an adult engaged by a government school (including grooming)', note: '' },
      { title: 'PROTECT 4 Critical Actions reference sheet — student-to-student abuse', note: '' },
      { title: 'PROTECT 4 Critical Actions reference sheet — abuse in the family', note: '' },
      { title: 'PROTECT 4 Critical Actions reference sheet — abuse in the community', note: '' },
      { title: '4 Critical Actions posters', note: 'for display in all areas of the school' },
      { title: 'Protecting children — Mandatory reporting and other obligations e-learning', note: 'on LearnED via eduPay — search for child protection' },
      { title: 'Child Safe Standards training resources', note: 'for staff, volunteers and school councils — MO 1359' },
      { title: 'Documentation templates on PROTECT website', note: '' },
      { title: 'Commission for Children and Young People', note: 'regulates Child Safe Standards, Reportable Conduct Scheme, WWCC, Worker and Carer Exclusion Scheme' },
      { title: 'Victoria Police: 000 or local station', note: 'for all suspected abuse involving staff, contractor or volunteer, and all sexual abuse' },
      { title: 'The Orange Door', note: 'free service for family violence and extra support with care of children' },
      { title: '1800 Respect: 1800 737 732', note: 'counselling, information and referral for family violence' },
      { title: 'DFFH Professional Reporter and Referrer Information Hub', note: 'for Child Protection reports' }
    ]
  },
  { id: 76.5, title: 'Reportable and Notifiable Conduct', category: 'Child Safety', tags: ['reportable conduct', 'notifiable conduct', 'reportable conduct scheme', 'commission for children and young people', 'ccyp', 'conduct and integrity division', 'sexual offence', 'sexual misconduct', 'physical violence', 'disability worker regulation scheme', 'worker carer exclusion scheme', 'early learning victoria'], summary: 'Allegations of reportable conduct (sexual offence/misconduct, physical violence, significant emotional/psychological harm to a child) must be reported to the Conduct and Integrity Division. An allegation does not need to be substantiated.', url: 'https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy', resources: 'https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/resources' },
    resources: [
      { title: 'Reportable Conduct Scheme — FAQs (DOCX)', note: 'staff login required' },
      { title: 'Reportable Conduct Scheme — scenarios (DOCX)', note: 'staff login required — examples of what is and is not reportable' },
      { title: 'Reportable Conduct Scheme — conversation starter (DOCX)', note: 'staff login required — staff understanding tool' },
      { title: 'Child safety case study: potential grooming (DOCX)', note: 'staff login required' },
      { title: 'School-based and Early Learning Victoria employees subject to the Reportable Conduct Scheme (PDF and DOCX)', note: 'staff login required' },
      { title: 'Commission for Children and Young People — Reportable Conduct Scheme', note: 'CCYP regulator' },
      { title: 'Victorian Disability Worker Commission', note: 'Disability Worker Regulation Scheme' },
      { title: 'Conduct and Integrity Division', note: 'Department — receives and manages reportable conduct allegations' }
    ],
  chapters: [
    { title: 'Summary Details Reportable Conduct Scheme Disability Worker Regulation Scheme School councils and ELV centres Supporting impacted students following a reportable conduct allegation Definitions Relevant legislation', href: 'https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy https://www2.education.vic.gov.au/pal/reportable-notifiable-conduct/policy' }
  ],
},

  // OHS
  { id: 77, title: 'Occupational Health, Safety and Wellbeing Management in Schools', category: 'OHS', tags: ['ohs', 'ohsms', 'health and safety', 'management system', 'edusafe plus', 'statewide ohs services', 'ewss', 'employee wellbeing', 'converge', 'swms', 'safe work procedure', 'hsr', 'health and safety representative', 'ohs registers'], summary: 'OHS management system. Report via eduSafe Plus. OHS Advisory Service 1300 074 715. Statewide OHS Services Team provides hands-on support.', url: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/policy', guidance: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/guidance', resources: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/resources' },
    chapters: [
      { title: '1. eduSafe Plus — report and manage incidents, hazards and near misses', url: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/guidance/edusafe-plus' },
      { title: '3. Workers compensation and return to work', url: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/guidance/workers-compensation' },
      { title: '4. COVID-19 employee health, safety and wellbeing supports', url: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/guidance/covid-19' },
      { title: '5. Useful contacts (including for emergencies)', url: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/guidance/useful-contacts' },
      { title: '6. Employee Wellbeing Support Services', url: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/guidance/employee-wellbeing-support-services' },
      { title: '8. Defined health and safety terms', url: 'https://www2.education.vic.gov.au/pal/occupational-health-safety-wellbeing-management/guidance/defined-health-safety-terms' }
    ],
    resources: [
      { title: 'eduSafe Plus — hazard/incident reporting system', note: 'staff login required' },
      { title: 'eduSafe Plus Knowledge Base', note: 'staff login required — reference guides, keyword search' },
      { title: 'eduSafe Plus poster (PDF)', note: 'for display on OHS noticeboards' },
      { title: 'Hazard and incident investigation template (DOCX)', note: 'for investigations of hazards/incidents reported to WorkSafe' },
      { title: 'OHS Services one-page flyer (DOCX)', note: 'overview of Statewide OHS Services Team offerings' },
      { title: 'Employee Wellbeing Support Services (EWSS) — Converge', note: '24/7 confidential counselling, 4 sessions per issue per year (2 for Legal, unlimited for Manager Support)' },
      { title: 'EWSS A3 poster — Putting You First (PDF)', note: '' },
      { title: 'EWSS A3 poster — Services available to staff (PDF)', note: '' },
      { title: 'OHS Advisory Service: 1300 074 715', note: 'safety@education.vic.gov.au — practical advice, site visits, documentation support' },
      { title: 'Statewide OHS Services Team', note: 'hands-on regional support — compiling OHS registers, WorkSafe interactions, eduSafe Plus management' },
      { title: 'Contact: employeehealth@education.vic.gov.au', note: 'for following up Converge complaints' }
    ]
  },
  { id: 78, title: 'Psychological Health and Safety for School Staff', category: 'OHS', tags: ['psychological', 'mental health', 'psychosocial', 'wellbeing', 'risk register'], summary: 'Psychological health and safety for staff. Psychosocial hazards must be controlled.', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1. Understanding psychologically healthy and safe workplaces — psychosocial hazards, HSR, reasonably practicable, mental injury, OHS management', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/understanding-psychologically-healthy-safe-workplaces' },
    { title: '2. Effective consultation and communication for psychological health and safety — HSRs, School Staff Survey, Principal Check-In Survey, Employee Wellbeing Support Services, OHS risk register, WorkSafe Victoria', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/effective-consultation-communication-for-psychological-health-safety' },
    { title: '3. Identifying psychosocial hazards — 5 high-impact hazards, OHS risk register, annual review, psychosocial hazards', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/identifying-psychosocial-hazards' },
    { title: '4. Assessing psychosocial risk — OHS risk register, OHS advisory service, Statewide OHS Support, WorkSafe Compliance Code, risk ratings', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/assessing-psychosocial-risk' },
    { title: '5. Controlling the risks — Work-Related Violence, Workplace Bullying, Sexual Harassment, OHS risk register, HSR, elimination', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/controlling-the-risks' },
    { title: '6. Monitoring and reviewing controls — annual review, OHS risk register, principal network meetings, OHS Consultation, issue resolution, HSRs', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/monitoring-reviewing-controls' },
    { title: '7. Reporting hazards, incidents and injuries — eduSafe Plus, OHS risk register, OHS Act, incident review manager, near misses, line manager', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/reporting-hazards-incidents-injuries' },
    { title: '8. Record keeping — eduSafe Plus, OHS risk register, OHS committee, Records Management policy, retention periods, confidentiality', url: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/procedure/record-keeping' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/psychological-health-safety-school-staff/policy#rpl-main' }
  ],
},
  { id: 79, title: 'Work-Related Violence in Schools', category: 'OHS', tags: ['violence', 'work-related violence', 'risk assessment', 'challenging behaviour'], summary: 'Enter work-related violence as hazard in school OHS risk register. Assess risk level per procedure.', url: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1. Work-related violence risk assessment — WRV, HSR, OHS risk register, principal, site manager, hazard description', url: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/procedure/work-related-violence-risk-assessment' },
    { title: '2. Risk controls – overview', url: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/procedure/risk-controls-overview' },
    { title: '3. Risk controls – student challenging behaviours', url: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/procedure/risk-controls-student-challenging-behaviours' },
    { title: '4. Risk controls – parent/carer behaviours', url: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/procedure/risk-controls-parent-carer-behaviour' },
    { title: '5. Incident reporting — eduSafe Plus, SEIL, regional director, Statewide OHS Services, workplace modifications, repeated exposure', url: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/procedure/incident-reporting' },
    { title: '6. Department support for schools — OHS Advisory Service, eduSafe Plus, regional OHS officers, 3 per region, audit process', url: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/procedure/department-support-schools' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/work-related-violence-schools/policy#rpl-main' }
  ],
},
  { id: 80, title: 'Workers Compensation — Workplace Injury', category: 'OHS', tags: ['workcover', 'workers compensation', 'injury', 'mup', 'make up pay', 'rtw', 'return to work coordinator', '1984 hours', '52 weeks', 'provisional payments', 'claim', 'certificates of capacity', 'significant contributing factor'], summary: 'WorkCover claims, Make Up Pay (MUP), return-to-work. MUP = 52 weeks / 1,984 hours full-time (pro-rata part-time); ceases after. Reimbursement sought within 3 months.', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/workers-compensation/policy', guidance: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance', resources: 'https://www2.education.vic.gov.au/pal/workers-compensation/resources' },
    chapters: [
      { title: 'Early intervention — eduSafe Plus, Victorian Academy of Teaching and Leadership, Employee Wellbeing Support Services, return to work, near misses', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/early-intervention' },
      { title: 'Lodging a claim — WorkCover, 30 days, 14 days, 28 days, eduPay, certificate of capacity, return to work coordinator', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/lodging-a-claim' },
      { title: 'Once a claim has been lodged — 13 weeks, 5 business days, certificate of capacity, provisional payments, mental injury, return to work coordinator', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/once-a-claim-has-been-lodged' },
      { title: 'The return to work process (guidance for return to work coordinators) — LearnEd, 2 years, principal claims, Return to Work Coordination eLearn, Advice template', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/return-to-work-process-guidance-for-return-to-work-coordinators' },
      { title: 'Leave and payroll management (for HR administration staff) — eduPay, claim acceptance, claim number validation, leave codes, payroll, HR administrator', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/leave-payroll-management-for-hr-administration-staff' },
      { title: 'Privacy and record keeping — certificates of capacity, Privacy and Information Sharing policy, Records Management policy, hard copy, electronic files', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/privacy-record-keeping' },
      { title: 'Dispute resolution — WIRC Act, agent, return to work coordinator, WorkSafe, appeal, litigation', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/dispute-resolution' },
      { title: 'Contacts and supports — 03 7022 0780, 1300 975 609, workers.compensation.advisory@education.vic.gov.au, educlaims@gbtpa.com.au, agent', url: 'https://www2.education.vic.gov.au/pal/workers-compensation/guidance/contacts-supports' }
    ],
    resources: [
      { title: 'Advice of nominated return to work coordinator letter — template (DOCX)', note: 'includes workers compensation fact sheet for injured worker' },
      { title: 'Processing weekly compensation payments including claim validation — guide (DOCX)', note: 'staff login required' },
      { title: 'Return to work funding instructions — guide (DOCX)', note: 'staff login required' },
      { title: 'Current Weekly Earnings (CWE) instructions — guide (DOCX)', note: 'staff login required' },
      { title: 'Make-up pay (MUP) entitlement balance instruction — guide (DOCX)', note: 'staff login required' },
      { title: 'Claim acceptance process on eduPay — guide (DOCX)', note: 'staff login required' },
      { title: 'Mental health claims management online session', note: 'staff login required — for RTW coordinators' },
      { title: 'Provisional Payments: Information for employers', note: 'WorkSafe Victoria — for mental injury claims, up to 13 weeks' },
      { title: 'What is a person-centred approach factsheet (PDF)', note: 'National Disability Practitioners' },
      { title: 'Claims management — best practice framework and support', note: 'Superfriend psychological claims management resource' },
      { title: 'eduSafe Plus workers compensation module', note: 'for lodging and managing claims' },
      { title: 'Workers Compensation Team — Injury Management Specialist', note: 'for support during inspector visits and RTW planning' }
    ]
  },
  { id: 81, title: 'OHS Purchasing', category: 'OHS', tags: ['ohs purchasing', 'equipment', 'risk assessment', 'safe work procedure'], summary: 'OHS requirements when purchasing, hiring, leasing or accepting donated goods.', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1 Introduction — OHS purchasing, hiring, leasing, donated goods, hazards, controls', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/1-introduction' },
    { title: '2 Identifying goods with the potential to create OHS risks — principal, HSR, donated goods, hire, lease', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/2-identifying-goods-potential-create' },
    { title: '3 OHS Purchasing Checklist — OHS Purchasing Checklist, HSR, principal, section 2, receipt of goods', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/3-ohs-purchasing-checklist' },
    { title: '4 Risk assessment and safe work procedure — Risk Assessment Template, Safe Work Procedure, wood, metal work, agricultural equipment, training', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/4-risk-assessment-and-safe-work' },
    { title: '5 Non-conforming goods — non-conforming goods, supplier, withdrawn from service, isolated, safety hazard', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/5-non-conforming-goods' },
    { title: '6 Management of suppliers — CASES21, suppliers, purchasing system', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/6-management-suppliers' },
    { title: '7 Disposal and decommissioning of goods — decommissioning, disposal, sustainability, environmental, social factors', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/7-disposal-and-decommissioning-goods' },
    { title: '8 Responsibilities of suppliers — OHS Purchasing Procedure, Chapter 8, suppliers of goods, legislative requirements', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/8-responsibilities-suppliers' },
    { title: '9 Legislation, codes of practice, standards and guidance — Occupational Health and Safety Regulations 2017, codes of practice, standards', url: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/procedure/9-legislation-codes-practice-standards' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/occupational-health-and-safety-ohs-purchasing/policy#rpl-main' }
  ],
},
  { id: 82, title: 'OHS Induction and Training for School Staff', category: 'OHS', tags: ['induction', 'training', 'ohs induction', 'crt'], summary: 'OHS induction and training requirements including for CRTs.', url: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'OHS inductions for school staff — OHS induction checklist, eduSafe Plus, OHS training register, emergency procedures, evacuation points', url: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/procedure/ohs-inductions-school-staff' },
    { title: 'OHS inductions for casual relief teachers — CRTs, eduPay, OHS eLearns, CRT handbook, site-specific induction, pre-employment checks', url: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/procedure/ohs-inductions-casual-relief-teachers' },
    { title: 'OHS inductions for principals — PECs, Principal Welcome Pack, Principals\' Page, Principal Advisory Service, regional induction programs', url: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/procedure/ohs-inductions-for-principals' },
    { title: 'Identifying OHS training — LearnED, 3 years, OHS eLearns, Mandatory and Priority Training Planner, eduPay, HSR', url: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/procedure/identifying-ohs-training' },
    { title: 'Scheduling and recording OHS training — Victorian Academy of Teaching and Leadership, OHS training register, eduSafe Plus, certificates, expiry alerts, annual review', url: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/procedure/scheduling-and-recording-ohs-training' },
    { title: 'Review of OHS training for school staff — annual review, OHS activities calendar, OHS risk register, LearnED, eLearning modules', url: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/procedure/review-ohs-training-school-staff' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/ohs-induction-training-school-staff/policy#rpl-main' }
  ],
},
  { id: 83, title: 'First Aid for Students and Staff', category: 'OHS', tags: ['first aid', 'medical', 'emergency', 'cpr'], summary: 'First aid requirements for students and staff in schools.', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'School level policy — Minimum Standards for School Registration, First Aid policy template, School Policy Templates Portal', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/school-level-policy' },
    { title: 'First aid risk assessment — First Aid Risk Assessment, HSR, first aid officer, principal', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/first-aid-risk-assessment' },
    { title: 'Staff first aid training — HLTAID011, HLTAID009, 3 years, annual CPR, anaphylaxis, asthma, diabetes', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/staff-first-aid-training' },
    { title: 'First aid rooms and sick bays — First Aid Summary Sheet, Emergency Management Contact Details Sheet, sick bay, stretcher, OHS notice board', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/first-aid-rooms-and-sick-bays' },
    { title: 'First aid kits — Concussion Recognition Tool 6, nitrile gloves, sterile saline, St John Ambulance, Ambulance Victoria, First Aid Risk Assessment', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/first-aid-kits' },
    { title: 'Automatic external defibrillators — AED, 12 months refresher, monthly checks, batteries, pads, life-threatening injuries', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/automatic-external-defibrillators' },
    { title: 'Inspection and review of first aid facilities — OHS activities calendar, First aid kit contents checklist, first aid officer, annual inspection', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/inspection-and-review-first-aid-facilities' },
    { title: 'Medication — Medication policy, Medication authority form, blue reliever puffer, asthma attack, log', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/medication' },
    { title: 'General first aid procedures for staff and students — DRSABCD, Better Health Channel, ice pack, cold compress, emergency action', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/general-first-aid-procedures-staff-and-students' },
    { title: 'Infection and prevention control — AS 4031-1992, sharps container, blood spill, contaminated waste, biological spill, nitrile gloves', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/infection-and-prevention-control' },
    { title: 'Recording the provision of care resulting from a student or staff incident, injury or illness, including the administration of first aid — eduSafe Plus, Sick Bay form, Incident form, WorkSafe, 13 23 60, 48 hours', url: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/guidance/recording-provision-of-care' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/first-aid-students-and-staff/policy#rpl-main' }
  ],
},

  // School Operations
  { id: 84, title: 'Managing and Reporting School Incidents (Including Emergencies)', category: 'School Operations', tags: ['incidents', 'emergencies', 'isoc', 'edusafe plus', 'severity', 'worksafe', 'notifiable', 'incident support operations centre', 'seil', 'statewide ohs services'], summary: 'Emergencies/High/Extreme: ISOC 1800 126 126. WorkSafe notifiable: 13 23 60. Low/Medium: report direct into eduSafe Plus. 6-stage management process.', url: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/policy', guidance: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/guidance', resources: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/resources' },
    chapters: [
      { title: 'Stage 1 — Immediate response', url: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/guidance' },
      { title: 'Stage 2 — Reporting an incident (Report for Support)', url: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/guidance/step-2-reporting' },
      { title: 'Stage 3 — Ongoing support and recovery', url: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/guidance' },
      { title: 'School evacuation and temporary closures in emergency circumstances', url: 'https://www2.education.vic.gov.au/pal/reporting-and-managing-school-incidents-including-emergencies/guidance/school-evacuation-and' }
    ],
    resources: [
      { title: 'A guide to managing incidents in your school — booklet (PDF)', note: 'staff login required — 6 stages of managing and responding' },
      { title: 'A guide to managing incidents in your school — booklet (DOCX)', note: 'staff login required' },
      { title: 'eduSafe Plus', note: 'staff login required — hazard, incident and injury reporting system' },
      { title: 'eduSafe Plus incident notification template (DOCX)', note: 'for contractors, visitors or volunteers' },
      { title: 'eduSafe Plus hazard notification template (DOCX)', note: 'for contractors, visitors or volunteers' },
      { title: 'Notifiable incidents to WorkSafe flowchart (PDF)', note: 'determining when incidents must be reported to WorkSafe' },
      { title: 'WorkSafe incident notification form', note: 'for notifiable incidents' },
      { title: 'Severity rating decision-making matrix (PDF)', note: 'for assessing incident severity' },
      { title: 'ISOC: 1800 126 126', note: 'Incident Support and Operations Centre — High/Extreme severity' },
      { title: 'WorkSafe: 13 23 60', note: 'for notifiable incidents' },
      { title: 'OHS Advisory Service: 1300 074 715', note: 'help with reporting or managing staff-related incidents' }
    ]
  },
  { id: 85, title: 'Emergency and Critical Incident Management Planning', category: 'School Operations', tags: ['emergency management plan', 'emp', 'critical incident', 'vrqa', 'online emp portal', 'imt', 'incident management team', 'evacuation diagram', 'peep', 'personal emergency evacuation plan', 'bushfire', 'bomb threat', 'trauma', 'aiims', 'vic emergency', 'business continuity', 'drill'], summary: 'EMP must be reviewed and approved by principal annually by 1 September. Framework complies with AS 3745-2010 and AIIMS. Use Online EMP Portal.', url: 'https://www2.education.vic.gov.au/pal/emergency-critical-incident-management-planning/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/emergency-critical-incident-management-planning/policy', guidance: 'https://www2.education.vic.gov.au/pal/emergency-critical-incident-management-planning/guidance', resources: 'https://www2.education.vic.gov.au/pal/emergency-critical-incident-management-planning/resources' },
    chapters: [
      { title: 'Developing and updating an EMP — EMP, Online EMP Portal, 1 September, annual review, principal approval', url: 'https://www2.education.vic.gov.au/pal/emergency-critical-incident-management-planning/guidance/developing-updating-emp' },
      { title: 'Joint emergency management planning for shared sites — shared sites, joint EMP, evacuation, assembly points, off-site', url: 'https://www2.education.vic.gov.au/pal/emergency-critical-incident-management-planning/guidance/joint-emergency-management-planning-for-shared-sites' }
    ],
    resources: [
      { title: 'Emergency and critical incident management planning guide for government schools (DOCX and PDF)', note: 'mandatory framework guide' },
      { title: 'Guide to developing your EMP for early childhood services and non-government schools (DOCX)', note: '' },
      { title: 'Online EMP Portal', note: 'staff login required — primary tool for creating/maintaining EMP' },
      { title: 'Evacuation diagram template (PPTX)', note: 'with icons and layout' },
      { title: 'Evacuation diagram checklist (DOCX)', note: '' },
      { title: 'Area map template (PPTX)', note: 'for offsite assembly areas' },
      { title: 'Communications tree template (PPTX)', note: '' },
      { title: 'IMT structure (small school) template (PPTX)', note: 'sample Incident Management Team diagram' },
      { title: 'Drill observer and debrief record (DOCX)', note: 'staff login required' },
      { title: 'Bomb threat checklist (DOCX)', note: 'staff login required' },
      { title: 'School bushfire site readiness review checklist (DOCX)', note: '' },
      { title: 'Personal emergency evacuation plan (PEEP) — employee template (DOCX)', note: '' },
      { title: 'Personal emergency evacuation plan (PEEP) — student template (DOCX)', note: '' },
      { title: 'Managing trauma guide (PDF)', note: 'staff login required — recovery tools, practical resources' },
      { title: 'Recovery tools excerpt (PDF)', note: 'staff login required' },
      { title: 'Emergency management considerations for schools on shared sites (DOCX)', note: '' },
      { title: 'Letter and short form — socialise your school EMP (DOCX)', note: 'sample communications' },
      { title: 'Emergency and critical incident management e-Learning modules', note: 'self-directed for all staff' },
      { title: 'VicEmergency App', note: 'all principals/key staff should download with school watch zone' },
      { title: 'Contact: emergency.management@education.vic.gov.au', note: 'emergency management arrangements' },
      { title: 'Contact: business.continuity@education.vic.gov.au', note: 'school business continuity' }
    ]
  },
  { id: 86, title: 'Excursions', category: 'School Operations', tags: ['excursions', 'camps', 'adventure activities', 'student activity locator', 'sal', 'risk register', 'medical information', 'overseas travel', 'travel insurance', 'vmia', 'consent', 'swimming', 'water-based activities', 'external providers', 'liability', 'waivers'], summary: 'Camps, excursions and adventure activities. Submit via Student Activity Locator 5 business days prior. Mandatory risk register for all day/overnight/adventure/interstate/overseas excursions. Travel insurance via VMIA for overseas.', url: 'https://www2.education.vic.gov.au/pal/excursions/policy', popular: true,
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/excursions/policy', guidance: 'https://www2.education.vic.gov.au/pal/excursions/guidance', resources: 'https://www2.education.vic.gov.au/pal/excursions/resources' },
    chapters: [
      { title: 'Approvals — principal approval form, ERREMP, overnight, adventure activities, swimming checklist', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/approvals' },
      { title: 'Consent — written consent, local excursions, annual consent, walking distance, notification form', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/consent' },
      { title: 'Student medical information — medical information form, adventure activities, camps, overseas, Compass', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/student-medical-information' },
      { title: 'Student Activity Locator — SAL, 5 business days, user guide, register camps, emergency services', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/student-activity-locator' },
      { title: 'Risk management planning — ERREMP, local excursions template, principal sign-off, interstate, adventure activities', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/risk-management-planning' },
      { title: 'Emergency or critical incident management — ERREMP, interstate, adventure activities, emergency response procedures, swimming', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/emergency-or-critical-incident-management' },
      { title: 'Staffing – roles and responsibilities — VIT registered, principal approval, Child Safe Standards, Working with Children Check, supervisory', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/staffing-roles-and-responsibilities' },
      { title: 'Supervision — 1:20 staff-student ratio, minimum 2 staff, supervision, risk assessment, class teacher', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/supervision' },
      { title: 'Student preparation and behaviour — Student skills swimming template, swimming, water-based activities, return home, behaviour', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/student-preparation-and-behaviour' },
      { title: 'Liability, waivers and indemnities — duty of care, waiver and indemnity, Legal Division, providers, foreseeable harm', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/liability-waivers-indemnities' },
      { title: 'External providers — external providers, principal check, child safe, expertise, duty of care', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/external-providers' },
      { title: 'First aid — first aid kit, CPR qualification, eduSafe Plus, RTO, Work Health and Safety Act 2010', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/first-aid' },
      { title: 'Venue selection — accredited campsites, residential, inspection, suitability, outdoor', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/venue-selection' },
      { title: 'Weather and emergency warnings — Bureau of Meteorology, VicEmergency, Catastrophic FDR, MetEye, fire weather district', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/weather' },
      { title: 'Transport — VicRoads, Group Travel Authority, 12 to 35, PTV, driver fatigue', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/transport' },
      { title: 'Communications — satellite phones, communication plan, remote, designated school contact, recall', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/communications' },
      { title: 'Identification — high visibility, vests, reflective, bushwalking, cycling', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/identification' },
      { title: 'Overseas travel — DFAT, Smartraveller, travel insurance, homestay, Child Safe Standards', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/overseas-travel' },
      { title: 'Adventure activities – including swimming and water-based activities — adventure activities, swimming carnivals, lifesaving, instructional swimming, principal knowledge', url: 'https://www2.education.vic.gov.au/pal/excursions/guidance/adventure-activities' }
    ],
    resources: [
      { title: 'Excursions — principal approval form (DOCX)', note: 'must be submitted with consent forms, medical forms, risk register' },
      { title: 'Camps, excursions, swimming and/or water-based activity checklist (DOCX)', note: 'planning checklist for all staff responsibilities' },
      { title: 'Medical information form — camps and overseas excursions (DOCX)', note: 'mandatory for all camps and overseas excursions' },
      { title: 'Medical information form — day excursions involving adventure activities (DOCX)', note: 'mandatory for day excursions with adventure activities' },
      { title: 'Risk assessment for local excursions template (DOCX)', note: 'staff login required — compulsory for local excursions (no adventure activity)' },
      { title: 'Excursions risk register and emergency management plan template (DOCX)', note: 'mandatory for all day/overnight/adventure/interstate/overseas/air/water' },
      { title: 'Blank excursion risk register and emergency management plan template (DOCX)', note: 'blank version of the mandatory template' },
      { title: 'Student skills swimming and water-based activities template (DOCX)', note: 'documents student experience, skills and preparation' },
      { title: 'Clothing and equipment list (general) (DOC)', note: 'sample list to adapt to activity' },
      { title: 'Sample emergency response procedures (DOCX)', note: 'supports developing emergency management plan' },
      { title: 'Communications plan template (DOCX)', note: 'suggested template for overnight/overseas/interstate/adventure' },
      { title: 'Risk analysis tools (DOC)', note: 'explains the department risk rating matrix' },
      { title: 'Department of Education Risk Management Framework (PDF and DOCX)', note: 'staff login required — department-wide risk approach' },
      { title: 'Student Activity Locator (SAL)', note: 'staff login required — submit 5 business days prior' },
      { title: 'School Staff Travel Application', note: 'staff login required — for overseas school travel + post-travel report' }
    ]
  },
  { id: 87, title: 'Outside School Hours Care (OSHC)', category: 'School Operations', tags: ['oshc', 'before school', 'after school', 'vacation care', 'nqf', 'acecqa'], summary: 'NQF applies. School council responsible for decision-making and operation.', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'About outside school hours care — OSHC, ages 5 to 12, weekdays, school holidays, student-free days', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/about-outside-hours' },
    { title: 'Decide if you need a service — 6 steps, working group, school council, needs analysis, scoping', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/decide-if-you-need' },
    { title: 'Small and regional OSHC grants — OSHC Establishment Grants, 2024-25 Budget, round 2, 18 September 2024, 20 October 2024', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/small-regional-oshc-grants' },
    { title: 'Plan to start a service – school council managed service — school council bank account, VMIA, SECS, Michael Roleff, postal address', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/plan-start-service' },
    { title: 'Plan to start and monitor a third party-managed service — EOI template, third party provider, schools.procurement, OSHC licence agreement, value for money', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/plan-start-service-0' },
    { title: 'Legal requirements — NQF, NQS, ACECQA, QARD, 7 quality areas', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/legal-requirements' },
    { title: 'Run a service operated by your school — service promotion, anniversaries, stakeholders, viability, campaigns', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/run-service' },
    { title: 'Change the provider or operating model of your service — approved provider, licence agreement, QARD, transfer, exit', url: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/guidance/change-operating' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/outside-school-hours-care-decision-making-regarding-provision-oshc/policy#rpl-main' }
  ],
},
  { id: 88, title: 'Mobile Phones — Student Use', category: 'School Operations', tags: ['mobile phones', 'phones', 'devices', 'ministerial policy'], summary: 'Ministerial policy. Secure storage required during school hours.', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Details — switched off, securely stored, School Policy Templates Portal, Ministerial policy, local policy', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Exceptions — exceptions, 3 categories, granted purpose, documentation, mobile phone', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Exclusions — wearable devices, iPads, notifications off, work experience, VET', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Secure storage — secure storage, owner\'s risk, principal, Claims for Property Damage, accessible', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Enforcement — Ministerial Order 1125, suspensions, detention, student engagement, online', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Review — 3 to 4 years, review, survey questions, focus group, effectiveness', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Technology use at home — balance, online time, families, resources, child', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Definitions — cellular, telecommunication, network, telephone, definition', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' },
    { title: 'Relevant legislation — Equal Opportunity Act 2010, 21 December 2025, Ministerial policy, legislation, Vic', url: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/students-using-mobile-phones/policy#rpl-main' }
  ],
},

  // Infrastructure
  { id: 89, title: 'Buildings and Grounds Maintenance and Compliance', category: 'Infrastructure', tags: ['maintenance', 'buildings', 'grounds', 'make-safe', 'essential safety measures'], summary: 'Principals responsible for compliance and essential services. Make-safe program via PFM.', url: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Make-safe Guidelines — 1300 133 468, VSBA Make-safe, vandalism, break-ins, immediate health and safety', url: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/guidance/make-safe-guidelines' },
    { title: 'Area-wide power outage following a major weather event — storms, bushfires, floods, VSBA Make-safe, Business Continuity Plan', url: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/guidance/area-wide-power-outage-following-a-major-weather-event' },
    { title: 'Emergency Maintenance Program Guidelines — EMP, AIMS, regional office, Provision and Planning Manager, eligibility criteria', url: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/guidance/emergency-maintenance-program-guidelines' },
    { title: 'Safe Tree Program Guidelines — Safe Tree Program, arborist report, high-risk trees, VSBA Response Programs Unit, reimbursement', url: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/guidance/safe-tree-program' },
    { title: 'Essential Safety Measures — ESM, VSBA, Building Regulations 2018, AIMS, 1 January 2024', url: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/guidance/essential-safety-measures' },
    { title: 'Roof Inspection, Downpipes and Guttering, and Height Safety Systems Guidelines — 2 metres, working at heights, roof plumber, gutters, downpipes', url: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/guidance/roof-inspection-downpipes-and-guttering-and-height-safety-systems-guidelines' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/buildings-grounds-maintenance/policy#rpl-main' }
  ],
},
  { id: 90, title: 'School Maintenance Plans and Rolling Facilities Evaluations', category: 'Infrastructure', tags: ['smp', 'rfe', 'maintenance plan', 'aims', 'facilities'], summary: 'SMP managed in AIMS. Onsite RFE every 5 years.', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'School Maintenance Plans – an overview — 5-year plan, AIMS, Student Resource Package, RFE, attestation', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Rolling Facilities Evaluations – an overview — 5-year cycle, 300 schools, VSBA, Condition Assessment Report, 2027', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Condition assessment — 2 months prior, SAMS, sams@education.vic.gov.au, pre-assessment questionnaire, service provider', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Condition Assessment Report — CAR, 4 to 6 weeks, AIMS, 10 business days, feedback', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Specialist assessments — specialist assessment, defect, service provider, VSBA, investigation', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Bushfire Attack Level and Shelter in Place assessments — Bushfire Attack Level, Shelter in Place, Bushfire at Risk Register, ember resistance, RFE', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Preparing a School Maintenance Plan — 5-year plan, condition-based, routine activities, AIMS, VSBA endorsement', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Learning to use the School Maintenance Plan — VSBA workshops, training, AIMS, school year, condition assessment', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Access the School Maintenance Plan — AIMS, condition assessment, user guide, access, submit', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Benefits of School Maintenance Plans — 5-year period, Student Resource Package, legacy document, value for money, scheduled works', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'How the VSBA uses School Maintenance Plans — VSBA, evidence base, asset planning, investment decisions, government', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'Rolling Facilities Evaluation team — rfeproject@education.vic.gov.au, RFE team, contact, email, Rolling Facilities Evaluation', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' },
    { title: 'School Maintenance Plan team — maintenance.plan@education.vic.gov.au, 12 January 2024, contact, email, School Maintenance Plan team', url: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/school-maintenance-plans-rfe/policy#rpl-main' }
  ],
},
  // IT & Privacy
  { id: 91, title: 'Privacy and Information Sharing', category: 'IT & Privacy', tags: ['privacy', 'pia', 'privacy impact assessment', 'information sharing', 'data', 'privacy matrix', 'health information', 'biometric', 'schools privacy policy', 'ovic', 'privacy complaint', 'privacy incident', 'consent', 'collection notice', 'photographs filming'], summary: 'PIAs required for software handling personal/sensitive/health info. Contact privacy@education.vic.gov.au. Regulated by the Privacy and Data Protection Act 2014 (Vic).', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/policy',
    tabs: { policyAndGuidelines: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/policy', guidance: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance', resources: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/resources' },
    chapters: [
      { title: 'How to implement the Schools’ privacy policy — Schools\' privacy policy, collection notice, Term 1, parent translations, enrolment', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/how-implement-schools-privacy-policy' },
      { title: 'Protecting personally identifiable information guideline — personally identifiable information, digital, hardcopy, credentials, legal identity', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/protecting-personally-identifiable-information-guideline' },
      { title: 'Collection notices — Schools\' privacy collection notice, plain language, transparency, primary purpose, parents', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/collection-notices' },
      { title: 'Consent — consent, CISS, FVISS, mature minors, health information', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/consent' },
      { title: 'Photographs, filming and recording — photographs, filming, recording, copyright, consent', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/photographs-filming-and-recording' },
      { title: 'Sharing information — need to know basis, primary purpose, secondary purpose, health information, sharing', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/sharing-information' },
      { title: 'Privacy impact assessments — PIA, sensitive information, high risk software, child safety, parent notifications', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/privacy-impact-assessments' },
      { title: 'Health information — Health Records Act 2001, physical, mental, psychological, identifiable', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/health-information' },
      { title: 'Biometric information and technologies — biometric, Health Records Act 2001, scanning, intrusive, least intrusive', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/biometric-information-and-technologies' },
      { title: 'Information security — ICT, Information Security policy, Software and Administration Systems, reasonable steps, audit', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/information-security' },
      { title: 'Privacy incidents — data breach, privacy@education.vic.gov.au, Privacy team, notification, suspected', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/privacy-incidents' },
      { title: 'Complaints — privacy@education.vic.gov.au, Privacy team, complaints, child, OVIC', url: 'https://www2.education.vic.gov.au/pal/privacy-information-sharing/guidance/complaints' }
    ],
    resources: [
      { title: 'Privacy Impact Assessment (PIA) template (DOCX)', note: 'staff login required — 145 KB' },
      { title: 'Privacy Matrix (XLSX)', note: 'staff login required — 34 KB' },
      { title: 'Privacy incidents guide', note: 'staff login required' },
      { title: 'Privacy complaints guide', note: 'staff login required' },
      { title: 'Schools privacy policy', note: 'departmental policy applying to all schools' },
      { title: 'Child and Family Violence Information Sharing Schemes', note: 'for wellbeing/safety sharing' },
      { title: 'Office of the Victorian Information Commissioner (OVIC)', note: 'privacy regulator' },
      { title: 'Health Complaints Commissioner', note: 'for health information complaints' },
      { title: 'Contact: privacy@education.vic.gov.au', note: 'Privacy Team — for PIA review and advice' }
    ]
  },
  { id: 92, title: 'Information Security', category: 'IT & Privacy', tags: ['information security', 'sensitive information', 'data protection', 'security'], summary: 'Information security for school ICT systems and sensitive information.', url: 'https://www2.education.vic.gov.au/pal/information-security/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1. Information security risk management — risk register, Risk Management – Schools, emergency response plan, operating controls, transmission', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/information-security-risk-management' },
    { title: '2. Information access — access controls, swipe card, annual review, passwords, third-party', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/information-access' },
    { title: '3. Information training and staff awareness requirements — LearnED, Information Security for School Staff, DE identities, phishing guide, annual training', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/information-training-and-staff-awareness-requirements' },
    { title: '4. Information security incidents — First response card, call 000, principal notification, cyber, Managing and Reporting School Incidents', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/information-security-incidents' },
    { title: '5. Emergency management and disaster recovery planning — Business Continuity Plan, TSSP, ransomware, 3 months, automated backups', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/emergency-management-and-disaster-recovery-planning' },
    { title: '6. Third-party arrangements — Legal Division, ST4S, software inventory template, Visitors in Schools, third-party', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/third-party-arrangements' },
    { title: '7. Annual reporting requirements — VPDSS, OVIC, Protective Data Security Plan, attestation, centrally attested', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/annual-reporting-requirements' },
    { title: '8. Personnel security — pre-employment checks, validation form, off-boarding, Recruitment in Schools, suitability', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/personnel-security' },
    { title: '9. Information communications technology security — ICT assets, lifecycle, USB drives, hard drives, secure disposal', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/information-communications-technology-security' },
    { title: '10. Physical security — physical security, remote work, travelling, third parties, lifecycle', url: 'https://www2.education.vic.gov.au/pal/information-security/guidance/physical-security' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/information-security/policy#rpl-main' }
  ],
},
  { id: 93, title: 'Acceptable Use Policy for ICT Resources', category: 'IT & Privacy', tags: ['ict', 'acceptable use', 'internet', 'email', 'aup'], summary: 'Acceptable use of Department ICT resources.', url: 'https://www2.education.vic.gov.au/pal/ict-acceptable-use/policy' },
  { id: 94, title: 'Technologies and ICT Services', category: 'IT & Privacy', tags: ['technologies', 'ict services', 'scl', 'securing connected learners', 'backup'], summary: 'Department-provided technologies. Securing Connected Learners (SCL) migration by end of 2028.', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Details — end of 2028, migrate, school-managed, department-provided, separate environments', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy' },
    { title: 'Department-provided technologies and ICT services — Arc Software, ICT support, child safety, privacy, security standards', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy' },
    { title: 'Migrating to department-provided technologies and ICT services — SCL Program, end of 2028, commercial agreements, renewal, cost-avoidance', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy' },
    { title: 'Adopting other technologies and ICT services — TSSP, backup and recovery, contract template, Records Management, business continuity', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy' },
    { title: 'Contact — SCLProgram@education.vic.gov.au, 1800 641 943, servicedesk@education.vic.gov.au, Services Portal, contact', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy' },
    { title: 'Definitions — IoT, administration systems, hardware, cloud services, identity management', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy' },
    { title: 'Relevant legislation — Health Records Act 2001, MO 1359, Privacy and Data Protection Act 2014, Public Records Act 1973, VPDSF', url: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/technologies-ict-services-schools/policy#rpl-main' }
  ],
},
  { id: 95, title: 'Records Management', category: 'IT & Privacy', tags: ['records', 'recordkeeping', 'retention', 'archives', 'u drive'], summary: 'Records management including digital recordkeeping. Contact archives.records@education.vic.gov.au.', url: 'https://www2.education.vic.gov.au/pal/records-management/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1. Permanent and long-term temporary records — CASES21, pupil registers, school council records, 1800 359 140, State Archives', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/permanent-and-long-term-temporary-records' },
    { title: '2. Records naming conventions — naming conventions, CASES21, document title, retention period, meaningful titles', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/records-naming-conventions' },
    { title: '3. Records that must be restricted — need to know basis, open-access folders, annual review, privacy@education.vic.gov.au, sensitive information', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/records-that-must-be-restricted' },
    { title: '4. Hardcopy records storage — hardcopy storage checklist, manual handling, sturdy boxes, alphabetical, annual inspection', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/hardcopy-records-storage' },
    { title: '5. Digital recordkeeping — born digital, metadata, naming conventions, CASES21, sustainable formats', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/digital-recordkeeping' },
    { title: '6. Recordkeeping requirements for third-party systems — Compass, Xuno, DE contract template, Arc, Procurement – Schools', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/recordkeeping-requirements-for-third-party-systems' },
    { title: '7. Digitising hardcopy records — Public Record Office Victoria, 1 January 2000, pupil registers, corporal punishment registers, teacher time books', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/digitising-hardcopy-records' },
    { title: '8. Archiving hardcopy records — sort by type, hardcopy, digital copy, archive, latest version', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/archiving-hardcopy-records' },
    { title: '9. Normal administrative practice – records that do not need to be archived — Normal Administrative Practice, routine disposal, time-expired, Chapter 10, official records', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/normal-administrative-practice-records-do-not-need-be-archived' },
    { title: '10. How to destroy ‘time-expired’ records — time-expired, retention period, Royal Commission, Board of Inquiry, third-party providers', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/how-to-destroy-time-expired-records' },
    { title: '11. Recordkeeping – child safety and wellbeing — Child Safe Standard 2, MO 1359, Public Record Office Victoria Standards, retention guide, wellbeing records', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/recordkeeping-child-safety-and-wellbeing' },
    { title: '12. Records management support for schools — Records and Mail Services, 1800 359 140, archives.records@education.vic.gov.au, Schools Records Management Program, advice', url: 'https://www2.education.vic.gov.au/pal/records-management/guidance/records-management-support-schools' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/records-management/policy#rpl-main' }
  ],
},

  // Curriculum
  { id: 96, title: 'Curriculum Programs Foundation to 10', category: 'Curriculum', tags: ['curriculum', 'f-10', 'victorian curriculum', 'vc 2.0', 'vcaa'], summary: 'Curriculum requirements F-10. VC 2.0 implementation.', url: 'https://www2.education.vic.gov.au/pal/curriculum-programs/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Developing and implementing curriculum programs Foundation to 10 — Victorian Curriculum F-10 Version 2.0, VCAA, Foundation to Level 10, Prep to Year 2, scope and sequences', url: 'https://www2.education.vic.gov.au/pal/curriculum-programs/guidance/developing-and-implementing-curriculum-programs-f-10' },
    { title: 'Victorian Lesson Plans — VLPs, VTLM 2.0, Phonics Plus, 25 minutes daily, F-2, Arc platform', url: 'https://www2.education.vic.gov.au/pal/curriculum-programs/guidance/victorian-lesson-plans' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/curriculum-programs/policy#rpl-main' }
  ],
},
  { id: 97, title: 'Assessment of Student Achievement and Progress Foundation to 10', category: 'Curriculum', tags: ['assessment', 'student achievement', 'f-10', 'fiso'], summary: 'Assessment of student achievement aligned to FISO 2.0.', url: 'https://www2.education.vic.gov.au/pal/assessment-student-achievement/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Overview — evidence, teacher judgements, curriculum standards, multiple sources', url: 'https://www2.education.vic.gov.au/pal/assessment-student-achievement/policy' },
    { title: 'Requirements — government schools, student performance', url: 'https://www2.education.vic.gov.au/pal/assessment-student-achievement/policy' },
    { title: 'Minimum standards for school registration — school registration, minimum standards', url: 'https://www2.education.vic.gov.au/pal/assessment-student-achievement/policy' },
    { title: 'Other departmental requirements — formative, summative, assessment schedule, VCAA, learning sequences', url: 'https://www2.education.vic.gov.au/pal/assessment-student-achievement/policy' },
    { title: 'Framework for Improving Student Outcomes (FISO 2.0) — FISO 2.0, 5 core elements, excellence and equity, assessment core element', url: 'https://www2.education.vic.gov.au/pal/assessment-student-achievement/policy' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/assessment-student-achievement/policy#rpl-main' }
  ],
},
  { id: 98, title: 'Reporting Student Achievement and Progress Foundation to 10', category: 'Curriculum', tags: ['reporting', 'student reports', '5-point scale', 'vcaa', 'semester'], summary: 'Reporting using a 5-point scale against VCAA achievement standards.', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Reporting to parents and carers – general information — twice a year, written report, plain English, school registration, parents and carers', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/reporting-parents-and-carers-general-information' },
    { title: 'Reporting to parents and carers – students with disability and/or additional needs — individual education plan, 5-point scales, Foundation Level A to Level 11, work samples, portfolios', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/reporting-achievement-parents-students-disability-additional-needs' },
    { title: 'Reporting to parents and carers – EAL proficiency and progress — EAL, Victorian Curriculum F-10, Beginning .1, Consolidating .2, Achieved .3', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/reporting-parents-and-carers-eal-students' },
    { title: 'Guidance for reporting at each learning stage — VCAA F-10 Reporting Guidelines, Foundation Stage, Prep to Year 2, VIT, Languages', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/guidance-reporting-each-learning-stage' },
    { title: 'Reporting to the department — CASES21, June 30, December 31, end of year rollover, School Information Portal', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/reporting-department' },
    { title: 'Records management — retention period, electronic and hardcopy, online storage', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/records-management' },
    { title: 'Student reports and parent/carer-teacher-student conferences — parent-teacher-student conferences, twice a year, school community, leadership teams', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/student-reports-and-parent/carer-teacher-student' },
    { title: 'Making teacher judgements and assigning scores for student reporting — on-balance, evidence-based, scoring range, moderation, learning continuum', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/making-teacher-judgements-and-assigning-scores-student' },
    { title: 'Involving students in assessment and reporting processes — feedback, learning continuum, 2-way process, teaching and learning cycle', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/involving-students-assessment-and-reporting-processes' },
    { title: 'Student portfolio and reporting — portfolios, work samples, assessment tasks, reporting period', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/student-portfolio-and-reporting' },
    { title: 'Developing and reporting on individual learning goals — individual learning goals, VEYLDF, 5 Outcomes, Prep to Year 2, motivation', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/developing-and-reporting-individual-learning-goals' },
    { title: 'Student reporting professional learning program — online tool, 4 learning focus areas, school-based, professional learning', url: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/guidance/student-reporting-professional-learning-program' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/reporting-student-achievement/policy#rpl-main' }
  ],
},
  { id: 99, title: 'International Student Program (ISP)', category: 'Curriculum', tags: ['international students', 'isp', 'overseas students', 'visa', 'dha'], summary: 'ISP quality standards and visa requirements. DHA governs leave during term.', url: 'https://www2.education.vic.gov.au/pal/international-student-program/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: '1. Introduction and legislative framework — ISP, ESOS Act 2000, CRICOS, VRQA, 5 years, IED', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/introduction-section-1' },
    { title: '2. Marketing and recruitment — National Code 2018, IED, CRICOS 00861K, education agents, Annual Marketing Action Plan, Level 2 schools', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/marketing-and-recruitment-section-2' },
    { title: '3. Admissions — National Code, IED, English language proficiency, audit', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/admissions-section-3' },
    { title: '4. Homestay arrangements (Level 2 schools only) — Level 2 schools, CAAW, CoE, age 18, homestay, ISP Homestay Policy, VISIT', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/homestay-arrangements-level-2-schools-only-section-4' },
    { title: '5. Supporting students – adjusting to life and study in Australia — CoE, IED, PRISMS, 14 days, Student Safety Card, ISP Arrival Support Form, VCE course credit, VASS', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/supporting-students-adjusting-life-and-study-australia' },
    { title: '6. Supporting students – safety — Ministerial Order 1359, Child Safe Standards, ISOC 1800 126 126, EMP, National Code, critical incidents', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/supporting-students-safety-section-6' },
    { title: '7. Supporting students – learning and engagement — 80% attendance, IELP, VSL, VSV, VVLN, CHES, 2 subjects per semester, VCE VM, VET, WWCC, 48 hours per fortnight', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/supporting-students-learning-and-engagement-section-7' },
    { title: '8. Transfers and cancellations — 6 months, CRICOS, PRISMS, 20 working days, Compliance Contract, Withdrawal Form, ISP Transfer Policy', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/transfers-and-cancellations-section-8' },
    { title: '9. Administrative requirements — CASES21, Ministerial Order 819, ISC, every 6 months, twice per year invoicing, refunds, VSL, VSV, VVLN, CHES', url: 'https://www2.education.vic.gov.au/pal/international-student-program/guidance/administrative-requirements-section-9' }
  ],
  resources: [
    { label: 'Skip to main content', href: 'https://www2.education.vic.gov.au/pal/international-student-program/policy#rpl-main' }
  ],
},
  { id: 100, title: 'Work Experience', category: 'Curriculum', tags: ['work experience', 'workplace', 'students'], summary: 'Student work experience arrangements, approvals and workplace safety.', url: 'https://www2.education.vic.gov.au/pal/work-experience/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Overview — Years 9 and 10, secondary, VCE, VCE VM, VPC, Structured Workplace Learning', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/overview' },
    { title: 'Required age of students — 14 to 21 years, principal, nominated person', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/required-age-students' },
    { title: 'Roles and responsibilities — Ministerial Order 1413, ETR Act 2006, nominated person, WE coordinator', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/roles-responsibilities' },
    { title: 'Work experience arrangement form — arrangement form, Victoria, NSW, SA, principal signature', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/work-experience-arrangement-form' },
    { title: 'Work-Based Learning Application — WBL App, digital form, desktop and mobile, evaluation form, paper-based', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/work-based-learning-application' },
    { title: 'Working with Children Check — WWCC, under 15 years, Service Victoria, 30 years retention, certified copy', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/working-with-children-check' },
    { title: 'Timing and duration of work experience — school year, Terms 1 2 3, holiday period, WE coordinator', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/timing-duration-work-experience' },
    { title: 'Cancellation of work experience — written notice, principal, employer, immediate effect', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/cancellation-work-experience' },
    { title: 'Permitted number of students per employer — 1 student per 3 employees, employer, workplace', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/permitted-number-students-per-employer' },
    { title: 'Travel and accommodation arrangements — vehicle travel, parent/carer consent, accommodation form, WBL App, under 18', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/travel-accommodation-arrangements' },
    { title: 'Student debriefing — debriefing, evaluation survey, WBL App, letter of appreciation', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/student-debriefing' },
    { title: 'Payment and taxation — $5 per day, TFN, ATO, $350 per week, under 18, payment summaries', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/payment-taxation' },
    { title: 'Privacy legislation and work experience — Privacy and Data Protection Act 2014, Health Records Act 2001, confidentiality, medical emergency', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/privacy-legislation-work-experience' },
    { title: 'WorkSafe and public liability insurance — WorkSafe, Gallagher Bassett, public liability, employer exemption, return to work', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/worksafe-public-liability-insurance' },
    { title: 'Interstate placements — NSW, SA, reciprocal, border, WorkSafe Insurance, Public Liability Insurance', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/interstate-placements' },
    { title: 'Overseas students — overseas students, visa conditions, IED, 03 7022 1000, work entitlement hours', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/overseas-students' },
    { title: 'Contacting students during the placement — workplace visit, telephone, employer, student, 3 functions', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/contacting-students-during-placement' },
    { title: 'Student safety and wellbeing — Ministerial Order 1359, Child Safe Standards, prohibited industries, duty of care, unreasonable risk', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/student-safety-wellbeing' },
    { title: 'Students with disability and additional needs — reasonable adjustments, SSG, PSG, allied health, visiting teachers, paper-based forms', url: 'https://www2.education.vic.gov.au/pal/work-experience/guidance/students-with-disability-additional-needs' }
  ],
},
  { id: 101, title: 'Structured Workplace Learning', category: 'Curriculum', tags: ['swl', 'structured workplace learning', 'workplace'], summary: 'Structured workplace learning arrangements for VET and VM students.', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/policy',
  tabs: [ 'Skip to main content' ],
  chapters: [
    { title: 'Overview — vocational courses, exit credentials, industry-recognised, accredited courses', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/introduction' },
    { title: 'Required age of students — 15 years, minimum age', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/required-age-student' },
    { title: 'Roles and responsibilities — Ministerial Order 1412, ETR Act 2006, nominated person, SWL coordinator', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/roles-and-responsibilities' },
    { title: 'Structured workplace learning arrangement form — Ministerial Order 1412, NSW, SA, arrangement form, principal signature', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/structured-workplace-learning-arrangement-form' },
    { title: 'Cancellation of structured workplace learning — written notice, principal, employer, immediate effect', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/cancellation-structured-workplace-learning' },
    { title: 'Permitted number of students per employer — 1 student per 3 employees, employer, workplace', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/permitted-number-of-students-per-employer' },
    { title: 'Timing and duration of structured workplace learning — school year, Terms 1 2 3, holiday period, accredited course', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/timing-and-duration-structured-workplace-learning' },
    { title: 'Travel and accommodation arrangements — vehicle travel, parent/carer consent, WBL App, under 18, paper-based', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/travel-and-accommodation-arrangements' },
    { title: 'Assessment of structured workplace learning arrangements — learning outcomes, training packages, VET Delivered to Schools, employer', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/assessment' },
    { title: 'Student debriefing — debriefing, WBL App, evaluation survey, letter of appreciation', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/student-debriefing-after-placement' },
    { title: 'Privacy legislation and structured workplace learning — Privacy and Data Protection Act 2014, Health Records Act 2001, confidentiality, medical emergency', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/privacy-legislation' },
    { title: 'Payment and taxation — $5 per day, TFN, ATO, $350 per week, under 18, payment summaries', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/payment-and-taxation' },
    { title: 'Worksafe and public liability insurance — WorkSafe, Gallagher Bassett, public liability, employer exemption, return to work', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/worksafe-and-public-liability-insurance' },
    { title: 'Interstate placements — NSW, SA, reciprocal, border, WorkSafe Insurance, Public Liability Insurance', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/interstate-placements' },
    { title: 'Overseas students — overseas students, Ministerial Order 1412, visa conditions, IED, +61 3 7022 1000', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/overseas-students' },
    { title: 'Contacting students during the placement — workplace visit, telephone, employer, student, 3 functions', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/contacting-students-during-placement' },
    { title: 'Student safety and wellbeing — Ministerial Order 1359, Child Safe Standards, prohibited industries, duty of care, risk management', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/student-safety-and-welfare' },
    { title: 'Students with disability and additional needs — reasonable adjustments, SSG, PSG, allied health, visiting teachers, paper-based forms', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/students-disability' },
    { title: 'Work-Based Learning Application — WBL App, digital form, desktop and mobile, evaluation form, paper-based', url: 'https://www2.education.vic.gov.au/pal/structured-workplace-learning/guidance/work-based-learning-application' }
  ],
}
];

const CATEGORIES = [
  'All',
  'HR - Pay',
  'HR - Leave',
  'HR - Recruitment',
  'HR - Performance',
  'HR - Conduct',
  'Finance',
  'School Council',
  'Students',
  'Child Safety',
  'OHS',
  'School Operations',
  'Infrastructure',
  'IT & Privacy',
  'Curriculum'
];

const SEARCH_SUGGESTIONS = [
  'long service leave',
  'personal leave',
  'parental leave',
  'salary allowance',
  'reconciliation',
  'procurement',
  'gift test',
  'excursion form',
  'working with children',
  'hire or rehire',
  'reporting incident',
  'anaphylaxis',
  'parent payments'
];

// Levenshtein distance for typo tolerance
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function tokenScore(token, text) {
  if (!token || !text) return 0;
  const q = token.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) return 1000;
  const words = t.split(/[\s\-,.():/]+/).filter(Boolean);
  for (const w of words) {
    if (w === q) return 600;
    if (w.startsWith(q)) return 400;
  }
  if (t.startsWith(q)) return 350;
  if (t.includes(q)) return 200;
  if (q.length >= 4) {
    for (const w of words) {
      if (Math.abs(w.length - q.length) <= 2) {
        const dist = levenshtein(q, w);
        const threshold = q.length <= 5 ? 1 : 2;
        if (dist <= threshold) return 150 - dist * 20;
      }
    }
  }
  return 0;
}

function multiTokenScore(tokens, text) {
  if (!tokens.length || !text) return 0;
  let total = 0;
  let matchedCount = 0;
  for (const tok of tokens) {
    const s = tokenScore(tok, text);
    if (s > 0) matchedCount++;
    total += s;
  }
  return matchedCount === tokens.length ? total : 0;
}

function parseQuery(raw) {
  const out = { tokens: [], phrases: [], categoryFilter: null };
  if (!raw) return out;
  let s = raw.trim();

  const catMatch = s.match(/\bcat:(\w[\w\s\-]*?)(?=\s|$)/i);
  if (catMatch) {
    out.categoryFilter = catMatch[1].trim().toLowerCase();
    s = s.replace(catMatch[0], '').trim();
  }

  const phraseRegex = /"([^"]+)"/g;
  let m;
  while ((m = phraseRegex.exec(s)) !== null) {
    out.phrases.push(m[1].toLowerCase());
  }
  s = s.replace(/"[^"]+"/g, '').trim();

  if (s) {
    out.tokens = s.split(/\s+/).filter(t => t.length > 0).map(t => t.toLowerCase());
  }
  return out;
}

function phrasesMatch(phrases, text) {
  if (!phrases.length) return true;
  const t = text.toLowerCase();
  return phrases.every(p => t.includes(p));
}

function buildSearchableText(policy) {
  const parts = [policy.title, policy.category, policy.summary, ...(policy.tags || [])];
  if (policy.chapters) parts.push(...policy.chapters.map(c => c.title));
  if (policy.resources) {
    for (const r of policy.resources) {
      parts.push(r.title);
      if (r.note) parts.push(r.note);
    }
  }
  return parts.join(' ');
}

function scorePolicy(policy, parsedQuery) {
  const allTokens = [...parsedQuery.tokens, ...parsedQuery.phrases.flatMap(p => p.split(/\s+/))];
  if (allTokens.length === 0) return { score: 0, matches: [], deepMatchDominant: false };

  const fullText = buildSearchableText(policy);
  if (!phrasesMatch(parsedQuery.phrases, fullText)) {
    return { score: 0, matches: [], deepMatchDominant: false };
  }

  const titleScore = multiTokenScore(allTokens, policy.title) * 4;
  const tagScore = policy.tags
    ? Math.max(...policy.tags.map(t => multiTokenScore(allTokens, t)), 0) * 2.5
    : 0;
  const summaryScore = multiTokenScore(allTokens, policy.summary) * 1.5;
  const categoryScore = multiTokenScore(allTokens, policy.category) * 1;

  const matchedChapters = [];
  let bestChapterScore = 0;
  if (policy.chapters) {
    for (const ch of policy.chapters) {
      const s = multiTokenScore(allTokens, ch.title);
      if (s > 0) {
        matchedChapters.push({ item: ch, score: s });
        if (s > bestChapterScore) bestChapterScore = s;
      }
    }
  }

  const matchedResources = [];
  let bestResourceScore = 0;
  if (policy.resources) {
    for (const r of policy.resources) {
      const titleS = multiTokenScore(allTokens, r.title);
      const noteS = r.note ? multiTokenScore(allTokens, r.note) * 0.5 : 0;
      const s = titleS + noteS;
      if (s > 0) {
        matchedResources.push({ item: r, score: s });
        if (s > bestResourceScore) bestResourceScore = s;
      }
    }
  }

  matchedChapters.sort((a, b) => b.score - a.score);
  matchedResources.sort((a, b) => b.score - a.score);

  const chapterScore = bestChapterScore * 1.8;
  const resourceScore = bestResourceScore * 2;

  const total = titleScore + tagScore + summaryScore + categoryScore + chapterScore + resourceScore;

  const matches = [
    ...matchedResources.map(m => ({ type: 'resource', item: m.item })),
    ...matchedChapters.map(m => ({ type: 'chapter', item: m.item }))
  ];

  const deepMatchDominant = (resourceScore + chapterScore) > (titleScore + tagScore);

  return { score: total, matches, deepMatchDominant };
}

function highlightMatch(text, parsedQuery) {
  if (!text) return text;
  if (!parsedQuery || (!parsedQuery.tokens.length && !parsedQuery.phrases.length)) return text;

  const allTerms = [...parsedQuery.phrases, ...parsedQuery.tokens]
    .filter(t => t && t.length >= 2)
    .sort((a, b) => b.length - a.length);

  if (!allTerms.length) return text;

  const lower = text.toLowerCase();
  const positions = [];
  for (const term of allTerms) {
    const t = term.toLowerCase();
    let idx = 0;
    while (idx < lower.length) {
      const found = lower.indexOf(t, idx);
      if (found === -1) break;
      positions.push({ start: found, end: found + t.length });
      idx = found + t.length;
    }
  }
  if (!positions.length) return text;
  positions.sort((a, b) => a.start - b.start);
  const merged = [];
  for (const p of positions) {
    if (merged.length && p.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, p.end);
    } else {
      merged.push({ start: p.start, end: p.end });
    }
  }
  const parts = [];
  let cursor = 0;
  merged.forEach((p, i) => {
    if (p.start > cursor) parts.push({ text: text.slice(cursor, p.start), match: false, key: 'n' + i });
    parts.push({ text: text.slice(p.start, p.end), match: true, key: 'm' + i });
    cursor = p.end;
  });
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false, key: 'e' });

  return (
    <>
      {parts.map(seg => seg.match
        ? <mark key={seg.key} className="bg-yellow-200 text-gray-900 px-0.5 rounded">{seg.text}</mark>
        : <React.Fragment key={seg.key}>{seg.text}</React.Fragment>
      )}
    </>
  );
}

function MatchBanner({ match, parsedQuery, onLinkClick }) {
  const icon = match.type === 'resource' ? '📄' : '📖';
  const label = match.type === 'resource' ? 'Resource:' : 'Chapter:';
  const url = match.item.url;
  return (
    <div className="px-2 py-1.5 bg-blue-50 border border-blue-100 rounded text-xs">
      <span className="text-blue-700 font-medium">{icon} {label}</span>{' '}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
          className="text-blue-600 hover:underline"
        >
          {highlightMatch(match.item.title, parsedQuery)}
        </a>
      ) : (
        <span className="text-slate-700">{highlightMatch(match.item.title, parsedQuery)}</span>
      )}
      {match.item.note && <span className="text-slate-500"> — {match.item.note}</span>}
    </div>
  );
}

export default function PALSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentlyClicked, setRecentlyClicked] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [expandedId, setExpandedId] = useState(null);
  const searchInputRef = useRef(null);

  const parsedQuery = useMemo(() => parseQuery(query), [query]);
  const hasActiveQuery = parsedQuery.tokens.length > 0 || parsedQuery.phrases.length > 0;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        e.stopPropagation();
        if (searchInputRef.current) searchInputRef.current.focus();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setQuery('');
        if (searchInputRef.current) searchInputRef.current.blur();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    document.addEventListener('keydown', handleKey, true);
    return () => {
      window.removeEventListener('keydown', handleKey, true);
      document.removeEventListener('keydown', handleKey, true);
    };
  }, []);

  const results = useMemo(() => {
    let filtered = PAL_POLICIES;

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (parsedQuery.categoryFilter) {
      filtered = filtered.filter(p =>
        p.category.toLowerCase().includes(parsedQuery.categoryFilter)
      );
    }

    if (!hasActiveQuery) {
      return filtered
        .map(p => ({ ...p, _matches: [], _deepMatch: false }))
        .sort((a, b) => {
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return a.title.localeCompare(b.title);
        });
    }

    return filtered
      .map(p => {
        const result = scorePolicy(p, parsedQuery);
        return { ...p, _score: result.score, _matches: result.matches, _deepMatch: result.deepMatchDominant };
      })
      .filter(p => p._score > 0)
      .sort((a, b) => b._score - a._score);
  }, [parsedQuery, hasActiveQuery, category]);

  const popularPolicies = useMemo(() => PAL_POLICIES.filter(p => p.popular).slice(0, 8), []);

  const recordClick = (policy) => {
    const trimmed = query.trim();
    if (trimmed && !recentSearches.includes(trimmed)) {
      setRecentSearches(prev => [trimmed, ...prev].slice(0, 5));
    }
    setRecentlyClicked(prev => {
      const filtered = prev.filter(id => id !== policy.id);
      return [policy.id, ...filtered].slice(0, 6);
    });
  };

  const handleResultClick = (policy, e) => {
    if (e && e.target.closest('button, a')) return;
    recordClick(policy);
    window.open(policy.url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setQuery('');
      if (searchInputRef.current) searchInputRef.current.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      handleResultClick(results[selectedIndex]);
    }
  };

  useEffect(() => { setSelectedIndex(-1); }, [query, category]);

  const recentClickedPolicies = useMemo(
    () => recentlyClicked
      .map(id => PAL_POLICIES.find(p => p.id === id))
      .filter(Boolean),
    [recentlyClicked]
  );

  const searchPlaceholder = 'Search... try multiple words or cat:finance';
  const deepIndexedCount = PAL_POLICIES.filter(p => (p.resources && p.resources.length > 0) || (p.chapters && p.chapters.length > 0)).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">PAL Quick Search</h1>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Unofficial staff tool · {PAL_POLICIES.length} policies · {deepIndexedCount} deep-indexed · Multi-word search, typo tolerance
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-12 py-3 text-base bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>

          {query && (parsedQuery.phrases.length > 0 || parsedQuery.categoryFilter) && (
            <div className="mt-2 text-xs text-slate-500 flex gap-2 flex-wrap">
              {parsedQuery.phrases.map((p, i) => (
                <span key={i} className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 rounded">
                  exact phrase: {p}
                </span>
              ))}
              {parsedQuery.categoryFilter && (
                <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded">
                  category: {parsedQuery.categoryFilter}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={'px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ' + (category === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {!hasActiveQuery && recentSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recent searches
            </h3>
            <div className="flex gap-2 flex-wrap">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1 text-sm bg-white border border-slate-200 rounded-full hover:border-blue-400 hover:text-blue-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasActiveQuery && recentSearches.length === 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Search className="w-3 h-3" /> Try searching for
            </h3>
            <div className="flex gap-2 flex-wrap">
              {SEARCH_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1 text-sm bg-white border border-slate-200 rounded-full hover:border-blue-400 hover:text-blue-600 text-slate-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasActiveQuery && category === 'All' && recentClickedPolicies.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recently opened
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {recentClickedPolicies.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleResultClick(p)}
                  className="text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 line-clamp-2">{p.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-0.5" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">{p.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasActiveQuery && category === 'All' && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Frequently accessed
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {popularPolicies.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleResultClick(p)}
                  className="text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 line-clamp-2">{p.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-0.5" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">{p.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">
              {hasActiveQuery ? results.length + ' result' + (results.length !== 1 ? 's' : '') : results.length + ' policies'}
              {category !== 'All' && <span className="text-slate-500 font-normal"> in {category}</span>}
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-500">No policies match your search.</p>
              <p className="text-xs text-slate-400 mt-1">Try broader keywords, remove quotes, or check the category filter.</p>
              <div className="mt-4 text-xs text-slate-400">
                Tip: Use multiple words, quoted phrases for exact matches, or <code className="bg-slate-100 px-1 rounded">cat:finance</code> to filter by category.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((policy, idx) => {
                const hasExtras = (policy.chapters && policy.chapters.length > 0) || (policy.resources && policy.resources.length > 0);
                const shouldAutoExpand = hasActiveQuery && policy._deepMatch && policy._matches && policy._matches.length > 0;
                const isExpanded = expandedId === policy.id || (shouldAutoExpand && expandedId !== 'collapsed-' + policy.id);
                const selectedClass = idx === selectedIndex ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-blue-300';

                return (
                  <div
                    key={policy.id}
                    className={'bg-white border rounded-lg transition-all ' + selectedClass}
                  >
                    <div
                      onClick={(e) => handleResultClick(policy, e)}
                      className="p-4 cursor-pointer hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-base font-semibold text-slate-900">
                              {highlightMatch(policy.title, parsedQuery)}
                            </h3>
                            {policy.popular && (
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                            {highlightMatch(policy.summary, parsedQuery)}
                          </p>

                          {policy._matches && policy._matches.length > 0 && hasActiveQuery && (
                            <div className="mb-2 space-y-1">
                              {policy._matches.slice(0, 3).map((m, i) => (
                                <MatchBanner
                                  key={i}
                                  match={m}
                                  parsedQuery={parsedQuery}
                                  onLinkClick={(e) => { e.stopPropagation(); recordClick(policy); }}
                                />
                              ))}
                              {policy._matches.length > 3 && (
                                <div className="text-xs text-slate-500 ml-1">
                                  +{policy._matches.length - 3} more — expand for all
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                              {policy.category}
                            </span>
                            {policy.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="text-xs text-slate-500">
                                #{highlightMatch(tag, parsedQuery)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <a
                            href={policy.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => { e.stopPropagation(); recordClick(policy); }}
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View on PAL
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {hasExtras && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isExpanded) {
                                  setExpandedId('collapsed-' + policy.id);
                                } else {
                                  setExpandedId(policy.id);
                                }
                              }}
                              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              {isExpanded ? 'Hide details' : 'Show details'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && hasExtras && (
                      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 space-y-3">
                        {policy.tabs && (
                          <div className="flex gap-2 flex-wrap text-xs">
                            {policy.tabs.overview && (
                              <a href={policy.tabs.overview} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-white border border-slate-200 rounded hover:border-blue-400 text-slate-700">Overview</a>
                            )}
                            {policy.tabs.policyAndGuidelines && (
                              <a href={policy.tabs.policyAndGuidelines} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-white border border-slate-200 rounded hover:border-blue-400 text-slate-700">Policy and Guidelines</a>
                            )}
                            {policy.tabs.guidance && (
                              <a href={policy.tabs.guidance} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-white border border-slate-200 rounded hover:border-blue-400 text-slate-700">Guidance</a>
                            )}
                            {policy.tabs.resources && (
                              <a href={policy.tabs.resources} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-white border border-slate-200 rounded hover:border-blue-400 text-slate-700">Resources</a>
                            )}
                          </div>
                        )}
                        {policy.chapters && policy.chapters.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> Chapters ({policy.chapters.length})
                            </h4>
                            <ul className="space-y-1">
                              {policy.chapters.map((ch, i) => (
                                <li key={i}>
                                  <a
                                    href={ch.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => recordClick(policy)}
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    {highlightMatch(ch.title, parsedQuery)}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {policy.resources && policy.resources.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                              <FileText className="w-3 h-3" /> Resources ({policy.resources.length})
                            </h4>
                            <ul className="space-y-1">
                              {policy.resources.map((r, i) => (
                                <li key={i} className="text-xs text-slate-700">
                                  {r.url ? (
                                    <a
                                      href={r.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => recordClick(policy)}
                                      className="font-medium text-blue-600 hover:underline"
                                    >
                                      {highlightMatch(r.title, parsedQuery)}
                                    </a>
                                  ) : (
                                    <span className="font-medium">{highlightMatch(r.title, parsedQuery)}</span>
                                  )}
                                  {r.note && <span className="text-slate-500"> — {r.note}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-2">
          <p><strong>Disclaimer:</strong> This is an unofficial staff tool. Always refer to the official PAL for the authoritative version of any policy.</p>
          <p><strong>For help with PAL content:</strong> Contact pal.support@education.vic.gov.au or call 03 7022 1888.</p>
        </footer>
      </main>
    </div>
  );
}
