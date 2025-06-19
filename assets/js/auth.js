// ===== SISTEMA DE AUTENTICAÇÃO =====
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        this.init();
    }
    
    init() {
        this.loadUserFromStorage();
        this.setupSessionTimeout();
        this.setupBeforeUnload();
    }
    
    // ===== AUTENTICAÇÃO =====
    async login(email, password, userType, remember = false) {
        try {
            // Simular chamada para API
            const response = await this.simulateAPICall('/auth/login', {
                email,
                password,
                userType
            });
            
            if (response.success) {
                this.currentUser = response.user;
                this.saveUserToStorage(remember);
                this.startSessionTimeout();
                return { success: true, user: response.user };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: 'Erro de conexão' };
        }
    }
    
    async register(userData) {
        try {
            const response = await this.simulateAPICall('/auth/register', userData);
            return response;
        } catch (error) {
            return { success: false, error: 'Erro de conexão' };
        }
    }
    
    async forgotPassword(email) {
        try {
            const response = await this.simulateAPICall('/auth/forgot-password', { email });
            return response;
        } catch (error) {
            return { success: false, error: 'Erro de conexão' };
        }
    }
    
    logout() {
        this.currentUser = null;
        this.clearUserFromStorage();
        this.clearSessionTimeout();
        window.location.href = 'login.html';
    }
    
    // ===== VERIFICAÇÕES =====
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }
    
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions && this.currentUser.permissions.includes(permission);
    }
    
    // ===== STORAGE =====
    saveUserToStorage(remember = false) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('naturavet_user', JSON.stringify(this.currentUser));
        storage.setItem('naturavet_login_time', Date.now().toString());
    }
    
    loadUserFromStorage() {
        let userData = sessionStorage.getItem('naturavet_user') || localStorage.getItem('naturavet_user');
        let loginTime = sessionStorage.getItem('naturavet_login_time') || localStorage.getItem('naturavet_login_time');
        
        if (userData && loginTime) {
            const timeDiff = Date.now() - parseInt(loginTime);
            
            if (timeDiff < this.sessionTimeout) {
                this.currentUser = JSON.parse(userData);
                this.startSessionTimeout();
            } else {
                this.clearUserFromStorage();
            }
        }
    }
    
    clearUserFromStorage() {
        sessionStorage.removeItem('naturavet_user');
        sessionStorage.removeItem('naturavet_login_time');
        localStorage.removeItem('naturavet_user');
        localStorage.removeItem('naturavet_login_time');
    }
    
    // ===== TIMEOUT DE SESSÃO =====
    startSessionTimeout() {
        this.clearSessionTimeout();
        
        this.sessionTimeoutId = setTimeout(() => {
            this.showSessionExpiredModal();
        }, this.sessionTimeout);
    }
    
    clearSessionTimeout() {
        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
            this.sessionTimeoutId = null;
        }
    }
    
    setupSessionTimeout() {
        // Resetar timeout em atividade do usuário
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                if (this.isAuthenticated()) {
                    this.startSessionTimeout();
                }
            }, true);
        });
    }
    
    showSessionExpiredModal() {
        const modal = document.createElement('div');
        modal.className = 'session-expired-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>Sessão Expirada</h3>
                    <p>Sua sessão expirou por inatividade. Faça login novamente para continuar.</p>
                    <button class="btn btn-primary" onclick="window.location.href='login.html'">
                        Fazer Login
                    </button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(modal);
        this.logout();
    }
    
    // ===== SIMULAÇÃO DE API =====
    async simulateAPICall(endpoint, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simular diferentes respostas baseadas no endpoint
                if (endpoint === '/auth/login') {
                    if (data.email === 'admin@naturavet.com' && data.password === '123456') {
                        resolve({
                            success: true,
                            user: {
                                id: 1,
                                name: 'Administrador',
                                email: data.email,
                                role: data.userType,
                                permissions: ['read', 'write', 'delete', 'admin']
                            }
                        });
                    } else {
                        resolve({
                            success: false,
                            error: 'Credenciais inválidas'
                        });
                    }
                } else if (endpoint === '/auth/register') {
                    resolve({
                        success: true,
                        message: 'Usuário registrado com sucesso'
                    });
                } else if (endpoint === '/auth/forgot-password') {
                    resolve({
                        success: true,
                        message: 'E-mail de recuperação enviado'
                    });
                }
            }, 1000 + Math.random() * 1000); // Simular latência de rede
        });
    }
    
    // ===== PROTEÇÃO DE ROTAS =====
    protectRoute(requiredRole = null, requiredPermissions = []) {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        
        if (requiredRole && !this.hasRole(requiredRole)) {
            window.location.href = 'login.html?error=insufficient_permissions';
            return false;
        }
        
        if (requiredPermissions.length > 0) {
            const hasAllPermissions = requiredPermissions.every(permission => 
                this.hasPermission(permission)
            );
            
            if (!hasAllPermissions) {
                window.location.href = 'login.html?error=insufficient_permissions';
                return false;
            }
        }
        
        return true;
    }
    
    // ===== EVENTOS =====
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            if (this.isAuthenticated()) {
                // Salvar estado antes de sair
                this.saveUserToStorage(true);
            }
        });
    }
}

// Instância global do sistema de autenticação
window.authSystem = new AuthSystem();

// Funções utilitárias globais
window.isAuthenticated = () => window.authSystem.isAuthenticated();
window.getCurrentUser = () => window.authSystem.currentUser;
window.logout = () => window.authSystem.logout();
window.protectRoute = (role, permissions) => window.authSystem.protectRoute(role, permissions);