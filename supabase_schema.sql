-- Supabase SQL Schema for MS Fitness Application
-- Copy and execute this in your Supabase SQL Editor.

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Membership Plans Table
CREATE TABLE IF NOT EXISTS membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  billing TEXT NOT NULL,
  features TEXT[] NOT NULL,
  "isPopular" BOOLEAN DEFAULT false
);

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL
);

-- 3. Gallery Photos Table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL
);

-- 4. Trainers Table
CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL
);

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  achievement TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL
);

-- 6. Gym Settings Table
CREATE TABLE IF NOT EXISTS gym_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  "whatsappNumber" TEXT NOT NULL,
  "footerText" TEXT NOT NULL,
  "facebookUrl" TEXT,
  "instagramUrl" TEXT,
  "workingHours" TEXT
);

-- 7. Hero Section Table
CREATE TABLE IF NOT EXISTS hero_section (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  watermark TEXT NOT NULL,
  image_url TEXT NOT NULL,
  button_text_1 TEXT NOT NULL,
  button_text_2 TEXT NOT NULL,
  badge_text TEXT NOT NULL,
  area_stat TEXT NOT NULL,
  coaches_stat TEXT NOT NULL,
  access_stat TEXT NOT NULL
);

-- 8. About Section Table
CREATE TABLE IF NOT EXISTS about_section (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description_1 TEXT NOT NULL,
  description_2 TEXT NOT NULL,
  image_url TEXT NOT NULL,
  quote TEXT NOT NULL,
  features JSONB NOT NULL
);

-- 9. Membership Requests Table
CREATE TABLE IF NOT EXISTS membership_requests (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "mobileNumber" TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  "selectedPlanId" TEXT NOT NULL,
  "fitnessGoal" TEXT NOT NULL,
  address TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);

-- 10. Members Table
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "mobileNumber" TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "fitnessGoal" TEXT NOT NULL,
  address TEXT NOT NULL,
  "joinedDate" TEXT NOT NULL,
  "paymentStatus" TEXT NOT NULL,
  "attendanceStatus" TEXT NOT NULL
);

-- 11. Contact Responses Table
CREATE TABLE IF NOT EXISTS contact_responses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);

-- =========================================================
-- SEED DATA
-- =========================================================

-- Seed Membership Plans
INSERT INTO membership_plans (id, name, price, billing, features, "isPopular") VALUES
('plan-monthly', 'Monthly Plan', '$49', 'per month', ARRAY['Access to premium Gym floor & machines', 'Free locker access & hot showers', '1 fitness consultation per month', 'Cardio & strength zone access', 'Free high-speed Wi-Fi'], false),
('plan-quarterly', 'Quarterly Plan', '$129', 'per 3 months', ARRAY['All Monthly Plan features included', 'Customized workout planner', '2 personalized training sessions', 'Nutrition & diet guidelines booklet', '10% off at the MS Fitness juice bar', 'Access to steam room & sauna'], true),
('plan-yearly', 'Yearly Plan', '$399', 'per year', ARRAY['24/7 unlimited gym access', 'Dedicated elite personal coach', 'Fully personalized meal & macro planning', 'Unlimited steam bath & recovery zone', '1 free energy drink or shake per day', 'Unlimited Zumba & CrossFit group classes', 'Exclusive MS Fitness premium gym bag & shaker'], false)
ON CONFLICT (id) DO NOTHING;

-- Seed Announcements
INSERT INTO announcements (id, title, content, date, type) VALUES
('ann-1', 'Summer Power Up Challenge 2026!', 'Ignite your fitness goals! Complete 15 workouts between July 1st and July 20th to earn our exclusive, limited-edition MS Fitness heavy cotton tee and a free shaker. Sign up at the front desk today!', '2026-06-25', 'Event'),
('ann-2', 'Scheduled Maintenance: Recovery Room', 'Please note that the steam room and sauna area will be temporarily offline for routine safety maintenance and deep sanitization on June 29th, from 12:00 PM to 4:00 PM. We apologize for any inconvenience caused.', '2026-06-26', 'Urgent'),
('ann-3', 'Zumba & Aerobics Class Schedule Added', 'By popular demand, we are adding new evening Zumba, Aerobics, and HIIT group classes at 7:00 PM on Mondays, Wednesdays, and Fridays. Led by our elite instructor Coach Sarah. Dynamic rhythms, massive calorie burns!', '2026-06-24', 'Info')
ON CONFLICT (id) DO NOTHING;

