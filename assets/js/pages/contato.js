// ===== FUNCIONALIDADES DA PÁGINA DE CONTATO =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DOM =====
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successModal = document.getElementById('success-modal');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // ===== MÁSCARAS DE INPUT =====
    setupInputMasks();
    
    // ===== VALIDAÇÃO DE FORMULÁRIO =====
    setupFormValidation();
    
    // ===== FAQ ACCORDION =====
    setupFAQ();
    
    // ===== PREENCHIMENTO AUTOMÁTICO =====
    handleURLParams();
    
    // ===== MÁSCARAS DE INPUT =====
    function setupInputMasks() {
        const telefoneInput = document.getElementById('telefone');
        
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length <= 11) {
                    if (value.length <= 10) {
                        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                    } else {
                        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                    }
                }
                
                e.target.value = value;
            });
        }
        
        // Máscara para peso
        const pesoInput = document.getElementById('pet-peso');
        if (pesoInput) {
            pesoInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^\d.,]/g, '');
                value = value.replace(',', '.');
                e.target.value = value;
            });
        }
    }
    
    // ===== VALIDAÇÃO DE FORMULÁRIO =====
    function setupFormValidation() {
        if (!contactForm) return;
        
        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Validação especial para radio buttons
        const radioGroups = contactForm.querySelectorAll('input[type="radio"]');
        radioGroups.forEach(radio => {
            radio.addEventListener('change', function() {
                validateRadioGroup(this.name);
            });
        });
        
        // Validação especial para checkboxes
        const checkboxes = contactForm.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                validateCheckbox(this);
            });
        });
        
        // Submissão do formulário
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }
    
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Limpar erro anterior
        clearFieldError(field);
        
        // Validações específicas
        switch (fieldName) {
            case 'nome':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Nome é obrigatório';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'E-mail é obrigatório';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'E-mail inválido';
                }
                break;
                
            case 'telefone':
                const phoneRegex = /^$\d{2}$ \d{4,5}-\d{4}$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Telefone é obrigatório';
                } else if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Telefone inválido';
                }
                break;
                
            case 'pet-nome':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Nome do pet é obrigatório';
                }
                break;
                
            case 'pet-especie':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Espécie é obrigatória';
                }
                break;
                
            case 'pet-idade':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Idade do pet é obrigatória';
                }
                break;
                
            case 'servico':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Selecione um serviço';
                }
                break;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function validateRadioGroup(groupName) {
        const radios = contactForm.querySelectorAll(`input[name="${groupName}"]`);
        const isChecked = Array.from(radios).some(radio => radio.checked);
        const errorElement = document.getElementById(`${groupName}-error`);
        
        if (!isChecked) {
            if (errorElement) {
                errorElement.textContent = 'Selecione uma opção';
                errorElement.classList.add('show');
            }
            return false;
        } else {
            if (errorElement) {
                errorElement.classList.remove('show');
            }
            return true;
        }
    }
    
    function validateCheckbox(checkbox) {
        if (checkbox.name === 'aceita-termos') {
            const errorElement = document.getElementById('aceita-termos-error');
            
            if (!checkbox.checked) {
                if (errorElement) {
                    errorElement.textContent = 'Você deve aceitar os termos';
                    errorElement.classList.add('show');
                }
                return false;
            } else {
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
                return true;
            }
        }
        return true;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    function handleFormSubmit() {
        let isFormValid = true;
        
        // Validar todos os campos obrigatórios
        const requiredFields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        // Validar radio groups
        if (!validateRadioGroup('modalidade')) {
            isFormValid = false;
        }
        
        // Validar checkbox de termos
        const termosCheckbox = contactForm.querySelector('input[name="aceita-termos"]');
        if (termosCheckbox && !validateCheckbox(termosCheckbox)) {
            isFormValid = false;
        }
        
        if (!isFormValid) {
            showNotification('Por favor, corrija os erros no formulário.', 'error');
            
            // Scroll para o primeiro erro
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Simular envio
        submitForm();
    }
    
    function submitForm() {
        const originalText = submitBtn.innerHTML;
        
        // Desabilitar botão e mostrar loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Simular delay de envio
        setTimeout(() => {
            // Coletar dados do formulário
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Log dos dados (em produção, enviar para servidor)
            console.log('Dados do formulário:', data);
            
            // Mostrar modal de sucesso
            showSuccessModal();
            
            // Reset do formulário
            contactForm.reset();
            
            // Restaurar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Tracking
            trackEvent('form_submit', 'contact', 'consultation_request');
            
        }, 2000);
    }
    
    // ===== FAQ ACCORDION =====
    function setupFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Fechar outros itens
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle do item atual
                item.classList.toggle('active');
                
                // Tracking
                if (item.classList.contains('active')) {
                    const questionText = question.querySelector('h3').textContent;
                    trackEvent('faq_open', 'engagement', questionText);
                }
            });
        });
    }
    
    // ===== MODAL DE SUCESSO =====
    function showSuccessModal() {
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    window.closeModal = function() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Fechar modal clicando fora
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // ===== PREENCHIMENTO AUTOMÁTICO VIA URL =====
    function handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Preencher serviço se especificado na URL
        const service = urlParams.get('service');
        if (service) {
            const serviceSelect = document.getElementById('servico');
            if (serviceSelect) {
                const serviceMap = {
                    'consulta': 'consulta',
                    'plano': 'plano',
                    'acompanhamento': 'acompanhamento',
                    'online': 'online'
                };
                
                if (serviceMap[service]) {
                    serviceSelect.value = serviceMap[service];
                }
            }
        }
        
        // Preencher pacote se especificado na URL
        const package = urlParams.get('package');
        if (package) {
            const messageTextarea = document.getElementById('mensagem');
            if (messageTextarea) {
                const packageMessages = {
                    'basico': 'Tenho interesse no Pacote Básico.',
                    'completo': 'Tenho interesse no Pacote Completo.',
                    'premium': 'Tenho interesse no Pacote Premium.'
                };
                
                if (packageMessages[package]) {
                    messageTextarea.value = packageMessages[package];
                }
            }
        }
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
            z-index: 10001;
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
    
    // ===== SCROLL SUAVE PARA ÂNCORAS =====
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
    
    // ===== VALIDAÇÃO DE DATA =====
    const dataInput = document.getElementById('data-preferencia');
    if (dataInput) {
        // Definir data mínima como hoje
        const today = new Date().toISOString().split('T')[0];
        dataInput.min = today;
        
        // Definir data máxima como 3 meses à frente
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dataInput.max = maxDate.toISOString().split('T')[0];
    }
    
    // ===== CONTADOR DE CARACTERES =====
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const maxLength = 500;
        
        // Criar contador
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            font-size: var(--font-size-xs);
            color: var(--color-gray);
            text-align: right;
            margin-top: var(--spacing-xs);
        `;
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${textarea.value.length}/${maxLength} caracteres`;
            
            if (remaining < 50) {
                counter.style.color = 'var(--color-error)';
            } else {
                counter.style.color = 'var(--color-gray)';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
    
        // ===== AUTO-SAVE (OPCIONAL) =====
    function setupAutoSave() {
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('input', debounce(function() {
                saveFormData();
            }, 1000));
        });
        
        // Carregar dados salvos ao inicializar
        loadFormData();
    }
    
    function saveFormData() {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Salvar no localStorage
        localStorage.setItem('naturavet_contact_form', JSON.stringify(data));
    }
    
    function loadFormData() {
        const savedData = localStorage.getItem('naturavet_contact_form');
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const field = contactForm.querySelector(`[name="${key}"]`);
                    
                    if (field) {
                        if (field.type === 'radio') {
                            const radio = contactForm.querySelector(`[name="${key}"][value="${data[key]}"]`);
                            if (radio) radio.checked = true;
                        } else if (field.type === 'checkbox') {
                            field.checked = data[key] === 'on';
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                // Mostrar notificação de dados restaurados
                showNotification('Dados do formulário restaurados automaticamente.', 'info');
                
            } catch (e) {
                console.error('Erro ao carregar dados salvos:', e);
            }
        }
    }
    
    function clearSavedData() {
        localStorage.removeItem('naturavet_contact_form');
    }
    
    // Limpar dados salvos após envio bem-sucedido
    const originalShowSuccessModal = showSuccessModal;
    showSuccessModal = function() {
        clearSavedData();
        originalShowSuccessModal();
    };
    
    // ===== FUNÇÃO DEBOUNCE =====
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
    
    // ===== ANIMAÇÕES DE ENTRADA =====
    function setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll('.contact-method, .info-card, .faq-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
    
    // ===== VALIDAÇÃO DE HORÁRIO DE FUNCIONAMENTO =====
    function validateBusinessHours() {
        const now = new Date();
        const day = now.getDay(); // 0 = Domingo, 6 = Sábado
        const hour = now.getHours();
        
        let isBusinessHours = false;
        
        if (day >= 1 && day <= 5) { // Segunda a Sexta
            isBusinessHours = hour >= 8 && hour < 18;
        } else if (day === 6) { // Sábado
            isBusinessHours = hour >= 8 && hour < 14;
        }
        
        if (!isBusinessHours) {
            const warningMessage = document.createElement('div');
            warningMessage.className = 'business-hours-warning';
            warningMessage.style.cssText = `
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid #ffc107;
                border-radius: var(--border-radius-md);
                padding: var(--spacing-md);
                margin-bottom: var(--spacing-lg);
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            `;
            
            warningMessage.innerHTML = `
                <i class="fas fa-clock" style="color: #ffc107;"></i>
                <span style="font-size: var(--font-size-sm); color: var(--color-gray-dark);">
                    Estamos fora do horário comercial. Sua mensagem será respondida no próximo dia útil.
                </span>
            `;
            
            const formHeader = document.querySelector('.form-header');
            if (formHeader) {
                formHeader.appendChild(warningMessage);
            }
        }
    }
    
    // ===== INTEGRAÇÃO COM GOOGLE ANALYTICS =====
    function setupAnalytics() {
        // Rastrear tempo na página
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', function() {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            trackEvent('time_on_page', 'engagement', timeSpent);
        });
        
        // Rastrear scroll depth
        let maxScroll = 0;
        
        window.addEventListener('scroll', debounce(function() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Marcos de scroll
                if (maxScroll >= 25 && maxScroll < 50) {
                    trackEvent('scroll_depth', 'engagement', '25%');
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    trackEvent('scroll_depth', 'engagement', '50%');
                } else if (maxScroll >= 75 && maxScroll < 100) {
                    trackEvent('scroll_depth', 'engagement', '75%');
                } else if (maxScroll >= 100) {
                    trackEvent('scroll_depth', 'engagement', '100%');
                }
            }
        }, 500));
        
        // Rastrear cliques em links externos
        const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', function() {
                const linkType = this.href.startsWith('tel:') ? 'phone' :
                                this.href.startsWith('mailto:') ? 'email' :
                                this.href.includes('wa.me') ? 'whatsapp' : 'external';
                
                trackEvent('external_link_click', 'engagement', linkType);
            });
        });
    }
    
    // ===== DETECÇÃO DE DISPOSITIVO =====
    function detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
        
        if (isMobile && !isTablet) {
            // Ajustes específicos para mobile
            document.body.classList.add('mobile-device');
            
            // Focar automaticamente no primeiro campo em mobile pode ser intrusivo
            // então removemos o autofocus
            const firstInput = contactForm.querySelector('input');
            if (firstInput && firstInput.hasAttribute('autofocus')) {
                firstInput.removeAttribute('autofocus');
            }
        }
        
        // Trackear tipo de dispositivo
        trackEvent('device_type', 'technical', isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop');
    }
    
    // ===== ACESSIBILIDADE APRIMORADA =====
    function enhanceAccessibility() {
        // Adicionar labels para screen readers
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const label = group.querySelector('label');
            const input = group.querySelector('input, select, textarea');
            
            if (label && input && !input.getAttribute('aria-labelledby')) {
                const labelId = `label-${Math.random().toString(36).substr(2, 9)}`;
                label.id = labelId;
                input.setAttribute('aria-labelledby', labelId);
            }
        });
        
        // Adicionar aria-describedby para campos com erro
        const errorElements = contactForm.querySelectorAll('.form-error');
        errorElements.forEach(error => {
            const fieldName = error.id.replace('-error', '');
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            
            if (field) {
                field.setAttribute('aria-describedby', error.id);
            }
        });
        
        // Melhorar navegação por teclado
        const radioGroups = contactForm.querySelectorAll('.radio-group');
        radioGroups.forEach(group => {
            const radios = group.querySelectorAll('input[type="radio"]');
            
            radios.forEach((radio, index) => {
                radio.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        const nextIndex = (index + 1) % radios.length;
                        radios[nextIndex].focus();
                        radios[nextIndex].checked = true;
                    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const prevIndex = (index - 1 + radios.length) % radios.length;
                        radios[prevIndex].focus();
                        radios[prevIndex].checked = true;
                    }
                });
            });
        });
    }
    
    // ===== INICIALIZAÇÃO =====
    function init() {
        setupAutoSave();
        setupAnimations();
        validateBusinessHours();
        setupAnalytics();
        detectDevice();
        enhanceAccessibility();
        
        // Trackear carregamento da página
        trackEvent('page_load', 'technical', 'contact_page');
    }
    
    // Inicializar todas as funcionalidades
    init();
    
    // ===== TRATAMENTO DE ERROS GLOBAIS =====
    window.addEventListener('error', function(e) {
        console.error('Erro na página de contato:', e.error);
        trackEvent('javascript_error', 'technical', e.error.message);
    });
    
    // ===== FEEDBACK DE CONECTIVIDADE =====
    window.addEventListener('online', function() {
        showNotification('Conexão restaurada. Você pode enviar o formulário.', 'success');
    });
    
    window.addEventListener('offline', function() {
        showNotification('Sem conexão com a internet. Seus dados serão salvos localmente.', 'error');
    });
});