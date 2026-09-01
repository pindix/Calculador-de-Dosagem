// ============================================================================
// MATCLÍNICA - SINAIS VITAIS
// SCRIPT PRINCIPAL - VERSÃO OTIMIZADA
// ============================================================================

console.log("Capacitor: ", window.Capacitor);
console.log("Plugins: ", window.Capacitor?.Plugins);
console.log("Filesystem: ", window.Capacitor?.Plugins?.Filesystem);

// ============================================================================
// SECÇÃO 1: TEMA E MENU LATERAL
// ============================================================================

const menuOverlay = document.getElementById('menuOverlay');
const menuLateral = document.getElementById('menuLateral');
const menuItems = document.querySelectorAll('.menu-item');

const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

themeBtn.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-theme');
        themeIcon.className = 'ri-moon-line';
        localStorage.setItem('tema', 'light');
        document.documentElement.style.backgroundColor = '#f0f2f0';
        document.body.style.backgroundColor = '#f0f2f0';
    } else {
        body.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'ri-sun-line';
        localStorage.setItem('tema', 'dark');
        document.documentElement.style.backgroundColor = '#000000';
        document.body.style.backgroundColor = '#000000';
    }
});

// Menu Hamburger
const btnHamburger = document.getElementById('btnHamburger');

if (btnHamburger && menuOverlay && menuLateral) {
    function abrirMenu() {
        btnHamburger.classList.add('ativo');
        menuOverlay.classList.add('ativo');
        menuLateral.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    }
    
    function fecharMenu() {
        btnHamburger.classList.remove('ativo');
        menuOverlay.classList.remove('ativo');
        menuLateral.classList.remove('ativo');
        document.body.style.overflow = '';
    }
    
    btnHamburger.addEventListener('click', () => {
        if (menuLateral.classList.contains('ativo')) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    });
    
    menuOverlay.addEventListener('click', fecharMenu);
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            setTimeout(fecharMenu, 200);
            const page = item.getAttribute('data-page');
            console.log(`Navegar para: ${page}`);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuLateral.classList.contains('ativo')) {
            fecharMenu();
        }
    });
    
    let touchStartXMenu = 0;
    menuLateral.addEventListener('touchstart', (e) => {
        touchStartXMenu = e.touches[0].clientX;
    }, { passive: true });
    
    menuLateral.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartXMenu - touchEndX;
        if (diff < -50) {
            fecharMenu();
        }
    });
}

// ============================================================================
// SECÇÃO 2: VARIÁVEIS GLOBAIS
// ============================================================================

// Gestão de Pacientes
let pacientes = JSON.parse(localStorage.getItem('pacientes_monitorados')) || {};
let pacienteAtivo = null;

// Cache de Gravidade
let cacheGravidade = new Map();

function limparCacheGravidade() {
    cacheGravidade = new Map();
}

// Seletores Principais
let fonteAtual = 'oms';
let faixaAtual = null;

// Temperatura - Local de Aferição
let localTempAtual = 'axilar';

// Gráfico
let historicoMedicoes = [];
let graficoAtual = null;

// Sidebar
let fonteSidebarAtual = 'oms';
let faixaSidebarAtual = null;

// ============================================================================
// SECÇÃO 3: BASE DE DADOS CLÍNICA (COMPLETA)
// ============================================================================

