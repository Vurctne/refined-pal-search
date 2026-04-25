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
    ]
  }
];

export default function PALSearch() {
  return <div className="p-8">PAL Search — full source pending in next message</div>;
}
