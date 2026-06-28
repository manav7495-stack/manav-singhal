import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MembershipRequest, 
  Member, 
  MembershipPlan, 
  Announcement, 
  GalleryPhoto, 
  ContactResponse, 
  GymSettings,
  Trainer,
  Testimonial,
  HeroSection,
  AboutSection,
  CRMIntegrationConfig,
  CRMSyncLog
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendLeadToCRM } from '../lib/crm';

// Seed Data
const defaultPlans: MembershipPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic Plan',
    price: '₹999',
    billing: '1 Month',
    features: [
      'Access to premium Gym floor & machines',
      'Free locker access & hot showers',
      '1 fitness consultation per month',
      'Cardio & strength zone access',
      'Free high-speed Wi-Fi'
    ]
  },
  {
    id: 'plan-standard',
    name: 'Standard Plan',
    price: '₹3,597',
    billing: '6 Months',
    features: [
      'All Basic Plan features included',
      'Customized workout planner',
      '2 personalized training sessions',
      'Nutrition & diet guidelines booklet',
      '10% off at the MS Fitness juice bar',
      'Access to steam room & sauna',
      'Saves 40% over monthly renewals!'
    ],
    isPopular: true,
    discountBadge: '40% OFF'
  },
  {
    id: 'plan-premium',
    name: 'Premium Plan',
    price: '₹5,994',
    billing: '12 Months',
    features: [
      '24/7 unlimited gym access',
      'Dedicated elite personal coach',
      'Fully personalized meal & macro planning',
      'Unlimited steam bath & recovery zone',
      '1 free energy drink or shake per day',
      'Unlimited Zumba & CrossFit group classes',
      'Exclusive MS Fitness premium gym bag & shaker'
    ],
    discountBadge: '50% OFF'
  }
];

const defaultAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Summer Power Up Challenge 2026!',
    content: 'Ignite your fitness goals! Complete 15 workouts between July 1st and July 20th to earn our exclusive, limited-edition MS Fitness heavy cotton tee and a free shaker. Sign up at the front desk today!',
    date: '2026-06-25',
    type: 'Event'
  },
  {
    id: 'ann-2',
    title: 'Scheduled Maintenance: Recovery Room',
    content: 'Please note that the steam room and sauna area will be temporarily offline for routine safety maintenance and deep sanitization on June 29th, from 12:00 PM to 4:00 PM. We apologize for any inconvenience caused.',
    date: '2026-06-26',
    type: 'Urgent'
  },
  {
    id: 'ann-3',
    title: 'Zumba & Aerobics Class Schedule Added',
    content: 'By popular demand, we are adding new evening Zumba, Aerobics, and HIIT group classes at 7:00 PM on Mondays, Wednesdays, and Fridays. Led by our elite instructor Coach Sarah. Dynamic rhythms, massive calorie burns!',
    date: '2026-06-24',
    type: 'Info'
  }
];

const defaultGallery: GalleryPhoto[] = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    title: 'Heavy Strength Section',
    category: 'Strength'
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=600',
    title: 'Elite Cardio Zone',
    category: 'Cardio'
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    title: 'CrossFit Group Training',
    category: 'Group'
  },
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
    title: 'Personal Training Room',
    category: 'Personal'
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    title: 'Dumbbell & Barbell Deck',
    category: 'Strength'
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=600',
    title: 'HIIT Aerobics Studio',
    category: 'Group'
  }
];

const defaultRequests: MembershipRequest[] = [];

const defaultMembers: Member[] = [];

const defaultContactResponses: ContactResponse[] = [];

const defaultSettings: GymSettings = {
  phone: '+91 8587882431',
  email: 'support@manav.sbs',
  address: 'W/44, Sainik Farm, New Delhi - 110017',
  whatsappNumber: '+918587882431',
  footerText: '© 2026 MS Fitness. Crafted for premium, elite-level physical performance and lifestyle excellence.',
  facebookUrl: 'https://facebook.com/msfitness',
  instagramUrl: 'https://instagram.com/manavdesignlab',
  workingHours: 'Mon - Fri: 5:00 AM - 10:00 PM | Sat - Sun: 7:00 AM - 8:00 PM'
};

