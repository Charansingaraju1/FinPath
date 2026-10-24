# FinPath — Your Financial Journey, Simplified

> **"Small steps. Bigger possibilities."**  
> Plan your finances, discover real opportunities, and build a future that's on your terms.

FinPath is a full-stack financial planning and opportunity execution web application tailored for students, young professionals, freelancers, and aspiring entrepreneurs. It bridges personal budget analysis with practical, market-validated problem discovery, revenue feasibility modeling, and milestone-driven execution roadmaps.

---

## 1. Visual Design & Theme Tokens

FinPath follows a warm, welcoming editorial aesthetic with accessible contrast and custom vector branding:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Terracotta** | `#C74634` | Primary brand accent, CTA buttons, active state indicators |
| **Deep Terracotta** | `#9E3529` | Button hover states, emphasized badges, strong highlights |
| **Warm Cream** | `#F6E9D8` | Main site background, top navigation header bar |
| **Soft Cream** | `#FBF5EC` | Hero background, subtle surface transitions |
| **Ivory Card** | `#FFF9F1` | Rounded card containers, metric panels, modals |
| **Espresso Text** | `#49362E` | Headlines, primary text, prominent figures |
| **Secondary Text** | `#79675E` | Subtitles, supporting copy, captions, timestamps |
| **Peach Beige** | `#E7BFA9` | Decorative accents, selection highlights, pill borders |
| **Dusty Rose** | `#D9A28F` | Borders, subtle divider lines, active step markers |
| **Success Green** | `#356B4B` | Surplus indicators, positive cash flow, on-track progress |
| **Sage Surface** | `#DCE8DE` | Positive financial progress badges, growth tags |
| **Border Tone** | `#E5D8CB` | Structural card borders and table dividers |

### Typography
- **Headlines & Display:** `DM Serif Display` / `Playfair Display` (serif)
- **Body, Inputs & Analytics:** `Inter` (clean sans-serif)

---

## 2. Architecture & Technology Stack

```
                              ┌──────────────────────────────────────────────────┐
                              │                 FinPath Client                   │
                              │ React 19 + TypeScript + Vite + Tailwind CSS v4  │
                              │  Recharts + React Router v7 + Lucide Icons       │
                              └────────────────────────┬─────────────────────────┘
                                                       │  /api (Proxy :5173 -> :8080)
                                                       ▼
                              ┌──────────────────────────────────────────────────┐
                              │            Spring Boot 3.3.4 (Java 21)           │
                              │ Controllers │ Services │ Repositories │ Entities │
                              │   Spring Security + JJWT + Bean Validation       │
                              └────────────────────────┬─────────────────────────┘
                                                       │
                              ┌────────────────────────┴─────────────────────────┐
                              ▼                                                  ▼
             ┌───────────────────────────────────┐             ┌───────────────────────────────────┐
             │         Flyway Migrations         │             │      Persistent Storage Engine    │
             │   V1: 14 Relational Data Tables   │             │   ./data/finpathdb (MySQL mode)   │
             │   V2: Curated Opportunities Seed  │             │   Directly MySQL 8 compatible     │
             └───────────────────────────────────┘             └───────────────────────────────────┘
```

### Full-Stack Exam Project Compliance
- **Spring Boot Architectural Tiers:** Strict separation of `RestController`, `Service`, `Repository`, `Entity`, and `DTO` layers. No monolithic collapses.
- **Database Persistence:** JPA/Hibernate entity relationships, foreign key constraints, indexes, timestamps, and schema migrations via Flyway.
- **Validation:** Jakarta validation (`@Valid`, `@NotBlank`, `@Positive`, `@NotNull`, `@Min`) at all API entry boundaries.
- **Error Handling:** Centralized `@ControllerAdvice` (`GlobalExceptionHandler`) emitting consistent structured error responses.
- **User Data Isolation:** Every private entity (goals, financial profile, roadmaps, transactions, validations) is strictly scoped to the authenticated user ID extracted from verified JWT tokens. Never trusts unverified request parameters.

---

## 3. Directory Structure

