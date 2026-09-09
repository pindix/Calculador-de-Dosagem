/* ==========================================================================
   MPINDI TECMED — script.js completo
   ========================================================================== */

/* ---- 1. TEMA ---- */
const body = document.body;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const concentracaoWrapper = document.getElementById('concentracaoWrapper');

themeBtn.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-theme');
        themeIcon.className = 'ri-moon-line';
        localStorage.setItem('tema', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'ri-sun-line';
        localStorage.setItem('tema', 'dark');
    }
});

function formatarNumero(valor) {
    const num = parseFloat(valor);
    if (isNaN(num)) return valor;
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2);
}

/* ---- 2. CONSTANTES DE SEGURANÇA ---- */
const PESO_MIN_PLAUSIVEL = 0.3;
const PESO_MAX_PLAUSIVEL = 300;
const IDADE_MAX_PLAUSIVEL_ANOS = 120;
const IDADE_TETO_PEDIATRICO_ANOS = 18;
const REF_PESO_ADULTO_MIN = 49;
const MAX_NOTAS_VISIVEIS = 5;

const DIAS_POR_UNIDADE = {
    'dia': 1, 'dias': 1, 'semana': 7, 'semanas': 7,
    'mes': 30, 'meses': 30, 'mês': 30, 'méses': 30,
    'ano': 365, 'anos': 365,
};
const FATORES_MASSA_PARA_MG = {
    'mg': 1, 'g': 1000, 'mcg': 0.001, 'µg': 0.001, 'ug': 0.001, 'kg': 1000000,
};

/* ---- 3. ESTADO GLOBAL ---- */
let bancoDados = {};
let medAtivo = null;
let fonteAtual = 'msf';

const ROTULOS_FONTE = { msf: 'Médicos Sem Fronteira', oms: 'OMS (Internacional)', angola: 'Angola' };
const ICONES_FONTE = { msf: 'ri-earth-line', oms: 'ri-earth-line', angola: 'ri-government-line' };

const inputNome = document.getElementById("nome");
const divSugestoes = document.getElementById("sugestoes_box");
const pResultado = document.getElementById("resultado");
const notaFallback = document.getElementById("notaFallbackReferencia");

const inputs = {
    peso: document.getElementById("peso"),
    idade: document.getElementById("idade"),
    dosagem: document.getElementById("dosagem"),
    dosagemManutencao: document.getElementById("dosagem_manutencao"),
};

const parPesoIdade = document.getElementById("parPesoIdade");
const parDose = document.getElementById("parDose");
const campoPeso = document.getElementById("campo_de_peso");
const campoIdade = document.getElementById("campo_de_idade");
const campoDosagem = document.getElementById("campo_de_dosagem");
const campoDosagemManutencao = document.getElementById("campo_de_dosagem_manutencao");
const labelDosagem = document.getElementById("label_dosagem");
const txtUnidadeDosagem = document.getElementById("unidade_de_dosagem");
const txtUnidadeDosagemManutencao = document.getElementById("unidade_de_dosagem_manutencao");

const linhaSecundaria = document.getElementById("linhaSecundaria");
const linhaIntervaloDuplo = document.getElementById("linhaIntervaloDuplo");
const selConcentracao = document.getElementById("selConcentracao");

/* ---- 4. INTERPRETAÇÃO DE PESO/IDADE (operadores + unidades por extenso) ---- */
function interpretarLadoNumerico(strBruta) {
    const s = (strBruta || '').trim();
    if (s === '') return null;
    let inclusivo = true, numStr = s;
    if (s.startsWith('>=')) { numStr = s.slice(2); inclusivo = true; }
    else if (s.startsWith('<=')) { numStr = s.slice(2); inclusivo = true; }
    else if (s.startsWith('>')) { numStr = s.slice(1); inclusivo = false; }
    else if (s.startsWith('<')) { numStr = s.slice(1); inclusivo = false; }
    const valor = parseFloat(numStr.trim().replace(',', '.'));
    if (isNaN(valor)) return null;
    return { valor, inclusivo };
}

function interpretarLadoIdade(strBruta) {
    const s = (strBruta || '').trim();
    if (s === '') return null;
    let inclusivo = true, resto = s;
    if (s.startsWith('>=')) { resto = s.slice(2); inclusivo = true; }
    else if (s.startsWith('<=')) { resto = s.slice(2); inclusivo = true; }
    else if (s.startsWith('>')) { resto = s.slice(1); inclusivo = false; }
    else if (s.startsWith('<')) { resto = s.slice(1); inclusivo = false; }
    resto = resto.trim();
    const m = resto.match(/^([\d.,]+)\s*([a-zçãéêú]+)$/i);
    if (!m) return null;
    const numero = parseFloat(m[1].replace(',', '.'));
    const unidade = m[2].toLowerCase();
    const fatorDias = DIAS_POR_UNIDADE[unidade];
    if (fatorDias === undefined || isNaN(numero)) return null;
    return { valorEmDias: numero * fatorDias, inclusivo, textoOriginal: resto };
}

function resolverFaixaPeso(textoColuna) {
    const lados = (textoColuna || '').split(';').map(s => s.trim());
    let min = -Infinity, max = Infinity, minInclusive = true, maxInclusive = true;
    if (lados.length === 1 && lados[0] !== '') {
        const lado = interpretarLadoNumerico(lados[0]);
        if (lado) {
            if (lados[0].startsWith('<')) { max = lado.valor; maxInclusive = lado.inclusivo; }
            else if (lados[0].startsWith('>')) { min = lado.valor; minInclusive = lado.inclusivo; }
            else { min = max = lado.valor; }
        }
    } else if (lados.length >= 2) {
        const ladoMin = interpretarLadoNumerico(lados[0]);
        const ladoMax = interpretarLadoNumerico(lados[1]);
        if (ladoMin) { min = ladoMin.valor; minInclusive = ladoMin.inclusivo; }
        if (ladoMax) { max = ladoMax.valor; maxInclusive = ladoMax.inclusivo; }
    }
    return { min, max, minInclusive, maxInclusive };
}

function resolverFaixaIdade(textoColuna) {
    const lados = (textoColuna || '').split(';').map(s => s.trim());
    let min = -Infinity, max = Infinity, minInclusive = true, maxInclusive = true;
    let minTexto = null, maxTexto = null;
    if (lados.length === 1 && lados[0] !== '') {
        const lado = interpretarLadoIdade(lados[0]);
        if (lado) {
            if (lados[0].startsWith('<')) { max = lado.valorEmDias; maxInclusive = lado.inclusivo; maxTexto = lado.textoOriginal; }
            else if (lados[0].startsWith('>')) { min = lado.valorEmDias; minInclusive = lado.inclusivo; minTexto = lado.textoOriginal; }
            else { min = max = lado.valorEmDias; minTexto = maxTexto = lado.textoOriginal; }
        }
    } else if (lados.length >= 2) {
        const ladoMin = interpretarLadoIdade(lados[0]);
        const ladoMax = interpretarLadoIdade(lados[1]);
        if (ladoMin) { min = ladoMin.valorEmDias; minInclusive = ladoMin.inclusivo; minTexto = ladoMin.textoOriginal; }
        if (ladoMax) { max = ladoMax.valorEmDias; maxInclusive = ladoMax.inclusivo; maxTexto = ladoMax.textoOriginal; }
    }
    return { min, max, minInclusive, maxInclusive, minTexto, maxTexto };
}

function dentroDaFaixa(valor, faixa) {
    const minOK = faixa.minInclusive ? valor >= faixa.min : valor > faixa.min;
    const maxOK = faixa.maxInclusive ? valor <= faixa.max : valor < faixa.max;
    return minOK && maxOK;
}

