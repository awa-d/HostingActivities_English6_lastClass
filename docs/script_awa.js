// Wait for DOM to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle mobile navigation when hamburger is clicked
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            
            // Animate links
            const links = document.querySelectorAll('.nav-links li');
            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }
    
    // Audio player enhancements
    const audioPlayers = document.querySelectorAll('audio');
    audioPlayers.forEach(player => {
        // Add event listeners for play/pause to update UI if needed
        player.addEventListener('play', function() {
            // Optional: add code to update UI when audio plays
            const card = this.closest('.story-card');
            if (card) {
                card.classList.add('playing');
            }
        });
        
        player.addEventListener('pause', function() {
            // Optional: add code to update UI when audio pauses
            const card = this.closest('.story-card');
            if (card) {
                card.classList.remove('playing');
            }
        });
    });
    
    // Download button functionality on Thank You page
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Thank you for your interest! The memory book will be available for download soon.');
        });
    }
    
    // Share buttons functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the share type from class
            const shareType = this.classList[1]; // facebook, twitter, instagram, email
            const pageTitle = document.title;
            const pageUrl = window.location.href;
            
            // Different share functionality based on platform
            switch(shareType) {
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, 'facebook-share', 'width=580,height=296');
                    break;
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`, 'twitter-share', 'width=550,height=235');
                    break;
                case 'instagram':
                    alert('To share on Instagram, please screenshot this page and upload it to your Instagram account.');
                    break;
                case 'email':
                    window.location.href = `mailto:?subject=${pageTitle}&body=Check out this page: ${pageUrl}`;
                    break;
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    hamburger.classList.remove('toggle');
                }
            }
        });
    });
    
    // Add animation class to elements when they come into view
    function animateOnScroll() {
        const elements = document.querySelectorAll('.story-card, .reaction-bubble, .thank-you-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    }
    
    // Add fade-in effect on scroll for page elements
    const fadeElements = document.querySelectorAll('.about-content, .highlight-box');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    };

    // Run animation functions on load and scroll
    window.addEventListener('scroll', function() {
        animateOnScroll();
        fadeInOnScroll();
    });
    
    // Run once on page load
    animateOnScroll();
    fadeInOnScroll();

    // Add current year to footer if needed
    const footerYear = document.querySelector('footer .container p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
    }
});