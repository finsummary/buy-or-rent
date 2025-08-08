# 🏠 BuyOrRent.io - Buy vs Rent Calculator

<div align="center">

![BuyOrRent.io](https://img.shields.io/badge/BuyOrRent.io-Calculator-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)

**Make informed decisions about homeownership vs renting with our comprehensive financial calculator**

[🚀 Live Demo](https://buyorrent.io) | [📖 Documentation](#features) | [🐳 Deployment](#deployment)

</div>

## ✨ Features

### 💰 **Advanced Financial Calculator**
- **Comprehensive Cost Analysis**: Includes mortgage, maintenance, insurance, closing costs
- **Investment Comparison**: Compares property equity vs rental savings invested
- **Time Horizon Analysis**: Calculate over any time period (1-30+ years)
- **Real-time Updates**: Instant recalculation as you adjust parameters

### 📊 **Rich Data Visualization**
- **Interactive Charts**: Line charts showing homeowner equity vs renter investment over time
- **Yearly Breakdown Table**: Detailed year-by-year financial analysis
- **Monthly Payment Tracking**: Compare monthly costs between buying and renting
- **Trend Analysis**: See when buying becomes more advantageous than renting

### 👤 **User Account System**
- **Supabase Authentication**: Secure OAuth with Google or GitHub
- **Scenario Management**: Save and compare multiple calculation scenarios
- **Guest Mode**: Full functionality without requiring an account
- **Data Security**: Row Level Security ensures data privacy

### 📱 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Clean Interface**: Modern UI with shadcn/ui components
- **Fast Loading**: Optimized for Core Web Vitals
- **Accessibility**: WCAG 2.1 AA compliant

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15+, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Charts** | Recharts, Custom visualizations |
| **Authentication** | Supabase Auth, OAuth (Google, GitHub) |
| **Database** | PostgreSQL, Supabase, Drizzle ORM |
| **Forms** | React Hook Form, Zod validation |
| **Analytics** | Google Analytics 4 |
| **Deployment** | Docker, Vercel, Railway |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd calculator
   npm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Supabase setup**
   ```bash
   # Follow SUPABASE_SETUP.md for detailed instructions
   npm run db:push
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

5. **Open application**
   Visit `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

See `SUPABASE_SETUP.md` for detailed setup instructions.

## 📊 Usage

### Basic Calculator
1. **Enter home details**: Price, down payment, mortgage rate
2. **Set time horizon**: How long you plan to stay
3. **Add costs**: Closing costs, maintenance, insurance
4. **Compare rental**: Monthly rent, rent increases
5. **Review results**: See recommendation and detailed breakdown

### Advanced Features
- **Save scenarios**: Create account to save multiple calculations
- **Compare options**: Side-by-side scenario comparison
- **Export data**: Download calculations for external analysis
- **Share results**: Generate shareable links

## 🐳 Deployment

### Docker Deployment

```bash
# Build and run
docker build -t buyorrent-app .
docker run -d -p 3000:3000 --env-file .env.production buyorrent-app

# Or use Docker Compose
docker-compose up -d
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions with your buyorrent.io domain.

## 📄 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate database schema |
| `npm run db:push` | Push schema to Supabase |
| `npm run db:studio` | Open Drizzle Studio |

## 🤝 Contributing

We welcome contributions! 

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for better financial decisions**

[Website](https://buyorrent.io) • [Issues](issues) • [Discussions](discussions)

</div>