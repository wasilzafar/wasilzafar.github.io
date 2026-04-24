/* ============================================
   Main Consolidated JavaScript File
   ============================================ */

/* ============================================
   Leaflet Map Functionality
   ============================================ */

function initLeafletMaps() {
    // Check if Leaflet is available and element exists
    if (typeof L === 'undefined') return;

    // Map 1 - Basic map with markers, circles, and polygons
    if (document.getElementById('map')) {
        const map = L.map('map').setView([53.28749, -6.37466], 18);

        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const marker = L.marker([53.28775, -6.37446]).addTo(map).bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

        const circle = L.circle([53.28775, -6.37446], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 50
        }).addTo(map).bindPopup('I am a circle.');

        const polygon = L.polygon([
            [53.28790, -6.37520],
            [53.28762, -6.37418],
            [53.28745, -6.37503]
        ]).addTo(map).bindPopup('I am a polygon.');

        const popup = L.popup();

        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent(`You clicked the map at ${e.latlng.toString()}`)
                .openOn(map);
        }

        map.on('click', onMapClick);
    }

    // Map 2 - Advanced map with layer controls
    if (document.getElementById('map2')) {
        const map2 = L.map('map2').setView([53.28749, -6.37466], 4);

        const basemaps = {
            Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
                layers: 'TOPO-WMS'
            }),
            Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
                layers: 'OSM-Overlay-WMS'
            }),
            HILLShades: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
                layers: 'SRTM30-Colored-Hillshade'
            }),
            'Topography, then places': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
                layers: 'TOPO-WMS,OSM-Overlay-WMS'
            }),
            'Places, then topography': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
                layers: 'OSM-Overlay-WMS,TOPO-WMS'
            })
        };

        L.control.layers(basemaps).addTo(map2);
        basemaps.Topography.addTo(map2);

        function onMapClick(e) {
            L.circle(e.latlng, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 50
            }).addTo(map2).bindPopup('I am a circle.');
        }

        map2.on('click', onMapClick);
    }

    // Map 3 - Layer groups and controls
    if (document.getElementById('map3')) {
        const littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
            denver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
            aurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
            golden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

        const cities = L.layerGroup([littleton, denver, aurora, golden]);

        const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        });

        const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        const map3 = L.map('map3', {
            center: [39.73, -104.99],
            zoom: 10,
            layers: [osm, cities]
        });

        const baseMaps = {
            "OpenStreetMap": osm,
            "Mapbox Streets": streets
        };

        const overlayMaps = {
            "Cities": cities
        };

        const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map3);

        // Add parks layer
        const crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.'),
            rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');

        const parks = L.layerGroup([crownHill, rubyHill]);
        const satellite = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id: 'MapID',
            tileSize: 512,
            zoomOffset: -1,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        layerControl.addBaseLayer(satellite, "Satellite");
        layerControl.addOverlay(parks, "Parks");
    }
}

/* ============================================
   Cookie Banner Initialization
   ============================================ */

function initCookieBanner() {
    if (typeof jQuery !== 'undefined' && jQuery.fn.cookieBanner) {
        jQuery.fn.cookieBanner();
    }
}

/* ============================================
   Navbar Scroll Detection & Active Section Highlighting
   ============================================ */

let scrollTimeout;

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-v16 .link-3d');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Check if section is in viewport (with offset for navbar height)
        if (window.pageYOffset >= sectionTop - window.innerHeight / 3) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active links
    navLinks.forEach(link => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('is-active');
        }
    });
}

/* ============================================
   Smooth Scroll Navigation
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip links handled by mega dropdown
            if (this.hasAttribute('data-mega-trigger')) return;

            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link after scroll
                setTimeout(updateNavOnScroll, 500);
            }
        });
    });
}

/* ============================================
   Lazy Image Loading
   ============================================ */

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
}

/* ============================================
   Scroll Animations - Advanced
   ============================================ */