const defaultTrainers: Trainer[] = [
  {
    id: 'tr-1',
    name: 'Coach Mike Tyson',
    role: 'Elite Strength Coach',
    specialty: 'Explosive Power & Conditioning',
    bio: 'Accredited specialist in high-performance metabolic training, powerlifting form corrections, and elite competition prep.',
    image_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'tr-2',
    name: 'Coach Sarah Connor',
    role: 'HIIT & Group Instructor',
    specialty: 'Endurance & Tactical Agility',
    bio: 'Dynamic aerobic flow choreographer, circuit trainer, and group motivation driver with a 100% transformation track record.',
    image_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=600'
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Marcus Brody',
    role: 'Member since 2024',
    achievement: 'Lost 45 lbs & gained extreme strength',
    quote: "The culture here is electric. It is not just about showing up; the trainers actively correct your forms, the equipment is always pristine, and the community supports your daily grind. Joining MS Fitness completely changed my lifestyle.",
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Natasha Romanoff',
    role: 'Member since 2025',
    achievement: 'Mastered Olympic lifts & core stability',
    quote: "As an active endurance athlete, I needed a gym that had serious equipment and professional coaches. MS Fitness exceeds all metrics. The layout is optimized, the acoustics are great, and the steam room is perfect for post-workout recovery.",
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Rohan Sharma',
    role: 'Member since 2026',
    achievement: 'Gained 15 lbs of pure lean muscle mass',
    quote: "The Yearly Plan is worth every penny! Having a dedicated personal coach and automated macro nutrition plans removed all the guesswork. Highly recommend MS Fitness to anyone looking for premium progression.",
    rating: 5
  }
];

const defaultHero: HeroSection = {
  id: 'primary',
  title: 'Forge your Legacy',
  subtitle: 'Welcome to MS Fitness. Experience premier equipment, legendary trainers, and an elite community designed to push your biological limits.',
  watermark: 'GYM',
  image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920',
  button_text_1: 'Join Now',
  button_text_2: 'View Plans',
  badge_text: 'ESTABLISHED MMXXIV • Premium Luxury Club',
  area_stat: '10k+',
  coaches_stat: '20+',
  access_stat: '24/7'
};

const defaultAbout: AboutSection = {
  id: 'primary',
  title: 'Who We Are',
  subtitle: 'ABOUT MS FITNESS',
  description_1: "Founded in MMXXIV, MS Fitness is Fit City's gold-standard athletic temple. We provide a space where high-intensity strength conditioning meets meticulous luxury amenities. From custom Hammer Strength equipment to individualized macro nutrition consulting, we have spared no expense.",
  description_2: "Our elite certified strength coaches and nutritional consultants are dedicated to helping you forge your legacy.",
  image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
  quote: "At MS Fitness, we do not just lift weights — we elevate lifestyles, forge mental fortitude, and sculpt champions.",
  features: [
    { title: "Elite Cleanliness & Safety", desc: "Medical-grade air filtration and 24/7 dedicated sanitization crew.", icon: "Shield" },
    { title: "Certified Specialists", desc: "Every coach holds accredited international athletic certifications.", icon: "Award" },
    { title: "Immersive Atmosphere", desc: "Great acoustics, premium spacing, and zero-judgment community.", icon: "Users" },
    { title: "Proven Success Loops", desc: "Over 5,000+ member physical transformations tracked and verified.", icon: "Flame" }
  ]
};

interface GymContextProps {
  requests: MembershipRequest[];
  members: Member[];
  plans: MembershipPlan[];
  announcements: Announcement[];
  gallery: GalleryPhoto[];
  contactResponses: ContactResponse[];
  settings: GymSettings;
  trainers: Trainer[];
  testimonials: Testimonial[];
  hero: HeroSection;
  about: AboutSection;
  loading: boolean;
  
  // Refresh manually
  refreshData: () => Promise<void>;

