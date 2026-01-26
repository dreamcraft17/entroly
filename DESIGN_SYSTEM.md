# LinkHub Design System

## Color Palette (From Company Logo)

### Brand Colors
```css
--color-primary: #00F2EA;          /* Cyan - Main brand color */
--color-primary-light: #69F4EE;    /* Light cyan for hover states */
--color-primary-dark: #00D9D2;     /* Dark cyan for active states */

--color-secondary: #C026D3;        /* Purple/Magenta - Secondary brand */
--color-secondary-light: #D946EF;  /* Light purple */
--color-secondary-dark: #A21CAF;   /* Dark purple */

--color-accent: #1E3A8A;           /* Navy Blue - Accent color */
--color-accent-light: #3B82F6;     /* Light blue */
--color-accent-dark: #1E40AF;      /* Dark navy */
```

### Neutral Colors
```css
--color-bg-base: #FFFFFF;          /* Base background */
--color-bg-secondary: #F8F9FF;     /* Secondary background */
--color-bg-tertiary: #F0F1F7;      /* Tertiary background */

--color-text-primary: #1A1A2E;     /* Primary text */
--color-text-secondary: #6B7280;   /* Secondary text */
--color-text-tertiary: #9CA3AF;    /* Tertiary text / placeholders */

--color-border: #E5E7EB;           /* Default borders */
--color-border-light: #F3F4F6;     /* Light borders */
```

### Semantic Colors
```css
--color-success: #10B981;          /* Success states */
--color-warning: #F59E0B;          /* Warning states */
--color-error: #EF4444;            /* Error states */
--color-info: #3B82F6;             /* Info states */
```

## Typography

### Font Family
```css
--font-sans: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
--font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

## Usage Guidelines

### Using CSS Variables

**In inline styles:**
```tsx
<div style={{color: 'var(--color-primary)'}}>Text</div>
<div style={{background: 'var(--color-bg-secondary)'}}>Background</div>
```

**For gradients:**
```tsx
<div style={{
  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
}}>
  Gradient
</div>
```

**With color-mix for transparency:**
```tsx
<div style={{
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
}}>
  Semi-transparent
</div>
```

### Helper Classes

**Gradient Text:**
```tsx
<span className="gradient-text">Colorful Text</span>
```

**Vibrant Button:**
```tsx
<button className="btn-vibrant">Click Me</button>
```

**Animations:**
```tsx
<div className="animate-float">Floating Element</div>
<div className="animate-pulse-glow">Pulsing Glow</div>
```

## Component Patterns

### Cards
```tsx
<Card style={{
  borderColor: 'var(--color-border-light)',
  color: 'var(--color-text-primary)'
}}>
  Card content
</Card>
```

### Buttons
Default button uses:
- Primary gradient: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
- Secondary gradient: `linear-gradient(135deg, var(--color-secondary), var(--color-accent))`
- Focus ring: `var(--color-primary)`

### Inputs
All form inputs use:
- Border: `var(--color-border)`
- Text: `var(--color-text-primary)`
- Placeholder: `var(--color-text-tertiary)`
- Focus ring: `var(--color-primary)`

## Benefits of CSS Variables

1. **Consistency**: All components use the same color values from a single source
2. **Maintainability**: Change colors in one place (`globals.css`)
3. **Theme switching**: Easy to implement dark mode or multiple themes
4. **Dynamic updates**: Colors can be changed at runtime via JavaScript
5. **Better organization**: Semantic naming makes code more readable

## Migration Complete ✅

All core components have been converted to use CSS variables:
- ✅ Button component
- ✅ Input component
- ✅ Label component
- ✅ Card component
- ✅ Textarea component
- ✅ Homepage
- ✅ Login page
- ✅ Register page
- ✅ Dashboard (main UI elements)

## Future Enhancements

Consider adding:
- Dark mode variables
- Additional semantic colors (destructive, muted, etc.)
- Spacing scale variables
- Border radius variables
- Shadow scale variables
