// GDPR Cookie Consent Banner JavaScript
(function() {
    'use strict';
    
    // Cookie utility functions
    const CookieConsent = {
        // Set cookie with expiry
        setCookie: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
        },
        
        // Get cookie value
        getCookie: function(name) {
            const nameEQ = name + "=";
            const cookies = document.cookie.split(';');
            for(let i = 0; i < cookies.length; i++) {
                let c = cookies[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        
        // Check if user has made a choice
        hasConsent: function() {
            return this.getCookie('cookieConsent') !== null;
        },
        
        // Get consent preferences
        getPreferences: function() {
            const consent = this.getCookie('cookieConsent');
            if (!consent) return null;
            
            try {
                return JSON.parse(decodeURIComponent(consent));
            } catch (e) {
                return null;
            }
        },
        
        // Save preferences
        savePreferences: function(preferences) {
            const value = encodeURIComponent(JSON.stringify(preferences));
            this.setCookie('cookieConsent', value, 365);
        },
        
        // Initialize Google Analytics based on consent
        initAnalytics: function(enabled) {
            if (enabled && typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            } else if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
        }
    };
    
    // Initialize banner
    function initCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;
        
        const closeIcon = document.getElementById('closeIcon');
        const settingsBtn = document.getElementById('cookieSettings');
        const acceptBtn = document.getElementById('cookieAccept');
        const rejectBtn = document.getElementById('cookieReject');
        const saveBtn = document.getElementById('cookieSave');
        const cookieTypes = document.getElementById('cookieTypes');
        
        // Check if user has already given consent
        if (CookieConsent.hasConsent()) {
            const preferences = CookieConsent.getPreferences();
            if (preferences && preferences.analytics) {
                CookieConsent.initAnalytics(true);
            }
            return;
        }
        
        // Show banner
        banner.style.display = 'block';
        
        // Close button
        closeIcon.addEventListener('click', function() {
            banner.style.display = 'none';
        });
        
        // Settings toggle
        settingsBtn.addEventListener('click', function() {
            const isVisible = cookieTypes.style.display !== 'none';
            cookieTypes.style.display = isVisible ? 'none' : 'block';
            saveBtn.style.display = isVisible ? 'none' : 'inline-block';
        });
        
        // Accept all cookies
        acceptBtn.addEventListener('click', function() {
            const preferences = {
                essential: true,
                analytics: true,
                marketing: false,
                timestamp: new Date().toISOString()
            };
            CookieConsent.savePreferences(preferences);
            CookieConsent.initAnalytics(true);
            banner.style.display = 'none';
        });
        
        // Reject all non-essential cookies
        rejectBtn.addEventListener('click', function() {
            const preferences = {
                essential: true,
                analytics: false,
                marketing: false,
                timestamp: new Date().toISOString()
            };
            CookieConsent.savePreferences(preferences);
            CookieConsent.initAnalytics(false);
            banner.style.display = 'none';
        });
        
        // Save custom preferences
        saveBtn.addEventListener('click', function() {
            const analyticsCheckbox = document.getElementById('analyticsCookies');
            const marketingCheckbox = document.getElementById('marketingCookies');
            
            const preferences = {
                essential: true,
                analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
                marketing: marketingCheckbox ? marketingCheckbox.checked : false,
                timestamp: new Date().toISOString()
            };
            
            CookieConsent.savePreferences(preferences);
            CookieConsent.initAnalytics(preferences.analytics);
            banner.style.display = 'none';
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }
})();
