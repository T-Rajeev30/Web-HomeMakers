# ZINGRO — Homemaker Portal (React)

React port of the Stitch `zingro_homemaker_portal` design export. Built with Vite + React 18 + React Router + Tailwind, using the original Zingro design tokens (orange primary `#ff6b00`).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Routes

| Path                     | Screen                          |
| ------------------------ | ------------------------------- |
| `/`                      | Language selection (entry)      |
| `/signup`                | Signup                          |
| `/otp`                   | OTP verification                |
| `/login`                 | Login                           |
| `/personal-information`  | Onboarding step 1               |
| `/document-upload`       | Onboarding step 7               |
| `/dashboard`             | Dashboard (app shell)           |
| `/orders`                | Orders                          |
| `/menu`                  | Menu management                 |
| `/plans`, `/profile`     | Placeholders                    |

## Structure

```
src/
  components/   # Reusable UI: Icon, Button, Card/Chip/ProgressBar,
                # TextField, TopAppBar, BottomNav, SideDrawer,
                # AppLayout (bottom-nav shell), OnboardingLayout
  pages/        # One file per screen
  data/mock.js  # Mock content (languages, orders, dishes, documents)
  index.css     # Tailwind + Material Symbols setup
tailwind.config.js  # Full design-token system from DESIGN.md
```

## Notes

- App-shell screens (`/dashboard`, `/orders`, `/menu`, `/plans`, `/profile`)
  share `AppLayout` — one top bar, bottom nav and drawer, no duplication.
- Onboarding screens share `OnboardingLayout` (progress bar + back).
- Icons use Google **Material Symbols** via `<Icon name="..." />`.
- Image placeholders from the Stitch export are replaced with icon tiles;
  swap in real assets/`<img>` where needed.
- Navigation between screens is wired to real flows
  (language → signup → otp → personal info → documents → dashboard).
