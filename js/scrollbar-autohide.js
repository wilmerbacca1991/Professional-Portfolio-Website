// Auto-hide scrollbar - show only when actively scrolling or hovering near edge
(function() {
    let scrollTimeout;
    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'dynamic-scrollbar';
    document.head.appendChild(scrollbarStyle);

    function showScrollbar() {
        scrollbarStyle.textContent = `
            ::-webkit-scrollbar {
                display: block !important;
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: rgba(124, 92, 255, 0.5);
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(124, 92, 255, 0.8);
            }
            html {
                scrollbar-width: thin !important;
                scrollbar-color: rgba(124, 92, 255, 0.5) transparent !important;
            }
        `;
    }

    function hideScrollbar() {
        scrollbarStyle.textContent = `
            ::-webkit-scrollbar {
                display: none !important;
            }
            html {
                scrollbar-width: none !important;
            }
        `;
    }

    // Initialize with hidden scrollbar
    hideScrollbar();

    // Show scrollbar while scrolling
    window.addEventListener('scroll', function() {
        showScrollbar();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(hideScrollbar, 1000); // Hide after 1 second of no scrolling
    }, { passive: true });

    // Show scrollbar on mousemove near the right edge (desktop only)
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
            const windowWidth = window.innerWidth;
            const distanceFromEdge = windowWidth - e.clientX;
            
            if (distanceFromEdge < 20) { // Within 20px of right edge
                showScrollbar();
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(hideScrollbar, 2000);
            }
        }, { passive: true });
    }

    // Handle touch events for mobile
    let touchTimeout;
    window.addEventListener('touchstart', function() {
        showScrollbar();
        clearTimeout(touchTimeout);
    }, { passive: true });

    window.addEventListener('touchend', function() {
        touchTimeout = setTimeout(hideScrollbar, 1000);
    }, { passive: true });
})();
