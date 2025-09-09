// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 14, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animated Counter for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const options = {
        threshold: 0.7
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetAttr = counter.getAttribute('data-target');
                
                // Skip if no data-target attribute or if it contains non-numeric text
                if (!targetAttr || isNaN(parseInt(targetAttr))) {
                    observer.unobserve(counter);
                    return;
                }
                
                const target = parseInt(targetAttr);
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, options);

    counters.forEach(counter => {
        // Only observe counters that have numeric data-target
        const targetAttr = counter.getAttribute('data-target');
        if (targetAttr && !isNaN(parseInt(targetAttr))) {
            observer.observe(counter);
        }
    });
}

// Initialize counter animation when page loads
document.addEventListener('DOMContentLoaded', animateCounters);

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// QR Code Generation with Enhanced Styling
function generateQRCode() {
    const qrCanvas = document.getElementById('qr-canvas');
    if (qrCanvas) {
        try {
            const qr = qrcode(0, 'M');
            // Google Drive APK download URL
            const downloadUrl = 'https://drive.google.com/file/d/1cBVFafLyS735CTYlzzIkpEPgd5WjZTB1/view?usp=sharing';
            qr.addData(downloadUrl);
            qr.make();
            
            const cellSize = 5; // Increased for better visibility
            const margin = 10;
            const size = qr.getModuleCount() * cellSize + margin * 2;
            
            qrCanvas.width = size;
            qrCanvas.height = size;
            
            const ctx = qrCanvas.getContext('2d');
            
            // Clear canvas with white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            
            // Draw QR code modules
            for (let row = 0; row < qr.getModuleCount(); row++) {
                for (let col = 0; col < qr.getModuleCount(); col++) {
                    if (qr.isDark(row, col)) {
                        ctx.fillStyle = '#000000';
                        // Add rounded corners to QR modules for better appearance
                        const x = col * cellSize + margin;
                        const y = row * cellSize + margin;
                        const radius = 1;
                        
                        ctx.beginPath();
                        ctx.roundRect(x, y, cellSize, cellSize, radius);
                        ctx.fill();
                    }
                }
            }
            
            console.log('✅ QR Code generated successfully for:', downloadUrl);
            
            // Add click event to QR canvas for mobile users
            qrCanvas.style.cursor = 'pointer';
            qrCanvas.onclick = function() {
                window.open(downloadUrl, '_blank');
                console.log('📱 QR Code clicked - opening download link');
            };
            
        } catch (error) {
            console.error('❌ Failed to generate QR code:', error);
            
            // Fallback: Show a message instead of QR code
            const ctx = qrCanvas.getContext('2d');
            qrCanvas.width = 200;
            qrCanvas.height = 200;
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = '#333';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('QR Code', 100, 90);
            ctx.fillText('Unavailable', 100, 110);
            ctx.fillText('Use Download Button', 100, 130);
        }
    }
}

// Enhanced CanvasRenderingContext2D.roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (radius === 0) {
            this.rect(x, y, width, height);
            return;
        }
        
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Generate QR code when page loads
document.addEventListener('DOMContentLoaded', generateQRCode);

// Download APK Button Handler - Direct download with minimal feedback
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-apk');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Simple console log for tracking
            console.log('APK download initiated from landing page');
            
            // No popup - let the direct download happen
            // The href attribute handles the download automatically
        });
    }
});