/* ---- 5. DOSE/INTERVALO COM ATAQUE+MANUTENÇÃO ---- */
function temAtaqueManutencao(texto) {
    return /ataque\(/i.test(texto || '') || /manutencao\(/i.test(texto || '');
}
function extrairBlocoAtaqueManutencao(texto, chave) {
    const regex = new RegExp(chave + '\\(([^)]*)\\)', 'i');
    const m = (texto || '').match(regex);
    return m ? m[1].trim() : '';
}
function interpretarDoseOuIntervalo(texto) {
    if (!texto || texto.trim() === '') return { simples: '' };
    if (!temAtaqueManutencao(texto)) return { simples: texto.trim() };
    let ataque = extrairBlocoAtaqueManutencao(texto, 'ataque');
    let manutencao = extrairBlocoAtaqueManutencao(texto, 'manutencao');
    if (ataque === '' && manutencao !== '') ataque = manutencao;
    if (manutencao === '' && ataque !== '') manutencao = ataque;
    return { ataque, manutencao, temDuasFases: ataque !== manutencao };
}

/* ---- 6. CONVERSÃO DE UNIDADE DE DOSE PARA mg ---- */
function unidadeBase(unidadeTexto) {
    return (unidadeTexto || '').toLowerCase().trim().split('/')[0].trim();
}
function converterParaMg(valor, unidadeTexto, concentracaoTexto, fatorUnidadeTexto) {
    const base = unidadeBase(unidadeTexto);
    if (FATORES_MASSA_PARA_MG.hasOwnProperty(base)) return valor * FATORES_MASSA_PARA_MG[base];
    const concentracaoTemMesmaUnidade = base && String(concentracaoTexto || '').toLowerCase().includes(base);
    if (concentracaoTemMesmaUnidade) return valor;
    if (fatorUnidadeTexto) {
        const texto = String(fatorUnidadeTexto).replace(',', '.').trim();
        const m = texto.match(/^([\d.]+)\s*([a-zµ]+)$/i);
        if (m) {
            const valorPorUnidade = parseFloat(m[1]);
            const unidadeResultante = m[2].toLowerCase();
            const fatorParaMg = FATORES_MASSA_PARA_MG[unidadeResultante];
            if (fatorParaMg !== undefined && !isNaN(valorPorUnidade)) return valor * valorPorUnidade * fatorParaMg;
        }
    }
    return null;
}

/* ---- 7. MOTOR DE DADOS — 12 colunas ---- */
function formatarFolha(sheet) {
    const matriz = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const indexCabecalho = matriz.findIndex(linha => linha[0] && String(linha[0]).toLowerCase().trim() === "nome");
    if (indexCabecalho === -1) return [];
    const apenasDados = matriz.slice(indexCabecalho);
    const cabecalho = apenasDados[0].map(c => String(c).toLowerCase().trim());
    return apenasDados.slice(1).map(linha => {
        let obj = {};
        cabecalho.forEach((col, i) => {
            let valor = linha[i] !== undefined ? linha[i] : "";
            obj[col] = (col === "nome" && String(valor).includes("|"))
                ? String(valor).split("|").map(s => s.trim())
                : valor;
        });
        return obj;
    });
}

async function carregarDados() {
    try {
        const response = await fetch('medicamentos.xlsx?v=' + Math.random());
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data);
        bancoDados = {};
        workbook.SheetNames.forEach(nome => {
            bancoDados[nome.toLowerCase().trim()] = formatarFolha(workbook.Sheets[nome]);
        });
        console.log("✅ Base de dados pronta.");
    } catch (e) {
        console.error("❌ Erro ao carregar Excel:", e);
    }
}

function nomeCorresponde(med, nomeBusca) {
    if (Array.isArray(med.nome)) return med.nome.some(n => n.toLowerCase().trim() === nomeBusca);
    return med.nome && String(med.nome).toLowerCase().trim() === nomeBusca;
}

/* ---- 8. CUSTOM SELECT — genérico, para via/intervalo/população/condição/etc ---- */
function toggleCustomSelect(id) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const options = wrapper.querySelector('.custom-select-options');
    const estavaAberto = options.classList.contains('aberto');
    fecharTodosCustomSelects();
    if (!estavaAberto) { options.classList.add('aberto'); trigger.classList.add('aberto'); }
}

function fecharTodosCustomSelects() {
    document.querySelectorAll('.custom-select-options.aberto').forEach(o => o.classList.remove('aberto'));
    document.querySelectorAll('.custom-select-trigger.aberto').forEach(t => t.classList.remove('aberto'));
    document.querySelectorAll('.custom-select-options-temp.aberto').forEach(o => o.classList.remove('aberto'));
    document.querySelectorAll('.custom-select-trigger-temp.aberto').forEach(t => t.classList.remove('aberto'));
}

// Clicar fora de qualquer select customizado fecha o que estiver aberto
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select') && !e.target.closest('.custom-select-temp-local')) {
        fecharTodosCustomSelects();
    }
});

function popularCustomSelect(prefixo, opcoes, onSelect) {
    const wrapper = document.getElementById(prefixo + 'Select');
    const span = document.getElementById(prefixo + 'Selecionada');
    const optionsDiv = document.getElementById(prefixo + 'Options');
    if (!wrapper || !span || !optionsDiv) return;

    optionsDiv.innerHTML = '';
    let valorAtual = wrapper.dataset.valorAtual;
    if (!opcoes.some(o => o.valor === valorAtual)) valorAtual = opcoes[0] ? opcoes[0].valor : '';

    opcoes.forEach(op => {
        const div = document.createElement('div');
        div.className = 'custom-select-option' + (op.valor === valorAtual ? ' selecionado' : '');
        div.dataset.value = op.valor;
        div.innerHTML = `${op.icone ? `<i class="${op.icone}"></i>` : ''}<div class="option-content"><span class="option-titulo">${op.texto}</span></div>`;
        div.onclick = () => {
            optionsDiv.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selecionado'));
            div.classList.add('selecionado');
            span.textContent = op.texto;
            wrapper.dataset.valorAtual = op.valor;
            fecharTodosCustomSelects();
            if (onSelect) onSelect(op.valor);
        };
        optionsDiv.appendChild(div);
    });

    const opSel = opcoes.find(o => o.valor === valorAtual);
    span.textContent = opSel ? opSel.texto : '—';
    wrapper.dataset.valorAtual = valorAtual || '';
}

function valorCustomSelect(prefixo) {
    const wrapper = document.getElementById(prefixo + 'Select');
    return wrapper ? (wrapper.dataset.valorAtual || '') : '';
}

/* ---- 9. FONTE (referência) — msf/oms/angola ---- */
function selecionarFonte(valor) {
    if (fonteAtual === valor) { fecharTodosCustomSelects(); return; }
    
    // Mostra feedback de carregamento
    const nomeFonte = ROTULOS_FONTE[valor] || valor;
    pResultado.innerHTML = `<div class="feedback-loading"><i class="ri-loader-4-line"></i><span>Carregando padrões da <strong>${nomeFonte}</strong>...</span></div>`;
    pResultado.style.background = "none";
    pResultado.style.display = "block";
    
    // Atualiza a fonte após o feedback
    setTimeout(() => {
        fonteAtual = valor;
        document.getElementById('fonteSelecionada').innerHTML =
            `<i class="${ICONES_FONTE[valor] || 'ri-earth-line'}"></i> ${ROTULOS_FONTE[valor] || valor}`;
        document.querySelectorAll('#fonteOptions .custom-select-option').forEach(opt => {
            opt.classList.toggle('selecionado', opt.dataset.value === valor);
        });
        fecharTodosCustomSelects();
        localStorage.setItem('fonte', valor);
        notaFallback.style.display = 'none';
        
        // Mostra sucesso
        pResultado.innerHTML = `<div class="feedback-success"><i class="ri-checkbox-circle-line"></i><span>Padrões da <strong>${nomeFonte}</strong> carregados com sucesso!</span></div>`;
        
        // Limpa os campos
        inputNome.value = "";
        inputs.peso.value = "";
        inputs.idade.value = "";
        inputs.dosagem.value = "";
        inputs.dosagemManutencao.value = "";
        medAtivo = null;
        exibirCampos();
        
        // Esconde o feedback após 2 segundos
        setTimeout(() => {
            pResultado.innerHTML = "";
            pResultado.style.display = "none";
        }, 2000);
    }, 300);
}







