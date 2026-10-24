-- FinPath Seed Data Migration V2
-- Seeds categories and realistic example opportunities

INSERT INTO opportunity_categories (name, slug, description, icon) VALUES
('Digital & Web Services', 'digital-web-services', 'Web development, landing pages, and digital storefronts for local businesses', 'Globe'),
('Operations & Scheduling', 'operations-scheduling', 'Booking systems, lead routing, and customer appointment management', 'Calendar'),
('Education & Tutoring', 'education-tutoring', 'Academic coaching, exam preparation, and skill mentorship for students', 'GraduationCap'),
('Workflow Automation', 'workflow-automation', 'Automating manual spreadsheets, invoice follow-ups, and email workflows', 'Zap'),
('Productivity Tools', 'productivity-tools', 'Simple utility software and templates for small retail and trades businesses', 'Sliders');

INSERT INTO opportunities (
    category_id, title, description, target_customer, potential_solution,
    required_skills, initial_cost_min, initial_cost_max, pricing_model,
    competition_notes, difficulty, time_commitment, business_model,
    validation_status, base_fit_score, is_featured, is_user_submitted, is_approved
) VALUES
(
    1,
    'Local Small Businesses Without Effective Web Presence',
    'Many local clinics, restaurants, and auto repair shops lose customers to nearby competitors because their website is either nonexistent, mobile-broken, or outdated.',
    'Local neighborhood service businesses (plumbers, dentists, cafes)',
    'Modern responsive 3-page landing page with call-to-action, Google Business integration, and mobile booking link',
    'HTML/CSS/React, UI design, basic copy writing, local SEO',
    50.00, 250.00,
    '$500 setup + $49/mo hosting and content updates',
    'Wix/Squarespace exists, but owners lack the time and patience to design or maintain their sites',
    'EASY', '10-15 hrs/week', 'Digital Services / Freelance',
    'RESEARCHING', 88, TRUE, FALSE, TRUE
),
(
    2,
    'Appointment No-Shows and Inefficient Booking Management',
    'Salons, consultants, and therapists lose up to 20% of revenue from client no-shows and time wasted manually texting back and forth.',
    'Independent barbers, estheticians, wellness therapists',
    'Automated WhatsApp/SMS reminder and self-serve calendar booking system',
    'No-code/Low-code tools, Twilio/Calendly APIs, client onboarding',
    100.00, 300.00,
    '$300 onboarding + $60/mo maintenance',
    'Generic tools lack personalized SMS reminder sequences and local payment options',
    'MEDIUM', '8-12 hrs/week', 'SaaS / Managed Service',
    'PROBLEM_CONFIRMED', 84, TRUE, FALSE, TRUE
),
(
    3,
    'High School & College STEM Student Tutoring and Mentorship',
    'Students struggle with foundational mathematics, physics, and introductory programming, while parents seek trustworthy, structured tutors.',
    'High school students, college freshmen, and their parents',
    'Weekly 1-on-1 virtual or hybrid tutoring sessions with recorded recaps and custom quiz practice sets',
    'Strong math/coding knowledge, clear communication, patience',
    20.00, 100.00,
    '$35-$60 per hour or $180/mo package',
    'Large platforms take 30-50% cut; local word-of-mouth offers higher trust and margins',
    'EASY', '5-10 hrs/week', 'Education / Freelancing',
    'READY_TO_BUILD', 91, TRUE, FALSE, TRUE
),
(
    4,
    'Invoice Follow-Up and Accounts Receivable Automation',
    'Small contractors and agencies spend hours each week chasing overdue invoices, resulting in unpredictable cash flow.',
    'Freelance agencies, trade contractors, boutique consultants',
    'Automated friendly email/SMS payment reminder system tied to Quickbooks/Xero with payment link',
    'Zapier/Make or Python scripting, accounting software APIs',
    100.00, 400.00,
    '$400 setup + $90/mo subscription',
    'ERP systems are overly complex and costly for 2-5 person shops',
    'MEDIUM', '10-15 hrs/week', 'Productized Service',
    'RESEARCHING', 79, FALSE, FALSE, TRUE
),
(
    5,
    'Boutique Retail Inventory & Re-order Alerts',
    'Independent apparel and gift shops frequently stock out of bestsellers and overstock slow items due to manual notebook tracking.',
    'Independent retail boutique owners',
    'Lightweight barcode and stock alert mobile web dashboard with weekly reorder suggestions',
    'Full-stack web (React, Spring Boot / Node), mobile UX, inventory math',
    200.00, 600.00,
    '$79/month subscription per location',
    'Enterprise POS systems charge hefty monthly hardware and software fees',
    'HARD', '15-20 hrs/week', 'Micro-SaaS',
    'NOT_STARTED', 73, FALSE, FALSE, TRUE
);
