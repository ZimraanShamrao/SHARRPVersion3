Campus Hazard Ecosystem - Product Requirements Document

Overview

Build a college campus hazard management ecosystem consisting of three separate web applications that share the same Supabase backend.

The system consists of:

1. Reporting App
2. Resolution App
3. Analytics Dashboard

All applications should use the same Supabase project and database.

The applications should be deployed separately but maintained from a single codebase.

This is the stack that you will be using:

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Database
- Supabase Storage

---

IMPORTANT INSTRUCTIONS

Before writing any code:

- Design the application architecture.
- Design the database schema.
- Design the folder structure.
- Explain how image storage will work.
- Explain how authentication will work.
- Explain how deployment will work.
- Wait for approval before generating code.

Do not generate code until the architecture is approved.

---

Database Requirements

Create tables for:

- Student IDs
- Hazards
- Future analytics support

All hazard reports must be permanently stored in a database.

Images must be stored in cloud storage and linked to their corresponding database records.

Each hazard should contain:

- Hazard ID
- Submission Date/Time
- Hazard Image
- Short Description
- Detailed Description
- Location
- Status
- All maintenance progress notes (optional)
- Any progress images associated with maintenance updates (optional)
- Resolution Image (optional)
- Resolution Notes (optional)
- Resolution Date/Time (optional)

Hazard IDs should automatically generate in the format:

- HZ-0001
- HZ-0002
- HZ-0003

Every hazard must have a unique ID.

Store all history permanently.

Never delete reports or images.

---

Hazard Status System

Each hazard must contain one of the following statuses:

- Unresolved
- In Progress
- Resolved

When a hazard is first submitted it should automatically become:

Status = Unresolved

When an administrator completes the in progress process it should automatically become:

Status = In Progress

When an administrator completes the resolution process it should automatically become:

Status = Resolved

||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

Application 1: Reporting App

Purpose:

Allow students to report hazards and view hazard statuses.

When the application opens, users should see:

Title: Campus Hazard Reporting

Buttons:

- Report a Hazard
- Hazard List & Status

Purpose:

- Students report hazards.
- Anyone can view hazard statuses.

The Reporting App application should be designed primarily for smartphones and should adapt well to different phone screen sizes. The design should be clean, modern, intuitive, and require as few steps as possible for students to submit reports.

---

Student Validation Page

When the user presses:

“Report a Hazard”

They should be first taken to the Student Validation Page

Before accessing the reporting form, students must enter their Student ID.

The Student ID should be validated against a Student IDs table stored in Supabase.

If the ID exists:

Access granted.

If the ID does not exist:

Display an error.

The system only verifies existence.

No student accounts or sign-in system should be implemented.

No student information should be stored beyond the ID verification process.

---

Student Reporting Page

If the the user’s Student ID is validated they should be taken to a Student Reporting Page

The page should contain:

- Image Upload Section
- Short Description Field
- Additional Details Field
- Location Field
- Submit Button

Field Labels:

Image Upload

“Describe the hazard in one short sentence”

“Please provide any additional details about the hazard”

“Provide the location (be specific)”

Submit

---

Mobile Camera Support

Because this application is designed for smartphones, students should be able to:

- Take a photo directly from their phone camera
- Upload an existing photo from their gallery

Both methods should be supported.

---

Hazard Submission Rules

Required:

- Hazard Image
- Short Description
- Location

Optional:

- Additional Details

If required information is missing, display a user-friendly error message.

---

Student Submission Flow

When a student submits a hazard:

- Save the information to the database.
- Upload and store the image. File Name Format: HazardId_Submission.jpg

Ex: HZ-0001_Submission.jpg

- Generate a unique Hazard ID.
- Set status to Unresolved.
- Show:

“Thank you for your submission.”

- Display the generated Hazard ID.

Example:

“Thank you for your submission. Hazard ID: HZ-0014”

- After 5 seconds, reset the form.

---

Hazard List & Status Side

When the user presses:

“Hazard List & Status”

They should see:

- Unresolved Hazards
- In Progress Hazards
- Resolved Hazards

Buttons.

---

Unresolved Hazards Page

When selected:

Display all unresolved hazards.

Display hazards:

Newest first Oldest last

Each hazard card should display:

- Hazard ID
- Short Description
- Location
- Submission Date

Selecting a hazard should open a read-only detail page.

Users can view:

