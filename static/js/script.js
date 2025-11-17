// Smooth scrolling for anchor links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.categories, .popular-courses, .about-section, .testimonials');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
});

// Card hover effects
document.querySelectorAll('.category-card, .course-card, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter');
if (newsletterForm) {
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value;

        if (email && validateEmail(email)) {
            // Here you would typically send the email to your backend
            alert('გმადლობთ გამოწერისთვის!');
            input.value = '';
        } else {
            alert('გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა');
        }
    });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Dynamic testimonial slider pause on hover
const testimonialsTrack = document.querySelector('.testimonials-track');
if (testimonialsTrack) {
    testimonialsTrack.addEventListener('mouseenter', () => {
        testimonialsTrack.style.animationPlayState = 'paused';
    });

    testimonialsTrack.addEventListener('mouseleave', () => {
        testimonialsTrack.style.animationPlayState = 'running';
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Course card interactions
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on buttons
        if (!e.target.closest('.btn-course, .btn-demo')) {
            const courseTitle = this.querySelector('h3').textContent;
            console.log(`Selected course: ${courseTitle}`);
            // Here you can add navigation or modal logic
        }
    });
});

// Mobile menu toggle (for responsive design)
function createMobileMenu() {
    const navbar = document.querySelector('.navbar .container');
    const navMenu = document.querySelector('.nav-menu');

    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-toggle';
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            toggle.style.cssText = 'background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; display: block;';

            navbar.querySelector('.nav-wrapper').insertBefore(toggle, navMenu);

            toggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }
}

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// Add subtle animations to icons
document.querySelectorAll('.category-icon, .course-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.animation = 'bounce 0.5s ease';
    });

    icon.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Add CSS for bounce animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-10px) scale(1.1); }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(26, 26, 26, 0.98);
        padding: 1rem;
        gap: 1rem;
    }
`;
document.head.appendChild(style);

console.log('Website loaded successfully! 🚀');