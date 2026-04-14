---
name: ehb-frontend-builder
description: Build Next.js 14 App Router pages and components for EHB Technologies with TypeScript, Tailwind, and glassmorphism design
---

# EHB Frontend Builder

Build responsive, premium Next.js 14 frontend pages and React components for the EHB super-app platform.

## CRITICAL: Design System First

**MANDATORY BEFORE ANY UI CODE:**

1. Read `design-system/EHB-UIUX-SYSTEM.md` top-to-bottom
2. Read `design-system/ai-behavior.md` (§2 auto-upgrade rule)
3. Check component roadmap (§15 of design system)
4. Verify design token colors match exactly (no hardcoding)
5. Only then design and code

**Mindset check:** "If Apple, Stripe, or Tesla's product designers saw this screen, would they sign it? If no — rebuild."

## Design Tokens (from EHB-UIUX-SYSTEM.md)

**Background & Cards:**
```
Background:      #0C0E1A
Card:            #13162A (border: rgba(255,255,255,0.08))
Nested Card:     #1A1D33
Divider:         rgba(255,255,255,0.07)
```

**Colors:**
- Purple: `#7B6EF6` | Light: `#A098F8`
- Teal: `#2BBFA0`
- Amber: `#F0A030`
- Red: `#F05858`
- Green: `#38C878`

**Typography:**
- Font: `DM Sans` (system sans-serif fallback)
- Weights: 400, 500, 600, 700

**Spacing & Radius:**
- Cards: rounded-xl (12px)
- Inputs/Buttons: rounded-lg (8px)
- Chips: rounded-[6px] (5-6px)
- No `rounded-full` except avatars/dots

**Borders:**
- Card borders: `1px solid rgba(255,255,255,0.08)`
- Dividers: `1px solid rgba(255,255,255,0.07)`

## Tailwind Classes (EHB Custom)

```tsx
// Backgrounds
bg-ehb-dark           // #0C0E1A
bg-ehb-card           // #13162A
bg-ehb-nested         // #1A1D33

// Borders
border-white/8        // rgba(255,255,255,0.08)
border-white/7        // rgba(255,255,255,0.07)

// Colors
text-ehb-purple       // #7B6EF6
text-ehb-purple-light // #A098F8
text-ehb-teal         // #2BBFA0
text-ehb-amber        // #F0A030
text-ehb-red          // #F05858
text-ehb-green        // #38C878

// Glassmorphism (backdrop blur + transparency)
backdrop-blur-md bg-white/5 border border-white/8

// Shadows
shadow-lg drop-shadow-lg
```

## File Structure & Naming

```
apps/web/
├── app/
│   ├── layout.tsx              Root layout (RootLayout)
│   └── <feature>/
│       ├── page.tsx            Feature page
│       └── layout.tsx           Feature layout (optional)
├── components/
│   ├── ui/                     Reusable UI (card, button, input, etc.)
│   ├── <feature>/              Feature components
│   │   ├── FeatureHeader.tsx
│   │   ├── FeatureList.tsx
│   │   └── FeatureDetailModal.tsx
│   └── common/                 Shared across features
│       ├── Navigation.tsx
│       ├── Footer.tsx
│       └── ErrorBoundary.tsx
└── lib/
    ├── api.ts                  API client with JWT
    ├── utils.ts                Utility functions
    └── hooks.ts                Custom hooks
```

**Naming rules:**
- Files: `lowercase-with-dashes.ts` for utilities, `PascalCase.tsx` for React components
- Components: `FeatureName.tsx` (PascalCase), never duplicate Card.tsx across folders
- Pages: `page.tsx` (lowercase, Next.js convention)
- Hooks: `useFeatureName.ts` or `useFeatureName.tsx`

## Page Template (App Router)

```tsx
// apps/web/app/feature/page.tsx
import { Metadata } from "next";
import { FeatureHeader } from "@/components/feature/FeatureHeader";
import { FeatureList } from "@/components/feature/FeatureList";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Feature | EHB",
  description: "Feature description for SEO",
};

export default function FeaturePage() {
  return (
    <div className="min-h-screen bg-ehb-dark">
      {/* Container with max-width + padding */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FeatureHeader />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureList />
        </div>
      </div>
    </div>
  );
}
```

## Component Template (Functional + Hooks)

```tsx
// apps/web/components/feature/FeatureCard.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  onSelect?: (id: string) => void;
}

export function FeatureCard({
  id,
  title,
  description,
  icon,
  onSelect,
}: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-all hover:border-white/12 hover:bg-ehb-nested"
      onClick={() => {
        setIsExpanded(!isExpanded);
        onSelect?.(id);
      }}
    >
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="flex items-start gap-3">
          {icon && <div className="mt-1 text-ehb-purple">{icon}</div>}
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/60">{description}</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-white/40 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <div className="border-t border-white/8 p-4 text-sm text-white/70">
          {/* Expanded content */}
        </div>
      )}
    </Card>
  );
}
```

## Styling Rules (Glassmorphism)

**Dark card with subtle border:**
```tsx
className="
  bg-ehb-card 
  border border-white/8 
  rounded-xl 
  backdrop-blur-sm
  transition-all duration-200
  hover:border-white/12
  hover:bg-ehb-nested
"
```

**Button styles:**
```tsx
// Primary (purple)
className="
  bg-ehb-purple 
  text-white 
  px-4 py-2 
  rounded-lg 
  font-medium 
  transition-all 
  hover:bg-ehb-purple-light 
  active:scale-95
"

// Secondary (outline)
className="
  border border-white/8 
  text-white 
  px-4 py-2 
  rounded-lg 
  font-medium 
  transition-all 
  hover:bg-white/5 
  hover:border-white/12
"
```

