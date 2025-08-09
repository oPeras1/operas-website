let blogPosts = [];
let filteredPosts = [];

// Load blog posts from JSON file
async function loadBlogPosts() {
    try {
        const response = await fetch('blog-post/blog-posts.json');
        blogPosts = await response.json();
        filteredPosts = [...blogPosts];
        
        //displayFeaturedPost();
        displayAllPosts();
        updatePostCount();
        updateDynamicYear();
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        displayError();
    }
}

// Display featured post (latest post)
function displayFeaturedPost() {
    const featuredContainer = document.getElementById('featuredPost');
    
    if (blogPosts.length === 0) {
        featuredContainer.innerHTML = '<div class="loading">No posts available</div>';
        return;
    }
    
    const latestPost = blogPosts[0]; // Assuming first post is the latest
    const readingTime = calculateReadingTime(latestPost.content);
    
    featuredContainer.innerHTML = `
        <div class="featured-badge">
            <span>⭐</span>
            Featured Article
        </div>
        <h3 class="post-title">${latestPost.title}</h3>
        <div class="post-meta">
            <span class="post-date">
                <span>📅</span>
                ${latestPost.date}
            </span>
            <span class="post-read-time">
                <span>⏱️</span>
                ${readingTime} min read
            </span>
        </div>
        <p class="post-excerpt">${latestPost.excerpt}</p>
        <a href="https://blog.operas.pt/blog-post/blog-post.html?id=${latestPost.id}" class="read-more-btn">
            Read Full Article
            <span>→</span>
        </a>
    `;
    
    // Make the entire featured post clickable
    featuredContainer.addEventListener('click', (e) => {
        if (!e.target.closest('.read-more-btn')) {
            window.location.href = `https://blog.operas.pt/blog-post/blog-post.html?id=${latestPost.id}`;
        }
    });
}

// Display all posts in grid
function displayAllPosts() {
    const postsGrid = document.getElementById('postsGrid');
    
    if (filteredPosts.length === 0) {
        postsGrid.innerHTML = '<div class="no-results">No articles found matching your search.</div>';
        return;
    }
    
    postsGrid.innerHTML = filteredPosts.map(post => {
        const readingTime = calculateReadingTime(post.content);
        
        return `
            <a href="https://blog.operas.pt/blog-post/blog-post.html?id=${post.id}" class="post-card">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="post-date">
                        <span>📅</span>
                        ${post.date}
                    </span>
                    <span class="post-read-time">
                        <span>⏱️</span>
                        ${readingTime} min read
                    </span>
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <span class="read-more-btn">
                    Read More
                    <span>→</span>
                </span>
            </a>
        `;
    }).join('');
}

// Calculate reading time based on word count
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// Update post count in stats
function updatePostCount() {
    const totalPostsElement = document.getElementById('totalPosts');
    if (totalPostsElement) {
        totalPostsElement.textContent = blogPosts.length;
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterPosts(searchTerm);
    });
    
    // Clear search on escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterPosts('');
        }
    });
}

// Filter posts based on search term and active tag
function filterPosts(searchTerm = '') {
    const activeTag = document.querySelector('.tag-filter.active')?.dataset.tag || 'all';
    
    filteredPosts = blogPosts.filter(post => {
        const matchesSearch = searchTerm === '' || 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm);
        
        const matchesTag = activeTag === 'all' || getPostTags(post).includes(activeTag);
        
        return matchesSearch && matchesTag;
    });
    
    displayAllPosts();
}

// Get tags for a post based on content analysis
function getPostTags(post) {
    const tags = [];
    const content = (post.title + ' ' + post.content).toLowerCase();
    
    if (content.includes('vulnerability') || content.includes('exploit')) {
        tags.push('cybersecurity');
    }
    
    return tags;
}

// Setup tag filtering
function setupTagFiltering() {
    const tagFilters = document.querySelectorAll('.tag-filter');
    
    tagFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all filters
            tagFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            filter.classList.add('active');
            
            // Filter posts
            const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
            filterPosts(searchTerm);
        });
    });
}

// Display error message
function displayError() {
    const featuredContainer = document.getElementById('featuredPost');
    const postsGrid = document.getElementById('postsGrid');
    
    const errorHTML = `
        <div class="error-message">
            <h3>Oops! Something went wrong</h3>
            <p>Unable to load blog posts. Please try again later.</p>
        </div>
    `;
    
    featuredContainer.innerHTML = errorHTML;
    postsGrid.innerHTML = errorHTML;
}

// Smooth scrolling for internal links
function setupSmoothScrolling() {
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(10px)';
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add reading progress indicator
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ff6b35, #f7931e);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    setupSearch();
    setupTagFiltering();
    setupSmoothScrolling();
    addScrollToTop();
    addReadingProgress();
    
    // Add stagger animation to post cards
    setTimeout(() => {
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
});

// Update dynamic year in the "Since" stat and copyright
function updateDynamicYear() {
    const currentYear = new Date().getFullYear();
    
    const yearElements = document.querySelectorAll('.stat-number');
    yearElements.forEach(element => {
        if (element.textContent.trim() === '2025') {
            element.textContent = currentYear;
        }
    });
    
    const copyrightText = document.querySelector('.footer-copy p');
    if (copyrightText) {
        copyrightText.innerHTML = `&copy; ${currentYear} oPeras. All rights reserved.`;
    }
}
