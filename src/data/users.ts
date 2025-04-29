import { Realtor, Contractor } from '../types';

export const realtors: Realtor[] = [
  {
    id: 'r1',
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    company: 'Luxury Real Estate Group',
    yearsExperience: 8,
    specialties: ['Luxury Homes', 'Commercial Properties'],
    bio: 'Dedicated realtor specializing in luxury properties with a keen eye for quality renovations.',
    role: 'realtor',
    connections: [
      {
        id: 'conn1',
        userId: 'r1',
        connectionId: 'r2',
        status: 'accepted',
        createdAt: '2023-12-01T00:00:00Z',
        workHistory: {
          companyName: 'Luxury Real Estate Group',
          relationship: 'colleague'
        }
      },
      {
        id: 'conn2',
        userId: 'r1',
        connectionId: 'c1',
        status: 'accepted',
        createdAt: '2024-01-15T00:00:00Z',
        workHistory: {
          projectId: 'p1',
          relationship: 'project-collaboration'
        }
      }
    ]
  },
  {
    id: 'r2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    company: 'Luxury Real Estate Group',
    yearsExperience: 12,
    specialties: ['Residential', 'Investment Properties'],
    bio: 'Expert in residential real estate with a strong network of reliable contractors.',
    role: 'realtor',
    connections: [
      {
        id: 'conn3',
        userId: 'r2',
        connectionId: 'r1',
        status: 'accepted',
        createdAt: '2023-12-01T00:00:00Z',
        workHistory: {
          companyName: 'Luxury Real Estate Group',
          relationship: 'colleague'
        }
      },
      {
        id: 'conn4',
        userId: 'r2',
        connectionId: 'c2',
        status: 'accepted',
        createdAt: '2024-02-01T00:00:00Z',
        workHistory: {
          projectId: 'p2',
          relationship: 'project-collaboration'
        }
      }
    ]
  },
  {
    id: 'r3',
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@example.com',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    company: 'Premier Properties',
    yearsExperience: 15,
    specialties: ['Luxury Homes', 'New Developments'],
    bio: 'Passionate about connecting clients with their dream homes and the right contractors to make it perfect.',
    role: 'realtor',
    connections: [
      {
        id: 'conn5',
        userId: 'r3',
        connectionId: 'r1',
        status: 'accepted',
        createdAt: '2023-11-15T00:00:00Z',
        workHistory: {
          companyName: 'Previous Agency Collaboration',
          relationship: 'project-collaboration'
        }
      }
    ]
  }
];