function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const scrollElements = document.querySelectorAll(
            '.animate-on-scroll, .skill-card, .interest-card, .scroll-animate-left, .scroll-animate-right, .scroll-animate-up'
        );
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add 'active' class to trigger animation
                    entry.target.classList.add('active');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        scrollElements.forEach(el => elementObserver.observe(el));
    }
}

/* ============================================
   About Section Enhanced Scroll Detection
   ============================================ */

function initAboutScrollAnimations() {
    const aboutSection = document.querySelector('.about-scroll-section');
    if (!aboutSection) return;

    const aboutTextHighlights = aboutSection.querySelectorAll('.about-text-highlight, .about-meta');
    const aboutSubtitle = aboutSection.querySelector('.about-subtitle');
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        // Text highlight effect based on viewport position
        aboutTextHighlights.forEach((textEl) => {
            const rect = textEl.getBoundingClientRect();
            const elementCenterY = rect.top + (rect.height / 2);
            
            // Highlight when element crosses middle of viewport
            if (elementCenterY <= windowHeight / 2) {
                textEl.classList.add('highlight-active');
            } else {
                textEl.classList.remove('highlight-active');
            }
        });
        
        // Underline animation for subtitle
        if (aboutSubtitle) {
            const subtitleRect = aboutSubtitle.getBoundingClientRect();
            const subtitleCenterY = subtitleRect.top + (subtitleRect.height / 2);
            
            if (subtitleCenterY <= windowHeight / 1.5) {
                aboutSubtitle.classList.add('animate-underline');
            }
        }
        
        // Image shadow enhancement on scroll
        const aboutImage = aboutSection.querySelector('.about-image-wrapper');
        if (aboutImage) {
            const imageRect = aboutImage.getBoundingClientRect();
            const distanceFromCenter = Math.abs(imageRect.top - windowHeight / 2);
            const proximityRatio = Math.max(0, 1 - (distanceFromCenter / windowHeight));
            
            const shadowBlur = 20 + (proximityRatio * 20);
            const shadowOpacity = 0.2 + (proximityRatio * 0.15);
            
            aboutImage.style.filter = `drop-shadow(0 ${10 + proximityRatio * 10}px ${shadowBlur}px rgba(59, 152, 151, ${shadowOpacity}))`;
        }
    });
}

/* ============================================
   Parallax Text Animation (Flying In Effect)
   ============================================ */

function initParallaxTextAnimation() {
    const aboutContent = document.querySelector('.about-content');
    if (!aboutContent) return;
    
    const textElements = aboutContent.querySelectorAll('p');
    
    window.addEventListener('scroll', function() {
        textElements.forEach((para, index) => {
            const rect = para.getBoundingClientRect();
            const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
            
            if (isInViewport) {
                const scrollProgress = 1 - (rect.top / window.innerHeight);
                const maxOffset = 30;
                const offset = Math.min(maxOffset, scrollProgress * maxOffset * 2);
                
                para.style.transform = `translateX(${offset}px)`;
                para.style.opacity = Math.min(1, scrollProgress * 1.5);
            }
        });
    });
}

/* ============================================
   Keyboard Navigation
   ============================================ */

function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const navLinks = document.querySelectorAll('.nav-v16 .link-3d');
        const activeLink = document.querySelector('.nav-v16 .link-3d.is-active');
        
        if (!navLinks.length) return;
        
        var currentIndex = Array.prototype.indexOf.call(navLinks, activeLink);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            var nextIndex = (currentIndex + 1) % navLinks.length;
            if (navLinks[nextIndex]) {
                navLinks[nextIndex].focus();
                navLinks[nextIndex].click();
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            var prevIndex = currentIndex <= 0 ? navLinks.length - 1 : currentIndex - 1;
            if (navLinks[prevIndex]) {
                navLinks[prevIndex].focus();
                navLinks[prevIndex].click();
            }
        }
    });
}

/* ============================================
   Parallax Depth Cards
   ============================================ */

