import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MembershipRequest, 
  Member, 
  MembershipPlan, 
  Announcement, 
  GalleryPhoto, 
  ContactResponse, 
  GymSettings 
} from '../types';

// Seed Data
const defaultPlans: MembershipPlan[] = [
  {
    id: 'plan-monthly',
    name: 'Monthly Plan',
    price: '$49',
    billing: 'per month',
    features: [
      'Access to premium Gym floor & machines',
      'Free locker access & hot showers',
      '1 fitness consultation per month',
      'Cardio & strength zone access',
      'Free high-speed Wi-Fi'
    ]
  },
  {
    id: 'plan-quarterly',
    name: 'Quarterly Plan',
    price: '$129',
    billing: 'per 3 months',
    features: [
      'All Monthly Plan features included',
      'Customized workout planner',
      '2 personalized training sessions',
      'Nutrition & diet guidelines booklet',
      '10% off at the MS Fitness juice bar',
      'Access to steam room & sauna'
    ],
    isPopular: true
  },
  {
    id: 'plan-yearly',
    name: 'Yearly Plan',
    price: '$399',
    billing: 'per year',
    features: [
      '24/7 unlimited gym access',
      'Dedicated elite personal coach',
      'Fully personalized meal & macro planning',
      'Unlimited steam bath & recovery zone',
      '1 free energy drink or shake per day',
      'Unlimited Zumba & CrossFit group classes',
      'Exclusive MS Fitness premium gym bag & shaker'
    ]
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

const defaultRequests: MembershipRequest[] = [
  {
    id: 'req-1',
    fullName: 'Jane Doe',
    mobileNumber: '555-0192',
    email: 'jane.doe@gmail.com',
    age: 26,
    gender: 'Female',
    selectedPlanId: 'plan-monthly',
    fitnessGoal: 'Improve endurance and stay active',
    address: '456 Oak Lane, Fit City',
    message: 'I would like to start from next Monday if possible.',
    status: 'Pending',
    createdAt: '2026-06-26T14:30:00Z'
  },
  {
    id: 'req-2',
    fullName: 'Mike Tyson',
    mobileNumber: '555-1122',
    email: 'mike.tyson@heavyweight.com',
    age: 34,
    gender: 'Male',
    selectedPlanId: 'plan-yearly',
    fitnessGoal: 'Explosive power and core stabilization',
    address: '100 Knockout Rd, Nevada',
    message: 'Looking for high intensity sessions.',
    status: 'Approved',
    createdAt: '2026-06-25T09:15:00Z'
  }
];

const defaultMembers: Member[] = [
  {
    id: 'mem-1',
    fullName: 'John Smith',
    mobileNumber: '555-8822',
    email: 'john.smith@hotmail.com',
    age: 29,
    gender: 'Male',
    planId: 'plan-yearly',
    fitnessGoal: 'Muscle Gain & Physique Transformation',
    address: '789 Pine Road, Uptown',
    joinedDate: '2026-06-10',
    paymentStatus: 'Paid',
    attendanceStatus: 'Present'
  },
  {
    id: 'mem-2',
    fullName: 'Sarah Connor',
    mobileNumber: '555-9988',
    email: 'sarah.connor@apocalypse.net',
    age: 32,
    gender: 'Female',
    planId: 'plan-quarterly',
    fitnessGoal: 'Tactical endurance, agility, and heavy lifting',
    address: '888 Desert Hideout, Sector 4',
    joinedDate: '2026-05-15',
    paymentStatus: 'Paid',
    attendanceStatus: 'Absent'
  },
  {
    id: 'mem-3',
    fullName: 'David Beckham',
    mobileNumber: '555-7733',
    email: 'david.b@legends.org',
    age: 45,
    gender: 'Male',
    planId: 'plan-monthly',
    fitnessGoal: 'Cardiovascular maintenance and core flexibility',
    address: '10 Golden Boot Blvd, Beverly Hills',
    joinedDate: '2026-06-20',
    paymentStatus: 'Unpaid',
    attendanceStatus: 'Present'
  }
];

const defaultContactResponses: ContactResponse[] = [
  {
    id: 'res-1',
    name: 'Alice Johnson',
    phone: '555-4422',
    email: 'alice.j@outlook.com',
    message: 'Hi! Do you offer any corporate discounts for groups of 10 or more? We have an office nearby on Muscle Avenue.',
    createdAt: '2026-06-26T18:45:00Z'
  }
];

const defaultSettings: GymSettings = {
  phone: '+1 (555) 987-6543',
  email: 'info@msfitness.com',
  address: '123 Muscle Avenue, Fit City, FC 90210',
  whatsappNumber: '+15559876543',
  footerText: '© 2026 MS Fitness. Crafted for premium, elite-level physical performance and lifestyle excellence.',
  facebookUrl: 'https://facebook.com/msfitness',
  instagramUrl: 'https://instagram.com/msfitness',
  workingHours: 'Mon - Fri: 5:00 AM - 10:00 PM | Sat - Sun: 7:00 AM - 8:00 PM'
};

interface GymContextProps {
  requests: MembershipRequest[];
  members: Member[];
  plans: MembershipPlan[];
  announcements: Announcement[];
  gallery: GalleryPhoto[];
  contactResponses: ContactResponse[];
  settings: GymSettings;
  
  // Requests actions
  addRequest: (request: Omit<MembershipRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateRequestStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  
  // Members actions
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;
  
  // Plans actions
  addPlan: (plan: Omit<MembershipPlan, 'id'>) => void;
  updatePlan: (plan: MembershipPlan) => void;
  deletePlan: (id: string) => void;
  
  // Announcements actions
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  updateAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  
  // Gallery actions
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  updateGalleryPhoto: (photo: GalleryPhoto) => void;
  deleteGalleryPhoto: (id: string) => void;
  
  // Contact Responses actions
  addContactResponse: (response: Omit<ContactResponse, 'id' | 'createdAt'>) => void;
  deleteContactResponse: (id: string) => void;
  
  // Settings actions
  updateSettings: (settings: GymSettings) => void;
}

const GymContext = createContext<GymContextProps | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MembershipRequest[]>(() => {
    const data = localStorage.getItem('ms_requests');
    return data ? JSON.parse(data) : defaultRequests;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const data = localStorage.getItem('ms_members');
    return data ? JSON.parse(data) : defaultMembers;
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const data = localStorage.getItem('ms_plans');
    return data ? JSON.parse(data) : defaultPlans;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const data = localStorage.getItem('ms_announcements');
    return data ? JSON.parse(data) : defaultAnnouncements;
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const data = localStorage.getItem('ms_gallery');
    return data ? JSON.parse(data) : defaultGallery;
  });

  const [contactResponses, setContactResponses] = useState<ContactResponse[]>(() => {
    const data = localStorage.getItem('ms_contact_responses');
    return data ? JSON.parse(data) : defaultContactResponses;
  });

  const [settings, setSettings] = useState<GymSettings>(() => {
    const data = localStorage.getItem('ms_settings');
    return data ? JSON.parse(data) : defaultSettings;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ms_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('ms_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ms_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('ms_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('ms_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('ms_contact_responses', JSON.stringify(contactResponses));
  }, [contactResponses]);

  useEffect(() => {
    localStorage.setItem('ms_settings', JSON.stringify(settings));
  }, [settings]);

  // Request actions
  const addRequest = (newReq: Omit<MembershipRequest, 'id' | 'status' | 'createdAt'>) => {
    const request: MembershipRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setRequests(prev => [request, ...prev]);
  };

  const updateRequestStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const updated = { ...req, status };
        
        // If approved, automatically add as active member in Gym members list
        if (status === 'Approved') {
          const alreadyExists = members.some(m => m.email.toLowerCase() === req.email.toLowerCase() || m.mobileNumber === req.mobileNumber);
          if (!alreadyExists) {
            const newMember: Member = {
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
              paymentStatus: 'Unpaid', // Default to unpaid until admin receives payment
              attendanceStatus: 'Present' // Default
            };
            setMembers(mPrev => [newMember, ...mPrev]);
          }
        }
        return updated;
      }
      return req;
    }));
  };

  // Member actions
  const addMember = (m: Omit<Member, 'id'>) => {
    const member: Member = {
      ...m,
      id: `mem-${Date.now()}`
    };
    setMembers(prev => [member, ...prev]);
  };

  const updateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Plan actions
  const addPlan = (p: Omit<MembershipPlan, 'id'>) => {
    const plan: MembershipPlan = {
      ...p,
      id: `plan-${Date.now()}`
    };
    setPlans(prev => [...prev, plan]);
  };

  const updatePlan = (updatedPlan: MembershipPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  // Announcement actions
  const addAnnouncement = (a: Omit<Announcement, 'id' | 'date'>) => {
    const announcement: Announcement = {
      ...a,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [announcement, ...prev]);
  };

  const updateAnnouncement = (updatedAnn: Announcement) => {
    setAnnouncements(prev => prev.map(a => a.id === updatedAnn.id ? updatedAnn : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Gallery actions
  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `gal-${Date.now()}`
    };
    setGallery(prev => [...prev, newPhoto]);
  };

  const updateGalleryPhoto = (updatedPhoto: GalleryPhoto) => {
    setGallery(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery(prev => prev.filter(p => p.id !== id));
  };

  // Contact actions
  const addContactResponse = (res: Omit<ContactResponse, 'id' | 'createdAt'>) => {
    const newResponse: ContactResponse = {
      ...res,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setContactResponses(prev => [newResponse, ...prev]);
  };

  const deleteContactResponse = (id: string) => {
    setContactResponses(prev => prev.filter(r => r.id !== id));
  };

  // Settings actions
  const updateSettings = (updatedSettings: GymSettings) => {
    setSettings(updatedSettings);
  };

  return (
    <GymContext.Provider value={{
      requests,
      members,
      plans,
      announcements,
      gallery,
      contactResponses,
      settings,
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
      updateSettings
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
