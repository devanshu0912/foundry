-- Run this in Supabase SQL Editor to add all startup stories
-- Safe to run multiple times (uses insert only)

insert into startups (name, headline, story, category, stage, arr, growth, funding, team_size, founded_year, founder_names, investors, status, color)
values

('Zepto', '10-minute grocery delivery — from a college dorm to $1.4B valuation', 
'Aadit Palicha and Kaivalya Vohra dropped out of Stanford at 19 to solve India''s grocery problem. In 2021 they launched Zepto from a Mumbai apartment with a simple thesis: if you put dark stores every 2km, you can deliver in 10 minutes. Within 18 months they raised $200M and expanded to 10 cities. The secret? Saying no to categories and obsessing over a single metric — delivery time.',
'Quick Commerce', 'Series D', '$600M GMV', '400% YoY', '$360M', '4000+', '2021', 'Aadit Palicha, Kaivalya Vohra', 'Y Combinator, Nexus, Glade Brook', 'live', 'black'),

('PhysicsWallah', 'From a YouTube channel to India''s newest unicorn — the ₹1 lakh crore ed-tech story',
'Alakh Pandey started teaching physics on YouTube in 2014 from a small room in Allahabad, charging students nothing. By 2020 his channel had 6M subscribers. When he launched paid courses at ₹999 — a fraction of competitors — students flooded in. In 2022, PW raised $100M at a $1.1B valuation, becoming India''s newest ed-tech unicorn. The mission never changed: quality education for Bharat, not just metros.',
'EdTech', 'Series A', '₹1,940Cr', '200% YoY', '$100M', '10000+', '2014', 'Alakh Pandey', 'WestBridge Capital', 'live', 'orange'),

('CRED', 'Building a trust economy — how Kunal Shah turned credit card bills into a lifestyle brand',
'Kunal Shah''s second startup was a controversial bet: build a members-only app just for people with high credit scores. Everyone said the market was too small. CRED launched in 2018 with rewards for paying credit card bills on time. By 2021 it was valued at $2.2B. The real insight? Trustworthy people are underserved. CRED became the aspirational app of India''s affluent millennials.',
'Fintech', 'Series F', '$500M GMV', '150% YoY', '$800M', '1000+', '2018', 'Kunal Shah', 'DST Global, Tiger Global, Sequoia', 'live', 'black'),

('Groww', 'Making stock market investing simple for 50 million Indians',
'Four Flipkart engineers quit their jobs in 2016 to solve a simple problem: investing in mutual funds was too complicated for regular Indians. Groww''s clean, mobile-first UI made it feel like Instagram for investing. By 2023 they had 50M+ registered users and crossed 7M daily active investors. They expanded into stocks, IPOs and gold — all with the same frictionless experience.',
'Fintech', 'Series D', '$500M ARR', '180% YoY', '$251M', '1500+', '2016', 'Lalit Keshre, Harsh Jain', 'Tiger Global, Sequoia, Ribbit Capital', 'live', 'green'),

('Dukaan', 'Built Shopify for India in 48 hours during lockdown',
'When COVID hit in 2020, Suumit Shah watched small businesses scramble to go online. In 48 hours of coding, he and his co-founder launched Dukaan — a simple app that let any shopkeeper create an online store in 2 minutes. No tech skills needed. Within a week it had 10,000 merchants. Within a year, 1M+. Dukaan proved that the next 100M e-commerce merchants don''t need complexity — they need simplicity.',
'E-Commerce', 'Series B', '₹80Cr', '300% YoY', '$17M', '200+', '2020', 'Suumit Shah', 'Matrix Partners, Lightspeed', 'live', 'teal'),

('Eight Sleep', 'The pod that tracks your sleep and adjusts temperature while you dream',
'Founded by Matteo Franceschetti in 2014, Eight Sleep builds smart mattress covers that heat or cool each side of your bed automatically based on your sleep data. Backed by Khosla Ventures and used by NBA athletes, Formula 1 drivers and biohackers globally. They''ve pioneered "sleep fitness" as a category and proven people will pay premium prices for measurably better recovery.',
'Health Tech', 'Series C', '$150M ARR', '120% YoY', '$150M', '200+', '2014', 'Matteo Franceschetti', 'Valor Equity, Khosla Ventures', 'live', 'blue'),

('Razorpay', 'From a rejected YC application to processing $90B in payments',
'Harshil Mathur and Shashank Kumar applied to Y Combinator in 2014 and got rejected. They kept going. Razorpay launched in 2014 to fix India''s broken payment infrastructure — APIs that actually worked, documentation developers loved. By 2021 they were valued at $7.5B, processing payments for 8M+ businesses. They later acquired Opfin, Curlec and launched Razorpay Capital — becoming a full-stack financial platform.',
'Fintech', 'Series F', '$90B TPV', '60% YoY', '$741M', '3000+', '2014', 'Harshil Mathur, Shashank Kumar', 'Sequoia, Tiger Global, GIC', 'live', 'purple');

insert into jobs (title, startup_name, category, salary, type, location, experience, status)
values
  ('Frontend Engineer (React)', 'Dukaan', 'Engineering', '₹18–28 LPA', 'Full-time', 'Remote', '1–3 years', 'live'),
  ('Full Stack Dev (Next.js)', 'Razorpay', 'Engineering', '₹20–35 LPA', 'Full-time', 'Bangalore', '2–4 years', 'live'),
  ('Product Designer', 'CRED', 'Design', '₹22–38 LPA', 'Full-time', 'Bangalore', '2+ years', 'live'),
  ('Growth Manager', 'Zepto', 'Marketing', '₹15–25 LPA', 'Full-time', 'Mumbai', '2–3 years', 'live'),
  ('iOS Developer', 'Groww', 'Engineering', '₹18–30 LPA', 'Full-time', 'Bangalore', '2+ years', 'live'),
  ('Content Writer', 'PhysicsWallah', 'Content', '₹8–14 LPA', 'Full-time', 'Remote', 'Fresher ok', 'live');
