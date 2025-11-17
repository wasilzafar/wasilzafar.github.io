// GDPR Cookie Consent Banner JavaScript with Google Consent Mode v2 Integration
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
        
        // Update Google Consent Mode v2 based on preferences
        updateGoogleConsentMode: function(preferences) {
            if (typeof gtag === 'undefined') return;
            
            // Build consent update object
            const consentUpdate = {
                'ad_storage': preferences.marketing ? 'granted' : 'denied',
                'ad_user_data': preferences.marketing ? 'granted' : 'denied',
                'ad_personalization': preferences.marketing ? 'granted' : 'denied',
                'analytics_storage': preferences.analytics ? 'granted' : 'denied'
            };
            
            // Update Google Consent Mode
            gtag('consent', 'update', consentUpdate);
            
            // If ads storage is denied, optionally redact ads data
            if (!preferences.marketing) {
                gtag('set', 'ads_data_redaction', true);
            }
        },
        
        // Get user's region (simple implementation - can be enhanced with geolocation API)
        getUserRegion: function() {
            // This is a placeholder - in production, use a geolocation service
            // or check the user's Accept-Language header
            return 'auto'; // Let Google determine region
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
            if (preferences) {
                // Update Google Consent Mode with saved preferences
                CookieConsent.updateGoogleConsentMode(preferences);
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
                marketing: true,
                timestamp: new Date().toISOString()
            };
            CookieConsent.savePreferences(preferences);
            CookieConsent.updateGoogleConsentMode(preferences);
            
            // Fire consent granted event for GTM
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'consent_granted',
                    'consent_type': 'all'
                });
            }
            
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
            CookieConsent.updateGoogleConsentMode(preferences);
            
            // Fire consent denied event for GTM
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'consent_denied',
                    'consent_type': 'non-essential'
                });
            }
            
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
            CookieConsent.updateGoogleConsentMode(preferences);
            
            // Fire custom consent event for GTM
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'consent_custom',
                    'analytics_consent': preferences.analytics,
                    'marketing_consent': preferences.marketing
                });
            }
            
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