/* ---- 10. UNIDADE DE IDADE ---- */
function toggleTempLocalSelect(event) {
    event.stopPropagation();
    const wrapper = document.getElementById('tempLocalSelect');
    const trigger = wrapper.querySelector('.custom-select-trigger-temp');
    const options = wrapper.querySelector('.custom-select-options-temp');
    const estavaAberto = options.classList.contains('aberto');
    fecharTodosCustomSelects();
    if (!estavaAberto) { options.classList.add('aberto'); trigger.classList.add('aberto'); }
}

function selecionarUnidadeIdade(valor, event) {
    event.stopPropagation();
    const rotulos = { '365': 'anos', '30': 'meses', '7': 'semanas', '1': 'dias' };
    document.getElementById('tempLocalSelecionado').textContent = rotulos[valor] || valor;
    document.getElementById('tempLocalSelect').dataset.valorAtual = valor;
    document.querySelectorAll('#tempLocalOptions .custom-select-option-temp').forEach(o => {
        o.classList.toggle('selecionado', o.dataset.value === valor);
    });
    fecharTodosCustomSelects();
    if (inputNome.value.trim() !== "") { escolherLinha('ajuste'); exibirCampos(); }
}
document.getElementById('tempLocalSelect').dataset.valorAtual = '365';

/* ---- FIM DA PARTE 1 ---- */


/* ==========================================================================
   PARTE 2 — sugestões, escolherLinha (com fallback multi-fonte),
   exibirCampos (disposição), modal, calcular(), notas com "ver mais"
   ========================================================================== */

/* ---- 11. SUGESTÕES ---- */
function gerirSugestoes() {
    const termo = inputNome.value.trim().toLowerCase();
    if (!termo) { 
        divSugestoes.style.display = "none"; 
        divSugestoes.innerHTML = ""; 
        return; 
    }

    // Recolhe nomes de TODAS as fontes carregadas
    const todosNomes = [];
    Object.keys(bancoDados).forEach(fonte => {
        const base = bancoDados[fonte] || [];
        base.forEach(m => {
            if (Array.isArray(m.nome)) {
                m.nome.forEach(n => {
                    if (n.toLowerCase().includes(termo)) {
                        todosNomes.push({
                            nome: n,
                            fonte: fonte
                        });
                    }
                });
            } else if (m.nome && String(m.nome).toLowerCase().includes(termo)) {
                todosNomes.push({
                    nome: String(m.nome).trim(),
                    fonte: fonte
                });
            }
        });
    });

    // Remove duplicados (mesmo nome, mesma fonte)
    const vistos = new Set();
    const nomesUnicos = [];
    todosNomes.forEach(item => {
        const chave = `${item.nome.toLowerCase()}|${item.fonte}`;
        if (!vistos.has(chave)) {
            vistos.add(chave);
            nomesUnicos.push(item);
        }
    });

    // Ordena: primeiro os que começam com o termo
    nomesUnicos.sort((a, b) => {
        const aL = a.nome.toLowerCase();
        const bL = b.nome.toLowerCase();
        const aC = aL.startsWith(termo);
        const bC = bL.startsWith(termo);
        if (aC && !bC) return -1;
        if (!aC && bC) return 1;
        return aL.localeCompare(bL);
    });

    if (nomesUnicos.length === 0) { 
        divSugestoes.style.display = "none"; 
        return; 
    }

    // Separa por fonte
    const daFonteAtual = nomesUnicos.filter(item => item.fonte === fonteAtual);
    const deOutrasFontes = nomesUnicos.filter(item => item.fonte !== fonteAtual);

    divSugestoes.innerHTML = "";
    divSugestoes.style.display = "block";
    
    // Estilo base para cada item
    const estiloItem = `
        padding: 10px 14px;
        cursor: pointer;
        border-radius: 8px;
        transition: background 0.15s ease;
        margin: 2px 0;
    `;

    const estiloItemHover = `
        background: rgba(0, 132, 61, 0.06);
    `;

    // Primeiro: resultados da fonte atual
    daFonteAtual.slice(0, 6).forEach(item => {
        const div = document.createElement("div");
        const nome = item.nome;
        const index = nome.toLowerCase().indexOf(termo);
        const rotuloFonte = ROTULOS_FONTE[item.fonte] || item.fonte;
        
        div.style.cssText = estiloItem;
        div.innerHTML = `
            <div style="font-weight:500;font-size:0.9rem;color:var(--text);line-height:1.4;">
                ${nome.substring(0, index)}<strong>${nome.substring(index, index + termo.length)}</strong>${nome.substring(index + termo.length)}
            </div>
            <div style="font-size:0.6rem;opacity:0.5;color:var(--text);margin-top:2px;">
                Referência: ${rotuloFonte}
            </div>
        `;
        
        div.onmouseenter = () => { div.style.background = 'rgba(0, 132, 61, 0.06)'; };
        div.onmouseleave = () => { div.style.background = 'transparent'; };
        
        div.onclick = () => {
            inputNome.value = nome;
            divSugestoes.style.display = "none";
            escolherLinha('silencioso');
            exibirCampos();
        };
        divSugestoes.appendChild(div);
    });

    // Se houver resultados de outras fontes, adiciona linha divisória
    if (deOutrasFontes.length > 0) {
        const divisor = document.createElement("div");
        divisor.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 4px 6px 4px;
            margin: 4px 0 2px 0;
            font-size: 0.6rem;
            font-weight: 500;
            color: #999;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        `;
        divisor.innerHTML = `
            <span style="flex:1;height:1px;background:rgba(0,0,0,0.08);"></span>
            <span>Outras referências</span>
            <span style="flex:1;height:1px;background:rgba(0,0,0,0.08);"></span>
        `;
        divSugestoes.appendChild(divisor);

        // Depois: resultados de outras fontes (mais desfocados)
        deOutrasFontes.slice(0, 6).forEach(item => {
            const div = document.createElement("div");
            const nome = item.nome;
            const index = nome.toLowerCase().indexOf(termo);
            const rotuloFonte = ROTULOS_FONTE[item.fonte] || item.fonte;
            
            div.style.cssText = estiloItem;
            div.style.opacity = "0.7";
            div.innerHTML = `
                <div style="font-weight:500;font-size:0.85rem;color:var(--text);line-height:1.4;">
                    ${nome.substring(0, index)}<strong>${nome.substring(index, index + termo.length)}</strong>${nome.substring(index + termo.length)}
                </div>
                <div style="font-size:0.55rem;opacity:0.4;color:var(--text);margin-top:2px;">
                    Referência: ${rotuloFonte}
                </div>
            `;
            
            div.onmouseenter = () => { div.style.background = 'rgba(0, 132, 61, 0.04)'; };
            div.onmouseleave = () => { div.style.background = 'transparent'; };
            
            div.onclick = () => {
                inputNome.value = nome;
                divSugestoes.style.display = "none";
                escolherLinha('silencioso');
                exibirCampos();
            };
            divSugestoes.appendChild(div);
        });
    }
}

