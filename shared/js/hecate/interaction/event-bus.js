// ============================================
// 🗝️ HÉCATE - EVENT BUS
// Barramento de eventos do sistema de defesa
// ============================================

(function() {
    'use strict';
    
    class EventBus {
        constructor() {
            this.events = new Map();
            this.debug = false;
            this.name = 'Hécate';
        }
        
        // ============================================
        // REGISTRO DE EVENTOS
        // ============================================
        
        // Registrar evento com prioridade
        on(event, callback, priority = 0) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }
            
            const listener = { 
                callback, 
                priority,
                id: this.generateId(),
                timestamp: Date.now()
            };
            
            this.events.get(event).push(listener);
            
            // Ordenar por prioridade (maior primeiro)
            this.events.get(event).sort((a, b) => b.priority - a.priority);
            
            if (this.debug) console.log(`📡 [${this.name}] Evento registrado: ${event} (prioridade: ${priority})`);
            
            // Retornar ID para poder remover depois
            return listener.id;
        }
        
        // Emitir evento
        emit(event, data = {}) {
            if (!this.events.has(event)) {
                if (this.debug) console.log(`📡 [${this.name}] Evento sem listeners: ${event}`);
                return [];
            }
            
            const listeners = this.events.get(event);
            const results = [];
            
            for (const listener of listeners) {
                try {
                    const result = listener.callback(data);
                    results.push(result);
                    
                    // Se callback retornar false, para a propagação
                    if (result === false) break;
                } catch (error) {
                    console.error(`❌ [${this.name}] Erro no evento ${event}:`, error);
                }
            }
            
            if (this.debug) console.log(`📡 [${this.name}] Evento emitido: ${event}`, data);
            
            return results;
        }
        
        // Remover evento por callback ou ID
        off(event, callbackOrId) {
            if (!this.events.has(event)) return false;
            
            const listeners = this.events.get(event);
            const initialLength = listeners.length;
            
            if (typeof callbackOrId === 'number') {
                // Remover por ID
                const index = listeners.findIndex(l => l.id === callbackOrId);
                if (index !== -1) {
                    listeners.splice(index, 1);
                    if (this.debug) console.log(`📡 [${this.name}] Evento removido por ID: ${event} (${callbackOrId})`);
                }
            } else {
                // Remover por callback
                const index = listeners.findIndex(l => l.callback === callbackOrId);
                if (index !== -1) {
                    listeners.splice(index, 1);
                    if (this.debug) console.log(`📡 [${this.name}] Evento removido: ${event}`);
                }
            }
            
            // Se não houver mais listeners, remover a entrada do Map
            if (listeners.length === 0) {
                this.events.delete(event);
            }
            
            return listeners.length !== initialLength;
        }
        
        // Evento único (executa uma vez)
        once(event, callback, priority = 0) {
            const wrapper = (data) => {
                const result = callback(data);
                this.off(event, wrapper);
                return result;
            };
            return this.on(event, wrapper, priority);
        }
        
        // ============================================
        // UTILITÁRIOS
        // ============================================
        
        // Verificar se evento tem listeners
        hasListeners(event) {
            return this.events.has(event) && this.events.get(event).length > 0;
        }
        
        // Contar listeners de um evento
        listenerCount(event) {
            return this.events.has(event) ? this.events.get(event).length : 0;
        }
        
        // Listar todos os eventos registrados
        listEvents() {
            const eventsList = [];
            for (const [event, listeners] of this.events) {
                eventsList.push({
                    event,
                    listeners: listeners.length
                });
            }
            return eventsList;
        }
        
        // Limpar todos os eventos
        clear(event = null) {
            if (event) {
                this.events.delete(event);
                if (this.debug) console.log(`📡 [${this.name}] Evento removido: ${event}`);
            } else {
                this.events.clear();
                if (this.debug) console.log(`📡 [${this.name}] Todos os eventos removidos`);
            }
        }
        
        // Gerar ID único
        generateId() {
            return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        // Ativar/desativar debug
        setDebug(enabled) {
            this.debug = enabled;
            console.log(`📡 [${this.name}] Debug mode: ${enabled ? 'ON' : 'OFF'}`);
        }
        
        // Obter informações do sistema
        getInfo() {
            return {
                name: this.name,
                debug: this.debug,
                totalEvents: this.events.size,
                totalListeners: Array.from(this.events.values()).reduce((acc, arr) => acc + arr.length, 0),
                events: this.listEvents()
            };
        }
    }
    
    // Singleton global
    const eventBus = new EventBus();
    
    // Exportar com nome Hécate (padrão)
    if (typeof window !== 'undefined') {
        window.HecateEvents = eventBus;
        // Compatibilidade com nome antigo (temporário)
        window.ObscuratilEvents = eventBus;
    }
    
    // Exportar para módulos (Node.js)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = eventBus;
    }
    
    console.log('🗝️ Hécate Event Bus carregado - Sistema de eventos ativo');
    
})();