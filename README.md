# Personal Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ucanalgan/personalWeb?style=social)](https://github.com/ucanalgan/personalWeb/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ucanalgan/personalWeb?style=social)](https://github.com/ucanalgan/personalWeb/network/members)

A modern, responsive personal portfolio website built with the latest web technologies. Features a clean developer-friendly design with a dark theme, smooth animations, and GitHub integration.

![Portfolio Preview](https://raw.githubusercontent.com/ucanalgan/personalWeb/master/images/image.png)

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Color Scheme](#color-scheme)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [GitHub Integration](#github-integration)
- [Customization](#customization)
- [Performance Optimizations](#performance-optimizations)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Demo

A live demo of the website is available at: [Live Demo](https://ucanalgan.github.io/personalWeb)

## Features

- Modern design with a professional and responsive layout
- Developer-friendly dark theme with primary cyan accent color (#64ffda)
- Performance-optimized with Vite/Rollup bundling for JS/CSS
- Lazy-loading for heavy components
- Optimized image loading with srcset and proper dimensions
- Smooth animations powered by GSAP
- Accessibility improvements with semantic landmarks and ARIA attributes
- GitHub integration for projects and activities
- Mobile-responsive with tailored experiences for all device sizes
- Modular ES Modules architecture for maintainable code
- Form validation for contact section
- Critical CSS extraction for faster initial loading

## Technologies

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Vite (Build tool)
- GSAP (Animations)
- Remix Icons
- GitHub API Integration
- PostCSS & Autoprefixer
- Rollup (bundling)

## Project Structure

```
personalWeb/
├── animations.js        # GSAP animations and scroll effects
├── app.js               # Main application logic and initialization
├── dom.js               # DOM manipulation utilities and event handlers
├── form-handler.js      # Contact form validation and submission
├── github.js            # GitHub API integration for projects and activities
├── index.html           # Main HTML file with page structure
├── main.js              # JavaScript entry point
├── style.css            # Main stylesheet (Tailwind CSS)
├── theme.js             # Dark theme functionality
├── utils.js             # Utility functions and helpers
├── vite.config.js       # Vite configuration with critical CSS extraction
├── tailwind.config.js   # Tailwind CSS configuration with theme colors
├── postcss.config.js    # PostCSS configuration for Tailwind
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## Color Scheme

The portfolio uses a carefully selected color palette that enhances readability and provides a developer-friendly experience:

- **Primary Color**: `#64ffda` (Cyan accent for highlighting important elements)
- **Background**: `#0a192f` (Dark blue background for the main theme)
- **Text Colors**: Light gray variations for better readability on dark backgrounds
- **Card Backgrounds**: Various opacity levels of `#112240` and `#233554` for depth
- **Hover States**: Lighter variations of the primary color

These colors can be customized in the `tailwind.config.js` file under the colors section.

## Prerequisites

- Node.js (v14+ recommended)
- npm (v6+ or later)
- A modern browser (Chrome, Firefox, Edge, Safari)

## Installation & Setup

```powershell
# Clone the repository
git clone https://github.com/ucanalgan/personalWeb.git

# Navigate to the project directory
cd personalWeb

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser and visit:
# http://localhost:5173
```

### Building for Production

```powershell
npm run build
```

This will create a `dist` directory with optimized production files. The build process includes:

- JavaScript bundling and minification
- CSS optimization with critical CSS extraction
- Asset optimization
- Console log removal in production
- ES2015 compatibility

### Deployment to GitHub Pages

1. Install the `gh-pages` package:

   ```bash
   npm install --save-dev gh-pages
   ```

2. Add a deployment script to your `package.json`:

   ```json
   "scripts": {
     /* existing scripts */,  
     "deploy": "gh-pages -d dist"
   }
   ```

3. Ensure `base` in `vite.config.js` is set to `/personalWeb/`, then run:

   ```bash
   npm run build
   npm run deploy
   ```

Your site will be published to the `gh-pages` branch and available at: `https://ucanalgan.github.io/personalWeb/`.

## Usage

After the server is running, navigate to `http://localhost:5173` in your browser. The site features:

- **Responsive Navigation**: Menu adapts to all screen sizes with a mobile drawer
- **GitHub Projects Section**: Displays your latest GitHub repositories with stars and forks
- **GitHub Activities**: Shows your recent GitHub activity
- **Skills Section**: Visualizes your technical skills with progress bars
- **Contact Form**: Includes form validation for user input
- **Smooth Scrolling**: For a better user experience when navigating between sections

## GitHub Integration

The portfolio automatically fetches and displays your GitHub projects and activities:

### Project Display

- Repositories are fetched from the GitHub API and displayed in a responsive grid
- Each project card shows:
  - Repository name with link
  - Description (if available)
  - Star count with icon
  - Fork count with icon

### Activity Timeline

- Recent GitHub activities are displayed chronologically
- Each activity shows:
  - Activity type (Push, Pull Request, etc.)
  - Repository name with link

To customize the GitHub username, modify the `githubUsername` variable in `app.js`:

```javascript
const githubUsername = 'your-github-username';
```

## Customization

- **Theme Colors**: Modify colors in `tailwind.config.js`
- **Profile Information**: Update personal details in `index.html`
- **GitHub Username**: Change the GitHub username in `app.js` to pull your own repos
- **Projects Display**: Adjust the project card styling in `style.css`
- **Animations**: Modify animation timings and effects in `animations.js`
- **Skills**: Update your skill levels in the HTML markup in the skills section
- **Social Links**: Add or modify social media links in the header and footer
- **Form Handling**: Customize form validation in `form-handler.js`

## Performance Optimizations

This portfolio website implements several performance optimizations:

- **Code Splitting**: JavaScript is modularized for better loading performance
- **Lazy Loading**: Images and heavy components load only when needed
- **Proper Image Sizing**: Images use srcset for responsive loading
- **CSS Optimization**: Tailwind's JIT compiler for minimal CSS
- **Critical CSS Extraction**: Uses Rollup plugin for inline critical CSS
- **Deferred Animations**: Non-critical animations are deferred until idle time
- **Accessibility**: Supports prefers-reduced-motion for users who prefer minimal animations
- **Console Cleanup**: Production builds remove console logs
- **Conditional Loading**: Features like animations are only loaded if the user hasn't enabled reduced motion

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/awesome-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add awesome feature'`
5. Push to the branch: `git push origin feature/awesome-feature`
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Umutcan Algan  
GitHub: [@ucanalgan](https://github.com/ucanalgan)  
LinkedIn: [linkedin.com/in/umutcan-algan](https://www.linkedin.com/in/umutcan-algan/)  
Email: umutcanalgan91@gmail.com

Project Link: [https://github.com/ucanalgan/personalWeb](https://github.com/ucanalgan/personalWeb)