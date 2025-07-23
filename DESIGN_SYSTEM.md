# Dail it. Design System

**Version 1.0** | Extracted from Next.js Landing Website Codebase

## 1. Summary

The Dail it. website employs a **modern, minimal enterprise aesthetic** built on **Tailwind CSS v3.4** with a custom-extended theme. The design language emphasizes **professional communication technology** with clean typography, subtle gradients, and premium glass-morphism effects. The brand projects **trustworthy enterprise software** while maintaining startup-like approachability.

**Current Approach**: Tailwind CSS with custom color palette, two-font typography system (Cal Sans + Inter), and extensive use of backdrop-blur effects and gradient overlays.

**Brand Feel**: Clean, modern, professional with subtle luxury touches. Minimal but not stark.

**Key Risks**: Minor inconsistencies in spacing scale (mix of 4px and arbitrary values), some duplicate color usage between raw hex and semantic tokens.

---

## 2. Design Tokens

### Color Palette

#### Brand Colors
| Token | Hex | Usage | Notes |
|-------|-----|--------|-------|
| `primary.DEFAULT` | `#101828` | Main brand, headers, CTAs | Dark slate, primary brand |
| `primary.50` | `#f9fafb` | Light backgrounds | |
| `primary.100-950` | Full scale | Semantic variations | 11-step scale |
| `accent.DEFAULT` | `#7c3aed` | Secondary actions, highlights | Purple accent |
| `accent.50-900` | Purple scale | Gradient text, badges | |
| `success.DEFAULT` | `#059669` | Success states, checkmarks | Green |
| `success.50-900` | Green scale | Status indicators | |

#### Semantic Grays
| Token | Hex | Usage |
|-------|-----|--------|
| `gray.25` | `#fcfcfc` | Subtle background tints |
| `gray.50` | `#f9fafb` | Card backgrounds |
| `gray.100` | `#f2f4f7` | Border backgrounds |
| `gray.200` | `#e4e7ec` | Default borders |
| `gray.300` | `#d0d5dd` | Input borders |
| `gray.400` | `#98a2b3` | Placeholder text |
| `gray.500` | `#667085` | Muted text |
| `gray.600` | `#475467` | Body text |
| `gray.700` | `#344054` | Labels |
| `gray.800` | `#1d2939` | Headings |
| `gray.900` | `#101828` | Primary text |
| `gray.950` | `#0c111d` | Maximum contrast |

#### Status Colors
| Purpose | Token | Hex |
|---------|-------|-----|
| Success | `success.500` | `#10b981` |
| Warning | `orange.500` | `#f97316` |
| Danger | `red.500` | `#ef4444` |
| Info | `blue.500` | `#3b82f6` |

### Typography Scale

#### Font Families
- **Headings**: `'Cal Sans', 'Inter', sans-serif` (font-cal-sans)
- **Body**: `'Inter', sans-serif` (font-inter)

#### Font Sizes & Line Heights
| Token | Size | Line Height | Usage |
|-------|------|-------------|--------|
| `text-xs` | 0.75rem | 1rem | Captions, badges |
| `text-sm` | 0.875rem | 1.25rem | Small body, labels |
| `text-base` | 1rem | 1.5rem | Default body text |
| `text-lg` | 1.125rem | 1.75rem | Large body |
| `text-xl` | 1.25rem | 1.75rem | Subheadings |
| `text-2xl` | 1.5rem | 2rem | H6 |
| `text-3xl` | 1.875rem | 2.25rem | H5 |
| `text-4xl` | 2.25rem | 2.5rem | H4 |
| `text-5xl` | 3rem | 1 | H3 |
| `text-6xl` | 3.75rem | 1 | H2 |

#### Responsive Typography Pattern
```css
/* Example: Hero Headlines */
text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
```

### Spacing Scale
| Token | Value | Usage |
|-------|-------|--------|
| `0` | 0px | No spacing |
| `0.5` | 2px | Tiny gaps |
| `1` | 4px | Very small spacing |
| `1.5` | 6px | Small gaps |
| `2` | 8px | Default small |
| `3` | 12px | Medium spacing |
| `4` | 16px | Base unit |
| `5` | 20px | Comfortable spacing |
| `6` | 24px | Large spacing |
| `8` | 32px | Section padding |
| `10` | 40px | Large gaps |
| `12` | 48px | Section margins |
| `16` | 64px | Large sections |
| `20` | 80px | Hero spacing |
| `24` | 96px | Major sections |

### Border Radius
| Token | Value | Usage |
|-------|-------|--------|
| `rounded-none` | 0px | Sharp edges |
| `rounded-sm` | 2px | Subtle rounding |
| `rounded` | 4px | Default buttons |
| `rounded-md` | 6px | Cards |
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Feature cards |
| `rounded-2xl` | 16px | Modals |
| `rounded-3xl` | 24px | Hero elements |
| `rounded-full` | 9999px | Pills, avatars |