- Hazard Image
- Hazard Details
- Location
- Hazard ID
- Submission Date
- Status = Unresolved

Users cannot modify anything.

Users cannot mark hazards as resolved.

---

In Progress Hazards Page

When selected:

Display all in progress hazards.

Display hazards:

Newest first Oldest last

Each hazard card should display:

- Hazard ID
- Short Description
- Location
- Submission Date

Selecting a hazard should open a read-only detail page.

Users can view:

- Hazard Image
- Hazard Details
- Location
- Hazard ID
- Submission Date
- Status = In Progress
- Complete maintenance history
- All maintenance progress notes
- Any progress images associated with maintenance updates

Maintenance updates should be displayed chronologically and should preserve the complete history of all maintenance actions taken on the hazard.

Users cannot modify anything.

---

Resolved Hazards Page

When selected:

Display all resolved hazards.

Display hazards:

Newest first Oldest last

Each hazard card should display:

- Hazard ID
- Short Description
- Location
- Submission Date

Selecting a hazard should open a read-only detail page.

Users can view:

- Hazard Image
- Hazard Details
- Location
- Hazard ID
- Submission Date
- Status = Resolved
- Complete maintenance history
- All maintenance progress notes
- Any progress images associated with maintenance updates
- Resolution Image
- Resolution Notes
- Resolution Date

Users cannot modify anything.

||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

Application 2: Resolution App

Purpose:

Allow maintenance staff to change the status of hazards.

When the application opens, users should see:

Title: College Hazard Resolutions

Buttons:

- Login

Purpose:

- Verify that the user is admin

The Resolution App application should be designed primarily for smartphones and should adapt well to different phone screen sizes. The design should be clean, modern, and intuitive.

---

Admin Login

When the user presses:

“Login”

They should first be taken to a Login Page.

For the first version only:

Username: admin

Password: admin

This should be structured in a way that can later be replaced by Supabase Authentication without major changes to the application.

If login fails:

Display:

“Invalid username or password.”

---

Admin Resolution Side

After successful login, the user should enter the Admin Resolution Side.

This page should display:

- Unresolved Hazards
- In Progress Hazards

buttons.

Selecting either button should open the corresponding hazard list.

---

Admin Unresolved Hazards Page

When selected:

Display all unresolved hazards.

Display hazards:

Newest first Oldest last

Each hazard card should display:

- Hazard ID
- Short Description
- Location
- Submission Date

Selecting a hazard should open a hazard detail page.

The admin should be able to view:

- Hazard ID
- Hazard Image
- Short Description
- Detailed Description
- Location
- Submission Date
- Current Status

At the bottom should be:

- Mark Hazard As Resolved
- Mark Hazard As In Progress

Buttons

Selecting Mark Hazard As Resolved should launch the existing Resolution Workflow.

Selecting Mark Hazard As In Progress should launch the existing In Progress Workflow.

---

Admin In Progress Hazards Page

When selected:

Display all in progress hazards.

Display hazards:

Newest first Oldest last

Each hazard card should display:

- Hazard ID
- Short Description
- Location
- Submission Date

Selecting a hazard should open a hazard detail page.

The admin should be able to view:

- Hazard Image
- Hazard Details
- Location
- Hazard ID
- Submission Date
- Status = In Progress
- Complete maintenance history
- All maintenance progress notes
- Any progress images associated with maintenance updates

Maintenance updates should be displayed chronologically and should preserve the complete history of all maintenance actions taken on the hazard.

At the bottom should be:

- Mark Hazard As Resolved
- Add Progress Update

Buttons

Selecting Mark Hazard As Resolved should launch the existing Resolution Workflow.

Selecting Add Progress Update should launch the existing In Progress Workflow.

---

In Progress Workflow

When the admin presses:

- Mark Hazard As In Progress

or

- Add Progress Update

They should be taken to an In Progress Submission Page.

The page should require:

- Maintenance Notes

The page should optionally allow:

- Progress Image

Examples:

"Leak source identified."

"Replacement parts ordered."

"Contractor scheduled."

"Repair underway."

After submission:

1. Save maintenance notes.
2. Save progress image if provided. Name Format: HazardId_Progress#.jpg

Ex: HZ-0001_Progress1.jpg, HZ-0001_Progress2.jpg

1. Save maintenance update timestamp.
2. Change status to In Progress if it isn't already.
3. Remove the hazard from the unresolved list.
4. Add the hazard to the in progress list.

