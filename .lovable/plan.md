

# Home Page Monument Cards Redesign with Advanced Animations

## Overview
Apply the same premium animated card design (3D tilt, glowing corners, scan lines, particles, hover effects) from the AR Experience section to the monument cards on the Home Page. All existing functionality (Listen, Facts, category badges, distance info) will be preserved -- only the visual presentation gets upgraded.

## What Changes

### 1. Redesigned Monument Cards in `src/components/DatabaseMonuments.tsx`
Each monument card will get:
- **3D tilt-on-hover effect**: Card rotates based on mouse position using `onMouseMove` to calculate `rotateX`/`rotateY` transforms
- **Glowing corner accents**: Animated corner brackets that light up on hover (using the primary/accent color palette)
- **Scan line animation**: A subtle sweeping light that moves vertically across the card
- **Hover scale**: Gentle `scale(1.05)` with smooth cubic-bezier transition
- **Glassmorphic overlay**: Gradient overlay on the image that shifts on hover
- **Card glare effect**: A glossy sheen that appears on hover
- **Preserved functionality**: Listen/Stop button, Facts/Hide button, summary section, category badges, distance info, featured badge -- all remain exactly as they are

### 2. New CSS Animations in `src/index.css`
Add keyframes (if not already present from AR work):
- `scanMove` -- vertical scanning light sweep
- `shimmer` -- subtle glare animation
- `glowPulse` -- pulsing glow on corner elements
- Custom utility classes for the card effects

### 3. Scrolling Carousel for Category Sections
Each category group (Temples, Beaches, Forts, etc.) will display monuments in a **horizontal auto-scrolling carousel** (similar to the rotating effect you shared):
- Shows 6 cards per visible row on desktop, 2 on mobile
- Smooth infinite scroll animation using CSS `translateX` keyframes
- Alternating scroll directions per category (left-to-right, then right-to-left)
- Pause on hover so users can interact with cards
- Manual scroll with drag support via Embla Carousel (already installed)

### 4. Hero Section Enhancements
- Add floating particle dots behind the hero text
- Subtle parallax-like fade on the feature cards at the bottom

## Technical Details

### 3D Tilt Implementation
Uses `onMouseMove` on a wrapper div to calculate the mouse position relative to the card center, then applies `rotateX` and `rotateY` via inline `transform` style. Resets on `onMouseLeave`. Disabled on touch devices via media query `@media (hover: hover)`.

### Color Adaptation
The AR cards used a dark theme (#1b233d). For the home page, the effects will adapt to the existing light/dark theme:
- Light mode: Soft orange/amber glows matching the primary color
- Dark mode: More visible glowing effects with primary color accents
- Corner elements use `hsl(var(--primary))` instead of hardcoded colors

### Performance
- All animations use `transform` and `opacity` only (GPU-accelerated)
- `will-change: transform` on cards during hover
- Lazy loading images preserved
- Carousel uses CSS animations, no JS frame loops
- IntersectionObserver for staggered fade-in as cards scroll into view

### Files Modified
- `src/components/DatabaseMonuments.tsx` -- Redesigned card markup with 3D tilt, glowing corners, scan line, and carousel wrapper per category
- `src/index.css` -- Add new keyframe animations and utility classes
- `src/pages/Index.tsx` -- No changes needed (already renders DatabaseMonuments)