function initParallaxCards() {
    const parallaxCards = document.querySelectorAll('.parallax-card');
    
    parallaxCards.forEach(card => {
        const cardWrap = card.querySelector('.card-wrap');
        
        card.addEventListener('mousemove', (e) => {
            if (!cardWrap) return;
            
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const rotateX = ((mouseY - centerY) / centerY) * 15;
            const rotateY = ((centerX - mouseX) / centerX) * 15;
            
            cardWrap.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            if (!cardWrap) return;
            cardWrap.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}



/* ============================================
   Initialization on DOM Ready
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Leaflet maps if present
    initLeafletMaps();

    // Initialize cookie banner if present
    initCookieBanner();

    // Initialize interests mega dropdown (before smooth scroll so it can mark its trigger)
    initInterestsMegaDropdown();
    
    // Initialize smooth scroll navigation
    initSmoothScroll();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize About section enhanced scroll animations
    initAboutScrollAnimations();
    
    // Initialize parallax text animation
    initParallaxTextAnimation();
    
    // Initialize keyboard navigation
    initKeyboardNavigation();

    // Initialize parallax cards
    initParallaxCards();
    
    // Initial navbar update
    updateNavOnScroll();
});

/* ============================================
   Scroll Event Listener with Debouncing
   ============================================ */

window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(updateNavOnScroll);
});

/* ============================================
   Design 16 Navbar — Mobile Toggle
   ============================================ */

function toggleNav16() {
    var nav = document.querySelector('.nav-v16');
    if (nav) {
        nav.classList.toggle('nav-open');
    }
}

// Close mobile menu when a nav link is clicked
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-v16 .link-3d').forEach(function(link) {
        link.addEventListener('click', function() {
            var nav = document.querySelector('.nav-v16');
            if (nav) nav.classList.remove('nav-open');
        });
    });
});

/* ============================================
   Google Analytics Event Tracking via GTM
   ============================================
   Event names use GA4 recommended names where applicable:
   - select_content  : article CTA clicks & interest card clicks
   - cta_click       : hero CTA button clicks
   - navigation_click: internal nav link clicks
   - social_share    : social media link clicks
   - footer_click    : footer link clicks
   - file_download   : doc generator downloads (pushed from doc-generator-core.js)
   - contact_form_submit : contact form submission (pushed from contact.html)
   - scroll_depth    : scroll milestones (handled via GTM native trigger)
   - print_article   : browser print triggered

   Each event includes engagement_type for GTM filtering:
   article_cta | interest_cta | hero_cta | navigation | social_link | footer_link
============================================ */

