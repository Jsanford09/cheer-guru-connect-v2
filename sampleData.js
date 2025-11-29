import { 
  createJob, 
  createServiceProvider, 
  JobType, 
  ProgramType, 
  ExperienceLevel,
  JobStatus,
  ServiceStatus
} from '../types/index.js';

// Sample Jobs Data
export const sampleJobs = [
  createJob({
    id: 'job-1',
    title: 'Head Cheerleading Coach',
    description: 'We are seeking an experienced and passionate Head Cheerleading Coach to lead our varsity cheerleading program. The ideal candidate will have a strong background in competitive cheerleading, excellent leadership skills, and the ability to develop athletes both technically and personally. Responsibilities include planning practices, choreographing routines, managing competitions, and fostering team spirit.',
    type: JobType.COACHING,
    program: ProgramType.CHEERLEADING,
    location: 'Austin',
    state: 'Texas',
    organization: 'Austin High School',
    requirements: 'Minimum 3 years coaching experience, USASF safety certification preferred, strong communication skills, ability to work with high school athletes',
    compensation: '$3,500/season + bonuses',
    contactEmail: 'athletics@austinhigh.edu',
    contactPhone: '(512) 555-0123',
    postedDate: '2024-12-01T10:00:00Z',
    deadline: '2025-01-15T23:59:59Z',
    status: JobStatus.ACTIVE
  }),
  
  createJob({
    id: 'job-2',
    title: 'Competition Choreographer',
    description: 'Elite All-Stars is looking for a creative and experienced choreographer to create winning routines for our Level 5 teams. Must have experience with current trends in competitive cheerleading and ability to work with elite-level athletes. This is a contract position for the 2024-2025 competition season.',
    type: JobType.CHOREOGRAPHY,
    program: ProgramType.CHEERLEADING,
    location: 'Los Angeles',
    state: 'California',
    organization: 'Elite All-Stars',
    requirements: 'Professional choreography experience, knowledge of USASF rules, portfolio of previous work, ability to travel for competitions',
    compensation: '$5,000 per routine',
    contactEmail: 'hiring@eliteallstars.com',
    contactPhone: '(323) 555-0456',
    postedDate: '2024-11-28T14:30:00Z',
    deadline: '2024-12-20T23:59:59Z',
    status: JobStatus.ACTIVE
  }),

  createJob({
    id: 'job-3',
    title: 'Dance Team Coach',
    description: 'Join our award-winning dance program! We need an energetic coach to lead our varsity dance team through competition season. Experience with jazz, hip-hop, and pom styles required. Must be available for evening practices and weekend competitions.',
    type: JobType.COACHING,
    program: ProgramType.DANCE_POM,
    location: 'Miami',
    state: 'Florida',
    organization: 'Coral Gables High School',
    requirements: 'Dance background, coaching experience preferred, first aid certification, background check required',
    compensation: '$2,800/season',
    contactEmail: 'coach@coralgablesdance.org',
    contactPhone: '(305) 555-0789',
    postedDate: '2024-11-25T09:15:00Z',
    deadline: '2024-12-31T23:59:59Z',
    status: JobStatus.ACTIVE
  }),

  createJob({
    id: 'job-4',
    title: 'Tumbling Instructor',
    description: 'Part-time tumbling instructor needed for our recreational and competitive programs. Classes include beginner through advanced levels. Must be able to spot all tumbling skills and create a safe, fun learning environment.',
    type: JobType.TRAINING,
    program: ProgramType.CHEERLEADING,
    location: 'Denver',
    state: 'Colorado',
    organization: 'Rocky Mountain Gymnastics',
    requirements: 'Gymnastics or cheerleading background, spotting certification, experience working with children',
    compensation: '$25-35/hour',
    contactEmail: 'jobs@rockymountaingym.com',
    contactPhone: '(303) 555-0234',
    postedDate: '2024-12-03T16:45:00Z',
    deadline: '2025-01-10T23:59:59Z',
    status: JobStatus.ACTIVE
  }),

  createJob({
    id: 'job-5',
    title: 'Competition Judge',
    description: 'Experienced judges needed for regional cheerleading competitions. Must be certified and available for weekend events throughout the season. Travel opportunities available for national competitions.',
    type: JobType.JUDGING,
    program: ProgramType.CHEERLEADING,
    location: 'Atlanta',
    state: 'Georgia',
    organization: 'Southeast Cheer Officials',
    requirements: 'USASF judging certification, minimum 2 years judging experience, reliable transportation',
    compensation: '$150-300/day + travel expenses',
    contactEmail: 'judges@southeastcheer.org',
    contactPhone: '(404) 555-0567',
    postedDate: '2024-11-30T11:20:00Z',
    deadline: '2024-12-25T23:59:59Z',
    status: JobStatus.ACTIVE
  }),

  createJob({
    id: 'job-6',
    title: 'Private Coaching Consultant',
    description: 'Seeking a consultant to help develop our new competitive cheer program. Will work with coaching staff to establish training protocols, safety procedures, and competition strategies.',
    type: JobType.CONSULTING,
    program: ProgramType.CHEERLEADING,
    location: 'Phoenix',
    state: 'Arizona',
    organization: 'Desert Storm Athletics',
    requirements: 'Extensive coaching background, program development experience, strong organizational skills',
    compensation: 'Negotiable based on experience',
    contactEmail: 'info@desertstormathletics.com',
    contactPhone: '(602) 555-0890',
    postedDate: '2024-12-02T13:10:00Z',
    deadline: '2025-01-05T23:59:59Z',
    status: JobStatus.ACTIVE
  })
];