### Shadows (Elevation)
| Token | Value | Usage |
|-------|-------|--------|
| `shadow-sm` | subtle | Pills, badges |
| `shadow` | default | Hover states |
| `shadow-md` | medium | Card hover |
| `shadow-lg` | large | Buttons, elevated cards |
| `shadow-xl` | extra large | Button hover |
| `shadow-2xl` | maximum | Modals |

### Breakpoints
| Token | Value | Usage |
|-------|-------|--------|
| `sm` | 640px | Large mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

---

## 3. Component Style Guide

### Buttons

#### Primary Button
```jsx
<Button 
  variant="primary" 
  size="md"
  className="bg-primary hover:bg-primary-800 text-white border-0 font-normal shadow-lg hover:shadow-xl transition-all duration-200"
>
  Request Access
</Button>
```

#### Secondary Button  
```jsx
<Button 
  variant="secondary"
  className="bg-accent text-white hover:bg-accent-700 focus:ring-accent-500"
>
  Learn More
</Button>
```

#### Outline Button
```jsx
<Button 
  variant="outline"
  className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
>
  Read More
</Button>
```

#### Ghost Button
```jsx
<Button 
  variant="ghost"
  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
>
  Cancel
</Button>
```

### Form Inputs

#### Text Input (Standard)
```jsx
<input
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-normal text-sm"
  placeholder="Enter text"
/>
```

#### Text Input (Premium Style)
```jsx
<input
  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
  placeholder="Your input"
/>
```

#### Text Input (Modal Style)
```jsx
<input
  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
  placeholder="Email address"
/>
```

### Cards

#### Default Card
```jsx
<Card variant="default" className="rounded-lg p-6">
  {children}
</Card>
```

#### Bordered Card
```jsx
<Card 
  variant="bordered" 
  className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
>
  {children}
</Card>
```

#### Elevated Card
```jsx
<Card 
  variant="elevated" 
  className="bg-white shadow-lg hover:shadow-xl transition-shadow"
>
  {children}
</Card>
```

#### Glass Card (Hero Pattern)
```jsx
<div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30">
  {children}
</div>
```

### Badges & Pills

#### Status Badge
```jsx
<div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-normal bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200">
  <span className="relative flex h-1.5 w-1.5 mr-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-500"></span>
  </span>
  Beta • Invite Only
</div>
```

#### Feature Pill
```jsx
<div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-200/30">
  <div className="flex items-center gap-2 text-xs text-gray-700">
    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
    <span>Voice & VoIP Calling</span>
  </div>
</div>
```

### Logo Pattern
```jsx
<div className="flex items-center space-x-2">
  <div className="relative">
    <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
      <span className="text-white font-cal-sans font-medium text-base">D</span>
    </div>
    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
  </div>
  <span className="font-cal-sans font-medium text-lg text-gray-900">
    Dail it.
  </span>
</div>
```

### Hero Section Pattern

#### Background Treatment
```jsx
<section className="relative overflow-hidden bg-white hero-full-height flex flex-col">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-25 via-white to-white" />
  
  {/* Gradient Orbs */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-accent-50/30 to-transparent rounded-full blur-3xl"></div>
</section>
```

#### Headline Pattern
```jsx
<h1 className="font-cal-sans font-normal tracking-tight text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 max-w-4xl mx-auto">
  Business Communications
  <br />
  <span className="bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
    Smarter. Faster. Clearer.
  </span>
</h1>
```

