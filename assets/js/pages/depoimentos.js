// ===== FUNCIONALIDADES DA PÁGINA DE DEPOIMENTOS =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FILTRO DE DEPOIMENTOS =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card, .featured-testimonial');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Atualizar botões ativos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar cards
            testimonialCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Atualizar contador de resultados
            updateResultsCounter();
        });
    });
    
    // ===== CONTADOR DE RESULTADOS =====
    function updateResultsCounter() {
        const visibleCards = document.querySelectorAll('.testimonial-card:not([style*="display: none"]), .featured-testimonial:not([style*="display: none"])');
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterText = activeFilter.textContent.trim();
        
        // Criar ou atualizar contador
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            counter.style.cssText = `
                text-align: center;
                margin: var(--spacing-lg) 0;
                font-size: var(--font-size-sm);
                color: var(--color-gray);
            `;
            document.querySelector('.filter-section .container').appendChild(counter);
        }
        
        counter.textContent = `${visibleCards.length} depoimento(s) encontrado(s) para "${filterText}"`;
    }
    
    // ===== CARREGAR MAIS DEPOIMENTOS =====
    const loadMoreBtn = document.getElementById('load-more');
    let currentPage = 1;
    const itemsPerPage = 6;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simular carregamento
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
            this.disabled = true;
            
            setTimeout(() => {
                loadMoreTestimonials();
                this.innerHTML = '<i class="fas fa-plus"></i> Carregar Mais Depoimentos';
                this.disabled = false;
                currentPage++;
                
                // Esconder botão se não houver mais conteúdo
                if (currentPage >= 3) {
                    this.style.display = 'none';
                    
                    // Mostrar mensagem de fim
                    const endMessage = document.createElement('p');
                    endMessage.textContent = 'Todos os depoimentos foram carregados!';
                    endMessage.style.cssText = `
                        text-align: center;
                        color: var(--color-gray);
                        font-style: italic;
                        margin-top: var(--spacing-lg);
                    `;
                    this.parentNode.appendChild(endMessage);
                }
            }, 1500);
        });
    }
    
    function loadMoreTestimonials() {
        const grid = document.querySelector('.testimonials-grid');
        const newTestimonials = [
            {
                name: 'Roberto Silva',
                petName: 'Tutora do Rex (Bulldog Francês)',
                category: 'weight-loss',
                rating: 5,
                text: 'O Rex estava com problemas respiratórios devido ao excesso de peso. Com o plano da Dra. Ana Paula, ele emagreceu de forma saudável e hoje respira muito melhor!',
                date: 'Julho 2024',
                categoryLabel: 'Perda de Peso',
                avatar: 'assets/images/testimonials/cliente-roberto.jpg'
            },
            {
                name: 'Camila Santos',
                petName: 'Tutora da Princesa (Persa)',
                category: 'nutrition',
                rating: 5,
                text: 'A Princesa é muito exigente com comida, mas as receitas naturais desenvolvidas pela Dra. Ana Paula conquistaram o paladar dela completamente!',
                date: 'Junho 2024',
                categoryLabel: 'Alimentação Natural',
                avatar: 'assets/images/testimonials/cliente-camila.jpg'
            }
        ];
        
        newTestimonials.forEach((testimonial, index) => {
            const card = createTestimonialCard(testimonial);
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            grid.appendChild(card);
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    function createTestimonialCard(testimonial) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.dataset.category = testimonial.category;
        
        const stars = Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('');
        
        card.innerHTML = `
            <div class="testimonial-header">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="client-avatar">
                <div class="client-info">
                    <h4 class="client-name">${testimonial.name}</h4>
                    <span class="pet-name">${testimonial.petName}</span>
                    <div class="rating">${stars}</div>
                </div>
            </div>
            <blockquote class="testimonial-quote">${testimonial.text}</blockquote>
            <div class="testimonial-footer">
                <span class="testimonial-date">${testimonial.date}</span>
                <span class="testimonial-category">${testimonial.categoryLabel}</span>
            </div>
        `;
        
        return card;
    }
    
    // ===== MODAL DE VÍDEO =====
    const videoCards = document.querySelectorAll('.video-card');
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const modalClose = document.getElementById('modal-close');
    
    const videoUrls = {
        0: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URLs
        1: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        2: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    };
    
    videoCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const videoUrl = videoUrls[index];
            if (videoUrl) {
                videoIframe.src = videoUrl;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Fechar modal
    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoIframe.src = '';
        document.body.style.overflow = '';
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeVideoModal);
    }
    
    videoModal?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeVideoModal();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    // ===== CONTADOR ANIMADO PARA ESTATÍSTICAS =====
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    function animateCounter(element, target) {
        const duration = 2000;
        const startValue = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (target - startValue) * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Observer para animar quando visível
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.target);
                
                if (!element.dataset.animated) {
                    element.dataset.animated = 'true';
                    animateCounter(element, target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => statsObserver.observe(el));
    
    // ===== FORMULÁRIO DE DEPOIMENTO =====
    const testimonialForm = document.getElementById('testimonial-form');
    
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                clientName: formData.get('client-name'),
                petName: formData.get('pet-name'),
                petBreed: formData.get('pet-breed'),
                testimonialText: formData.get('testimonial-text'),
                rating: formData.get('rating')
            };
            
            // Validação
            if (!data.clientName || !data.petName || !data.testimonialText || !data.rating) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Simular envio
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Depoimento enviado com sucesso! Obrigado por compartilhar sua experiência.', 'success');
                this.reset();
                
                // Reset rating
                const ratingInputs = this.querySelectorAll('input[name="rating"]');
                ratingInputs.forEach(input => input.checked = false);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
                });
    }
    
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
        
        // Mostrar notificação
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Fechar notificação
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto-fechar após 5 segundos
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
    
    // ===== RATING INTERATIVO =====
    const ratingInputs = document.querySelectorAll('.rating-input input');
    const ratingLabels = document.querySelectorAll('.rating-input label');
    
    ratingLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', function() {
            // Highlight até a estrela atual
            for (let i = ratingLabels.length - 1; i >= index; i--) {
                ratingLabels[i].style.color = '#ffc107';
            }
        });
        
        label.addEventListener('mouseleave', function() {
            // Reset para o valor selecionado
            const checkedInput = document.querySelector('.rating-input input:checked');
            const checkedIndex = checkedInput ? Array.from(ratingInputs).indexOf(checkedInput) : -1;
            
            ratingLabels.forEach((lbl, i) => {
                if (checkedIndex >= 0 && i >= ratingLabels.length - 1 - checkedIndex) {
                    lbl.style.color = '#ffc107';
                } else {
                    lbl.style.color = '#ddd';
                }
            });
        });
    });
    
    // ===== ANIMAÇÃO DOS CARDS AO SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem animar
    const animatedElements = document.querySelectorAll('.testimonial-card, .featured-testimonial, .video-card, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // ===== BUSCA EM DEPOIMENTOS =====
    function createSearchBox() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            margin: var(--spacing-lg) 0;
            text-align: center;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar depoimentos...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            padding: var(--spacing-md);
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: var(--border-radius-full);
            font-size: var(--font-size-base);
            width: 100%;
            max-width: 400px;
            transition: var(--transition-fast);
        `;
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-primary)';
            this.style.boxShadow = '0 0 0 3px rgba(252, 90, 141, 0.1)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(0, 0, 0, 0.2)';
            this.style.boxShadow = 'none';
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTestimonialsBySearch(searchTerm);
        });
        
        searchContainer.appendChild(searchInput);
        
        // Inserir após os filtros
        const filterSection = document.querySelector('.filter-section .container');
        filterSection.appendChild(searchContainer);
    }
    
    function filterTestimonialsBySearch(searchTerm) {
        const cards = document.querySelectorAll('.testimonial-card, .featured-testimonial');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Criar caixa de busca
    createSearchBox();
    
    // ===== COMPARTILHAMENTO SOCIAL =====
    function addSocialSharing() {
        const testimonialCards = document.querySelectorAll('.testimonial-card, .featured-testimonial');
        
        testimonialCards.forEach(card => {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-btn';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareBtn.style.cssText = `
                position: absolute;
                top: var(--spacing-md);
                right: var(--spacing-md);
                width: 32px;
                height: 32px;
                background: var(--color-primary);
                color: var(--color-white);
                border: none;
                border-radius: var(--border-radius-full);
                cursor: pointer;
                opacity: 0;
                transition: var(--transition-fast);
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            card.style.position = 'relative';
            card.appendChild(shareBtn);
            
            card.addEventListener('mouseenter', () => {
                shareBtn.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', () => {
                shareBtn.style.opacity = '0';
            });
            
            shareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const clientName = card.querySelector('.client-name').textContent;
                const testimonialText = card.querySelector('.testimonial-quote, .testimonial-text').textContent;
                const shareText = `Depoimento de ${clientName}: "${testimonialText.substring(0, 100)}..." - NaturaVet`;
                const shareUrl = window.location.href;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Depoimento NaturaVet',
                        text: shareText,
                        url: shareUrl
                    });
                } else {
                    // Fallback para cópia do link
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                        showNotification('Link copiado para a área de transferência!', 'success');
                    });
                }
            });
        });
    }
    
    // Adicionar botões de compartilhamento
    addSocialSharing();
    
    // ===== LAZY LOADING PARA IMAGENS =====
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        imageObserver.observe(img);
    });
    
    // ===== ANALYTICS E TRACKING =====
    function trackEvent(action, category, label) {
        // Integração com Google Analytics ou similar
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
    }
    
    // Rastrear interações
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('filter_click', 'testimonials', this.dataset.filter);
        });
    });
    
    videoCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            trackEvent('video_play', 'testimonials', `video_${index + 1}`);
        });
    });
    
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function() {
            trackEvent('form_submit', 'testimonials', 'new_testimonial');
        });
    }
    
    // ===== TOOLTIP PARA BADGES =====
    const badges = document.querySelectorAll('.testimonial-badge');
    badges.forEach(badge => {
        badge.title = 'Resultado destacado do tratamento';
        badge.style.cursor = 'help';
    });
    
    // ===== SCROLL SUAVE PARA SEÇÕES =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== INICIALIZAR CONTADOR DE RESULTADOS =====
    updateResultsCounter();
    
    // ===== EFEITO PARALLAX SIMPLES =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.testimonials-hero::before');
        
        if (heroBackground) {
            const speed = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // ===== MODO ESCURO (OPCIONAL) =====
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    }
    
    // Verificar preferência salva
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // ===== FEEDBACK DE CARREGAMENTO =====
    function showLoadingFeedback() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Carregando depoimentos...</p>
            </div>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.style.opacity = '1';
        }, 100);
        
        return loader;
    }
    
    function hideLoadingFeedback(loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 300);
    }
    
    // ===== VALIDAÇÃO DE ACESSIBILIDADE =====
    function improveAccessibility() {
        // Adicionar labels para screen readers
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', `Filtrar por ${btn.textContent.trim()}`);
            }
        });
        
        // Adicionar roles ARIA
        const testimonialCards = document.querySelectorAll('.testimonial-card, .featured-testimonial');
        testimonialCards.forEach(card => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', 'Depoimento de cliente');
        });
        
        // Melhorar navegação por teclado
        const interactiveElements = document.querySelectorAll('.filter-btn, .video-card, .load-more-btn');
        interactiveElements.forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Aplicar melhorias de acessibilidade
    improveAccessibility();
    
    // ===== PERFORMANCE MONITORING =====
    function measurePerformance() {
        // Medir tempo de carregamento da página
        window.addEventListener('load', function() {
            const loadTime = performance.now();
            console.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
            
            // Enviar métricas para analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'page_load',
                    value: Math.round(loadTime)
                });
            }
        });
        
        // Medir interações
        const startTime = performance.now();
        document.addEventListener('click', function() {
            const interactionTime = performance.now() - startTime;
            console.log(`Primeira interação em ${interactionTime.toFixed(2)}ms`);
        }, { once: true });
    }
    
    // Iniciar monitoramento de performance
    measurePerformance();
});