function initAnalyticsTracking() {
    // ===== 1. Track all CTA "Read Article" button clicks (Category Pages) =====
    const readArticleButtons = document.querySelectorAll('.cta-read-article');
    
    readArticleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const trackingData = {
                event: 'select_content',
                engagement_type: 'article_cta',
                action: 'read_article',
                category: this.getAttribute('data-category') || 'uncategorized',
                article_slug: this.getAttribute('data-article-slug') || 'unknown',
                element_id: this.getAttribute('data-tracking-id') || 'unknown',
                timestamp: new Date().toISOString(),
                source_page: window.location.pathname
            };
            
            // Push to Google Tag Manager data layer
            if (window.dataLayer) {
                window.dataLayer.push(trackingData);
            }
            
            console.log('[Analytics] Read Article Click:', trackingData);
        });
    });

    // ===== 2. Track Navigation Links (Homepage & All Pages) =====
    const navLinks = document.querySelectorAll('.cta-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const trackingData = {
                event: 'navigation_click',
                engagement_type: 'navigation',
                action: 'navigate_section',
                section: this.getAttribute('data-section') || 'unknown',
                element_id: this.getAttribute('data-tracking-id') || 'unknown',
                timestamp: new Date().toISOString(),
                source_page: window.location.pathname
            };
            
            if (window.dataLayer) {
                window.dataLayer.push(trackingData);
            }
            
            console.log('[Analytics] Navigation Click:', trackingData);
        });
    });

    // ===== 3. Track Hero CTAs (Homepage) =====
    const heroCtaButtons = document.querySelectorAll('.cta-hero-cta');
    
    heroCtaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const trackingData = {
                event: 'cta_click',
                engagement_type: 'hero_cta',
                action: this.getAttribute('data-cta-action') || 'unknown',
                element_id: this.getAttribute('data-tracking-id') || 'unknown',
                timestamp: new Date().toISOString(),
                source_page: window.location.pathname
            };
            
            if (window.dataLayer) {
                window.dataLayer.push(trackingData);
            }
            
            console.log('[Analytics] Hero CTA Click:', trackingData);
        });
    });

    // ===== 4. Track Interest Category Cards (Homepage) =====
    const interestCards = document.querySelectorAll('.cta-interest-card');
    
    interestCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const trackingData = {
                event: 'select_content',
                engagement_type: 'interest_cta',
                action: 'explore_interest',
                interest: this.getAttribute('data-interest') || 'unknown',
                element_id: this.getAttribute('data-tracking-id') || 'unknown',
                timestamp: new Date().toISOString(),
                source_page: window.location.pathname
            };
            
            if (window.dataLayer) {
                window.dataLayer.push(trackingData);
            }
            
            console.log('[Analytics] Interest Card Click:', trackingData);
        });
    });

    // ===== 5. Track Social Media Links =====
    const socialLinks = document.querySelectorAll('.cta-social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const trackingData = {
                event: 'social_share',
                engagement_type: 'social_link',
                action: 'visit_social',
                social_platform: this.getAttribute('data-social') || 'unknown',
                element_id: this.getAttribute('data-tracking-id') || 'unknown',
                timestamp: new Date().toISOString(),
                source_page: window.location.pathname
            };
            
            if (window.dataLayer) {
                window.dataLayer.push(trackingData);
            }
            
            console.log('[Analytics] Social Link Click:', trackingData);
        });
    });

    // ===== 6. Track Footer Links =====
    const footerLinks = document.querySelectorAll('.cta-footer-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const trackingData = {
                event: 'footer_click',
                engagement_type: 'footer_link',
                action: 'visit_page',
                page: this.getAttribute('data-footer-link') || 'unknown',
                element_id: this.getAttribute('data-tracking-id') || 'unknown',
                timestamp: new Date().toISOString(),
                source_page: window.location.pathname
            };
            
            if (window.dataLayer) {
                window.dataLayer.push(trackingData);
            }
            
            console.log('[Analytics] Footer Link Click:', trackingData);
        });
    });
}

/* ============================================
   Content Grouping — push page metadata to GTM
   Parses URL to derive category, series, and page type.
   GTM reads content_group1/2/3 from the dataLayer for
   GA4 event parameters and audience segmentation.
============================================ */

