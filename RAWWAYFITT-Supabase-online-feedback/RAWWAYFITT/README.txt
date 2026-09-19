RAWWAYFITT — ONLINE FEEDBACK SYSTEM

This version connects the website to Supabase.

FILES
- index.html — public website
- script.js — public feedback submission + approved feedback display
- supabase-config.js — Supabase URL + publishable key
- feedback-admin.html — authenticated admin feedback manager
- SUPABASE-SETUP.sql — final RLS/admin SQL
- style.css — website styling
- certificates/ — certificate images
- images/ — Rakesh fitness images

SUPABASE SETUP
1. Your Supabase project is already created.
2. The original feedback table SQL should already have been run.
3. Open Supabase → SQL Editor.
4. Open SUPABASE-SETUP.sql from this folder and run all of it.
5. Open feedback-admin.html on your website.
6. Create an admin account using your email and password.
7. If email confirmation is enabled, confirm your email first and then sign in.
8. The admin page will show your Supabase Auth user UUID and an INSERT statement.
9. Copy that INSERT statement into Supabase → SQL Editor and run it.
10. Return to feedback-admin.html and click CHECK ADMIN ACCESS.
11. You can now approve or reject client feedback.

SECURITY
- The website uses the Supabase publishable/browser key only.
- Do NOT put a Supabase secret/service-role key in any HTML or JavaScript file.
- Public visitors can insert feedback only as pending with permission=true.
- Public visitors can read only approved feedback.
- Only users listed in public.admin_users can read pending/rejected feedback or change feedback status.

DEPLOYMENT
This is a static HTML/CSS/JS website and can be hosted on GitHub Pages, Netlify, Vercel, or another static host.
