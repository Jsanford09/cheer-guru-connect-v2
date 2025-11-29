# Job Board Scraping Research for Cheer Guru Connect

## Overview
Research conducted to identify the best education job board websites for scraping cheerleading and coaching positions to populate the national Cheer Guru Connect job board.

## Target Websites Analyzed

### 1. EdJoin.org
**Status**: Primary Target - High Priority
- **URL**: https://www.edjoin.org/
- **Description**: The nation's #1 education job board
- **Cheerleading Job Availability**: ✅ Confirmed - Found the specific job posting we analyzed (Junior Varsity Cheerleading Coach at Ukiah Unified School District)
- **Structure**: Clean, professional layout with detailed job postings
- **Scraping Potential**: High - Well-structured HTML, consistent format
- **Job Details Available**: 
  - Title, Organization, Location, State
  - Application Deadline, Date Posted
  - Contact Information (Name, Phone)
  - Salary/Compensation
  - Requirements/Qualifications
  - Full job descriptions
- **Geographic Coverage**: National, with strong presence in California and other states
- **Search Functionality**: Advanced search by keywords, location, district

### 2. SchoolSpring.com
**Status**: Secondary Target - Medium Priority
- **URL**: https://www.schoolspring.com/
- **Description**: K-12 education job board with 113,705+ teaching jobs
- **Cheerleading Job Availability**: ✅ Confirmed - Found 67 cheerleading coach results
- **Structure**: Modern interface with job cards and detailed views
- **Scraping Potential**: Medium - Uses dynamic loading, may require more sophisticated scraping
- **Job Details Available**:
  - Position title and type
  - School/District name
  - Location (City, State)
  - Posted date
  - Job descriptions
  - Application links
- **Geographic Coverage**: National coverage with good distribution
- **Notable Features**: 
  - Interactive map showing job locations
  - Filter by Position Areas, Grade Level, Job Type
  - Over 2 million education job seekers in their network

### 3. K12JobSpot.com
**Status**: Secondary Target - Medium Priority  
- **URL**: https://www.k12jobspot.com/
- **Description**: Education career site by Frontline Education
- **Cheerleading Job Availability**: ✅ Confirmed - Found 2,000+ results for "cheerleading coach"
- **Structure**: Clean, professional layout with detailed job listings
- **Scraping Potential**: Medium-High - Well-structured, consistent format
- **Job Details Available**:
  - Position title and category (Coach/Trainer)
  - School/District information
  - Location with addresses
  - Posted dates
  - Salary information (when available)
  - Full job descriptions
- **Geographic Coverage**: National with comprehensive district coverage
- **Notable Features**:
  - Claims 50K+ educator jobs available
  - Information about every K12 district in the U.S.
  - 1M+ teaching jobs filled using their platform

## Additional Sources Identified (Not Yet Analyzed)

### 4. HigherEdJobs.com
- **Focus**: College/University positions
- **Potential**: Lower priority for K-12 cheerleading, but may have college cheerleading coach positions

### 5. Indeed.com
- **Cheerleading Coach Jobs**: 585+ positions found
- **Potential**: High volume but mixed quality, includes non-education positions

### 6. LinkedIn Jobs
- **Cheerleading Coach Jobs**: 2000+ positions
- **Potential**: Professional network, but scraping may be more restricted

## Scraping Strategy Recommendations

### Phase 1: Primary Implementation
1. **EdJoin.org** - Start here due to:
   - High-quality, detailed job postings
   - Clean, consistent structure
   - Strong presence in education sector
   - Confirmed cheerleading/coaching positions

### Phase 2: Secondary Implementation
2. **K12JobSpot.com** - Second priority due to:
   - Large volume of results (2,000+ cheerleading positions)
   - Comprehensive national coverage
   - Good data structure
   
3. **SchoolSpring.com** - Third priority due to:
   - Good job volume (67 cheerleading results found)
   - Professional education focus
   - May require more complex scraping due to dynamic loading

### Technical Considerations

#### Scraping Challenges Identified:
1. **Anti-bot measures**: All sites likely have rate limiting and bot detection
2. **Dynamic content**: Some sites use JavaScript loading
3. **Legal compliance**: Need to respect robots.txt and terms of service
4. **Data consistency**: Different sites have different data formats

#### Recommended Approach:
1. **Respectful scraping**: Implement delays, respect rate limits
2. **User-Agent rotation**: Avoid detection
3. **Data normalization**: Convert all scraped data to consistent format
4. **Error handling**: Robust handling of site changes
5. **Caching**: Avoid re-scraping same jobs

## Data Mapping Strategy

### Standardized Job Object (from existing types/index.js):
```javascript
{
  id: string,
  title: string,
  description: string,
  type: "Coaching" | "Choreography" | "Judging" | "Training" | "Consulting",
  program: "Cheerleading" | "Dance/Pom",
  location: string,
  state: string,
  organization: string,
  requirements: string,
  compensation: string,
  contactEmail: string,
  contactPhone: string,
  postedDate: Date,
  deadline: Date,
  status: "Active" | "Filled" | "Expired" | "Urgent",
  sourceUrl: string,
  sourceSite: string
}
```

### Site-Specific Mapping:

#### EdJoin.org → Standard Format:
- `title` ← Job title
- `organization` ← School district name
- `location` ← City, State from address
- `state` ← Extract from location
- `compensation` ← Salary field
- `deadline` ← Application Deadline
- `postedDate` ← Date Posted
- `contactPhone` ← Contact phone number
- `requirements` ← Requirements/Qualifications section
- `sourceUrl` ← Job posting URL
- `sourceSite` ← "EdJoin"

#### K12JobSpot.com → Standard Format:
- Similar mapping with site-specific field names
- `type` ← Extract from "Coach/Trainer" category
- `program` ← Infer from title (cheerleading vs dance/pom)

## Implementation Priority

1. **High Priority**: EdJoin.org scraper
2. **Medium Priority**: K12JobSpot.com scraper  
3. **Low Priority**: SchoolSpring.com scraper
4. **Future**: Indeed.com, LinkedIn (if needed for volume)

## Legal and Ethical Considerations

- Review each site's robots.txt and terms of service
- Implement respectful scraping practices
- Consider reaching out to sites for API access or partnerships
- Ensure compliance with data privacy regulations
- Provide proper attribution to source sites

## Next Steps

1. Implement EdJoin.org scraper first
2. Test with small dataset
3. Implement data cleaning and normalization
4. Add K12JobSpot.com scraper
5. Monitor for site changes and adapt scrapers accordingly
