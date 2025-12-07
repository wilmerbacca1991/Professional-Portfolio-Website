/**
 * Interactive Features JavaScript
 * Project filtering system and skills visualization
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectFiltering();
    initializeSkillsVisualization();
    initializeScrollAnimations();
});

/**
 * PROJECT FILTERING SYSTEM
 */
function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('projectSearch');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    // Filter by category/technology
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            filterProjects(filterValue, searchInput?.value || '');
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            filterProjects(activeFilter, searchTerm);
        }, 300));
    }
    
    function filterProjects(category, searchTerm) {
        projectCards.forEach(card => {
            const cardCategories = card.dataset.category?.split(',') || [];
            const cardTech = card.dataset.tech?.split(',') || [];
            const cardTitle = card.dataset.title?.toLowerCase() || '';
            
            // Check category filter
            const matchesCategory = category === 'all' || 
                cardCategories.includes(category) || 
                cardTech.includes(category);
            
            // Check search term
            const matchesSearch = !searchTerm || 
                cardTitle.includes(searchTerm) ||
                cardCategories.some(cat => cat.includes(searchTerm)) ||
                cardTech.some(tech => tech.includes(searchTerm));
            
            // Show/hide with animation
            if (matchesCategory && matchesSearch) {
                card.classList.remove('filtered-out');
                card.setAttribute('aria-hidden', 'false');
            } else {
                card.classList.add('filtered-out');
                card.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Update results count and announce to screen readers
        updateResultsCount();
        announceFilterResults();
    }
    
    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.project-card:not(.filtered-out)').length;
        const totalCards = projectCards.length;
        const resultsElement = document.getElementById('filterResults');
        
        if (resultsElement) {
            const resultText = visibleCards === 1 ? 'project' : 'projects';
            resultsElement.innerHTML = `<span>Showing ${visibleCards} ${resultText}</span>`;
        }
    }
}

/**
 * INTERACTIVE SKILLS VISUALIZATION
 */
function initializeSkillsVisualization() {
    initializeSkillBars();
    initializeSkillTabs();
    initializeSkillHover();
}

function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Animate skill bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.dataset.progress;
                
                // Animate the width
                setTimeout(() => {
                    progressBar.style.width = `${progress}%`;
                }, 100);
                
                // Add number animation
                animateNumber(progressBar, 0, progress, 1500);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

function initializeSkillTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const skillCategories = document.querySelectorAll('.skill-category');
    
    if (!tabButtons.length || !skillCategories.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.dataset.tab;
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update visible category
            skillCategories.forEach(category => {
                if (category.dataset.category === targetCategory) {
                    category.classList.add('active');
                    // Re-trigger skill bar animations for new category
                    const skillBars = category.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = `${bar.dataset.progress}%`;
                        }, 100);
                    });
                } else {
                    category.classList.remove('active');
                }
            });
        });
    });
}

function initializeSkillHover() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const skillLevel = this.dataset.level;
            // You could show additional info on hover
            this.setAttribute('title', `Proficiency: ${skillLevel}%`);
        });
        
        // Make skills keyboard accessible
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Could trigger skill details modal or info
                showSkillDetails(this);
            }
        });
        
        // Make focusable
        item.setAttribute('tabindex', '0');
    });
}

/**
 * SCROLL-TRIGGERED ANIMATIONS
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skill-item, .hero-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS class when elements are in view
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * UTILITY FUNCTIONS
 */

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const stepTime = Math.abs(Math.floor(duration / range));
    const startTime = new Date().getTime();
    
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const remaining = Math.max((startTime + duration) - now, 0);
        const value = Math.round(end - (remaining / duration) * range);
        
        // Create tooltip or data attribute with current value
        element.setAttribute('data-value', `${value}%`);
        
        if (value === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Show skill details (placeholder for future enhancement)
function showSkillDetails(skillElement) {
    const skillName = skillElement.querySelector('.skill-name').textContent;
    const skillLevel = skillElement.dataset.level;
    
    // For now, just log - could implement modal later
    console.log(`Skill: ${skillName}, Level: ${skillLevel}%`);
    
    // Could implement a tooltip or modal here
    // Example: showTooltip(skillElement, `${skillName}: ${skillLevel}% proficiency`);
}

/**
 * ACCESSIBILITY ENHANCEMENTS
 */

// Ensure keyboard navigation works properly
document.addEventListener('keydown', function(e) {
    // Handle escape key to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('projectSearch');
        if (searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    }
    
    // Handle arrow keys for filter buttons
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const focusedButton = document.activeElement;
        if (focusedButton.classList.contains('filter-btn')) {
            e.preventDefault();
            const buttons = [...document.querySelectorAll('.filter-btn')];
            const currentIndex = buttons.indexOf(focusedButton);
            let nextIndex;
            
            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            } else {
                nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            }
            
            buttons[nextIndex].focus();
        }
    }
});