// Sample Service Providers Data
export const sampleServiceProviders = [
  createServiceProvider({
    id: 'provider-1',
    name: 'Sarah Johnson',
    bio: 'Former NCAA Division I cheerleader with 8+ years of coaching experience. Specializing in building strong, competitive programs from the ground up. I have coached teams to multiple state championships and have a passion for developing young athletes both on and off the mat.',
    specialties: ['Stunting', 'Tumbling', 'Team Building', 'Competition Prep'],
    programs: [ProgramType.CHEERLEADING],
    experienceLevel: ExperienceLevel.ELITE,
    location: 'Dallas',
    state: 'Texas',
    services: [
      { name: 'Private Coaching', rate: '$75/hour' },
      { name: 'Team Workshops', rate: '$200/session' },
      { name: 'Competition Choreography', rate: '$1,500/routine' }
    ],
    rates: 'Starting at $75/hour',
    availability: 'Weekends and evenings, summer camps available',
    contactEmail: 'sarah.johnson.cheer@gmail.com',
    contactPhone: '(214) 555-0123',
    website: 'https://sarahjohnsoncheer.com',
    socialMedia: '@sarahjcheer',
    certifications: ['USASF Safety Certification', 'CPR/First Aid', 'NFHS Coaching Certification'],
    experience: '8 years coaching, former D1 athlete',
    status: ServiceStatus.AVAILABLE
  }),

  createServiceProvider({
    id: 'provider-2',
    name: 'Marcus Rodriguez',
    bio: 'Professional choreographer and former competitive dancer with expertise in contemporary, jazz, and hip-hop styles. I work with dance teams and cheerleading squads to create dynamic, award-winning routines that showcase each team\'s unique strengths.',
    specialties: ['Choreography', 'Hip-Hop', 'Jazz', 'Contemporary'],
    programs: [ProgramType.DANCE_POM, ProgramType.CHEERLEADING],
    experienceLevel: ExperienceLevel.ADVANCED,
    location: 'Las Vegas',
    state: 'Nevada',
    services: [
      { name: 'Competition Choreography', rate: '$2,000/routine' },
      { name: 'Masterclasses', rate: '$150/class' },
      { name: 'Private Lessons', rate: '$100/hour' }
    ],
    rates: 'Starting at $100/hour',
    availability: 'Flexible schedule, travel available',
    contactEmail: 'marcus@danceandcheer.pro',
    contactPhone: '(702) 555-0456',
    website: 'https://marcusrodriguezchoreography.com',
    socialMedia: '@marcusdancepro',
    certifications: ['Professional Dance Certification', 'Youth Protection Training'],
    experience: '6 years professional choreography',
    status: ServiceStatus.AVAILABLE
  }),

  createServiceProvider({
    id: 'provider-3',
    name: 'Emily Chen',
    bio: 'Certified tumbling instructor and former elite gymnast. I specialize in teaching safe tumbling progression and helping athletes overcome mental blocks. My patient, encouraging approach has helped hundreds of athletes achieve their tumbling goals.',
    specialties: ['Tumbling', 'Back Handsprings', 'Layout', 'Mental Training'],
    programs: [ProgramType.CHEERLEADING],
    experienceLevel: ExperienceLevel.ELITE,
    location: 'San Francisco',
    state: 'California',
    services: [
      { name: 'Private Tumbling', rate: '$80/hour' },
      { name: 'Group Classes', rate: '$35/athlete' },
      { name: 'Mental Block Coaching', rate: '$90/hour' }
    ],
    rates: 'Starting at $35/athlete',
    availability: 'Weekdays after 3pm, weekends',
    contactEmail: 'emily.chen.tumbling@gmail.com',
    contactPhone: '(415) 555-0789',
    website: 'https://emilychentumbling.com',
    socialMedia: '@emilytumbles',
    certifications: ['USAG Safety Certification', 'Mental Performance Coaching', 'CPR/AED'],
    experience: '5 years coaching, former Level 10 gymnast',
    status: ServiceStatus.AVAILABLE
  }),

  createServiceProvider({
    id: 'provider-4',
    name: 'Coach Mike Thompson',
    bio: 'Veteran cheerleading coach with 15+ years of experience building championship programs. I offer consulting services for new programs, team building workshops, and coaching mentorship. My teams have won 12 state titles and 3 national championships.',
    specialties: ['Program Development', 'Leadership', 'Competition Strategy', 'Coach Mentoring'],
    programs: [ProgramType.CHEERLEADING],
    experienceLevel: ExperienceLevel.ELITE,
    location: 'Nashville',
    state: 'Tennessee',
    services: [
      { name: 'Program Consulting', rate: '$200/hour' },
      { name: 'Coach Mentoring', rate: '$150/hour' },
      { name: 'Team Building Workshops', rate: '$500/day' }
    ],
    rates: 'Starting at $150/hour',
    availability: 'Limited availability, booking 2 months in advance',
    contactEmail: 'coach.mike.thompson@gmail.com',
    contactPhone: '(615) 555-0234',
    website: 'https://mikethompsoncoaching.com',
    socialMedia: '@coachmikethompson',
    certifications: ['USASF Master Trainer', 'NFHS Master Course', 'Leadership Development'],
    experience: '15+ years coaching, 12 state titles',
    status: ServiceStatus.BUSY
  }),

  createServiceProvider({
    id: 'provider-5',
    name: 'Jessica Williams',
    bio: 'Dance team specialist with expertise in pom, jazz, and kick technique. I work with high school and college dance teams to improve technique, performance quality, and competition readiness. Former professional dancer with the NBA.',
    specialties: ['Pom Technique', 'Jazz', 'Kick Lines', 'Performance Quality'],
    programs: [ProgramType.DANCE_POM],
    experienceLevel: ExperienceLevel.ADVANCED,
    location: 'Chicago',
    state: 'Illinois',
    services: [
      { name: 'Technique Workshops', rate: '$300/workshop' },
      { name: 'Private Coaching', rate: '$85/hour' },
      { name: 'Competition Prep', rate: '$400/day' }
    ],
    rates: 'Starting at $85/hour',
    availability: 'Weekends, summer intensives',
    contactEmail: 'jessica.williams.dance@gmail.com',
    contactPhone: '(312) 555-0567',
    website: 'https://jessicawilliamsdance.com',
    socialMedia: '@jesswilliamsdance',
    certifications: ['Professional Dance Teaching', 'Sports Medicine Basics'],
    experience: '7 years coaching, former NBA dancer',
    status: ServiceStatus.AVAILABLE
  }),

  createServiceProvider({
    id: 'provider-6',
    name: 'Alex Rivera',
    bio: 'Innovative choreographer specializing in cutting-edge routines that blend traditional cheerleading with modern dance elements. I help teams stand out at competitions with unique, memorable performances that judges love.',
    specialties: ['Creative Choreography', 'Music Editing', 'Visual Effects', 'Innovation'],
    programs: [ProgramType.CHEERLEADING, ProgramType.DANCE_POM],
    experienceLevel: ExperienceLevel.ADVANCED,
    location: 'Seattle',
    state: 'Washington',
    services: [
      { name: 'Competition Choreography', rate: '$2,500/routine' },
      { name: 'Music Mixing', rate: '$300/mix' },
      { name: 'Creative Consulting', rate: '$125/hour' }
    ],
    rates: 'Starting at $125/hour',
    availability: 'Project-based, 3-week lead time',
    contactEmail: 'alex@riverachoreography.com',
    contactPhone: '(206) 555-0890',
    website: 'https://riverachoreography.com',
    socialMedia: '@alexriverachoreography',
    certifications: ['Music Production Certificate', 'Creative Arts Degree'],
    experience: '4 years professional choreography',
    status: ServiceStatus.AVAILABLE
  })
];

// Function to initialize sample data
export const initializeSampleData = (actions) => {
  // Check if data already exists in localStorage
  const existingJobs = localStorage.getItem('cheerGuruJobs');
  const existingProviders = localStorage.getItem('cheerGuruProviders');
  
  // Only add sample data if no existing data
  if (!existingJobs || JSON.parse(existingJobs).length === 0) {
    actions.setJobs(sampleJobs);
  }
  
  if (!existingProviders || JSON.parse(existingProviders).length === 0) {
    actions.setServiceProviders(sampleServiceProviders);
  }
};

