# Practical 4: JavaScript DOM Manipulation and UI Interactivity

## Academic Information
- **Course**: Web Development Frameworks (`ITUE203`)
- **Institution**: CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
- **Faculty**: Faculty of Technology and Engineering (FTE) / CSPIT
- **Department**: Computer Engineering
- **Semester**: 3rd Semester, Academic Year 2026–27
- **Course Outcomes**: `CO3, CO4`

---

## 1. Aim / Objective
To design and implement dynamic client-side interactions in the StudentHub web application using Vanilla JavaScript (ES6+), DOM element selection, class manipulation, event listeners, accessible modal dialogs, collapsible accordions, a multi-item content slider, a dismissible banner, responsive navigation, and `localStorage` theme persistence without external JS libraries.

---

## 2. Requirements & Key Features
1. **Collapsible FAQ Section**: Accordion widget with animated height transition and accessible `aria-expanded` attributes.
2. **Accessible Modal Popup**: Overlay modal supporting backdrop clicks, keyboard `<kbd>Escape</kbd>` dismissal, and focus restoration.
3. **Image / Content Slider**: Carousel with smooth CSS transformations, Previous/Next navigation, interactive dot indicators, auto-play with pause-on-hover, and keyboard arrow navigation.
4. **Dismissible Notification Banner**: Header alert banner with smooth removal transition.
5. **Responsive Hamburger Navigation**: Mobile menu toggle updating `aria-expanded` and closing on outside clicks or link activation.
6. **Light / Dark Theme Switcher**: CSS custom properties toggled via JavaScript and persisted in browser `localStorage`.
7. **Interactive DOM Playground**: Real-time status update, dynamic list item creation/deletion, and counter state mutation.

---

## 3. Technologies Used
- **HTML5**: Semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<dialog>` ARIA attributes).
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Transitions, `@media (prefers-reduced-motion)`.
- **JavaScript (ES6+)**: `addEventListener()`, `querySelector()`, `classList`, `localStorage`, template literals, Arrow functions.

---

## 4. File Structure
```
Practical 4/
├── index.html       # Primary demonstration HTML page
├── style.css        # Responsive stylesheet with light/dark theme variables
├── script.js        # Modular vanilla JavaScript logic
└── README.md        # Comprehensive documentation and viva preparation
```

---

## 5. Implementation Summary
- **Theme Persistence**: Evaluates `localStorage.getItem('studenthub_theme')`. Toggles `data-theme` attribute on `<body>` between `light` and `dark`, dynamically switching color tokens defined in `style.css`.
- **Event Listeners**: Attached via `addEventListener('click')` and `addEventListener('keydown')`. No inline `onclick` attributes are used, conforming to Content Security Policy (CSP) guidelines.
- **Accessibility**: ARIA attributes (`aria-expanded`, `aria-controls`, `aria-roledescription`, `aria-modal`, `role="dialog"`) ensure screen reader compatibility.

---

## 6. How to Run
1. Open the project folder in VS Code or any text editor.
2. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge), or run using VS Code Live Server:
   ```bash
   # Or using Node.js http-server
   npx serve "Practical 4"
   ```
3. Test theme switching, slider navigation, modal popup, FAQ accordion, and mobile hamburger menu.

---

## 7. Manual Test Checklist

| Test No. | Component / Feature | Action / Test Case | Expected Behavior | Result |
|:---:|---|---|---|:---:|
| **TC-01** | Theme Switcher | Click "Dark Mode" button in header | Page colors invert to dark palette; button text becomes "Light Mode"; preference saved in `localStorage`. | **PASS** |
| **TC-02** | Theme Persistence | Refresh browser page while in dark mode | Dark mode persists immediately on load without flash of unstyled content. | **PASS** |
| **TC-03** | Banner Dismissal | Click "&times;" on notification banner | Banner fades out and collapses smoothly; height transitions to 0. | **PASS** |
| **TC-04** | Hamburger Menu | Reduce viewport width < 768px, click hamburger icon | Mobile nav menu slides in; `aria-expanded` toggles to `true`; closes on link click. | **PASS** |
| **TC-05** | Content Slider | Click Next/Prev buttons or dots | Slide transforms horizontally (`translateX`); active indicator updates; loops seamlessly. | **PASS** |
| **TC-06** | Slider Keyboard | Press `ArrowRight` or `ArrowLeft` | Active slide transitions according to arrow key pressed. | **PASS** |
| **TC-07** | Modal Open / Close | Click "Open Interactive Modal", then click Close or backdrop | Modal appears centered with dark backdrop blur; closes on dismiss. | **PASS** |
| **TC-08** | Modal Escape Key | Open modal and press `Escape` key | Modal dismisses instantly and focus returns to opener button. | **PASS** |
| **TC-09** | FAQ Accordion | Click FAQ question header | Answer expands; chevron rotates 180°; other active items collapse. | **PASS** |
| **TC-10** | DOM Insertion | Enter skill name in playground and click "Add Item" | New `<li>` dynamically appended with working delete button. | **PASS** |

---

## 8. Viva Questions & Answers

**Q1: What is the DOM (Document Object Model)?**  
*Answer:* The DOM is a programming API and tree structure representation of HTML documents created by the browser. It allows programming languages like JavaScript to dynamically read, create, modify, and delete HTML elements, attributes, and styles.

**Q2: What is the difference between `querySelector()` and `getElementById()`?**  
*Answer:* `getElementById()` accepts an ID string and is optimized for speed, returning a single matching element. `querySelector()` accepts any valid CSS selector string (classes, attributes, pseudo-selectors, compound paths) and returns the first matching element.

**Q3: Why should we use `addEventListener()` instead of inline attributes like `onclick`?**  
*Answer:* `addEventListener()` supports multiple listeners on the same element, separates JavaScript logic cleanly from HTML markup, supports event capturing and bubbling control, and complies with modern Content Security Policies (CSP).

**Q4: How does `localStorage` differ from `sessionStorage` and cookies?**  
*Answer:* `localStorage` persists data indefinitely across browser sessions and tabs until explicitly cleared (capacity ~5MB). `sessionStorage` is scoped to a single tab and expires when the tab is closed. Cookies are limited to 4KB, expire based on server headers, and are sent with every HTTP request.

**Q5: How do you handle accessibility in custom modals and accordions?**  
*Answer:* By setting ARIA attributes such as `aria-expanded="true/false"`, `role="dialog"`, `aria-modal="true"`, managing focus when opened, supporting the <kbd>Escape</kbd> key to dismiss, and returning focus to the trigger element on close.
