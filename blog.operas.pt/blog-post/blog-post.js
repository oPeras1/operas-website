let currentPost = null;
let allPosts = [];

// Get post ID from URL parameters
function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load blog post data
async function loadBlogPost() {
    const postId = getPostIdFromUrl();
    
    if (!postId) {
        displayError('No post ID specified');
        return;
    }
    
    try {
        const response = await fetch('blog-posts.json');
        allPosts = await response.json();
        
        currentPost = allPosts.find(post => post.id === postId);
        
        if (!currentPost) {
            displayError('Blog post not found');
            return;
        }
        
        displayBlogPost(currentPost);
        displayRelatedPosts();
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        displayError('Failed to load blog post');
    }
}

// Display the blog post
function displayBlogPost(post) {
    // Title
    document.title = `${post.title} - oPeras Blog`;
    document.getElementById('pageTitle').textContent = `${post.title} - oPeras Blog`;
    
    // Content
    document.getElementById('articleTitle').textContent = post.title;
    document.getElementById('articleDate').textContent = post.date;
    
    // Reading time
    const wordCount = post.content.split(' ').length;
    const readingTime = Math.ceil(wordCount / 150);
    document.getElementById('readingTime').textContent = `${readingTime} min read`;
    
    // Tags
    const tags = getPostTags(post);
    const tagsContainer = document.getElementById('articleTags');
    if (tags.length > 0) {
        tagsContainer.innerHTML = tags.map(tag => 
            `<span class="tag">${formatTagName(tag)}</span>`
        ).join('');
    }
    
    document.getElementById('articleContent').innerHTML = post.content;

    highlightCodeBlocks();
    addReadingProgress();
    addTableOfContents();
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

// Format tag names for display
function formatTagName(tag) {
    const tagNames = {
        'cybersecurity': 'Cybersecurity',
    };
    return tagNames[tag] || tag;
}

// Display related posts
function displayRelatedPosts() {
    const relatedContainer = document.getElementById('relatedPosts');
    
    if (!currentPost || allPosts.length <= 1) {
        relatedContainer.innerHTML = '<p style="color: #888; font-style: italic;">No related posts available.</p>';
        return;
    }
    
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
    
    // Show up to 3 related posts
    const relatedPosts = otherPosts.slice(0, 3);
    
    if (relatedPosts.length === 0) {
        relatedContainer.innerHTML = '<p style="color: #888; font-style: italic;">No related posts available.</p>';
        return;
    }
    
    relatedContainer.innerHTML = `
        <h4 style="color: #fff; margin-bottom: 1rem; font-size: 1.1rem;">Related Articles</h4>
        ${relatedPosts.map(post => `
            <a href="https://blog.operas.pt/blog-post/blog-post.html?id=${post.id}" class="related-post">
                <div class="related-post-title">${post.title}</div>
                <div class="related-post-date">${post.date}</div>
            </a>
        `).join('')}
    `;
}

// Display error message
function displayError(message) {
    document.getElementById('articleContent').innerHTML = `
        <div class="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>${message}</p>
            <a href="https://blog.operas.pt" class="nav-link" style="margin-top: 1rem; display: inline-flex;">
                ← Back to blog
            </a>
        </div>
    `;
}

// Add table of contents for long articles
function addTableOfContents() {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    
    if (headings.length < 3) return;
    
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = `
        <h4>Table of Contents</h4>
        <ul>
            ${Array.from(headings).map((heading, index) => {
                const id = `heading-${index}`;
                heading.id = id;
                const level = heading.tagName.toLowerCase();
                return `<li class="toc-${level}"><a href="#${id}">${heading.textContent}</a></li>`;
            }).join('')}
        </ul>
    `;
    
    tocContainer.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 2rem 0;
    `;
    
    const tocStyles = document.createElement('style');
    tocStyles.textContent = `
        .table-of-contents h4 {
            color: #ff6b35 !important;
            margin-bottom: 1rem !important;
            font-size: 1.1rem !important;
        }
        .table-of-contents ul {
            list-style: none !important;
            padding-left: 0 !important;
        }
        .table-of-contents li {
            margin-bottom: 0.5rem !important;
        }
        .table-of-contents a {
            color: #ccc;
            text-decoration: none;
            transition: color 0.3s ease;
            font-size: 0.9rem;
        }
        .table-of-contents a:hover {
            color: #ff6b35;
        }
        .toc-h3 {
            padding-left: 1rem;
        }
        .toc-h3 a {
            font-size: 0.85rem;
            color: #aaa;
        }
    `;
    document.head.appendChild(tocStyles);
    
    const firstParagraph = document.querySelector('.article-content p');
    if (firstParagraph) {
        firstParagraph.parentNode.insertBefore(tocContainer, firstParagraph.nextSibling);
    }
}

// Highlight code blocks
function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // Add basic syntax highlighting classes
        const text = block.textContent;
        
        const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export'];
        let highlightedText = text;
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlightedText = highlightedText.replace(regex, `<span style="color: #ff6b35; font-weight: 600;">${keyword}</span>`);
        });
        
        highlightedText = highlightedText.replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, 
            '<span style="color: #a8e6cf;">$1$2$3</span>');
        
        highlightedText = highlightedText.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, 
            '<span style="color: #888; font-style: italic;">$1</span>');
        
        block.innerHTML = highlightedText;
    });
}

// Social sharing functions (Will anyone use these?)
function shareOnTwitter() {
    if (!currentPost) return;
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: "${currentPost.title}" by Hugo Pereira`);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
    if (!currentPost) return;
    
    const url = encodeURIComponent(window.location.href);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
}