function initContentGrouping() {
    var dl = window.dataLayer = window.dataLayer || [];
    var path = window.location.pathname;

    var contentGroup1 = 'other';
    var contentGroup2 = '';
    var pageType = 'other';

    // Series → category lookup
    var seriesCategoryMap = {
        'ai-app-dev': 'technology', 'ai-in-the-wild': 'technology',
        'ai-data-science': 'technology', 'api-development': 'technology',
        'arm-assembly': 'technology', 'assembly-mastery': 'technology',
        'cloud-computing': 'technology', 'cmsis': 'technology',
        'computer-architecture': 'technology', 'data-structures': 'technology',
        'database-mastery': 'technology', 'embedded-systems': 'technology',
        'gnu-make': 'technology', 'kernel-development': 'technology',
        'nlp': 'technology', 'protocols-master': 'technology',
        'sensors-actuators': 'technology', 'stm32-hal': 'technology',
        'system-design': 'technology', 'usb-dev': 'technology',
        'behavioral-psychology': 'psychology', 'cognitive-psych': 'psychology',
        'biochemistry': 'life-sciences', 'evolutionary-biology': 'life-sciences',
        'human-anatomy': 'life-sciences', 'physiology': 'life-sciences',
        'consulting-frameworks': 'business', 'dddm': 'business',
        'economics': 'business', 'entrepreneurship': 'business',
        'marketing-strategy': 'business', 'sales-mastery': 'business',
        'ethics-moral-philosophy': 'philosophy', 'logic-critical-thinking': 'philosophy',
        'manufacturing-engineering': 'engineering', 'materials-science': 'engineering',
        'mech-movements': 'engineering', 'robotics-automation': 'engineering',
        'game-development': 'gaming', 'unity-game-engine': 'gaming'
    };

    if (path === '/' || path === '/index.html') {
        pageType = 'homepage';
        contentGroup1 = 'homepage';
    } else if (path.indexOf('/pages/categories/') !== -1) {
        pageType = 'category_listing';
        var catMatch = path.match(/\/pages\/categories\/([^/]+)\.html/);
        if (catMatch) { contentGroup1 = catMatch[1]; }
    } else if (path.indexOf('/pages/series/') !== -1) {
        pageType = 'series_article';
        var seriesMatch = path.match(/\/pages\/series\/([^/]+)\//);
        if (seriesMatch) {
            contentGroup2 = seriesMatch[1];
            contentGroup1 = seriesCategoryMap[contentGroup2] || 'other';
        }
    } else if (/\/pages\/\d{4}\/\d{2}\//.test(path)) {
        pageType = 'standalone_article';
    } else if (path.indexOf('/pages/contact') !== -1) {
        pageType = 'contact';
    }

    dl.push({
        event: 'content_group',
        content_group1: contentGroup1,
        content_group2: contentGroup2,
        page_type: pageType,
        page_path: path
    });
}

/* ============================================
   Print Tracking
   Fires a dataLayer event when the user prints.
   GTM listens for 'print_article' customEvent.
============================================ */

function initPrintTracking() {
    window.addEventListener('beforeprint', function() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'print_article',
            page_path: window.location.pathname,
            page_title: document.title
        });
    });
}

// Initialize tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAnalyticsTracking();
    initContentGrouping();
    initPrintTracking();
});

/* ============================================
   Blog Post Features (Consolidated)
   ============================================ */

/**
 * Initialize Scroll-to-Top Button and Category Indicator
 * Works on all blog pages with .blog-content
 */
function initBlogScrollFeatures() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const categoryIndicator = document.getElementById('categoryIndicator');
    const categoryText = document.getElementById('categoryText');
    
    // Only run on pages with these elements
    if (!scrollToTopBtn && !categoryIndicator) return;
    
    // Auto-detect H2 sections in the article
    const h2Elements = document.querySelectorAll('.blog-content h2');
    const sections = [];
    
    h2Elements.forEach(function(h2) {
        let text = h2.textContent.trim().replace(/^\d+\.\s*/, ''); // Remove leading numbers
        if (text.length > 25) {
            text = text.substring(0, 22) + '...';
        }
        sections.push({
            element: h2,
            name: text
        });
    });
    
    // Show/hide button and update category indicator on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            if (scrollToTopBtn) scrollToTopBtn.classList.add('show');
            
            // Update category indicator based on current section
            if (categoryIndicator && sections.length > 0) {
                let currentSection = sections[0].name;
                
                for (let i = 0; i < sections.length; i++) {
                    const rect = sections[i].element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        currentSection = sections[i].name;
                    }
                }
                
                // Handle both formats: direct text or #categoryText span
                if (categoryText) {
                    categoryText.textContent = currentSection;
                } else {
                    categoryIndicator.textContent = currentSection;
                }
                categoryIndicator.classList.add('show');
            }
        } else {
            if (scrollToTopBtn) scrollToTopBtn.classList.remove('show');
            if (categoryIndicator) categoryIndicator.classList.remove('show');
        }
    });
    
    // Smooth scroll to top on click
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/**
 * Initialize Side Navigation TOC
 * Handles open/close functionality and active section highlighting
 */
