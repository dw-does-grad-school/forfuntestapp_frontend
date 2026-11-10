# Forme frontend

The React/Vite app uses Clerk for authentication and Convex for the athlete profile.

## Local development

1. Copy `.env.example` to `.env.local` and set `VITE_CLERK_PUBLISHABLE_KEY` from your Clerk application and `VITE_CONVEX_URL` from your Convex deployment.
2. In Clerk, enable Google, Facebook, and Apple under **User & Authentication → Social connections**. Configure each provider's credentials and add your local/deployed app URLs to the Clerk allowed origins and redirect URLs.
3. Configure the Clerk JWT template for Convex as described in the [backend setup](https://github.com/dw-does-grad-school/forfuntestproject_backend#clerk-authentication).
4. Run `npm install` and `npm run dev`.

The app starts in the system color scheme. The appearance button cycles through system, dark, and light; the explicit choice is saved in local storage.

## Production build

Run `npm run build`, then serve the generated `dist/` directory from a static host. Set the same two public environment variables in the host's build configuration.
