# SpeakUp – Local setup & run

Run the app on your machine (localhost / simulator / device).

---

## 1. Prerequisites

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- **npm** (comes with Node) or **yarn**
- **Git**
- **Expo Go** (optional): for running on a physical phone – [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

For simulators (optional but useful):

- **iOS**: Xcode from Mac App Store (includes iOS Simulator)
- **Android**: [Android Studio](https://developer.android.com/studio) with an AVD (Android Virtual Device)

---

## 2. Get the code

**If you don’t have the repo yet:**

```bash
git clone https://github.com/OnGodCR/SpeakUp.git
cd SpeakUp
```

**If you already have the repo** (e.g. you’re in the project folder):

```bash
cd /path/to/SpeakUp
git fetch origin
git status   # see if you need to pull or have local changes
```

---

## 3. Install dependencies

From the project root:

```bash
npm install
```

This installs Expo, React Native, and all app dependencies.

---

## 4. Environment variables

The app uses Supabase. You need a `.env.local` (or `.env`) in the project root with:

- `EXPO_PUBLIC_SUPABASE_URL` – your Supabase project URL  
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` – your Supabase anon/public key  

Create the file if it doesn’t exist:

```bash
# Create from template if you have one
cp .env.example .env.local

# Or create manually
touch .env.local
```

Then edit `.env.local` and add (replace with your real values):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from [Supabase](https://supabase.com) → your project → **Settings** → **API**.

---

## 4.1. Google sign-in (optional)

To enable **Sign in with Google**:

1. **Supabase Dashboard**  
   - Go to **Authentication** → **Providers** → enable **Google** and add your Google OAuth client ID and secret (from [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials).

2. **Redirect URLs**  
   In **Authentication** → **URL Configuration** → **Redirect URLs**, add:
   - **Native / Expo:** `speakup://auth/callback` (or your custom scheme from `app.json` + `auth/callback`).
   - **Web:** Your app origin + `/auth/callback`, e.g. `http://localhost:8081/auth/callback` for local dev, and your production URL (e.g. `https://yourapp.com/auth/callback`) for production.

3. **Google Cloud Console**  
   In your OAuth 2.0 client’s **Authorized redirect URIs**, add the Supabase callback URL shown in the Supabase Google provider setup (e.g. `https://<project-ref>.supabase.co/auth/v1/callback`).

---

## 5. Start the app (localhost / dev server)

From the project root:

```bash
npm start
```

Or:

```bash
npx expo start
```

A dev server will start and a QR code and menu will appear in the terminal.

---

## 6. Open the app on a device or simulator

After `npm start`:

| Target            | Action |
|-------------------|--------|
| **Web (browser)** | Press **`w`** in the terminal, or open the URL shown (e.g. `http://localhost:8081`) |
| **iOS Simulator** | Press **`i`** (requires Xcode on Mac) |
| **Android emulator** | Press **`a`** (emulator must already be running) |
| **Phone (Expo Go)** | Scan the QR code with the Expo Go app (same Wi‑Fi as your computer) |

Use **`r`** in the terminal to reload the app.

---

## 7. Quick reference

| Command            | What it does        |
|--------------------|---------------------|
| `npm start`        | Start Expo dev server |
| `npm run web`      | Start with web focused |
| `npm run ios`      | Start and open iOS simulator |
| `npm run android`  | Start and open Android emulator |

---

## 8. Troubleshooting

- **“Module not found”**  
  Run `npm install` again and restart with `npm start`.

- **Blank or error screen on web**  
  Try a hard refresh (e.g. Ctrl+Shift+R or Cmd+Shift+R) or clear the browser cache.

- **Supabase / auth errors**  
  Check that `.env.local` has the correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` and that the dev server was started **after** changing env (restart with `npm start`).

- **Port in use**  
  Expo will prompt to use another port, or you can run:  
  `npx expo start --port 8082`