document.addEventListener('click', (e) => {
    if (!inputNome.contains(e.target) && !divSugestoes.contains(e.target)) divSugestoes.style.display = "none";
});

/* ---- 12. ESCOLHER LINHA — com fallback para qualquer outra fonte que tenha o medicamento ---- */
function escolherLinha(modo) {
    const nome = inputNome.value.trim().toLowerCase();
    if (!nome) { 
        medAtivo = null; 
        notaFallback.style.display = "none"; 
        return; 
    }

    let filtradas = (bancoDados[fonteAtual] || []).filter(m => nomeCorresponde(m, nome));
    notaFallback.style.display = "none";

    if (filtradas.length === 0) {
        // Procura em QUALQUER outra fonte carregada que tenha o medicamento
        const outrasFontesComOMedicamento = Object.keys(bancoDados)
            .filter(f => f !== fonteAtual)
            .filter(f => bancoDados[f].some(m => nomeCorresponde(m, nome)));

        if (outrasFontesComOMedicamento.length > 0) {
            const fonteEncontrada = outrasFontesComOMedicamento[0];
            const fonteAntiga = fonteAtual;
            filtradas = bancoDados[fonteEncontrada].filter(m => nomeCorresponde(m, nome));
            
            // Mostra feedback de mudança de referência
            const rotuloAntigo = ROTULOS_FONTE[fonteAntiga] || fonteAntiga;
            const rotuloNovo = ROTULOS_FONTE[fonteEncontrada] || fonteEncontrada;
            
            // Atualiza a fonte silenciosamente
            fonteAtual = fonteEncontrada;
            
            // Sincroniza o select de fonte visualmente
            const spanFonte = document.getElementById('fonteSelecionada');
            if (spanFonte) spanFonte.innerHTML = `<i class="${ICONES_FONTE[fonteEncontrada] || 'ri-earth-line'}"></i> ${rotuloNovo}`;
            document.querySelectorAll('#fonteOptions .custom-select-option').forEach(opt => {
                opt.classList.toggle('selecionado', opt.dataset.value === fonteEncontrada);
            });
            
            // Mostra a nota de fallback
            notaFallback.innerHTML = `<i class="ri-information-line"></i><span>"${inputNome.value.trim()}" não está disponível para a referência "${rotuloAntigo}". O sistema mudou para a referência "${rotuloNovo}".</span>`;
            notaFallback.style.display = "flex";
            
            // Salva a nova fonte
            localStorage.setItem('fonte', fonteEncontrada);
        }
    }

    if (filtradas.length === 0) { 
        medAtivo = null; 
        return; 
    }

    // Aplica os filtros adicionais (população, via, condição, etc.)
    const populacaoSel = valorCustomSelect('populacao').toLowerCase();
    const viaSel = valorCustomSelect('via').toLowerCase();
    const condicaoSel = valorCustomSelect('condicao').toLowerCase();
    const pesoVal = parseFloat(inputs.peso.value) || 0;
    const idadeVal = parseFloat(inputs.idade.value) || 0;
    const fatorIdade = parseFloat(document.getElementById('tempLocalSelect').dataset.valorAtual) || 365;
    const idadeDias = idadeVal * fatorIdade;

    if (condicaoSel) { 
        const t = filtradas.filter(m => String(m.condicao || "").toLowerCase().trim() === condicaoSel); 
        if (t.length) filtradas = t; 
    }
    if (populacaoSel) { 
        const t = filtradas.filter(m => String(m.populacao || "").toLowerCase().trim() === populacaoSel); 
        if (t.length) filtradas = t; 
    }
    if (viaSel) { 
        const t = filtradas.filter(m => String(m.via || "").toLowerCase().trim() === viaSel); 
        if (t.length) filtradas = t; 
    }
    if (idadeDias > 0) { 
        const t = filtradas.filter(m => dentroDaFaixa(idadeDias, resolverFaixaIdade(m.idade))); 
        if (t.length) filtradas = t; 
    }
    if (pesoVal > 0) { 
        const t = filtradas.filter(m => dentroDaFaixa(pesoVal, resolverFaixaPeso(m.peso))); 
        if (t.length) filtradas = t; 
    }

    medAtivo = filtradas[0];

    if (populacaoSel === 'pediatrica' || (medAtivo && medAtivo.populacao && medAtivo.populacao.toLowerCase() === 'pediatrica')) {
        verificarTetoPediatrico();
    }
}
function verificarTetoPediatrico() {
    if (!inputs.idade.value) return;
    const fatorConversao = parseFloat(document.getElementById('tempLocalSelect').dataset.valorAtual) || 365;
    const idadeEmDias = parseFloat(inputs.idade.value) * fatorConversao;
    if (idadeEmDias > IDADE_TETO_PEDIATRICO_ANOS * 365) {
        avisar(`⚠️ Idade implausível para população pediátrica.<br>
        Inseriste uma idade acima de ${IDADE_TETO_PEDIATRICO_ANOS} anos com "Pediátrica" selecionada.<br>
        <strong>Confirma a idade ou a população escolhida.</strong>`);
    }
}

