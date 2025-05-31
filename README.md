# Kadri Gjini - Portfolio Website

A modern, animated portfolio website inspired by creative design and built with vanilla HTML, CSS, and JavaScript.

## 🌟 Features

- **Modern Design**: Clean, minimalist aesthetic inspired by top portfolio sites
- **Responsive Layout**: Looks great on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS animations and scroll-triggered effects
- **Interactive Elements**: Hover effects, parallax scrolling, and dynamic content
- **Contact Form**: Functional contact form with validation
- **Performance Optimized**: Fast loading with optimized code

## 🎨 Design Inspiration

This portfolio draws inspiration from:
- [Veronica Zubakova](https://veronicazubakova.com) - Clean, professional UX/UI design
- [Bettina Sosa](https://www.bettinasosa.com/) - Creative typography and modern aesthetics

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Customize** the content to match your information
4. **Deploy** to your preferred hosting platform

## 📁 File Structure

```
portfolio/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```

## 🛠️ Customization Guide

### Personal Information

**Update the following sections in `index.html`:**

1. **Hero Section** (lines 42-66):
   - Change the title and subtitle text
   - Update the description paragraph
   - Modify the call-to-action buttons

2. **About Section** (lines 75-120):
   - Replace the about text with your story
   - Update the goal section
   - Modify the statistics numbers

3. **Projects Section** (lines 130-220):
   - Replace project cards with your own projects
   - Update project titles, descriptions, and tech stacks
   - Add your project links

4. **Skills Section** (lines 230-310):
   - Add/remove programming languages
   - Update tools and platforms
   - Modify skill categories

5. **Contact Section** (lines 320-370):
   - Update social media links
   - Change contact description
   - Modify contact form action (if using a backend)

### Styling Customization

**In `styles.css`, you can modify:**

1. **Color Scheme** (lines 8-20):
   ```css
   :root {
       --primary-color: #6366f1;    /* Main brand color */
       --secondary-color: #8b5cf6;  /* Secondary brand color */
       --accent-color: #f59e0b;     /* Accent color */
       /* ... other colors */
   }
   ```

2. **Typography**:
   - Change the font family in the Google Fonts link
   - Modify font sizes in the respective sections

3. **Animations**:
   - Adjust animation durations in the keyframes
   - Modify hover effects throughout the CSS

### Adding Your Projects

Replace the project cards with your own:

```html
<div class="project-card" data-project="your-project">
    <div class="project-image">
        <div class="project-overlay">
            <div class="project-links">
                <a href="your-project-link" class="project-link" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Name</h3>
        <p class="project-description">
            Your project description here.
        </p>
        <div class="project-tech">
            <span class="tech-tag">Tech 1</span>
            <span class="tech-tag">Tech 2</span>
        </div>
    </div>
</div>
```

### Contact Form Integration

To make the contact form functional:

1. **Option 1: Use a service like Formspree**
   ```html
   <form class="form" action="https://formspree.io/f/your-form-id" method="POST">
   ```

2. **Option 2: Use Netlify Forms** (if hosting on Netlify)
   ```html
   <form class="form" name="contact" method="POST" data-netlify="true">
   ```

3. **Option 3: Integrate with your own backend**
   - Modify the JavaScript in `script.js`
   - Add your API endpoint for form submission

## 🌐 Deployment Options

### 1. GitHub Pages
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select your branch and deploy

### 2. Netlify
1. Drag and drop your folder on [Netlify](https://netlify.com)
2. Your site will be live instantly
3. Automatic form handling available

### 3. Vercel
1. Import your project on [Vercel](https://vercel.com)
2. Deploy with zero configuration

### 4. Traditional Web Hosting
Upload files via FTP to any web hosting provider

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🎯 Performance Tips

1. **Optimize Images**: Compress any images you add
2. **Minify Code**: Use tools to minify CSS and JS for production
3. **CDN**: Use a CDN for Font Awesome and Google Fonts
4. **Lazy Loading**: Add lazy loading for images if you add many

## 🔧 Troubleshooting

**Common Issues:**

1. **Animations not working**: Check if JavaScript is enabled
2. **Mobile menu not working**: Ensure the JavaScript file is loading
3. **Form not submitting**: Set up a form handling service
4. **Fonts not loading**: Check internet connection for Google Fonts CDN

## 📄 License

This project is open source. Feel free to use it as inspiration for your own portfolio!

## 🤝 Credits

- **Design Inspiration**: Veronica Zubakova & Bettina Sosa
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)
- **Built by**: Kadri Gjini (kadri24)

---

### 💡 Tips for Success

1. **Keep it Updated**: Regularly update your projects and skills
2. **Add Analytics**: Consider adding Google Analytics to track visitors
3. **SEO Optimization**: Add meta tags and descriptions
4. **Performance**: Test your site speed and optimize accordingly
5. **Accessibility**: Ensure your site is accessible to all users

### 🎨 Future Enhancements

Consider adding:
- Dark mode toggle
- Blog section
- Project filtering
- Testimonials section
- Resume download
- Advanced animations with libraries like AOS or GSAP

---

**Happy coding! 🚀**

For questions or support, reach out to kadri24 on any platform! 