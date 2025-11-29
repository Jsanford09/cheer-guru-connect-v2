# Cheer Guru Connect - Cheerleading Job Board

A vibrant, modern job board application connecting cheerleading and dance professionals with teams and organizations nationwide. Built with React, Tailwind CSS, and featuring a beautiful gradient design with oxford blue and teal color scheme.

## 🌟 Features

### Core Functionality
- **Job Listings**: Teams can post coaching, choreography, judging, training, and consulting opportunities
- **Service Provider Profiles**: Professionals can create detailed profiles showcasing their skills and services
- **Interactive Forms**: User-friendly forms for posting jobs and registering as service providers
- **Advanced Filtering**: Filter by program type (Cheerleading/Dance-Pom), state, job type, and experience level
- **Search Functionality**: Search jobs and providers by keywords
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Design Features
- **Vibrant Gradient Design**: Oxford blue (#002147) to teal (#008080) gradients that "pop"
- **Card-Based Layout**: Easy-to-browse card interface for jobs and providers
- **Program Tabs**: Separate tabs for Cheerleading and Dance/Pom programs
- **Regional Filtering**: Filter by all 50 US states
- **Modern UI**: Smooth animations, hover effects, and micro-interactions
- **Professional Branding**: "Powered by Cheer Guru Nation"

### Technical Features
- **React 18**: Modern React with hooks and context management
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **TypeScript-like Structure**: Comprehensive type definitions and validation
- **Local Storage**: Persistent data storage for jobs and provider profiles
- **Modular Architecture**: Clean, maintainable component structure
- **Form Validation**: Comprehensive client-side validation
- **Sample Data**: Pre-loaded with realistic sample jobs and providers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd cheer-guru-connect
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## 📁 Project Structure

```
cheer-guru-connect/
├── src/
│   ├── components/           # React components
│   │   ├── Header.jsx       # Main navigation header
│   │   ├── FilterBar.jsx    # Search and filter controls
│   │   ├── MainContent.jsx  # Main content area
│   │   ├── JobCard.jsx      # Job listing card
│   │   ├── ServiceProviderCard.jsx # Provider profile card
│   │   ├── JobForm.jsx      # Job posting form
│   │   └── ServiceProviderForm.jsx # Provider registration form
│   ├── contexts/            # React context for state management
│   │   └── AppContext.jsx   # Main application context
│   ├── types/               # Type definitions and utilities
│   │   └── index.js         # Data models and validation
│   ├── data/                # Sample data
│   │   └── sampleData.js    # Pre-loaded jobs and providers
│   ├── App.jsx              # Main application component
│   ├── App.css              # Custom styles and gradients
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Design System

### Color Palette
- **Oxford Blue**: #002147 (Primary brand color)
- **Teal**: #008080 (Secondary accent color)
- **Light Teal**: #20b2aa (Hover states and highlights)
- **White**: #ffffff (Background and text)

### Gradients
- **Primary Gradient**: Oxford Blue to Teal (135deg)
- **Secondary Gradient**: Teal to Light Teal (135deg)
- **Accent Gradient**: Oxford Blue to Teal to Light Teal (45deg)

### Typography
- **Headers**: Bold, modern sans-serif
- **Body Text**: Clean, readable sans-serif
- **Interactive Elements**: Medium weight with proper contrast

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with multi-column layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Single-column layouts with optimized navigation

## 🔧 Key Components

### Header Component
- Navigation between Jobs and Providers
- Program type selection (Cheerleading/Dance-Pom)
- Quick action buttons for posting jobs and joining as provider
- Responsive design with mobile-friendly navigation

### Filter Bar
- Search functionality for jobs and providers
- State-based regional filtering
- Advanced filters (job type, experience level)
- Clear filters functionality

### Job Card
- Comprehensive job information display
- Visual job type indicators with emojis
- Status indicators (Active, Filled, Expired, Urgent)
- Contact information and application buttons
- Hover effects and smooth animations

### Service Provider Card
- Professional profile display with ratings
- Experience level and availability indicators
- Services offered with pricing
- Specialties and certifications
- Contact information and booking buttons

### Interactive Forms
- **Job Form**: Complete job posting with validation
- **Provider Form**: Comprehensive profile creation
- Real-time validation and error handling
- Dynamic field management (specialties, services, certifications)
- Professional styling with gradient headers

## 📊 Sample Data

The application includes realistic sample data:
- **6 Sample Jobs**: Covering all job types and programs across different states
- **6 Sample Providers**: Diverse professionals with varying experience levels
- **Realistic Content**: Professional descriptions, requirements, and contact information

## 🌐 Deployment

The application has been deployed and is accessible at:
**Production URL**: https://yzymhmfk.manus.space

### Local Development
For local development and testing:
```bash
npm run dev -- --host
```
This will make the application accessible on your local network.

## 🔄 State Management

The application uses React Context for state management:
- **Jobs State**: All job listings with CRUD operations
- **Providers State**: All service provider profiles
- **Filters State**: Search and filter criteria
- **UI State**: Modal visibility, active tabs, loading states
- **Persistent Storage**: Automatic saving to localStorage

## ✨ Features in Detail

### Job Management
- Create, read, update, delete job postings
- Job status management (Active, Filled, Expired)
- Deadline tracking with urgency indicators
- Comprehensive job information (requirements, compensation, contact)

### Provider Management
- Professional profile creation and management
- Service offerings with custom pricing
- Specialty and certification management
- Availability and experience tracking

### Filtering and Search
- Real-time search across jobs and providers
- Multi-criteria filtering (program, state, type, experience)
- Clear and intuitive filter controls
- Results count and status indicators

### User Experience
- Smooth animations and transitions
- Hover effects and micro-interactions
- Loading states and error handling
- Mobile-optimized touch interactions
- Accessibility considerations

## 🚀 Future Enhancements

Potential areas for expansion:
- User authentication and accounts
- Advanced messaging system
- Payment integration for services
- Review and rating system
- Email notifications
- Advanced search with location radius
- Calendar integration for availability
- File upload for portfolios and certifications

## 📞 Support

For questions or support regarding Cheer Guru Connect, please contact the development team or refer to the Cheer Guru Nation support resources.

---

**Powered by Cheer Guru Nation** - Your trusted partner in building championship programs.

