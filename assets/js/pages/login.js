// ===== FUNCIONALIDADES DA PÁGINA DE LOGIN - VERSÃO ATUALIZADA =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DOM =====
    const loginFormContainer = document.getElementById('login-form-container');
        const registerFormContainer = document.getElementById('register-form-container');
    const forgotPasswordContainer = document.getElementById('forgot-password-container');
    
    const backButtons = document.querySelectorAll('.back-button');
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');
    
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const testLoginButtons = document.querySelectorAll('.test-login-btn');
    
    // Credenciais de teste
    const testCredentials = {
        client: {
            email: 'cliente@naturavet.com',
            password: '123456',
            redirect: 'dashboard/client.html'
        },
        consultant: {
            email: 'consultor@naturavet.com',
            password: '123456',
            redirect: 'dashboard/consultant.html'
        },
        editor: {
            email: 'editor@naturavet.com',
            password: '123456',
            redirect: 'dashboard/editor.html'
        },
        admin: {
            email: 'admin@naturavet.com',
            password: '123456',
            redirect: 'dashboard/admin.html'
        }
    };
    
    // ===== INICIALIZAÇÃO =====
    init();
    
    function init() {
        setupEventListeners();
        handleURLParams();
        setupPasswordToggles();
        setupPasswordStrength();
        setupFormValidation();
        setupMasks();
        setupTestButtons();
    }
    
    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Botões de voltar
        backButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                showLoginForm();
            });
        });
        
        // Links de navegação
        document.getElementById('show-register-form')?.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
        
        document.getElementById('show-login-form')?.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
        
        document.getElementById('forgot-password')?.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordForm();
        });
        
        document.getElementById('back-to-login-link')?.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
        
        // Submissão de formulários
        loginForm?.addEventListener('submit', handleLoginSubmit);
        registerForm?.addEventListener('submit', handleRegisterSubmit);
        forgotForm?.addEventListener('submit', handleForgotSubmit);
        
        // Mudança de tipo no registro
        const regTipoSelect = document.getElementById('reg-tipo');
        if (regTipoSelect) {
            regTipoSelect.addEventListener('change', function() {
                toggleConditionalFields(this.value);
            });
        }
    }
    
    // ===== NAVEGAÇÃO ENTRE TELAS =====
    function showLoginForm() {
        hideAllContainers();
        loginFormContainer.style.display = 'block';
        
        // Limpar formulário
        if (loginForm) {
            loginForm.reset();
            clearFormErrors(loginForm);
        }
    }
    
    function showRegisterForm() {
        hideAllContainers();
        registerFormContainer.style.display = 'block';
        
        // Limpar formulário
        if (registerForm) {
            registerForm.reset();
            clearFormErrors(registerForm);
            toggleConditionalFields('');
        }
    }
    
    function showForgotPasswordForm() {
        hideAllContainers();
        forgotPasswordContainer.style.display = 'block';
        
        // Limpar formulário
        if (forgotForm) {
            forgotForm.reset();
            clearFormErrors(forgotForm);
        }
    }
    
    function hideAllContainers() {
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'none';
        forgotPasswordContainer.style.display = 'none';
    }
    
    // ===== BOTÕES DE TESTE =====
    function setupTestButtons() {
        testLoginButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const profileCard = this.closest('.test-profile-card');
                const profile = profileCard.dataset.profile;
                
                if (testCredentials[profile]) {
                    performTestLogin(profile);
                }
            });
        });
    }
    
    function performTestLogin(profile) {
        const credentials = testCredentials[profile];
        
        // Preencher formulário de login
        document.getElementById('email').value = credentials.email;
        document.getElementById('password').value = credentials.password;
        
        // Mostrar notificação
        showNotification(`Entrando como ${getProfileName(profile)}...`, 'info');
        
        // Simular login automático
        setTimeout(() => {
            simulateLogin(credentials.email, credentials.password, false, profile);
        }, 1000);
        
        // Trackear evento
        trackEvent('test_login', 'authentication', profile);
    }
    
    function getProfileName(profile) {
        const names = {
            client: 'Cliente',
            consultant: 'Consultor',
            editor: 'Editor',
            admin: 'Administrador'
        };
        return names[profile] || profile;
    }
    
    // ===== CAMPOS CONDICIONAIS NO REGISTRO =====
    function toggleConditionalFields(userType) {
        const clientFields = document.getElementById('client-fields');
        const consultantFields = document.getElementById('consultant-fields');
        
        // Esconder todos os campos
        if (clientFields) clientFields.style.display = 'none';
        if (consultantFields) consultantFields.style.display = 'none';
        
        // Mostrar campos específicos
        if (userType === 'client' && clientFields) {
            clientFields.style.display = 'block';
        } else if (userType === 'consultant' && consultantFields) {
            consultantFields.style.display = 'block';
        }
    }
    
    // ===== TOGGLE DE SENHA =====
    function setupPasswordToggles() {
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.parentNode.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }
    
    // ===== FORÇA DA SENHA =====
    function setupPasswordStrength() {
        const passwordInput = document.getElementById('reg-password');
        const strengthIndicator = document.getElementById('password-strength');
        
        if (!passwordInput || !strengthIndicator) return;
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strengthIndicator, strength);
        });
    }
    
    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = 'Digite uma senha';
        
        if (password.length === 0) {
            return { score: 0, feedback: 'Digite uma senha', level: '' };
        }
        
        // Critérios de força
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // Determinar nível
        if (score < 3) {
            feedback = 'Senha fraca';
            return { score, feedback, level: 'weak' };
        } else if (score < 4) {
            feedback = 'Senha razoável';
            return { score, feedback, level: 'fair' };
        } else if (score < 5) {
            feedback = 'Senha boa';
            return { score, feedback, level: 'good' };
        } else {
            feedback = 'Senha forte';
            return { score, feedback, level: 'strong' };
        }
    }
    
    function updatePasswordStrength(indicator, strength) {
        const fill = indicator.querySelector('.strength-fill');
        const text = indicator.querySelector('.strength-text');
        
        fill.className = `strength-fill ${strength.level}`;
        text.textContent = strength.feedback;
    }
    
    // ===== MÁSCARAS DE INPUT =====
    function setupMasks() {
        const telefoneInput = document.getElementById('reg-telefone');
        
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
    }
    
    // ===== VALIDAÇÃO DE FORMULÁRIOS =====
    function setupFormValidation() {
        // Validação em tempo real
        const allInputs = document.querySelectorAll('input, select');
        allInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
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
            case 'email':
            case 'reg-email':
            case 'forgot-email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'E-mail é obrigatório';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'E-mail inválido';
                }
                break;
                
            case 'password':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Senha é obrigatória';
                }
                break;
                
            case 'reg-password':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Senha é obrigatória';
                } else if (value.length < 8) {
                    isValid = false;
                    errorMessage = 'Senha deve ter pelo menos 8 caracteres';
                }
                break;
                
            case 'confirm-password':
                const originalPassword = document.getElementById('reg-password').value;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Confirmação de senha é obrigatória';
                } else if (value !== originalPassword) {
                    isValid = false;
                    errorMessage = 'Senhas não coincidem';
                }
                break;
                
            case 'nome':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Nome é obrigatório';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
                
            case 'telefone':
                const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Telefone é obrigatório';
                } else if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Telefone inválido';
                }
                break;
                
            case 'tipo':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Selecione um tipo de conta';
                }
                break;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            showFieldSuccess(field);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('valid');
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            formGroup.classList.remove('valid');
        }
        
        const errorElement = document.getElementById(`${field.name}-error`) || 
                           document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('valid');
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            formGroup.classList.add('valid');
        }
        
        const errorElement = document.getElementById(`${field.name}-error`) || 
                           document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('error', 'valid');
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error', 'valid');
        }
        
        const errorElement = document.getElementById(`${field.name}-error`) || 
                           document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    function clearFormErrors(form) {
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(error => error.classList.remove('show'));
        
        const fields = form.querySelectorAll('input, select');
        fields.forEach(field => {
            field.classList.remove('error', 'valid');
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error', 'valid');
            }
        });
    }
    
    // ===== SUBMISSÃO DE FORMULÁRIOS =====
    function handleLoginSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validar campos
        let isValid = true;
        if (!validateField(document.getElementById('email'))) isValid = false;
        if (!validateField(document.getElementById('password'))) isValid = false;
        
        if (!isValid) {
            showNotification('Por favor, corrija os erros no formulário.', 'error');
            return;
        }
        
        // Determinar tipo de usuário baseado no e-mail
        const userType = determineUserTypeFromEmail(email);
        
        // Simular login
        simulateLogin(email, password, remember, userType);
    }
    
    function handleRegisterSubmit(e) {
        e.preventDefault();
        
        // Validar todos os campos obrigatórios
        let isValid = true;
        const requiredFields = registerForm.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validar checkbox de termos
        const termosCheckbox = registerForm.querySelector('input[name="aceita-termos"]');
        if (termosCheckbox && !termosCheckbox.checked) {
            showNotification('Você deve aceitar os termos de uso.', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            showNotification('Por favor, corrija os erros no formulário.', 'error');
            return;
        }
        
        // Simular registro
        simulateRegister();
    }
    
    function handleForgotSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgot-email').value;
        
        if (!validateField(document.getElementById('forgot-email'))) {
            showNotification('Por favor, digite um e-mail válido.', 'error');
            return;
        }
        
        // Simular recuperação de senha
        simulateForgotPassword(email);
    }
    
    // ===== SIMULAÇÕES =====
    function simulateLogin(email, password, remember, userType = null) {
        const loginBtn = document.getElementById('login-btn');
        const originalText = loginBtn.innerHTML;
        
        // Mostrar loading
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        setTimeout(() => {
            // Verificar credenciais de teste
            const isTestCredential = Object.values(testCredentials).some(cred => 
                cred.email === email && cred.password === password
            );
            
            if (isTestCredential || (email === 'admin@naturavet.com' && password === '123456')) {
                // Login bem-sucedido
                showNotification('Login realizado com sucesso!', 'success');
                
                // Salvar dados se "lembrar" estiver marcado
                if (remember) {
                    localStorage.setItem('naturavet_remember_email', email);
                }
                
                // Determinar redirecionamento
                const redirectUrl = determineRedirectUrl(email, userType);
                
                // Redirecionar
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1500);
                
            } else {
                // Login falhou
                showNotification('E-mail ou senha incorretos.', 'error');
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
                loginBtn.innerHTML = originalText;
            }
            
        }, 2000);
    }
    
    function simulateRegister() {
        const registerBtn = document.getElementById('register-btn');
        
        // Mostrar loading
        registerBtn.classList.add('loading');
        registerBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Conta criada com sucesso! Verifique seu e-mail.', 'success');
            
            // Voltar para login após sucesso
            setTimeout(() => {
                showLoginForm();
                registerBtn.classList.remove('loading');
                registerBtn.disabled = false;
            }, 2000);
            
        }, 2000);
    }
    
    function simulateForgotPassword(email) {
        const forgotBtn = document.getElementById('forgot-btn');
        
        // Mostrar loading
        forgotBtn.classList.add('loading');
        forgotBtn.disabled = true;
        
        setTimeout(() => {
            showNotification(`Instruções enviadas para ${email}`, 'success');
            
            // Voltar para login após sucesso
            setTimeout(() => {
                showLoginForm();
                forgotBtn.classList.remove('loading');
                forgotBtn.disabled = false;
            }, 2000);
            
        }, 2000);
    }
    
    // ===== UTILITÁRIOS =====
    function determineUserTypeFromEmail(email) {
        for (const [type, credentials] of Object.entries(testCredentials)) {
            if (credentials.email === email) {
                return type;
            }
        }
        return 'client'; // Default
    }
    
    function determineRedirectUrl(email, userType = null) {
        // Se userType foi especificado, usar ele
        if (userType && testCredentials[userType]) {
            return testCredentials[userType].redirect;
        }
        
        // Caso contrário, determinar pelo e-mail
        for (const [type, credentials] of Object.entries(testCredentials)) {
            if (credentials.email === email) {
                return credentials.redirect;
            }
        }
        
        return 'dashboard/client.html'; // Default
    }
    
    // ===== PARÂMETROS URL =====
    function handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        
        if (action === 'register') {
            showRegisterForm();
        }
        
        // Preencher e-mail se salvo
        const rememberedEmail = localStorage.getItem('naturavet_remember_email');
        if (rememberedEmail) {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = rememberedEmail;
                document.getElementById('remember').checked = true;
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
    
    // ===== ANALYTICS =====
    function trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
    }
    
    // ===== SEGURANÇA =====
    function setupSecurityFeatures() {
        // Prevenir ataques de força bruta (simulado)
        let loginAttempts = 0;
        const maxAttempts = 5;
        
        loginForm?.addEventListener('submit', function() {
            loginAttempts++;
            
            if (loginAttempts >= maxAttempts) {
                showNotification('Muitas tentativas de login. Tente novamente em 15 minutos.', 'error');
                document.getElementById('login-btn').disabled = true;
                
                setTimeout(() => {
                    loginAttempts = 0;
                    document.getElementById('login-btn').disabled = false;
                }, 900000); // 15 minutos
            }
        });
        
        // Detectar preenchimento automático suspeito
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.length > 100) {
                    this.value = this.value.substring(0, 100);
                    showNotification('Entrada muito longa detectada e truncada.', 'warning');
                }
            });
        });
    }
    
    // ===== ACESSIBILIDADE =====
    function enhanceAccessibility() {
        // Adicionar labels para screen readers
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const label = group.querySelector('label');
            const input = group.querySelector('input, select');
            
            if (label && input && !input.getAttribute('aria-labelledby')) {
                const labelId = `label-${Math.random().toString(36).substr(2, 9)}`;
                label.id = labelId;
                input.setAttribute('aria-labelledby', labelId);
            }
        });
        
        // Melhorar navegação por teclado nos botões de teste
        testLoginButtons.forEach((btn, index) => {
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('aria-label', `Login de teste como ${getProfileName(btn.closest('.test-profile-card').dataset.profile)}`);
            
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // ===== INICIALIZAÇÃO FINAL =====
    setupSecurityFeatures();
    enhanceAccessibility();
    
    // Trackear carregamento da página
    trackEvent('page_load', 'authentication', 'login_page_v2');
});