// Announce filter results to screen readers
function announceFilterResults() {
    const visibleCount = document.querySelectorAll('.project-card:not(.filtered-out)').length;
    const announcement = `${visibleCount} projects are now visible`;
    
    // Create or update ARIA live region
    let liveRegion = document.getElementById('filter-announcer');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'filter-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
}

/**
 * INTERACTIVE CONTACT FORM FEATURES
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeEmailCopy();
    initializeSocialInteractions();
});

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('sendMessageBtn');
    
    if (!form) return;
    
    // Initialize form features
    initializeFormValidation();
    initializeCharacterCounters();
    initializeFormProgress();
    initializeTypingIndicator();
    initializeFormSubmission();
    initializeEmailSuggestions();
}

function initializeFormValidation() {
    const inputs = document.querySelectorAll('.interactive-input');
    
    inputs.forEach(input => {
        // Real-time validation on input
        input.addEventListener('input', function() {
            validateField(this);
            updateFormProgress();
        });
        
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Enhanced focus effects
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
            updateDynamicHelp(this);
        });
        
        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
        });
    });
}

function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    const statusElement = document.getElementById(fieldId + 'Status');
    const helpElement = document.getElementById(fieldId + '-help');
    let isValid = true;
    let message = '';
    
    // Remove previous states
    field.classList.remove('valid', 'invalid');
    
    switch(fieldId) {
        case 'name':
            if (value.length === 0) {
                isValid = false;
                message = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                message = 'Name must be at least 2 characters';
            } else if (value.length > 100) {
                isValid = false;
                message = 'Name must be less than 100 characters';
            } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                isValid = false;
                message = 'Please enter a valid name';
            } else {
                message = '✓ Looks good!';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.length === 0) {
                isValid = false;
                message = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            } else {
                message = '✓ Valid email address';
            }
            break;
            
        case 'message':
            if (value.length === 0) {
                isValid = false;
                message = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                message = `Message must be at least 10 characters (${10 - value.length} more needed)`;
            } else if (value.length > 1000) {
                isValid = false;
                message = 'Message must be less than 1000 characters';
            } else {
                message = '✓ Great message!';
            }
            break;
    }
    
    // Update field appearance
    if (value.length > 0) {
        field.classList.add(isValid ? 'valid' : 'invalid');
    }
    
    // Update status indicator
    if (statusElement) {
        statusElement.textContent = isValid ? '✓' : '⚠';
        statusElement.className = 'input-status ' + (isValid ? 'valid' : 'invalid');
    }
    
    // Update help text
    if (helpElement && value.length > 0) {
        helpElement.textContent = message;
        helpElement.className = 'help-text dynamic-help ' + (isValid ? 'valid' : 'invalid');
    }
    
    return isValid;
}

function initializeCharacterCounters() {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const nameCounter = document.getElementById('nameCounter');
    const messageCounter = document.getElementById('messageCounter');
    
    if (nameInput && nameCounter) {
        nameInput.addEventListener('input', function() {
            const count = this.value.length;
            nameCounter.textContent = `${count}/100`;
            nameCounter.className = 'char-counter ' + (count > 90 ? 'warning' : count > 80 ? 'caution' : '');
        });
    }
    
    if (messageInput && messageCounter) {
        messageInput.addEventListener('input', function() {
            const count = this.value.length;
            messageCounter.textContent = `${count}/1000`;
            messageCounter.className = 'char-counter ' + (count > 900 ? 'warning' : count > 800 ? 'caution' : '');
        });
    }
}

function initializeFormProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    window.updateFormProgress = function() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        let completedFields = 0;
        let totalFields = 3;
        
        if (nameInput && nameInput.value.trim().length >= 2) completedFields++;
        if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) completedFields++;
        if (messageInput && messageInput.value.trim().length >= 10) completedFields++;
        
        const percentage = Math.round((completedFields / totalFields) * 100);
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `Form completion: ${percentage}%`;
        }
        
        return percentage;
    };
}

function initializeTypingIndicator() {
    const messageInput = document.getElementById('message');
    const typingIndicator = document.getElementById('typingIndicator');
    let typingTimer;
    
    if (messageInput && typingIndicator) {
        messageInput.addEventListener('input', function() {
            // Show typing indicator
            typingIndicator.classList.add('active');
            
            // Clear previous timer
            clearTimeout(typingTimer);
            
            // Hide typing indicator after 2 seconds of no typing
            typingTimer = setTimeout(() => {
                typingIndicator.classList.remove('active');
            }, 2000);
        });
    }
}

function initializeEmailSuggestions() {
    const emailInput = document.getElementById('email');
    const suggestionsContainer = document.getElementById('emailSuggestions');
    
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    
    if (emailInput && suggestionsContainer) {
        emailInput.addEventListener('input', function() {
            const value = this.value.trim();
            const atIndex = value.indexOf('@');
            
            if (atIndex > 0 && atIndex < value.length - 1) {
                const domain = value.substring(atIndex + 1);
                const suggestions = commonDomains
                    .filter(d => d.startsWith(domain) && d !== domain)
                    .slice(0, 3);
                
                if (suggestions.length > 0) {
                    const suggestionHTML = suggestions.map(suggestion => {
                        const fullEmail = value.substring(0, atIndex + 1) + suggestion;
                        return `<button type="button" class="email-suggestion" data-email="${fullEmail}">${fullEmail}</button>`;
                    }).join('');
                    
                    suggestionsContainer.innerHTML = suggestionHTML;
                    suggestionsContainer.style.display = 'block';
                    
                    // Add click handlers to suggestions
                    suggestionsContainer.querySelectorAll('.email-suggestion').forEach(btn => {
                        btn.addEventListener('click', function() {
                            emailInput.value = this.dataset.email;
                            suggestionsContainer.style.display = 'none';
                            validateField(emailInput);
                            updateFormProgress();
                        });
                    });
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!emailInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }
}

function initializeFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('sendMessageBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const formFeedback = document.getElementById('formFeedback');
    
    if (form && submitBtn) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields
            const nameValid = validateField(document.getElementById('name'));
            const emailValid = validateField(document.getElementById('email'));
            const messageValid = validateField(document.getElementById('message'));
            
            if (!nameValid || !emailValid || !messageValid) {
                showFormError('Please fix the errors above before submitting.');
                return;
            }
            
            // Show loading state
            submitBtn.classList.add('loading');
            
            try {
                // Submit form data
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success state
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    showFormSuccess();
                    form.reset();
                    
                    // Reset form state after delay
                    setTimeout(() => {
                        submitBtn.classList.remove('success');
                        updateFormProgress();
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Error state
                submitBtn.classList.remove('loading');
                showFormError('Failed to send message. Please try again.');
            }
        });
    }
    
    function showFormSuccess() {
        if (formFeedback && successMessage) {
            formFeedback.style.display = 'block';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        }
    }
    
    function showFormError(message) {
        if (formFeedback && errorMessage) {
            errorMessage.querySelector('p').textContent = message;
            formFeedback.style.display = 'block';
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        }
    }
}

function updateDynamicHelp(field) {
    const helpTexts = {
        name: [
            "Please enter your full name",
            "What should I call you?",
            "Your name helps me personalize our conversation",
            "First name and last name work best"
        ],
        email: [
            "Enter your email address for contact",
            "I'll use this to respond to your message",
            "Don't worry, I won't spam you!",
            "Make sure it's spelled correctly"
        ],
        message: [
            "What would you like to discuss?",
            "Tell me about your project ideas",
            "Share what's on your mind",
            "The more details, the better I can help",
            "Questions about collaboration? Let me know!"
        ]
    };
    
    const fieldTexts = helpTexts[field.id];
    if (fieldTexts) {
        const helpElement = document.getElementById(field.id + '-help');
        if (helpElement && field.value.length === 0) {
            const randomText = fieldTexts[Math.floor(Math.random() * fieldTexts.length)];
            helpElement.textContent = randomText;
        }
    }
}

function initializeEmailCopy() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const feedback = document.getElementById('copyFeedback');
    const email = 'wilmer.bacca1991@gmail.com';
    
    if (copyBtn && feedback) {
        copyBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(email);
                
                // Show success feedback
                feedback.classList.add('show');
                copyBtn.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    feedback.classList.remove('show');
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                feedback.classList.add('show');
                setTimeout(() => feedback.classList.remove('show'), 2000);
            }
        });
    }
}

function initializeSocialInteractions() {
    const socialLinks = document.querySelectorAll('.interactive-social');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        link.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 200);
        });
    });
}