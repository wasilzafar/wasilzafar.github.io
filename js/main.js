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
    const navLinks = document.querySelectorAll('.nav-link');
    
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
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   Smooth Scroll Navigation
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
        const navLinks = document.querySelectorAll('.nav-link');
        const activeLink = document.querySelector('.nav-link.active');
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const nextLink = activeLink?.nextElementSibling?.querySelector('.nav-link') || navLinks[0];
            if (nextLink) {
                nextLink.focus();
                nextLink.click();
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const prevLink = activeLink?.previousElementSibling?.querySelector('.nav-link') || navLinks[navLinks.length - 1];
            if (prevLink) {
                prevLink.focus();
                prevLink.click();
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
   Google Analytics Event Tracking via GTM
   ============================================
   Naming Convention:
   - CTA (Call-to-Action) Elements: cta-[action]-[context]
   - data-tracking-id: cta_[action]_[category]_[index]
   - data-article-slug: [article-slug-from-filename]
   - data-category: [blog-category-name]
   
   Example: cta_read_article_psychology_001
   - cta: Element type (Call-to-Action)
   - read_article: Action performed
   - psychology: Category context
   - 001: Sequential index for extensibility
   
   Event Structure for GTM:
   {
     event: 'engagement_cta_click',
     engagement_type: 'article_cta',
     action: 'read_article',
     category: 'psychology',
     article_slug: 'psychology-experiments-cognitive-biases',
     element_id: 'cta_read_article_psychology_001'
   }
============================================ */

function initAnalyticsTracking() {
    // Track all CTA "Read Article" button clicks
    const readArticleButtons = document.querySelectorAll('.cta-read-article');
    
    readArticleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const trackingData = {
                event: 'engagement_cta_click',
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
            
            // Console logging for development/debugging
            console.log('[Analytics] CTA Click:', trackingData);
        });
    });
}

// Initialize tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAnalyticsTracking();
});

