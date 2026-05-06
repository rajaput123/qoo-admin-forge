

## Temple Website Builder — PR & Communication Module

### What We're Building

A **Temple Website** sub-module inside PR & Communication that generates a public-facing temple website. The admin can configure and preview the website from within the dashboard. The website uses temple profile data (name, deity, timings, location, etc.) to auto-generate pages.

### New Sidebar Item

Add "Temple Website" to `CommunicationLayout.tsx` nav items with a `Globe` icon, route: `/temple/communication/website`.

### Website Builder Page

**`src/pages/temple/communication/TempleWebsite.tsx`** — A tabbed interface with:

1. **Preview Tab** — Live preview of the generated temple website rendered in an iframe-style container. Sections include:
   - Hero banner with temple name, deity, and tagline
   - About section (description, history, established year)
   - Darshan Timings / Seva schedule
   - Photo gallery placeholder
   - Location & map section
   - Contact information
   - Footer with social links

2. **Customize Tab** — Controls to configure the website:
   - Theme color picker (saffron, maroon, gold, teal presets)
   - Toggle sections on/off (About, Timings, Gallery, Donations, Contact)
   - Edit hero tagline and welcome message
   - Upload banner image placeholder
   - Font style selection (Traditional / Modern)

3. **Pages Tab** — Manage website pages:
   - Home (default, always on)
   - About Temple
   - Sevas & Offerings
   - Donations
   - Events
   - Contact Us
   - Toggle each page on/off

4. **Publish Tab** — Domain & publish controls:
   - Auto-generated subdomain preview (e.g., `sri-venkateswara.temple.app`)
   - Custom domain input
   - Publish / Unpublish toggle
   - Last published timestamp

### Temple Website Preview Component

**`src/components/communication/TempleWebsitePreview.tsx`** — A self-contained React component that renders a realistic temple website preview using the temple's dummy data from `TempleProfile.tsx`. Sections rendered as a scrollable mini-site with:
- Saffron/gold gradient hero
- Deity info cards
- Timings grid
- Location card
- Contact footer

### Route Addition

In `App.tsx`, add route under `/temple/communication`:
```
<Route path="website" element={<TempleWebsite />} />
```

### Technical Notes

- All data is pulled from hardcoded temple profile data (matching `TempleProfile.tsx` defaults)
- Website preview is a styled React component, not an actual deployed site
- Theme customization uses state to swap Tailwind classes in the preview
- Follows existing patterns: glass-card styling, motion animations, tabs UI

