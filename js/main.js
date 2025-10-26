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
   Scroll Animations
   ============================================ */

function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const scrollElements = document.querySelectorAll('.animate-on-scroll, .skill-card, .interest-card');
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        scrollElements.forEach(el => elementObserver.observe(el));
    }
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
    
    // Initialize keyboard navigation
    initKeyboardNavigation();
    
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
