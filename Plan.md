# PROMPT FOR CLAUDE CODE — Indian Rent Receipt Generator Website
# HOSTING: GitHub Pages (Free, No Server, No Infra Cost)

## Project Overview
Build a complete, production-ready **Indian Rent Receipt Generator** website. This is a free utility tool targeted at salaried employees in India who need rent receipts for **HRA (House Rent Allowance) exemption under Section 10(13A) of the Income Tax Act**. The website will be monetized via Google AdSense, so it must meet all AdSense approval requirements.

**CRITICAL HOSTING CONSTRAINT:** This will be hosted on **GitHub Pages** (free). GitHub Pages only serves static files. There is NO server, NO backend, NO database. The tech stack must produce purely static output.

**Tech Stack:**
- **Vite + React 18** with TypeScript (builds to static files)
- **React Router** (with HashRouter for GitHub Pages compatibility)
- **Tailwind CSS** for styling
- **shadcn/ui** components (or manually ported — use Radix UI primitives + Tailwind)
- **jsPDF** for PDF generation (client-side)
- **date-fns** for date manipulation
- Build output goes to `/docs` folder (GitHub Pages serves from `/docs`)

**Why NOT Next.js:** Next.js App Router requires a Node.js server. Even static export has routing issues on GitHub Pages. Vite + React builds to pure static files that work perfectly on GitHub Pages.

---

## PHASE 1: Project Setup

1. Create a Vite + React + TypeScript project:
   ```bash
   npm create vite@latest rent-receipt-india -- --template react-ts
   ```

2. Install dependencies:
   ```bash
   npm install react-router-dom jspdf date-fns lucide-react
   npm install -D tailwindcss @tailwindcss/vite
   ```

3. Configure Vite for GitHub Pages:
   ```ts
   // vite.config.ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     base: '/rent-receipt-india/',  // GitHub repo name
     build: {
       outDir: 'docs',  // GitHub Pages serves from /docs
     }
   })
   ```

4. Use **HashRouter** (not BrowserRouter) because GitHub Pages doesn't support server-side URL rewrites:
   ```tsx
   import { HashRouter } from 'react-router-dom'
   // URLs will be: yoursite.github.io/rent-receipt-india/#/blog/post-1
   ```

5. Folder structure:
```
/src
  /pages
    Home.tsx              → Receipt Generator tool
    About.tsx
    PrivacyPolicy.tsx
    TermsOfService.tsx
    Contact.tsx
    Disclaimer.tsx
    Blog.tsx              → Blog listing
    BlogPost.tsx          → Individual blog post (dynamic by slug)
  /components
    Header.tsx
    Footer.tsx
    RentReceiptForm.tsx
    ReceiptPreview.tsx
    BlogCard.tsx
    FAQSection.tsx
    AdPlaceholder.tsx
    ScrollToTop.tsx       → Scroll to top on route change
    SEOHelmet.tsx         → Meta tags (use react-helmet-async)
  /lib
    generatePDF.ts        → PDF generation logic
    numberToWords.ts      → Indian numbering system converter
    blogData.ts           → All blog posts content
    constants.ts          → Indian states, months, etc.
  /assets
    → any static assets
/public
  /sitemap.xml            → Static sitemap
  /robots.txt
  /og-image.png
/docs                     → Build output (GitHub Pages serves this)
```

---

## PHASE 2: Rent Receipt Generator (Core Feature)

### Form Fields (Single Page, No Login Required)

**Tenant (Employee) Details:**
- Full Name (required)
- PAN Number (optional — needed if annual rent > ₹1,00,000)

**Landlord Details:**
- Full Name (required)
- PAN Number (optional — but mandatory if annual rent exceeds ₹1,00,000 as per IT rules)
- Full Address of Rented Property (required) — textarea with proper formatting