Additional maintenance updates should append to the maintenance history rather than replacing previous updates. Maintenance history should be permanently preserved.

---

Resolution Workflow

When the admin presses:

- Mark Hazard As Resolved
- Resolve Hazard

They should be taken to a Resolution Submission Page.

The page should require:

- Resolution Image
- Resolution Notes

Examples:

“Pipe replaced.”

“Leak repaired.”

“Drain unclogged.”

After submission:

1. Save resolution image. File Name Format: HazardId_Resolution.jpg

Ex: HZ-0001_Resolution.jpg

1. Save resolution notes.
2. Save resolution date.
3. Change status to Resolved.
4. Remove the hazard from the unresolved list.
5. Add the hazard to the resolved list.

||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

Application 3: Analytics Dashboard

Purpose:

Provide facilities management analytics.

When the application opens, users should see:

Title: College Hazard Analytics Dashboard

Display:

- Total Hazards
- Total Unresolved Hazards
- Total Hazards In Progress
- Average Resolution Time
- Most Common Locations
- Monthly Reports

Include CSV export functionality.

Dashboard should be modular so widgets can be easily hidden or added later.

The Analytics Dashboard application should be designed primarily for desktop and should adapt well to different computer/desktop screen sizes. The design should be clean, modern, intuitive, and resemble an ArcGIS dashboard in terms of design and usability.

|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

Search Bar Feature

A simple filter bar will be placed at the top of every existing Hazard List page in the application.

This search bar should exist on:

- Student Reporting App:
  - Unresolved Hazards List
  - In Progress Hazards List
  - Resolved Hazards List
- Resolution App:
  - Unresolved Hazards List
  - In Progress Hazards List

The search bar should filter only the hazard cards that are currently displayed on that specific page. For example, searching from the Student In Progress Hazards page should only search and filter In Progress hazards. Searching from the Admin Unresolved Hazards page should only search and filter Unresolved hazards.

As the user types into the search bar, hazard cards should dynamically disappear or reappear in real time based on keyword matches without requiring the user to press Enter, refresh the page, or navigate elsewhere. Clearing the search field should immediately restore the full list.

The filtering should perform case-insensitive partial matching against relevant hazard information including:

- Hazard ID
- Short Description
- Location
- Submission Date

Example behavior:

Searching:

"leak"

might reduce:

HZ-0001 - Ceiling leak in Dorm A

HZ-0005 - Broken sink in Library

HZ-0008 - Leak in cafeteria ceiling

HZ-0012 - Overflowing trash can

to:

HZ-0001 - Ceiling leak in Dorm A

HZ-0008 - Leak in cafeteria ceiling

Searching:

"library"

would isolate:

HZ-0005 - Broken sink in Library

Searching:

"HZ-0042"

would isolate that specific hazard card immediately.

The search functionality should preserve all existing behavior on the page including:

- Existing sorting order (newest to oldest)
- Hazard card click behavior
- Navigation to the Hazard Detail Page
- Status-specific filtering already performed by the page

This should feel like filtering the currently visible cards rather than performing a new database search.

---

Hazard Lists Important Note

Please ensure that throughout the entire ecosystem, whenever a student or admin is viewing any hazard list and selects a hazard card, they are taken to a dedicated Hazard Detail Page that displays the complete information for that hazard in an expanded view. Hazard lists should only display summary information such as Hazard ID, short description, location, and submission date. The Hazard Detail Page should act as the central location for viewing all information related to a specific hazard.

For the Student Reporting App, this behavior should apply to the Unresolved Hazards List, In Progress Hazards List, and Resolved Hazards List. When a student selects any hazard card from any of these lists, they should be taken to a read-only Hazard Detail Page containing all relevant information for that hazard, including maintenance history and resolution information where applicable. Students should not have any action buttons on this page. The only available action should be a "Back to List" button that returns them to the list they came from.

For the Resolution App, when an admin selects a hazard card from either the Unresolved Hazards List or the In Progress Hazards List, they should also be taken to a Hazard Detail Page displaying the full hazard information. However, unlike students, admins should have action buttons available on this page that depend on the list they entered from. Hazards opened from the Unresolved Hazards List should display the buttons "Mark Hazard As In Progress", "Mark Hazard As Resolved", and "Back to List". Hazards opened from the In Progress Hazards List should display the buttons "Add Progress Update", "Resolve Hazard", and "Back to List".

---

