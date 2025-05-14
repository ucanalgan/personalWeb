# Personal Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ucanalgan/personalWeb?style=social)](https://github.com/ucanalgan/personalWeb/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ucanalgan/personalWeb?style=social)](https://github.com/ucanalgan/personalWeb/network/members)

A modern, responsive personal portfolio website built with the latest web technologies. Features a coding-themed 3D background, dark/light mode support, and smooth animations.

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
- 3D coding-themed particle background using Three.js
- Dark/Light mode toggle with persistent user preference
- Smooth animations powered by GSAP
- Performance-optimized scroll animations with Intersection Observer API
- Fully responsive design using Tailwind CSS
- Modular ES Modules architecture for maintainable code

## Technologies

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Three.js
- GSAP
- Chart.js
- Vite
- Remix Icons

## Project Structure

```
personalWeb/
├── animations.js         # GSAP animations
├── background3d.js       # Three.js 3D background
├── theme.js              # Dark/light theme functionality
├── script.js             # Additional JS scripts
├── main.js               # Main JavaScript entry point
├── index.html            # Main HTML file
├── style.css             # Main stylesheet
├── package.json          # Project dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── README.md             # Project documentation
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
# http://localhost:3000
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

After the server is running, navigate to `http://localhost:3000` in your browser. Use the theme toggle in the navigation bar to switch between dark and light modes. Scroll to see interactive charts, animations, and the 3D background.

## Customization

- **Theme Colors**: Modify colors in `tailwind.config.js`.
- **3D Background**: Tweak particle settings in `background3d.js`.
- **Animations**: Adjust GSAP timelines in `animations.js`.

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