/* ---- 13. EXIBIR CAMPOS — disposição em pares/linhas partilhadas ---- */
function exibirCampos() {
    if (!medAtivo) {
        inputs.peso.value = ""; inputs.idade.value = "";
        inputs.dosagem.value = ""; inputs.dosagemManutencao.value = "";
        [parPesoIdade, parDose, linhaSecundaria, linhaIntervaloDuplo].forEach(el => el && (el.style.display = "none"));
        ['viaSelect', 'intervaloSelect', 'populacaoSelect', 'condicaoSelect', 'intervaloManutencaoSelect'].forEach(id => {
            const el = document.getElementById(id); if (el) el.style.display = "none";
        });
        if (concentracaoWrapper) concentracaoWrapper.style.display = "none";
        pResultado.innerHTML = "";
        notaFallback.style.display = "none";
        exibirCampos._linhaAnterior = null;
        return;
    }

    const linhaNova = exibirCampos._linhaAnterior !== medAtivo;
    exibirCampos._linhaAnterior = medAtivo;

    parPesoIdade.style.display = "grid";
    campoPeso.style.display = medAtivo.peso ? "flex" : "none";
    campoIdade.style.display = medAtivo.idade ? "flex" : "none";
    parPesoIdade.classList.toggle('par-unico', !(medAtivo.peso && medAtivo.idade));

    // --- DOSE ---
    const dose = interpretarDoseOuIntervalo(medAtivo.dose);
    if (!medAtivo.dose || dose.simples === '') {
        parDose.style.display = "none";
    } else if (dose.simples !== undefined) {
        parDose.style.display = "grid";
        campoDosagem.style.display = "flex";
        campoDosagemManutencao.style.display = "none";
        parDose.classList.add('par-unico');
        labelDosagem.textContent = "Dose";
        const partes = dose.simples.split(',').map(p => p.trim());
        if (linhaNova && !inputs.dosagem.value) inputs.dosagem.value = partes[2] || '';
        txtUnidadeDosagem.innerText = partes[3] || '';
    } else {
        parDose.style.display = "grid";
        campoDosagem.style.display = "flex";
        labelDosagem.textContent = dose.temDuasFases ? "Dose (ataque)" : "Dose";
        const partesAtaque = dose.ataque.split(',').map(p => p.trim());
        if (linhaNova && !inputs.dosagem.value) inputs.dosagem.value = partesAtaque[2] || '';
        txtUnidadeDosagem.innerText = partesAtaque[3] || '';

        if (dose.temDuasFases) {
            campoDosagemManutencao.style.display = "flex";
            parDose.classList.remove('par-unico');
            const partesManut = dose.manutencao.split(',').map(p => p.trim());
            if (linhaNova && !inputs.dosagemManutencao.value) inputs.dosagemManutencao.value = partesManut[2] || '';
            txtUnidadeDosagemManutencao.innerText = partesManut[3] || '';
        } else {
            campoDosagemManutencao.style.display = "none";
            parDose.classList.add('par-unico');
        }
    }

    // --- CONDIÇÃO ---
    const nomeMedicamento = inputNome.value.trim().toLowerCase();
    let baseFiltrada = (bancoDados[fonteAtual] || []).filter(m => nomeCorresponde(m, nomeMedicamento));
    const condicoesUnicas = [...new Set(baseFiltrada.map(m => m.condicao).filter(c => c && String(c).trim() !== ""))];
    const condicaoSelectEl = document.getElementById('condicaoSelect');
    if (condicoesUnicas.length > 1) {
        popularCustomSelect('condicao', condicoesUnicas.map(c => ({ valor: String(c).trim(), texto: String(c).trim(), icone: 'ri-stethoscope-line' })),
            () => { escolherLinha('ajuste'); exibirCampos(); });
        condicaoSelectEl.style.display = "block";
    } else {
        condicaoSelectEl.style.display = "none";
        condicaoSelectEl.dataset.valorAtual = "";
    }

    // --- CONCENTRAÇÃO (select nativo, inalterado) ---
    const concRaw = String(medAtivo.concentracao || "").trim();
    const temMultiplas = concRaw.includes("|") && concRaw.includes(";");
    if (temMultiplas) {
        const assinaturaAtual = selConcentracao.getAttribute("data-assinatura");
        if (concRaw !== assinaturaAtual) {
            selConcentracao.innerHTML = "";
            concRaw.split(";").forEach(g => {
                const pts = g.split("|");
                if (pts.length === 2) {
                    const opt = document.createElement("option");
                    opt.innerText = pts[0].trim(); opt.value = pts[1].trim();
                    selConcentracao.appendChild(opt);
                }
            });
            selConcentracao.setAttribute("data-assinatura", concRaw);
        }
        if (concentracaoWrapper) concentracaoWrapper.style.display = "flex";
        selConcentracao.style.display = "block";
    } else {
        if (concentracaoWrapper) concentracaoWrapper.style.display = "none";
        selConcentracao.style.display = "none";
        selConcentracao.removeAttribute("data-assinatura");
    }

    // --- POPULAÇÃO ---
    const populacoesUnicas = [...new Set(baseFiltrada
        .filter(m => !condicoesUnicas.length || String(m.condicao || "").trim() === String(medAtivo.condicao || "").trim())
        .map(m => m.populacao).filter(p => p && String(p).trim() !== ""))];
    const populacaoSelectEl = document.getElementById('populacaoSelect');
    const rotulosPop = { pediatrica: "Pediátrica", adulta: "Adulta", gravida: "Grávida" };
    const iconesPop = { pediatrica: "ri-emotion-happy-line", adulta: "ri-user-line", gravida: "ri-women-line" };
    if (populacoesUnicas.length > 1) {
        popularCustomSelect('populacao', populacoesUnicas.map(p => {
            const v = String(p).trim().toLowerCase();
            return { valor: v, texto: rotulosPop[v] || v, icone: iconesPop[v] || 'ri-user-line' };
        }), (valor) => { verificarTetoPediatrico(); escolherLinha('ajuste'); exibirCampos(); });
        populacaoSelectEl.style.display = "block";
    } else {
        populacaoSelectEl.style.display = "none";
        populacaoSelectEl.dataset.valorAtual = "";
    }

    // --- VIA ---
    const viasUnicas = [...new Set(baseFiltrada
        .filter(m => !condicoesUnicas.length || String(m.condicao || "").trim() === String(medAtivo.condicao || "").trim())
        .map(m => m.via).filter(v => v && String(v).trim() !== ""))];
    const viaSelectEl = document.getElementById('viaSelect');
    if (viasUnicas.length > 1) {
        popularCustomSelect('via', viasUnicas.map(v => ({ valor: String(v).trim().toLowerCase(), texto: String(v).trim().toUpperCase(), icone: 'ri-syringe-line' })),
            () => { escolherLinha('ajuste'); exibirCampos(); });
        viaSelectEl.style.display = "block";
    } else {
        viaSelectEl.style.display = "none";
        viaSelectEl.dataset.valorAtual = "";
    }

    // --- INTERVALO (ataque/manutenção) ---
    const intervalo = interpretarDoseOuIntervalo(medAtivo.intervalo);
    const intervaloSelectEl = document.getElementById('intervaloSelect');
    const intervaloManutSelectEl = document.getElementById('intervaloManutencaoSelect');

    if (!medAtivo.intervalo || intervalo.simples === '') {
        intervaloSelectEl.style.display = "none";
        linhaIntervaloDuplo.style.display = "none";
    } else if (intervalo.simples !== undefined) {
        const opcoes = gerarOpcoesIntervalo(intervalo.simples);
        linhaIntervaloDuplo.style.display = "none";
        linhaSecundaria.appendChild(intervaloSelectEl); // garante que está na linha partilhada
        if (opcoes.length > 1) {
            popularCustomSelect('intervalo', opcoes, () => calcularSePronto());
            intervaloSelectEl.style.display = "block";
        } else {
            intervaloSelectEl.style.display = "none";
            intervaloSelectEl.dataset.valorAtual = opcoes[0] ? opcoes[0].valor : '';
        }
    } else {
        const opcoesAtaque = gerarOpcoesIntervalo(intervalo.ataque);
        if (intervalo.temDuasFases) {
            const opcoesManut = gerarOpcoesIntervalo(intervalo.manutencao);
            linhaIntervaloDuplo.appendChild(intervaloSelectEl); // move para a linha exclusiva dos dois
            linhaIntervaloDuplo.style.display = "flex";
            popularCustomSelect('intervalo', opcoesAtaque, () => calcularSePronto());
            popularCustomSelect('intervaloManutencao', opcoesManut, () => calcularSePronto());
            intervaloSelectEl.style.display = "block";
            intervaloManutSelectEl.style.display = "block";
            document.getElementById('intervaloSelecionado').parentElement.querySelector('.floating-label').textContent = 'Intervalo (ataque)';
        } else {
            linhaIntervaloDuplo.style.display = "none";
            linhaSecundaria.appendChild(intervaloSelectEl);
            if (opcoesAtaque.length > 1) {
                popularCustomSelect('intervalo', opcoesAtaque, () => calcularSePronto());
                intervaloSelectEl.style.display = "block";
            } else {
                intervaloSelectEl.style.display = "none";
                intervaloSelectEl.dataset.valorAtual = opcoesAtaque[0] ? opcoesAtaque[0].valor : '';
            }
        }
    }

    linhaSecundaria.style.display = "flex";
}