Navigation Clarification 

I would like to add explicit Back buttons throughout the application so that users never need to rely on browser navigation and can always move back up the navigation hierarchy in a predictable way.

For the Student Reporting App, the "Hazard List & Status" & "Report Hazard" pages themself should include a "Back to Home" button that returns the user to the Reporting App Home Page where they can choose between "Report Hazard" and "Hazard List & Status". Additionally, each individual hazard list page ("Unresolved Hazards", "In Progress Hazards", and "Resolved Hazards") should include a "Back to Hazard List & Status" button that returns the user to the Hazard List & Status page. Finally, every Hazard Detail Page should include a "Back to List" button that returns the user to the specific list page they came from.

For the Resolution App, each hazard list page ("Unresolved Hazards" and "In Progress Hazards") should include a "Back to Home" button that returns the admin to the Resolution App Home Page where they can choose which list they want to view. Similarly, every admin Hazard Detail Page should include a "Back to List" button that returns the admin to the specific list page they came from.

The intended navigation hierarchy for the Student Reporting App should therefore be:

**Home Page → Student Validation → Reporting Form** (with Back to Home → Home)

Home Page → Hazard List & Status → Hazard List → Hazard Detail Page

The intended navigation hierarchy for the Resolution App should be:

Admin Home Page → Hazard List → Hazard Detail Page → Action Page (if applicable)

Every level of this hierarchy should include a corresponding Back button that returns the user to the previous level in the navigation chain.

---

Error Handling

If image upload fails:

Display a clear error message.

If database submission fails:

Display a clear error message.

If resolution submission fails:

Display a clear error message.

The application should never silently fail.

---

Design Requirements

The design for each application should:

- Look modern and professional
- Use large touch-friendly buttons
- Include a search function in all Hazard Lists in both the reporting & resolution app
- Be easy for college students to use
- Require as few taps as possible
- Prioritize speed and simplicity

---

Deliverables

Before generating code:

Provide:

1. Complete architecture plan
2. Database schema
3. Folder structure
4. User flow diagrams
5. Authentication plan
6. Image storage plan
7. Deployment plan
8. Supabase setup instructions
9. List of any recommended improvements
10. Future scaling recommendations

---

Folder Structure

campus-hazard-ecosystem/

├── apps/

│   ├── reporting/                              # App 1 — Student Reporting (mobile-first)

│   │   ├── app/

│   │   │   ├── page.tsx                        # Home: Report a Hazard | Hazard List & Status

│   │   │   ├── report/

│   │   │   │   ├── validate/

│   │   │   │   │   └── page.tsx                # Student ID validation

│   │   │   │   └── form/

│   │   │   │       └── page.tsx                # Hazard submission form  + Back to Home

│   │   │   └── hazards/

│   │   │       ├── page.tsx                    # Hazard List & Status hub (3 list buttons + Back to Home)

│   │   │       ├── unresolved/

│   │   │       │   ├── page.tsx                # List + search + Back to Hazard List & Status

│   │   │       │   └── [hazardId]/

│   │   │       │       └── page.tsx            # Read-only detail + Back to List

│   │   │       ├── in-progress/

│   │   │       │   ├── page.tsx

│   │   │       │   └── [hazardId]/

│   │   │       │       └── page.tsx

│   │   │       └── resolved/

│   │   │           ├── page.tsx

│   │   │           └── [hazardId]/

│   │   │               └── page.tsx

│   │   ├── components/                         # Reporting-only UI (if any)

│   │   ├── lib/

│   │   │   └── actions/                        # Server Actions: validate ID, submit hazard, fetch lists/detail

│   │   ├── package.json

│   │   ├── next.config.ts

│   │   ├── tsconfig.json

│   │   └── postcss.config.mjs

│   │

│   ├── resolution/                             # App 2 — Admin Resolution (mobile-first)

│   │   ├── app/

│   │   │   ├── page.tsx                        # Admin Home: Login entry / post-login list chooser

│   │   │   ├── login/

│   │   │   │   └── page.tsx

│   │   │   └── hazards/

│   │   │       ├── page.tsx                    # Post-login: Unresolved | In Progress buttons

│   │   │       ├── unresolved/

│   │   │       │   ├── page.tsx                # List + search + Back to Home

│   │   │       │   └── [hazardId]/

│   │   │       │       ├── page.tsx            # Detail + Mark In Progress | Mark Resolved | Back to List