-- Seed Gallery Photos
INSERT INTO gallery_photos (id, url, title, category) VALUES
('gal-1', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600', 'Heavy Strength Section', 'Strength'),
('gal-2', 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=600', 'Elite Cardio Zone', 'Cardio'),
('gal-3', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600', 'CrossFit Group Training', 'Group'),
('gal-4', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600', 'Personal Training Room', 'Personal'),
('gal-5', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600', 'Dumbbell & Barbell Deck', 'Strength'),
('gal-6', 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=600', 'HIIT Aerobics Studio', 'Group')
ON CONFLICT (id) DO NOTHING;

-- Seed Trainers
INSERT INTO trainers (id, name, role, specialty, bio, image_url) VALUES
('tr-1', 'Coach Mike Tyson', 'Elite Strength Coach', 'Explosive Power & Conditioning', 'Accredited specialist in high-performance metabolic training, powerlifting form corrections, and elite competition prep.', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600'),
('tr-2', 'Coach Sarah Connor', 'HIIT & Group Instructor', 'Endurance & Tactical Agility', 'Dynamic aerobic flow choreographer, circuit trainer, and group motivation driver with a 100% transformation track record.', 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=600')
ON CONFLICT (id) DO NOTHING;

-- Seed Testimonials
INSERT INTO testimonials (id, name, role, achievement, quote, rating) VALUES
('test-1', 'Marcus Brody', 'Member since 2024', 'Lost 45 lbs & gained extreme strength', 'The culture here is electric. It is not just about showing up; the trainers actively correct your forms, the equipment is always pristine, and the community supports your daily grind. Joining MS Fitness completely changed my lifestyle.', 5),
('test-2', 'Natasha Romanoff', 'Member since 2025', 'Mastered Olympic lifts & core stability', 'As an active endurance athlete, I needed a gym that had serious equipment and professional coaches. MS Fitness exceeds all metrics. The layout is optimized, the acoustics are great, and the steam room is perfect for post-workout recovery.', 5),
('test-3', 'Rohan Sharma', 'Member since 2026', 'Gained 15 lbs of pure lean muscle mass', 'The Yearly Plan is worth every penny! Having a dedicated personal coach and automated macro nutrition plans removed all the guesswork. Highly recommend MS Fitness to anyone looking for premium progression.', 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Gym Settings
INSERT INTO gym_settings (id, phone, email, address, "whatsappNumber", "footerText", "facebookUrl", "instagramUrl", "workingHours") VALUES
('primary', '+1 (555) 987-6543', 'info@msfitness.com', '123 Muscle Avenue, Fit City, FC 90210', '+15559876543', '© 2026 MS Fitness. Crafted for premium, elite-level physical performance and lifestyle excellence.', 'https://facebook.com/msfitness', 'https://instagram.com/msfitness', 'Mon - Fri: 5:00 AM - 10:00 PM | Sat - Sun: 7:00 AM - 8:00 PM')
ON CONFLICT (id) DO NOTHING;

-- Seed Hero Section
INSERT INTO hero_section (id, title, subtitle, watermark, image_url, button_text_1, button_text_2, badge_text, area_stat, coaches_stat, access_stat) VALUES
('primary', 'Forge your Legacy', 'Welcome to MS Fitness. Experience premier equipment, legendary trainers, and an elite community designed to push your biological limits.', 'GYM', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920', 'Join Now', 'View Plans', 'ESTABLISHED MMXXIV • Premium Luxury Club', '10k+', '20+', '24/7')
ON CONFLICT (id) DO NOTHING;

-- Seed About Section
INSERT INTO about_section (id, title, subtitle, description_1, description_2, image_url, quote, features) VALUES
('primary', 'Who We Are', 'ABOUT MS FITNESS', 'Founded in MMXXIV, MS Fitness is Fit City''s gold-standard athletic temple. We provide a space where high-intensity strength conditioning meets meticulous luxury amenities. From custom Hammer Strength equipment to individualized macro nutrition consulting, we have spared no expense.', 'Our elite certified strength coaches and nutritional consultants are dedicated to helping you forge your legacy.', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', 'At MS Fitness, we do not just lift weights — we elevate lifestyles, forge mental fortitude, and sculpt champions.', '[
  {"title": "Elite Cleanliness & Safety", "desc": "Medical-grade air filtration and 24/7 dedicated sanitization crew.", "icon": "Shield"},
  {"title": "Certified Specialists", "desc": "Every coach holds accredited international athletic certifications.", "icon": "Award"},
  {"title": "Immersive Atmosphere", "desc": "Great acoustics, premium spacing, and zero-judgment community.", "icon": "Users"},
  {"title": "Proven Success Loops", "desc": "Over 5,000+ member physical transformations tracked and verified.", "icon": "Flame"}
]')
ON CONFLICT (id) DO NOTHING;
