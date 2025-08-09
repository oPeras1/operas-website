function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Remove active class from all nav buttons
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to corresponding button
    const targetButton = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // Update URL hash without triggering hashchange event
    if (window.location.hash !== `#${pageId}`) {
        history.replaceState(null, null, `#${pageId}`);
    }
}

// Handle hash changes in URL
function handleHashChange() {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const validPages = ['about', 'resume', 'portfolio', 'blog', 'contact'];
    
    if (hash && validPages.includes(hash)) {
        showPage(hash);
    } else {
        // Default to about page if hash is invalid or empty
        showPage('about');
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    const data = {
        name,
        email,
        subject,
        message
    };

    try {
        const response = await fetch('https://mail.operas.pt/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification('Thank you for your message! I\'ll get back to you as soon as possible.');
            event.target.reset();
        } else {
            const errorData = await response.json();
            showNotification(`Error: ${errorData.message || 'Something went wrong.'}`, 'error');
        }
    } catch (error) {
        console.error('Failed to send message:', error);
        showNotification('Failed to send message. Please try again later.', 'error');
    }
}

// Add smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    // Set up hash routing
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial page load with hash
    handleHashChange();
    
    // Add hover effects to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}