function initSideNavTOC() {
    const tocSidenav = document.getElementById('tocSidenav');
    const tocOverlay = document.getElementById('tocOverlay');
    
    // Only run on pages with TOC sidenav
    if (!tocSidenav) return;
    
    // Make openNav and closeNav globally available
    window.openNav = function() {
        tocSidenav.classList.add('open');
        if (tocOverlay) tocOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeNav = function() {
        tocSidenav.classList.remove('open');
        if (tocOverlay) tocOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    };
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeNav();
        }
    });
    
    // Highlight active section in TOC based on scroll position
    const tocLinks = tocSidenav.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('[id]');
    
    function highlightActiveSection() {
        let currentSection = '';
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Initial highlight
    
    // Smooth scroll for TOC links
    tocLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            setTimeout(window.closeNav, 300);
        });
    });
}

/**
 * Initialize Prism.js Theme Switcher
 * Allows users to switch between different syntax highlighting themes
 */
function initPrismThemeSwitcher() {
    // Check if Prism is available
    if (typeof Prism === 'undefined' || !Prism.plugins || !Prism.plugins.toolbar) return;
    
    const themes = {
        'prism-theme': 'Tomorrow Night',
        'prism-default': 'Default',
        'prism-dark': 'Dark',
        'prism-twilight': 'Twilight',
        'prism-okaidia': 'Okaidia',
        'prism-solarizedlight': 'Solarized Light'
    };
    
    // Load saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('prism-theme') || 'prism-theme';
    
    // Function to switch theme
    window.switchPrismTheme = function(themeId) {
        Object.keys(themes).forEach(function(id) {
            const link = document.getElementById(id);
            if (link) {
                link.disabled = true;
            }
        });
        
        const selectedLink = document.getElementById(themeId);
        if (selectedLink) {
            selectedLink.disabled = false;
            localStorage.setItem('prism-theme', themeId);
        }
        
        // Update all dropdowns on the page
        document.querySelectorAll('div.code-toolbar select.prism-theme-selector').forEach(function(dropdown) {
            dropdown.value = themeId;
        });
        
        // Re-apply syntax highlighting
        setTimeout(function() {
            Prism.highlightAll();
        }, 10);
    };
    
    // Apply saved theme on load
    window.switchPrismTheme(savedTheme);
    
    // Register theme switcher button in Prism toolbar
    Prism.plugins.toolbar.registerButton('theme-switcher', function(env) {
        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Select code theme');
        select.className = 'prism-theme-selector';
        
        Object.keys(themes).forEach(function(themeId) {
            const option = document.createElement('option');
            option.value = themeId;
            option.textContent = themes[themeId];
            if (themeId === savedTheme) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        select.addEventListener('change', function(e) {
            window.switchPrismTheme(e.target.value);
        });
        
        return select;
    });
}

/* ============================================
   Mermaid Diagram Auto-Initialization
   ============================================ */

function initMermaidDiagrams() {
    if (typeof mermaid === 'undefined') return;
    if (!document.querySelector('.mermaid')) return;

    mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
            primaryColor: '#e8f4f4',
            primaryTextColor: '#132440',
            primaryBorderColor: '#3B9797',
            lineColor: '#3B9797',
            secondaryColor: '#f0f4f8',
            tertiaryColor: '#fff5f5',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            nodeBorder: '#3B9797',
            mainBkg: '#e8f4f4',
            clusterBkg: '#f0f4f8',
            clusterBorder: '#16476A',
            edgeLabelBackground: '#ffffff'
        },
        flowchart: { curve: 'basis', padding: 15 }
    });
}

// Initialize blog features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initBlogScrollFeatures();
    initSideNavTOC();
    initPrismThemeSwitcher();
    initMermaidDiagrams();
    initInterestsMegaDropdown();
    initCategoryNewTab();
});

// ============================================================
// Category Pages — open article links in new tab
// ============================================================
function initCategoryNewTab() {
    var links = document.querySelectorAll('.caption-cta, .cta-read-article');
    if (!links.length) return;
    for (var i = 0; i < links.length; i++) {
        links[i].setAttribute('target', '_blank');
        links[i].setAttribute('rel', 'noopener');
    }
}