│   │   │       │       ├── in-progress/

│   │   │       │       │   └── page.tsx        # In Progress Submission + Back to Detail

│   │   │       │       └── resolve/

│   │   │       │           └── page.tsx        # Resolution Submission + Back to Detail

│   │   │       └── in-progress/

│   │   │           ├── page.tsx                # List + search + Back to Home

│   │   │           └── [hazardId]/

│   │   │               ├── page.tsx            # Detail + Add Progress Update | Mark Resolved | Back to List

│   │   │               ├── in-progress/

│   │   │               │   └── page.tsx        # In Progress Submission + Back to Detail

│   │   │               └── resolve/

│   │   │                   └── page.tsx        # Resolution Submission + Back to Detail

│   │   ├── middleware.ts                       # Protect admin routes

│   │   ├── lib/

│   │   │   └── actions/                        # Server Actions: auth, status changes, uploads

│   │   ├── package.json

│   │   └── ...

│   │

│   └── analytics/                              # App 3 — Analytics Dashboard (desktop-first)

│       ├── app/

│       │   ├── page.tsx                        # Dashboard (widget grid)

│       │   ├── login/

│       │   │   └── page.tsx

│       │   └── api/

│       │       └── export/

│       │           └── route.ts                # CSV export

│       ├── components/

│       │   └── widgets/

│       │       ├── widget-registry.ts          # Rec #9: config-driven widget visibility

│       │       ├── total-hazards.tsx

│       │       ├── total-unresolved.tsx

│       │       ├── total-in-progress.tsx

│       │       ├── avg-resolution-time.tsx

│       │       ├── common-locations.tsx

│       │       └── monthly-reports.tsx

│       ├── middleware.ts

│       ├── lib/

│       │   └── actions/

│       ├── package.json

│       └── ...

│

├── packages/

│   ├── shared/

│   │   ├── types/

│   │   │   ├── hazard.ts

│   │   │   ├── maintenance-update.ts

│   │   │   └── student.ts

│   │   ├── constants/

│   │   │   ├── status.ts

│   │   │   └── storage.ts                      # Bucket names, filename patterns

│   │   ├── validation/

│   │   │   ├── hazard-schemas.ts               # Zod: submission, progress, resolution

│   │   │   └── env.ts                          # Rec #10: validated env schema

│   │   ├── utils/

│   │   │   ├── hazard-id.ts

│   │   │   ├── date-format.ts

│   │   │   ├── search-filter.ts                # Client-side card field filter

│   │   │   └── image-compression.ts            # Rec #7: optional, low-complexity

│   │   └── package.json

│   │

│   ├── supabase/

│   │   ├── client.ts

│   │   ├── server.ts

│   │   ├── admin.ts                            # Service-role client (server only)

│   │   ├── middleware.ts

│   │   ├── queries/

│   │   │   ├── hazards.ts                      # List, detail, analytics queries

│   │   │   └── maintenance.ts

│   │   └── storage/

│   │       ├── upload-submission.ts

│   │       ├── upload-progress.ts              # Rec #2: Progress# naming enforcement

│   │       └── upload-resolution.ts

│   │   └── package.json

│   │

│   ├── auth/

│   │   ├── admin-session.ts                    # v1 admin/admin session

│   │   ├── types.ts                            # AuthProvider interface for v2

│   │   └── package.json

│   │

│   └── ui/

│       ├── hazard-summary-card.tsx             # List card (4 summary fields)

│       ├── hazard-list-search.tsx              # Search bar + placeholder text

│       ├── maintenance-timeline.tsx            # Rec #1: chronological history

│       ├── hazard-detail-layout.tsx

│       ├── back-button.tsx                     # Reusable Back button

│       ├── button.tsx

│       └── package.json

│

├── supabase/

│   ├── migrations/

│   │   ├── 001_create_student_ids.sql

│   │   ├── 002_create_hazard_id_counter.sql

│   │   ├── 003_create_hazards.sql

│   │   ├── 004_create_maintenance_updates.sql

│   │   ├── 005_create_hazard_events.sql

│   │   ├── 006_create_functions.sql            # generate_hazard_id, next_progress_number

│   │   └── 007_enable_rls.sql

│   └── seed.sql                                # Sample student IDs

│

├── turbo.json

├── package.json                                # Workspace root

├── .env.local.example

├── .gitignore

└── [README.md](http://README.md)

Wait for approval before generating code.