function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => {
            showCopyConfirmation();
        }).catch(err => {
            fallbackCopyLink(url);
        });
    } else {
        fallbackCopyLink(url);
    }
}

// Fallback copy method for older browsers
function fallbackCopyLink(url) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyConfirmation();
    } catch (err) {
        console.error('Failed to copy link:', err);
        alert('Failed to copy link to clipboard');
    }
    
    document.body.removeChild(textArea);
}

// Show copy confirmation
function showCopyConfirmation() {
    const copyBtn = document.querySelector('.share-btn.copy');
    const originalHTML = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<span class="share-icon">✓</span><span class="share-text">Copied!</span>';
    copyBtn.style.background = 'rgba(0, 255, 0, 0.2)';
    copyBtn.style.borderColor = 'rgba(0, 255, 0, 0.4)';
    copyBtn.style.color = '#00ff88';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.background = '';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
    }, 2000);
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
        const article = document.querySelector('.article-content');
        if (!article) return;
        
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const articleStart = articleTop - viewportHeight / 3;
        const articleEnd = articleTop + articleHeight - viewportHeight / 3;
        
        if (scrollTop < articleStart) {
            progressBar.style.width = '0%';
        } else if (scrollTop > articleEnd) {
            progressBar.style.width = '100%';
        } else {
            const progress = ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100;
            progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
        }
    });
}

// Add smooth scrolling for internal links
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
                
                targetElement.style.transition = 'background-color 0.3s ease';
                targetElement.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                targetElement.style.padding = '0.5rem';
                targetElement.style.borderRadius = '8px';
                
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                    targetElement.style.padding = '';
                    targetElement.style.borderRadius = '';
                }, 2000);
            }
        }
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.location.href = 'https://blog.operas.pt/';
        }
        
        if (e.key === 'ArrowLeft' && e.altKey) {
            window.location.href = 'https://blog.operas.pt/';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPost();
    setupSmoothScrolling();
    setupKeyboardNavigation();
    
    // Add estimated reading time to browser tab
    setTimeout(() => {
        if (currentPost) {
            const readingTime = Math.ceil(currentPost.content.split(' ').length / 150);
            document.title = `${currentPost.title} (${readingTime} min read) - oPeras Blog`;
        }
    }, 1000);
});
