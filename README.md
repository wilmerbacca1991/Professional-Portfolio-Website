# Wilmer Bacca - Professional Portfolio Website

A modern, responsive portfolio website showcasing skills, projects, and professional experience with a sleek glow-in-the-dark theme and advanced interactive features.

🌐 **Live Site**: [View Portfolio](https://wilmerbacca1991.github.io/Professional-Portfolio-Website/)

---

## 🎨 Design Features

### Visual Design
- **Glow-in-the-dark Theme**: Neon green accents (#00E6A8) on dark navy backgrounds
- **3D Card Effects**: Perspective transforms and hover animations on project cards
- **Custom Scrollbar**: Auto-hiding glowing green scrollbar with pulsing animation
- **Scroll Progress Indicator**: Real-time scroll percentage display synchronized with scrollbar
- **Animated Background**: Dynamic particle system with interactive hover effects
- **Glassmorphism**: Backdrop blur effects on navigation and cards

### Responsive Design
- **Mobile-First Approach**: Optimized for all screen sizes (320px - 4K displays)
- **Hamburger Navigation**: Touch-friendly mobile menu with smooth transitions
- **Adaptive Layouts**: Flexbox and CSS Grid for responsive sections
- **Touch Optimizations**: Coarse pointer detection for mobile devices
- **Orientation Support**: Landscape and portrait modes

---

## 🛠️ Technical Skills Demonstrated

### Frontend Technologies
- **HTML5**: Semantic markup, accessibility features (ARIA labels, meta tags)
- **CSS3**: Advanced features including:
  - Custom properties (CSS variables) for theming
  - Flexbox and Grid layouts
  - Animations and keyframes
  - Transforms and transitions
  - Media queries for responsive design
  - Backdrop filters and blend modes
  - CSS containment for performance
- **Vanilla JavaScript (ES6+)**: No frameworks, pure JavaScript for:
  - DOM manipulation
  - Event handling and delegation
  - Intersection Observer API
  - LocalStorage for persistence
  - Async/await for API calls
  - Custom scrollbar logic
  - Dynamic content loading

### Architecture & Organization
- **Modular CSS**: Separated stylesheets by concern:
  - `styles.css` - Core styles and scrollbar
  - `css/hero.css` - Hero section styling
  - `css/sections.css` - Main content sections
  - `css/form.css` - Contact form styling
  - `css/background.css` - Animated background
  - `css/interactive-features.css` - Hover effects and animations
  - `css/live-stats.css` - Live statistics section
  - `css/mobile-optimizations.css` - Mobile responsive styles
  - `css/optimizations.css` - Performance optimizations

- **Modular JavaScript**: Organized scripts by functionality:
  - `js/main.js` - Core navigation and scroll behavior
  - `js/scripts.js` - Interactive features and form handling
  - `js/background.js` - Particle animation system
  - `js/interactive-features.js` - UI interactions
  - `js/portfolio-api.js` - WakaTime API integration
  - `js/project-tracking.js` - Project analytics

### Performance Optimization
- **Critical CSS Loading**: Preload critical resources
- **DNS Prefetch & Preconnect**: Optimized external resource loading
- **Lazy Loading**: Deferred non-critical assets
- **Hardware Acceleration**: CSS `will-change`, `transform`, `contain` properties
- **Debounced Events**: Optimized scroll and resize handlers
- **Resource Hints**: Link prefetch for fonts and APIs

### API Integration
- **WakaTime API**: Real-time coding statistics and activity tracking
- **Formspree**: Contact form submission handling
- **GitHub Integration**: Project deployment via GitHub Pages

### SEO & Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Meta Tags**: Open Graph, Twitter Cards, description, keywords
- **Structured Data**: JSON-LD for rich search results
- **Robots.txt & Sitemap**: Search engine optimization
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility

### DevOps & Deployment
- **Docker Support**: Containerized deployment with Nginx
- **Version Control**: Git with semantic commit messages
- **GitHub Actions**: Automated deployment pipeline
- **Package Management**: npm for development dependencies
- **Live Server**: Development environment setup

---

## 📁 Project Structure

```
├── index.html              # Main entry point
├── styles.css              # Core styles and custom scrollbar
├── package.json            # Dependencies and scripts
├── Dockerfile              # Docker containerization
├── Procfile                # Heroku deployment config
├── robots.txt              # SEO crawler instructions
├── sitemap.xml             # Site structure for search engines
├── README.md               # Project documentation
│
├── css/                    # Modular stylesheets
│   ├── background.css      # Animated particle background
│   ├── colors.css          # Color variables and theme
│   ├── components.css      # Reusable components
│   ├── form.css            # Contact form styling
│   ├── hero.css            # Hero section styles
│   ├── interactive-features.css  # Hover effects and animations
│   ├── live-stats.css      # WakaTime statistics section
│   ├── mobile-optimizations.css  # Responsive mobile styles
│   ├── optimizations.css   # Performance optimizations
│   ├── project.css         # Project cards and layouts
│   ├── sections.css        # Main content sections
│   └── styles.css          # Legacy styles (being deprecated)
│
├── js/                     # JavaScript modules
│   ├── main.js             # Navigation and scroll logic
│   ├── scripts.js          # Interactive features and form handler
│   ├── background.js       # Particle animation engine
│   ├── interactive-features.js  # UI interactions
│   ├── portfolio-api.js    # WakaTime API integration
│   └── project-tracking.js # Project view analytics
│
├── assets/                 # Static assets
│   ├── head.html           # Reusable head metadata
│   ├── images/             # Photos and project screenshots
│   │   ├── Pic of Myself.jpg
│   │   ├── devflow-logo.svg
│   │   ├── fastgraph-logo.svg
│   │   └── insight-logo.svg
│   └── *.svg               # Project logos and icons
│
└── pages/                  # Individual project pages
    ├── about.html
    ├── contact.html
    ├── cv.html
    ├── experience.html
    ├── projects.html
    └── projects/
        ├── devflow.html
        ├── fastgraph.html
        └── insight.html
```

---

## 🚀 Quick Start

### Local Development

1. **Clone the repository**:
   ```powershell
   git clone https://github.com/wilmerbacca1991/Professional-Portfolio-Website.git
   cd Professional-Portfolio-Website
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Start development server**:
   ```powershell
   npm start
   ```
   The site will open at `http://localhost:8080`

### Docker Deployment

1. **Build the Docker image**:
   ```powershell
   docker build -t wilmer-portfolio .
   ```

2. **Run the container**:
   ```powershell
   docker run -p 8080:80 -d wilmer-portfolio
   ```
   Access at `http://localhost:8080`

### Static Deployment

Simply open `index.html` in any modern web browser. For production:
- **GitHub Pages**: Automatically deployed from main branch
- **Netlify/Vercel**: Drag and drop the entire folder
- **Any Static Host**: Upload all files maintaining the directory structure

---

## ✨ Key Features

### 1. Custom Scrollbar System
- Auto-hiding glowing green scrollbar (desktop & mobile)
- Synchronized scroll progress indicator
- Cross-browser support (Chrome, Firefox, Edge, Safari)
- Smooth animations with CSS keyframes

### 2. Live Coding Statistics
- Real-time WakaTime API integration
- Display coding hours, languages, and recent activity
- Auto-refreshing statistics
- Fallback states for API errors

### 3. Interactive Project Cards
- 3D hover effects with perspective transforms
- Smooth transitions and animations
- Responsive grid layout
- Individual project detail pages

### 4. Contact Form
- Formspree integration for email submissions
- Client-side validation
- Success/error feedback
- Accessible form controls

### 5. Animated Background
- Canvas-based particle system
- Mouse interaction with particles
- Performance-optimized rendering
- Responsive to screen size changes

### 6. Smart Navigation
- Sticky header with scroll behavior
- Active section highlighting
- Smooth scroll to anchors
- Mobile hamburger menu

---

## 🔧 Configuration

### WakaTime Integration
Update the API key in `js/portfolio-api.js`:
```javascript
const WAKATIME_API_KEY = 'your-wakatime-api-key';
```

### Contact Form
Replace Formspree endpoint in `index.html`:
```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

### Analytics (Optional)
Add analytics provider in HTML `<head>`:
```html
<meta name="analytics-provider" content="plausible">
<meta name="analytics-site-id" content="your-site-id">
```

Supported providers: `plausible`, `ga`, `ga4`

---

## 🎯 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Minimum requirements**: ES6 support, CSS Grid, Flexbox

---

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ Performance, 100 Accessibility
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Mobile Optimized**: Fully responsive with touch support
- **SEO Optimized**: Structured data and meta tags

---

## 🔐 Security Features

- Content Security Policy headers (when deployed via Nginx)
- No inline scripts (external JS files)
- Secure form submission via HTTPS
- No sensitive data stored client-side

---

## 🤝 Contributing

This is a personal portfolio project. However, if you find bugs or have suggestions:

1. Open an issue on GitHub
2. Describe the bug/feature clearly
3. Include screenshots if applicable

---

## 📄 License

This project is open source and available for learning purposes. Feel free to use the code structure and techniques, but please create your own content and design.

---

## 📧 Contact

**Wilmer Bacca**
- Email: wilmerbacca1991@gmail.com
- LinkedIn: [Wilmer Bacca](https://linkedin.com/in/wilmer-bacca)
- GitHub: [@wilmerbacca1991](https://github.com/wilmerbacca1991)

---

## 🙏 Acknowledgments

- **Fonts**: Google Fonts (Sora, Fira Code)
- **Icons**: Custom SVG designs
- **APIs**: WakaTime, Formspree
- **Hosting**: GitHub Pages
- **Inspiration**: Modern portfolio designs and glow-in-the-dark aesthetics

---

**Built with ❤️ and vanilla JavaScript - No frameworks, just pure web fundamentals**