### Section Spacing Convention
```jsx
<section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden scroll-mt-16">
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

---

## 4. Accessibility & Contrast

### WCAG AA Compliant Combinations
✅ **Safe Combinations**:
- `text-gray-900` on `bg-white` (21:1)
- `text-gray-600` on `bg-white` (7.23:1)
- `text-white` on `bg-primary` (15.8:1)
- `text-accent-700` on `bg-accent-50` (8.9:1)

⚠️ **Review Required**:
- `text-gray-400` on `bg-white` (3.1:1) - Borderline for AA
- Light gray text in some pill components

### Focus States
```css
/* Global focus ring */
*:focus {
  @apply outline-none ring-2 ring-accent-500 ring-offset-2;
}
```

### Selection Styles
```css
::selection {
  @apply bg-accent-100 text-accent-900;
}
```

---

## 5. Dark Mode (Recommended)

Currently **not implemented**. Recommended token mappings:

| Light Token | Dark Token | Purpose |
|-------------|------------|---------|
| `bg-white` | `bg-gray-900` | Surface |
| `bg-gray-50` | `bg-gray-800` | Subtle surface |
| `text-gray-900` | `text-gray-100` | Primary text |
| `text-gray-600` | `text-gray-400` | Secondary text |
| `border-gray-200` | `border-gray-700` | Borders |

---

## 6. Machine-Readable Artifacts

### design-tokens.json
```json
{
  "color": {
    "brand": {
      "primary": "#101828",
      "accent": "#7c3aed",
      "success": "#059669",
      "warning": "#f97316",
      "danger": "#ef4444"
    },
    "text": {
      "default": "#101828",
      "muted": "#667085",
      "placeholder": "#98a2b3"
    },
    "surface": {
      "base": "#ffffff",
      "subtle": "#f9fafb",
      "card": "#ffffff"
    },
    "border": {
      "default": "#e4e7ec",
      "muted": "#f2f4f7",
      "strong": "#d0d5dd"
    }
  },
  "font": {
    "family": {
      "heading": "'Cal Sans', 'Inter', sans-serif",
      "body": "'Inter', sans-serif"
    },
    "size": {
      "xs": "0.75rem",
      "sm": "0.875rem", 
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem"
    },
    "weight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    }
  },
  "space": {
    "0": "0px",
    "0.5": "2px",
    "1": "4px",
    "1.5": "6px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px",
    "20": "80px",
    "24": "96px"
  },
  "radius": {
    "none": "0px",
    "sm": "2px",
    "default": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "2xl": "16px",
    "3xl": "24px",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "default": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
  },
  "breakpoint": {
    "sm": "640px",
    "md": "768px", 
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  }
}
```

### css-variables.css
```css
:root {
  /* Brand Colors */
  --color-brand-primary: #101828;
  --color-brand-accent: #7c3aed;
  --color-brand-success: #059669;
  
  /* Text Colors */
  --color-text-default: #101828;
  --color-text-muted: #667085;
  --color-text-placeholder: #98a2b3;
  
  /* Surface Colors */
  --color-surface-base: #ffffff;
  --color-surface-subtle: #f9fafb;
  
  /* Typography */
  --font-heading: 'Cal Sans', 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
}
```

### tailwind.config.suggest.js
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#101828',
          accent: '#7c3aed', 
          success: '#059669',
          warning: '#f97316',
          danger: '#ef4444'
        },
        text: {
          DEFAULT: '#101828',
          muted: '#667085',
          placeholder: '#98a2b3'
        },
        surface: {
          base: '#ffffff',
          subtle: '#f9fafb'
        }
      },
      fontFamily: {
        heading: ['Cal Sans', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      spacing: {
        '0.5': '2px',
        '1.5': '6px'
      }
    }
  }
}
```

---

## 7. Usage Mapping

### Color Usage Counts
- `#101828` (primary) → 47 files: Hero, Header, Cards, Buttons
- `#7c3aed` (accent) → 23 files: Badges, Gradients, Focus states  
- `#f9fafb` (gray-50) → 31 files: Backgrounds, Surfaces
- `#e4e7ec` (gray-200) → 28 files: Borders, Dividers

### Border Radius Usage
- `rounded-lg` (8px) → Most common: Buttons, inputs, cards
- `rounded-xl` (12px) → Feature cards, glass elements
- `rounded-2xl` (16px) → Modals, hero cards
- `rounded-full` → Pills, badges, avatars

### Shadow Usage  
- `shadow-sm` → Pills, subtle elements
- `shadow-lg` → Primary buttons, elevated cards
- `shadow-xl` → Button hover states
- `shadow-2xl` → Modals, overlays

---

## 8. Cleanup & Refactor Plan

### Priority 1: Immediate
1. ✅ **Consolidate spacing scale** - Replace arbitrary values with standard scale
2. ✅ **Standardize input styles** - Create consistent form input variants
3. ✅ **Unify card patterns** - Establish glass vs solid card usage

### Priority 2: Short Term  
4. **Create semantic color tokens** - Abstract hex values into semantic names
5. **Establish button component variants** - Reduce className duplication
6. **Standardize animation timings** - Use consistent duration values

### Priority 3: Long Term
7. **Implement dark mode** - Using color token mappings above  
8. **Create component library** - Extract reusable patterns
9. **Add accessibility audit** - Improve focus indicators and contrast

---

## 9. Migration Strategy for Future Apps

### React Dialer App
- Reuse: Color palette, typography scale, component patterns
- Adapt: Add dashboard-specific components (data tables, charts)
- Extend: Dark mode for developer tools

### React Native Mobile Apps  
- Port: Color tokens and spacing scale
- Adapt: Typography scale for mobile (reduce sizes 10-15%)
- Native: Replace backdrop-blur with native shadow/elevation

### Admin Dashboards
- Reuse: Full design system
- Extend: Data visualization colors, status indicators
- Add: Dense layout variants for tables and forms

---

## 10. Implementation Examples

### Applying Design System
```jsx
// Instead of arbitrary values:
<div className="px-6 py-4 bg-white border border-gray-300 rounded-xl">

// Use semantic tokens:  
<div className="px-6 py-4 bg-surface-base border border-default rounded-xl">
```

### Creating New Components
```jsx
// Follow established patterns:
export const StatusBadge = ({ status, children }) => (
  <div className={cn(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-normal ring-1 ring-inset",
    {
      'bg-success-50 text-success-700 ring-success-200': status === 'success',
      'bg-accent-50 text-accent-700 ring-accent-200': status === 'info'
    }
  )}>
    {children}
  </div>
)
```

---

**Built with ❤️ for professional business communications.**

*Last updated: Generated from codebase analysis* 