// ============================================================
// Interests Mega Dropdown — dynamic injection
// ============================================================
function initInterestsMegaDropdown() {
    // Guard against double initialization
    if (document.getElementById('megaDropdown')) return;
    // Skip on pages that have an #interests section (homepage)
    if (document.getElementById('interests')) return;

    // Find the Interests nav link by text content
    var interestsLink = null;
    var navLinks = document.querySelectorAll('.nav-v16 .link-3d');
    for (var i = 0; i < navLinks.length; i++) {
        if (navLinks[i].textContent.trim().replace(/\s+/g, ' ').indexOf('Interests') !== -1) {
            interestsLink = navLinks[i];
            break;
        }
    }
    if (!interestsLink) return;

    // Mark link so smooth scroll handler skips it
    interestsLink.setAttribute('data-mega-trigger', 'true');

    // Category data
    var categories = [
        { name: 'Faith', slug: 'faith', icon: 'fa-heart', desc: 'Spirituality & belief' },
        { name: 'Philosophy', slug: 'philosophy', icon: 'fa-book', desc: 'Questions & ideas' },
        { name: 'Psychology', slug: 'psychology', icon: 'fa-brain', desc: 'Human behavior' },
        { name: 'Gaming', slug: 'gaming', icon: 'fa-gamepad', desc: 'Entertainment & strategy' },
        { name: 'Poetry', slug: 'poetry', icon: 'fa-feather-alt', desc: 'Words & rhythm' },
        { name: 'Business', slug: 'business', icon: 'fa-briefcase', desc: 'Strategy & marketing' },
        { name: 'Technology', slug: 'technology', icon: 'fa-rocket', desc: 'Innovation & frontiers' },
        { name: 'Science', slug: 'science', icon: 'fa-flask', desc: 'Discovery & research' },
        { name: 'Engineering', slug: 'engineering', icon: 'fa-cogs', desc: 'Design & build' },
        { name: 'Mathematics', slug: 'mathematics', icon: 'fa-square-root-variable', desc: 'Patterns & proofs' },
        { name: 'Life Sciences', slug: 'life-sciences', icon: 'fa-dna', desc: 'Biology & genetics' },
        { name: 'History', slug: 'history', icon: 'fa-landmark', desc: 'Civilizations & events' }
    ];

    // Build grid items
    var gridHTML = '';
    for (var j = 0; j < categories.length; j++) {
        var c = categories[j];
        gridHTML += '<a href="/pages/categories/' + c.slug + '.html" class="mega-item">' +
            '<div class="mega-item-icon icon-' + c.slug + '"><i class="fas ' + c.icon + '"></i></div>' +
            '<div class="mega-item-text"><h5>' + c.name + '</h5><p>' + c.desc + '</p></div></a>';
    }

    // Inject backdrop + dropdown after nav-v16-wrapper
    var wrapper = document.querySelector('.nav-v16-wrapper');
    if (!wrapper) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'mega-dropdown-backdrop';
    backdrop.id = 'megaBackdrop';
    wrapper.parentNode.insertBefore(backdrop, wrapper.nextSibling);

    var dropdown = document.createElement('div');
    dropdown.className = 'mega-dropdown';
    dropdown.id = 'megaDropdown';
    dropdown.innerHTML =
        '<div class="mega-dropdown-header">' +
            '<h3><i class="fas fa-compass"></i>Explore Interests</h3>' +
            '<button class="mega-dropdown-close" id="megaClose">&times;</button>' +
        '</div>' +
        '<div class="mega-dropdown-grid">' + gridHTML + '</div>';
    backdrop.parentNode.insertBefore(dropdown, backdrop.nextSibling);

    // Open / close helpers
    function openMega() {
        dropdown.classList.add('open');
        backdrop.classList.add('open');
    }

    function closeMega() {
        dropdown.classList.remove('open');
        backdrop.classList.remove('open');
    }

    // Trigger: Interests link opens mega dropdown
    interestsLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (dropdown.classList.contains('open')) {
            closeMega();
        } else {
            openMega();
        }
    });

    // Close: backdrop click
    backdrop.addEventListener('click', closeMega);

    // Close: × button
    document.getElementById('megaClose').addEventListener('click', closeMega);

    // Close: ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMega();
    });
}

