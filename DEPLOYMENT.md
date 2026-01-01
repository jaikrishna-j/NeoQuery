# Deployment Guide

This guide explains how to deploy NeoQuery to production.

## Architecture

- **Frontend**: Deployed on Vercel (Next.js)
- **Backend**: Deployed on Render (FastAPI)

## Frontend Deployment (Vercel)

### Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your GitHub repository connected to Vercel

### Steps

1. **Connect Repository to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Configure Environment Variables**:
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
   Replace `your-backend-url` with your actual Render backend URL.

3. **Deploy**:
   - Vercel will automatically detect Next.js and deploy
   - The build command is: `npm run build`
   - The output directory is: `.next`

4. **Update CORS in Backend**:
   After getting your Vercel frontend URL, update the backend's `ALLOWED_ORIGINS` environment variable in Render to include your Vercel URL.

## Backend Deployment (Render)

### Prerequisites

1. A Render account (sign up at https://render.com)
2. Your GitHub repository connected to Render

### Steps

1. **Create New Web Service**:
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**:
   - **Name**: `neoquery-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**:
   In Render dashboard, add these environment variables:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```
   Replace `your-frontend-url` with your actual Vercel frontend URL.

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the service URL (e.g., `https://neoquery-backend.onrender.com`)

5. **Update Frontend**:
   - Go back to Vercel and update `NEXT_PUBLIC_API_URL` with your Render backend URL

### Important Notes for Render

- **Free Tier Limitations**: Render free tier services spin down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.
- **Tesseract OCR**: Render doesn't include Tesseract by default. For image OCR to work, you may need to:
  - Use a Dockerfile with Tesseract pre-installed, or
  - Disable image OCR features, or
  - Use a paid Render plan with custom buildpacks

### Alternative: Using Dockerfile for Backend

If you need Tesseract OCR, create a `Dockerfile` in the `backend` directory:

```dockerfile
FROM python:3.11-slim

# Install system dependencies including Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Then update Render configuration:
- **Environment**: `Docker`
- Remove build and start commands (Dockerfile handles this)

## Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is accessible at Vercel URL
- [ ] Frontend can communicate with backend (check browser console)
- [ ] CORS is properly configured (no CORS errors in browser)
- [ ] Environment variables are set correctly
- [ ] Health check endpoint works: `https://your-backend-url.onrender.com/health`
- [ ] API documentation is accessible: `https://your-backend-url.onrender.com/docs`

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check that `ALLOWED_ORIGINS` in Render includes your Vercel URL
2. Ensure the URL matches exactly (including `https://`)
3. Restart the Render service after updating environment variables

### Backend Not Responding

1. Check Render service logs
2. Verify `OPENROUTER_API_KEY` is set correctly
3. Check that the service is not sleeping (free tier limitation)

### Frontend Can't Connect to Backend

1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Check that the backend URL is correct
3. Ensure backend is running and accessible
4. Check browser console for specific error messages

## Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., `https://neoquery-backend.onrender.com`)

### Backend (Render)
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend origins (e.g., `https://neoquery.vercel.app`)

