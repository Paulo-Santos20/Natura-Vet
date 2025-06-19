// ===== FUNCIONALIDADES DA PÁGINA DE BLOG =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CONFIGURAÇÕES E VARIÁVEIS GLOBAIS =====
    let currentPage = 1;
    let isLoading = false;
    let hasMorePosts = true;
    let currentFilters = {
        type: 'all',
        category: 'all',
        sort: 'newest',
        search: ''
    };
    
    // Simulação de dados do blog
    const blogPosts = [
        {
            id: 1,
            type: 'blog',
            title: 'Como Identificar Alergias Alimentares em Pets',
            excerpt: 'Aprenda a reconhecer os sinais de alergias alimentares em cães e gatos, e descubra como proceder para garantir o bem-estar do seu pet.',
            category: 'saude',
            date: '2025-01-10',
            readTime: 6,
            image: 'assets/images/blog/post-1.jpg',
            views: 1850,
            likes: 124,
            url: 'blog-posts/alergias-alimentares-pets.html'
        },
        {
            id: 2,
            type: 'blog',
            title: 'Receita: Biscoitos Naturais para Cães',
            excerpt: 'Uma receita simples e nutritiva de biscoitos caseiros que seu cão vai adorar. Ingredientes naturais e fáceis de encontrar.',
            category: 'receitas',
            date: '2025-01-08',
            readTime: 4,
            image: 'assets/images/blog/post-2.jpg',
            views: 2340,
            likes: 189,
            url: 'blog-posts/biscoitos-naturais-caes.html'
        },
        {
            id: 3,
            type: 'blog',
            title: 'Hidratação Adequada para Gatos',
            excerpt: 'Dicas essenciais para manter seu gato bem hidratado e prevenir problemas renais comuns na espécie.',
            category: 'cuidados',
            date: '2025-01-05',
            readTime: 5,
            image: 'assets/images/blog/post-3.jpg',
            views: 1650,
            likes: 98,
            url: 'blog-posts/hidratacao-gatos.html'
        }
    ];
    
    // Simulação de posts do Instagram
    const instagramPosts = [
        {
            id: 'ig1',
            type: 'instagram',
            title: 'Dica rápida: Frutas seguras para cães',
            excerpt: 'Maçã, banana e melancia são ótimas opções! Sempre sem sementes e com moderação. 🐕🍎',
            category: 'dicas',
            date: '2025-01-14',
            image: 'assets/images/blog/instagram-1.jpg',
            likes: 245,
            comments: 18,
            url: 'https://instagram.com/p/example1'
        },
        {
            id: 'ig2',
            type: 'instagram',
            title: 'Receita express: Patê de frango para gatos',
            excerpt: 'Ingredientes: peito de frango, cenoura e um pouquinho de água. Cozinhe e bata no liquidificador! 🐱',
            category: 'receitas',
            date: '2025-01-12',
            image: 'assets/images/blog/instagram-2.jpg',
            likes: 189,
            comments: 24,
            url: 'https://instagram.com/p/example2'
        }
    ];
    
    let allPosts = [...blogPosts, ...instagramPosts];
    let filteredPosts = [...allPosts];
    
    // ===== ELEMENTOS DOM =====
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const contentTypeButtons = document.querySelectorAll('.content-type-btn');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const postsGrid = document.getElementById('posts-grid');
    const loadingState = document.getElementById('loading-state');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const totalPostsElement = document.getElementById('total-posts');
    
    // ===== INICIALIZAÇÃO =====
    function init() {
        setupEventListeners();
        loadInstagramFeed();
        applyFilters();
        hideLoading();
    }
    
    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Busca
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchBtn.addEventListener('click', handleSearch);
        
        // Filtros de tipo de conteúdo
        contentTypeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                contentTypeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilters.type = this.dataset.type;
                applyFilters();
            });
        });
        
        // Filtros de categoria e ordenação
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyFilters();
        });
        
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyFilters();
        });
        
        // Carregar mais posts
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMorePosts);
        }
        
        // Newsletter
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
        
        // Links de categoria na sidebar
        const categoryLinks = document.querySelectorAll('.categories-list a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                categoryFilter.value = category;
                currentFilters.category = category;
                applyFilters();
                
                // Scroll para o topo dos posts
                document.querySelector('.posts-container').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // ===== FUNÇÕES DE BUSCA E FILTROS =====
    function handleSearch() {
        currentFilters.search = searchInput.value.toLowerCase().trim();
        currentPage = 1;
        applyFilters();
    }
    
    function applyFilters() {
        showLoading();
        
        setTimeout(() => {
            filteredPosts = allPosts.filter(post => {
                // Filtro por tipo
                if (currentFilters.type !== 'all' && post.type !== currentFilters.type) {
                    return false;
                }
                
                // Filtro por categoria
                if (currentFilters.category !== 'all' && post.category !== currentFilters.category) {
                    return false;
                }
                
                // Filtro por busca
                if (currentFilters.search) {
                    const searchTerm = currentFilters.search;
                    return post.title.toLowerCase().includes(searchTerm) ||
                           post.excerpt.toLowerCase().includes(searchTerm);
                }
                
                return true;
            });
            
            // Ordenação
            sortPosts();
            
            // Reset página e renderizar
            currentPage = 1;
            renderPosts();
            updateResultsCount();
            hideLoading();
            
        }, 500); // Simular delay de carregamento
    }
    
    function sortPosts() {
        switch (currentFilters.sort) {
            case 'newest':
                filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                filteredPosts.sort((a, b) => (b.views || b.likes) - (a.views || a.likes));
                break;
            case 'trending':
                // Simular trending baseado em likes recentes
                filteredPosts.sort((a, b) => b.likes - a.likes);
                break;
        }
    }
    
    // ===== RENDERIZAÇÃO DE POSTS =====
    function renderPosts(append = false) {
        if (!append) {
            postsGrid.innerHTML = '';
        }
        
        const postsPerPage = 6;
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);
        
        if (postsToShow.length === 0 && !append) {
            showNoResults();
            return;
        }
        
        hideNoResults();
        
        postsToShow.forEach((post, index) => {
            const postElement = createPostCard(post);
            postElement.style.opacity = '0';
            postElement.style.transform = 'translateY(30px)';
            postsGrid.appendChild(postElement);
            
            // Animação de entrada
            setTimeout(() => {
                postElement.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                postElement.style.opacity = '1';
                postElement.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Atualizar botão "Carregar Mais"
        updateLoadMoreButton();
    }
    
    function createPostCard(post) {
        const article = document.createElement('article');
        article.className = `post-card ${post.type === 'instagram' ? 'instagram-post-card' : ''}`;
        article.dataset.type = post.type;
        article.dataset.category = post.category;
        
        const isInstagram = post.type === 'instagram';
        const readTimeOrComments = isInstagram ? 
            `<span class="post-comments"><i class="fas fa-comment"></i> ${post.comments}</span>` :
            `<span class="post-read-time">${post.readTime} min</span>`;
        
        const statsHtml = isInstagram ?
            `<span class="post-likes"><i class="fas fa-heart"></i> ${post.likes}</span>` :
            `<span class="post-views"><i class="fas fa-eye"></i> ${post.views}</span>
             <span class="post-likes"><i class="fas fa-heart"></i> ${post.likes}</span>`;
        
        article.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="post-type">
                    <i class="fas fa-${isInstagram ? 'camera' : 'newspaper'}"></i>
                </div>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${getCategoryName(post.category)}</span>
                    <span class="post-date">${formatDate(post.date)}</span>
                    ${readTimeOrComments}
                </div>
                <h3 class="post-title">
                    <a href="${post.url}" ${isInstagram ? '' : ''}>${post.title}</a>
                </h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-stats">
                    ${statsHtml}
                </div>
            </div>
        `;
        
        // Event listener para tracking
        article.addEventListener('click', function() {
            trackEvent('post_click', post.type, post.title);
        });
        
        return article;
    }
    
    // ===== CARREGAR MAIS POSTS =====
    function loadMorePosts() {
        if (isLoading || !hasMorePosts) return;
        
        isLoading = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            currentPage++;
            renderPosts(true);
            
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Carregar Mais Posts';
            loadMoreBtn.disabled = false;
            isLoading = false;
        }, 1000);
    }
    
    function updateLoadMoreButton() {
        const totalPages = Math.ceil(filteredPosts.length / 6);
        hasMorePosts = currentPage < totalPages;
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = hasMorePosts ? 'block' : 'none';
        }
    }
    
    // ===== INSTAGRAM FEED =====
    function loadInstagramFeed() {
        const instagramFeed = document.getElementById('instagram-feed');
        if (!instagramFeed) return;
        
        // Simular posts do Instagram
        const instagramImages = [
            'assets/images/blog/instagram-feed-1.jpg',
            'assets/images/blog/instagram-feed-2.jpg',
            'assets/images/blog/instagram-feed-3.jpg',
            'assets/images/blog/instagram-feed-4.jpg',
            'assets/images/blog/instagram-feed-5.jpg',
            'assets/images/blog/instagram-feed-6.jpg'
        ];
        
        instagramImages.forEach((image, index) => {
            const post = document.createElement('div');
            post.className = 'instagram-post';
            post.innerHTML = `
                <img src="${image}" alt="Instagram post ${index + 1}" loading="lazy">
                <div class="instagram-post-overlay">
                    <div class="instagram-post-stats">
                        <span><i class="fas fa-heart"></i> ${Math.floor(Math.random() * 200) + 50}</span>
                        <span><i class="fas fa-comment"></i> ${Math.floor(Math.random() * 30) + 5}</span>
                    </div>
                </div>
            `;
            
            post.addEventListener('click', function() {
                window.open('https://instagram.com/naturavet', '_blank');
                trackEvent('instagram_click', 'widget', `post_${index + 1}`);
            });
            
            instagramFeed.appendChild(post);
        });
    }
    
    // ===== NEWSLETTER =====
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const button = this.querySelector('button');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        button.disabled = true;
        
        setTimeout(() => {
            showNotification('Inscrição realizada com sucesso! Obrigado por se juntar à nossa newsletter.', 'success');
            this.reset();
            button.innerHTML = originalText;
            button.disabled = false;
            
            trackEvent('newsletter_signup', 'engagement', email);
        }, 2000);
    }
    
    // ===== FUNÇÕES UTILITÁRIAS =====
    function getCategoryName(category) {
        const categories = {
            'nutricao': 'Nutrição',
            'receitas': 'Receitas',
            'cuidados': 'Cuidados',
            'dicas': 'Dicas',
            'saude': 'Saúde',
            'comportamento': 'Comportamento'
        };
        return categories[category] || category;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
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
    
    // ===== ESTADOS DE LOADING E RESULTADOS =====
    function showLoading() {
        if (loadingState) {
            loadingState.style.display = 'flex';
        }
        if (postsGrid) {
            postsGrid.style.display = 'none';
        }
    }
    
    function hideLoading() {
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        if (postsGrid) {
            postsGrid.style.display = 'grid';
        }
    }
    
    function showNoResults() {
        if (noResults) {
            noResults.style.display = 'block';
        }
        if (postsGrid) {
            postsGrid.style.display = 'none';
        }
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    function hideNoResults() {
        if (noResults) {
            noResults.style.display = 'none';
        }
    }
    
    function updateResultsCount() {
        if (resultsCount) {
            const count = filteredPosts.length;
            const activeFilter = document.querySelector('.content-type-btn.active').textContent.trim();
            resultsCount.textContent = `${count} post(s) encontrado(s) em "${activeFilter}"`;
        }
    }
    
      
    function animateCounter(element, target) {
        const duration = 2000;
        const startValue = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (target - startValue) * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // ===== LIMPAR FILTROS =====
    window.clearFilters = function() {
        searchInput.value = '';
        categoryFilter.value = 'all';
        sortFilter.value = 'newest';
        
        contentTypeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.content-type-btn[data-type="all"]').classList.add('active');
        
        currentFilters = {
            type: 'all',
            category: 'all',
            sort: 'newest',
            search: ''
        };
        
        applyFilters();
    };
    
    // ===== SISTEMA DE NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-white);
            border: 1px solid ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-primary)'};
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // ===== ANALYTICS E TRACKING =====
    function trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
    }
    
    // ===== LAZY LOADING PARA IMAGENS =====
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ===== SCROLL INFINITO (OPCIONAL) =====
    function setupInfiniteScroll() {
        let isNearBottom = false;
        
        window.addEventListener('scroll', debounce(function() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 1000) {
                if (!isNearBottom && hasMorePosts && !isLoading) {
                    isNearBottom = true;
                    loadMorePosts();
                }
            } else {
                isNearBottom = false;
            }
        }, 100));
    }
    
    // ===== INICIALIZAR APLICAÇÃO =====
    init();
    setupLazyLoading();
    // setupInfiniteScroll(); // Descomente para ativar scroll infinito
    
    // ===== TRATAMENTO DE PARÂMETROS URL =====
    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const search = urlParams.get('search');
        
        if (category && category !== 'all') {
            categoryFilter.value = category;
            currentFilters.category = category;
        }
        
        if (search) {
            searchInput.value = search;
            currentFilters.search = search.toLowerCase();
        }
        
        if (category || search) {
            applyFilters();
        }
    }
    
    // Aplicar parâmetros da URL
    handleUrlParams();
});