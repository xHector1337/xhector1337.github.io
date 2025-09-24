// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for anchor links
    const anchors = document.querySelectorAll('.anchor');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function() {
            const section = this.closest('.section');
            const id = section.id;
            
            // Copy section link to clipboard
            const url = window.location.origin + window.location.pathname + '#' + id;
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url).then(() => {
                    showTooltip(this, 'Link copied!');
                }).catch(() => {
                    fallbackCopyTextToClipboard(url);
                    showTooltip(this, 'Link copied!');
                });
            } else {
                fallbackCopyTextToClipboard(url);
                showTooltip(this, 'Link copied!');
            }
        });
    });
    
    // Highlight current section in navigation
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');
    
    function highlightCurrentSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Add active class styling
    const style = document.createElement('style');
    style.textContent = `
        nav a.active {
            color: #004499;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
    
    // Listen for scroll events
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Initial highlight
    highlightCurrentSection();
});

// Fallback function for copying text to clipboard
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Show tooltip function
function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
    
    // Remove tooltip after 2 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 2000);
}

// Add typing effect to the main heading (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Optional: Add fade-in animation for sections
function addFadeInAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        .section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .section.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize fade-in animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay before starting animations
    setTimeout(addFadeInAnimation, 100);
});

// Add print functionality
function printCV() {
    window.print();
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'p':
                e.preventDefault();
                printCV();
                break;
        }
    }
});
