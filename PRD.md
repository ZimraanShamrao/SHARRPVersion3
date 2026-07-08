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

Ex: HZ-0001_Resolution1.jpg, HZ-0001_Progress2.jpg

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

Wait for approval before generating code.