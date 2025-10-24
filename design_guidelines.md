# CultureForward Assessment - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from professional assessment platforms with clean, trustworthy aesthetics that prioritize clarity and user confidence. The design should match the provided screenshot's aesthetic - clean, modern, and professional with a focus on readability and user trust.

## Core Design Principles
1. **Trust & Professionalism**: Establish credibility through clean layouts and professional typography
2. **Clarity First**: Assessment questions must be immediately clear and scannable
3. **Progressive Disclosure**: Guide users step-by-step without overwhelming
4. **Responsive Fluidity**: Seamless experience across all devices

---

## Typography

**Font Families:**
- Primary: Inter or System UI stack for body text and UI elements
- Headings: Inter Bold/Semi-Bold for hierarchy

**Scale:**
- Hero/Page Titles: text-4xl to text-5xl, font-bold
- Section Headings: text-2xl to text-3xl, font-semibold
- Question Text: text-lg to text-xl, font-medium (highly readable)
- Body/Labels: text-base, font-normal
- Small/Helper Text: text-sm

**Reading Optimization:**
- Max-width for text content: max-w-3xl
- Line height: leading-relaxed for body text
- Question text should be prominently sized for quick scanning

---

## Layout System

**Spacing Primitives:**
Use Tailwind units: 2, 3, 4, 6, 8, 12, 16, 20, 24, 32

**Container Strategy:**
- Full-width sections: w-full with inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Content containers: max-w-4xl mx-auto for forms and assessments
- Card spacing: p-6 to p-8 for desktop, p-4 to p-6 for mobile

**Vertical Rhythm:**
- Section padding: py-12 to py-20
- Component spacing: space-y-6 to space-y-8
- Tight groupings: space-y-3 to space-y-4

---

## Component Library

### Navigation/Header
- Clean, minimal header with logo and optional navigation
- Sticky positioning on scroll
- Height: h-16 to h-20
- Logo placement: left-aligned
- CTA button: right-aligned if applicable

### User Intake Form
- Single-column layout, max-w-2xl centered
- Form fields with clear labels above inputs
- Input height: h-12
- Rounded corners: rounded-lg
- Focus states with ring indicators
- Consent checkbox: Large, easily tappable checkbox with clear text
- Checkbox text should be text-sm with important terms in font-medium
- Submit button: Full-width on mobile, auto-width on desktop

### Assessment Question Cards
- Card-based layout for each question
- Question number indicator (subtle, top-left)
- Question text: Large, prominent (text-xl to text-2xl)
- Response options: Vertical stack on mobile, can be horizontal on desktop
- Radio button options with labels: Large tap targets (min-h-12)
- Active/selected state clearly indicated
- Progress indicator: Sticky at top showing completion (X of 20 questions)

### Response Scale (5-Point)
- Visual scale representation with clear labels
- Options: "Definitely me" | "Somewhat me" | "Neutral" | "Somewhat not me" | "Definitely not"
- Each option as a button or radio with generous padding (p-4)
- Selected state with distinct visual treatment

### Results Display
- Hero section announcing personality type with large typography
- Personality type badge/card: Prominent, centered
- Score visualization: Clean bar charts or radial progress indicators
- Compatible jobs section: Grid layout (grid-cols-1 md:grid-cols-2)
- Company recommendations: Card-based with logos/names
- Downloadable report button: Prominent CTA

### Progress Indicator
- Thin bar at top of page or step indicator
- Shows current question out of total
- Smooth transitions between questions

### Buttons
- Primary CTA: px-6 py-3, rounded-lg, font-medium
- Secondary: Similar size with border treatment
- Hover states: Subtle transform or opacity change
- Disabled states: Reduced opacity
- Blur backgrounds for buttons on images

### Cards
- Rounded corners: rounded-xl
- Padding: p-6 to p-8
- Subtle shadow or border treatment
- Hover states for interactive cards

---

## Responsive Breakpoints

**Mobile-First Approach:**
- Base (mobile): Single column, full-width cards, stacked elements
- md (768px+): Two-column grids where appropriate, side-by-side form layouts
- lg (1024px+): Multi-column grids, horizontal response options

**Touch Targets:**
- Minimum 44px height for all interactive elements
- Generous spacing between clickable items on mobile

---

## Images

### Hero Section (Landing/Welcome)
- **Large hero image**: Full-width, professional photography
- Image showing diverse professionals in modern workplace or abstract career success imagery
- Overlay with gradient for text readability
- Hero height: min-h-[60vh] to min-h-[80vh]
- Centered text overlay with CTA button (blurred background for button)

### Results Page
- Personality type illustration or icon
- Success/completion imagery to celebrate assessment completion
- Can use background patterns or subtle geometric shapes

### Additional Visual Elements
- Optional: Team/professional stock photos for trust-building sections
- Icons: Use Heroicons for consistency throughout the UI
- Avoid excessive decorative imagery; maintain professional aesthetic

---

## Special Considerations

### Consent Checkbox Design
- Prominent placement before "Start Assessment" button
- Checkbox size: w-5 h-5 minimum
- Text wrapping properly on mobile
- Link styling for "terms" and "privacy policy" if applicable
- Clear visual hierarchy separating consent from other form fields

### Assessment Flow
- Single question per screen for focus and reduced cognitive load
- "Next" and "Previous" navigation buttons
- Save progress indication
- Skip capability (if applicable) clearly marked

### AI Analysis Loading State
- Loading spinner or progress animation while AI analyzes
- Estimated time indicator (e.g., "Analyzing your responses... 10-15 seconds")
- Reassuring messaging about data processing

### Database Status Indicators
- Subtle save confirmation after each question (e.g., "Response saved")
- Error states if save fails with retry option

---

## Accessibility

- All form inputs with associated labels
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient contrast ratios (WCAG AA minimum)
- Focus indicators on all interactive elements
- Screen reader friendly progress announcements
- Keyboard navigation throughout assessment

---

This design framework prioritizes user trust, clarity, and seamless progression through the assessment while matching the professional, clean aesthetic shown in the reference screenshot.