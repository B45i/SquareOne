# SquareOne

Interview prep tracker. Log study sessions, track streaks, visualise progress by subject and topic.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

Find the values in **Firebase Console → Project Settings → Your apps → SDK setup → Config**.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 4. Link to your Firebase project

```bash
firebase use --add
```

Select your project from the list. This writes a `.firebaserc` file at the project root.

### 5. Deploy Firestore indexes

```bash
firebase deploy --only firestore:indexes
```

This deploys `firestore.indexes.json`. Indexes can take a few minutes to build in the Firebase Console. The app will throw errors on topic queries until the `topics` composite index is active.

### 6. Deploy Firestore security rules

```bash
firebase deploy --only firestore:rules
```

This deploys `firestore.rules`. Rules take effect immediately.

### 7. Deploy both at once

```bash
firebase deploy --only firestore
```

---

## Development

```bash
npm run dev
```

---

## Firebase files

| File | Purpose |
|---|---|
| `firestore.indexes.json` | Composite index definitions — deploy with Firebase CLI |
| `firestore.rules` | Security rules — deploy with Firebase CLI |
| `.env` | Local env vars (not committed) |
| `.env.example` | Template — commit this, not `.env` |

See [db.md](./db.md) for full schema, index rationale, and query patterns.
