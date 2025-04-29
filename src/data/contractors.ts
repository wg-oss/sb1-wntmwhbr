import { Contractor } from '../types';

export const contractors: Contractor[] = [
  {
    id: '1',
    name: 'John Smith',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    specialty: 'Kitchen Remodeling',
    yearsExperience: 15,
    rating: 4.8,
    certifications: ['Master Builder', 'Kitchen & Bath Specialist'],
    completedProjects: [
      {
        id: 'p1',
        title: 'Modern Kitchen Renovation',
        description: 'Complete kitchen overhaul with custom cabinets and high-end appliances',
        images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2024-01',
        clientFeedback: 'Exceptional attention to detail and professionalism'
      }
    ],
    bio: 'Specializing in luxury kitchen renovations with 15 years of experience creating dream spaces.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    specialty: 'Bathroom Remodeling',
    yearsExperience: 12,
    rating: 4.9,
    certifications: ['Licensed Plumber', 'Tile Installation Expert'],
    completedProjects: [
      {
        id: 'p2',
        title: 'Spa-Like Master Bath',
        description: 'Luxury bathroom renovation with heated floors and custom shower',
        images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=500'],
        completionDate: '2024-02',
        clientFeedback: 'Sarah transformed our bathroom into a stunning retreat'
      }
    ],
    bio: 'Creating luxurious, spa-like bathrooms that combine beauty with functionality.'
  }
];