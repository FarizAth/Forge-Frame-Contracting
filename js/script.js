/* ==========================================================================
   FORGE & FRAME CONTRACTING - INTERACTIVE JAVASCRIPT ENGINE
   Includes: Frame-by-Frame Hero Player with Scroll Scrubbing, Sequential Copywriting,
   Before/After Slider, Portfolio Filters, Custom Desktop Cursor, Modal Controller, and FAQs.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. CONFIGURATION & STATE
    // ----------------------------------------------------------------------
    const HERO_CONFIG = {
        folder: 'frames/',
        filenamePattern: 'ezgif-frame-',
        fileExtension: '.jpg',
        frameCount: 133
    };

    // ----------------------------------------------------------------------
    // 2. SCROLL-DRIVEN HERO CANVAS PLAYER & SEQUENTIAL COPYWRITING
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('heroCanvas');
    const heroSection = document.getElementById('hero');
    const heroSteps = document.querySelectorAll('.hero-step');

    if (canvas && heroSection) {
        const ctx = canvas.getContext('2d');
        const progressBar = document.getElementById('heroProgress');
        const statusText = document.getElementById('statusText');

        let frames = [];
        let loadedFramesCount = 0;
        let currentFrameIndex = 0;

        const padNumber = (num, size = 3) => {
            let s = "000" + num;
            return s.substring(s.length - size);
        };

        const renderFrame = (index) => {
            const img = frames[index];
            if (img && img.complete && img.naturalWidth !== 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };

        const updateFrameOnScroll = () => {
            const sectionRect = heroSection.getBoundingClientRect();
            const scrollableDistance = heroSection.offsetHeight - window.innerHeight;

            if (scrollableDistance <= 0) return;

            // Calculate fraction scrolled through the hero section (0.0 to 1.0)
            let scrollFraction = -sectionRect.top / scrollableDistance;
            scrollFraction = Math.max(0, Math.min(1, scrollFraction));

            // Map scroll fraction to frame index (0 to 132)
            const targetFrame = Math.floor(scrollFraction * (HERO_CONFIG.frameCount - 1));

            if (targetFrame !== currentFrameIndex) {
                currentFrameIndex = targetFrame;
                renderFrame(currentFrameIndex);

                if (progressBar) {
                    const progress = ((currentFrameIndex + 1) / HERO_CONFIG.frameCount) * 100;
                    progressBar.style.width = `${progress}%`;
                }
            }

            // Sync Copywriting Steps with Scroll Position
            let activeStep = 1;
            if (scrollFraction > 0.66) {
                activeStep = 3;
            } else if (scrollFraction > 0.33) {
                activeStep = 2;
            }

            heroSteps.forEach(step => {
                const stepNum = parseInt(step.getAttribute('data-step'), 10);
                if (stepNum === activeStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        };

        // Scroll Listener with RequestAnimationFrame
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateFrameOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        const preloadHeroFrames = () => {
            for (let i = 1; i <= HERO_CONFIG.frameCount; i++) {
                const img = new Image();
                const frameNum = padNumber(i);
                img.src = `${HERO_CONFIG.folder}${HERO_CONFIG.filenamePattern}${frameNum}${HERO_CONFIG.fileExtension}`;

                img.onload = () => {
                    loadedFramesCount++;
                    if (loadedFramesCount === 1) {
                        renderFrame(0);
                    }
                    if (loadedFramesCount === HERO_CONFIG.frameCount) {
                        if (statusText) statusText.textContent = "SCROLL TO TRANSFORM";
                        updateFrameOnScroll();
                    }
                };

                img.onerror = () => {
                    loadedFramesCount++;
                };

                frames.push(img);
            }
        };

        preloadHeroFrames();
    }

    // ----------------------------------------------------------------------
    // 3. INTERACTIVE BEFORE / AFTER SLIDER
    // ----------------------------------------------------------------------
    const baContainer = document.getElementById('baSliderContainer');
    const baBeforeLayer = document.getElementById('baBeforeLayer');
    const baHandle = document.getElementById('baHandle');

    if (baContainer && baBeforeLayer && baHandle) {
        let isDragging = false;

        const updateSliderPosition = (clientX) => {
            const rect = baContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;
            baBeforeLayer.style.width = `${percentage}%`;
            baHandle.style.left = `${percentage}%`;
        };

        baContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        baContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // ----------------------------------------------------------------------
    // 4. MOBILE NAVIGATION DRAWER
    // ----------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                mobileMenu.classList.remove('open');
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                mobileMenu.classList.add('open');
                mobileMenu.setAttribute('aria-hidden', 'false');
                mobileToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. STICKY HEADER SCROLL EFFECT
    // ----------------------------------------------------------------------
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ----------------------------------------------------------------------
    // 6. PORTFOLIO CATEGORY FILTERING (projects.html)
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectGalleryItems = document.querySelectorAll('.project-gallery-item');

    if (filterButtons.length > 0 && projectGalleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectGalleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 7. PROJECT DETAILS MODAL DIALOG (projects.html)
    // ----------------------------------------------------------------------
    const modal = document.getElementById('projectModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    if (modal) {
        const modalTitle = document.getElementById('modalTitle');
        const modalLoc = document.getElementById('modalLoc');
        const modalScope = document.getElementById('modalScope');
        const modalDuration = document.getElementById('modalDuration');
        const modalDetails = document.getElementById('modalDetails');

        const openModal = (btn) => {
            if (modalTitle) modalTitle.textContent = btn.getAttribute('data-title');
            if (modalLoc) modalLoc.textContent = btn.getAttribute('data-location');
            if (modalScope) modalScope.textContent = btn.getAttribute('data-scope');
            if (modalDuration) modalDuration.textContent = btn.getAttribute('data-duration');
            if (modalDetails) modalDetails.textContent = btn.getAttribute('data-details');

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => openModal(btn));
        });

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    // ----------------------------------------------------------------------
    // 8. FAQ ACCORDION TOGGLE
    // ----------------------------------------------------------------------
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const content = faqItem.querySelector('.faq-content');
            const isOpen = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                item.querySelector('.faq-content').style.maxHeight = null;
            });

            if (!isOpen) {
                faqItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ----------------------------------------------------------------------
    // 9. CUSTOM DESKTOP CURSOR FOLLOWER
    // ----------------------------------------------------------------------
    const customCursor = document.getElementById('customCursor');

    if (customCursor && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });

        const hoverables = document.querySelectorAll('a, button, .service-card, .project-card, .ba-handle');
        hoverables.forEach(elem => {
            elem.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
            elem.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
        });
    }

    // ----------------------------------------------------------------------
    // 10. CONTACT FORM MAILTO FALLBACK
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const location = document.getElementById('propertyLocation').value;
            const projectType = document.getElementById('projectType').value;
            const budget = document.getElementById('estimatedBudget').value;
            const desc = document.getElementById('projectDescription').value;

            const subject = encodeURIComponent(`Project Inquiry from ${name} - ${projectType}`);
            const body = encodeURIComponent(
                `Full Name: ${name}\n` +
                `Phone: ${phone}\n` +
                `Location: ${location}\n` +
                `Project Type: ${projectType}\n` +
                `Estimated Budget: ${budget}\n\n` +
                `Project Details:\n${desc}`
            );

            contactForm.action = `mailto:info@forgeandframecontracting.com?subject=${subject}&body=${body}`;
        });
    }

});