```
scratch/finpath/
├── backend/
│   ├── pom.xml                                   # Maven build configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/finpath/
│   │   │   │   ├── controller/                   # 14 REST Controllers
│   │   │   │   ├── dto/                          # Request, Response & Validation DTOs
│   │   │   │   ├── entity/                       # 14 JPA Relational Entities
│   │   │   │   ├── exception/                    # GlobalExceptionHandler & Custom Exceptions
│   │   │   │   ├── repository/                   # 14 Spring Data Repositories
│   │   │   │   ├── security/                     # SecurityConfig, JwtUtils, UserDetailsService
│   │   │   │   └── service/                      # Core business & calculation engines
│   │   │   └── resources/
│   │   │       ├── application.yml               # Dev & MySQL profiles, Flyway config
│   │   │       └── db/migration/
│   │   │           ├── V1__init_schema.sql       # 13 relational tables & constraints
│   │   │           └── V2__seed_initial_data.sql # Curated opportunities seed data
│   │   └── test/java/com/finpath/                # 17 Unit & SpringBoot tests
│   └── data/                                     # Persistent database storage
└── frontend/
    ├── index.html                                # SEO meta tags, Google Fonts, Brand Favicon
    ├── package.json                              # Vite, React 19, Recharts, Lucide, Tailwind v4
    ├── tsconfig.json                             # TypeScript bundler configuration
    ├── vite.config.ts                            # @tailwindcss/vite + /api backend proxy
    └── src/
        ├── components/
        │   └── common/                           # Logo, Navbar, Footer, Modal
        ├── context/
        │   └── AuthContext.tsx                   # Auth state, login/register, demo user helper
        ├── pages/                                # 13 fully functional pages
        │   ├── LandingPage.tsx                   # Hero illustration, How it works, Roadmap preview
        │   ├── LoginPage.tsx                     # Form validation + Demo User button
        │   ├── RegisterPage.tsx                  # Account creation
        │   ├── OnboardingPage.tsx                # 5-step interactive financial onboarding
        │   ├── DashboardPage.tsx                 # 6 metric cards, charts, daily priorities
        │   ├── OpportunitiesPage.tsx             # Problem search, fit scores, compare modal
        │   ├── OpportunityDetailPage.tsx         # Validation workspace & interview logs
        │   ├── RevenueCalculatorPage.tsx         # Unit economics & 3-scenario feasibility
        │   ├── RoadmapPage.tsx                   # 3/6/12-mo timeline, stages & task completion
        │   ├── TransactionsPage.tsx              # Cash flow ledger, CSV export, delete modals
        │   ├── ProgressPage.tsx                  # Pacing report & strategic recommendations
        │   ├── SettingsPage.tsx                  # Profile, theme, data export, deletion
        │   └── AdminPage.tsx                     # Moderation table & aggregate metrics
        ├── services/
        │   └── api.ts                            # Typed HTTP client with JWT injection
        └── types/
            └── index.ts                          # Comprehensive TypeScript contracts
```

---

## 4. Getting Started & Running Locally

### Prerequisites
- **Java:** JDK 21+ (`java -version`)
- **Maven:** 3.9+ (`mvn -version`)
- **Node.js:** 18+ or 20+ (`node -v`)
- **npm:** 9+ (`npm -v`)

### Backend Setup
1. Open a terminal in `scratch/finpath/backend`.
2. Run database migrations and compile:
   ```bash
   mvn clean compile
   ```
3. Run automated tests (17 tests covering financial formulas, scoring, and context):
   ```bash
   mvn test
   ```
4. Start the Spring Boot backend server (default port `8080`):
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Open a second terminal in `scratch/finpath/frontend`.
2. Install npm dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at **`http://localhost:5173`**.

---

## 5. Guided Demo Experience

To immediately test the entire product without manual registration:

1. **Access Landing Page:** Navigate to `http://localhost:5173/`. Observe the custom illustration, floating financial summary cards, How It Works guide, sample opportunity cards, and interactive demo modal.
2. **One-Click Demo Authentication:** Click **"Log In"** in the top navigation, then click the terracotta button **"Explore as Demo User"**. This logs in `alex.chen@finpath.demo`.
3. **Explore Dashboard (`/dashboard`):**
   - Review the 6 Financial Summary Cards: Monthly Take-Home ($4,500), Total Expenses ($2,850), Monthly Surplus ($1,650), Savings ($8,500), Active Goal, and Goal Gap.
   - Inspect the interactive Recharts Cash Flow bar chart and Expense Breakdown pie chart.
   - Review the "What should I do today?" prioritized milestones.
