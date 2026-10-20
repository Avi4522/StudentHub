/**
 * StudentHub - Practical 4: JavaScript DOM Manipulation and UI Interactivity
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Theme Management (Light / Dark Mode with localStorage Persistence)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const THEME_STORAGE_KEY = 'studenthub_theme';

    /**
     * Apply the specified theme to the document body and update UI controls
     * @param {'light' | 'dark'} theme 
     */
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.innerHTML = '&#9728;'; // Sun icon
            themeLabel.textContent = 'Light Mode';
        } else {
            themeIcon.innerHTML = '&#9790;'; // Moon icon
            themeLabel.textContent = 'Dark Mode';
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Theme toggle button click listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // --------------------------------------------------------------------------
    // 2. Dismissible Notification Banner
    // --------------------------------------------------------------------------
    const notificationBanner = document.getElementById('notificationBanner');
    const closeBannerBtn = document.getElementById('closeBannerBtn');

    if (closeBannerBtn && notificationBanner) {
        closeBannerBtn.addEventListener('click', () => {
            notificationBanner.classList.add('dismissed');
            // Remove from accessibility tree after transition completes
            setTimeout(() => {
                notificationBanner.style.display = 'none';
            }, 300);
        });
    }

    // --------------------------------------------------------------------------
    // 3. Responsive Hamburger Navigation Menu
    // --------------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const primaryNav = document.getElementById('primaryNav');

    if (hamburgerBtn && primaryNav) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
            hamburgerBtn.classList.toggle('is-active');
            primaryNav.classList.toggle('is-active');
        });

        // Close mobile nav when clicking a nav link
        const navLinks = primaryNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                hamburgerBtn.classList.remove('is-active');
                primaryNav.classList.remove('is-active');
            });
        });

        // Close on clicking outside the navbar
        document.addEventListener('click', (event) => {
            if (!primaryNav.contains(event.target) && !hamburgerBtn.contains(event.target) && primaryNav.classList.contains('is-active')) {
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                hamburgerBtn.classList.remove('is-active');
                primaryNav.classList.remove('is-active');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 4. Content / Image Slider (Carousel)
    // --------------------------------------------------------------------------
    const sliderTrack = document.getElementById('sliderTrack');
    const slides = sliderTrack ? Array.from(sliderTrack.querySelectorAll('.slide')) : [];
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');
    let currentSlideIndex = 0;
    let autoSlideInterval = null;

    if (slides.length > 0 && sliderTrack) {
        // Create indicator dots dynamically
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoSlide();
            });
            sliderDotsContainer.appendChild(dot);
        });

        const dots = Array.from(sliderDotsContainer.querySelectorAll('.slider-dot'));

        function updateSliderUI() {
            sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            slides.forEach((s, idx) => {
                s.classList.toggle('active', idx === currentSlideIndex);
            });
            dots.forEach((d, idx) => {
                const isActive = idx === currentSlideIndex;
                d.classList.toggle('active', isActive);
                d.setAttribute('aria-selected', String(isActive));
            });
        }

        function goToSlide(index) {
            currentSlideIndex = (index + slides.length) % slides.length;
            updateSliderUI();
        }

        function nextSlide() {
            goToSlide(currentSlideIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentSlideIndex - 1);
        }

        if (prevSlideBtn) {
            prevSlideBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        if (nextSlideBtn) {
            nextSlideBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        // Keyboard navigation for carousel
        document.addEventListener('keydown', (e) => {
            const sliderRect = sliderTrack.getBoundingClientRect();
            const inViewport = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;
            if (inViewport) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetAutoSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetAutoSlide();
                }
            }
        });

        // Auto-play carousel every 5 seconds with pause-on-hover
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        const sliderWrapper = document.querySelector('.slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            sliderWrapper.addEventListener('mouseleave', () => startAutoSlide());
        }

        startAutoSlide();
    }

    // --------------------------------------------------------------------------
    // 5. Collapsible FAQ Accordion with ARIA States
    // --------------------------------------------------------------------------
    const faqAccordion = document.getElementById('faqAccordion');
    if (faqAccordion) {
        const faqItems = Array.from(faqAccordion.querySelectorAll('.faq-item'));

        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            const answerDiv = item.querySelector('.faq-answer');

            if (questionBtn && answerDiv) {
                questionBtn.addEventListener('click', () => {
                    const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

                    // Optional: Close other open accordion items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherBtn = otherItem.querySelector('.faq-question');
                            const otherAns = otherItem.querySelector('.faq-answer');
                            if (otherBtn && otherAns) {
                                otherBtn.setAttribute('aria-expanded', 'false');
                                otherItem.classList.remove('active');
                                otherAns.hidden = true;
                            }
                        }
                    });

                    // Toggle current item
                    if (isExpanded) {
                        questionBtn.setAttribute('aria-expanded', 'false');
                        item.classList.remove('active');
                        answerDiv.hidden = true;
                    } else {
                        questionBtn.setAttribute('aria-expanded', 'true');
                        item.classList.add('active');
                        answerDiv.hidden = false;
                    }
                });
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. Accessible Modal Popup
    // --------------------------------------------------------------------------
    const demoModal = document.getElementById('demoModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalActionBtn = document.getElementById('modalActionBtn');
    let lastFocusedElement = null;

    function openModal() {
        if (!demoModal) return;
        lastFocusedElement = document.activeElement;
        demoModal.hidden = false;
        // Trigger class after unhiding for CSS transition
        requestAnimationFrame(() => {
            demoModal.classList.add('is-visible');
        });
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        if (closeModalBtn) closeModalBtn.focus();
    }

    function closeModal() {
        if (!demoModal) return;
        demoModal.classList.remove('is-visible');
        document.body.style.overflow = '';
        setTimeout(() => {
            demoModal.hidden = true;
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }, 300);
    }

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalActionBtn) modalActionBtn.addEventListener('click', closeModal);

    // Dismiss modal on backdrop click
    if (demoModal) {
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                closeModal();
            }
        });
    }

    // Dismiss modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal && !demoModal.hidden) {
            closeModal();
        }
    });

    // --------------------------------------------------------------------------
    // 7. Interactive DOM Manipulation Playground
    // --------------------------------------------------------------------------
    // Status text manipulation
    const targetStatusText = document.getElementById('targetStatusText');
    const btnSetSuccess = document.getElementById('btnSetSuccess');
    const btnSetWarning = document.getElementById('btnSetWarning');
    const btnResetStatus = document.getElementById('btnResetStatus');

    if (targetStatusText) {
        if (btnSetSuccess) {
            btnSetSuccess.addEventListener('click', () => {
                targetStatusText.className = 'status-box is-success';
                targetStatusText.innerHTML = 'Current Status: <strong>Ready &amp; Verified</strong> &#10004;';
            });
        }

        if (btnSetWarning) {
            btnSetWarning.addEventListener('click', () => {
                targetStatusText.className = 'status-box is-warning';
                targetStatusText.innerHTML = 'Current Status: <strong>Pending Review</strong> &#9888;';
            });
        }

        if (btnResetStatus) {
            btnResetStatus.addEventListener('click', () => {
                targetStatusText.className = 'status-box';
                targetStatusText.innerHTML = 'Current Status: <strong>Idle</strong>';
            });
        }
    }

    // Dynamic Element Insertion
    const newSkillInput = document.getElementById('newSkillInput');
    const btnAddSkillBtn = document.getElementById('btnAddSkillBtn');
    const dynamicSkillList = document.getElementById('dynamicSkillList');

    function addNewSkill() {
        if (!newSkillInput || !dynamicSkillList) return;
        const skillText = newSkillInput.value.trim();
        if (skillText === '') return;

        const li = document.createElement('li');
        li.textContent = skillText;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-sm btn-outline';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('aria-label', `Remove ${skillText}`);
        removeBtn.style.padding = '2px 8px';
        removeBtn.style.marginLeft = '8px';
        removeBtn.addEventListener('click', () => {
            li.remove();
        });

        li.appendChild(removeBtn);
        dynamicSkillList.appendChild(li);
        newSkillInput.value = '';
        newSkillInput.focus();
    }

    if (btnAddSkillBtn) btnAddSkillBtn.addEventListener('click', addNewSkill);
    if (newSkillInput) {
        newSkillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addNewSkill();
            }
        });
    }

    // Counter state mutation
    const counterValue = document.getElementById('counterValue');
    const btnIncrement = document.getElementById('btnIncrement');
    const btnDecrement = document.getElementById('btnDecrement');
    const btnResetCounter = document.getElementById('btnResetCounter');
    let counter = 0;

    function updateCounterDisplay() {
        if (!counterValue) return;
        counterValue.textContent = String(counter);
        if (counter > 0) {
            counterValue.style.color = '#10b981';
        } else if (counter < 0) {
            counterValue.style.color = '#ef4444';
        } else {
            counterValue.style.color = 'var(--brand-primary)';
        }
    }

    if (btnIncrement) {
        btnIncrement.addEventListener('click', () => {
            counter++;
            updateCounterDisplay();
        });
    }

    if (btnDecrement) {
        btnDecrement.addEventListener('click', () => {
            counter--;
            updateCounterDisplay();
        });
    }

    if (btnResetCounter) {
        btnResetCounter.addEventListener('click', () => {
            counter = 0;
            updateCounterDisplay();
        });
    }
});
