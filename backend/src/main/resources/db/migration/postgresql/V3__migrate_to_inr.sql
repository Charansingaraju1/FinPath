-- V3: Migrate default currency to INR and convert opportunity cost & pricing models to INR for PostgreSQL

ALTER TABLE financial_goals ALTER COLUMN currency SET DEFAULT 'INR';

UPDATE financial_goals SET currency = 'INR' WHERE currency = 'USD' OR currency IS NULL;

-- Update seed opportunities to sensible Indian Rupee amounts
UPDATE opportunities
SET initial_cost_min = 3000.00,
    initial_cost_max = 15000.00,
    pricing_model = '₹25,000 setup + ₹2,500/mo hosting and maintenance'
WHERE id = 1;

UPDATE opportunities
SET initial_cost_min = 5000.00,
    initial_cost_max = 18000.00,
    pricing_model = '₹18,000 onboarding + ₹3,500/mo maintenance'
WHERE id = 2;

UPDATE opportunities
SET initial_cost_min = 1500.00,
    initial_cost_max = 6000.00,
    pricing_model = '₹800 - ₹1,500 per hour or ₹8,000/mo package'
WHERE id = 3;

UPDATE opportunities
SET initial_cost_min = 6000.00,
    initial_cost_max = 22000.00,
    pricing_model = '₹20,000 setup + ₹4,500/mo subscription'
WHERE id = 4;

UPDATE opportunities
SET initial_cost_min = 10000.00,
    initial_cost_max = 35000.00,
    pricing_model = '₹4,000/month subscription per location'
WHERE id = 5;