**Rent Details:**
- Monthly Rent Amount in ₹ (required) — number input with Indian currency formatting (commas: 1,50,000)
- "From" Month/Year (required) — month-year picker (e.g., April 2025)
- "To" Month/Year (required) — month-year picker (e.g., March 2026)
- Rent Payment Date — dropdown: "1st of every month", "Last day of every month", "Custom date (1-28)" — this is the date printed on each receipt
- Include Revenue Stamp — checkbox (default: checked). Note: ₹1 revenue stamp is customary for cash rent payments above ₹5,000
- Payment Mode — dropdown: Cash, Bank Transfer / UPI, Cheque

**GST Note (Important — I've already researched this):**
- GST on residential rent: As per GST law, rent on residential property is **exempt from GST** when rented for personal use by a salaried individual. GST (18%) applies only if the tenant is a registered business entity renting for commercial purposes AND the landlord's turnover exceeds ₹20 lakh. For this tool (targeted at salaried individuals), **GST is NOT applicable**. Show a small info tooltip explaining this. Do NOT add a GST field — it will confuse users.

### Receipt Generation Logic

- Generate **one receipt per month** for the selected date range.
- Each receipt should include:
  - Receipt number (auto-generated: `RR-001`, `RR-002`, etc.)
  - Date of payment (based on user's selection)
  - Month & year the rent is for
  - Tenant name & PAN (if provided)
  - Landlord name & PAN (if provided)
  - Rented property address
  - Rent amount in figures AND words (e.g., ₹15,000 — Rupees Fifteen Thousand Only)
  - Payment mode
  - Revenue stamp placeholder (a small box with "₹1 Revenue Stamp" text if selected)
  - Signature line for landlord
  - "Received with thanks" text

### Number to Words Utility
- Build a robust function that converts numbers to Indian English words
- Must handle the Indian numbering system: Lakh (1,00,000), Crore (1,00,00,000)
- Examples:
  - 15000 → "Rupees Fifteen Thousand Only"
  - 150000 → "Rupees One Lakh Fifty Thousand Only"
  - 25500 → "Rupees Twenty Five Thousand Five Hundred Only"

### PDF Generation (A4 Format)

- Use **jsPDF** to generate downloadable PDF.
- Layout: **3 receipts per A4 page** (portrait orientation). Each receipt occupies ~1/3 of the page with a dashed cut-line separator between them.
- Clean, professional formatting — similar to a printed receipt book style.
- Use Helvetica or similar clean font (built into jsPDF).
- Each receipt should have a thin border, proper spacing, and clear sections.
- Amount in words must be auto-calculated.
- Revenue stamp box: small dashed rectangle (approx 2cm x 2cm) with "₹1 Revenue Stamp" text inside.
- Signature line: a horizontal line with "Landlord's Signature" text below it.
- File name format: `Rent_Receipts_[TenantName]_[FromMonth]_to_[ToMonth].pdf`

### Preview Feature

- Before download, show a **live preview** of the receipts on screen.
- Show all generated receipts in a scrollable card layout on the page.
- Each receipt card mirrors the PDF layout visually (use Tailwind to replicate).
- Two prominent buttons: **"Preview Receipts"** (generates preview) → **"Download PDF"** (generates and downloads)
- Also add a **"Print"** button that opens browser print dialog for direct printing.
- Preview renders inline on the page (not a popup/modal) — better for mobile.

---

## PHASE 3: UI/UX Design

### Design Requirements
- **Clean, professional, trustworthy** — financial/tax tool aesthetic. Not flashy, not boring.
- Color scheme:
  - Primary: Deep blue (#1a365d or similar)
  - Background: White (#ffffff) with light gray sections (#f7fafc)
  - Accent/CTA: Green (#38a169) for generate/download buttons
  - Text: Dark gray (#2d3748)
  - Borders/dividers: Light gray (#e2e8f0)
- Typography: Use `next/font` equivalent — load "DM Sans" or "Plus Jakarta Sans" from Google Fonts for a modern, clean look. Use a system font stack as fallback.
- Mobile-first responsive design. The form MUST work perfectly on phones (most Indian users will use mobile).
- Generous whitespace. Clear section headings with subtle dividers.
- Form sections grouped with visual cards/panels:
  - 📋 Tenant Details
  - 🏠 Landlord & Property Details
  - 💰 Rent Details
  - ⚙️ Options
- Add helpful **info tooltips** (ℹ️ icons) next to fields like PAN, Revenue Stamp, Payment Mode explaining why they're needed.

### Homepage Layout (Top to Bottom)
1. **Hero Section**: "Free Rent Receipt Generator for HRA Exemption" — subtitle explaining the tool, prominent CTA button that scrolls to the form
2. **Trust Badges**: "No Login Required" | "100% Free" | "Data Never Leaves Your Browser" | "Instant PDF Download"
3. **How it Works**: 3-step visual — "Fill Details" → "Preview Receipts" → "Download PDF"
4. **The Generator Form** (main tool)
5. **Receipt Preview Area** (appears after clicking Preview)
6. **FAQ Section** (accordion)
7. **Latest Blog Posts** (3 cards linking to blog)
8. **Footer**

### Header
- Text logo: "RentReceiptIndia.in" or "FreeRentReceipt" (simple, text-based)
- Navigation: Home | Blog | About | Contact
- Mobile: hamburger menu with slide-out drawer
- Sticky header on scroll (optional)

### Footer
- Column 1: About brief + logo
- Column 2: Quick Links — Home, Blog, About, Contact
- Column 3: Legal — Privacy Policy, Terms of Service, Disclaimer
- Bottom bar: "© 2025 RentReceiptIndia. All rights reserved."
- Disclaimer text: "This tool is for informational purposes only. Please consult a tax professional."

---

## PHASE 4: AdSense-Required Pages

All these pages must have substantial, genuine content. Google reviews these during AdSense approval.

### About Page (`/#/about`)
Write a genuine, warm about page (~400 words):
- What this tool does and who it's for
- "We built this free tool to help millions of salaried employees in India generate rent receipts for HRA tax exemption quickly and easily — no signups, no fees, no data collection."
- Why we built it (frustration with existing tools that require login, are slow, or look sketchy)
- Privacy commitment — no data stored, everything processed in browser
- Team/mission statement (can be generic but sincere)

### Privacy Policy (`/#/privacy-policy`)
Comprehensive privacy policy (~1000 words):
- **Data Collection**: No personal data is collected or stored on any server. All receipt generation happens client-side in the user's browser.
- **Local Storage**: The site may use browser localStorage to save form preferences for returning users. This data never leaves the device.
- **Cookies**: Google AdSense and Google Analytics may set cookies. Explain what these cookies do.
- **Google AdSense**: "We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits. You can opt out of personalized advertising by visiting Google's Ads Settings."
- **Google Analytics**: "We use Google Analytics to understand how visitors use our site. This helps us improve the tool."
- **Third-Party Links**: Disclaimer about external links
- **Children's Privacy**: Not directed at children under 13
- **Changes to Policy**: We may update this policy
- **Contact**: Email address for privacy concerns
- Use proper legal formatting with clear headings

### Terms of Service (`/#/terms`)
Proper terms (~700 words):
- Acceptance of terms
- The tool is provided "as is" for informational purposes only
- Users are responsible for verifying accuracy of their receipts
- Generating fraudulent rent receipts is illegal under Indian law (Section 420 IPC, Section 277 IT Act)
- Not a substitute for professional tax/legal advice
- Intellectual property rights
- Limitation of liability
- Governing law: India
- Contact information

### Disclaimer (`/#/disclaimer`)
Clear financial/tax disclaimer (~400 words):
- This is an informational tool, not tax advice
- Receipts generated are templates — users must ensure accuracy
- Always consult a Chartered Accountant for tax matters
- We are not responsible for any issues arising from use of generated receipts
- Generating fake receipts for false HRA claims is a punishable offense

### Contact Page (`/#/contact`)
- Brief intro (~100 words)
- Email address displayed prominently (create a professional-looking one: contact@rentreceiptindia.in or similar placeholder)
- Simple contact form (Name, Email, Subject, Message) — since no backend, use `mailto:` link or integrate **Formspree** (free tier, works with static sites)
- Response time expectation
- Social links placeholder

---

## PHASE 5: Blog Posts (SEO + AdSense Content Requirement)

**Why blogs matter:** Google AdSense requires sites to have substantial, original content. Blog posts also drive organic traffic from Google search, which is your primary traffic source.

Create a blog section with **10 well-written, SEO-optimized articles**. Each should be 800-1200 words, written in a helpful, informative tone. Store ALL blog content in `/src/lib/blogData.ts` as a structured array.

### Blog Data Structure
```ts
interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: string;  // HTML string with proper h2, h3, p, ul, ol tags
  publishDate: string;
  readTime: string;
  tags: string[];
  relatedSlugs: string[];
}
```

### Blog Posts to Write (write FULL content, not placeholder):

1. **"What is HRA Exemption? Complete Guide for Salaried Employees in India (2025-26)"**
   - Explain Section 10(13A), who can claim, eligibility, the three-part formula for HRA calculation
   - Include worked examples with actual numbers (e.g., Basic = ₹40,000, HRA received = ₹20,000, Rent paid = ₹15,000)
   - Metro vs non-metro distinction (50% vs 40%)

2. **"How to Generate Rent Receipts for Income Tax — Step by Step Guide"**
   - Walk through the process, what details are needed, when to submit to employer
   - What format is acceptable, digital vs physical
   - Link back to the tool

3. **"Is PAN of Landlord Mandatory for HRA Claim? Rules Explained"**
   - When PAN is required (annual rent > ₹1,00,000)
   - What if landlord refuses to share PAN
   - Form 60 as alternative
   - Consequences of not providing PAN

4. **"HRA Exemption vs Section 80GG — Which Should You Claim?"**
   - For those not receiving HRA component in salary
   - Section 80GG eligibility, conditions, maximum limit (₹5,000/month)
   - Comparison table
   - Who should use which

5. **"Can You Claim HRA If You Live in Your Own House?"**
   - Paying rent to parents (yes, it's legal with conditions)
   - Owning a house in a different city than where you work
   - Owning a house in the same city
   - Tax implications and documentation needed

6. **"Rent Receipt Format — What Details Must Be Included?"**
   - Mandatory fields as per Income Tax Department
   - Revenue stamp requirement and rules
   - Handwritten vs printed vs digital — all valid
   - Sample receipt walkthrough

7. **"How to Calculate HRA Exemption — Formula with Examples"**
   - The 3-part formula in detail
   - 3 different salary examples (low, medium, high salary)
   - Metro vs non-metro comparison
   - Step-by-step calculation walkthrough

8. **"Common Mistakes While Claiming HRA That Can Get You an IT Notice"**
   - Using fake receipts (penalties under Section 270A)
   - Not declaring landlord PAN
   - Claiming more than rent paid
   - Mismatch between Form 16 and ITR
   - Paying rent to spouse
   - Not having supporting documents

9. **"Do You Need a Rent Agreement for HRA Exemption?"**
   - Rent agreement vs rent receipts — which is mandatory
   - When rent agreement becomes necessary
   - Stamp duty on rent agreements
   - Registration requirements (11 months rule)

10. **"Revenue Stamp on Rent Receipt — Is It Still Required in 2025?"**
    - What is a revenue stamp
    - Current rules: Required for cash payments > ₹5,000
    - Not required for bank transfers/UPI
    - Where to buy revenue stamps (post office, court stamp vendors)
    - What happens if you don't affix it

### Blog Page Design
- **Blog listing** (`/#/blog`): Clean card grid — each card shows title, excerpt, date, read time, tags
- **Blog post** (`/#/blog/[slug]`): Clean reading layout, max-width for readability (~700px content width), proper typography for long-form reading
- Table of contents (auto-generated from h2 headings) at the top of each post
- Related posts section at the bottom (show 2-3 related articles)
- "Back to Blog" link
- Share buttons: WhatsApp (important for India!), Twitter/X, LinkedIn, Copy Link
- Breadcrumb: Home > Blog > Post Title

---

## PHASE 6: SEO Optimization

### Meta Tags (use react-helmet-async)
Every page must have:
- Unique `<title>` tag (50-60 chars)
- Unique `<meta name="description">` (150-160 chars)
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`
- Canonical URL

### Structured Data (JSON-LD)
Add JSON-LD structured data via `<script type="application/ld+json">`:
- **Homepage**: `WebApplication` schema
- **Blog posts**: `Article` schema with author, datePublished, dateModified
- **FAQ section**: `FAQPage` schema (this gets rich results in Google!)
- **Breadcrumbs**: `BreadcrumbList` schema on all pages

### Sitemap & Robots
Since this is a static site with hash routing, create:
- `/public/sitemap.xml` — manually list all URLs (homepage, about, blog posts, etc.)
  - Note: Since we use HashRouter, URLs will be like `https://yourusername.github.io/rent-receipt-india/#/blog/hra-exemption-guide`
  - Google can crawl hash URLs but it's not ideal. Consider adding a simple HTML page list in index.html for crawlers.
- `/public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://yourusername.github.io/rent-receipt-india/sitemap.xml
  ```

### SEO Workaround for Hash Routing
Since GitHub Pages uses HashRouter (URLs with #), and Google's crawling of hash URLs is limited:
- Add a `<noscript>` section in `index.html` with links to all important pages
- Use `react-snap` or `prerender` if possible to generate static HTML for each route (OPTIONAL — adds complexity)
- Write very strong meta tags in the main `index.html`
- Focus on getting blog traffic from social sharing (WhatsApp, Twitter) and direct links

### Internal Linking
- Blog posts should link to each other where relevant
- Every blog post should have a CTA linking back to the generator tool
- Footer should link to all important pages

---

## PHASE 7: AdSense Preparation

Leave clearly marked **placeholder divs** for ad placement. Style them with a light dashed border so I can see where ads will go.

### Ad Placeholder Component
```tsx
// components/AdPlaceholder.tsx
const AdPlaceholder = ({ slot, className }: { slot: string; className?: string }) => (
  <div
    id={`ad-${slot}`}
    className={`ad-placeholder border-2 border-dashed border-gray-300 bg-gray-50
    flex items-center justify-center text-gray-400 text-sm my-4 ${className}`}
  >
    {/* AdSense code will be placed here after approval */}
    <span>Ad Space — {slot}</span>
  </div>
);
```

### Ad Placements (max 3 per page):

**Homepage:**
1. Below hero section, above the form — responsive horizontal banner
2. Between form and preview area — responsive ad
3. Above footer — responsive ad

**Blog Post Page:**
1. Below blog title, above content — horizontal banner
2. After 3rd paragraph — in-article ad
3. Sidebar (desktop) or after content (mobile) — rectangle ad

**Blog Listing Page:**
1. Between row 1 and row 2 of blog cards — horizontal banner

**Other Pages (About, Privacy, etc.):**
1. One ad below main content — responsive

---

## PHASE 8: Additional Features

1. **FAQ Section on Homepage**
   - Collapsible accordion with 10 common questions:
     - What is a rent receipt?
     - Why do I need rent receipts?
     - Is this tool free?
     - Is my data safe?
     - What if my annual rent exceeds ₹1 lakh?
     - Do I need landlord's PAN?
     - Is revenue stamp necessary?
     - Can I pay rent to my parents and claim HRA?
     - What format should rent receipts be in?
     - How many months of receipts can I generate?

2. **Receipt Counter Badge**
   - "🧾 15,847+ Rent Receipts Generated" — shown on hero section
   - Store count in localStorage, increment by 1 each time someone generates receipts
   - Start from a realistic seed number (e.g., 14,500)

3. **Remember Form Data**
   - Save last used form data in localStorage
   - When user returns, auto-fill the form with saved data
   - Show a small notice: "Welcome back! We've pre-filled your details from last time."
   - Add "Clear Saved Data" button

4. **Print Button**
   - In addition to PDF download, add a "🖨️ Print" button
   - Opens browser's print dialog with receipt-optimized CSS (@media print)

5. **Share Buttons on Blog Posts**
   - WhatsApp (most important for Indian audience — use wa.me deep link)
   - Twitter/X
   - LinkedIn
   - Copy Link button with "Copied!" feedback

6. **Scroll to Top**
   - Small floating button that appears when user scrolls down
   - Smooth scroll to top

7. **404 Page**
   - Custom 404 page with link back to homepage

---

## PHASE 9: GitHub Pages Deployment Setup

### GitHub Actions for Auto-Deploy
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

### OR Simple Manual Deploy
- `npm run build` → output goes to `/docs`
- Commit `/docs` folder to main branch
- In GitHub repo Settings → Pages → Source: "Deploy from a branch" → Branch: `main` → Folder: `/docs`
- Site will be live at: `https://yourusername.github.io/rent-receipt-india/`

### Custom Domain (Optional, for later)
- Buy a domain like `rentreceiptindia.in` (₹199-500/year from GoDaddy, Namecheap, or Hostinger)
- Add CNAME file in `/public/CNAME` with domain name
- Configure DNS: CNAME record pointing to `yourusername.github.io`
- This makes the URL look professional AND improves AdSense approval chances

### README.md
Create a README with:
- Project description
- Tech stack
- How to run locally (`npm install` → `npm run dev`)
- How to build (`npm run build`)
- How to deploy
- License (MIT)

---

## IMPORTANT NOTES

- **ZERO cost hosting.** GitHub Pages is completely free.
- **NO backend/database.** Everything runs client-side in the browser.
- **No login/signup.** Completely anonymous and free to use.
- **HashRouter is required** for GitHub Pages. BrowserRouter will NOT work (GitHub Pages returns 404 for non-root paths).
- Remember to set `base` in `vite.config.ts` to your repo name.
- Write clean, well-commented TypeScript code.
- Test PDF generation thoroughly — receipts must look professional and print-ready.
- The amount-in-words function MUST handle Indian numbering correctly (lakh, crore).
- Test on mobile screen sizes — most Indian users will access via phone.
- Make sure the site feels **trustworthy and professional** — not spammy.
- Blog content must be **actually helpful and well-written** — Google can detect thin content.
- Write ALL blog content in full — do not use placeholder text like "Lorem ipsum" or "Content coming soon."

---

## Build Order

Execute in this exact sequence:
1. **Project setup** — Vite, React, Tailwind, folder structure, routing
2. **Core generator** — Form, validation, number-to-words, PDF generation
3. **Preview feature** — Live receipt preview with download/print
4. **UI polish** — Hero, how-it-works, trust badges, responsive design, tooltips
5. **Legal pages** — About, Privacy, Terms, Disclaimer, Contact
6. **Blog** — All 10 articles with full content, listing page, individual post page
7. **FAQ section** — Homepage accordion
8. **SEO** — Meta tags, JSON-LD, sitemap, robots.txt
9. **Extra features** — Counter, localStorage, share buttons, scroll-to-top
10. **Ad placeholders** — Insert ad slots on all pages
11. **Deployment config** — GitHub Actions or manual build setup
12. **Testing** — Test everything on mobile, generate sample receipts, verify PDF quality

Now build the complete project step by step. Start with step 1 and proceed sequentially. Test each phase before moving to the next.