**Input fields:**
```tsx
className="
  w-full 
  bg-ehb-dark 
  border border-white/8 
  rounded-lg 
  px-4 py-2 
  text-white 
  placeholder-white/40 
  transition-all 
  focus:border-white/12 
  focus:bg-ehb-nested 
  focus:outline-none 
  focus:ring-1 
  focus:ring-ehb-purple/30
"
```

## Form Handling (Zod + react-hook-form)

```tsx
// lib/schemas.ts
import { z } from "zod";

export const featureFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["active", "inactive"]),
});

export type FeatureFormInput = z.infer<typeof featureFormSchema>;
```

```tsx
// components/feature/FeatureForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { featureFormSchema, FeatureFormInput } from "@/lib/schemas";
import { Card } from "@/components/ui/card";

export function FeatureForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = 
    useForm<FeatureFormInput>({
      resolver: zodResolver(featureFormSchema),
    });

  const onSubmit = async (data: FeatureFormInput) => {
    try {
      const response = await fetch("/api/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Handle response
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card className="max-w-md p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Name</label>
          <input
            {...register("name")}
            className="mt-2 w-full bg-ehb-dark border border-white/8 rounded-lg px-4 py-2 text-white focus:border-white/12 focus:outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-ehb-red">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-ehb-purple text-white font-medium py-2 rounded-lg hover:bg-ehb-purple-light disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </Card>
  );
}
```

## API Connection Pattern

```tsx
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("token") 
    : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}
```

```tsx
// Usage in component
"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";

export function FeatureList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await apiCall("/feature/list");
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (items.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <FeatureCard key={item.id} {...item} />
      ))}
    </div>
  );
}
```

## Loading / Error / Empty States

```tsx
// Loading skeleton
export function FeatureCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
    </Card>
  );
}

// Loading state (page-level)
function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <FeatureCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Error state
function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-ehb-red/30 bg-ehb-red/5 p-6 text-center">
      <h3 className="font-semibold text-ehb-red">Something went wrong</h3>
      <p className="mt-2 text-sm text-white/60">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 text-sm font-medium text-ehb-red hover:text-ehb-red/80"
      >
        Try again
      </button>
    </Card>
  );
}

// Empty state
function EmptyState() {
  return (
    <Card className="border-white/8 p-12 text-center">
      <h3 className="font-semibold text-white">No items yet</h3>
      <p className="mt-2 text-sm text-white/60">Create your first item to get started</p>
    </Card>
  );
}
```

## Auto-Upgrade Rule (AI Behavior §2)

**Never ship a "basic" UI.** Even when the prompt asks for "just show X", upgrade it:

- Add color-coded chips/badges
- Include hover/active states
- Add smooth transitions (duration-200)
- Show drill-in drawer or modal
- Include icon + typography hierarchy
- Add empty/loading/error states
- Make card interactive (click → expand, select → highlight)

**Narrate the upgrade in your response** so the decision is auditable.

## Responsive Breakpoints

```tsx
// EHB responsive grid (mobile-first)
className="
  grid 
  gap-4                      // mobile: single column, 4px gap
  md:grid-cols-2             // tablet: 2 columns
  lg:grid-cols-3             // desktop: 3 columns
  lg:gap-6                    // desktop: larger gap
"

// Tailwind breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Container widths:**
```tsx
className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
// mobile: full width - 2rem padding
// desktop: 80rem max-width + responsive padding
```

## State Management Patterns

**React hooks (simple features):**
```tsx
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
```

**useEffect for side effects:**
```tsx
useEffect(() => {
  // Fetch data, set up listeners, etc.
}, [dependency]);
```

**Custom hooks for logic reuse:**
```tsx
// lib/hooks.ts
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      const result = await apiCall<T>(url);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
}
```

**React Context (shared state across components):**
```tsx
// context/FeatureContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FeatureContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <FeatureContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeature() {
  const context = useContext(FeatureContext);
  if (!context) throw new Error("useFeature must be used within FeatureProvider");
  return context;
}
```

## TypeScript Best Practices

**Always define prop interfaces:**
```tsx
interface FeatureProps {
  id: string;
  title: string;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export function Feature({ id, title, isActive = false, onClick }: FeatureProps) {
  // ...
}
```

**Use generics for reusable components:**
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
}

export function List<T extends { id: string }>({
  items,
  renderItem,
  onSelect,
}: ListProps<T>) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} onClick={() => onSelect?.(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
```

## Common UI Components (from @/components/ui/)

Always import from the shared library, never duplicate:

```tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
```

## Auto-Naming Migration

When writing code, auto-apply these renames without being asked:

| Legacy | Current |
|--------|---------|
| `SQL` | `STL` |
| `sqlLevel` | `stlLevel` |
| `EDR` | `CRB` |

Example: If building a STL level dashboard, name it `STLLevelDashboard.tsx`, never `SQLLevelDashboard.tsx`.

## Checklist Before Committing

- [ ] Read design-system files before writing UI
- [ ] All colors use design tokens (#0C0E1A, #13162A, #7B6EF6, etc.)
- [ ] Card borders use `border-white/8` or `border-white/7`
- [ ] Inputs have focus ring: `focus:ring-1 focus:ring-ehb-purple/30`
- [ ] Buttons have hover + active states
- [ ] Loading, error, empty states are handled
- [ ] Responsive layout (mobile-first, md: and lg: breakpoints)
- [ ] TypeScript interfaces for all props
- [ ] No hardcoded strings (use i18n or pass as props)
- [ ] Zod validation for forms
- [ ] API calls use `apiCall()` helper with JWT
- [ ] No duplicate components (check `@/components/ui/`)
- [ ] Component names are PascalCase, files match
- [ ] Accessibility: semantic HTML, ARIA labels where needed
- [ ] Commit message: `feat(web): description` or `fix(web): description`
