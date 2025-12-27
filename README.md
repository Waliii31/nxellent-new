# Nxellent Frontend

Nxellent is a comprehensive platform for smart contract security auditing and project management. This repository contains the frontend application built with modern web technologies.

## 🚀 Technologies Used

### Core Frameworks & Languages
-   **[React](https://react.dev/)**: A JavaScript library for building user interfaces.
-   **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **[Vite](https://vitejs.dev/)**: Next Generation Frontend Tooling for fast development and building.

### State Management & Data Fetching
-   **[Redux Toolkit](https://redux-toolkit.js.org/)**: The official, opinionated, batteries-included toolset for efficient Redux development.
-   **[TanStack Query (React Query)](https://tanstack.com/query/latest)**: Powerful asynchronous state management for TS/JS, used for data fetching, caching, and synchronization.

### Styling & UI
-   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom designs.
-   **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icon library.
-   **[Framer Motion](https://www.framer.com/motion/)** (if used) / **CSS Animations**: For smooth transitions and interactive elements.

### Routing
-   **[React Router DOM](https://reactrouter.com/)**: Declarative routing for React web applications.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
-   Node.js (v18 or higher recommended)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/nxellent-frontend.git
    cd nxellent-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory based on the example.
    ```bash
    cp .env.example .env
    ```
    
    Update the `.env` file with your API URL:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
└── 📁nxellent-frontend
    └── 📁public
        ├── 92_platinium.svg
        ├── all-hero.png
        ├── auth-page.png
        ├── badge.svg
        ├── card.svg
        ├── check-list.svg
        ├── check.svg
        ├── circle-check.svg
        ├── circle.svg
        ├── code.svg
        ├── compare-plan.svg
        ├── compliance.svg
        ├── cta-bg.png
        ├── Feature-1.png
        ├── Feature-2.png
        ├── Feature-3.png
        ├── Frame 1707480563 (1).svg
        ├── frame.svg
        ├── guage.png
        ├── hero-bg.png
        ├── high-green.svg
        ├── how-properties.png
        ├── king.svg
        ├── loss.svg
        ├── mobile.svg
        ├── my-project-board.svg
        ├── pink-profit.svg
        ├── pink-shield.svg
        ├── pink-star.svg
        ├── pink-warning.svg
        ├── power.png
        ├── pro.png
        ├── profit.svg
        ├── Rise.svg
        ├── score-guage.svg
        ├── Score.svg
        ├── security-pipeline.png
        ├── security.svg
        ├── shield-pink.svg
        ├── shield.svg
        ├── single-star-pink.svg
        ├── speaker.png
        ├── star-yellow.svg
        ├── star.svg
        ├── tick.svg
        ├── time.svg
        ├── trophy.svg
        ├── trusted.svg
        ├── vite.svg
        ├── work-1.png
        ├── work-2.png
        ├── work-3.png
        ├── work-4.png
    └── 📁src
        └── 📁animations
            ├── index.ts
        └── 📁app
            ├── store.ts
        └── 📁assets
            ├── react.svg
        └── 📁components
            └── 📁animations
                ├── ScrollReveal.tsx
            └── 📁modals
                ├── ScanModal.tsx
            └── 📁notifications
                ├── NotificationDrawer.tsx
            └── 📁sections
                ├── CoreFeatures.tsx
                ├── CtaSection.tsx
                ├── Footer.tsx
                ├── FoundersBillingPlans.tsx
                ├── FoundersPricing.tsx
                ├── Herosection.tsx
                ├── HowItWorksHero.tsx
                ├── InvestorBillingPlans.tsx
                ├── InvestorPricing.tsx
                ├── LeaderHero.tsx
                ├── Navbar.tsx
                ├── PricingHero.tsx
                ├── SecurityByDesign.tsx
                ├── SecurityPipeline.tsx
                ├── SmartContracts.tsx
                ├── TopProjects.tsx
                ├── TrustedBySection.tsx
                ├── WorkStructure.tsx
            └── 📁tabs-content
                └── 📁Accounts-billing-tabs-content
                    ├── AccountSettings.tsx
                    ├── BillingHistory.tsx
                    ├── Subscription.tsx
                └── 📁Defi-Protocol-tabs-content
                    ├── Categories.tsx
                    ├── Issues.tsx
                    ├── Overview.tsx
                    ├── Timeline.tsx
                └── 📁defi-yield-protocol
                    ├── DetailedScores.tsx
                    ├── KeyFindings.tsx
                    ├── Overview.tsx
            └── 📁ui
                ├── ActionPillButton.tsx
                ├── AlertItem.tsx
                ├── AuditScoreCard.tsx
                ├── CriticalIssueCard.tsx
                ├── DangerZoneBlock.tsx
                ├── DropdownPill.tsx
                ├── FeatureCard.tsx
                ├── FieldPill.tsx
                ├── FilterDropdown.tsx
                ├── GlowCard.tsx
                ├── HeatmapTile.tsx
                ├── InfoPanelAlerts.tsx
                ├── InfoPanelMissions.tsx
                ├── InfoPanelTips.tsx
                ├── InviteInline.tsx
                ├── KPIStatsBar.tsx
                ├── MemberRow.tsx
                ├── MetricStatCard.tsx
                ├── NeonGlowWrap.tsx
                ├── NxlActionButton.tsx
                ├── PageHeaderBar.tsx
                ├── PortfolioProjectRow.tsx
                ├── PrimaryButton.tsx
                ├── ProjectRow.tsx
                ├── ProjectsSearchFilters.tsx
                ├── RiskSummaryRow.tsx
                ├── ScoreDistributionRow.tsx
                ├── SearchInput.tsx
                ├── SecondaryButton.tsx
                ├── SegmentedToggle.tsx
                ├── SubtlePill.tsx
                ├── TabsNav.tsx
                ├── TagPill.tsx
                ├── TeamMemberRow.tsx
            ├── ProtectedRoute.tsx
        └── 📁features
            └── 📁auth
                ├── authSlice.ts
        └── 📁hooks
            └── 📁api
                ├── index.ts
                ├── useApplicationScans.ts
                ├── useAuth.ts
                ├── useBilling.ts
                ├── useContractScans.ts
                ├── useGithub.ts
                ├── useHealth.ts
                ├── useNotifications.ts
                ├── useProjects.ts
                ├── useSubscription.ts
                ├── useUploadAndScan.ts
                ├── useUploadsAndScans.ts
                ├── useUser.ts
        └── 📁pages
            ├── AccountsAndBilling.tsx
            ├── BatchScanner.tsx
            ├── BillingCancel.tsx
            ├── BillingSuccess.tsx
            ├── CompareProjects.tsx
            ├── DeFiProtocolSecurityReport.tsx
            ├── GithubCallback.tsx
            ├── Home.tsx
            ├── HowItWorks.tsx
            ├── InvestorPortfolio.tsx
            ├── Leaderboard.tsx
            ├── Login.tsx
            ├── MyPortfolio.tsx
            ├── MyProjects.tsx
            ├── NotFound.tsx
            ├── PortfolioRiskAnalysis.tsx
            ├── Pricing.tsx
            ├── Profile.tsx
            ├── ProjectDetails.tsx
            ├── ProjectSettings.tsx
            ├── Scanner.tsx
            ├── SignUp.tsx
        └── 📁services
            ├── api.ts
            ├── authService.ts
        └── 📁styles
            ├── index.css
        └── 📁types
            ├── auth.ts
            ├── billing.ts
            ├── notifications.ts
            ├── project.ts
            ├── scans.ts
            ├── subscription.ts
            ├── user.ts
        └── 📁utils
            ├── notificationsStream.ts
        ├── App.tsx
        ├── main.tsx
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── text.txt
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## 🚢 Deployment

To build the application for production:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled assets, ready to be deployed to any static hosting service (Vercel, Netlify, AWS S3, etc.).

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.# nxellent-frontend
# nxellent-frontend
