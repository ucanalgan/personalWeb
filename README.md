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
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Customization](#customization)
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

## Technologies

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Vite (Build tool)
- GSAP (Animations)
- Remix Icons
- GitHub API Integration

## Project Structure

```
personalWeb/
├── animations.js        # GSAP animations
├── app.js               # Main application logic
├── dom.js               # DOM manipulation utilities
├── form-handler.js      # Contact form validation
├── github.js            # GitHub API integration
├── index.html           # Main HTML file
├── main.js              # Entry point
├── style.css            # Main stylesheet (Tailwind CSS)
├── theme.js             # Dark theme functionality
├── utils.js             # Utility functions
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

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

This will create a `dist` directory with optimized production files.

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

## Customization

- **Theme Colors**: Modify colors in `tailwind.config.js`
- **Profile Information**: Update personal details in `index.html`
- **GitHub Username**: Change the GitHub username in `app.js` to pull your own repos
- **Projects Display**: Adjust the project card styling in `style.css`
- **Animations**: Modify animation timings and effects in `animations.js`

## Performance Optimizations

This portfolio website implements several performance optimizations:

- **Code Splitting**: JavaScript is modularized for better loading performance
- **Lazy Loading**: Images and heavy components load only when needed
- **Proper Image Sizing**: Images use srcset for responsive loading
- **CSS Optimization**: Tailwind's JIT compiler for minimal CSS
- **Deferred Animations**: Non-critical animations are deferred until idle time
- **Accessibility**: Supports prefers-reduced-motion for users who prefer minimal animations

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