export const contractors: Contractor[] = [
  {
    id: 'c1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Kitchen Remodeling',
    yearsExperience: 15,
    rating: 4.8,
    certifications: ['Master Builder', 'Kitchen & Bath Specialist'],
    posts: [
      {
        id: 'p1',
        userId: 'c1',
        content: 'Completed a modern kitchen renovation with custom cabinets and high-end appliances. #KitchenRemodel',
        images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=500'],
        projectId: 'p1',
        likes: [],
        comments: [
          {
            id: 'comm1',
            userId: 'r1',
            content: 'Exceptional attention to detail and professionalism!',
            createdAt: '2024-01-15T00:00:00Z'
          }
        ],
        createdAt: '2024-01-15T00:00:00Z',
        type: 'project-showcase'
      }
    ],
    portfolio: [
      {
        id: 'pf1-c1',
        title: 'Modern Kitchen Renovation',
        description: 'Complete kitchen overhaul with custom cabinets and high-end appliances.',
        images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2024-01-15T00:00:00Z',
        clientFeedback: 'Exceptional attention to detail and professionalism!'
      },
      {
        id: 'pf2-c1',
        title: 'Farmhouse Kitchen Upgrade',
        description: 'Transformed a dated kitchen into a cozy farmhouse style with open shelving.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2023-11-10T00:00:00Z',
        clientFeedback: 'John brought our vision to life beautifully!'
      }
    ],
    bio: 'Specializing in luxury kitchen renovations with 15 years of experience creating dream spaces.',
    role: 'contractor',
    connections: [
      {
        id: 'conn6',
        userId: 'c1',
        connectionId: 'r1',
        status: 'accepted',
        createdAt: '2024-01-15T00:00:00Z',
        workHistory: {
          projectId: 'p1',
          relationship: 'project-collaboration'
        }
      }
    ],
    company: 'Smith Renovations',
    availability: {
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5],
      meetingDuration: 30,
      bookedSlots: [
        {
          date: '2025-04-29T00:00:00Z',
          startTime: '13:00',
          endTime: '14:00',
          realtorId: 'r1',
          status: 'confirmed',
          notes: 'Discuss kitchen remodel for Emma’s client.'
        },
        {
          date: '2025-04-30T00:00:00Z',
          startTime: '09:00',
          endTime: '10:00',
          realtorId: 'r3',
          status: 'confirmed',
          notes: 'Review project timeline with Sofia.'
        }
      ]
    },
    pendingMeetings: [
      {
        id: 'mreq1',
        realtorId: 'r1',
        date: '2025-05-01T00:00:00Z',
        startTime: '10:00',
        endTime: '11:00',
        status: 'pending',
        notes: 'Need to confirm scope of work.'
      },
      {
        id: 'mreq2',
        realtorId: 'r2',
        date: '2025-05-02T00:00:00Z',
        startTime: '14:00',
        endTime: '15:00',
        status: 'pending',
        notes: 'Potential new project discussion.'
      }
    ]
  },
  {
    id: 'c2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    specialty: 'Bathroom Remodeling',
    yearsExperience: 12,
    rating: 4.9,
    certifications: ['Licensed Plumber', 'Tile Installation Expert'],
    posts: [
      {
        id: 'p2',
        userId: 'c2',
        content: 'Transformed a master bathroom into a spa-like retreat with heated floors and a custom shower. #BathroomRenovation',
        images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=500'],
        projectId: 'p2',
        likes: [],
        comments: [
          {
            id: 'comm2',
            userId: 'r2',
            content: 'Sarah transformed our bathroom into a stunning retreat!',
            createdAt: '2024-02-01T00:00:00Z'
          }
        ],
        createdAt: '2024-02-01T00:00:00Z',
        type: 'project-showcase'
      }
    ],
    portfolio: [
      {
        id: 'pf1-c2',
        title: 'Spa-Like Master Bath',
        description: 'Luxury bathroom renovation with heated floors and custom shower.',
        images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2024-02-01T00:00:00Z',
        clientFeedback: 'Sarah transformed our bathroom into a stunning retreat!'
      },
      {
        id: 'pf2-c2',
        title: 'Modern Guest Bathroom',
        description: 'Updated a guest bathroom with sleek fixtures and a minimalist design.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2023-12-05T00:00:00Z',
        clientFeedback: 'Great work, very professional and timely.'
      }
    ],
    bio: 'Creating luxurious, spa-like bathrooms that combine beauty with functionality.',
    role: 'contractor',
    connections: [
      {
        id: 'conn8',
        userId: 'c2',
        connectionId: 'r2',
        status: 'accepted',
        createdAt: '2024-02-01T00:00:00Z',
        workHistory: {
          projectId: 'p2',
          relationship: 'project-collaboration'
        }
      }
    ],
    company: 'Johnson Bath & Kitchen',
    availability: {
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5],
      meetingDuration: 30,
      bookedSlots: []
    },
    pendingMeetings: []
  },
  {
    id: 'c3',
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Custom Carpentry',
    yearsExperience: 18,
    rating: 4.9,
    certifications: ['Master Carpenter', 'Fine Woodworking Specialist'],
    posts: [
      {
        id: 'p3',
        userId: 'c3',
        content: 'Built a floor-to-ceiling custom library with a rolling ladder and integrated lighting. #CustomCarpentry',
        images: ['https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&q=80&w=500'],
        projectId: 'p3',
        likes: [],
        comments: [
          {
            id: 'comm3',
            userId: 'r3',
            content: "David's craftsmanship is unmatched. A true artisan.",
            createdAt: '2024-01-20T00:00:00Z'
          }
        ],
        createdAt: '2024-01-20T00:00:00Z',
        type: 'project-showcase'
      }
    ],
    portfolio: [
      {
        id: 'pf1-c3',
        title: 'Custom Built-in Library',
        description: 'Floor-to-ceiling custom library with rolling ladder and integrated lighting.',
        images: ['https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2024-01-20T00:00:00Z',
        clientFeedback: "David's craftsmanship is unmatched. A true artisan."
      },
      {
        id: 'pf2-c3',
        title: 'Handcrafted Dining Table',
        description: 'Designed and built a rustic walnut dining table for a family of six.',
        images: ['https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'],
        completionDate: '2023-10-15T00:00:00Z',
        clientFeedback: 'The table is a work of art. We love it!'
      }
    ],
    bio: 'Passionate about creating bespoke wooden features that become the centerpiece of any room.',
    role: 'contractor',
    connections: [
      {
        id: 'conn11',
        userId: 'c3',
        connectionId: 'r3',
        status: 'accepted',
        createdAt: '2024-01-20T00:00:00Z',
        workHistory: {
          projectId: 'p3',
          relationship: 'project-collaboration'
        }
      }
    ],
    company: 'Martinez Custom Woodworks',
    availability: {
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5],
      meetingDuration: 30,
      bookedSlots: []
    },
    pendingMeetings: []
  },
  {
    id: 'c4',
    name: 'Lisa Wong',
    email: 'lisa.wong@example.com',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400',
    specialty: 'Interior Design & Renovation',
    yearsExperience: 10,
    rating: 4.7,
    certifications: ['NCIDQ Certified', 'Sustainable Design Specialist'],
    posts: [
      {
        id: 'p1-c4',
        userId: 'c4',
        content: 'Check out my latest home renovation project!',
        images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'],
        likes: [],
        comments: [],
        createdAt: '2024-01-15T10:00:00Z',
        type: 'project-showcase'
      }
    ],
    portfolio: [
      {
        id: 'proj1-c4',
        title: 'Home Renovation',
        description: 'A complete home renovation project.',
        images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'],
        completionDate: '2023-10-01',
      },
      {
        id: 'pf2-c4',
        title: 'Cozy Living Room Redesign',
        description: 'Revamped a living room with warm tones and custom furniture layouts.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2023-09-20T00:00:00Z',
        clientFeedback: 'The space feels so inviting now. Amazing work!'
      }
    ],
    bio: 'Combining form and function to create spaces that inspire and delight.',
    role: 'contractor',
    connections: [
      {
        id: 'conn13',
        userId: 'c4',
        connectionId: 'r1',
        status: 'accepted',
        createdAt: '2024-02-10T00:00:00Z',
        workHistory: {
          projectId: 'p4',
          relationship: 'project-collaboration'
        }
      }
    ],
    company: 'Wong Design Studio',
    availability: {
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5],
      meetingDuration: 30,
      bookedSlots: []
    },
    pendingMeetings: []
  },
  {
    id: 'c5',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    specialty: 'Outdoor Living Spaces',
    yearsExperience: 14,
    rating: 4.8,
    certifications: ['Landscape Architecture License', 'Hardscape Specialist'],
    posts: [
      {
        id: 'p5',
        userId: 'c5',
        content: 'Created a resort-style backyard with a custom pool, outdoor kitchen, and fire features. #OutdoorLiving',
        images: ['https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&q=80&w=500'],
        projectId: 'p5',
        likes: [],
        comments: [
          {
            id: 'comm5',
            userId: 'r2',
            content: 'James created our dream outdoor oasis. Every detail is perfect.',
            createdAt: '2024-01-05T00:00:00Z'
          }
        ],
        createdAt: '2024-01-05T00:00:00Z',
        type: 'project-showcase'
      }
    ],
    portfolio: [
      {
        id: 'pf1-c5',
        title: 'Resort-Style Backyard',
        description: 'Custom pool, outdoor kitchen, and living area with fire features.',
        images: ['https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2024-01-05T00:00:00Z',
        clientFeedback: 'James created our dream outdoor oasis. Every detail is perfect.'
      },
      {
        id: 'pf2-c5',
        title: 'Patio and Pergola Installation',
        description: 'Built a shaded patio area with a custom pergola and stone flooring.',
        images: ['https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2023-08-15T00:00:00Z',
        clientFeedback: 'The patio is our favorite spot now. Fantastic job!'
      }
    ],
    bio: 'Transforming outdoor spaces into luxurious extensions of your home.',
    role: 'contractor',
    connections: [
      {
        id: 'conn14',
        userId: 'c5',
        connectionId: 'r2',
        status: 'accepted',
        createdAt: '2024-01-05T00:00:00Z',
        workHistory: {
          projectId: 'p5',
          relationship: 'project-collaboration'
        }
      }
    ],
    company: 'Wilson Outdoor Living',
    availability: {
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5],
      meetingDuration: 30,
      bookedSlots: []
    },
    pendingMeetings: []
  }
];