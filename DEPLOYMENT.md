# Deployment Guide

This guide will help you deploy your Car Rental Application to the web so anyone can access it.

## Prerequisites

1.  **GitHub Account**: You need to push your code to a GitHub repository.
2.  **MongoDB Atlas**: You need a cloud database.
3.  **Cloudinary**: For image hosting (you already have this).
4.  **Email Service**: Gmail App Password (you already have this).

## Step 1: Push Code to GitHub

1.  Create a new repository on GitHub.
2.  Push your code to the repository.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

## Step 2: Database Setup (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Create a database user (username/password).
4.  Allow access from anywhere (IP: `0.0.0.0/0`) in Network Access.
5.  Get the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/car-rental?retryWrites=true&w=majority`).

## Step 3: Backend Deployment (Render)

We will use [Render](https://render.com) for the backend as it offers a free tier.

1.  Sign up for Render and connect your GitHub account.
2.  Click **New +** and select **Web Service**.
3.  Select your repository.
4.  **Configuration**:
    *   **Name**: `car-rental-backend` (or similar)
    *   **Root Directory**: `server` (Important!)
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Add these in the "Environment" tab):
    *   `NODE_ENV`: `production`
    *   `PORT`: `10000` (Render uses this port internally)
    *   `MONGO_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A strong secret key.
    *   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary name.
    *   `CLOUDINARY_API_KEY`: Your Cloudinary key.
    *   `CLOUDINARY_API_SECRET`: Your Cloudinary secret.
    *   `EMAIL_SERVICE`: `gmail`
    *   `EMAIL_USERNAME`: Your email.
    *   `EMAIL_PASSWORD`: Your app password.
    *   `FROM_EMAIL`: Your email.
    *   `CLIENT_URL`: The URL of your frontend (we will get this in Step 4, you can update it later).
6.  Click **Create Web Service**.
7.  Wait for deployment. Copy the **Service URL** (e.g., `https://car-rental-backend.onrender.com`).

## Step 4: Frontend Deployment (Vercel)

We will use [Vercel](https://vercel.com) for the frontend.

1.  Sign up for Vercel and connect your GitHub account.
2.  Click **Add New...** > **Project**.
3.  Import your repository.
4.  **Configuration**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: `client` (Important! Click "Edit" to select the `client` folder).
5.  **Environment Variables**:
    *   `VITE_API_URL`: The Backend Service URL from Step 3 (e.g., `https://car-rental-backend.onrender.com/api`).
    *   *Note: Make sure to add `/api` at the end.*
6.  Click **Deploy**.
7.  Once deployed, you will get a domain (e.g., `https://car-rental-frontend.vercel.app`).

## Step 5: Final Configuration

1.  Go back to **Render (Backend)** > **Environment**.
2.  Update `CLIENT_URL` with your new Vercel Frontend URL (e.g., `https://car-rental-frontend.vercel.app`).
3.  Save changes. Render will redeploy automatically.

## Done!

Your website is now live! Share the Vercel link with anyone.

## How to Update Your Website

Since you connected your GitHub repository to Render and Vercel, updating your website is very easy:

1.  **Make Changes**: Edit your code on your computer (VS Code).
2.  **Test**: Run `npm run dev` to make sure everything works locally.
3.  **Push to GitHub**: Run the following commands in your terminal:
    ```bash
    git add .
    git commit -m "Description of your changes"
    git push
    ```
4.  **Automatic Redeploy**:
    *   **Render** (Backend) and **Vercel** (Frontend) will automatically detect the new code on GitHub.
    *   They will automatically start building and deploying the new version.
    *   In a few minutes, your live website will be updated with your changes!