const DB_VITALS = {
    "OMS": {
        "recem_nascido_0_1m": {
            fc: {
                ref: [120, 160],
                categorias: [
                    { min: -Infinity, max: 99, termo: "Bradicardia grave" },
                    { min: 100, max: 119, termo: "Bradicardia" },
                    { min: 120, max: 160, termo: "Normocardia" },
                    { min: 161, max: 180, termo: "Taquicardia" },
                    { min: 181, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [40, 60],
                categorias: [
                    { min: -Infinity, max: 29, termo: "Bradipneia grave" },
                    { min: 30, max: 39, termo: "Bradipneia" },
                    { min: 40, max: 60, termo: "Eupneia" },
                    { min: 61, max: 70, termo: "Taquipneia" },
                    { min: 71, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [60, 75],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Hipotensão grave" },
                    { min: 50, max: 59, termo: "Hipotensão" },
                    { min: 60, max: 75, termo: "Normotensão" },
                    { min: 76, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [30, 45],
                categorias: [
                    { min: -Infinity, max: 24, termo: "Hipotensão grave" },
                    { min: 25, max: 29, termo: "Hipotensão" },
                    { min: 30, max: 45, termo: "Normotensão" },
                    { min: 46, max: 59, termo: "Pré-hipertensão" },
                    { min: 60, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        },
        "lactente_1_12m": {
            fc: {
                ref: [100, 150],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Bradicardia grave" },
                    { min: 90, max: 99, termo: "Bradicardia" },
                    { min: 100, max: 150, termo: "Normocardia" },
                    { min: 151, max: 170, termo: "Taquicardia" },
                    { min: 171, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [25, 40],
                categorias: [
                    { min: -Infinity, max: 19, termo: "Bradipneia grave" },
                    { min: 20, max: 24, termo: "Bradipneia" },
                    { min: 25, max: 40, termo: "Eupneia" },
                    { min: 41, max: 50, termo: "Taquipneia" },
                    { min: 51, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [70, 95],
                categorias: [
                    { min: -Infinity, max: 59, termo: "Hipotensão grave" },
                    { min: 60, max: 69, termo: "Hipotensão" },
                    { min: 70, max: 95, termo: "Normotensão" },
                    { min: 96, max: 109, termo: "Pré-hipertensão" },
                    { min: 110, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [45, 65],
                categorias: [
                    { min: -Infinity, max: 34, termo: "Hipotensão grave" },
                    { min: 35, max: 44, termo: "Hipotensão" },
                    { min: 45, max: 65, termo: "Normotensão" },
                    { min: 66, max: 79, termo: "Pré-hipertensão" },
                    { min: 80, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        },
        "crianca_1_3": {
            fc: {
                ref: [80, 130],
                categorias: [
                    { min: -Infinity, max: 69, termo: "Bradicardia grave" },
                    { min: 70, max: 79, termo: "Bradicardia" },
                    { min: 80, max: 130, termo: "Normocardia" },
                    { min: 131, max: 150, termo: "Taquicardia" },
                    { min: 151, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [20, 30],
                categorias: [
                    { min: -Infinity, max: 14, termo: "Bradipneia grave" },
                    { min: 15, max: 19, termo: "Bradipneia" },
                    { min: 20, max: 30, termo: "Eupneia" },
                    { min: 31, max: 40, termo: "Taquipneia" },
                    { min: 41, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [85, 105],
                categorias: [
                    { min: -Infinity, max: 74, termo: "Hipotensão grave" },
                    { min: 75, max: 84, termo: "Hipotensão" },
                    { min: 85, max: 105, termo: "Normotensão" },
                    { min: 106, max: 119, termo: "Pré-hipertensão" },
                    { min: 120, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [50, 70],
                categorias: [
                    { min: -Infinity, max: 39, termo: "Hipotensão grave" },
                    { min: 40, max: 49, termo: "Hipotensão" },
                    { min: 50, max: 70, termo: "Normotensão" },
                    { min: 71, max: 84, termo: "Pré-hipertensão" },
                    { min: 85, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        },
        "crianca_3_6": {
            fc: {
                ref: [80, 120],
                categorias: [
                    { min: -Infinity, max: 69, termo: "Bradicardia grave" },
                    { min: 70, max: 79, termo: "Bradicardia" },
                    { min: 80, max: 120, termo: "Normocardia" },
                    { min: 121, max: 140, termo: "Taquicardia" },
                    { min: 141, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [20, 25],
                categorias: [
                    { min: -Infinity, max: 14, termo: "Bradipneia grave" },
                    { min: 15, max: 19, termo: "Bradipneia" },
                    { min: 20, max: 25, termo: "Eupneia" },
                    { min: 26, max: 35, termo: "Taquipneia" },
                    { min: 36, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [90, 110],
                categorias: [
                    { min: -Infinity, max: 79, termo: "Hipotensão grave" },
                    { min: 80, max: 89, termo: "Hipotensão" },
                    { min: 90, max: 110, termo: "Normotensão" },
                    { min: 111, max: 124, termo: "Pré-hipertensão" },
                    { min: 125, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [55, 75],
                categorias: [
                    { min: -Infinity, max: 44, termo: "Hipotensão grave" },
                    { min: 45, max: 54, termo: "Hipotensão" },
                    { min: 55, max: 75, termo: "Normotensão" },
                    { min: 76, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        },
        "crianca_6_12": {
            fc: {
                ref: [70, 110],
                categorias: [
                    { min: -Infinity, max: 59, termo: "Bradicardia grave" },
                    { min: 60, max: 69, termo: "Bradicardia" },
                    { min: 70, max: 110, termo: "Normocardia" },
                    { min: 111, max: 130, termo: "Taquicardia" },
                    { min: 131, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [18, 25],
                categorias: [
                    { min: -Infinity, max: 12, termo: "Bradipneia grave" },
                    { min: 13, max: 17, termo: "Bradipneia" },
                    { min: 18, max: 25, termo: "Eupneia" },
                    { min: 26, max: 35, termo: "Taquipneia" },
                    { min: 36, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.2],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.2, termo: "Aprexia" },
                            { min: 37.3, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [35.5, 36.7],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.7, termo: "Aprexia" },
                            { min: 36.8, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.1, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.3, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [95, 115],
                categorias: [
                    { min: -Infinity, max: 84, termo: "Hipotensão grave" },
                    { min: 85, max: 94, termo: "Hipotensão" },
                    { min: 95, max: 115, termo: "Normotensão" },
                    { min: 116, max: 129, termo: "Pré-hipertensão" },
                    { min: 130, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [55, 75],
                categorias: [
                    { min: -Infinity, max: 44, termo: "Hipotensão grave" },
                    { min: 45, max: 54, termo: "Hipotensão" },
                    { min: 55, max: 75, termo: "Normotensão" },
                    { min: 76, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        },
        "adolescente_12_18": {
            fc: {
                ref: [60, 100],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Bradicardia grave" },
                    { min: 50, max: 59, termo: "Bradicardia" },
                    { min: 60, max: 100, termo: "Normocardia" },
                    { min: 101, max: 120, termo: "Taquicardia" },
                    { min: 121, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [12, 20],
                categorias: [
                    { min: -Infinity, max: 8, termo: "Bradipneia grave" },
                    { min: 9, max: 11, termo: "Bradipneia" },
                    { min: 12, max: 20, termo: "Eupneia" },
                    { min: 21, max: 28, termo: "Taquipneia" },
                    { min: 29, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.2],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.2, termo: "Aprexia" },
                            { min: 37.3, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [35.5, 36.7],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.7, termo: "Aprexia" },
                            { min: 36.8, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.1, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.3, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [100, 120],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipotensão grave" },
                    { min: 90, max: 99, termo: "Hipotensão" },
                    { min: 100, max: 120, termo: "Normotensão" },
                    { min: 121, max: 134, termo: "Pré-hipertensão" },
                    { min: 135, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [65, 80],
                categorias: [
                    { min: -Infinity, max: 54, termo: "Hipotensão grave" },
                    { min: 55, max: 64, termo: "Hipotensão" },
                    { min: 65, max: 80, termo: "Normotensão" },
                    { min: 81, max: 94, termo: "Pré-hipertensão" },
                    { min: 95, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        },
        "adulto": {
            fc: {
                ref: [60, 100],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Bradicardia grave" },
                    { min: 50, max: 59, termo: "Bradicardia" },
                    { min: 60, max: 100, termo: "Normocardia" },
                    { min: 101, max: 120, termo: "Taquicardia" },
                    { min: 121, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [12, 20],
                categorias: [
                    { min: -Infinity, max: 8, termo: "Bradipneia grave" },
                    { min: 9, max: 11, termo: "Bradipneia" },
                    { min: 12, max: 20, termo: "Eupneia" },
                    { min: 21, max: 28, termo: "Taquipneia" },
                    { min: 29, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.2],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.2, termo: "Aprexia" },
                            { min: 37.3, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [35.5, 36.7],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.7, termo: "Aprexia" },
                            { min: 36.8, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.1, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.3, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [90, 129],
                categorias: [
                    { min: -Infinity, max: 79, termo: "Hipotensão grave" },
                    { min: 80, max: 89, termo: "Hipotensão" },
                    { min: 90, max: 129, termo: "Normotensão" },
                    { min: 130, max: 139, termo: "Pré-hipertensão" },
                    { min: 140, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [60, 84],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Hipotensão grave" },
                    { min: 50, max: 59, termo: "Hipotensão" },
                    { min: 60, max: 84, termo: "Normotensão" },
                    { min: 85, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        },
        "idoso_60mais": {
            fc: {
                ref: [60, 90],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Bradicardia grave" },
                    { min: 50, max: 59, termo: "Bradicardia" },
                    { min: 60, max: 90, termo: "Normocardia" },
                    { min: 91, max: 110, termo: "Taquicardia" },
                    { min: 111, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "OMS"
            },
            fr: {
                ref: [16, 24],
                categorias: [
                    { min: -Infinity, max: 10, termo: "Bradipneia grave" },
                    { min: 11, max: 15, termo: "Bradipneia" },
                    { min: 16, max: 24, termo: "Eupneia" },
                    { min: 25, max: 30, termo: "Taquipneia" },
                    { min: 31, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "OMS"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    axilar: {
                        ref: [35.5, 36.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.5, termo: "Aprexia" },
                            { min: 36.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    timpanico: {
                        ref: [36.1, 37.1],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.1, termo: "Aprexia" },
                            { min: 37.2, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    },
                    retal: {
                        ref: [36.3, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "OMS"
                    }
                },
                fonte: "OMS"
            },
            sato2: {
                ref: [94, 99],
                categorias: [
                    { min: -Infinity, max: 88, termo: "Hipoxemia grave" },
                    { min: 89, max: 93, termo: "Hipoxemia" },
                    { min: 94, max: 99, termo: "Normoxemia" }
                ],
                fonte: "OMS"
            },
            sis: {
                ref: [90, 139],
                categorias: [
                    { min: -Infinity, max: 79, termo: "Hipotensão grave" },
                    { min: 80, max: 89, termo: "Hipotensão" },
                    { min: 90, max: 139, termo: "Normotensão" },
                    { min: 140, max: 149, termo: "Pré-hipertensão" },
                    { min: 150, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            },
            dia: {
                ref: [60, 89],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Hipotensão grave" },
                    { min: 50, max: 59, termo: "Hipotensão" },
                    { min: 60, max: 89, termo: "Normotensão" },
                    { min: 90, max: 94, termo: "Pré-hipertensão" },
                    { min: 95, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "OMS"
            }
        }
    },
    "Angola": {
        "recem_nascido_0_1m": {
            fc: {
                ref: [120, 160],
                categorias: [
                    { min: -Infinity, max: 99, termo: "Bradicardia grave" },
                    { min: 100, max: 119, termo: "Bradicardia" },
                    { min: 120, max: 160, termo: "Normocardia" },
                    { min: 161, max: 180, termo: "Taquicardia" },
                    { min: 181, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [40, 60],
                categorias: [
                    { min: -Infinity, max: 29, termo: "Bradipneia grave" },
                    { min: 30, max: 39, termo: "Bradipneia" },
                    { min: 40, max: 60, termo: "Eupneia" },
                    { min: 61, max: 70, termo: "Taquipneia" },
                    { min: 71, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [60, 75],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Hipotensão grave" },
                    { min: 50, max: 59, termo: "Hipotensão" },
                    { min: 60, max: 75, termo: "Normotensão" },
                    { min: 76, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [30, 45],
                categorias: [
                    { min: -Infinity, max: 24, termo: "Hipotensão grave" },
                    { min: 25, max: 29, termo: "Hipotensão" },
                    { min: 30, max: 45, termo: "Normotensão" },
                    { min: 46, max: 59, termo: "Pré-hipertensão" },
                    { min: 60, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        },
        "lactente_1_12m": {
            fc: {
                ref: [100, 150],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Bradicardia grave" },
                    { min: 90, max: 99, termo: "Bradicardia" },
                    { min: 100, max: 150, termo: "Normocardia" },
                    { min: 151, max: 170, termo: "Taquicardia" },
                    { min: 171, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [25, 40],
                categorias: [
                    { min: -Infinity, max: 19, termo: "Bradipneia grave" },
                    { min: 20, max: 24, termo: "Bradipneia" },
                    { min: 25, max: 40, termo: "Eupneia" },
                    { min: 41, max: 50, termo: "Taquipneia" },
                    { min: 51, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [70, 95],
                categorias: [
                    { min: -Infinity, max: 59, termo: "Hipotensão grave" },
                    { min: 60, max: 69, termo: "Hipotensão" },
                    { min: 70, max: 95, termo: "Normotensão" },
                    { min: 96, max: 109, termo: "Pré-hipertensão" },
                    { min: 110, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [45, 65],
                categorias: [
                    { min: -Infinity, max: 34, termo: "Hipotensão grave" },
                    { min: 35, max: 44, termo: "Hipotensão" },
                    { min: 45, max: 65, termo: "Normotensão" },
                    { min: 66, max: 79, termo: "Pré-hipertensão" },
                    { min: 80, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        },
        "crianca_1_3": {
            fc: {
                ref: [80, 130],
                categorias: [
                    { min: -Infinity, max: 69, termo: "Bradicardia grave" },
                    { min: 70, max: 79, termo: "Bradicardia" },
                    { min: 80, max: 130, termo: "Normocardia" },
                    { min: 131, max: 150, termo: "Taquicardia" },
                    { min: 151, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [20, 30],
                categorias: [
                    { min: -Infinity, max: 14, termo: "Bradipneia grave" },
                    { min: 15, max: 19, termo: "Bradipneia" },
                    { min: 20, max: 30, termo: "Eupneia" },
                    { min: 31, max: 40, termo: "Taquipneia" },
                    { min: 41, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [85, 105],
                categorias: [
                    { min: -Infinity, max: 74, termo: "Hipotensão grave" },
                    { min: 75, max: 84, termo: "Hipotensão" },
                    { min: 85, max: 105, termo: "Normotensão" },
                    { min: 106, max: 119, termo: "Pré-hipertensão" },
                    { min: 120, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [50, 70],
                categorias: [
                    { min: -Infinity, max: 39, termo: "Hipotensão grave" },
                    { min: 40, max: 49, termo: "Hipotensão" },
                    { min: 50, max: 70, termo: "Normotensão" },
                    { min: 71, max: 84, termo: "Pré-hipertensão" },
                    { min: 85, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        },
        "crianca_3_6": {
            fc: {
                ref: [80, 120],
                categorias: [
                    { min: -Infinity, max: 69, termo: "Bradicardia grave" },
                    { min: 70, max: 79, termo: "Bradicardia" },
                    { min: 80, max: 120, termo: "Normocardia" },
                    { min: 121, max: 140, termo: "Taquicardia" },
                    { min: 141, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [20, 25],
                categorias: [
                    { min: -Infinity, max: 14, termo: "Bradipneia grave" },
                    { min: 15, max: 19, termo: "Bradipneia" },
                    { min: 20, max: 25, termo: "Eupneia" },
                    { min: 26, max: 35, termo: "Taquipneia" },
                    { min: 36, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.5, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.4, termo: "Hipotermia" },
                            { min: 36.5, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.6, 37.6],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.5, termo: "Hipotermia" },
                            { min: 36.6, max: 37.6, termo: "Aprexia" },
                            { min: 37.7, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.8, 37.8],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.7, termo: "Hipotermia" },
                            { min: 36.8, max: 37.8, termo: "Aprexia" },
                            { min: 37.9, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [90, 110],
                categorias: [
                    { min: -Infinity, max: 79, termo: "Hipotensão grave" },
                    { min: 80, max: 89, termo: "Hipotensão" },
                    { min: 90, max: 110, termo: "Normotensão" },
                    { min: 111, max: 124, termo: "Pré-hipertensão" },
                    { min: 125, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [55, 75],
                categorias: [
                    { min: -Infinity, max: 44, termo: "Hipotensão grave" },
                    { min: 45, max: 54, termo: "Hipotensão" },
                    { min: 55, max: 75, termo: "Normotensão" },
                    { min: 76, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        },
        "crianca_6_12": {
            fc: {
                ref: [70, 110],
                categorias: [
                    { min: -Infinity, max: 59, termo: "Bradicardia grave" },
                    { min: 60, max: 69, termo: "Bradicardia" },
                    { min: 70, max: 110, termo: "Normocardia" },
                    { min: 111, max: 130, termo: "Taquicardia" },
                    { min: 131, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [18, 25],
                categorias: [
                    { min: -Infinity, max: 12, termo: "Bradipneia grave" },
                    { min: 13, max: 17, termo: "Bradipneia" },
                    { min: 18, max: 25, termo: "Eupneia" },
                    { min: 26, max: 35, termo: "Taquipneia" },
                    { min: 36, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.2],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.2, termo: "Aprexia" },
                            { min: 37.3, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [35.5, 36.7],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.7, termo: "Aprexia" },
                            { min: 36.8, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.1, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.3, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [95, 115],
                categorias: [
                    { min: -Infinity, max: 84, termo: "Hipotensão grave" },
                    { min: 85, max: 94, termo: "Hipotensão" },
                    { min: 95, max: 115, termo: "Normotensão" },
                    { min: 116, max: 129, termo: "Pré-hipertensão" },
                    { min: 130, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [55, 75],
                categorias: [
                    { min: -Infinity, max: 44, termo: "Hipotensão grave" },
                    { min: 45, max: 54, termo: "Hipotensão" },
                    { min: 55, max: 75, termo: "Normotensão" },
                    { min: 76, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        },
        "adolescente_12_18": {
            fc: {
                ref: [60, 100],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Bradicardia grave" },
                    { min: 50, max: 59, termo: "Bradicardia" },
                    { min: 60, max: 100, termo: "Normocardia" },
                    { min: 101, max: 120, termo: "Taquicardia" },
                    { min: 121, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [12, 20],
                categorias: [
                    { min: -Infinity, max: 8, termo: "Bradipneia grave" },
                    { min: 9, max: 11, termo: "Bradipneia" },
                    { min: 12, max: 20, termo: "Eupneia" },
                    { min: 21, max: 28, termo: "Taquipneia" },
                    { min: 29, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.2],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.2, termo: "Aprexia" },
                            { min: 37.3, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [35.5, 36.7],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.7, termo: "Aprexia" },
                            { min: 36.8, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.1, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.3, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [100, 120],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipotensão grave" },
                    { min: 90, max: 99, termo: "Hipotensão" },
                    { min: 100, max: 120, termo: "Normotensão" },
                    { min: 121, max: 134, termo: "Pré-hipertensão" },
                    { min: 135, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [65, 80],
                categorias: [
                    { min: -Infinity, max: 54, termo: "Hipotensão grave" },
                    { min: 55, max: 64, termo: "Hipotensão" },
                    { min: 65, max: 80, termo: "Normotensão" },
                    { min: 81, max: 94, termo: "Pré-hipertensão" },
                    { min: 95, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        },
        "adulto": {
            fc: {
                ref: [60, 100],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Bradicardia grave" },
                    { min: 50, max: 59, termo: "Bradicardia" },
                    { min: 60, max: 100, termo: "Normocardia" },
                    { min: 101, max: 120, termo: "Taquicardia" },
                    { min: 121, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [12, 20],
                categorias: [
                    { min: -Infinity, max: 8, termo: "Bradipneia grave" },
                    { min: 9, max: 11, termo: "Bradipneia" },
                    { min: 12, max: 20, termo: "Eupneia" },
                    { min: 21, max: 28, termo: "Taquipneia" },
                    { min: 29, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.2],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.2, termo: "Aprexia" },
                            { min: 37.3, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [35.5, 36.7],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.7, termo: "Aprexia" },
                            { min: 36.8, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.1, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.3, 37.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.5, termo: "Aprexia" },
                            { min: 37.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [95, 100],
                categorias: [
                    { min: -Infinity, max: 89, termo: "Hipoxemia grave" },
                    { min: 90, max: 94, termo: "Hipoxemia" },
                    { min: 95, max: 100, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [90, 129],
                categorias: [
                    { min: -Infinity, max: 79, termo: "Hipotensão grave" },
                    { min: 80, max: 89, termo: "Hipotensão" },
                    { min: 90, max: 129, termo: "Normotensão" },
                    { min: 130, max: 139, termo: "Pré-hipertensão" },
                    { min: 140, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [60, 84],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Hipotensão grave" },
                    { min: 50, max: 59, termo: "Hipotensão" },
                    { min: 60, max: 84, termo: "Normotensão" },
                    { min: 85, max: 89, termo: "Pré-hipertensão" },
                    { min: 90, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        },
        "idoso_60mais": {
            fc: {
                ref: [60, 90],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Bradicardia grave" },
                    { min: 50, max: 59, termo: "Bradicardia" },
                    { min: 60, max: 90, termo: "Normocardia" },
                    { min: 91, max: 110, termo: "Taquicardia" },
                    { min: 111, max: Infinity, termo: "Taquicardia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            fr: {
                ref: [16, 24],
                categorias: [
                    { min: -Infinity, max: 10, termo: "Bradipneia grave" },
                    { min: 11, max: 15, termo: "Bradipneia" },
                    { min: 16, max: 24, termo: "Eupneia" },
                    { min: 25, max: 30, termo: "Taquipneia" },
                    { min: 31, max: Infinity, termo: "Taquipneia grave" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            temp: {
                local: {
                    oral: {
                        ref: [36.0, 37.0],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.0, termo: "Aprexia" },
                            { min: 37.1, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    axilar: {
                        ref: [35.5, 36.5],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.4, termo: "Hipotermia" },
                            { min: 35.5, max: 36.5, termo: "Aprexia" },
                            { min: 36.6, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    timpanico: {
                        ref: [36.1, 37.1],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.0, termo: "Hipotermia" },
                            { min: 36.1, max: 37.1, termo: "Aprexia" },
                            { min: 37.2, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    },
                    retal: {
                        ref: [36.3, 37.3],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 36.2, termo: "Hipotermia" },
                            { min: 36.3, max: 37.3, termo: "Aprexia" },
                            { min: 37.4, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: "Ministério da Saúde de Angola"
                    }
                },
                fonte: "Ministério da Saúde de Angola"
            },
            sato2: {
                ref: [94, 99],
                categorias: [
                    { min: -Infinity, max: 88, termo: "Hipoxemia grave" },
                    { min: 89, max: 93, termo: "Hipoxemia" },
                    { min: 94, max: 99, termo: "Normoxemia" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            sis: {
                ref: [90, 139],
                categorias: [
                    { min: -Infinity, max: 79, termo: "Hipotensão grave" },
                    { min: 80, max: 89, termo: "Hipotensão" },
                    { min: 90, max: 139, termo: "Normotensão" },
                    { min: 140, max: 149, termo: "Pré-hipertensão" },
                    { min: 150, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            },
            dia: {
                ref: [60, 89],
                categorias: [
                    { min: -Infinity, max: 49, termo: "Hipotensão grave" },
                    { min: 50, max: 59, termo: "Hipotensão" },
                    { min: 60, max: 89, termo: "Normotensão" },
                    { min: 90, max: 94, termo: "Pré-hipertensão" },
                    { min: 95, max: Infinity, termo: "Hipertensão" }
                ],
                fonte: "Ministério da Saúde de Angola"
            }
        }
    }
};

// ============================================================================
// SECÇÃO 4: MASCARAS DE FAIXAS ETÁRIAS
// ============================================================================

const FAIXAS_POR_FONTE = {
    oms: [
        { value: 'recem_nascido_0_1m', label: '🍼 Recém-nascido (0-1 mês)' },
        { value: 'lactente_1_12m', label: '👶 Lactente (1-12 meses)' },
        { value: 'crianca_1_3', label: '🧒 Criança (1-3 anos)' },
        { value: 'crianca_3_6', label: '🧒 Criança (3-6 anos)' },
        { value: 'crianca_6_12', label: '🧒 Criança (6-12 anos)' },
        { value: 'adolescente_12_18', label: '👦 Adolescente (12-18 anos)' },
        { value: 'adulto', label: '👨 Adulto (18-60 anos)' },
        { value: 'idoso_60mais', label: '👴 Idoso (60+ anos)' }
    ],
    angola: [
        { value: 'recem_nascido_0_1m', label: '🍼 Recém-nascido (0-1 mês)' },
        { value: 'lactente_1_12m', label: '👶 Lactente (1-12 meses)' },
        { value: 'crianca_1_3', label: '🧒 Criança (1-3 anos)' },
        { value: 'crianca_3_6', label: '🧒 Criança (3-6 anos)' },
        { value: 'crianca_6_12', label: '🧒 Criança (6-12 anos)' },
        { value: 'adolescente_12_18', label: '👦 Adolescente (12-18 anos)' },
        { value: 'adulto', label: '👨 Adulto (18-60 anos)' },
        { value: 'idoso_60mais', label: '👴 Idoso (60+ anos)' }
    ]
};

const faixasMap = {
    "recem_nascido_0_1m": "Recém-nascido (0-1 mês)",
    "lactente_1_12m": "Lactente (1-12 meses)",
    "crianca_1_5": "Criança (1-5 anos)",
    "crianca_1_3": "Criança (1-3 anos)",
    "crianca_3_6": "Criança (3-6 anos)",
    "crianca_6_12": "Criança (6-12 anos)",
    "adolescente_12_18": "Adolescente (12-18 anos)",
    "adolescente_13_18": "Adolescente (13-18 anos)",
    "idoso_60mais": "Idoso (60 ou mais anos)",
    "idoso_65mais": "Idoso (65 ou mais anos)",
    "idoso": "Idoso (60+ anos)",
    "idoso_feminino": "Idoso Feminino (60+ anos)",
    "idoso_masculino": "Idoso Masculino (60+ anos)",
    "adulto": "Adulto (18-60 anos)",
    "adulto_feminino": "Adulto Feminino (18-60 anos)",
    "adulto_masculino": "Adulto Masculino (18-60 anos)"
};

const gravidadeMap = {
    'critico': { label: '🔴 Crítico', cor: '#ef4444' },
    'muito_urgente': { label: '🟠 Muito Urgente', cor: '#f97316' },
    'urgente': { label: '🟡 Urgente', cor: '#eab308' },
    'pouco_urgente': { label: '🟢 Pouco Urgente', cor: '#22c55e' },
    'nao_urgente': { label: '🔵 Não Urgente', cor: '#3b82f6' },
    'sem_dados': { label: '⚪ Sem dados', cor: '#9ca3af' }
};

// ============================================================================
// SECÇÃO 5: FUNÇÕES AUXILIARES
// ============================================================================

function obterTermoClinico(valor, categorias) {
    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) return null;
    for (const cat of categorias) {
        if (valor >= cat.min && valor <= cat.max) return cat.termo;
    }
    return null;
}

function obterTermoTemperatura(valor, faixaData, local) {
    if (typeof valor !== 'number' || isNaN(valor) || !faixaData || !faixaData.temp) return null;
    
    const localMap = { 'oral': 'oral', 'axilar': 'axilar', 'timpanico': 'timpanico', 'timpânico': 'timpanico', 'retal': 'retal' };
    const chaveLocal = localMap[local] || 'oral';
    const localData = faixaData.temp.local[chaveLocal];
    
    if (!localData || !localData.categorias) {
        const fallbackLocal = faixaData.temp.local.oral;
        if (fallbackLocal && fallbackLocal.categorias) {
            return obterTermoClinico(valor, fallbackLocal.categorias);
        }
        return null;
    }
    return obterTermoClinico(valor, localData.categorias);
}

function obterReferenciasPaciente(paciente) {
    if (!pacientes[paciente]) return null;
    const p = pacientes[paciente];
    const paisRef = p.info.pais || 'OMS';
    const faixaRef = p.info.faixa || 'adulto';
    if (!DB_VITALS[paisRef] || !DB_VITALS[paisRef][faixaRef]) return null;
    const faixaData = DB_VITALS[paisRef][faixaRef];
    return {
        fc: faixaData.fc.ref,
        fr: faixaData.fr.ref,
        temp: faixaData.temp.ref,
        sato2: faixaData.sato2.ref,
        sis: faixaData.sis.ref,
        dia: faixaData.dia.ref
    };
}

// ============================================================================
// SECÇÃO 6: SISTEMA DE GRAVIDADE (TRIAGEM)
// ============================================================================

function calcularGravidade(paciente) {
    if (!pacientes[paciente]) {
        return { nivel: 'nao_urgente', cor: 'blue', pontuacao: 0, temDados: false, label: '🔵 Não Urgente' };
    }
    
    if (!pacientes[paciente].historico || pacientes[paciente].historico.length === 0) {
        return { nivel: 'sem_dados', cor: 'gray', pontuacao: 0, temDados: false, label: '⚪ Sem dados' };
    }
    
    const historico = pacientes[paciente].historico;
    const ultima = historico[historico.length - 1];
    
    const fc = parseFloat(ultima.fc);
    const pas = parseFloat(ultima.sis);
    const spo2 = parseFloat(ultima.sato2);
    const temp = parseFloat(ultima.temp);
    const fr = parseFloat(ultima.fr);
    
    const temDados = !isNaN(fc) || !isNaN(pas) || !isNaN(spo2) || !isNaN(temp) || !isNaN(fr);
    if (!temDados) {
        return { nivel: 'sem_dados', cor: 'gray', pontuacao: 0, temDados: false, label: '⚪ Sem dados' };
    }
    
    const refs = obterReferenciasPaciente(paciente);
    let pontuacao = 0;
    let nivel = 'nao_urgente';
    let cor = 'blue';
    let label = '🔵 Não Urgente';
    let razoes = [];
    
    // CRÍTICOS
    if (!isNaN(fc) && !isNaN(pas) && pas > 0) {
        const relacao = fc / pas;
        if (relacao > 1.4) { nivel = 'critico';
            cor = 'red';
            pontuacao = 5;
            razoes.push(`FC/PAS = ${relacao.toFixed(2)} > 1.4`); }
    }
    if (!isNaN(spo2) && spo2 < 85) { nivel = 'critico';
        cor = 'red';
        pontuacao = 5;
        razoes.push(`SpO2 = ${spo2}% < 85%`); }
    if (!isNaN(fc) && (fc < 30 || fc > 200)) { nivel = 'critico';
        cor = 'red';
        pontuacao = 5;
        razoes.push(`FC = ${fc} bpm (extremo)`); }
    if (!isNaN(pas) && (pas < 60 || pas > 200)) { nivel = 'critico';
        cor = 'red';
        pontuacao = 5;
        razoes.push(`PAS = ${pas} mmHg (extremo)`); }
    if (!isNaN(temp) && (temp < 33 || temp > 41)) { nivel = 'critico';
        cor = 'red';
        pontuacao = 5;
        razoes.push(`Temp = ${temp}°C (extremo)`); }
    if (!isNaN(fr) && (fr < 5 || fr > 40)) { nivel = 'critico';
        cor = 'red';
        pontuacao = 5;
        razoes.push(`FR = ${fr} ipm (extremo)`); }
    
    // MUITO URGENTE
    if (nivel === 'nao_urgente' || nivel === 'pouco_urgente') {
        let isLaranja = false;
        if (!isNaN(fc) && !isNaN(pas) && pas > 0) {
            const relacao = fc / pas;
            if (relacao > 1.0) { isLaranja = true;
                razoes.push(`FC/PAS = ${relacao.toFixed(2)} > 1.0`); }
        }
        if (!isNaN(spo2) && spo2 < 90) { isLaranja = true;
            razoes.push(`SpO2 = ${spo2}% < 90%`); }
        if (!isNaN(fc) && ((fc < 50 && fc >= 30) || fc > 150)) { isLaranja = true;
            razoes.push(`FC = ${fc} bpm (significativo)`); }
        if (!isNaN(pas) && ((pas < 80 && pas >= 60) || pas > 180)) { isLaranja = true;
            razoes.push(`PAS = ${pas} mmHg (significativo)`); }
        if (!isNaN(temp) && temp > 39.5) { isLaranja = true;
            razoes.push(`Temp = ${temp}°C > 39.5°C`); }
        if (!isNaN(fr) && (fr < 8 || fr > 35)) { isLaranja = true;
            razoes.push(`FR = ${fr} ipm (significativo)`); }
        if (isLaranja) { nivel = 'muito_urgente';
            cor = 'orange';
            pontuacao = 4; }
    }
    
    // URGENTE
    if (nivel === 'nao_urgente' || nivel === 'pouco_urgente') {
        let isAmarelo = false;
        if (refs) {
            if (!isNaN(fc) && refs.fc) {
                const [refMin, refMax] = refs.fc;
                const centro = (refMin + refMax) / 2;
                const desvioPercentual = Math.abs(fc - centro) / centro;
                if (desvioPercentual > 0.40) { isAmarelo = true;
                    razoes.push(`FC = ${fc} bpm (desvio ${(desvioPercentual * 100).toFixed(0)}% da referência)`); }
            }
            if (!isNaN(temp)) {
                const limiteTemp = (refs.temp && refs.temp[1] < 37.5) ? 38.0 : 38.5;
                if (temp > limiteTemp && temp <= 39.5) { isAmarelo = true;
                    razoes.push(`Temp = ${temp}°C > ${limiteTemp}°C`); }
            }
            if (!isNaN(fr) && refs.fr) {
                const [refMin, refMax] = refs.fr;
                const centro = (refMin + refMax) / 2;
                const desvioPercentual = Math.abs(fr - centro) / centro;
                if (desvioPercentual > 0.40) { isAmarelo = true;
                    razoes.push(`FR = ${fr} ipm (desvio ${(desvioPercentual * 100).toFixed(0)}% da referência)`); }
            }
            if (!isNaN(pas) && refs.sis) {
                const [refMin, refMax] = refs.sis;
                if (pas > refMax * 1.15 || pas < refMin * 0.85) { isAmarelo = true;
                    razoes.push(`PAS = ${pas} mmHg (desvio significativo)`); }
            }
        }
        if (isAmarelo) { nivel = 'urgente';
            cor = 'yellow';
            pontuacao = 3; }
    }
    
    // POUCO URGENTE
    if (nivel === 'nao_urgente' && refs) {
        let temDesvioPequeno = false;
        if (!isNaN(fc) && refs.fc) {
            const [refMin, refMax] = refs.fc;
            const centro = (refMin + refMax) / 2;
            const desvioPercentual = Math.abs(fc - centro) / centro;
            if (desvioPercentual >= 0.20 && desvioPercentual <= 0.40) { temDesvioPequeno = true; }
        }
        if (!isNaN(fr) && refs.fr && !temDesvioPequeno) {
            const [refMin, refMax] = refs.fr;
            const centro = (refMin + refMax) / 2;
            const desvioPercentual = Math.abs(fr - centro) / centro;
            if (desvioPercentual >= 0.20 && desvioPercentual <= 0.40) { temDesvioPequeno = true; }
        }
        if (temDesvioPequeno) { nivel = 'pouco_urgente';
            cor = 'green';
            pontuacao = 2; }
    }
    
    const labels = {
        'critico': '🔴 Crítico',
        'muito_urgente': '🟠 Muito Urgente',
        'urgente': '🟡 Urgente',
        'pouco_urgente': '🟢 Pouco Urgente',
        'nao_urgente': '🔵 Não Urgente',
        'sem_dados': '⚪ Sem dados'
    };
    label = labels[nivel] || '🔵 Não Urgente';
    
    return { nivel, cor, pontuacao, temDados: true, label, razoes: razoes.slice(0, 3) };
}

function atualizarInterfaceGravidade(paciente, elementoCard) {
    if (!elementoCard) return;
    let gravidade;
    if (cacheGravidade.has(paciente)) {
        gravidade = cacheGravidade.get(paciente);
    } else {
        gravidade = calcularGravidade(paciente);
        cacheGravidade.set(paciente, gravidade);
    }
    
    const bolha = elementoCard.querySelector('.bolha-gravidade');
    if (!bolha) return;
    
    const cores = {
        'critico': '#ef4444',
        'muito_urgente': '#f97316',
        'urgente': '#eab308',
        'pouco_urgente': '#22c55e',
        'nao_urgente': '#3b82f6',
        'sem_dados': '#9ca3af'
    };
    
    bolha.style.backgroundColor = cores[gravidade.nivel] || '#3b82f6';
    bolha.className = `bolha-gravidade ${gravidade.nivel}`;
    
    if (gravidade.temDados && gravidade.razoes && gravidade.razoes.length > 0) {
        bolha.title = `${gravidade.label} - ${gravidade.razoes.join(', ')}`;
    } else if (gravidade.temDados) {
        bolha.title = gravidade.label;
    } else {
        bolha.title = 'Sem medições - Adicione dados para triagem';
    }
    
    const gravidadeText = elementoCard.querySelector('.perfil-gravidade');
    if (gravidadeText) {
        gravidadeText.textContent = gravidade.label;
        gravidadeText.className = `perfil-gravidade ${gravidade.nivel}`;
    }
}

function ordenarListaPorTriagem() {
    const lista = document.getElementById('lista-pacientes');
    if (!lista) return;
    const itens = Array.from(lista.querySelectorAll('.perfil-item'));
    if (itens.length === 0) return;
    
    const ordem = {
        'critico': 0,
        'muito_urgente': 1,
        'urgente': 2,
        'pouco_urgente': 3,
        'nao_urgente': 4,
        'sem_dados': 5
    };
    
    itens.forEach(item => {
        const nome = item.getAttribute('data-nome');
        if (nome && !cacheGravidade.has(nome)) {
            cacheGravidade.set(nome, calcularGravidade(nome));
        }
    });
    
    itens.sort((a, b) => {
        const nomeA = a.getAttribute('data-nome');
        const nomeB = b.getAttribute('data-nome');
        const gravA = cacheGravidade.get(nomeA) || { nivel: 'nao_urgente' };
        const gravB = cacheGravidade.get(nomeB) || { nivel: 'nao_urgente' };
        return ordem[gravA.nivel] - ordem[gravB.nivel];
    });
    
    itens.forEach(item => lista.appendChild(item));
    itens.forEach(item => {
        const nome = item.getAttribute('data-nome');
        if (nome && pacientes[nome]) {
            atualizarInterfaceGravidade(nome, item);
        }
    });
}

// ============================================================================
// SECÇÃO 7: SISTEMA DE ALERTAS CRUZADOS (UNIFICADO)
// ============================================================================

function gerarAlertas(fc, pas, spo2, temp, fr) {
    console.log(`🔍 Gerando alertas para: FC=${fc}, PAS=${pas}, SpO2=${spo2}, Temp=${temp}, FR=${fr}`);
    
    const alertas = [];
    const temDados = !isNaN(fc) || !isNaN(pas) || !isNaN(spo2) || !isNaN(temp) || !isNaN(fr);
    if (!temDados) return [];
    
    if (!isNaN(temp) && !isNaN(fc) && temp > 38 && fc < 90) {
        alertas.push({ tipo: 'dissociacao', gravidade: 'alto', icone: 'ri-alert-line', mensagem: 'Dissociação Pulso-Temperatura. Verificar.', detalhe: `Temp ${temp}°C com FC ${fc} bpm (esperado taquicardia)` });
    }
    if (!isNaN(fc) && !isNaN(pas) && pas > 0) {
        const relacao = fc / pas;
        if (relacao > 1.0) {
            alertas.push({ tipo: 'choque', gravidade: 'critico', icone: 'ri-heart-pulse-line', mensagem: 'Risco de Choque.', detalhe: `Relação FC/PAS = ${relacao.toFixed(2)} (normal < 1.0)` });
        }
    }
    if (!isNaN(spo2) && !isNaN(fr) && spo2 < 90 && fr > 30) {
        alertas.push({ tipo: 'desconforto_respiratorio', gravidade: 'critico', icone: 'ri-lungs-line', mensagem: 'Desconforto Respiratório Grave.', detalhe: `SpO2 ${spo2}% com FR ${fr} ipm` });
    }
    if (!isNaN(fc) && !isNaN(pas) && fc < 60 && pas < 90) {
        alertas.push({ tipo: 'bradicardia_hipotensao', gravidade: 'alto', icone: 'ri-arrow-down-circle-line', mensagem: 'Bradicardia com Hipotensão. Avaliar perfusão.', detalhe: `FC ${fc} bpm com PAS ${pas} mmHg` });
    }
    if (!isNaN(fc) && !isNaN(temp) && fc > 100 && temp > 38) {
        alertas.push({ tipo: 'taquicardia_febre', gravidade: 'medio', icone: 'ri-temp-hot-line', mensagem: 'Taquicardia com Febre. Possível infeção sistémica.', detalhe: `FC ${fc} bpm com Temp ${temp}°C` });
    }
    if (!isNaN(spo2) && spo2 < 92 && spo2 >= 90) {
        alertas.push({ tipo: 'hipoxemia_leve', gravidade: 'medio', icone: 'ri-drop-line', mensagem: 'Hipoxemia ligeira. Monitorizar SpO2.', detalhe: `SpO2 ${spo2}% (limiar 92%)` });
    }
    
    console.log(`📊 Total de alertas: ${alertas.length}`);
    return alertas;
}

function renderizarCardResultados() {
    const container = document.getElementById('card-resultados-principal');
    if (!container) { console.warn('❌ Container não encontrado'); return; }
    
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    // ===== OBTÉM VALORES DOS CAMPOS =====
    const fcVal = parseFloat(document.getElementById('fc')?.value);
    const frVal = parseFloat(document.getElementById('fr')?.value);
    const tempVal = parseFloat(document.getElementById('temp')?.value);
    const spo2Val = parseFloat(document.getElementById('sato2')?.value);
    const pasVal = parseFloat(document.getElementById('sis')?.value);
    
    const temValoresInseridos = !isNaN(fcVal) || !isNaN(frVal) || !isNaN(tempVal) || !isNaN(spo2Val) || !isNaN(pasVal);
    
    let alertas = [];
    let fonte = '';
    let modo = '';

    // ============================================================
    // PRIORIDADE 1: VALORES INSERIDOS NO MOMENTO (MODO NORMAL E MONITORIZAÇÃO)
    // ============================================================
    if (temValoresInseridos) {
        alertas = gerarAlertas(fcVal, pasVal, spo2Val, tempVal, frVal);
        fonte = 'medição atual';
        modo = 'valores inseridos';
        console.log(`📊 Alertas da medição atual:`, alertas);
    }
    // ============================================================
    // PRIORIDADE 2: MODO MONITORIZAÇÃO (PACIENTE SELECIONADO SEM VALORES INSERIDOS)
    // ============================================================
    else if (pacienteAtivo && pacientes[pacienteAtivo]) {
        const historico = pacientes[pacienteAtivo].historico;
        if (historico && historico.length > 0) {
            const ultima = historico[historico.length - 1];
            const fc = parseFloat(ultima.fc);
            const pas = parseFloat(ultima.sis);
            const spo2 = parseFloat(ultima.sato2);
            const temp = parseFloat(ultima.temp);
            const fr = parseFloat(ultima.fr);
            alertas = gerarAlertas(fc, pas, spo2, temp, fr);
            fonte = `última medição de ${pacienteAtivo}`;
            modo = 'paciente monitorizado';
            console.log(`📊 Alertas da última medição de ${pacienteAtivo}:`, alertas);
        } else {
            // Paciente sem histórico
            alertas = [];
            fonte = 'paciente sem medições';
            modo = 'paciente sem histórico';
            console.log(`ℹ️ Paciente ${pacienteAtivo} sem histórico`);
        }
    }
    // ============================================================
    // PRIORIDADE 3: MODO NORMAL (SEM PACIENTE E SEM VALORES)
    // ============================================================
    else {
        alertas = [];
        fonte = 'modo normal - sem dados';
        modo = 'sem dados';
        console.log(`ℹ️ Modo normal - sem dados`);
    }

    // ============================================================
    // CONSTRÓI O HTML DO CARD
    // ============================================================
    let html = '';
    
    if (alertas.length === 0) {
        // ===== SEM ALERTAS =====
        let titulo = 'Alertas Cruzados';
        let descricao = 'Todos os sinais vitais estão em harmonia.';
        
        if (temValoresInseridos) {
            titulo = 'Alertas Cruzados (medição atual)';
        } else if (pacienteAtivo) {
            if (fonte === 'paciente sem medições') {
                titulo = `Alertas Cruzados - ${pacienteAtivo}`;
                descricao = 'Sem medições registadas. Adicione uma medição para verificar alertas.';
            } else {
                titulo = `Alertas Cruzados - ${pacienteAtivo}`;
                descricao = 'Última medição sem alertas. Todos os sinais estão em harmonia.';
            }
        } else {
            titulo = 'Alertas Cruzados';
            descricao = 'Insira valores ou selecione um paciente para verificar alertas cruzados.';
        }
        
        html = `
            <div class="card-resultados-container card-resultados-vazio">
                <div class="card-resultados-header">
                    <div class="card-resultados-titulo">
                        <i class="ri-checkbox-circle-fill" style="color: #22c55e;"></i>
                        <span>${titulo}</span>
                    </div>
                    <span class="card-resultados-badge" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">0 alertas</span>
                </div>
                <div class="card-resultados-vazio-conteudo">
                    <i class="ri-check-double-line" style="color: #22c55e;"></i>
                    <div class="card-resultados-vazio-texto">
                        <span class="card-resultados-vazio-titulo">Nenhum alerta cruzado</span>
                        <span class="card-resultados-vazio-desc">${descricao}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        // ===== COM ALERTAS =====
        let titulo = 'Alertas Cruzados';
        let subtitulo = '';
        
        if (temValoresInseridos) {
            titulo = 'Alertas Cruzados (medição atual)';
        } else if (pacienteAtivo) {
            titulo = `Alertas Cruzados - ${pacienteAtivo}`;
            subtitulo = 'Teve um alerta na última medição';
        }
        
        html = `
            <div class="card-resultados-container">
                <div class="card-resultados-header">
                    <div class="card-resultados-titulo">
                        <i class="ri-alert-fill" style="color: #f59e0b;"></i>
                        <span>${titulo}</span>
                    </div>
                    <span class="card-resultados-badge">${alertas.length} alerta${alertas.length > 1 ? 's' : ''}</span>
                </div>
                ${subtitulo ? `<div style="font-size: 0.65rem; color: #f59e0b; margin-bottom: 8px; padding: 4px 10px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; display: inline-block;">${subtitulo}</div>` : ''}
                <ul class="card-resultados-lista">
        `;
        
        alertas.forEach(alerta => {
            const cores = { 'critico': '#ef4444', 'alto': '#f59e0b', 'medio': '#3b82f6' };
            const cor = cores[alerta.gravidade] || '#6b7280';
            const icone = alerta.gravidade === 'critico' ? '🔴' : alerta.gravidade === 'alto' ? '🟠' : '🟡';
            html += `
                <li class="card-resultados-item ${alerta.gravidade}">
                    <div class="card-resultados-icon" style="background: ${cor}20; color: ${cor};">
                        <i class="${alerta.icone}"></i>
                    </div>
                    <div class="card-resultados-conteudo">
                        <div class="card-resultados-mensagem">${alerta.mensagem}</div>
                        <div class="card-resultados-detalhe">${alerta.detalhe}</div>
                    </div>
                    <div class="card-resultados-gravidade ${alerta.gravidade}">
                        ${icone}
                    </div>
                </li>
            `;
        });
        html += `</ul></div>`;
    }
    
    container.innerHTML = html;
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    console.log('✅ Card de resultados renderizado');
}
// ============================================================================
// SECÇÃO 8: GESTÃO DE PACIENTES (SIDEBAR)
// ============================================================================

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

function fecharSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
}

function toggleCadastro() {
    const fields = document.getElementById('cadastroFields');
    const icon = document.getElementById('toggleIcon');
    if (!fields || !icon) return;
    fields.classList.toggle('aberto');
    icon.classList.toggle('rotated');
}

function atualizarContador() {
    const contador = document.getElementById('contadorPacientes');
    if (contador) {
        contador.textContent = Object.keys(pacientes).length;
    }
}

function cadastrarPaciente() {
    const nome = document.getElementById('p-nome').value.trim();
    const fonte = fonteSidebarAtual;
    const faixa = faixaSidebarAtual;
    
    if (!nome) { alert("Informe o nome do paciente."); return; }
    if (!faixa) { alert("Selecione uma faixa etária."); return; }
    if (pacientes[nome]) { alert("Já existe um paciente com este nome!"); return; }
    
    const nomeFonte = fonte === 'oms' ? 'OMS' : 'Angola';
    pacientes[nome] = { info: { pais: nomeFonte, faixa: faixa }, historico: [] };
    localStorage.setItem('pacientes_monitorados', JSON.stringify(pacientes));
    limparCacheGravidade();
    renderListaNomes();
    document.getElementById('p-nome').value = '';
    
    const fields = document.getElementById('cadastroFields');
    const icon = document.getElementById('toggleIcon');
    if (fields) fields.classList.remove('aberto');
    if (icon) icon.classList.remove('rotated');
}

function removerPerfil(nome) {
    if (confirm(`Deseja remover o perfil de ${nome} e todo o seu histórico?`)) {
        if (pacienteAtivo === nome) ativarModoPadrao();
        delete pacientes[nome];
        localStorage.setItem('pacientes_monitorados', JSON.stringify(pacientes));
        limparCacheGravidade();
        renderListaNomes();
    }
}

function renderListaNomes() {
    const lista = document.getElementById('lista-pacientes');
    if (!lista) return;
    
    Object.keys(pacientes).forEach(nome => {
        cacheGravidade.set(nome, calcularGravidade(nome));
    });
    
    lista.innerHTML = Object.keys(pacientes).reverse().map(nome => {
        const paciente = pacientes[nome];
        const faixaFormatada = faixasMap[paciente.info.faixa] || paciente.info.faixa;
        const gravidade = cacheGravidade.get(nome) || { nivel: 'nao_urgente', temDados: false };
        const infoGravidade = gravidadeMap[gravidade.nivel] || gravidadeMap['nao_urgente'];
        
        return `
        <div class="perfil-item" data-nome="${nome}">
            <div class="perfil-info" onclick="selecionarPaciente('${nome.replace(/'/g, "\\'")}')">
                <div class="perfil-header">
                    <span class="bolha-gravidade ${gravidade.nivel}" style="background-color: ${infoGravidade.cor};" title="${gravidade.temDados ? infoGravidade.label + ' - Pontuação: ' + gravidade.pontuacao : 'Sem medições - Adicione dados para triagem'}"></span>
                    <strong>${nome}</strong>
                </div>
                <div class="perfil-detalhes">
                    <span class="perfil-faixa">${faixaFormatada}</span>
                    <span class="perfil-separador">•</span>
                    <span class="perfil-fonte">${paciente.info.pais}</span>
                    <span class="perfil-separador">•</span>
                    <span class="perfil-gravidade ${gravidade.nivel}">${gravidade.temDados ? infoGravidade.label : '⚪ Sem dados'}</span>
                </div>
            </div>
            <button class="btn-remover-perfil" onclick="removerPerfil('${nome.replace(/'/g, "\\'")}')">
                <i class="ri-delete-bin-7-line"></i>
            </button>
        </div>
    `;
    }).join('');
    
    if (pacienteAtivo) {
        document.querySelectorAll('#lista-pacientes .perfil-item').forEach(el => {
            const nomeItem = el.getAttribute('data-nome');
            if (nomeItem === pacienteAtivo) {
                el.classList.add('selecionado');
            } else {
                el.classList.remove('selecionado');
            }
        });
        renderizarCardResultados();
    } else {
        document.querySelectorAll('#lista-pacientes .perfil-item').forEach(el => {
            el.classList.remove('selecionado');
        });
    }
    atualizarContador();
}

function selecionarPaciente(nome) {
    pacienteAtivo = nome;
    const p = pacientes[nome];
    
    document.getElementById('controles-padrao').style.display = 'none';
    document.getElementById('tag-paciente').style.display = 'flex';
    document.getElementById('btn-exportar').style.display = 'flex';
    document.getElementById('nome-exibicao').innerText = "Monitorizando: " + nome;
    document.getElementById('detalhes-exibicao').innerText = `${faixasMap[p.info.faixa] || p.info.faixa} • ${p.info.pais}`;
    
    document.querySelectorAll('#lista-pacientes .perfil-item').forEach(el => {
        el.classList.remove('selecionado');
        if (el.getAttribute('data-nome') === nome) el.classList.add('selecionado');
    });
    
    carregarGraficoPaciente();
    renderizarCardResultados();
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        if (overlay) overlay.style.display = 'none';
    }
}

function ativarModoPadrao() {
    pacienteAtivo = null;
    document.getElementById('controles-padrao').style.display = 'grid';
    document.getElementById('tag-paciente').style.display = 'none';
    document.getElementById('btn-exportar').style.display = 'none';
    
    document.querySelectorAll('#lista-pacientes .perfil-item').forEach(el => {
        el.classList.remove('selecionado');
    });
    
    ["sis", "dia", "fc", "fr", "temp", "sato2"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("resultado").style.display = "none";
    document.getElementById("caixa_ta").classList.remove("campo-incompleto");
    
    historicoMedicoes = [];
    if (graficoAtual) { graficoAtual.destroy();
        graficoAtual = null; }
    fecharSidebar();
    atualizarGrafico();
    renderizarCardResultados();
    
}

function filtrarPacientes() {
    const termo = document.getElementById('buscarPaciente').value.toLowerCase().trim();
    const container = document.getElementById('lista-pacientes');
    const msgExistente = document.getElementById('semResultados');
    if (msgExistente) msgExistente.remove();
    
    // ===== FUNÇÃO PARA REMOVER ACENTOS =====
    function removerAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    
    const termoSemAcentos = removerAcentos(termo);
    
    const nomes = Object.keys(pacientes).reverse();
    const filtrados = nomes.filter(nome => {
        const nomeSemAcentos = removerAcentos(nome.toLowerCase());
        return termo === '' || nomeSemAcentos.includes(termoSemAcentos);
    });
    
    if (termo !== '' && filtrados.length === 0) {
        container.innerHTML = `<div id="semResultados" style="padding: 30px 20px; text-align: center; color: var(--text); opacity: 0.5;">
            <i class="ri-search-2-line" style="font-size: 2rem; display: block; margin-bottom: 8px; opacity: 0.4;"></i>
            <span style="font-size: 0.85rem;">Nenhum paciente encontrado na pesquisa</span>
        </div>`;
        return;
    }
    
    container.innerHTML = filtrados.map(nome => {
        const paciente = pacientes[nome];
        const faixaFormatada = faixasMap[paciente.info.faixa] || paciente.info.faixa;
        const gravidade = calcularGravidade(nome);
        const infoGravidade = gravidadeMap[gravidade.nivel] || gravidadeMap['nao_urgente'];
        return `
        <div class="perfil-item" data-nome="${nome}">
            <div class="perfil-info" onclick="selecionarPaciente('${nome.replace(/'/g, "\\'")}')">
                <div class="perfil-header">
                    <span class="bolha-gravidade ${gravidade.nivel}" style="background-color: ${infoGravidade.cor};" title="${gravidade.temDados ? infoGravidade.label + ' - Pontuação: ' + gravidade.pontuacao : 'Sem medições - Adicione dados para triagem'}"></span>
                    <strong>${nome}</strong>
                </div>
                <div class="perfil-detalhes">
                    <span class="perfil-faixa">${faixaFormatada}</span>
                    <span class="perfil-separador">•</span>
                    <span class="perfil-fonte">${paciente.info.pais}</span>
                    <span class="perfil-separador">•</span>
                    <span class="perfil-gravidade ${gravidade.nivel}">${gravidade.temDados ? infoGravidade.label : '⚪ Sem dados'}</span>
                </div>
            </div>
            <button class="btn-remover-perfil" onclick="removerPerfil('${nome.replace(/'/g, "\\'")}')">
                <i class="ri-delete-bin-7-line"></i>
            </button>
        </div>
    `;
    }).join('');
    
    document.querySelectorAll('#lista-pacientes .perfil-item').forEach(item => {
        const nome = item.getAttribute('data-nome');
        if (nome && pacientes[nome]) {
            atualizarInterfaceGravidade(nome, item);
        }
    });
    
    if (pacienteAtivo) {
        document.querySelectorAll('#lista-pacientes .perfil-item').forEach(el => {
            if (el.getAttribute('data-nome') === pacienteAtivo) el.classList.add('selecionado');
        });
    }
    atualizarContador();
}

function abrirSidebarPacientes() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLateral = document.getElementById('menuLateral');
    if (menuOverlay && menuOverlay.classList.contains('ativo')) {
        menuOverlay.classList.remove('ativo');
        if (menuLateral) menuLateral.classList.remove('ativo');
        document.body.style.overflow = '';
    }
    
    sidebar.classList.toggle('active');
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    }
}

// ============================================================================
// SECÇÃO 9: SELECTS PERSONALIZADOS
// ============================================================================

function toggleFonteSelect() {
    const options = document.getElementById('fonteOptions');
    const trigger = document.querySelector('#fonteSelect .custom-select-trigger');
    if (!options || !trigger) return;
    document.getElementById('faixaOptions')?.classList.remove('aberto');
    document.querySelector('#faixaSelect .custom-select-trigger')?.classList.remove('aberto');
    options.classList.toggle('aberto');
    trigger.classList.toggle('aberto');
}

function toggleFaixaSelect() {
    const options = document.getElementById('faixaOptions');
    const trigger = document.querySelector('#faixaSelect .custom-select-trigger');
    if (!options || !trigger) return;
    document.getElementById('fonteOptions')?.classList.remove('aberto');
    document.querySelector('#fonteSelect .custom-select-trigger')?.classList.remove('aberto');
    options.classList.toggle('aberto');
    trigger.classList.toggle('aberto');
}

function selecionarFonte(valor) {
    if (fonteAtual === valor) return;
    fonteAtual = valor;
    
    const fonteSelecionada = document.getElementById('fonteSelecionada');
    document.querySelectorAll('#fonteOptions .custom-select-option').forEach(opt => {
        opt.classList.remove('selecionado');
        if (opt.dataset.value === valor) {
            opt.classList.add('selecionado');
            const titulo = opt.querySelector('.option-titulo')?.textContent || valor;
            const icone = opt.querySelector('i')?.className || '';
            fonteSelecionada.innerHTML = `<i class="${icone}"></i> ${titulo}`;
        }
    });
    
    document.getElementById('fonteOptions')?.classList.remove('aberto');
    document.querySelector('#fonteSelect .custom-select-trigger')?.classList.remove('aberto');
    atualizarFaixasEtarias();
    if (!pacienteAtivo) { resetarGrafico();
        document.getElementById("resultado").style.display = "none"; }
}

function selecionarFaixa(valor) {
    if (faixaAtual === valor && document.getElementById('faixaOptions')?.classList.contains('aberto')) {
        document.getElementById('faixaOptions')?.classList.remove('aberto');
        document.querySelector('#faixaSelect .custom-select-trigger')?.classList.remove('aberto');
        return;
    }
    faixaAtual = valor;
    
    const faixaSelecionada = document.getElementById('faixaSelecionada');
    document.querySelectorAll('#faixaOptions .custom-select-option').forEach(opt => {
        opt.classList.remove('selecionado');
        if (opt.dataset.value === valor) {
            opt.classList.add('selecionado');
            faixaSelecionada.innerHTML = opt.querySelector('.option-titulo')?.textContent || valor;
        }
    });
    
    document.getElementById('faixaOptions')?.classList.remove('aberto');
    document.querySelector('#faixaSelect .custom-select-trigger')?.classList.remove('aberto');
    if (!pacienteAtivo) { resetarGrafico();
        document.getElementById("resultado").style.display = "none"; }
}

function atualizarFaixasEtarias() {
    const container = document.getElementById('faixaOptions');
    const faixaSelecionada = document.getElementById('faixaSelecionada');
    if (!container) return;
    
    const faixas = FAIXAS_POR_FONTE[fonteAtual] || FAIXAS_POR_FONTE.oms;
    container.innerHTML = faixas.map(f => `
        <div class="custom-select-option" data-value="${f.value}" onclick="selecionarFaixa('${f.value}')">
            <i class="ri-user-line"></i>
            <div class="option-content">
                <span class="option-titulo">${f.label}</span>
            </div>
        </div>
    `).join('');
    
    if (faixaAtual) {
        const existe = faixas.some(f => f.value === faixaAtual);
        if (existe) {
            container.querySelectorAll('.custom-select-option').forEach(opt => {
                if (opt.dataset.value === faixaAtual) {
                    opt.classList.add('selecionado');
                    faixaSelecionada.innerHTML = opt.querySelector('.option-titulo')?.textContent || faixaAtual;
                }
            });
            return;
        }
    }
    const primeira = container.querySelector('.custom-select-option');
    if (primeira) {
        primeira.classList.add('selecionado');
        faixaAtual = primeira.dataset.value;
        faixaSelecionada.innerHTML = primeira.querySelector('.option-titulo')?.textContent || faixaAtual;
    }
}

function inicializarSelects() {
    const pageId = window.location.pathname.split('/').slice(-2, -1)[0] || 'raiz';
    const salvo = sessionStorage.getItem(`matclinica_${pageId}`);
    let temEstadoSalvo = false;
    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            if (parsed._fonteAtual || parsed._faixaAtual) temEstadoSalvo = true;
        } catch (e) {}
    }
    if (!temEstadoSalvo) {
        const opcaoPadrao = document.querySelector('#fonteOptions .custom-select-option[data-value="oms"]');
        if (opcaoPadrao) {
            opcaoPadrao.classList.add('selecionado');
            const fonteSelecionada = document.getElementById('fonteSelecionada');
            if (fonteSelecionada) {
                const titulo = opcaoPadrao.querySelector('.option-titulo')?.textContent || 'OMS (Internacional)';
                const icone = opcaoPadrao.querySelector('i')?.className || '';
                fonteSelecionada.innerHTML = `<i class="${icone}"></i> ${titulo}`;
            }
        }
        atualizarFaixasEtarias();
    }
}

// ============================================================================
// SECÇÃO 10: SELECTS DA SIDEBAR
// ============================================================================

function toggleFonteSelectSidebar() {
    const options = document.getElementById('fonteOptionsSidebar');
    const trigger = document.querySelector('#fonteSelectSidebar .custom-select-trigger-sidebar');
    if (!options || !trigger) return;
    document.getElementById('faixaOptionsSidebar')?.classList.remove('aberto');
    document.querySelector('#faixaSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
    options.classList.toggle('aberto');
    trigger.classList.toggle('aberto');
}

function toggleFaixaSelectSidebar() {
    const options = document.getElementById('faixaOptionsSidebar');
    const trigger = document.querySelector('#faixaSelectSidebar .custom-select-trigger-sidebar');
    if (!options || !trigger) return;
    document.getElementById('fonteOptionsSidebar')?.classList.remove('aberto');
    document.querySelector('#fonteSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
    options.classList.toggle('aberto');
    trigger.classList.toggle('aberto');
}

function selecionarFonteSidebar(valor) {
    if (fonteSidebarAtual === valor) {
        document.getElementById('fonteOptionsSidebar')?.classList.remove('aberto');
        document.querySelector('#fonteSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
        return;
    }
    fonteSidebarAtual = valor;
    
    const fonteSelecionada = document.getElementById('fonteSelecionadaSidebar');
    document.querySelectorAll('#fonteOptionsSidebar .custom-select-option-sidebar').forEach(opt => {
        opt.classList.remove('selecionado');
        if (opt.dataset.value === valor) {
            opt.classList.add('selecionado');
            const titulo = opt.querySelector('.option-titulo')?.textContent || valor;
            const icone = opt.querySelector('i')?.className || '';
            fonteSelecionada.innerHTML = `<i class="${icone}"></i> ${titulo}`;
        }
    });
    
    document.getElementById('fonteOptionsSidebar')?.classList.remove('aberto');
    document.querySelector('#fonteSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
    atualizarFaixasSidebar();
}

function selecionarFaixaSidebar(valor) {
    if (faixaSidebarAtual === valor) {
        document.getElementById('faixaOptionsSidebar')?.classList.remove('aberto');
        document.querySelector('#faixaSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
        return;
    }
    faixaSidebarAtual = valor;
    
    const faixaSelecionada = document.getElementById('faixaSelecionadaSidebar');
    document.querySelectorAll('#faixaOptionsSidebar .custom-select-option-sidebar').forEach(opt => {
        opt.classList.remove('selecionado');
        if (opt.dataset.value === valor) {
            opt.classList.add('selecionado');
            faixaSelecionada.innerHTML = opt.querySelector('.option-titulo')?.textContent || valor;
        }
    });
    
    document.getElementById('faixaOptionsSidebar')?.classList.remove('aberto');
    document.querySelector('#faixaSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
}

function atualizarFaixasSidebar() {
    const container = document.getElementById('faixaOptionsSidebar');
    const faixaSelecionada = document.getElementById('faixaSelecionadaSidebar');
    if (!container) return;
    
    const faixas = FAIXAS_POR_FONTE[fonteSidebarAtual] || FAIXAS_POR_FONTE.oms;
    container.innerHTML = faixas.map(f => `
        <div class="custom-select-option-sidebar" data-value="${f.value}" onclick="selecionarFaixaSidebar('${f.value}')">
            <i class="ri-user-line"></i>
            <div class="option-content">
                <span class="option-titulo">${f.label}</span>
            </div>
        </div>
    `).join('');
    
    if (faixaSidebarAtual) {
        const existe = faixas.some(f => f.value === faixaSidebarAtual);
        if (existe) {
            container.querySelectorAll('.custom-select-option-sidebar').forEach(opt => {
                if (opt.dataset.value === faixaSidebarAtual) {
                    opt.classList.add('selecionado');
                    faixaSelecionada.innerHTML = opt.querySelector('.option-titulo')?.textContent || faixaSidebarAtual;
                }
            });
            return;
        }
    }
    const primeira = container.querySelector('.custom-select-option-sidebar');
    if (primeira) {
        primeira.classList.add('selecionado');
        faixaSidebarAtual = primeira.dataset.value;
        faixaSelecionada.innerHTML = primeira.querySelector('.option-titulo')?.textContent || faixaSidebarAtual;
    }
}

function inicializarSelectsSidebar() {
    const pageId = window.location.pathname.split('/').slice(-2, -1)[0] || 'raiz';
    const salvo = sessionStorage.getItem(`matclinica_${pageId}`);
    let temEstadoSalvo = false;
    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            if (parsed._fonteSidebarAtual || parsed._faixaSidebarAtual) temEstadoSalvo = true;
        } catch (e) {}
    }
    if (!temEstadoSalvo) {
        const opcaoPadrao = document.querySelector('#fonteOptionsSidebar .custom-select-option-sidebar[data-value="oms"]');
        if (opcaoPadrao) {
            opcaoPadrao.classList.add('selecionado');
            const fonteSelecionada = document.getElementById('fonteSelecionadaSidebar');
            if (fonteSelecionada) {
                const titulo = opcaoPadrao.querySelector('.option-titulo')?.textContent || 'OMS';
                const icone = opcaoPadrao.querySelector('i')?.className || '';
                fonteSelecionada.innerHTML = `<i class="${icone}"></i> ${titulo}`;
            }
        }
        atualizarFaixasSidebar();
    }
}

// ============================================================================
// SECÇÃO 11: SELECT DE LOCAL DA TEMPERATURA
// ============================================================================

function toggleTempLocalSelect(event) {
    if (event) event.stopPropagation();
    const options = document.getElementById('tempLocalOptions');
    const trigger = document.querySelector('#tempLocalSelect .custom-select-trigger-temp');
    if (!options || !trigger) return;
    document.getElementById('fonteOptions')?.classList.remove('aberto');
    document.getElementById('faixaOptions')?.classList.remove('aberto');
    options.classList.toggle('aberto');
    trigger.classList.toggle('aberto');
}

function selecionarLocalTemp(valor, event) {
    if (event) event.stopPropagation();
    
    const localSelecionado = document.getElementById('tempLocalSelecionado');
    const map = { 'oral': 'Oral', 'axilar': 'Axilar', 'timpanico': 'Timpânico', 'timpânico': 'Timpânico', 'retal': 'Retal' };
    const label = map[valor] || 'Oral';
    
    document.querySelectorAll('#tempLocalOptions .custom-select-option-temp').forEach(opt => {
        opt.classList.remove('selecionado');
        if (opt.dataset.value === valor) opt.classList.add('selecionado');
    });
    
    if (localSelecionado) localSelecionado.textContent = label;
    
    document.getElementById('tempLocalOptions')?.classList.remove('aberto');
    document.querySelector('#tempLocalSelect .custom-select-trigger-temp')?.classList.remove('aberto');
    
    if (localTempAtual !== valor) {
        localTempAtual = valor;
        console.log(`🌡️ Local de temperatura selecionado: ${valor}`);
    }
}

// ============================================================================
// SECÇÃO 12: GRÁFICO
// ============================================================================

function resetarGrafico() {
    historicoMedicoes = [];
    if (graficoAtual) { graficoAtual.destroy();
        graficoAtual = null; }
    
    const placeholder = document.getElementById('graficoPlaceholder');
    const canvas = document.getElementById('graficoSinais');
    const badge = document.getElementById('graficoBadge');
    const instrucao = document.getElementById('graficoInstrucao');
    const legenda = document.getElementById('graficoLegenda');
    
    if (badge) { badge.textContent = 'Aguardando dados';
        badge.classList.add('aguardando'); }
    if (instrucao) instrucao.style.display = 'none';
    if (legenda) { legenda.innerHTML = '';
        legenda.style.display = 'none'; }
    if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.innerHTML = `<div class="grafico-indisponivel">
            <i class="ri-bar-chart-2-line"></i>
            <div class="info"><h4>Sem medições registadas</h4><p>Adicione a primeira medição para visualizar o gráfico.</p></div>
        </div>`;
    }
    if (canvas) canvas.style.display = 'none';
}

function adicionarMedicao(registro) {
    historicoMedicoes.push(registro);
    if (historicoMedicoes.length > 20) historicoMedicoes.shift();
    atualizarGrafico();
}

function carregarGraficoPaciente() {
    if (!pacienteAtivo || !pacientes[pacienteAtivo]) {
        historicoMedicoes = [];
        atualizarGrafico();
        return;
    }
    const p = pacientes[pacienteAtivo];
    if (!p.historico || p.historico.length === 0) {
        historicoMedicoes = [];
        atualizarGrafico();
        return;
    }
    historicoMedicoes = p.historico.map(registro => {
        const dataParts = registro.data.split('/');
        const horaParts = registro.hora.split(':');
        return {
            timestamp: new Date(parseInt(dataParts[2]), parseInt(dataParts[1]) - 1, parseInt(dataParts[0]), parseInt(horaParts[0]) || 0, parseInt(horaParts[1]) || 0).getTime(),
            fc: registro.fc || "",
            fr: registro.fr || "",
            temp: registro.temp || "",
            sato2: registro.sato2 || "",
            sis: registro.sis || "",
            dia: registro.dia || ""
        };
    });
    if (historicoMedicoes.length > 20) historicoMedicoes = historicoMedicoes.slice(-20);
    atualizarGrafico();
}

function atualizarGrafico() {
    const container = document.getElementById('graficoContainer');
    const placeholder = document.getElementById('graficoPlaceholder');
    const canvas = document.getElementById('graficoSinais');
    const badge = document.getElementById('graficoBadge');
    const instrucao = document.getElementById('graficoInstrucao');
    const legenda = document.getElementById('graficoLegenda');
    
    if (!container) return;
    
    if (historicoMedicoes.length === 0) {
        if (badge) { badge.textContent = 'Aguardando dados';
            badge.classList.add('aguardando'); }
        if (instrucao) instrucao.style.display = 'none';
        if (legenda) { legenda.innerHTML = '';
            legenda.style.display = 'none'; }
        if (placeholder) {
            placeholder.style.display = 'block';
            placeholder.innerHTML = `<div class="grafico-indisponivel">
                <i class="ri-bar-chart-2-line"></i>
                <div class="info"><h4>Sem medições registadas</h4><p>Adicione a primeira medição para visualizar o gráfico.</p></div>
            </div>`;
        }
        if (canvas) canvas.style.display = 'none';
        return;
    }
    
    if (badge) { badge.textContent = `${historicoMedicoes.length} medições • Tendência`;
        badge.classList.remove('aguardando'); }
    if (instrucao) instrucao.style.display = 'flex';
    if (legenda) legenda.style.display = 'flex';
    if (placeholder) placeholder.style.display = 'none';
    if (canvas) { canvas.style.display = 'block';
        criarGrafico();
        setTimeout(gerarLegendaToggle, 100); }
}

function gerarLegendaToggle() {
    const container = document.getElementById('graficoLegenda');
    if (!container || !graficoAtual || historicoMedicoes.length === 0) {
        if (container) container.style.display = 'none';
        return;
    }
    container.style.display = 'flex';
    let html = '';
    graficoAtual.data.datasets.forEach((dataset, index) => {
        const isHidden = graficoAtual.getDatasetMeta(index).hidden || false;
        html += `<div class="legenda-toggle-item ${isHidden ? 'oculto' : 'ativo'}" data-dataset-index="${index}" onclick="toggleDataset(${index})">
            <span class="legenda-cor" style="background: ${dataset.borderColor};"></span>
            <span class="legenda-nome">${dataset.label}</span>
            <span class="legenda-slider"></span>
        </div>`;
    });
    container.innerHTML = html;
}

function toggleDataset(index) {
    if (!graficoAtual) return;
    const meta = graficoAtual.getDatasetMeta(index);
    meta.hidden = !meta.hidden;
    graficoAtual.update();
    gerarLegendaToggle();
}

function criarGrafico() {
    const canvas = document.getElementById('graficoSinais');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let paisRef, faixaRef;
    if (pacienteAtivo) {
        paisRef = pacientes[pacienteAtivo].info.pais;
        faixaRef = pacientes[pacienteAtivo].info.faixa;
    } else {
        paisRef = fonteAtual === 'oms' ? 'OMS' : 'Angola';
        faixaRef = faixaAtual;
    }
    if (!DB_VITALS[paisRef] || !DB_VITALS[paisRef][faixaRef]) faixaRef = "adulto";
    const ref = DB_VITALS[paisRef]?.[faixaRef] || DB_VITALS["OMS"]["adulto"];
    
    const refMap = {
        'fc': ref.fc.ref,
        'fr': ref.fr.ref,
        'temp': ref.temp.ref,
        'sato2': ref.sato2.ref,
        'sis': ref.sis.ref,
        'dia': ref.dia.ref
    };
    
    const labelMap = {
        'fc': 'FC',
        'fr': 'FR',
        'temp': 'Temp',
        'sato2': 'SatO2',
        'sis': 'Sistólica',
        'dia': 'Diastólica'
    };
    
    const unidadeMap = {
        'fc': 'bpm',
        'fr': 'ipm',
        'temp': '°C',
        'sato2': '%',
        'sis': 'mmHg',
        'dia': 'mmHg'
    };
    
    function getStatus(valor, campo) {
        if (valor === null || valor === undefined || isNaN(valor)) return null;
        const limits = refMap[campo];
        if (!limits) return null;
        if (valor < limits[0]) return { texto: 'Baixo', cor: '#f59e0b', icone: '↓' };
        if (valor > limits[1]) return { texto: 'Alto', cor: '#ef4444', icone: '↑' };
        return { texto: 'Normal', cor: '#00843d', icone: '✓' };
    }
    
    function getEvolucao(valorAtual, campo, index) {
        if (index === 0) return { texto: 'Inicial', cor: '#6b7280', icone: '•' };
        if (index < 0 || index >= historicoMedicoes.length) return null;
        const anterior = historicoMedicoes[index - 1];
        const valAnt = parseFloat(anterior[campo]);
        if (isNaN(valAnt) || valAnt === null) return { texto: 'Inicial', cor: '#6b7280', icone: '•' };
        if (valorAtual === null || isNaN(valorAtual)) return null;
        const diff = valorAtual - valAnt;
        const percentDiff = Math.abs(diff / valAnt * 100);
        if (percentDiff < 5) return { texto: 'Estável', cor: '#3b82f6', icone: '→' };
        if (diff > 0) return { texto: '↑ Subindo', cor: '#ef4444', icone: '↑' };
        return { texto: '↓ Descendo', cor: '#00843d', icone: '↓' };
    }
    
    const datas = historicoMedicoes.map(h => new Date(h.timestamp));
    const usarDias = [...new Set(datas.map(d => d.toDateString()))].length > 1;
    
    const labels = historicoMedicoes.map(h => {
        const data = new Date(h.timestamp);
        if (usarDias) {
            return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')} ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
        }
        return `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
    });
    
    const maxLabels = 10;
    let indicesExibidos = historicoMedicoes.map((_, i) => i);
    let labelsExibidas = labels;
    if (labels.length > maxLabels) {
        const step = Math.ceil(labels.length / maxLabels);
        indicesExibidos = [];
        for (let i = 0; i < labels.length; i += step) indicesExibidos.push(i);
        if (indicesExibidos[indicesExibidos.length - 1] !== labels.length - 1) indicesExibidos.push(labels.length - 1);
        labelsExibidas = indicesExibidos.map(i => labels[i]);
    }
    
    const configs = [
        { label: 'FC', key: 'fc', cor: '#00843d' },
        { label: 'FR', key: 'fr', cor: '#2563eb' },
        { label: 'Temp', key: 'temp', cor: '#d97706' },
        { label: 'SatO2', key: 'sato2', cor: '#7c3aed' },
        { label: 'Sistólica', key: 'sis', cor: '#dc2626' },
        { label: 'Diastólica', key: 'dia', cor: '#db2777' }
    ];
    
    const isUmaMedicao = historicoMedicoes.length === 1;
    const datasets = [];
    configs.forEach(c => {
        const data = historicoMedicoes.map(h => {
            const val = h[c.key];
            return val && val !== "" && !isNaN(parseFloat(val)) ? parseFloat(val) : null;
        });
        if (data.some(v => v !== null)) {
            datasets.push({
                label: c.label,
                data: indicesExibidos.map(i => data[i]),
                borderColor: c.cor,
                backgroundColor: 'transparent',
                tension: 0.3,
                pointRadius: isUmaMedicao ? 5 : 2.5,
                pointHoverRadius: isUmaMedicao ? 7 : 5,
                pointBackgroundColor: c.cor,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1,
                spanGaps: true,
                fill: false,
                borderWidth: isUmaMedicao ? 0 : 1.5
            });
        }
    });
    
    if (datasets.length === 0) return;
    if (graficoAtual) { graficoAtual.destroy();
        graficoAtual = null; }
    
    graficoAtual = new Chart(ctx, {
        type: 'line',
        data: { labels: labelsExibidas, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            interaction: {
                mode: 'nearest',
                intersect: false
            },
            onHover: function(event, elements) {
                if (elements.length === 0) {
                    this.tooltip?.setActiveElements([], { x: 0, y: 0 });
                    this.update();
                }
            },
            onLeave: function() {
                this.tooltip?.setActiveElements([], { x: 0, y: 0 });
                this.update();
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    titleFont: { size: 11, weight: '600' },
                    bodyFont: { size: 10 },
                    padding: 14,
                    cornerRadius: 10,
                    titleColor: '#ffffff',
                    bodyColor: '#e5e7eb',
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const originalIndex = indicesExibidos[index];
                            const data = historicoMedicoes[originalIndex];
                            if (!data) return 'Sem dados';
                            const dataObj = new Date(data.timestamp);
                            return `${dataObj.toLocaleDateString()} ${dataObj.toLocaleTimeString()}`;
                        },
                        label: function(context) {
                            const index = context.dataIndex;
                            const originalIndex = indicesExibidos[index];
                            const valor = context.parsed.y;
                            if (valor === null || isNaN(valor)) return null;
                            const label = context.dataset.label;
                            let campoKey = 'fc';
                            for (const [key, val] of Object.entries(labelMap)) {
                                if (val === label) { campoKey = key; break; }
                            }
                            const status = getStatus(valor, campoKey);
                            const statusText = status ? `${status.icone} ${status.texto}` : '--';
                            const evolucao = getEvolucao(valor, campoKey, originalIndex);
                            const evolText = evolucao ? `${evolucao.icone} ${evolucao.texto}` : '--';
                            const limits = refMap[campoKey];
                            const refText = limits ? `${limits[0]} - ${limits[1]}` : '--';
                            const unidade = unidadeMap[campoKey] || '';
                            return [
                                `${label}: ${valor} ${unidade}`,
                                `  Status: ${statusText}`,
                                `  Evolução: ${evolText}`,
                                `  Referência: ${refText} ${unidade}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(150,150,150,0.4)',
                        drawBorder: true,
                        borderColor: 'rgba(150,150,150,0.6)',
                        borderWidth: 1
                    },
                    ticks: {
                        font: { size: 8 },
                        color: '#888888',
                        maxRotation: 30,
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    title: {
                        display: true,
                        text: isUmaMedicao ? 'Medição atual' : (usarDias ? 'Data/Hora' : 'Horário'),
                        font: { size: 9, weight: '500' },
                        color: '#888888'
                    }
                },
                y: {
                    grid: {
                        display: true,
                        color: 'rgba(150,150,150,0.4)',
                        drawBorder: true,
                        borderColor: 'rgba(150,150,150,0.6)',
                        borderWidth: 1
                    },
                    ticks: {
                        font: { size: 8 },
                        color: '#888888'
                    },
                    title: {
                        display: true,
                        text: 'Valores',
                        font: { size: 9, weight: '500' },
                        color: '#888888'
                    }
                }
            },
            elements: {
                line: {
                    borderJoinStyle: 'round'
                }
            }
        }
    });
    setTimeout(gerarLegendaToggle, 50);
}

// ============================================================================
// SECÇÃO 13: FUNÇÃO INTERPRETAR
// ============================================================================

function interpretar() {
    const res = document.getElementById("resultado");
    const sis = document.getElementById("sis");
    const dia = document.getElementById("dia");
    const fc = document.getElementById("fc");
    const fr = document.getElementById("fr");
    const temp = document.getElementById("temp");
    const sato2 = document.getElementById("sato2");
    const caixaTa = document.getElementById("caixa_ta");
    
    let paisRef, faixaRef;
    
    if (pacienteAtivo) {
        paisRef = pacientes[pacienteAtivo].info.pais || 'OMS';
        faixaRef = pacientes[pacienteAtivo].info.faixa;
    } else {
        paisRef = fonteAtual === 'oms' ? 'OMS' : 'Angola';
        faixaRef = faixaAtual;
        if (!faixaRef) { mostrarErro("Selecione uma faixa etária!"); return; }
    }
    
    // Validação
    const campos = [
        { id: 'fc', nome: 'Frequência Cardíaca', min: 0, max: 500, el: fc },
        { id: 'fr', nome: 'Frequência Respiratória', min: 0, max: 200, el: fr },
        { id: 'temp', nome: 'Temperatura', min: 20, max: 45, el: temp },
        { id: 'sato2', nome: 'SatO2', min: 0, max: 100, el: sato2 },
        { id: 'sis', nome: 'Sistólica', min: 0, max: 350, el: sis },
        { id: 'dia', nome: 'Diastólica', min: 0, max: 250, el: dia }
    ];
    
    for (const campo of campos) {
        if (campo.el.value && campo.el.value !== "") {
            const val = parseFloat(campo.el.value);
            if (isNaN(val) || val < campo.min || val > campo.max) {
                campo.el.classList.add('campo-incompleto');
                setTimeout(() => campo.el.classList.remove('campo-incompleto'), 3000);
                mostrarErro(`${campo.nome} deve estar entre ${campo.min} e ${campo.max}!`);
                return;
            }
        }
    }
    
    if (!DB_VITALS[paisRef] || !DB_VITALS[paisRef][faixaRef]) {
        paisRef = 'OMS';
        faixaRef = 'adulto';
        if (!DB_VITALS[paisRef]?.[faixaRef]) { mostrarErro("Dados de referência não disponíveis!"); return; }
    }
    
    const faixaData = DB_VITALS[paisRef][faixaRef];
    
    res.classList.remove("vibrar");
    void res.offsetWidth;
    res.classList.add("vibrar");
    [sis, dia, fc, fr, temp, sato2, caixaTa].forEach(el => el.classList.remove("campo-incompleto"));
    
    if (!sis.value && !dia.value && !fc.value && !fr.value && !temp.value && !sato2.value) {
        mostrarErro("Insira pelo menos um sinal vital!");
        return;
    }
    if ((sis.value && !dia.value) || (!sis.value && dia.value)) {
        caixaTa.classList.add("campo-incompleto");
        mostrarErro("Pressão Arterial incompleta!");
        return;
    }
    
    const resultados = [];
    
    function adicionarResultado(nome, valor, unidade, campoData, icone, cor) {
        if (valor === null || valor === undefined || valor === "") return;
        const v = parseFloat(valor);
        if (isNaN(v)) return;
        const ref = campoData.ref || [0, 0];
        const categorias = campoData.categorias || [];
        const fonte = campoData.fonte || null;
        
        let status = "normal",
            statusTexto = "Normal",
            statusCor = "#00843d",
            statusIcone = "ri-checkbox-circle-fill";
        if (v < ref[0]) { status = "baixo";
            statusTexto = "Baixo";
            statusCor = "#f59e0b";
            statusIcone = "ri-arrow-down-circle-fill"; }
        if (v > ref[1]) { status = "alto";
            statusTexto = "Alto";
            statusCor = "#ef4444";
            statusIcone = "ri-arrow-up-circle-fill"; }
        const termoClinico = obterTermoClinico(v, categorias);
        
        resultados.push({ nome, valor: v, unidade, status, statusTexto, statusCor, statusIcone, icone, cor, min: ref[0], max: ref[1], termoClinico, fonte });
    }
    
    adicionarResultado("FC", fc.value, "bpm", faixaData.fc, "ri-heart-pulse-fill", "#00843d");
    adicionarResultado("FR", fr.value, "ipm", faixaData.fr, "ri-lungs-fill", "#3b82f6");
    adicionarResultado("SatO₂", sato2.value, "%", faixaData.sato2, "ri-drop-line", "#8b5cf6");
    
    // Temperatura com local
    if (temp.value && temp.value !== "") {
        const v = parseFloat(temp.value);
        if (!isNaN(v)) {
            const localAfericao = localTempAtual || 'oral';
            const localMap = { 'oral': 'oral', 'axilar': 'axilar', 'timpanico': 'timpanico', 'timpânico': 'timpanico', 'retal': 'retal' };
            const chaveLocal = localMap[localAfericao] || 'oral';
            
            let tempData = null,
                refTemp = [36.0, 37.2],
                fonteTemp = faixaData.temp.fonte || 'OMS';
            
            if (faixaData.temp && faixaData.temp.local && faixaData.temp.local[chaveLocal]) {
                const localData = faixaData.temp.local[chaveLocal];
                tempData = { ref: localData.ref || [36.0, 37.2], categorias: localData.categorias || [], fonte: localData.fonte || fonteTemp };
                refTemp = tempData.ref;
            } else {
                if (faixaData.temp && faixaData.temp.local && faixaData.temp.local.oral) {
                    const localData = faixaData.temp.local.oral;
                    tempData = { ref: localData.ref || [36.0, 37.2], categorias: localData.categorias || [], fonte: localData.fonte || fonteTemp };
                    refTemp = tempData.ref;
                } else {
                    tempData = {
                        ref: [36.0, 37.2],
                        categorias: [
                            { min: -Infinity, max: 34.9, termo: "Hipotermia grave" },
                            { min: 35, max: 35.9, termo: "Hipotermia" },
                            { min: 36.0, max: 37.2, termo: "Aprexia" },
                            { min: 37.3, max: 38.0, termo: "Hipertermia" },
                            { min: 38.1, max: 39.0, termo: "Febre" },
                            { min: 39.1, max: 42.0, termo: "Hiperpirexia" },
                            { min: 42.1, max: Infinity, termo: "Hipertermia maligna" }
                        ],
                        fonte: fonteTemp
                    };
                    refTemp = tempData.ref;
                }
            }
            
            let status = "normal",
                statusTexto = "Normal",
                statusCor = "#00843d",
                statusIcone = "ri-checkbox-circle-fill";
            if (v < refTemp[0]) { status = "baixo";
                statusTexto = "Baixo";
                statusCor = "#f59e0b";
                statusIcone = "ri-arrow-down-circle-fill"; }
            if (v > refTemp[1]) { status = "alto";
                statusTexto = "Alto";
                statusCor = "#ef4444";
                statusIcone = "ri-arrow-up-circle-fill"; }
            const termoClinico = obterTermoTemperatura(v, faixaData, localAfericao);
            
            resultados.push({
                nome: "Temperatura",
                valor: v,
                unidade: "°C",
                status,
                statusTexto,
                statusCor,
                statusIcone,
                icone: "ri-temp-hot-line",
                cor: "#f97316",
                min: refTemp[0],
                max: refTemp[1],
                termoClinico: termoClinico,
                fonte: tempData.fonte || faixaData.temp.fonte || 'OMS'
            });
        }
    }
    
    // Tensão Arterial
    if (sis.value && dia.value) {
        const sistolica = parseFloat(sis.value);
        const diastolica = parseFloat(dia.value);
        const sisRef = faixaData.sis.ref;
        let statusSis = "normal",
            statusSisTexto = "Normal",
            statusSisCor = "#00843d",
            statusSisIcone = "ri-checkbox-circle-fill";
        if (sistolica < sisRef[0]) { statusSis = "baixo";
            statusSisTexto = "Baixo";
            statusSisCor = "#f59e0b";
            statusSisIcone = "ri-arrow-down-circle-fill"; }
        if (sistolica > sisRef[1]) { statusSis = "alto";
            statusSisTexto = "Alto";
            statusSisCor = "#ef4444";
            statusSisIcone = "ri-arrow-up-circle-fill"; }
        const termoSis = obterTermoClinico(sistolica, faixaData.sis.categorias);
        resultados.push({ nome: "PA Sistólica", valor: sistolica, unidade: "mmHg", status: statusSis, statusTexto: statusSisTexto, statusCor: statusSisCor, statusIcone: statusSisIcone, icone: "ri-h-1", cor: "#ef4444", min: sisRef[0], max: sisRef[1], termoClinico: termoSis, fonte: faixaData.sis.fonte });
        
        const diaRef = faixaData.dia.ref;
        let statusDia = "normal",
            statusDiaTexto = "Normal",
            statusDiaCor = "#00843d",
            statusDiaIcone = "ri-checkbox-circle-fill";
        if (diastolica < diaRef[0]) { statusDia = "baixo";
            statusDiaTexto = "Baixo";
            statusDiaCor = "#f59e0b";
            statusDiaIcone = "ri-arrow-down-circle-fill"; }
        if (diastolica > diaRef[1]) { statusDia = "alto";
            statusDiaTexto = "Alto";
            statusDiaCor = "#ef4444";
            statusDiaIcone = "ri-arrow-up-circle-fill"; }
        const termoDia = obterTermoClinico(diastolica, faixaData.dia.categorias);
        resultados.push({ nome: "PA Diastólica", valor: diastolica, unidade: "mmHg", status: statusDia, statusTexto: statusDiaTexto, statusCor: statusDiaCor, statusIcone: statusDiaIcone, icone: "ri-h-2", cor: "#ec4899", min: diaRef[0], max: diaRef[1], termoClinico: termoDia, fonte: faixaData.dia.fonte });
    }
    
    const faixaExibicao = faixasMap[faixaRef] || faixaRef;
    const nomeFonte = paisRef === 'OMS' ? 'OMS (Internacional)' : 'Ministério da Saúde de Angola';
    
    let html = `<div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; background: rgba(0, 132, 61, 0.1); padding: 8px 16px; border-radius: 50px; font-size: 0.75rem; color: var(--primary);">
            <i class="ri-book-open-line"></i> ${nomeFonte} • ${faixaExibicao}
        </div>
    </div><div class="resultados-grid">`;
    
    resultados.forEach(r => {
        const percentNormal = ((r.valor - r.min) / (r.max - r.min)) * 100;
        const percentClamped = Math.min(100, Math.max(0, percentNormal));
        const temTermo = r.termoClinico && r.termoClinico !== "Normal" && r.termoClinico !== "Aprexia";
        html += `<div class="resultado-card ${r.status}">
            <div class="card-header">
                <div class="card-icon" style="background: ${r.cor}20; color: ${r.cor};"><i class="${r.icone}"></i></div>
                <div class="card-status-group">
                    <div class="card-status" style="color: ${r.statusCor}"><i class="${r.statusIcone}"></i><span>${r.statusTexto}</span></div>
                    ${temTermo ? `<div class="card-termo-clinico">${r.termoClinico}</div>` : ''}
                </div>
            </div>
            <div class="card-valor">${r.valor}<span class="card-unidade">${r.unidade}</span></div>
            <div class="card-nome">${r.nome}</div>
            <div class="card-range"><span>Referência: ${r.min} - ${r.max} ${r.unidade}</span>${r.fonte ? `<span class="card-fonte">• ${r.fonte}</span>` : ''}</div>
            <div class="card-bar"><div class="card-bar-fill" style="width: ${percentClamped}%; background: ${r.cor};"></div></div>
        </div>`;
    });
    html += `</div>`;
    
    const totalBaixo = resultados.filter(r => r.status === "baixo").length;
    const totalAlto = resultados.filter(r => r.status === "alto").length;
    const totalNormal = resultados.filter(r => r.status === "normal").length;
    if (totalBaixo > 0 || totalAlto > 0) {
        html += `<div class="resumo-alertas">
            <div class="alerta-item ${totalBaixo > 0 ? 'tem-alerta' : ''}"><i class="ri-arrow-down-circle-fill"></i><span>${totalBaixo} valor(es) abaixo</span></div>
            <div class="alerta-item ${totalNormal > 0 ? '' : ''}"><i class="ri-checkbox-circle-fill"></i><span>${totalNormal} normal(is)</span></div>
            <div class="alerta-item ${totalAlto > 0 ? 'tem-alerta' : ''}"><i class="ri-arrow-up-circle-fill"></i><span>${totalAlto} valor(es) acima</span></div>
        </div>`;
    }
    
    const registro = { timestamp: Date.now(), fc: fc.value || "", fr: fr.value || "", temp: temp.value || "", sato2: sato2.value || "", sis: sis.value || "", dia: dia.value || "" };
    const temValor = Object.values(registro).some(v => v !== "" && v !== null && v !== undefined);
    if (temValor) {
        if (pacienteAtivo) { carregarGraficoPaciente(); } else { adicionarMedicao(registro); }
    }
    
    res.innerHTML = html;
    res.style.background = "var(--card-bg)";
    res.style.color = "var(--text)";
    res.style.display = "block";
    res.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    res.style.width = "100%";
    
    if (pacienteAtivo) {
        const agora = new Date();
        pacientes[pacienteAtivo].historico.push({
            data: agora.toLocaleDateString(),
            hora: agora.toLocaleTimeString(),
            fc: fc.value,
            fr: fr.value,
            temp: temp.value,
            sato2: sato2.value,
            sis: sis.value,
            dia: dia.value
        });
        localStorage.setItem('pacientes_monitorados', JSON.stringify(pacientes));
        limparCacheGravidade();
        
        const toggleTriagem = document.getElementById('toggle-triagem');
        const triagemAtivada = toggleTriagem && toggleTriagem.checked;
        renderListaNomes();
        if (triagemAtivada) { ordenarListaPorTriagem(); }
        renderizarCardResultados();
        carregarGraficoPaciente();
    }
}

function mostrarErro(mensagem) {
    const res = document.getElementById("resultado");
    res.innerHTML = `<div style="display: flex; align-items: center; gap: 12px; justify-content: center; text-align: center;">
        <i class="ri-error-warning-fill" style="font-size: 2rem;"></i>
        <span>${mensagem}</span>
    </div>`;
    res.style.background = "#ef4444";
    res.style.color = "white";
    res.style.display = "block";
    res.style.width = "100%";
}

function limparSinais() {
    ["sis", "dia", "fc", "fr", "temp", "sato2"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("resultado").style.display = "none";
    document.getElementById("caixa_ta").classList.remove("campo-incompleto");
    renderizarCardResultados();
    if (pacienteAtivo) { carregarGraficoPaciente(); return; }
    historicoMedicoes = [];
    if (graficoAtual) { graficoAtual.destroy();
        graficoAtual = null; }
    atualizarGrafico();
}

// ============================================================================
// SECÇÃO 14: EXPORTAÇÃO DE PDF
// ============================================================================

async function exportarPDF() {
    const btn = document.getElementById('btn-exportar');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Gerando PDF...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'wait';
    
    try {
        if (!pacienteAtivo) { alert("Nenhum paciente selecionado."); return; }
        if (!pacientes[pacienteAtivo]) { alert("Paciente não encontrado."); return; }
        if (!pacientes[pacienteAtivo].historico || pacientes[pacienteAtivo].historico.length === 0) {
            alert("Adicione pelo menos uma medição ao histórico.");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const p = pacientes[pacienteAtivo];
        const hist = p.historico;
        
        let paisRef = p.info.pais || 'OMS';
        let faixaRef = p.info.faixa;
        if (!DB_VITALS[paisRef] || !DB_VITALS[paisRef][faixaRef]) {
            faixaRef = "adulto";
            if (!DB_VITALS[paisRef]?.[faixaRef]) { paisRef = 'OMS';
                faixaRef = 'adulto'; }
        }
        const faixaData = DB_VITALS[paisRef]?.[faixaRef] || DB_VITALS["OMS"]["adulto"];
        
        function obterRefTempPDF(faixaData, local) {
            if (!faixaData || !faixaData.temp || !faixaData.temp.local) return [36.0, 37.2];
            const localMap = { 'oral': 'oral', 'axilar': 'axilar', 'timpanico': 'timpanico', 'timpânico': 'timpanico', 'retal': 'retal' };
            const chave = localMap[local] || 'oral';
            const localData = faixaData.temp.local[chave];
            if (!localData || !localData.ref) {
                if (faixaData.temp.local.oral && faixaData.temp.local.oral.ref) return faixaData.temp.local.oral.ref;
                return [36.0, 37.2];
            }
            return localData.ref;
        }
        
        const refTemp = obterRefTempPDF(faixaData, localTempAtual || 'oral');
        const ref = {
            fc: faixaData.fc.ref || [60, 100],
            fr: faixaData.fr.ref || [12, 20],
            temp: { ref: refTemp },
            sato2: faixaData.sato2.ref || [95, 100],
            sis: faixaData.sis.ref || [90, 129],
            dia: faixaData.dia.ref || [60, 84]
        };
        const fonteNome = paisRef === 'OMS' ? 'OMS (Internacional)' : 'Ministério da Saúde de Angola';
        
        // Estatísticas
        const totalMedicoes = hist.length;
        const diasUnicos = [...new Set(hist.map(h => h.data))];
        const totalDias = diasUnicos.length;
        const primeiraData = hist[0].data;
        const ultimaData = hist[hist.length - 1].data;
        
        let somaFC = 0,
            somaFR = 0,
            somaTemp = 0,
            somaSatO2 = 0;
        let countFC = 0,
            countFR = 0,
            countTemp = 0,
            countSatO2 = 0;
        hist.forEach(h => {
            if (h.fc && h.fc !== "" && !isNaN(parseFloat(h.fc))) { somaFC += parseFloat(h.fc);
                countFC++; }
            if (h.fr && h.fr !== "" && !isNaN(parseFloat(h.fr))) { somaFR += parseFloat(h.fr);
                countFR++; }
            if (h.temp && h.temp !== "" && !isNaN(parseFloat(h.temp))) { somaTemp += parseFloat(h.temp);
                countTemp++; }
            if (h.sato2 && h.sato2 !== "" && !isNaN(parseFloat(h.sato2))) { somaSatO2 += parseFloat(h.sato2);
                countSatO2++; }
        });
        const mediaFC = countFC > 0 ? (somaFC / countFC).toFixed(0) : "-";
        const mediaFR = countFR > 0 ? (somaFR / countFR).toFixed(0) : "-";
        const mediaTemp = countTemp > 0 ? (somaTemp / countTemp).toFixed(1) : "-";
        const mediaSatO2 = countSatO2 > 0 ? (somaSatO2 / countSatO2).toFixed(0) : "-";
        
        let alertas = { fc: 0, fr: 0, temp: 0, sato2: 0, ta: 0 };
        hist.forEach(registro => {
            if (registro.fc && !isNaN(parseFloat(registro.fc))) {
                let fc = parseFloat(registro.fc);
                if (fc < ref.fc[0] || fc > ref.fc[1]) alertas.fc++;
            }
            if (registro.fr && !isNaN(parseFloat(registro.fr))) {
                let fr = parseFloat(registro.fr);
                if (fr < ref.fr[0] || fr > ref.fr[1]) alertas.fr++;
            }
            if (registro.temp && !isNaN(parseFloat(registro.temp))) {
                let temp = parseFloat(registro.temp);
                if (temp < ref.temp.ref[0] || temp > ref.temp.ref[1]) alertas.temp++;
            }
            if (registro.sato2 && !isNaN(parseFloat(registro.sato2))) {
                let sato2 = parseFloat(registro.sato2);
                if (sato2 < ref.sato2[0]) alertas.sato2++;
            }
            if ((registro.sis && registro.sis !== "") || (registro.dia && registro.dia !== "")) {
                let sisOk = true,
                    diaOk = true;
                if (registro.sis && !isNaN(parseFloat(registro.sis))) {
                    let sis = parseFloat(registro.sis);
                    if (sis < ref.sis[0] || sis > ref.sis[1]) sisOk = false;
                }
                if (registro.dia && !isNaN(parseFloat(registro.dia))) {
                    let dia = parseFloat(registro.dia);
                    if (dia < ref.dia[0] || dia > ref.dia[1]) diaOk = false;
                }
                if (!sisOk || !diaOk) alertas.ta++;
            }
        });
        
        const nomeFaixa = faixasMap[faixaRef] || faixaRef;
        const usarDias = totalDias > 1;
        const labels = hist.map(h => {
            if (usarDias) {
                const partes = h.data.split('/');
                return partes.length === 3 ? `${partes[0]}/${partes[1]}` : h.data;
            }
            return h.hora.substring(0, 5);
        });
        const limiteLabels = hist.length > 12 ? 8 : (hist.length > 6 ? 6 : hist.length);
        
        // Gráfico para PDF
        const canvasTemp = document.createElement('canvas');
        canvasTemp.width = 1200;
        canvasTemp.height = 600;
        canvasTemp.style.cssText = 'position:fixed;left:0;top:0;z-index:-1;opacity:0;pointer-events:none';
        document.body.appendChild(canvasTemp);
        
        const ctx = canvasTemp.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasTemp.width, canvasTemp.height);
        if (window.chartPDF) { try { window.chartPDF.destroy(); } catch (e) {} }
        
        window.chartPDF = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'FC', data: hist.map(h => h.fc && !isNaN(parseFloat(h.fc)) ? parseFloat(h.fc) : null), borderColor: '#00843d', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#00843d', spanGaps: true },
                    { label: 'FR', data: hist.map(h => h.fr && !isNaN(parseFloat(h.fr)) ? parseFloat(h.fr) : null), borderColor: '#2196F3', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#2196F3', spanGaps: true },
                    { label: 'Temp', data: hist.map(h => h.temp && !isNaN(parseFloat(h.temp)) ? parseFloat(h.temp) : null), borderColor: '#FF9800', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#FF9800', spanGaps: true },
                    { label: 'SatO2', data: hist.map(h => h.sato2 && !isNaN(parseFloat(h.sato2)) ? parseFloat(h.sato2) : null), borderColor: '#9C27B0', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#9C27B0', spanGaps: true },
                    { label: 'Sistólica', data: hist.map(h => h.sis && !isNaN(parseFloat(h.sis)) ? parseFloat(h.sis) : null), borderColor: '#f44336', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#f44336', spanGaps: true },
                    { label: 'Diastólica', data: hist.map(h => h.dia && !isNaN(parseFloat(h.dia)) ? parseFloat(h.dia) : null), borderColor: '#E91E63', backgroundColor: 'transparent', borderDash: [8, 5], tension: 0.3, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#E91E63', spanGaps: true }
                ]
            },
            options: {
                responsive: false,
                animation: false,
                maintainAspectRatio: true,
                plugins: { tooltip: { enabled: false }, legend: { position: 'bottom', labels: { boxWidth: 16, font: { size: 14, weight: 'bold' }, padding: 14 } } },
                scales: {
                    x: { grid: { display: true, drawBorder: true, color: '#cccccc', borderDash: [6, 4], lineWidth: 0.5 }, ticks: { font: { size: 13, weight: 'bold' }, maxRotation: 0, autoSkip: true, maxTicksLimit: limiteLabels, autoSkipPadding: 15 }, title: { display: true, text: usarDias ? 'Data da Medição' : 'Horário da Medição', font: { size: 14, weight: 'bold' }, padding: 12 } },
                    y: { grid: { display: true, drawBorder: true, color: '#cccccc', borderDash: [6, 4], lineWidth: 0.5 }, ticks: { font: { size: 13, weight: 'bold' }, stepSize: 20 }, title: { display: true, text: 'Valores', font: { size: 14, weight: 'bold' }, padding: 12 } }
                },
                layout: { padding: { top: 20, bottom: 20, left: 15, right: 15 } }
            }
        });
        await new Promise(resolve => setTimeout(resolve, 800));
        const imgGrafico = canvasTemp.toDataURL('image/png');
        if (window.chartPDF) window.chartPDF.destroy();
        document.body.removeChild(canvasTemp);
        
        // Página 1
        doc.setFillColor(0, 132, 61);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("RELATÓRIO DE MONITORIZAÇÃO", 15, 20);
        doc.setFontSize(10);
        doc.text("MatClínica - Sinais Vitais", 15, 28);
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(12);
        doc.text(`PACIENTE: ${pacienteAtivo.toUpperCase()}`, 15, 52);
        doc.setFontSize(10);
        doc.text(`Perfil: ${nomeFaixa}`, 15, 58);
        doc.text(`Referência: ${fonteNome}`, 15, 64);
        doc.text(`Data de emissão: ${new Date().toLocaleDateString()}`, 15, 70);
        doc.addImage(imgGrafico, 'PNG', 15, 78, 180, 80);
        
        // Resumo
        const inicioResumoY = 170;
        doc.setFillColor(248, 248, 248);
        doc.setDrawColor(0, 132, 61);
        doc.setLineWidth(0.5);
        doc.rect(15, inicioResumoY, 180, 85, 'FD');
        doc.setFontSize(11);
        doc.setTextColor(0, 132, 61);
        doc.setFont('helvetica', 'bold');
        doc.text("RESUMO DA MONITORIZAÇÃO", 20, inicioResumoY + 8);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, inicioResumoY + 12, 190, inicioResumoY + 12);
        doc.setFontSize(8.5);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        let yPosResumo = inicioResumoY + 20;
        doc.text(`• Vezes de medições: ${totalMedicoes}`, 20, yPosResumo);
        yPosResumo += 5.5;
        doc.text(`• Dias de medições: ${totalDias}`, 20, yPosResumo);
        yPosResumo += 5.5;
        doc.text(`• Período: ${primeiraData} - ${ultimaData}`, 20, yPosResumo);
        yPosResumo += 5.5;
        doc.text(`• Média da FC: ${mediaFC} bpm`, 20, yPosResumo);
        yPosResumo += 5.5;
        doc.text(`• Média da FR: ${mediaFR} ipm`, 20, yPosResumo);
        yPosResumo += 5.5;
        doc.text(`• Média da Temperatura: ${mediaTemp} °C`, 20, yPosResumo);
        yPosResumo += 5.5;
        doc.text(`• Média da SatO2: ${mediaSatO2}%`, 20, yPosResumo);
        yPosResumo += 6;
        doc.setFont('helvetica', 'bold');
        doc.text("• Anormalidades:", 20, yPosResumo);
        yPosResumo += 4.5;
        doc.setFont('helvetica', 'normal');
        doc.text(`   - FC: ${alertas.fc}`, 25, yPosResumo);
        yPosResumo += 4.5;
        doc.text(`   - FR: ${alertas.fr}`, 25, yPosResumo);
        yPosResumo += 4.5;
        doc.text(`   - SatO2: ${alertas.sato2}`, 25, yPosResumo);
        yPosResumo += 4.5;
        doc.text(`   - Temperatura: ${alertas.temp}`, 25, yPosResumo);
        yPosResumo += 4.5;
        doc.text(`   - Tensão Arterial: ${alertas.ta}`, 25, yPosResumo);
        
        // Tabela
        doc.addPage();
        doc.autoTable({
            startY: 20,
            head: [
                ['Data/Hora', 'FC (bpm)', 'FR (ipm)', 'Temp (°C)', 'SatO2 (%)', 'Sistólica (mmHg)', 'Diastólica (mmHg)']
            ],
            body: hist.map(r => [`${r.data} ${r.hora}`, r.fc || "-", r.fr || "-", r.temp || "-", r.sato2 || "-", r.sis || "-", r.dia || "-"]),
            headStyles: { fillColor: [0, 132, 61] },
            theme: 'striped',
            margin: { bottom: 30 },
            pageBreak: 'auto',
            showHead: 'everyPage'
        });
        
        // Rodapé
        const ultimaPagina = doc.internal.getNumberOfPages();
        doc.setPage(ultimaPagina);
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setDrawColor(0, 132, 61);
        doc.setLineWidth(0.8);
        doc.line(30, finalY, 180, finalY);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text("MatClínica — Sistema de Suporte à Decisão Clínica", 105, finalY + 8, { align: 'center' });
        doc.text("Documento gerado automaticamente. Para uso exclusivo do profissional de saúde.", 105, finalY + 14, { align: 'center' });
        doc.text(`Referência: ${fonteNome}`, 105, finalY + 20, { align: 'center' });
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("Este documento não substitui a avaliação clínica de um profissional de saúde qualificado.", 105, finalY + 26, { align: 'center' });
        
        const nomeFicheiro = `Relatorio_${pacienteAtivo}.pdf`;
        const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();
        if (isCapacitor) {
            const { Filesystem } = window.Capacitor.Plugins;
            const pdfDataUri = doc.output('datauristring');
            const pdfBase64 = pdfDataUri.split(',')[1];
            await Filesystem.writeFile({ path: nomeFicheiro, data: pdfBase64, directory: 'DOCUMENTS', recursive: true });
            alert("✅ PDF gerado e guardado com sucesso na pasta Documentos!");
        } else {
            doc.save(nomeFicheiro);
            alert("✅ PDF gerado com sucesso!");
        }
    } catch (erro) {
        console.error("Erro ao exportar PDF:", erro);
        alert("Não foi possível gerar o PDF: " + erro.message);
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

// ============================================================================
// SECÇÃO 15: INICIALIZAÇÃO E EVENTOS
// ============================================================================

window.addEventListener('load', () => {
    renderListaNomes();
    
    const pageId = window.location.pathname.split('/').slice(-2, -1)[0] || 'raiz';
    const salvo = sessionStorage.getItem(`matclinica_${pageId}`);
    let temEstadoRestaurado = false;
    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            if (parsed._fonteAtual || parsed._faixaAtual || parsed._fonteSidebarAtual || parsed._faixaSidebarAtual) {
                temEstadoRestaurado = true;
            }
        } catch (e) {}
    }
    
    if (!temEstadoRestaurado) {
        inicializarSelects();
        inicializarSelectsSidebar();
    }
    
    // Temperatura - Axilar como padrão
    const opcaoPadraoTemp = document.querySelector('#tempLocalOptions .custom-select-option-temp[data-value="axilar"]');
    if (opcaoPadraoTemp) {
        opcaoPadraoTemp.classList.add('selecionado');
        const localSelecionado = document.getElementById('tempLocalSelecionado');
        if (localSelecionado) localSelecionado.innerHTML = 'Axilar';
    }
    localTempAtual = 'axilar';
    
    resetarGrafico();
    carregarGraficoPaciente();
    
    if (localStorage.getItem('tema') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'ri-sun-line';
    }
    
    renderizarCardResultados();
});

// Evento para fechar sidebar ao clicar fora
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnPacientes = document.querySelector('.btn-abrir-menu');
    if (!sidebar || !sidebar.classList.contains('active')) return;
    
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnBtnPacientes = btnPacientes && btnPacientes.contains(event.target);
    const isClickOnOverlay = overlay && overlay.contains(event.target);
    if (!isClickInsideSidebar && !isClickOnBtnPacientes && !isClickOnOverlay) {
        fecharSidebar();
    }
});

// Toggle de triagem
document.addEventListener('change', function(event) {
    if (event.target.id === 'toggle-triagem') {
        const toggle = event.target;
        requestAnimationFrame(() => {
            if (toggle.checked) {
                console.log('🔄 Triagem ATIVADA - Ordenando por gravidade');
                ordenarListaPorTriagem();
            } else {
                console.log('🔄 Triagem DESATIVADA - Restaurando ordem original');
                renderListaNomes();
            }
        });
    }
});

// Fechar selects ao clicar fora
document.addEventListener('click', function(event) {
    // Fonte principal
    const fonteSelect = document.getElementById('fonteSelect');
    if (fonteSelect && !fonteSelect.contains(event.target)) {
        document.getElementById('fonteOptions')?.classList.remove('aberto');
        document.querySelector('#fonteSelect .custom-select-trigger')?.classList.remove('aberto');
    }
    // Faixa principal
    const faixaSelect = document.getElementById('faixaSelect');
    if (faixaSelect && !faixaSelect.contains(event.target)) {
        document.getElementById('faixaOptions')?.classList.remove('aberto');
        document.querySelector('#faixaSelect .custom-select-trigger')?.classList.remove('aberto');
    }
    // Fonte sidebar
    const fonteSidebar = document.getElementById('fonteSelectSidebar');
    if (fonteSidebar && !fonteSidebar.contains(event.target)) {
        document.getElementById('fonteOptionsSidebar')?.classList.remove('aberto');
        document.querySelector('#fonteSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
    }
    // Faixa sidebar
    const faixaSidebar = document.getElementById('faixaSelectSidebar');
    if (faixaSidebar && !faixaSidebar.contains(event.target)) {
        document.getElementById('faixaOptionsSidebar')?.classList.remove('aberto');
        document.querySelector('#faixaSelectSidebar .custom-select-trigger-sidebar')?.classList.remove('aberto');
    }
    // Temperatura local
    const tempSelect = document.getElementById('tempLocalSelect');
    if (tempSelect && !tempSelect.contains(event.target)) {
        document.getElementById('tempLocalOptions')?.classList.remove('aberto');
        document.querySelector('#tempLocalSelect .custom-select-trigger-temp')?.classList.remove('aberto');
    }
});

// ============================================================================
// FIM DO SCRIPT
// ============================================================================