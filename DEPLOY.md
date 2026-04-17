# PrioriTracker â Ghid de Deployment

Timp estimat: ~15 minute.

## Pas 1: CreeazÄ proiect Supabase (3 min)

1. Mergi la **https://supabase.com/dashboard** â **New Project**
2. Alege un nume (ex: `prioritracker`) Èi o parolÄ pentru baza de date
3. Alege regiunea **eu-central-1** (Frankfurt)
4. AÈteaptÄ ~1 min sÄ se creeze

## Pas 2: RuleazÄ SQL-ul (2 min)

1. Ãn dashboard Supabase, mergi la **SQL Editor** (meniu stÃ¢ng)
2. Click **New query**
3. LipeÈte conÈinutul din `supabase/schema.sql` â click **Run**
4. LipeÈte conÈinutul din `supabase/rls.sql` â click **Run**

Verificare: mergi la **Table Editor** â trebuie sÄ vezi tabelele: `profiles`, `priorities`, `tasks`, `comments`, `links`.

## Pas 3: ConfigureazÄ Google OAuth (5 min)

### 3a. Google Cloud Console

1. Mergi la **https://console.cloud.google.com** â selecteazÄ proiectul BONO (sau creeazÄ unul)
2. Mergi la **APIs & Services â Credentials**
3. Click **Create Credentials â OAuth Client ID**
4. Application type: **Web application**
5. Name: `PrioriTracker`
6. **Authorized redirect URIs** â adaugÄ:
   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```
   (gÄseÈti URL-ul exact Ã®n Supabase â Settings â API â URL)
7. Click **Create** â noteazÄ **Client ID** Èi **Client Secret**

### 3b. Supabase Auth

1. Ãn Supabase dashboard â **Authentication â Providers**
2. Click **Google** â activeazÄ
3. LipeÈte **Client ID** Èi **Client Secret** de la Google
4. SalveazÄ

### 3c. RestricÈie domeniu (opÈional, extra securitate)

Google OAuth `hd=bono.ro` parameter e deja Ã®n cod. Asta face ca Google sÄ propunÄ doar conturile @bono.ro la login. Extra: poÈi restricÈiona Èi la nivel de Google Workspace Admin.

## Pas 4: Deploy pe Vercel (3 min)

### OpÈiunea A: Push pe GitHub + import

1. CreeazÄ un repo pe GitHub (ex: `prioritracker`)
2. Push codul:
   ```bash
   cd prioritracker
   git init && git add . && git commit -m "PrioriTracker v1"
   git remote add origin git@github.com:bono-ro/prioritracker.git
   git push -u origin main
   ```
3. Mergi la **https://vercel.com/new** â import repo-ul
4. Framework preset: **Vite**
5. AdaugÄ **Environment Variables**:
   - `VITE_SUPABASE_URL` = URL-ul din Supabase â Settings â API
   - `VITE_SUPABASE_ANON_KEY` = cheia `anon` `public` din aceeaÈi paginÄ
6. Click **Deploy**

### OpÈiunea B: Vercel CLI

```bash
npm i -g vercel
cd prioritracker
vercel --prod
# La Ã®ntrebÄri: acceptÄ defaults, adaugÄ env vars cÃ¢nd Èi se cere
```

## Pas 5: ConfigureazÄ domeniul (opÈional)

1. Ãn Vercel â Settings â Domains
2. AdaugÄ `tracker.bono.ro` (sau ce domeniu vrei)
3. AdaugÄ CNAME-ul Ã®n DNS

**IMPORTANT:** DupÄ adÄugarea domeniului, actualizeazÄ Èi:
- **Google OAuth** â Authorized redirect URIs â adaugÄ noul domeniu
- **Supabase** â Authentication â URL Configuration â Site URL â seteazÄ URL-ul final

## Pas 6: ImportÄ datele seed (opÈional)

Prima datÄ cÃ¢nd deschizi PrioriTracker, baza de date e goalÄ. Ai douÄ opÈiuni:

1. **Import JSON** â foloseÈte butonul "â Import" din app
2. **AdaugÄ manual** â butonul "+ Prioritate"

Datele mock din versiunea HTML nu se migreazÄ automat â sunt doar pentru prototip.

---

## StructurÄ fiÈiere

```
prioritracker/
âââ index.html              # Entry point
âââ package.json
âââ vite.config.js
âââ .env.example            # Template env vars
âââ src/
â   âââ main.jsx
â   âââ App.jsx             # Main app component
â   âââ lib/
â   â   âââ supabase.js     # Supabase client
â   â   âââ constants.js    # Colors, modules, phases
â   â   âââ helpers.js      # Date utils, task status
â   âââ hooks/
â   â   âââ useAuth.js      # Google OAuth + profiles
â   â   âââ useData.js      # CRUD priorities/tasks/comments/links
â   âââ components/
â       âââ UI.jsx           # Field, Chip, Badge, Btn, Overlay, SidePanel
â       âââ LoginScreen.jsx  # Google login screen
â       âââ Forms.jsx        # PriorityForm, TaskForm, ImportModal
â       âââ TaskPage.jsx     # Task detail side panel
â       âââ PriorityPage.jsx # Priority detail side panel
âââ supabase/
    âââ schema.sql           # Tables + triggers
    âââ rls.sql              # Row Level Security policies
```
