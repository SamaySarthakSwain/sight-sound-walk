# Lets Explore

## Project info

MVP LINK:https://letsexploreit.netlify.app/

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>
# Step 2: Navigate to the project directory.

cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- HTML,CSS,JS
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

**URL**: https://lovable.dev/projects/31b4df35-e9aa-4d85-ae89-d8c29e0a0d52

## 🚀 Deployment to Vercel

To deploy this project to Vercel and ensure smooth operation:

1. **GitHub Integration**: Connect your repository to Vercel.
2. **Environment Variables**: Add the following from your `.env` (refer to `.env.example`):
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
3. **Settings**: Vercel should auto-detect:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Smooth Routing**: A [`vercel.json`](./vercel.json) has been added to handle SPA routing and prevent 404 errors on sub-routes.

Trial

I am Samay .