function gerarOpcoesIntervalo(textoIntervalo) {
    const valores = (textoIntervalo || '').split(",").map(h => h.trim()).filter(h => h !== "");
    const valoresUnicos = [...new Set(valores)];
    return valoresUnicos.map(h => {
        const isDoseUnica = h.includes("*") || h.includes("!") || h.includes("u");
        const horasRaw = h.replace(/[\*\!u#]/g, '');
        const horas = parseInt(horasRaw);
        let texto, valor = String(24 / horas);
        if (isDoseUnica) { texto = "Dose única"; valor = "unica"; }
        else if (horas > 24) {
            const dias = horas / 24;
            texto = dias === 2 ? "1 vez/2 dias" : dias === 7 ? "1 vez/semana" : `1 vez/${formatarNumero(dias)} dias`;
        } else if (horas === 24) texto = "1 vez/dia";
        else texto = `${horasRaw}/${horasRaw}h`;
        return { valor: h, texto, icone: 'ri-repeat-line', vezesDia: isDoseUnica ? (24 / (horas || 24)) : (24 / horas), isDoseUnica, horasRaw: horas };
    });
}

/* ---- 14. MODAL ---- */
function avisar(m) {
    const modal = document.getElementById("meuModal");
    const pModal = document.getElementById("modalMensagem");
    document.body.classList.add("modal-aberto");
    if (modal.style.display === "flex") {
        if (pModal.innerHTML.includes(m)) return;
        pModal.insertAdjacentHTML('beforeend', "<hr style='margin:10px 0'>" + m);
    } else {
        pModal.innerHTML = m;
        modal.style.display = "flex";
    }
}
function fecharModal() {
    document.getElementById("meuModal").style.display = "none";
    document.getElementById("modalMensagem").innerHTML = "";
    document.body.classList.remove("modal-aberto");
}

function fraseLimitePeso(faixa) {
    const minF = isFinite(faixa.min) ? `${faixa.minInclusive ? 'maior ou igual a' : 'maior que'} ${formatarNumero(faixa.min)}` : null;
    const maxF = isFinite(faixa.max) ? `${faixa.maxInclusive ? 'menor ou igual a' : 'menor que'} ${formatarNumero(faixa.max)}` : null;
    if (minF && maxF) return `${minF} e ${maxF}`;
    return minF || maxF || 'sem limite definido';
}
function fraseLimiteIdade(faixa) {
    const minF = faixa.minTexto ? `${faixa.minInclusive ? 'maior ou igual a' : 'maior que'} ${faixa.minTexto}` : null;
    const maxF = faixa.maxTexto ? `${faixa.maxInclusive ? 'menor ou igual a' : 'menor que'} ${faixa.maxTexto}` : null;
    if (minF && maxF) return `${minF} e ${maxF}`;
    return minF || maxF || 'sem limite definido';
}

/* ---- 15. CÁLCULO PRINCIPAL ---- */
function calcular() {
    pResultado.classList.remove("vibrar"); void pResultado.offsetWidth; pResultado.classList.add("vibrar");

    if (!medAtivo) {
        pResultado.innerHTML = `<div class="dosagem-erro"><i class="ri-error-warning-fill"></i><span>Medicamento não encontrado!</span></div>`;
        pResultado.style.background = "none"; pResultado.style.display = "block";
        return;
    }

    const idadeTexto = document.getElementById('tempLocalSelecionado').textContent;
    const fatorConversao = parseFloat(document.getElementById('tempLocalSelect').dataset.valorAtual) || 365;
    let peso = parseFloat(inputs.peso.value) || 1;
    let idade = parseFloat(inputs.idade.value) || 1;

    if (inputs.peso.value !== "" && (peso > PESO_MAX_PLAUSIVEL || peso < PESO_MIN_PLAUSIVEL)) {
        avisar(`⚠️ Peso implausível.<br>${peso} kg está fora do intervalo humano realista (entre ${PESO_MIN_PLAUSIVEL} e ${PESO_MAX_PLAUSIVEL} kg).<br><strong>Verifica se não há um erro de digitação.</strong>`);
        return;
    }
    if (inputs.idade.value !== "") {
        const idadeEmDiasCheck = idade * fatorConversao;
        if (idadeEmDiasCheck > IDADE_MAX_PLAUSIVEL_ANOS * 365 || idadeEmDiasCheck < 0) {
            avisar(`⚠️ Idade implausível.<br>${idade} ${idadeTexto} está fora do intervalo humano realista (entre 0 e ${IDADE_MAX_PLAUSIVEL_ANOS} anos).<br><strong>Verifica se não há um erro de digitação.</strong>`);
            return;
        }
    }

    const populacaoAtual = valorCustomSelect('populacao').toLowerCase();
    if (populacaoAtual === 'pediatrica') verificarTetoPediatrico();

    if (medAtivo.peso && inputs.peso.value !== "") {
        const faixa = resolverFaixaPeso(medAtivo.peso);
        if (!dentroDaFaixa(peso, faixa)) {
            const novoPeso = peso < faixa.min ? faixa.min : faixa.max;
            avisar(`⚠️ Peso inválido.<br>O peso tem de ser ${fraseLimitePeso(faixa)} kg.<br><strong>Corrigido para: ${formatarNumero(novoPeso)} kg</strong>`);
            peso = novoPeso; inputs.peso.value = peso;
        }
    }

    if (medAtivo.idade && inputs.idade.value !== "") {
        const faixa = resolverFaixaIdade(medAtivo.idade);
        const idadeEmDias = idade * fatorConversao;
        if (!dentroDaFaixa(idadeEmDias, faixa)) {
            const novaIdadeDias = idadeEmDias < faixa.min ? faixa.min : faixa.max;
            const novaIdade = formatarNumero(novaIdadeDias / fatorConversao);
            avisar(`⚠️ Idade inválida.<br>A idade tem de ser ${fraseLimiteIdade(faixa)}.<br><strong>Corrigida para: ${novaIdade} ${idadeTexto}</strong>`);
            idade = parseFloat(novaIdade); inputs.idade.value = idade;
        }
    }

    let notaReferenciaPeso = null;
    if (populacaoAtual && inputs.peso.value !== "") {
        if (populacaoAtual === 'adulta' && peso < REF_PESO_ADULTO_MIN) {
            notaReferenciaPeso = `Peso baixo para dose adulta (referência interna: adulto > ${REF_PESO_ADULTO_MIN} kg). Pode indicar desnutrição — considera avaliação clínica individual.`;
        } else if (populacaoAtual === 'pediatrica' && peso >= REF_PESO_ADULTO_MIN) {
            notaReferenciaPeso = `Peso alto para dose pediátrica (referência interna: pediátrico ≤ ${REF_PESO_ADULTO_MIN} kg). Confirma se a dose adulta não é mais apropriada.`;
        }
    }

    let concentracao = 1, textoExibido, indiceConcentracao = null;
    if (selConcentracao.style.display !== "none") {
        textoExibido = selConcentracao.options[selConcentracao.selectedIndex].text;
        concentracao = parseFloat(selConcentracao.value) || 1;
        indiceConcentracao = selConcentracao.selectedIndex + 1;
    } else {
        const concStr = String(medAtivo.concentracao || "").trim();
        if (concStr.includes("|")) {
            const pts = concStr.split("|");
            textoExibido = pts[0].trim(); concentracao = parseFloat(pts[1]) || 1;
        } else {
            const matchNumero = concStr.match(/(\d+\.?\d*)/);
            textoExibido = concStr; concentracao = matchNumero ? parseFloat(matchNumero[0]) : 1;
        }
    }

    function validarDose(inputEl, doseString, rotulo) {
        if (!doseString || inputEl.value === "") return;
        const partes = doseString.split(',').map(p => p.trim());
        const minimo = parseFloat(partes[0]), maximo = parseFloat(partes[1]), unidade = partes[3] || '';
        if (isNaN(minimo) || isNaN(maximo)) return;
        const valor = parseFloat(inputEl.value);
        if (valor < minimo || valor > maximo) {
            const novaDose = valor < minimo ? minimo : maximo;
            avisar(`⚠️ Dose${rotulo} inválida.<br>A dose tem de estar entre ${formatarNumero(minimo)} e ${formatarNumero(maximo)} ${unidade}.<br><strong>Corrigida para: ${formatarNumero(novaDose)} ${unidade}</strong>`);
            inputEl.value = novaDose;
        }
    }

    const dose = interpretarDoseOuIntervalo(medAtivo.dose);
    let dAtaqueMg = null, dManutMg = null;
    if (dose.simples !== undefined && dose.simples !== '') {
        validarDose(inputs.dosagem, dose.simples, "");
        const partesDose = dose.simples.split(',').map(p => p.trim());
        const unidade = partesDose[3] || '', fatorUnidade = partesDose[4] || '';
        const valor = parseFloat(inputs.dosagem.value) || 0;
        dAtaqueMg = converterParaMg(valor, unidade, textoExibido, fatorUnidade); if (dAtaqueMg === null) dAtaqueMg = valor;
        dManutMg = dAtaqueMg;
    } else if (dose.ataque !== undefined) {
        validarDose(inputs.dosagem, dose.ataque, " de ataque");
        if (dose.temDuasFases) validarDose(inputs.dosagemManutencao, dose.manutencao, " de manutenção");
        const partesA = dose.ataque.split(',').map(p => p.trim());
        const partesM = dose.manutencao.split(',').map(p => p.trim());
        const unidadeA = partesA[3] || '', fatorA = partesA[4] || '';
        const unidadeM = partesM[3] || '', fatorM = partesM[4] || '';
        const valorA = parseFloat(inputs.dosagem.value) || 0;
        const valorM = dose.temDuasFases ? (parseFloat(inputs.dosagemManutencao.value) || 0) : valorA;
        dAtaqueMg = converterParaMg(valorA, unidadeA, textoExibido, fatorA); if (dAtaqueMg === null) dAtaqueMg = valorA;
        dManutMg = converterParaMg(valorM, unidadeM, textoExibido, fatorM); if (dManutMg === null) dManutMg = valorM;
    }

    const intervalo = interpretarDoseOuIntervalo(medAtivo.intervalo);
    let iAtaque = null, iManut = null;
    const intervaloSelectEl = document.getElementById('intervaloSelect');
    const intervaloManutSelectEl = document.getElementById('intervaloManutencaoSelect');
    const opcoesAtaqueAtuais = gerarOpcoesIntervalo(intervalo.simples !== undefined ? intervalo.simples : intervalo.ataque);
    if (opcoesAtaqueAtuais.length > 0) {
        const valSel = valorCustomSelect('intervalo') || opcoesAtaqueAtuais[0].valor;
        const opSel = opcoesAtaqueAtuais.find(o => o.valor === valSel) || opcoesAtaqueAtuais[0];
        iAtaque = opSel.vezesDia;
        var opcaoIntervaloAtiva = opSel;
    }
    if (intervalo.temDuasFases && intervaloManutSelectEl.style.display !== "none") {
        const opcoesManut = gerarOpcoesIntervalo(intervalo.manutencao);
        const valSelM = valorCustomSelect('intervaloManutencao') || (opcoesManut[0] && opcoesManut[0].valor);
        const opSelM = opcoesManut.find(o => o.valor === valSelM) || opcoesManut[0];
        iManut = opSelM ? opSelM.vezesDia : iAtaque;
    } else {
        iManut = iAtaque;
    }

    try {
        let formulaCompleta = medAtivo.formula
            .replace(/#p/g, peso).replace(/#co/g, textoExibido).replace(/#id/g, idade).replace(/#c/g, concentracao);
        if (dAtaqueMg !== null) {
            formulaCompleta = formulaCompleta.replace(/#d_ataque/g, dAtaqueMg).replace(/#d_manutencao/g, dManutMg).replace(/#d/g, dAtaqueMg);
        }
        if (iAtaque !== null) {
            formulaCompleta = formulaCompleta.replace(/#i_ataque/g, iAtaque).replace(/#i_manutencao/g, iManut).replace(/#i/g, iAtaque);
        }

        const regexCalculo = /{([^}]+)}/g;
        let mlValues = [], match;
        while ((match = regexCalculo.exec(formulaCompleta)) !== null) {
            try { mlValues.push(eval(match[1])); } catch (e) { mlValues.push("Erro"); }
        }

        let resultadoHTML = `<div class="dosagem-container"><div class="dosagem-card">
            <div class="card-header"><div class="card-icon"><i class="ri-medicine-bottle-line"></i></div>
            <div class="card-status"><i class="ri-information-line"></i><span>Resultado</span></div></div>`;

        if (mlValues.length === 1) {
            resultadoHTML += `<div class="dosagem-dose"><div class="dose-valor">
                ${formatarNumero(mlValues[0])} <span class="dose-unidade">mL,</span>
                <span class="dose-unidade-frasco"> frasco: ${textoExibido}</span></div></div>`;
        } else if (mlValues.length >= 2) {
            resultadoHTML += `<div class="dosagem-ataque-manutencao">
                <div class="ataque-item"><i class="ri-flashlight-line"></i><div>
                    <span class="item-label">Dose de ataque</span>
                    <span class="item-valor">${formatarNumero(mlValues[0])} <span class="item-unidade">mL, </span><span class="item-unidade-frasco">frasco: ${textoExibido} </span></span></div></div>
                <div class="manutencao-item"><i class="ri-repeat-line"></i><div>
                    <span class="item-label">Dose de manutenção</span>
                    <span class="item-valor">${formatarNumero(mlValues[1])} <span class="item-unidade">mL, </span><span class="item-unidade-frasco">frasco: ${textoExibido}</span></span></div></div>
            </div>`;
        } else {
            resultadoHTML += `<div class="dosagem-erro-interno"><i class="ri-error-warning-line"></i><span>Nenhuma fórmula de cálculo encontrada</span></div>`;
        }

        let horas = null, mostrarTotais = false;
        if (opcaoIntervaloAtiva && !opcaoIntervaloAtiva.isDoseUnica && opcaoIntervaloAtiva.texto !== "1 vez/dia") {
            const horasNum = opcaoIntervaloAtiva.horasRaw;
            if (horasNum > 24) {
                const dias = horasNum / 24;
                let txt = dias === 2 ? "1 vez a cada 2 dias" : dias === 7 ? "1 vez por semana" : `1 vez a cada ${formatarNumero(dias)} dias`;
                resultadoHTML += `<div class="dosagem-intervalo-texto"><i class="ri-time-line"></i><span>${txt}</span></div>`;
                horas = horasNum; mostrarTotais = false;
            } else if (horasNum !== 24 && horasNum > 0) {
                resultadoHTML += `<div class="dosagem-intervalo-texto"><i class="ri-time-line"></i><span>de ${formatarNumero(horasNum)} em ${formatarNumero(horasNum)} horas</span></div>`;
                horas = horasNum; mostrarTotais = (horasNum < 24);
            }
        }

        // --- NOTAS (com [N], destaque, referência sempre visível, "ver mais") ---
        const notasTexto = String(medAtivo.adicionais || "");
        let notas = [];
        function filtrarNotaPorConcentracao(texto, indiceSelecionado) {
            if (!/\[\d+\]/.test(texto)) return texto;
            if (indiceSelecionado === null) return texto.replace(/\[\d+\]\s*/g, '').trim();
            const partes = texto.split(/(\[\d+\])/);
            let indiceAtual = null, resultado = "";
            for (const parte of partes) {
                const m = parte.match(/^\[(\d+)\]$/);
                if (m) { indiceAtual = parseInt(m[1], 10); continue; }
                if (indiceAtual === null || indiceAtual === indiceSelecionado) resultado += parte;
            }
            return resultado.replace(/\s+/g, ' ').trim();
        }
        if (notaReferenciaPeso) {
            notas.push(`<span style="color:#ff9800;font-weight:600;background:rgba(255,152,0,.15);padding:4px 6px;border-radius:12px;display:inline-block;">${notaReferenciaPeso}</span>`);
        }
        if (notasTexto.trim() !== "") {
            let bruto = notasTexto.trim();
            if (!bruto.startsWith('#')) bruto = '#' + bruto;
            if (!bruto.endsWith('#')) bruto += '#';
            const partes = bruto.split('#');
            for (let parte of partes) {
                parte = parte.trim();
                if (!parte) continue;
                if (parte.includes('{') || parte.includes('}') || parte.match(/^[\d\.\s%]+$/)) continue;
                parte = filtrarNotaPorConcentracao(parte, indiceConcentracao);
                if (!parte) continue;
                parte = parte.replace(/@@([^@]+)@/g, (_, c) =>
                    `<span style="color:#ff9800;font-weight:600;background:rgba(255,152,0,.15);padding:4px 6px;border-radius:12px;display:inline-block;">${c}</span>`
                ).replace(/@/g, '').trim();
                if (parte) notas.push(parte);
            }
        }

        if (notas.length > 0) {
            // A última nota é sempre a referência (Referencia: manual, página, vinda da
            // coluna 'nota') -- se existir, mostra-se sempre, fora do "ver mais".
            const referencia = String(medAtivo.nota || "").trim();
            const notasComColapso = notas;
            const excedeLimite = notasComColapso.length > MAX_NOTAS_VISIVEIS;

            resultadoHTML += `<div class="dosagem-notas"><div class="notas-titulo"><i class="ri-information-fill"></i><span>Informações Adicionais</span></div>`;
            notasComColapso.forEach((n, i) => {
                const oculta = excedeLimite && i >= MAX_NOTAS_VISIVEIS ? ' nota-oculta' : '';
                resultadoHTML += `<div class="nota-item${oculta}"><i class="ri-information-line"></i><span>${n}</span></div>`;
            });
            if (excedeLimite) {
                resultadoHTML += `<button class="btn-ver-mais-notas" onclick="alternarNotasOcultas(this)"><i class="ri-arrow-down-s-line"></i> Ver mais (${notasComColapso.length - MAX_NOTAS_VISIVEIS})</button>`;
            }
            if (referencia) {
                resultadoHTML += `<div class="nota-item nota-referencia"><i class="ri-book-open-line"></i><span>${referencia}</span></div>`;
            }
            resultadoHTML += `</div>`;
        }

        if (mostrarTotais && horas !== null && mlValues.length > 0 && horas < 24) {
            const tomasPorDia = 24 / horas;
            const volumeMl = parseFloat(mlValues[0]);
            const volumePorDia = volumeMl * tomasPorDia;
            resultadoHTML += `<div class="dosagem-totais">
                <div class="total-item"><i class="ri-repeat-line"></i><span>${formatarNumero(tomasPorDia)} toma(s)/dia</span></div>
                <div class="total-item"><i class="ri-drop-line"></i><span>${formatarNumero(volumePorDia)} mL/dia</span></div>`;
            if (concentracao > 0) {
                resultadoHTML += `<div class="total-item"><i class="ri-scales-2-line"></i><span>${formatarNumero(volumeMl * concentracao * tomasPorDia)} mg/dia</span></div>`;
            }
            resultadoHTML += `</div>`;
        }

        resultadoHTML += `</div></div>`;
        pResultado.innerHTML = resultadoHTML;
        pResultado.style.background = "none"; pResultado.style.display = "block";

    } catch (e) {
        console.error("❌ Erro no cálculo:", e);
        pResultado.innerHTML = `<div class="dosagem-erro"><i class="ri-error-warning-line"></i><span>Erro na fórmula da base de dados!</span></div>`;
        pResultado.style.background = "none"; pResultado.style.display = "block";
    }
}

function alternarNotasOcultas(btn) {
    const container = btn.closest('.dosagem-notas');
    container.querySelectorAll('.nota-item.nota-oculta').forEach(n => n.classList.remove('nota-oculta'));
    btn.style.display = 'none';
}

/* ---- 16. GATILHOS ---- */
function calcularSePronto() {
    if (!medAtivo) return;
    const pesoOK = campoPeso.style.display === "none" || inputs.peso.value.trim() !== "";
    const idadeOK = campoIdade.style.display === "none" || inputs.idade.value.trim() !== "";
    const dosagemOK = campoDosagem.style.display === "none" || inputs.dosagem.value.trim() !== "";
    if (pesoOK && idadeOK && dosagemOK) calcular();
}

function limpar() {
    pResultado.classList.remove("vibrar"); void pResultado.offsetWidth; pResultado.classList.add("vibrar");
    inputNome.value = ""; inputs.peso.value = ""; inputs.idade.value = "";
    inputs.dosagem.value = ""; inputs.dosagemManutencao.value = "";
    medAtivo = null; exibirCampos(); pResultado.innerHTML = "";
}

selConcentracao.addEventListener('change', () => calcularSePronto());

inputNome.addEventListener("input", () => {
    const valor = inputNome.value.trim();
    if (valor.length > 0) {
        escolherLinha('silencioso');
        if (medAtivo) { divSugestoes.style.display = "none"; exibirCampos(); }
        else { pResultado.style.display = "none"; gerirSugestoes(); exibirCampos(); }
    } else {
        divSugestoes.style.display = "none"; divSugestoes.innerHTML = "";
    }
});

[inputs.peso, inputs.idade, inputs.dosagem, inputs.dosagemManutencao].forEach(el => {
    el.addEventListener('input', () => { if (inputNome.value.trim() !== "") { escolherLinha('ajuste'); exibirCampos(); } });
});

/* ---- 17. MENU LATERAL ---- */
const btnHamburger = document.getElementById('btnHamburger');
const menuOverlay = document.getElementById('menuOverlay');
const menuLateral = document.getElementById('menuLateral');
const menuItems = document.querySelectorAll('.menu-item');

if (btnHamburger && menuOverlay && menuLateral) {
    function abrirMenu() { btnHamburger.classList.add('ativo'); menuOverlay.classList.add('ativo'); menuLateral.classList.add('ativo'); document.body.style.overflow = 'hidden'; }
    function fecharMenu() { btnHamburger.classList.remove('ativo'); menuOverlay.classList.remove('ativo'); menuLateral.classList.remove('ativo'); document.body.style.overflow = ''; }
    btnHamburger.addEventListener('click', () => menuLateral.classList.contains('ativo') ? fecharMenu() : abrirMenu());
    menuOverlay.addEventListener('click', fecharMenu);
    menuItems.forEach(item => item.addEventListener('click', () => { menuItems.forEach(i => i.classList.remove('active')); item.classList.add('active'); setTimeout(fecharMenu, 200); }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuLateral.classList.contains('ativo')) fecharMenu(); });
}

/* ---- 18. INICIALIZAÇÃO ---- */
window.addEventListener('load', () => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') { body.setAttribute('data-theme', 'dark'); if (themeIcon) themeIcon.className = 'ri-sun-line'; }
    const fonteSalva = localStorage.getItem('fonte');
    if (fonteSalva && ROTULOS_FONTE[fonteSalva]) selecionarFonte(fonteSalva);
    carregarDados();
});