# Deployment and Build Process in Nuxt.js

## Introduction

Nuxt.js offers flexible deployment options for different hosting environments. This guide covers the build process, deployment strategies, and platform-specific configurations.

## Build Process Overview

### Development vs Production

```bash
# Development - Hot reload, detailed errors
npm run dev

# Production build - Optimized bundles
npm run build

# Preview production build locally
npm run preview

# Generate static site
npm run generate
```

### Build Outputs

Nuxt creates different outputs based on your configuration:

- **SSR/Universal**: Server bundle + client bundle
- **SPA**: Client-side only bundle
- **Static**: Pre-generated HTML files
- **Hybrid**: Mix of the above based on route rules

## Build Configuration

### Basic Build Settings

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Build directory
  buildDir: '.nuxt',
  
  // Generate directory for static builds
  generate: {
    dir: 'dist'
  },
  
  // Nitro configuration (server engine)
  nitro: {
    // Output directory
    output: {
      dir: '.output'
    },
    
    // Prerender configuration
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/robots.txt']
    },
    
    // Minification
    minify: true,
    
    // Compression
    compressPublicAssets: true
  },
  
  // Vite configuration
  vite: {
    build: {
      // Rollup options
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router']
          }
        }
      }
    }
  }
})
```

### Environment-Specific Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Runtime configuration
  runtimeConfig: {
    // Server-side only
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    
    // Public (exposed to client)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      gtmId: process.env.NUXT_PUBLIC_GTM_ID,
      environment: process.env.NODE_ENV
    }
  },
  
  // Development-only modules
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  // Production optimizations
  experimental: {
    payloadExtraction: false // Reduce bundle size
  }
})
```

## Deployment Platforms

### Vercel

#### Automatic Deployment

```json
// vercel.json
{
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ]
}
```

#### Environment Variables

```bash
# .env.example
NUXT_PUBLIC_API_BASE=https://api.example.com
DATABASE_URL=postgresql://...
API_SECRET=your-secret-key
```

#### Build Command Configuration

```json
// package.json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  }
}
```

### Netlify

#### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server"
  status = 200

[[headers]]
  for = "/_nuxt/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Netlify Functions

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'netlify'
  }
})
```

### Cloudflare Pages

#### Wrangler Configuration

```toml
# wrangler.toml
name = "my-nuxt-app"
compatibility_date = "2024-01-01"

[env.production]
vars = { NUXT_PUBLIC_API_BASE = "https://api.example.com" }

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