4. **Discover Opportunities (`/opportunities`):**
   - Search by keyword (e.g., "Web", "Tutoring", "Automation").
   - Filter by Customer Type, Difficulty, or Time Commitment.
   - Inspect the transparent Fit Score (0–100) calculated from personal skills, available budget, and hours.
   - Click "Compare" to view side-by-side economics for up to 3 opportunities.
5. **Validation Workspace (`/opportunities/1`):**
   - View problem statements, customer assumptions, and interview questions.
   - Add a customer interview log with feedback and willingness-to-pay evidence.
   - Move validation stages from "Researching" to "Problem Confirmed".
6. **Revenue & Feasibility Calculator (`/calculator`):**
   - Adjust Price per Customer, Expected Volume, Fixed Expenses, and CAC.
   - Instantly see updated Conservative, Base, and Optimistic scenarios, break-even customer count, and estimated cost recovery timeline.
7. **Personalized Execution Roadmap (`/roadmap`):**
   - Switch between 3-month, 6-month, and 12-month roadmaps.
   - Toggle milestone checkboxes to mark tasks complete and watch overall progress update.
   - Add custom tasks with priority, due date, and estimated hours.
8. **Financial Tracking & CSV Export (`/transactions`):**
   - View cash flow categorized by Personal vs. Business income and expenses.
   - Add new transactions.
   - Click **"Export CSV"** to download the clean CSV record.
9. **Progress Pacing (`/progress`):**
   - View goal completion percentage and planned versus actual savings variance.
   - Review pacing status and non-judgmental strategic recommendations.
10. **Administrator Dashboard (`/admin`):**
    - Log in with `admin@finpath.demo` (password: `password123`).
    - Review aggregate user counts, total opportunities, and approve/feature community submissions.

---

## 6. Core Financial Calculation Engine

All financial calculations are deterministic, verified in Java unit tests, and avoid arbitrary assumptions:

1. **Monthly Surplus / Deficit:**
   $$\text{Monthly Surplus} = \text{Monthly Take-Home} + \text{Other Income} - (\text{Essential} + \text{Discretionary} + \text{Debt Repayments}^*)$$
   *\*Debt repayments are only subtracted if the user clarified they are not already included in monthly expenses.*

2. **Remaining Goal Gap:**
   $$\text{Goal Gap} = \max(0, \text{Target Amount} - \text{Amount Allocated})$$

3. **Required Monthly Contribution:**
   $$\text{Required Contribution} = \frac{\text{Goal Gap}}{\max(1, \text{Months Remaining})}$$

4. **Feasibility Assessment:**
   - **Achievable:** Monthly Surplus $\ge$ Required Monthly Contribution.
   - **Potentially Achievable:** Monthly Surplus $> 0$, but additional income or timeline adjustments are needed.
   - **Unlikely under Current Constraints:** Monthly Deficit ($< 0$) or past deadline.

---

## 7. Automated Test Suite

Executed and verified tests:

| Test Class | Category | Test Cases Verified |
| :--- | :--- | :--- |
| `FinancialCalculationServiceTest` | Financial Engine | Standard surplus calculation, debt inclusion flag, zero/past deadlines, goal gap arithmetic, achievable/stretch/unlikely status rules |
| `RevenueCalculationServiceTest` | Unit Economics | Gross revenue, variable costs, operating profit, break-even unit formula, lead generation requirement |
| `OpportunityFitScoreTest` | Opportunity Match | Transparent weighted fit score (0–100), skill keyword matching, startup budget compatibility, available hours penalty |
| `FinpathApplicationTests` | Integration | Spring Boot context load, Flyway migration execution, HikariCP connection pool, JPA entity scanning |

To execute tests:
```bash
cd scratch/finpath/backend
mvn test
```

---

## 8. Responsible Planning & Trust Disclosures

- **Educational Purpose:** FinPath is an educational planning tool and does not provide certified financial, legal, or investment advice.
- **No Guaranteed Earnings:** All revenue projections, feasibility metrics, and timelines are hypothetical estimates based on user assumptions.
- **Validation First:** Users are actively encouraged to interview customers and test willingness to pay before committing financial capital.