  // Requests actions
  addRequest: (request: Omit<MembershipRequest, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateRequestStatus: (id: string, status: 'Approved' | 'Rejected') => Promise<void>;
  
  // Members actions
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  
  // Plans actions
  addPlan: (plan: Omit<MembershipPlan, 'id'>) => Promise<void>;
  updatePlan: (plan: MembershipPlan) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  
  // Announcements actions
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  updateAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  
  // Gallery actions
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => Promise<void>;
  updateGalleryPhoto: (photo: GalleryPhoto) => Promise<void>;
  deleteGalleryPhoto: (id: string) => Promise<void>;
  
  // Contact Responses actions
  addContactResponse: (response: Omit<ContactResponse, 'id' | 'createdAt'>) => Promise<void>;
  deleteContactResponse: (id: string) => Promise<void>;
  
  // Settings actions
  updateSettings: (settings: GymSettings) => Promise<void>;

  // Trainers actions
  addTrainer: (trainer: Omit<Trainer, 'id'>) => Promise<void>;
  updateTrainer: (trainer: Trainer) => Promise<void>;
  deleteTrainer: (id: string) => Promise<void>;

  // Testimonials actions
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (testimonial: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Sections actions
  updateHero: (hero: HeroSection) => Promise<void>;
  updateAbout: (about: AboutSection) => Promise<void>;

  // CRM Integration actions
  crmConfig: CRMIntegrationConfig;
  crmLogs: CRMSyncLog[];
  updateCRMConfig: (config: CRMIntegrationConfig) => Promise<void>;
  clearCRMLogs: () => void;
}

const GymContext = createContext<GymContextProps | undefined>(undefined);

const defaultCRMConfig: CRMIntegrationConfig = {
  webhookEnabled: false,
  webhookUrl: '',
  webhookHeaders: '',
  hubspotEnabled: false,
  hubspotPortalId: '',
  hubspotFormGuid: '',
  hubspotAccessToken: '',
  mailchimpEnabled: false,
  mailchimpApiKey: '',
  mailchimpAudienceId: '',
  mailchimpServer: ''
};

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>(defaultPlans);
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(defaultGallery);
  const [contactResponses, setContactResponses] = useState<ContactResponse[]>([]);
  const [settings, setSettings] = useState<GymSettings>(defaultSettings);
  const [trainers, setTrainers] = useState<Trainer[]>(defaultTrainers);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [hero, setHero] = useState<HeroSection>(defaultHero);
  const [about, setAbout] = useState<AboutSection>(defaultAbout);

  const [crmConfig, setCrmConfig] = useState<CRMIntegrationConfig>(() => {
    try {
      const saved = localStorage.getItem('ms_fitness_crm_config');
      return saved ? JSON.parse(saved) : defaultCRMConfig;
    } catch {
      return defaultCRMConfig;
    }
  });

  const [crmLogs, setCrmLogs] = useState<CRMSyncLog[]>(() => {
    try {
      const saved = localStorage.getItem('ms_fitness_crm_sync_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const updateCRMConfig = async (newConfig: CRMIntegrationConfig) => {
    setCrmConfig(newConfig);
    localStorage.setItem('ms_fitness_crm_config', JSON.stringify(newConfig));
  };

  const clearCRMLogs = () => {
    setCrmLogs([]);
    localStorage.removeItem('ms_fitness_crm_sync_logs');
  };

  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Fetch all tables from Supabase
  const fetchData = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      setLoading(true);

      // Safe fetch helper to fetch individual tables without breaking other tables
      const fetchTable = async (tableName: string, query: any, setter: (val: any) => void, fallback?: any) => {
        try {
          const { data, error } = await query;
          if (error) {
            console.warn(`Could not fetch ${tableName} from Supabase:`, error.message);
            if (fallback !== undefined) setter(fallback);
          } else if (data !== null) {
            if (Array.isArray(data)) {
              if (data.length > 0) {
                setter(data);
              } else if (fallback !== undefined) {
                setter(fallback);
              }
            } else {
              setter(data);
            }
          } else if (fallback !== undefined) {
            setter(fallback);
          }
        } catch (err) {
          console.warn(`Exception fetching ${tableName}:`, err);
          if (fallback !== undefined) setter(fallback);
        }
      };

      await Promise.all([
        fetchTable('membership_plans', supabase.from('membership_plans').select('*'), setPlans, defaultPlans),
        fetchTable('announcements', supabase.from('announcements').select('*'), setAnnouncements, defaultAnnouncements),
        fetchTable('gallery_photos', supabase.from('gallery_photos').select('*'), setGallery, defaultGallery),
        fetchTable('trainers', supabase.from('trainers').select('*'), setTrainers, defaultTrainers),
        fetchTable('testimonials', supabase.from('testimonials').select('*'), setTestimonials, defaultTestimonials),
        fetchTable('gym_settings', supabase.from('gym_settings').select('*').eq('id', 'primary').maybeSingle(), setSettings, defaultSettings),
        fetchTable('hero_section', supabase.from('hero_section').select('*').eq('id', 'primary').maybeSingle(), setHero, defaultHero),
        fetchTable('about_section', supabase.from('about_section').select('*').eq('id', 'primary').maybeSingle(), (data) => {
          if (data) {
            const featData = typeof data.features === 'string'
              ? JSON.parse(data.features)
              : data.features;
            setAbout({ ...data, features: featData });
          } else {
            setAbout(defaultAbout);
          }
        }, defaultAbout),
        fetchTable('membership_requests', supabase.from('membership_requests').select('*'), setRequests, []),
        fetchTable('members', supabase.from('members').select('*'), setMembers, []),
        fetchTable('contact_messages', supabase.from('contact_messages').select('*'), setContactResponses, [])
      ]);

    } catch (err) {
      console.error('Failed to load from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if tables are empty and seed them automatically if they are
  const ensureSeeded = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      console.log('Verifying Supabase tables seeding state...');

      // Helper to check and seed a specific table
      const checkAndSeed = async (
        tableName: string,
        checkQuery: any,
        seedAction: () => any
      ) => {
        try {
          const { data, error, count } = await checkQuery;
          if (error) {
            console.warn(`Error checking table ${tableName}:`, error.message);
            return;
          }
          
          // Determine if table is empty or missing its key row
          const isEmpty = (data === null) || (Array.isArray(data) && data.length === 0) || (count === 0);
          
          if (isEmpty) {
            console.log(`Table "${tableName}" is empty or has missing records. Seeding default data...`);
            const { error: seedError } = await seedAction();
            if (seedError) {
              console.error(`Error seeding table "${tableName}":`, seedError.message);
            } else {
              console.log(`Successfully seeded table "${tableName}"!`);
            }
          }
        } catch (err) {
          console.error(`Exception during checking/seeding "${tableName}":`, err);
        }
      };

      await Promise.all([
        // 1. membership_plans
        checkAndSeed(
          'membership_plans',
          supabase.from('membership_plans').select('*', { count: 'exact', head: false }),
          () => supabase.from('membership_plans').insert(defaultPlans)
        ),
        // 2. announcements
        checkAndSeed(
          'announcements',
          supabase.from('announcements').select('*', { count: 'exact', head: false }),
          () => supabase.from('announcements').insert(defaultAnnouncements)
        ),
        // 3. gallery_photos
        checkAndSeed(
          'gallery_photos',
          supabase.from('gallery_photos').select('*', { count: 'exact', head: false }),
          () => supabase.from('gallery_photos').insert(defaultGallery)
        ),
        // 4. trainers
        checkAndSeed(
          'trainers',
          supabase.from('trainers').select('*', { count: 'exact', head: false }),
          () => supabase.from('trainers').insert(defaultTrainers)
        ),
        // 5. testimonials
        checkAndSeed(
          'testimonials',
          supabase.from('testimonials').select('*', { count: 'exact', head: false }),
          () => supabase.from('testimonials').insert(defaultTestimonials)
        ),
        // 6. gym_settings
        checkAndSeed(
          'gym_settings',
          supabase.from('gym_settings').select('*').eq('id', 'primary').maybeSingle(),
          () => supabase.from('gym_settings').upsert({ id: 'primary', ...defaultSettings })
        ),
        // 7. hero_section
        checkAndSeed(
          'hero_section',
          supabase.from('hero_section').select('*').eq('id', 'primary').maybeSingle(),
          () => supabase.from('hero_section').upsert(defaultHero)
        ),
        // 8. about_section
        checkAndSeed(
          'about_section',
          supabase.from('about_section').select('*').eq('id', 'primary').maybeSingle(),
          () => supabase.from('about_section').upsert({
            ...defaultAbout,
            features: defaultAbout.features
          })
        )
      ]);

      console.log('All tables seeding check finished successfully!');
    } catch (err) {
      console.error('Error in ensureSeeded routine:', err);
    }
  };

  // Synchronize on startup and subscribe to realtime updates
  useEffect(() => {
    const init = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          await ensureSeeded();
          await fetchData();
        }
      } catch (err) {
        console.error('Error during startup synchronization:', err);
      } finally {
        setLoading(false);
      }
    };
    init();

    if (isSupabaseConfigured && supabase) {
      const channel = supabase.channel('gym-realtime-channel')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
          console.log('Realtime DB change detected. Synchronizing states...', payload);
          fetchData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // If Supabase is not configured or fails to initialize, ensure loading state is cleared
      setLoading(false);
    }
  }, []);