#### Build Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages'
  }
})
```

```json
// package.json
{
  "scripts": {
    "deploy": "nuxt build && wrangler pages deploy"
  }
}
```

### Static Hosting (GitHub Pages, S3, etc.)

#### Static Generation

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Generate static site
  ssr: false, // SPA mode
  
  // Or use static generation with SSR
  nitro: {
    prerender: {
      crawlLinks: true
    }
  },
  
  // Base URL for GitHub Pages
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/repository-name/' : '/'
  }
})
```

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run generate
      env:
        NUXT_PUBLIC_API_BASE: ${{ secrets.API_BASE }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Docker Deployment

#### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  nuxt-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - API_SECRET=${API_SECRET}
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Traditional VPS/Server

#### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'nuxt-app',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/nuxt-app
server {
    listen 80;
    server_name example.com www.example.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Static assets
    location /_nuxt/ {
        alias /path/to/app/.output/public/_nuxt/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Public assets
    location /public/ {
        alias /path/to/app/.output/public/;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Proxy to Nuxt.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npx nuxi analyze

# Or with build flag
npm run build -- --analyze
```

### Code Splitting

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor libraries
            vendor: ['vue', 'vue-router'],
            
            // UI components
            ui: ['@headlessui/vue', '@heroicons/vue'],
            
            // Utils
            utils: ['lodash', 'date-fns']
          }
        }
      }
    }
  }
})
```

### Asset Optimization

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  
  image: {
    // Optimize images
    format: ['webp', 'avif'],
    quality: 80,
    
    // Image providers
    providers: {
      cloudinary: {
        baseURL: 'https://res.cloudinary.com/your-cloud/image/fetch/'
      }
    }
  },
  
  // CSS optimization
  css: ['~/assets/css/main.css'],
  
  postcss: {
    plugins: {
      autoprefixer: {},
      cssnano: process.env.NODE_ENV === 'production' ? {} : false
    }
  }
})
```

### Caching Strategies

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Static pages - cache forever
    '/': { 
      prerender: true,
      headers: { 'cache-control': 's-maxage=31536000' }
    },
    
    // API routes - short cache
    '/api/**': {
      headers: { 'cache-control': 's-maxage=60' }
    },
    
    // Dynamic pages - ISR
    '/blog/**': {
      isr: 3600, // Revalidate every hour
      headers: { 'cache-control': 's-maxage=3600' }
    }
  }
})
```

## Environment Management

### Environment Variables

```bash
# .env.local (local development)
DATABASE_URL=postgresql://localhost:5432/myapp_dev
API_SECRET=dev-secret
NUXT_PUBLIC_API_BASE=http://localhost:3001/api

# .env.production (production)
DATABASE_URL=postgresql://prod-server:5432/myapp_prod
API_SECRET=super-secure-secret
NUXT_PUBLIC_API_BASE=https://api.myapp.com
```

### Configuration by Environment

```typescript
// nuxt.config.ts
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  // Development-only features
  devtools: { enabled: isDev },
  
  // Production optimizations
  experimental: {
    payloadExtraction: !isDev
  },
  
  runtimeConfig: {
    // Server-only
    databaseUrl: process.env.DATABASE_URL,
    apiSecret: process.env.API_SECRET,
    
    // Client-exposed
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version
    }
  },
  
  // Conditional modules
  modules: [
    '@nuxt/content',
    ...(isProd ? ['@nuxtjs/robots'] : [])
  ]
})
```

## CI/CD Pipeline Examples

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run test
  only:
    - merge_requests
    - main

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .output/
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh
  script:
    - rsync -avz --delete .output/ user@server:/path/to/app/
    - ssh user@server "cd /path/to/app && pm2 restart nuxt-app"
  only:
    - main
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        PM2_HOME = '/var/www/.pm2'
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'nvm use ${NODE_VERSION}'
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run lint'
                sh 'npm run test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    rsync -avz --delete .output/ /var/www/nuxt-app/
                    cd /var/www/nuxt-app
                    pm2 reload ecosystem.config.js --env production
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

## Monitoring and Debugging

### Health Checks

```typescript
// server/api/health.get.ts
export default defineEventHandler(async (event) => {
  try {
    // Check database connection
    await $fetch('/api/db/ping')
    
    // Check external APIs
    await $fetch('https://api.external-service.com/health')
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    }
  } catch (error) {
    setResponseStatus(event, 503)
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
```

### Error Tracking

```typescript
// plugins/error-tracking.client.ts
export default defineNuxtPlugin(() => {
  // Initialize error tracking (e.g., Sentry)
  if (process.client) {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
      // Send to error tracking service
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      // Send to error tracking service
    })
  }
})
```

## Best Practices

1. **Use environment variables** for configuration
2. **Implement proper caching** strategies
3. **Optimize assets** and bundle size
4. **Set up health checks** and monitoring
5. **Use CI/CD pipelines** for automated deployments
6. **Configure proper error handling** and logging
7. **Implement security headers** and HTTPS
8. **Monitor performance** and core web vitals
9. **Use CDN** for static assets
10. **Implement proper backup** and disaster recovery

## Troubleshooting Common Issues

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .nuxt .output node_modules
npm install
npm run build

# Check for TypeScript errors
npx nuxi typecheck
```

### Memory Issues

```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' nuxt build"
  }
}
```

### Deployment Issues

```typescript
// nuxt.config.ts - Debug mode
export default defineNuxtConfig({
  nitro: {
    logLevel: process.env.NODE_ENV === 'development' ? 4 : 1
  }
})
```

This comprehensive guide covers the essential aspects of building and deploying Nuxt.js applications across various platforms and environments.