function showDownloadNotice() {
    // Create a simple notice that appears briefly
    const notice = document.createElement('div');
    notice.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;

    notice.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-download" style="color: #4ade80;"></i>
            <span>APK download starting...</span>
        </div>
        <small style="opacity: 0.8; display: block; margin-top: 0.5rem;">
            Enable "Unknown Sources" in your Android settings to install.
        </small>
    `;

    // Add animation keyframes
    if (!document.getElementById('download-notice-styles')) {
        const style = document.createElement('style');
        style.id = 'download-notice-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notice);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notice.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (document.body.contains(notice)) {
                document.body.removeChild(notice);
            }
        }, 500);
    }, 4000);
}

function showDownloadModal() {
    // Create modal for download instructions
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #1a1e2e 0%, #2d3748 100%);
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        color: white;
        border: 1px solid rgba(102, 126, 234, 0.3);
    `;

    modalContent.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <i class="fas fa-download" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
            <h3 style="color: #ccd6f6; margin-bottom: 1rem;">Download Kamau APK</h3>
            <p style="color: #8892b0; margin-bottom: 1.5rem;">
                To install Kamau on your Android device, you'll need to enable "Unknown Sources" in your device settings.
            </p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem; text-align: left;">
            <h4 style="color: #667eea; margin-bottom: 1rem;">Installation Steps:</h4>
            <ol style="color: #8892b0; line-height: 1.8;">
                <li>Click the download link to access Google Drive</li>
                <li>Click the download button in Google Drive</li>
                <li>Go to Settings > Security on your device</li>
                <li>Enable "Unknown Sources" or "Install unknown apps"</li>
                <li>Open the downloaded APK file</li>
                <li>Follow installation prompts</li>
            </ol>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="download-now-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
            ">
                <i class="fas fa-download"></i> Download Now
            </button>
            <button id="close-modal-btn" style="
                background: transparent;
                border: 1px solid #667eea;
                color: #667eea;
                padding: 1rem 2rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
            ">
                Cancel
            </button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal handlers
    document.getElementById('close-modal-btn').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Download handler
    document.getElementById('download-now-btn').addEventListener('click', function() {
        // Google Drive APK download URL
        window.open('https://drive.google.com/file/d/1cBVFafLyS735CTYlzzIkpEPgd5WjZTB1/view?usp=sharing', '_blank');
        
        // Show success message
        modalContent.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #4ade80; margin-bottom: 1rem;"></i>
                <h3 style="color: #ccd6f6; margin-bottom: 1rem;">Download Started!</h3>
                <p style="color: #8892b0; margin-bottom: 1.5rem;">
                    Your APK download should start automatically. If not, please check your browser's download manager.
                </p>
                <button onclick="document.body.removeChild(this.closest('[style*=&quot;position: fixed&quot;]'))" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">
                    Close
                </button>
            </div>
        `;
    });
}

// Feature Card Animations
function animateFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    const options = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Initialize feature card animations
document.addEventListener('DOMContentLoaded', animateFeatureCards);

// Testimonial Card Animations
function animateTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const options = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);

    testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateY(30px)';
        testimonial.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(testimonial);
    });
}

// Initialize testimonial animations
document.addEventListener('DOMContentLoaded', animateTestimonials);

// Floating Coins Animation
function createFloatingCoins() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    for (let i = 0; i < 10; i++) {
        const coin = document.createElement('div');
        coin.className = 'floating-coin';
        coin.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 20}px;
            color: rgba(102, 126, 234, 0.1);
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 4 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
            pointer-events: none;
        `;
        coin.textContent = 'NPR';
        heroBackground.appendChild(coin);
    }
}

// Create floating coins when page loads
document.addEventListener('DOMContentLoaded', createFloatingCoins);

// Preloader (optional)
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0e1a;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;

    preloader.innerHTML = `
        <div style="text-align: center;">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid rgba(102, 126, 234, 0.3);
                border-top: 3px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            "></div>
            <p style="color: #8892b0; font-weight: 600;">Loading Kamau...</p>
        </div>
        
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(preloader);

    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(preloader)) {
                    document.body.removeChild(preloader);
                }
            }, 500);
        }, 1000);
    });
}

// Show preloader
document.addEventListener('DOMContentLoaded', showPreloader);

// Contact Form Handling (if you add a contact form later)
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
                background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
                color: white;
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
                margin-top: 1rem;
                font-weight: 600;
            `;
            successMessage.textContent = 'Thank you! We\'ll get back to you soon.';
            
            contactForm.appendChild(successMessage);
            contactForm.reset();
            
            setTimeout(() => {
                if (contactForm.contains(successMessage)) {
                    contactForm.removeChild(successMessage);
                }
            }, 5000);
        });
    }
}

// Initialize contact form handling
document.addEventListener('DOMContentLoaded', handleContactForm);

// Performance Monitoring
function trackPagePerformance() {
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page Load Time: ${loadTime}ms`);
            
            // You can send this data to analytics
            if (loadTime > 3000) {
                console.warn('Page load time is slower than expected');
            }
        }
    });
}

// Initialize performance tracking
document.addEventListener('DOMContentLoaded', trackPagePerformance);

// Easter Egg - Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑ ↑ ↓ ↓ ← → ← → B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Easter egg activated!
        document.body.style.filter = 'hue-rotate(180deg)';
        
        const easterEgg = document.createElement('div');
        easterEgg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            z-index: 10000;
            animation: bounceIn 0.5s ease;
        `;
        
        easterEgg.innerHTML = `
            <h3>🎉 Easter Egg Unlocked! 🎉</h3>
            <p>You found the secret! Enjoy this special color mode!</p>
            <button onclick="this.parentElement.remove(); document.body.style.filter = 'none';" style="
                background: white;
                color: #667eea;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                cursor: pointer;
                font-weight: 600;
            ">Reset</button>
        `;
        
        document.body.appendChild(easterEgg);
        
        setTimeout(() => {
            if (document.body.contains(easterEgg)) {
                easterEgg.remove();
                document.body.style.filter = 'none';
            }
        }, 5000);
        
        konamiCode = []; // Reset the code
    }
});

console.log('🎮 Kamau Landing Page Loaded Successfully!');
console.log('💡 Try the Konami Code for a surprise: ↑ ↑ ↓ ↓ ← → ← → B A');