  const refreshData = async () => {
    await fetchData();
  };

  // Request actions
  const addRequest = async (newReq: Omit<MembershipRequest, 'id' | 'status' | 'createdAt'>) => {
    const id = `req-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const request = {
      id,
      fullName: newReq.fullName,
      mobileNumber: newReq.mobileNumber,
      email: newReq.email,
      age: newReq.age,
      gender: newReq.gender,
      selectedPlanId: newReq.selectedPlanId,
      fitnessGoal: newReq.fitnessGoal,
      address: newReq.address,
      message: newReq.message || '',
      status: 'Pending' as const,
      createdAt
    };

    if (isSupabaseConfigured && supabase) {
      try {
        console.log('Inserting request directly into Supabase table "membership_requests":', request);
        
        const { error } = await supabase
          .from('membership_requests')
          .insert([request]);

        if (error) {
          console.error('Exact Supabase insert error details:', error);
          throw error;
        }

        console.log('Successfully completed insert into "membership_requests"!');
        
        // Wait for fresh data fetch to update the list
        await fetchData();
      } catch (err: any) {
        console.error('Failed to sync addRequest to Supabase:', err);
        throw err;
      }
    } else {
      console.log('Supabase client not configured. Saving request to local state:', request);
      setRequests(prev => [request, ...prev]);
    }

    // Trigger CRM sync
    try {
      const newLogs = await sendLeadToCRM({
        type: 'Membership Request',
        name: request.fullName,
        email: request.email,
        phone: request.mobileNumber,
        details: {
          age: request.age,
          gender: request.gender,
          selectedPlanId: request.selectedPlanId,
          fitnessGoal: request.fitnessGoal,
          address: request.address,
          message: request.message
        }
      }, crmConfig);
      
      if (newLogs.length > 0) {
        setCrmLogs(prev => {
          const updated = [...newLogs, ...prev];
          localStorage.setItem('ms_fitness_crm_sync_logs', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (crmErr) {
      console.error('CRM sync execution error:', crmErr);
    }
  };

  const updateRequestStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    let updatedReq: MembershipRequest | null = null;
    let newMember: Member | null = null;

    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        updatedReq = { ...req, status };
        
        if (status === 'Approved') {
          const alreadyExists = members.some(m => m.email.toLowerCase() === req.email.toLowerCase() || m.mobileNumber === req.mobileNumber);
          if (!alreadyExists) {
            newMember = {
              id: `mem-${Date.now()}`,
              fullName: req.fullName,
              mobileNumber: req.mobileNumber,
              email: req.email,
              age: req.age,
              gender: req.gender,
              planId: req.selectedPlanId,
              fitnessGoal: req.fitnessGoal,
              address: req.address,
              joinedDate: new Date().toISOString().split('T')[0],
              paymentStatus: 'Unpaid',
              attendanceStatus: 'Present'
            };
          }
        }
        return updatedReq;
      }
      return req;
    }));

    if (newMember) {
      setMembers(mPrev => [newMember!, ...mPrev]);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: reqError } = await supabase.from('membership_requests').update({ status }).eq('id', id);
        if (reqError) throw reqError;
        if (newMember) {
          const { error: memError } = await supabase.from('members').insert([newMember]);
          if (memError) throw memError;
        }
        await fetchData();
        alert(`Membership request successfully ${status.toLowerCase()} and synchronized!`);
      } catch (err: any) {
        console.error('Failed to sync updateRequestStatus to Supabase:', err);
        alert('Failed to update request status in database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Member actions
  const addMember = async (m: Omit<Member, 'id'>) => {
    const member: Member = {
      ...m,
      id: `mem-${Date.now()}`
    };
    setMembers(prev => [member, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('members').insert([member]);
        if (error) throw error;
        await fetchData();
        alert('Member successfully added and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync addMember to Supabase:', err);
        alert('Failed to save Member to database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const updateMember = async (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('members').update(updatedMember).eq('id', updatedMember.id);
        if (error) throw error;
        await fetchData();
        alert('Member details successfully updated and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync updateMember to Supabase:', err);
        alert('Failed to update Member in database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const deleteMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
        alert('Member successfully removed from database!');
      } catch (err: any) {
        console.error('Failed to sync deleteMember to Supabase:', err);
        alert('Failed to delete Member from database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Plan actions
  const addPlan = async (p: Omit<MembershipPlan, 'id'>) => {
    const plan: MembershipPlan = {
      ...p,
      id: `plan-${Date.now()}`
    };
    setPlans(prev => [...prev, plan]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('membership_plans').insert([plan]);
        if (error) throw error;
        await fetchData();
        alert('Membership Plan successfully created and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync addPlan to Supabase:', err);
        alert('Failed to save Membership Plan to database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const updatePlan = async (updatedPlan: MembershipPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('membership_plans').update(updatedPlan).eq('id', updatedPlan.id);
        if (error) throw error;
        await fetchData();
        alert('Membership Plan successfully updated and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync updatePlan to Supabase:', err);
        alert('Failed to update Membership Plan in database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const deletePlan = async (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('membership_plans').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
        alert('Membership Plan successfully deleted!');
      } catch (err: any) {
        console.error('Failed to sync deletePlan to Supabase:', err);
        alert('Failed to delete Membership Plan from database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Announcement actions
  const addAnnouncement = async (a: Omit<Announcement, 'id' | 'date'>) => {
    const announcement: Announcement = {
      ...a,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [announcement, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('announcements').insert([announcement]);
        if (error) throw error;
        await fetchData();
        alert('Announcement successfully posted and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync addAnnouncement to Supabase:', err);
        alert('Failed to post Announcement to database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const updateAnnouncement = async (updatedAnn: Announcement) => {
    setAnnouncements(prev => prev.map(a => a.id === updatedAnn.id ? updatedAnn : a));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('announcements').update(updatedAnn).eq('id', updatedAnn.id);
        if (error) throw error;
        await fetchData();
        alert('Announcement successfully updated and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync updateAnnouncement to Supabase:', err);
        alert('Failed to update Announcement in database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
        alert('Announcement successfully deleted!');
      } catch (err: any) {
        console.error('Failed to sync deleteAnnouncement to Supabase:', err);
        alert('Failed to delete Announcement from database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Gallery actions
  const addGalleryPhoto = async (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `gal-${Date.now()}`
    };
    setGallery(prev => [...prev, newPhoto]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('gallery_photos').insert([newPhoto]);
        if (error) throw error;
        await fetchData();
        alert('Gallery Photo successfully uploaded and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync addGalleryPhoto to Supabase:', err);
        alert('Failed to save Gallery Photo to database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const updateGalleryPhoto = async (updatedPhoto: GalleryPhoto) => {
    setGallery(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('gallery_photos').update(updatedPhoto).eq('id', updatedPhoto.id);
        if (error) throw error;
        await fetchData();
        alert('Gallery Photo successfully updated and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync updateGalleryPhoto to Supabase:', err);
        alert('Failed to update Gallery Photo in database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const deleteGalleryPhoto = async (id: string) => {
    setGallery(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
        alert('Gallery Photo successfully deleted!');
      } catch (err: any) {
        console.error('Failed to sync deleteGalleryPhoto to Supabase:', err);
        alert('Failed to delete Gallery Photo from database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Contact actions
  const addContactResponse = async (res: Omit<ContactResponse, 'id' | 'createdAt'>) => {
    const newResponse: ContactResponse = {
      ...res,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setContactResponses(prev => [newResponse, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('contact_messages').insert([newResponse]);
        if (error) throw error;
        await fetchData();
      } catch (err: any) {
        console.error('Failed to sync addContactResponse to Supabase:', err);
        alert('Failed to send contact message to database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const deleteContactResponse = async (id: string) => {
    setContactResponses(prev => prev.filter(r => r.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
        alert('Contact Message successfully deleted!');
      } catch (err: any) {
        console.error('Failed to sync deleteContactResponse to Supabase:', err);
        alert('Failed to delete Contact Message from database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Settings actions
  const updateSettings = async (updatedSettings: GymSettings) => {
    setSettings(updatedSettings);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('gym_settings').upsert({
          id: 'primary',
          ...updatedSettings
        });
        if (error) throw error;
        await fetchData();
      } catch (err: any) {
        console.error('Failed to sync updateSettings to Supabase:', err);
        throw err;
      }
    }
  };

  // Trainers actions
  const addTrainer = async (t: Omit<Trainer, 'id'>) => {
    const trainer: Trainer = {
      ...t,
      id: `tr-${Date.now()}`
    };
    setTrainers(prev => [...prev, trainer]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('trainers').insert([trainer]);
        if (error) throw error;
        await fetchData();
        alert('Trainer successfully added and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync addTrainer to Supabase:', err);
        alert('Failed to save Trainer to database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const updateTrainer = async (updatedTrainer: Trainer) => {
    setTrainers(prev => prev.map(t => t.id === updatedTrainer.id ? updatedTrainer : t));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('trainers').update(updatedTrainer).eq('id', updatedTrainer.id);
        if (error) throw error;
        await fetchData();
        alert('Trainer successfully updated and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync updateTrainer to Supabase:', err);
        alert('Failed to update Trainer in database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const deleteTrainer = async (id: string) => {
    setTrainers(prev => prev.filter(t => t.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('trainers').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
        alert('Trainer successfully deleted!');
      } catch (err: any) {
        console.error('Failed to sync deleteTrainer to Supabase:', err);
        alert('Failed to delete Trainer from database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Testimonials actions
  const addTestimonial = async (t: Omit<Testimonial, 'id'>) => {
    const testimonial: Testimonial = {
      ...t,
      id: `test-${Date.now()}`
    };
    setTestimonials(prev => [...prev, testimonial]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('testimonials').insert([testimonial]);
        if (error) throw error;
        await fetchData();
        alert('Testimonial successfully created and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync addTestimonial to Supabase:', err);
        alert('Failed to save Testimonial to database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const updateTestimonial = async (updatedTestimonial: Testimonial) => {
    setTestimonials(prev => prev.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('testimonials').update(updatedTestimonial).eq('id', updatedTestimonial.id);
        if (error) throw error;
        await fetchData();
        alert('Testimonial successfully updated and synchronized!');
      } catch (err: any) {
        console.error('Failed to sync updateTestimonial to Supabase:', err);
        alert('Failed to update Testimonial in database: ' + (err.message || err));
        throw err;
      }
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
        alert('Testimonial successfully deleted!');
      } catch (err: any) {
        console.error('Failed to sync deleteTestimonial to Supabase:', err);
        alert('Failed to delete Testimonial from database: ' + (err.message || err));
        throw err;
      }
    }
  };

  // Sections actions
  const updateHero = async (updatedHero: HeroSection) => {
    setHero(updatedHero);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('hero_section').upsert({
          id: 'primary',
          ...updatedHero
        });
        if (error) throw error;
        await fetchData();
      } catch (err: any) {
        console.error('Failed to sync updateHero to Supabase:', err);
        throw err;
      }
    }
  };

  const updateAbout = async (updatedAbout: AboutSection) => {
    setAbout(updatedAbout);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('about_section').upsert({
          id: 'primary',
          ...updatedAbout,
          features: updatedAbout.features
        });
        if (error) throw error;
        await fetchData();
      } catch (err: any) {
        console.error('Failed to sync updateAbout to Supabase:', err);
        throw err;
      }
    }
  };

  // Computed safe fallbacks to prevent empty/blank database data from causing empty UI or crashes
  const safePlans = plans && plans.length > 0 ? plans : defaultPlans;
  const safeAnnouncements = announcements && announcements.length > 0 ? announcements : defaultAnnouncements;
  const safeGallery = gallery && gallery.length > 0 ? gallery : defaultGallery;
  const safeTrainers = trainers && trainers.length > 0 ? trainers : defaultTrainers;
  const safeTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const safeSettings: GymSettings = {
    phone: settings?.phone || defaultSettings.phone,
    email: settings?.email || defaultSettings.email,
    address: settings?.address || defaultSettings.address,
    whatsappNumber: settings?.whatsappNumber || defaultSettings.whatsappNumber,
    footerText: settings?.footerText || defaultSettings.footerText,
    facebookUrl: settings?.facebookUrl || defaultSettings.facebookUrl,
    instagramUrl: settings?.instagramUrl || defaultSettings.instagramUrl,
    workingHours: settings?.workingHours || defaultSettings.workingHours
  };

  const safeHero: HeroSection = {
    id: hero?.id || defaultHero.id,
    title: hero?.title || defaultHero.title,
    subtitle: hero?.subtitle || defaultHero.subtitle,
    watermark: hero?.watermark || defaultHero.watermark,
    image_url: hero?.image_url || defaultHero.image_url,
    button_text_1: hero?.button_text_1 || defaultHero.button_text_1,
    button_text_2: hero?.button_text_2 || defaultHero.button_text_2,
    badge_text: hero?.badge_text || defaultHero.badge_text,
    area_stat: hero?.area_stat || defaultHero.area_stat,
    coaches_stat: hero?.coaches_stat || defaultHero.coaches_stat,
    access_stat: hero?.access_stat || defaultHero.access_stat
  };

  const safeAbout: AboutSection = {
    id: about?.id || defaultAbout.id,
    title: about?.title || defaultAbout.title,
    subtitle: about?.subtitle || defaultAbout.subtitle,
    description_1: about?.description_1 || defaultAbout.description_1,
    description_2: about?.description_2 || defaultAbout.description_2,
    image_url: about?.image_url || defaultAbout.image_url,
    quote: about?.quote || defaultAbout.quote,
    features: Array.isArray(about?.features) && about.features.length > 0 ? about.features : defaultAbout.features
  };

  return (
    <GymContext.Provider value={{
      requests,
      members,
      plans: safePlans,
      announcements: safeAnnouncements,
      gallery: safeGallery,
      contactResponses,
      settings: safeSettings,
      trainers: safeTrainers,
      testimonials: safeTestimonials,
      hero: safeHero,
      about: safeAbout,
      loading,
      refreshData,
      addRequest,
      updateRequestStatus,
      addMember,
      updateMember,
      deleteMember,
      addPlan,
      updatePlan,
      deletePlan,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addGalleryPhoto,
      updateGalleryPhoto,
      deleteGalleryPhoto,
      addContactResponse,
      deleteContactResponse,
      updateSettings,
      addTrainer,
      updateTrainer,
      deleteTrainer,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      updateHero,
      updateAbout
    }}>
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
