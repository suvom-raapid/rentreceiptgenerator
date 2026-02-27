# RentReceiptIndia - Free Rent Receipt Generator

A free, no-signup-required online tool to generate professional rent receipts for **HRA (House Rent Allowance) exemption** under Section 10(13A) of the Income Tax Act, India.

**Live Site:** [https://suvomdas.github.io/rentreceiptgenerator/](https://suvomdas.github.io/rentreceiptgenerator/)

## Features

- Generate professional rent receipts in PDF format
- 3 receipts per A4 page, print-ready
- Supports Indian numbering system (Lakh, Crore) for amount in words
- No login, no signup, no data collection
- 100% client-side — your data never leaves your browser
- Mobile-friendly responsive design
- Revenue stamp placeholder option
- Multiple payment modes (Cash, Bank Transfer/UPI, Cheque)
- Form data saved locally for returning users
- 10 SEO-optimized blog articles on HRA and tax topics

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **React Router** (HashRouter for GitHub Pages compatibility)
- **jsPDF** for client-side PDF generation
- **date-fns** for date manipulation
- **Lucide React** for icons
- Hosted on **GitHub Pages** (zero cost)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (output to /docs)
npm run build

# Preview production build
npm run preview
```

## Deployment

### Automatic (GitHub Actions)
Push to `main` branch triggers automatic build and deploy via `.github/workflows/deploy.yml`.

### Manual
1. Run `npm run build`
2. Commit the `/docs` folder
3. In GitHub repo Settings → Pages → Source: "Deploy from a branch" → Branch: `main` → Folder: `/docs`

## License

MIT
