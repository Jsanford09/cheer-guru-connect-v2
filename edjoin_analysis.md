# Edjoin.org Job Posting Analysis

The user wants to base the new design on the job posting page from edjoin.org (specifically, the Junior Varsity Cheerleading Coach posting).

## Key Design and Information Architecture Takeaways:

1.  **Clear Information Hierarchy (Two-Column Layout):**
    *   The main job description and employer information are on the left.
    *   Key, structured metadata (Application Deadline, Date Posted, Contact, Number of Openings, Salary, Length of Work Year, Employment Type) is prominently displayed in a sidebar on the right.
    *   This two-column structure for a single job/provider view is a strong design element to adopt.

2.  **Structured Metadata:**
    *   The metadata section is very clean and uses clear labels (e.g., "Application Deadline," "Salary," "Employment Type").
    *   The "Requirements / Qualifications" section is a simple, clear bulleted list, which is effective.

3.  **Branding/Employer Focus:**
    *   The employer's logo and a brief "About the Employer" section are featured prominently. This is a good model for the "Service Provider" profiles as well, giving them a professional, business-like feel.

4.  **Action Buttons:**
    *   Prominent "APPLY" and "ADD TO WISHLIST" buttons are clearly visible at the bottom of the right sidebar. This emphasizes the call-to-action.

## Integration Plan for Cheer Guru Connect:

The existing Cheer Guru Connect app uses a card-based layout for listings. The edjoin.org model is better suited for the *single job view* or *single provider profile view*.

1.  **Job/Provider Card (Listing View):** Keep the existing card-based layout for browsing, as it's excellent for a list view.
2.  **Job/Provider Detail View:** When a user clicks a card, a modal or a new page should open using the **edjoin.org two-column layout**:
    *   **Left Column (Main Content):** Full description, employer/provider bio, and detailed requirements/specialties.
    *   **Right Column (Metadata/Actions):** Key facts (Location, Compensation, Deadline, Contact Info, Status) and primary action buttons (Apply/Contact).
3.  **UI Refinement:**
    *   The existing gradient design is vibrant and should be maintained, but the content presentation needs to be more structured and professional, similar to edjoin.org's clean, professional aesthetic.
    *   We will need to update the `JobCard.jsx` and `ServiceProviderCard.jsx` to link to a new detail view (likely a modal).

## New Requirement: Clear Separation

The user wants a clear separation between:
- **Seeking Jobs?** (Job Seeker View)
- **Seeking a Coach/Choreographer/Judge?** (Employer/Team View)

The existing app uses "Find Jobs" and "Find Providers" tabs, which is a good start. We can refine the main navigation to use the user's exact phrasing for clarity.

- **"Find Jobs" tab** -> **"Seeking Jobs?"** (Job Seeker View)
- **"Find Providers" tab** -> **"Seeking a Coach/Choreographer/Judge?"** (Employer/Team View)

This completes the analysis of the new design reference. The next step is to set up the backend for data aggregation.
