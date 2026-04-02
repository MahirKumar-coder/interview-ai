# Design System Documentation: High-End Editorial AI Experience

## 1. Overview & Creative North Star

### The Creative North Star: "The Cognitive Atelier"
This design system moves away from the generic "SaaS Dashboard" aesthetic and enters the realm of a high-end editorial workspace. It is designed to feel like a bespoke digital studio—an **Atelier**—where AI serves as a silent, sophisticated partner. We achieve this through "Organic Brutalism": the strength of deep, dark charcoal foundations paired with the softness of lavender accents and hyper-intentional typography.

To break the "template" look, we prioritize **intentional asymmetry**. Layouts should not always be perfectly centered or boxed; use generous whitespace (`spacing-20` and `spacing-24`) to let elements breathe. Overlap components slightly using z-index layering to create a sense of physical space and "curated" depth.

---

## 2. Colors

Our palette is rooted in a sophisticated dark theme that avoids pure blacks in favor of deep, layered charcoals, creating a canvas that feels infinite and premium.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` (`#131313`) card should sit on a `surface` (`#0e0e0e`) background to create a visible but soft edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers.
- **Base Layer:** `surface` (#0e0e0e)
- **Primary Containers:** `surface-container` (#1a1a1a)
- **Floating Elements/Cards:** `surface-container-high` (#20201f)
- **Active/Prominent States:** `surface-container-highest` (#262626)

### The "Glass & Gradient" Rule
To inject "soul" into the interface:
- **Glassmorphism:** For floating modals or navigation bars, use semi-transparent versions of `surface-variant` with a `backdrop-blur` of 20px–40px.
- **Signature Gradients:** The primary action button should not be a flat color. Use a subtle linear gradient from `primary` (#ff8c95) to `primary-container` (#ff7482) at a 135-degree angle to provide a luminous, high-end finish.

---

## 3. Typography

The typographic system relies on the interplay between **Manrope** (Display/Headlines) and **Inter** (Body/Labels).

* **Manrope (The Voice):** Used for `display` and `headline` scales. Its geometric yet warm proportions convey a "Modern Professional" tone. Use `display-lg` (3.5rem) for hero statements to create editorial impact.
* **Inter (The Engine):** Used for `title`, `body`, and `label` scales. Inter provides the clinical precision required for an AI tool.
* **Visual Hierarchy:** Establish dominance by pairing a `headline-lg` in Manrope with a `body-md` in Inter. Ensure `on-surface-variant` (#adaaaa) is used for secondary text to keep the focus on the primary message.

---

## 4. Elevation & Depth

We eschew traditional structural lines for **Tonal Layering**.

* **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#000000) text area placed inside a `surface-container` (#1a1a1a) panel creates a natural recession that guides the eye without needing a border.
* **Ambient Shadows:** When an element must "float" (e.g., a candidate profile card), use an extra-diffused shadow.
* *Spec:* `0px 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like ambient light occlusion, not a drop shadow.
* **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (#484847) token at **15% opacity**. Never use 100% opaque borders.
* **Softening the Edge:** Always apply the `md` (0.75rem) or `lg` (1rem) roundedness tokens. Sharp corners are forbidden as they conflict with the "soft minimalism" of the AI experience.

---

## 5. Components

### Buttons
- **Primary:** Gradient from `primary` to `primary-container`. Typography: `title-sm` (Inter), Uppercase or Sentence case. No borders.
- **Secondary:** Surface-tinted. Use `secondary` (#a88cfb) text on a `secondary-container` (#4f319c) background.
- **Tertiary:** Transparent background with `on-surface` text and a subtle `on-surface-variant` hover state.

### Input Fields & Text Areas
- **Styling:** Use `surface-container-highest` (#262626) for the field background.
- **Focus State:** Transition the background to `surface-bright` (#2c2c2c) and add a `primary` (#ff8c95) ghost border (20% opacity).
- **Forbid:** Do not use bottom-only borders or heavy outlines.

### Cards & Lists
- **The Divider Ban:** Never use line dividers. Separate list items using `spacing-2` (0.7rem) of vertical whitespace or by alternating background tones between `surface-container-low` and `surface-container`.
- **Interviewer Chips:** Use `secondary-container` (#4f319c) for the background with `on-secondary-container` (#d7c8ff) for the text to denote AI-generated tags or skills.

### AI Progress/Status
- Use a "breathing" animation on the `primary` color for AI processing states. The glow should be an outer spread of the `primary_dim` token.

---

## 6. Do's and Don'ts

### Do
* **Do** use `spacing-16` (5.5rem) or `spacing-20` (7rem) for page margins to create an "Editorial" feel.
* **Do** use `tertiary` (#e0ecff) for subtle informational callouts; it provides a cooling contrast to the warm primary pink.
* **Do** apply `rounded-xl` (1.5rem) to large container elements to maintain the "Soft Minimalism" aesthetic.

### Don't
* **Don't** use pure white (#ffffff) for large blocks of text; use `on-surface` for primary headings and `on-surface-variant` for long-form body text to reduce eye strain in the dark theme.
* **Don't** use standard "Success Green." For positive states, use a sophisticated slate-blue or lavender from the `secondary` scale to maintain the palette's integrity.
* **Don't** use a shadow on every card. Only use shadows for elements that are "actively floating" or "modal" in the user flow.