// ============================================================================
// BASE DE DADOS - EXAMES, DIAGNÓSTICOS E ESCALAS (VERSÃO CORRIGIDA)
// ============================================================================
const database = {
    // ========== EXAMES ==========
    "Glicémia (Jejum)": {
        tipo: "exame",
        sinonimos: ["glicemia", "glucose"],
        referencia: { min: 70, max: 99, unidade: "mg/dL" },
        limites: { min: 0, max: 999 },
        campos: [
            { id: "valor", tipo: "input", label: "Resultado", unidade: "mg/dL" }
        ],
        notas: [
            { min: 0, max: 69, nota: "⚠️ GLICEMIA BAIXA! Risco de hipoglicemia. Oferecer 15g de açúcar de absorção rápida e repetir glicemia em 15 minutos.", status: "baixo", termo: "Hipoglicemia" },
            { min: 70, max: 99, nota: "✅ Glicemia normal. Manter estilo de vida saudável e medicações conforme prescrição.", status: "normal", termo: "Normoglicemia" },
            { min: 100, max: 999, nota: "⚠️ GLICEMIA ALTA! Hiperglicemia. Avaliar adesão à medicação e regime alimentar. Considerar ajuste de insulina/antidiabético oral.", status: "alto", termo: "Hiperglicemia" }
        ]
    },
    "Creatinina": {
        tipo: "exame",
        sinonimos: ["creat", "creatinina"],
        referencia: { min: 0.6, max: 1.2, unidade: "mg/dL" },
        limites: { min: 0, max: 20 },
        campos: [
            { id: "valor", tipo: "input", label: "Resultado", unidade: "mg/dL" }
        ],
        notas: [
            { min: 0, max: 0.5, nota: "Creatinina baixa. Geralmente sem significado clínico, pode ocorrer em sarcopenia ou desnutrição.", status: "baixo", termo: "Creatinina baixa" },
            { min: 0.6, max: 1.2, nota: "✅ Função renal preservada.", status: "normal", termo: "Função renal normal" },
            { min: 1.3, max: 20, nota: "⚠️ CREATININA ALTA! Possível lesão renal. Calcular TFG. Avaliar hidratação e medicamentos nefrotóxicos.", status: "alto", termo: "Insuficiência renal" }
        ]
    },
    "Hemoglobina Glicada (HbA1c)": {
        tipo: "exame",
        sinonimos: ["hba1c", "hemoglobina glicada"],
        referencia: { min: 4.0, max: 5.6, unidade: "%" },
        limites: { min: 0, max: 20 },
        campos: [
            { id: "valor", tipo: "input", label: "Resultado", unidade: "%" }
        ],
        notas: [
            { min: 0, max: 3.9, nota: "⚠️ HbA1c baixa (<4%). Pode indicar anemia hemolítica, perda sanguínea ou hipoglicemia frequente. Investigar causa.", status: "baixo", termo: "HbA1c baixa" },
            { min: 4.0, max: 5.6, nota: "✅ HbA1c normal. Bom controle glicêmico nos últimos 3 meses.", status: "normal", termo: "Controle glicêmico adequado" },
            { min: 5.7, max: 20, nota: "⚠️ HbA1c alta! Risco de complicações do diabetes. Reforçar adesão ao tratamento e controle glicêmico.", status: "alto", termo: "Controle glicêmico inadequado" }
        ]
    },
    "Colesterol Total": {
        tipo: "exame",
        sinonimos: ["colesterol"],
        referencia: { min: 0, max: 189, unidade: "mg/dL" },
        limites: { min: 0, max: 1000 },
        campos: [
            { id: "valor", tipo: "input", label: "Resultado", unidade: "mg/dL" }
        ],
        notas: [
            { min: 0, max: 189, nota: "✅ Colesterol total dentro do desejável.", status: "normal", termo: "Colesterol desejável" },
            { min: 190, max: 1000, nota: "⚠️ COLESTEROL TOTAL ALTO! Risco cardiovascular. Orientar dieta, atividade física. Considerar estatinas conforme risco.", status: "alto", termo: "Hipercolesterolemia" }
        ]
    },
    "TSH": {
        tipo: "exame",
        sinonimos: ["tsh", "tireoide"],
        referencia: { min: 0.4, max: 4.5, unidade: "mUI/L" },
        limites: { min: 0, max: 100 },
        campos: [
            { id: "valor", tipo: "input", label: "Resultado", unidade: "mUI/L" }
        ],
        notas: [
            { min: 0, max: 0.39, nota: "⚠️ TSH BAIXO! Possível hipertireoidismo. Solicitar T4 livre e T3. Avaliar sintomas (taquicardia, perda peso).", status: "baixo", termo: "Hipertireoidismo" },
            { min: 0.4, max: 4.5, nota: "✅ Função tireoidiana normal.", status: "normal", termo: "Eutireoidismo" },
            { min: 4.6, max: 100, nota: "⚠️ TSH ALTO! Possível hipotireoidismo. Solicitar T4 livre. Avaliar sintomas (fadiga, ganho peso, pele seca).", status: "alto", termo: "Hipotireoidismo" }
        ]
    },
    "Plaquetas": {
        tipo: "exame",
        sinonimos: ["plaquetas", "trombocitos"],
        referencia: { min: 150000, max: 450000, unidade: "/mm³" },
        limites: { min: 0, max: 10000000 },
        campos: [
            { id: "valor", tipo: "input", label: "Resultado", unidade: "/mm³" }
        ],
        notas: [
            { min: 0, max: 149999, nota: "⚠️ PLAQUETAS BAIXAS! Risco de sangramento. Evitar AAS e AINEs. Solicitar coleta em EDTA e avaliar pseudo-trombocitopenia.", status: "baixo", termo: "Trombocitopenia" },
            { min: 150000, max: 450000, nota: "✅ Contagem plaquetária normal.", status: "normal", termo: "Plaquetas normais" },
            { min: 450001, max: 10000000, nota: "⚠️ PLAQUETAS ALTAS! Risco trombótico. Avaliar reação inflamatória ou neoplasia oculta.", status: "alto", termo: "Trombocitose" }
        ]
    },

    // ========== DIAGNÓSTICOS ==========
    "Malária": {
        tipo: "diagnostico",
        sinonimos: ["malaria", "paludismo"],
        limites: { min: 0, max: 9999999 },
        campos: [
            { id: "parasitemia", tipo: "input", label: "Parasitémia", unidade: "/µL" }
        ],
        estagios: [
            { valores: { parasitemia: [0, 0] }, status: "negativo", classificacao: "Negativo", nota: "Malária negativa. Descartar infecção.", fase: "Ausente" },
            { valores: { parasitemia: [1, 999] }, status: "leve", classificacao: "Leve", nota: "Malária leve. Tratamento ambulatorial com Arteméter-Lumefantrina por 3 dias.", fase: "Inicial" },
            { valores: { parasitemia: [1000, 9999] }, status: "moderado", classificacao: "Moderada", nota: "Malária moderada. Internação. Hemograma completo + função renal.", fase: "Aguda" },
            { valores: { parasitemia: [10000, 99999] }, status: "grave", classificacao: "Grave", nota: "MALÁRIA GRAVE! UCI. Arteméter IV + monitorizar glicemia a cada 6h.", fase: "Severa" },
            { valores: { parasitemia: [100000, 9999999] }, status: "muito_grave", classificacao: "Muito Grave", nota: "MALÁRIA MUITO GRAVE! UCI urgente. Transfusão + artesunato IV + glicose 50%.", fase: "Crítica" }
        ]
    },
    "Tuberculose (BAAR)": {
        tipo: "diagnostico",
        sinonimos: ["tb", "tuberculose"],
        limites: { min: 0, max: 3 },
        campos: [
            { id: "baar", tipo: "select", label: "BAAR", opcoes: ["Negativo", "+", "++", "+++"] }
        ],
        estagios: [
            { valores: { baar: "Negativo" }, status: "negativo", classificacao: "Negativo", nota: "Tuberculose negativa. Descartar infecção.", fase: "Ausente" },
            { valores: { baar: "+" }, status: "leve", classificacao: "Leve", nota: "Tuberculose positiva (leve). Iniciar tratamento. Isolamento respiratório por 14 dias.", fase: "Inicial" },
            { valores: { baar: "++" }, status: "moderado", classificacao: "Moderada", nota: "Tuberculose positiva (moderada). Alta contagiosidade. Notificar vigilância sanitária + teste nos contactantes.", fase: "Ativa" },
            { valores: { baar: "+++" }, status: "grave", classificacao: "Grave", nota: "TUBERCULOSE GRAVE! Isolamento urgente. Muito contagioso - quarto privativo + máscara N95.", fase: "Severa" }
        ]
    },
    "Hepatite B (Painel)": {
        tipo: "diagnostico",
        sinonimos: ["hepatite b", "hbv"],
        limites: { min: 0, max: 1 },
        campos: [
            { id: "hbsag", tipo: "select", label: "HBsAg", opcoes: ["Positivo", "Negativo"] },
            { id: "anti_hbs", tipo: "select", label: "Anti-HBs", opcoes: ["Positivo", "Negativo"] },
            { id: "anti_hbc", tipo: "select", label: "Anti-HBc", opcoes: ["Positivo", "Negativo"] },
            { id: "hbeag", tipo: "select", label: "HBeAg", opcoes: ["Positivo", "Negativo"] }
        ],
        estagios: [
            { valores: { hbsag: "Negativo", anti_hbs: "Positivo", anti_hbc: "Positivo" }, status: "imune", classificacao: "Imune", nota: "Imune (infecção passada). Proteção natural.", fase: "Imunidade" },
            { valores: { hbsag: "Negativo", anti_hbs: "Positivo", anti_hbc: "Negativo" }, status: "imune", classificacao: "Imune", nota: "Imune (vacina). Proteção garantida pela vacina.", fase: "Imunidade" },
            { valores: { hbsag: "Positivo", hbeag: "Positivo" }, status: "grave", classificacao: "Ativa", nota: "Hepatite B ativa. ALTA INFECTIVIDADE! Iniciar antiviral. Solicitar carga viral e função hepática.", fase: "Replicação" },
            { valores: { hbsag: "Positivo", hbeag: "Negativo" }, status: "moderado", classificacao: "Crónica inativa", nota: "Hepatite B crónica inativa. Baixa infectividade. Repetir perfil em 6 meses.", fase: "Inativa" }
        ]
    },

    // ========== ESCALAS ==========
    "Escala de Apgar": {
        tipo: "escala",
        sinonimos: ["apgar"],
        referencia: { min: 8, max: 10, label: "Bom" },
        limites: { min: 0, max: 10 },
        campos: [
            { id: "fc", tipo: "select", label: "FC Cardíaca", opcoes: ["0 (Ausente)", "1 (<100 bpm)", "2 (>100 bpm)"], pesos: [0, 1, 2] },
            { id: "resp", tipo: "select", label: "Respiração", opcoes: ["0 (Ausente)", "1 (Irregular/lenta)", "2 (Boa/Choro)"], pesos: [0, 1, 2] },
            { id: "tonus", tipo: "select", label: "Tónus Muscular", opcoes: ["0 (Flácido)", "1 (Alguma flexão)", "2 (Movimento ativo)"], pesos: [0, 1, 2] },
            { id: "reflexos", tipo: "select", label: "Reflexos", opcoes: ["0 (Ausente)", "1 (Careta)", "2 (Choro vigoroso)"], pesos: [0, 1, 2] },
            { id: "cor", tipo: "select", label: "Cor da Pele", opcoes: ["0 (Azul/pálido)", "1 (Cianose periférica)", "2 (Rosado)"], pesos: [0, 1, 2] }
        ],
        estagios: [
            { soma_min: 8, soma_max: 10, status: "bom", classificacao: "Bom", nota: "Apgar normal. Neonato saudável. Pele a peito.", interpretacao: "Saudável" },
            { soma_min: 5, soma_max: 7, status: "moderado", classificacao: "Moderado", nota: "Apgar moderado. Reanimação moderada. Monitorizar de perto. Aspirar vias aéreas.", interpretacao: "Atenção" },
            { soma_min: 0, soma_max: 4, status: "grave", classificacao: "Crítico", nota: "APGAR CRÍTICO! Reanimação avançada. Risco de vida iminente. Intubar e massagear.", interpretacao: "Crítico" }
        ]
    },
    "Escala de Glasgow": {
        tipo: "escala",
        sinonimos: ["glasgow"],
        referencia: { min: 13, max: 15, label: "Leve" },
        limites: { min: 3, max: 15 },
        campos: [
            { id: "ocular", tipo: "select", label: "Abertura Ocular", opcoes: ["1 (Nenhuma)", "2 (Dor)", "3 (Comando verbal)", "4 (Espontânea)"], pesos: [1, 2, 3, 4] },
            { id: "verbal", tipo: "select", label: "Resposta Verbal", opcoes: ["1 (Nenhuma)", "2 (Sons)", "3 (Palavras)", "4 (Confuso)", "5 (Orientado)"], pesos: [1, 2, 3, 4, 5] },
            { id: "motora", tipo: "select", label: "Resposta Motora", opcoes: ["1 (Nenhuma)", "2 (Extensão)", "3 (Flexão)", "4 (Retirada)", "5 (Localiza)", "6 (Obedece)"], pesos: [1, 2, 3, 4, 5, 6] }
        ],
        estagios: [
            { soma_min: 13, soma_max: 15, status: "leve", classificacao: "Leve", nota: "Lesão cerebral leve. Observação. Reavaliar a cada 4 horas.", interpretacao: "Orientado" },
            { soma_min: 9, soma_max: 12, status: "moderado", classificacao: "Moderada", nota: "Lesão cerebral moderada. Internação/TC. Risco de deterioração. TC craniana urgente.", interpretacao: "Confuso" },
            { soma_min: 3, soma_max: 8, status: "grave", classificacao: "Grave", nota: "LESÃO CEREBRAL GRAVE! UCI/Intubação. COMA! Proteger via aérea. Considerar intubação.", interpretacao: "Coma" }
        ]
    },
    "Índice de Massa Corporal (IMC)": {
        tipo: "escala",
        sinonimos: ["imc", "peso", "altura"],
        referencia: { min: 18.5, max: 24.9, label: "Normal" },
        limites: { min: 0, max: 100 },
        campos: [
            { id: "peso", tipo: "input", label: "Peso", unidade: "kg", min: 1, max: 500 },
            { id: "altura", tipo: "input", label: "Altura", unidade: "m", min: 0.3, max: 2.5 }
        ],
        // NOVO: fórmula como texto (usa os ids dos "campos" como variáveis).
        // A função calcularFormula() interpreta e calcula isto automaticamente.
        formula: "peso / (altura * altura)",
        estagios: [
            { soma_min: 0, soma_max: 18.4, status: "baixo", classificacao: "Abaixo do peso", nota: "IMC abaixo do normal. Avaliar estado nutricional e possíveis causas.", interpretacao: "Desnutrição" },
            { soma_min: 18.5, soma_max: 24.9, status: "bom", classificacao: "Normal", nota: "IMC normal. Manter hábitos saudáveis.", interpretacao: "Saudável" },
            { soma_min: 25, soma_max: 29.9, status: "moderado", classificacao: "Sobrepeso", nota: "IMC indica sobrepeso. Orientar dieta e atividade física.", interpretacao: "Atenção" },
            { soma_min: 30, soma_max: 100, status: "grave", classificacao: "Obesidade", nota: "IMC indica obesidade. Avaliar comorbidades e planejar intervenção multidisciplinar.", interpretacao: "Risco" }
        ]
    },
    "Hemoglobina": { tipo: "exame", sinonimos: ["hb"], campos: [{ id: "valor", tipo: "input", label: "Hemoglobina", unidade: "g/dL" }], referencia: { min: 12, max: 16, unidade: "g/dL" }, limites: { min: 0, max: 25 }, notas: [{ min: 0, max: 11, nota: "⚠️ HEMOGLOBINA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Hemoglobina Baixo" }, { min: 12, max: 16, nota: "✅ Hemoglobina dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Hemoglobina Normal" }, { min: 17, max: 25, nota: "⚠️ HEMOGLOBINA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Hemoglobina Alto" }] },
    "Hematócrito": { tipo: "exame", sinonimos: ["ht", "hct"], campos: [{ id: "valor", tipo: "input", label: "Hematócrito", unidade: "%" }], referencia: { min: 36, max: 46, unidade: "%" }, limites: { min: 0, max: 70 }, notas: [{ min: 0, max: 35, nota: "⚠️ HEMATÓCRITO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Hematócrito Baixo" }, { min: 36, max: 46, nota: "✅ Hematócrito dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Hematócrito Normal" }, { min: 47, max: 70, nota: "⚠️ HEMATÓCRITO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Hematócrito Alto" }] },
    "Leucócitos Totais": { tipo: "exame", sinonimos: ["leucocitos", "wbc"], campos: [{ id: "valor", tipo: "input", label: "Leucócitos Totais", unidade: "céls/mm³" }], referencia: { min: 4000, max: 11000, unidade: "céls/mm³" }, limites: { min: 0, max: 50000 }, notas: [{ min: 0, max: 3999, nota: "⚠️ LEUCÓCITOS TOTAIS BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Leucócitos Totais Baixo" }, { min: 4000, max: 11000, nota: "✅ Leucócitos Totais dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Leucócitos Totais Normal" }, { min: 11001, max: 50000, nota: "⚠️ LEUCÓCITOS TOTAIS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Leucócitos Totais Alto" }] },
    "Neutrófilos": { tipo: "exame", sinonimos: ["neutrofilos"], campos: [{ id: "valor", tipo: "input", label: "Neutrófilos", unidade: "%" }], referencia: { min: 40, max: 70, unidade: "%" }, limites: { min: 0, max: 100 }, notas: [{ min: 0, max: 39, nota: "⚠️ NEUTRÓFILOS BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Neutrófilos Baixo" }, { min: 40, max: 70, nota: "✅ Neutrófilos dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Neutrófilos Normal" }, { min: 71, max: 100, nota: "⚠️ NEUTRÓFILOS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Neutrófilos Alto" }] },
    "Linfócitos": { tipo: "exame", sinonimos: ["linfocitos"], campos: [{ id: "valor", tipo: "input", label: "Linfócitos", unidade: "%" }], referencia: { min: 20, max: 40, unidade: "%" }, limites: { min: 0, max: 100 }, notas: [{ min: 0, max: 19, nota: "⚠️ LINFÓCITOS BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Linfócitos Baixo" }, { min: 20, max: 40, nota: "✅ Linfócitos dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Linfócitos Normal" }, { min: 41, max: 100, nota: "⚠️ LINFÓCITOS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Linfócitos Alto" }] },
    "Eosinófilos": { tipo: "exame", sinonimos: ["eosinofilos"], campos: [{ id: "valor", tipo: "input", label: "Eosinófilos", unidade: "%" }], referencia: { min: 1, max: 4, unidade: "%" }, limites: { min: 0, max: 100 }, notas: [{ min: 0, max: 0, nota: "⚠️ EOSINÓFILOS BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Eosinófilos Baixo" }, { min: 1, max: 4, nota: "✅ Eosinófilos dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Eosinófilos Normal" }, { min: 5, max: 100, nota: "⚠️ EOSINÓFILOS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Eosinófilos Alto" }] },
    "Monócitos": { tipo: "exame", sinonimos: ["monocitos"], campos: [{ id: "valor", tipo: "input", label: "Monócitos", unidade: "%" }], referencia: { min: 2, max: 8, unidade: "%" }, limites: { min: 0, max: 100 }, notas: [{ min: 0, max: 1, nota: "⚠️ MONÓCITOS BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Monócitos Baixo" }, { min: 2, max: 8, nota: "✅ Monócitos dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Monócitos Normal" }, { min: 9, max: 100, nota: "⚠️ MONÓCITOS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Monócitos Alto" }] },
    "Basófilos": { tipo: "exame", sinonimos: ["basofilos"], campos: [{ id: "valor", tipo: "input", label: "Basófilos", unidade: "%" }], referencia: { min: 0, max: 1, unidade: "%" }, limites: { min: 0, max: 100 }, notas: [{ min: 0, max: 1, nota: "✅ Basófilos dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Basófilos Normal" }, { min: 2, max: 100, nota: "⚠️ BASÓFILOS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Basófilos Alto" }] },
    "Velocidade de Hemossedimentação (VHS)": { tipo: "exame", sinonimos: ["vhs", "vsg"], campos: [{ id: "valor", tipo: "input", label: "Velocidade de Hemossedimentação (VHS)", unidade: "mm/h" }], referencia: { min: 0, max: 20, unidade: "mm/h" }, limites: { min: 0, max: 150 }, notas: [{ min: 0, max: 20, nota: "✅ Velocidade de Hemossedimentação (VHS) dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Velocidade de Hemossedimentação (VHS) Normal" }, { min: 21, max: 150, nota: "⚠️ VELOCIDADE DE HEMOSSEDIMENTAÇÃO (VHS) ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Velocidade de Hemossedimentação (VHS) Alto" }] },
    "Proteína C Reativa (PCR)": { tipo: "exame", sinonimos: ["pcr"], campos: [{ id: "valor", tipo: "input", label: "Proteína C Reativa (PCR)", unidade: "mg/L" }], referencia: { min: 0, max: 10, unidade: "mg/L" }, limites: { min: 0, max: 300 }, notas: [{ min: 0, max: 10, nota: "✅ Proteína C Reativa (PCR) dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Proteína C Reativa (PCR) Normal" }, { min: 11, max: 300, nota: "⚠️ PROTEÍNA C REATIVA (PCR) ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Proteína C Reativa (PCR) Alto" }] },
    "Ferro Sérico": { tipo: "exame", sinonimos: ["ferro"], campos: [{ id: "valor", tipo: "input", label: "Ferro Sérico", unidade: "µg/dL" }], referencia: { min: 60, max: 170, unidade: "µg/dL" }, limites: { min: 0, max: 300 }, notas: [{ min: 0, max: 59, nota: "⚠️ FERRO SÉRICO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Ferro Sérico Baixo" }, { min: 60, max: 170, nota: "✅ Ferro Sérico dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Ferro Sérico Normal" }, { min: 171, max: 300, nota: "⚠️ FERRO SÉRICO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Ferro Sérico Alto" }] },
    "Ferritina": { tipo: "exame", sinonimos: ["ferritina"], campos: [{ id: "valor", tipo: "input", label: "Ferritina", unidade: "ng/mL" }], referencia: { min: 20, max: 250, unidade: "ng/mL" }, limites: { min: 0, max: 2000 }, notas: [{ min: 0, max: 19, nota: "⚠️ FERRITINA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Ferritina Baixo" }, { min: 20, max: 250, nota: "✅ Ferritina dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Ferritina Normal" }, { min: 251, max: 2000, nota: "⚠️ FERRITINA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Ferritina Alto" }] },
    "Transferrina": { tipo: "exame", sinonimos: ["transferrina"], campos: [{ id: "valor", tipo: "input", label: "Transferrina", unidade: "mg/dL" }], referencia: { min: 200, max: 360, unidade: "mg/dL" }, limites: { min: 0, max: 600 }, notas: [{ min: 0, max: 199, nota: "⚠️ TRANSFERRINA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Transferrina Baixo" }, { min: 200, max: 360, nota: "✅ Transferrina dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Transferrina Normal" }, { min: 361, max: 600, nota: "⚠️ TRANSFERRINA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Transferrina Alto" }] },
    "Vitamina B12": { tipo: "exame", sinonimos: ["b12", "cobalamina"], campos: [{ id: "valor", tipo: "input", label: "Vitamina B12", unidade: "pg/mL" }], referencia: { min: 200, max: 900, unidade: "pg/mL" }, limites: { min: 0, max: 2000 }, notas: [{ min: 0, max: 199, nota: "⚠️ VITAMINA B12 BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Vitamina B12 Baixo" }, { min: 200, max: 900, nota: "✅ Vitamina B12 dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Vitamina B12 Normal" }, { min: 901, max: 2000, nota: "⚠️ VITAMINA B12 ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Vitamina B12 Alto" }] },
    "Ácido Fólico": { tipo: "exame", sinonimos: ["folato", "acido folico"], campos: [{ id: "valor", tipo: "input", label: "Ácido Fólico", unidade: "ng/mL" }], referencia: { min: 3, max: 17, unidade: "ng/mL" }, limites: { min: 0, max: 30 }, notas: [{ min: 0, max: 2, nota: "⚠️ ÁCIDO FÓLICO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Ácido Fólico Baixo" }, { min: 3, max: 17, nota: "✅ Ácido Fólico dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Ácido Fólico Normal" }, { min: 18, max: 30, nota: "⚠️ ÁCIDO FÓLICO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Ácido Fólico Alto" }] },
    "Vitamina D (25-OH)": { tipo: "exame", sinonimos: ["vitamina d", "25-oh-d"], campos: [{ id: "valor", tipo: "input", label: "Vitamina D (25-OH)", unidade: "ng/mL" }], referencia: { min: 30, max: 100, unidade: "ng/mL" }, limites: { min: 0, max: 150 }, notas: [{ min: 0, max: 29, nota: "⚠️ VITAMINA D (25-OH) BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Vitamina D (25-OH) Baixo" }, { min: 30, max: 100, nota: "✅ Vitamina D (25-OH) dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Vitamina D (25-OH) Normal" }, { min: 101, max: 150, nota: "⚠️ VITAMINA D (25-OH) ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Vitamina D (25-OH) Alto" }] },
    "Cálcio Total": { tipo: "exame", sinonimos: ["calcio"], campos: [{ id: "valor", tipo: "input", label: "Cálcio Total", unidade: "mg/dL" }], referencia: { min: 8.5, max: 10.5, unidade: "mg/dL" }, limites: { min: 0, max: 20 }, notas: [{ min: 0, max: 8.4, nota: "⚠️ CÁLCIO TOTAL BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Cálcio Total Baixo" }, { min: 8.5, max: 10.5, nota: "✅ Cálcio Total dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Cálcio Total Normal" }, { min: 10.6, max: 20, nota: "⚠️ CÁLCIO TOTAL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Cálcio Total Alto" }] },
    "Cálcio Iônico": { tipo: "exame", sinonimos: ["calcio ionico"], campos: [{ id: "valor", tipo: "input", label: "Cálcio Iônico", unidade: "mmol/L" }], referencia: { min: 1.1, max: 1.3, unidade: "mmol/L" }, limites: { min: 0, max: 3 }, notas: [{ min: 0, max: 1.0, nota: "⚠️ CÁLCIO IÔNICO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Cálcio Iônico Baixo" }, { min: 1.1, max: 1.3, nota: "✅ Cálcio Iônico dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Cálcio Iônico Normal" }, { min: 1.4000000000000001, max: 3, nota: "⚠️ CÁLCIO IÔNICO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Cálcio Iônico Alto" }] },
    "Fósforo": { tipo: "exame", sinonimos: ["fosforo"], campos: [{ id: "valor", tipo: "input", label: "Fósforo", unidade: "mg/dL" }], referencia: { min: 2.5, max: 4.5, unidade: "mg/dL" }, limites: { min: 0, max: 15 }, notas: [{ min: 0, max: 2.4, nota: "⚠️ FÓSFORO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Fósforo Baixo" }, { min: 2.5, max: 4.5, nota: "✅ Fósforo dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Fósforo Normal" }, { min: 4.6, max: 15, nota: "⚠️ FÓSFORO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Fósforo Alto" }] },
    "Magnésio": { tipo: "exame", sinonimos: ["magnesio"], campos: [{ id: "valor", tipo: "input", label: "Magnésio", unidade: "mg/dL" }], referencia: { min: 1.7, max: 2.4, unidade: "mg/dL" }, limites: { min: 0, max: 10 }, notas: [{ min: 0, max: 1.5999999999999999, nota: "⚠️ MAGNÉSIO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Magnésio Baixo" }, { min: 1.7, max: 2.4, nota: "✅ Magnésio dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Magnésio Normal" }, { min: 2.5, max: 10, nota: "⚠️ MAGNÉSIO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Magnésio Alto" }] },
    "Sódio": { tipo: "exame", sinonimos: ["sodio", "na"], campos: [{ id: "valor", tipo: "input", label: "Sódio", unidade: "mEq/L" }], referencia: { min: 135, max: 145, unidade: "mEq/L" }, limites: { min: 100, max: 180 }, notas: [{ min: 100, max: 134, nota: "⚠️ SÓDIO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Sódio Baixo" }, { min: 135, max: 145, nota: "✅ Sódio dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Sódio Normal" }, { min: 146, max: 180, nota: "⚠️ SÓDIO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Sódio Alto" }] },
    "Potássio": { tipo: "exame", sinonimos: ["potassio", "k"], campos: [{ id: "valor", tipo: "input", label: "Potássio", unidade: "mEq/L" }], referencia: { min: 3.5, max: 5.0, unidade: "mEq/L" }, limites: { min: 1, max: 10 }, notas: [{ min: 1, max: 3.4, nota: "⚠️ POTÁSSIO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Potássio Baixo" }, { min: 3.5, max: 5.0, nota: "✅ Potássio dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Potássio Normal" }, { min: 5.1, max: 10, nota: "⚠️ POTÁSSIO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Potássio Alto" }] },
    "Cloro": { tipo: "exame", sinonimos: ["cloro", "cl"], campos: [{ id: "valor", tipo: "input", label: "Cloro", unidade: "mEq/L" }], referencia: { min: 98, max: 107, unidade: "mEq/L" }, limites: { min: 70, max: 140 }, notas: [{ min: 70, max: 97, nota: "⚠️ CLORO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Cloro Baixo" }, { min: 98, max: 107, nota: "✅ Cloro dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Cloro Normal" }, { min: 108, max: 140, nota: "⚠️ CLORO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Cloro Alto" }] },
    "Ureia": { tipo: "exame", sinonimos: ["ureia"], campos: [{ id: "valor", tipo: "input", label: "Ureia", unidade: "mg/dL" }], referencia: { min: 10, max: 50, unidade: "mg/dL" }, limites: { min: 0, max: 300 }, notas: [{ min: 0, max: 9, nota: "⚠️ UREIA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Ureia Baixo" }, { min: 10, max: 50, nota: "✅ Ureia dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Ureia Normal" }, { min: 51, max: 300, nota: "⚠️ UREIA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Ureia Alto" }] },
    "Ácido Úrico": { tipo: "exame", sinonimos: ["acido urico"], campos: [{ id: "valor", tipo: "input", label: "Ácido Úrico", unidade: "mg/dL" }], referencia: { min: 3.5, max: 7.2, unidade: "mg/dL" }, limites: { min: 0, max: 20 }, notas: [{ min: 0, max: 3.4, nota: "⚠️ ÁCIDO ÚRICO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Ácido Úrico Baixo" }, { min: 3.5, max: 7.2, nota: "✅ Ácido Úrico dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Ácido Úrico Normal" }, { min: 7.3, max: 20, nota: "⚠️ ÁCIDO ÚRICO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Ácido Úrico Alto" }] },
    "Albumina": { tipo: "exame", sinonimos: ["albumina"], campos: [{ id: "valor", tipo: "input", label: "Albumina", unidade: "g/dL" }], referencia: { min: 3.5, max: 5.0, unidade: "g/dL" }, limites: { min: 0, max: 6 }, notas: [{ min: 0, max: 3.4, nota: "⚠️ ALBUMINA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Albumina Baixo" }, { min: 3.5, max: 5.0, nota: "✅ Albumina dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Albumina Normal" }, { min: 5.1, max: 6, nota: "⚠️ ALBUMINA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Albumina Alto" }] },
    "Proteínas Totais": { tipo: "exame", sinonimos: ["proteinas totais"], campos: [{ id: "valor", tipo: "input", label: "Proteínas Totais", unidade: "g/dL" }], referencia: { min: 6.0, max: 8.3, unidade: "g/dL" }, limites: { min: 0, max: 12 }, notas: [{ min: 0, max: 5.9, nota: "⚠️ PROTEÍNAS TOTAIS BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Proteínas Totais Baixo" }, { min: 6.0, max: 8.3, nota: "✅ Proteínas Totais dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Proteínas Totais Normal" }, { min: 8.4, max: 12, nota: "⚠️ PROTEÍNAS TOTAIS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Proteínas Totais Alto" }] },
    "Bilirrubina Total": { tipo: "exame", sinonimos: ["bilirrubina total"], campos: [{ id: "valor", tipo: "input", label: "Bilirrubina Total", unidade: "mg/dL" }], referencia: { min: 0.3, max: 1.2, unidade: "mg/dL" }, limites: { min: 0, max: 30 }, notas: [{ min: 0, max: 0.19999999999999998, nota: "⚠️ BILIRRUBINA TOTAL BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Bilirrubina Total Baixo" }, { min: 0.3, max: 1.2, nota: "✅ Bilirrubina Total dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Bilirrubina Total Normal" }, { min: 1.3, max: 30, nota: "⚠️ BILIRRUBINA TOTAL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Bilirrubina Total Alto" }] },
    "Bilirrubina Direta": { tipo: "exame", sinonimos: ["bilirrubina direta"], campos: [{ id: "valor", tipo: "input", label: "Bilirrubina Direta", unidade: "mg/dL" }], referencia: { min: 0, max: 0.3, unidade: "mg/dL" }, limites: { min: 0, max: 15 }, notas: [{ min: 0, max: 0.3, nota: "✅ Bilirrubina Direta dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Bilirrubina Direta Normal" }, { min: 0.4, max: 15, nota: "⚠️ BILIRRUBINA DIRETA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Bilirrubina Direta Alto" }] },
    "Bilirrubina Indireta": { tipo: "exame", sinonimos: ["bilirrubina indireta"], campos: [{ id: "valor", tipo: "input", label: "Bilirrubina Indireta", unidade: "mg/dL" }], referencia: { min: 0.2, max: 0.8, unidade: "mg/dL" }, limites: { min: 0, max: 25 }, notas: [{ min: 0, max: 0.1, nota: "⚠️ BILIRRUBINA INDIRETA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Bilirrubina Indireta Baixo" }, { min: 0.2, max: 0.8, nota: "✅ Bilirrubina Indireta dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Bilirrubina Indireta Normal" }, { min: 0.9, max: 25, nota: "⚠️ BILIRRUBINA INDIRETA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Bilirrubina Indireta Alto" }] },
    "TGO/AST": { tipo: "exame", sinonimos: ["tgo", "ast"], campos: [{ id: "valor", tipo: "input", label: "TGO/AST", unidade: "U/L" }], referencia: { min: 10, max: 40, unidade: "U/L" }, limites: { min: 0, max: 1000 }, notas: [{ min: 0, max: 9, nota: "⚠️ TGO/AST BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "TGO/AST Baixo" }, { min: 10, max: 40, nota: "✅ TGO/AST dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "TGO/AST Normal" }, { min: 41, max: 1000, nota: "⚠️ TGO/AST ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "TGO/AST Alto" }] },
    "TGP/ALT": { tipo: "exame", sinonimos: ["tgp", "alt"], campos: [{ id: "valor", tipo: "input", label: "TGP/ALT", unidade: "U/L" }], referencia: { min: 7, max: 56, unidade: "U/L" }, limites: { min: 0, max: 1000 }, notas: [{ min: 0, max: 6, nota: "⚠️ TGP/ALT BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "TGP/ALT Baixo" }, { min: 7, max: 56, nota: "✅ TGP/ALT dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "TGP/ALT Normal" }, { min: 57, max: 1000, nota: "⚠️ TGP/ALT ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "TGP/ALT Alto" }] },
    "Fosfatase Alcalina": { tipo: "exame", sinonimos: ["fosfatase alcalina", "fa"], campos: [{ id: "valor", tipo: "input", label: "Fosfatase Alcalina", unidade: "U/L" }], referencia: { min: 44, max: 147, unidade: "U/L" }, limites: { min: 0, max: 1000 }, notas: [{ min: 0, max: 43, nota: "⚠️ FOSFATASE ALCALINA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Fosfatase Alcalina Baixo" }, { min: 44, max: 147, nota: "✅ Fosfatase Alcalina dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Fosfatase Alcalina Normal" }, { min: 148, max: 1000, nota: "⚠️ FOSFATASE ALCALINA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Fosfatase Alcalina Alto" }] },
    "Gama-GT (GGT)": { tipo: "exame", sinonimos: ["ggt", "gama gt"], campos: [{ id: "valor", tipo: "input", label: "Gama-GT (GGT)", unidade: "U/L" }], referencia: { min: 8, max: 61, unidade: "U/L" }, limites: { min: 0, max: 1000 }, notas: [{ min: 0, max: 7, nota: "⚠️ GAMA-GT (GGT) BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Gama-GT (GGT) Baixo" }, { min: 8, max: 61, nota: "✅ Gama-GT (GGT) dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Gama-GT (GGT) Normal" }, { min: 62, max: 1000, nota: "⚠️ GAMA-GT (GGT) ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Gama-GT (GGT) Alto" }] },
    "Amilase": { tipo: "exame", sinonimos: ["amilase"], campos: [{ id: "valor", tipo: "input", label: "Amilase", unidade: "U/L" }], referencia: { min: 23, max: 85, unidade: "U/L" }, limites: { min: 0, max: 2000 }, notas: [{ min: 0, max: 22, nota: "⚠️ AMILASE BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Amilase Baixo" }, { min: 23, max: 85, nota: "✅ Amilase dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Amilase Normal" }, { min: 86, max: 2000, nota: "⚠️ AMILASE ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Amilase Alto" }] },
    "Lipase": { tipo: "exame", sinonimos: ["lipase"], campos: [{ id: "valor", tipo: "input", label: "Lipase", unidade: "U/L" }], referencia: { min: 10, max: 140, unidade: "U/L" }, limites: { min: 0, max: 2000 }, notas: [{ min: 0, max: 9, nota: "⚠️ LIPASE BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Lipase Baixo" }, { min: 10, max: 140, nota: "✅ Lipase dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Lipase Normal" }, { min: 141, max: 2000, nota: "⚠️ LIPASE ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Lipase Alto" }] },
    "Colesterol HDL": { tipo: "exame", sinonimos: ["hdl"], campos: [{ id: "valor", tipo: "input", label: "Colesterol HDL", unidade: "mg/dL" }], referencia: { min: 40, max: 60, unidade: "mg/dL" }, limites: { min: 0, max: 150 }, notas: [{ min: 0, max: 39, nota: "⚠️ COLESTEROL HDL BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Colesterol HDL Baixo" }, { min: 40, max: 60, nota: "✅ Colesterol HDL dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Colesterol HDL Normal" }, { min: 61, max: 150, nota: "⚠️ COLESTEROL HDL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Colesterol HDL Alto" }] },
    "Colesterol LDL": { tipo: "exame", sinonimos: ["ldl"], campos: [{ id: "valor", tipo: "input", label: "Colesterol LDL", unidade: "mg/dL" }], referencia: { min: 0, max: 99, unidade: "mg/dL" }, limites: { min: 0, max: 400 }, notas: [{ min: 0, max: 99, nota: "✅ Colesterol LDL dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Colesterol LDL Normal" }, { min: 100, max: 400, nota: "⚠️ COLESTEROL LDL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Colesterol LDL Alto" }] },
    "Triglicerídeos": { tipo: "exame", sinonimos: ["triglicerideos", "tg"], campos: [{ id: "valor", tipo: "input", label: "Triglicerídeos", unidade: "mg/dL" }], referencia: { min: 0, max: 149, unidade: "mg/dL" }, limites: { min: 0, max: 2000 }, notas: [{ min: 0, max: 149, nota: "✅ Triglicerídeos dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Triglicerídeos Normal" }, { min: 150, max: 2000, nota: "⚠️ TRIGLICERÍDEOS ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Triglicerídeos Alto" }] },
    "Troponina I": { tipo: "exame", sinonimos: ["troponina"], campos: [{ id: "valor", tipo: "input", label: "Troponina I", unidade: "ng/mL" }], referencia: { min: 0, max: 0.04, unidade: "ng/mL" }, limites: { min: 0, max: 50 }, notas: [{ min: 0, max: 0.04, nota: "✅ Troponina I dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Troponina I Normal" }, { min: 0.14, max: 50, nota: "⚠️ TROPONINA I ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Troponina I Alto" }] },
    "CK-MB": { tipo: "exame", sinonimos: ["ck-mb"], campos: [{ id: "valor", tipo: "input", label: "CK-MB", unidade: "U/L" }], referencia: { min: 0, max: 25, unidade: "U/L" }, limites: { min: 0, max: 300 }, notas: [{ min: 0, max: 25, nota: "✅ CK-MB dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "CK-MB Normal" }, { min: 26, max: 300, nota: "⚠️ CK-MB ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "CK-MB Alto" }] },
    "CK Total (CPK)": { tipo: "exame", sinonimos: ["ck", "cpk"], campos: [{ id: "valor", tipo: "input", label: "CK Total (CPK)", unidade: "U/L" }], referencia: { min: 22, max: 198, unidade: "U/L" }, limites: { min: 0, max: 5000 }, notas: [{ min: 0, max: 21, nota: "⚠️ CK TOTAL (CPK) BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "CK Total (CPK) Baixo" }, { min: 22, max: 198, nota: "✅ CK Total (CPK) dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "CK Total (CPK) Normal" }, { min: 199, max: 5000, nota: "⚠️ CK TOTAL (CPK) ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "CK Total (CPK) Alto" }] },
    "BNP": { tipo: "exame", sinonimos: ["bnp"], campos: [{ id: "valor", tipo: "input", label: "BNP", unidade: "pg/mL" }], referencia: { min: 0, max: 100, unidade: "pg/mL" }, limites: { min: 0, max: 5000 }, notas: [{ min: 0, max: 100, nota: "✅ BNP dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "BNP Normal" }, { min: 101, max: 5000, nota: "⚠️ BNP ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "BNP Alto" }] },
    "D-dímero": { tipo: "exame", sinonimos: ["d-dimero"], campos: [{ id: "valor", tipo: "input", label: "D-dímero", unidade: "ng/mL" }], referencia: { min: 0, max: 500, unidade: "ng/mL" }, limites: { min: 0, max: 10000 }, notas: [{ min: 0, max: 500, nota: "✅ D-dímero dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "D-dímero Normal" }, { min: 501, max: 10000, nota: "⚠️ D-DÍMERO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "D-dímero Alto" }] },
    "INR": { tipo: "exame", sinonimos: ["inr"], campos: [{ id: "valor", tipo: "input", label: "INR", unidade: "" }], referencia: { min: 0.8, max: 1.2, unidade: "" }, limites: { min: 0, max: 10 }, notas: [{ min: 0, max: 0.7000000000000001, nota: "⚠️ INR BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "INR Baixo" }, { min: 0.8, max: 1.2, nota: "✅ INR dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "INR Normal" }, { min: 1.3, max: 10, nota: "⚠️ INR ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "INR Alto" }] },
    "TTPA": { tipo: "exame", sinonimos: ["ttpa", "aptt"], campos: [{ id: "valor", tipo: "input", label: "TTPA", unidade: "segundos" }], referencia: { min: 25, max: 35, unidade: "segundos" }, limites: { min: 0, max: 200 }, notas: [{ min: 0, max: 24, nota: "⚠️ TTPA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "TTPA Baixo" }, { min: 25, max: 35, nota: "✅ TTPA dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "TTPA Normal" }, { min: 36, max: 200, nota: "⚠️ TTPA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "TTPA Alto" }] },
    "Fibrinogênio": { tipo: "exame", sinonimos: ["fibrinogenio"], campos: [{ id: "valor", tipo: "input", label: "Fibrinogênio", unidade: "mg/dL" }], referencia: { min: 200, max: 400, unidade: "mg/dL" }, limites: { min: 0, max: 1000 }, notas: [{ min: 0, max: 199, nota: "⚠️ FIBRINOGÊNIO BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Fibrinogênio Baixo" }, { min: 200, max: 400, nota: "✅ Fibrinogênio dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Fibrinogênio Normal" }, { min: 401, max: 1000, nota: "⚠️ FIBRINOGÊNIO ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Fibrinogênio Alto" }] },
    "PSA Total": { tipo: "exame", sinonimos: ["psa"], campos: [{ id: "valor", tipo: "input", label: "PSA Total", unidade: "ng/mL" }], referencia: { min: 0, max: 4, unidade: "ng/mL" }, limites: { min: 0, max: 100 }, notas: [{ min: 0, max: 4, nota: "✅ PSA Total dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "PSA Total Normal" }, { min: 5, max: 100, nota: "⚠️ PSA TOTAL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "PSA Total Alto" }] },
    "CA-125": { tipo: "exame", sinonimos: ["ca125", "ca-125"], campos: [{ id: "valor", tipo: "input", label: "CA-125", unidade: "U/mL" }], referencia: { min: 0, max: 35, unidade: "U/mL" }, limites: { min: 0, max: 1000 }, notas: [{ min: 0, max: 35, nota: "✅ CA-125 dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "CA-125 Normal" }, { min: 36, max: 1000, nota: "⚠️ CA-125 ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "CA-125 Alto" }] },
    "CEA": { tipo: "exame", sinonimos: ["cea"], campos: [{ id: "valor", tipo: "input", label: "CEA", unidade: "ng/mL" }], referencia: { min: 0, max: 3, unidade: "ng/mL" }, limites: { min: 0, max: 100 }, notas: [{ min: 0, max: 3, nota: "✅ CEA dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "CEA Normal" }, { min: 4, max: 100, nota: "⚠️ CEA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "CEA Alto" }] },
    "Alfafetoproteína": { tipo: "exame", sinonimos: ["afp", "alfafetoproteina"], campos: [{ id: "valor", tipo: "input", label: "Alfafetoproteína", unidade: "ng/mL" }], referencia: { min: 0, max: 10, unidade: "ng/mL" }, limites: { min: 0, max: 1000 }, notas: [{ min: 0, max: 10, nota: "✅ Alfafetoproteína dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Alfafetoproteína Normal" }, { min: 11, max: 1000, nota: "⚠️ ALFAFETOPROTEÍNA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Alfafetoproteína Alto" }] },
    "Cortisol Basal": { tipo: "exame", sinonimos: ["cortisol"], campos: [{ id: "valor", tipo: "input", label: "Cortisol Basal", unidade: "µg/dL" }], referencia: { min: 5, max: 23, unidade: "µg/dL" }, limites: { min: 0, max: 60 }, notas: [{ min: 0, max: 4, nota: "⚠️ CORTISOL BASAL BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Cortisol Basal Baixo" }, { min: 5, max: 23, nota: "✅ Cortisol Basal dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Cortisol Basal Normal" }, { min: 24, max: 60, nota: "⚠️ CORTISOL BASAL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Cortisol Basal Alto" }] },
    "Prolactina": { tipo: "exame", sinonimos: ["prolactina"], campos: [{ id: "valor", tipo: "input", label: "Prolactina", unidade: "ng/mL" }], referencia: { min: 4, max: 23, unidade: "ng/mL" }, limites: { min: 0, max: 300 }, notas: [{ min: 0, max: 3, nota: "⚠️ PROLACTINA BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Prolactina Baixo" }, { min: 4, max: 23, nota: "✅ Prolactina dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Prolactina Normal" }, { min: 24, max: 300, nota: "⚠️ PROLACTINA ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Prolactina Alto" }] },
    "Testosterona Total": { tipo: "exame", sinonimos: ["testosterona"], campos: [{ id: "valor", tipo: "input", label: "Testosterona Total", unidade: "ng/dL" }], referencia: { min: 280, max: 1100, unidade: "ng/dL" }, limites: { min: 0, max: 1200 }, notas: [{ min: 0, max: 279, nota: "⚠️ TESTOSTERONA TOTAL BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Testosterona Total Baixo" }, { min: 280, max: 1100, nota: "✅ Testosterona Total dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Testosterona Total Normal" }, { min: 1101, max: 1200, nota: "⚠️ TESTOSTERONA TOTAL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Testosterona Total Alto" }] },
    "Estradiol": { tipo: "exame", sinonimos: ["estradiol"], campos: [{ id: "valor", tipo: "input", label: "Estradiol", unidade: "pg/mL" }], referencia: { min: 15, max: 350, unidade: "pg/mL" }, limites: { min: 0, max: 500 }, notas: [{ min: 0, max: 14, nota: "⚠️ ESTRADIOL BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Estradiol Baixo" }, { min: 15, max: 350, nota: "✅ Estradiol dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Estradiol Normal" }, { min: 351, max: 500, nota: "⚠️ ESTRADIOL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Estradiol Alto" }] },
    "FSH": { tipo: "exame", sinonimos: ["fsh"], campos: [{ id: "valor", tipo: "input", label: "FSH", unidade: "mUI/mL" }], referencia: { min: 1.5, max: 12.4, unidade: "mUI/mL" }, limites: { min: 0, max: 200 }, notas: [{ min: 0, max: 1.4, nota: "⚠️ FSH BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "FSH Baixo" }, { min: 1.5, max: 12.4, nota: "✅ FSH dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "FSH Normal" }, { min: 12.5, max: 200, nota: "⚠️ FSH ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "FSH Alto" }] },
    "LH": { tipo: "exame", sinonimos: ["lh"], campos: [{ id: "valor", tipo: "input", label: "LH", unidade: "mUI/mL" }], referencia: { min: 1.7, max: 8.6, unidade: "mUI/mL" }, limites: { min: 0, max: 200 }, notas: [{ min: 0, max: 1.5999999999999999, nota: "⚠️ LH BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "LH Baixo" }, { min: 1.7, max: 8.6, nota: "✅ LH dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "LH Normal" }, { min: 8.7, max: 200, nota: "⚠️ LH ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "LH Alto" }] },
    "T4 Livre": { tipo: "exame", sinonimos: ["t4 livre"], campos: [{ id: "valor", tipo: "input", label: "T4 Livre", unidade: "ng/dL" }], referencia: { min: 0.7, max: 1.8, unidade: "ng/dL" }, limites: { min: 0, max: 10 }, notas: [{ min: 0, max: 0.6, nota: "⚠️ T4 LIVRE BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "T4 Livre Baixo" }, { min: 0.7, max: 1.8, nota: "✅ T4 Livre dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "T4 Livre Normal" }, { min: 1.9000000000000001, max: 10, nota: "⚠️ T4 LIVRE ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "T4 Livre Alto" }] },
    "T3 Total": { tipo: "exame", sinonimos: ["t3 total"], campos: [{ id: "valor", tipo: "input", label: "T3 Total", unidade: "ng/dL" }], referencia: { min: 80, max: 200, unidade: "ng/dL" }, limites: { min: 0, max: 500 }, notas: [{ min: 0, max: 79, nota: "⚠️ T3 TOTAL BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "T3 Total Baixo" }, { min: 80, max: 200, nota: "✅ T3 Total dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "T3 Total Normal" }, { min: 201, max: 500, nota: "⚠️ T3 TOTAL ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "T3 Total Alto" }] },
    "Paratormônio (PTH)": { tipo: "exame", sinonimos: ["pth", "paratormonio"], campos: [{ id: "valor", tipo: "input", label: "Paratormônio (PTH)", unidade: "pg/mL" }], referencia: { min: 15, max: 65, unidade: "pg/mL" }, limites: { min: 0, max: 2000 }, notas: [{ min: 0, max: 14, nota: "⚠️ PARATORMÔNIO (PTH) BAIXO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "baixo", termo: "Paratormônio (PTH) Baixo" }, { min: 15, max: 65, nota: "✅ Paratormônio (PTH) dentro da faixa de referência (dado fictício de protótipo).", status: "normal", termo: "Paratormônio (PTH) Normal" }, { min: 66, max: 2000, nota: "⚠️ PARATORMÔNIO (PTH) ALTO! (dado fictício de protótipo) Avaliar contexto clínico e repetir se necessário.", status: "alto", termo: "Paratormônio (PTH) Alto" }] },
    "Hepatite A": { tipo: "diagnostico", sinonimos: ["hav", "hepatite a"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Hepatite A — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Hepatite A — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Hepatite A — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Hepatite A — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Hepatite C": { tipo: "diagnostico", sinonimos: ["hcv", "hepatite c"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Hepatite C — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Hepatite C — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Hepatite C — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Hepatite C — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "HIV": { tipo: "diagnostico", sinonimos: ["hiv", "aids"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ HIV — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "HIV — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "HIV — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "HIV — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Sífilis": { tipo: "diagnostico", sinonimos: ["sifilis", "vdrl"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Sífilis — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Sífilis — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Sífilis — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Sífilis — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Dengue": { tipo: "diagnostico", sinonimos: ["dengue"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Dengue — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Dengue — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Dengue — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Dengue — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Zika": { tipo: "diagnostico", sinonimos: ["zika"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Zika — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Zika — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Zika — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Zika — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Chikungunya": { tipo: "diagnostico", sinonimos: ["chikungunya"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Chikungunya — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Chikungunya — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Chikungunya — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Chikungunya — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "COVID-19": { tipo: "diagnostico", sinonimos: ["covid", "sars-cov-2"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ COVID-19 — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "COVID-19 — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "COVID-19 — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "COVID-19 — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Influenza A/B": { tipo: "diagnostico", sinonimos: ["influenza", "gripe"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Influenza A/B — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Influenza A/B — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Influenza A/B — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Influenza A/B — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Leptospirose": { tipo: "diagnostico", sinonimos: ["leptospirose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Leptospirose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Leptospirose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Leptospirose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Leptospirose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Toxoplasmose": { tipo: "diagnostico", sinonimos: ["toxoplasmose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Toxoplasmose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Toxoplasmose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Toxoplasmose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Toxoplasmose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Rubéola": { tipo: "diagnostico", sinonimos: ["rubeola"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Rubéola — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Rubéola — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Rubéola — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Rubéola — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Sarampo": { tipo: "diagnostico", sinonimos: ["sarampo"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Sarampo — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Sarampo — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Sarampo — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Sarampo — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Doença de Chagas": { tipo: "diagnostico", sinonimos: ["chagas"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Doença de Chagas — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Doença de Chagas — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Doença de Chagas — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Doença de Chagas — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Brucelose": { tipo: "diagnostico", sinonimos: ["brucelose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Brucelose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Brucelose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Brucelose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Brucelose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Mononucleose (EBV)": { tipo: "diagnostico", sinonimos: ["mononucleose", "ebv"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Mononucleose (EBV) — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Mononucleose (EBV) — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Mononucleose (EBV) — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Mononucleose (EBV) — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Citomegalovírus (CMV)": { tipo: "diagnostico", sinonimos: ["cmv", "citomegalovirus"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Citomegalovírus (CMV) — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Citomegalovírus (CMV) — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Citomegalovírus (CMV) — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Citomegalovírus (CMV) — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Herpes Simples (HSV)": { tipo: "diagnostico", sinonimos: ["herpes", "hsv"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Herpes Simples (HSV) — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Herpes Simples (HSV) — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Herpes Simples (HSV) — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Herpes Simples (HSV) — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Febre Amarela": { tipo: "diagnostico", sinonimos: ["febre amarela"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Febre Amarela — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Febre Amarela — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Febre Amarela — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Febre Amarela — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Esquistossomose": { tipo: "diagnostico", sinonimos: ["esquistossomose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Esquistossomose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Esquistossomose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Esquistossomose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Esquistossomose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Filariose": { tipo: "diagnostico", sinonimos: ["filariose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Filariose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Filariose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Filariose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Filariose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Leishmaniose Visceral": { tipo: "diagnostico", sinonimos: ["leishmaniose", "calazar"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Leishmaniose Visceral — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Leishmaniose Visceral — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Leishmaniose Visceral — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Leishmaniose Visceral — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Parvovírus B19": { tipo: "diagnostico", sinonimos: ["parvovirus"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Parvovírus B19 — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Parvovírus B19 — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Parvovírus B19 — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Parvovírus B19 — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Coqueluche": { tipo: "diagnostico", sinonimos: ["coqueluche", "pertussis"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Coqueluche — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Coqueluche — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Coqueluche — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Coqueluche — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Difteria": { tipo: "diagnostico", sinonimos: ["difteria"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Difteria — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Difteria — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Difteria — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Difteria — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Tétano": { tipo: "diagnostico", sinonimos: ["tetano"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Tétano — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Tétano — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Tétano — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Tétano — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Hantavirose": { tipo: "diagnostico", sinonimos: ["hantavirose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Hantavirose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Hantavirose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Hantavirose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Hantavirose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Riquetsiose": { tipo: "diagnostico", sinonimos: ["riquetsiose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Riquetsiose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Riquetsiose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Riquetsiose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Riquetsiose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Doença de Lyme": { tipo: "diagnostico", sinonimos: ["lyme"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Doença de Lyme — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Doença de Lyme — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Doença de Lyme — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Doença de Lyme — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Varicela": { tipo: "diagnostico", sinonimos: ["varicela", "catapora"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Varicela — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Varicela — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Varicela — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Varicela — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Caxumba": { tipo: "diagnostico", sinonimos: ["caxumba", "parotidite"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Caxumba — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Caxumba — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Caxumba — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Caxumba — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Listeriose": { tipo: "diagnostico", sinonimos: ["listeriose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Listeriose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Listeriose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Listeriose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Listeriose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Criptococose": { tipo: "diagnostico", sinonimos: ["criptococose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Criptococose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Criptococose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Criptococose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Criptococose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Histoplasmose": { tipo: "diagnostico", sinonimos: ["histoplasmose"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Histoplasmose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Histoplasmose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Histoplasmose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Histoplasmose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Paracoccidioidomicose": { tipo: "diagnostico", sinonimos: ["paracoco", "blastomicose sul-americana"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Paracoccidioidomicose — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Paracoccidioidomicose — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Paracoccidioidomicose — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Paracoccidioidomicose — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Amebíase": { tipo: "diagnostico", sinonimos: ["amebiase"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Amebíase — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Amebíase — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Amebíase — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Amebíase — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Giardíase": { tipo: "diagnostico", sinonimos: ["giardiase"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Giardíase — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Giardíase — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Giardíase — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Giardíase — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Ancilostomíase": { tipo: "diagnostico", sinonimos: ["ancilostomiase"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Ancilostomíase — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Ancilostomíase — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Ancilostomíase — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Ancilostomíase — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Ascaridíase": { tipo: "diagnostico", sinonimos: ["ascaridiase"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Ascaridíase — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Ascaridíase — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Ascaridíase — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Ascaridíase — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Teníase": { tipo: "diagnostico", sinonimos: ["teniase"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Teníase — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Teníase — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Teníase — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Teníase — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Estrongiloidíase": { tipo: "diagnostico", sinonimos: ["estrongiloidiase"], limites: { min: 0, max: 1 }, campos: [{ id: "igm", tipo: "select", label: "IgM", opcoes: ["Reagente", "Não Reagente"] }, { id: "igg", tipo: "select", label: "IgG", opcoes: ["Reagente", "Não Reagente"] }], estagios: [{ valores: { igm: "Reagente", igg: "Não Reagente" }, status: "grave", classificacao: "Infecção Aguda", nota: "⚠️ Estrongiloidíase — perfil sugestivo de INFECÇÃO AGUDA (dado fictício de protótipo). Notificar se aplicável e iniciar conduta clínica adequada.", fase: "Aguda" }, { valores: { igm: "Reagente", igg: "Reagente" }, status: "moderado", classificacao: "Infecção Recente/em Evolução", nota: "Estrongiloidíase — perfil sugestivo de infecção recente ou em fase de soroconversão (dado fictício de protótipo). Repetir sorologia em 2-3 semanas.", fase: "Evolução" }, { valores: { igm: "Não Reagente", igg: "Reagente" }, status: "imune", classificacao: "Infecção Pregressa/Imunidade", nota: "Estrongiloidíase — perfil sugestivo de contato prévio ou imunidade (dado fictício de protótipo). Sem sinais de infecção ativa.", fase: "Pregressa" }, { valores: { igm: "Não Reagente", igg: "Não Reagente" }, status: "negativo", classificacao: "Negativo/Susceptível", nota: "Estrongiloidíase — sorologia negativa (dado fictício de protótipo). Paciente susceptível; considerar vacinação se disponível e indicada.", fase: "Ausente" }] },
    "Síndrome Nefrótica": { tipo: "diagnostico", sinonimos: ["nefrotica"], limites: { min: 0, max: 10 }, campos: [{ id: "proteinuria", tipo: "input", label: "Proteinúria 24h", unidade: "g/24h" }], estagios: [{ valores: { proteinuria: [0, 0.14] }, status: "negativo", classificacao: "Negativo", nota: "Proteinúria normal. Síndrome nefrótica improvável (dado fictício).", fase: "Ausente" }, { valores: { proteinuria: [0.15, 3.4] }, status: "leve", classificacao: "Proteinúria Leve", nota: "Proteinúria leve. Acompanhar função renal (dado fictício).", fase: "Inicial" }, { valores: { proteinuria: [3.5, 10] }, status: "grave", classificacao: "Síndrome Nefrótica", nota: "⚠️ Proteinúria em faixa nefrótica! Avaliar edema, albumina e lipidograma (dado fictício).", fase: "Estabelecida" }] },
    "Síndrome Nefrítica": { tipo: "diagnostico", sinonimos: ["nefritica"], limites: { min: 0, max: 1000 }, campos: [{ id: "hematuria", tipo: "input", label: "Hemácias na Urina", unidade: "céls/campo" }], estagios: [{ valores: { hematuria: [0, 5] }, status: "negativo", classificacao: "Negativo", nota: "Sedimento urinário normal (dado fictício).", fase: "Ausente" }, { valores: { hematuria: [6, 50] }, status: "moderado", classificacao: "Hematúria Significativa", nota: "Hematúria presente. Investigar função renal e proteinúria (dado fictício).", fase: "Investigação" }, { valores: { hematuria: [51, 1000] }, status: "grave", classificacao: "Provável Síndrome Nefrítica", nota: "⚠️ Hematúria intensa! Avaliar hipertensão e edema associados (dado fictício).", fase: "Estabelecida" }] },
    "Pielonefrite": { tipo: "diagnostico", sinonimos: ["pielonefrite"], limites: { min: 0, max: 1000 }, campos: [{ id: "leucocituria", tipo: "input", label: "Leucocitúria", unidade: "céls/campo" }], estagios: [{ valores: { leucocituria: [0, 5] }, status: "negativo", classificacao: "Negativo", nota: "Sedimento urinário sem piúria (dado fictício).", fase: "Ausente" }, { valores: { leucocituria: [6, 20] }, status: "leve", classificacao: "Suspeita de ITU Baixa", nota: "Leucocitúria leve. Correlacionar com clínica e urocultura (dado fictício).", fase: "Investigação" }, { valores: { leucocituria: [21, 1000] }, status: "grave", classificacao: "Provável Pielonefrite", nota: "⚠️ Piúria intensa + febre/dor lombar sugerem pielonefrite! Iniciar antibioticoterapia empírica (dado fictício).", fase: "Estabelecida" }] },
    "Infecção do Trato Urinário": { tipo: "diagnostico", sinonimos: ["itu", "cistite"], limites: { min: 0, max: 1 }, campos: [{ id: "nitrito", tipo: "input", label: "Nitrito/Leucócito Esterase", unidade: "índice" }], estagios: [{ valores: { nitrito: [0, 0] }, status: "negativo", classificacao: "Negativo", nota: "Exame de urina sem sinais de infecção (dado fictício).", fase: "Ausente" }, { valores: { nitrito: [1, 1] }, status: "leve", classificacao: "Provável ITU Baixa", nota: "Nitrito/esterase positivos. Considerar antibioticoterapia conforme urocultura (dado fictício).", fase: "Estabelecida" }] },
    "Colecistite Aguda": { tipo: "diagnostico", sinonimos: ["colecistite"], limites: { min: 0, max: 1 }, campos: [{ id: "murphy", tipo: "input", label: "Sinal de Murphy (0=Ausente,1=Presente)" }], estagios: [{ valores: { murphy: [0, 0] }, status: "negativo", classificacao: "Improvável", nota: "Sinal de Murphy ausente. Colecistite aguda improvável (dado fictício).", fase: "Ausente" }, { valores: { murphy: [1, 1] }, status: "grave", classificacao: "Provável Colecistite Aguda", nota: "⚠️ Sinal de Murphy presente! Correlacionar com ultrassom e leucograma (dado fictício).", fase: "Estabelecida" }] },
    "Apendicite Aguda": { tipo: "diagnostico", sinonimos: ["apendicite"], limites: { min: 0, max: 1 }, campos: [{ id: "blumberg", tipo: "input", label: "Sinal de Blumberg (0=Ausente,1=Presente)" }], estagios: [{ valores: { blumberg: [0, 0] }, status: "negativo", classificacao: "Improvável", nota: "Descompressão brusca negativa (dado fictício).", fase: "Ausente" }, { valores: { blumberg: [1, 1] }, status: "grave", classificacao: "Provável Apendicite Aguda", nota: "⚠️ Blumberg positivo! Avaliar cirurgia e correlacionar com escala de Alvarado (dado fictício).", fase: "Estabelecida" }] },
    "Úlcera Péptica": { tipo: "diagnostico", sinonimos: ["ulcera peptica"], limites: { min: 0, max: 1 }, campos: [{ id: "helicobacter", tipo: "input", label: "Teste para H. pylori (0=Negativo,1=Positivo)" }], estagios: [{ valores: { helicobacter: [0, 0] }, status: "negativo", classificacao: "Negativo", nota: "Teste para H. pylori negativo (dado fictício).", fase: "Ausente" }, { valores: { helicobacter: [1, 1] }, status: "moderado", classificacao: "Positivo para H. pylori", nota: "H. pylori positivo. Considerar terapia de erradicação (dado fictício).", fase: "Estabelecida" }] },
    "Doença Celíaca": { tipo: "diagnostico", sinonimos: ["celiaca"], limites: { min: 0, max: 1000 }, campos: [{ id: "antitransglutaminase", tipo: "input", label: "Anti-transglutaminase IgA", unidade: "U/mL" }], estagios: [{ valores: { antitransglutaminase: [0, 10] }, status: "negativo", classificacao: "Negativo", nota: "Anticorpo dentro da normalidade (dado fictício).", fase: "Ausente" }, { valores: { antitransglutaminase: [11, 1000] }, status: "grave", classificacao: "Sugestivo de Doença Celíaca", nota: "⚠️ Anti-transglutaminase elevado! Confirmar com biópsia duodenal (dado fictício).", fase: "Estabelecida" }] },
    "Doença Inflamatória Intestinal": { tipo: "diagnostico", sinonimos: ["dii", "crohn", "retocolite"], limites: { min: 0, max: 10000 }, campos: [{ id: "calprotectina", tipo: "input", label: "Calprotectina Fecal", unidade: "µg/g" }], estagios: [{ valores: { calprotectina: [0, 50] }, status: "negativo", classificacao: "Negativo", nota: "Calprotectina fecal normal (dado fictício).", fase: "Ausente" }, { valores: { calprotectina: [51, 200] }, status: "moderado", classificacao: "Inflamação Intestinal Leve/Moderada", nota: "Calprotectina elevada. Correlacionar com endoscopia (dado fictício).", fase: "Investigação" }, { valores: { calprotectina: [201, 10000] }, status: "grave", classificacao: "Sugestivo de DII Ativa", nota: "⚠️ Calprotectina muito elevada! Sugestivo de atividade inflamatória significativa (dado fictício).", fase: "Estabelecida" }] },
    "Asma": { tipo: "diagnostico", sinonimos: ["asma"], limites: { min: 0, max: 100 }, campos: [{ id: "pico_fluxo", tipo: "input", label: "Pico de Fluxo Expiratório (% previsto)", unidade: "%" }], estagios: [{ valores: { pico_fluxo: [0, 49] }, status: "grave", classificacao: "Asma Grave", nota: "⚠️ Pico de fluxo muito reduzido! Risco de exacerbação grave (dado fictício).", fase: "Descompensada" }, { valores: { pico_fluxo: [50, 79] }, status: "moderado", classificacao: "Asma Moderada", nota: "Pico de fluxo reduzido. Ajustar broncodilatador (dado fictício).", fase: "Parcialmente Controlada" }, { valores: { pico_fluxo: [80, 100] }, status: "negativo", classificacao: "Controlada", nota: "Pico de fluxo dentro do esperado (dado fictício).", fase: "Controlada" }] },
    "DPOC": { tipo: "diagnostico", sinonimos: ["dpoc"], limites: { min: 0, max: 150 }, campos: [{ id: "vef1", tipo: "input", label: "VEF1 (% previsto)", unidade: "%" }], estagios: [{ valores: { vef1: [0, 29] }, status: "grave", classificacao: "DPOC Muito Grave (GOLD 4)", nota: "⚠️ VEF1 muito reduzido! Estágio avançado (dado fictício).", fase: "GOLD 4" }, { valores: { vef1: [30, 49] }, status: "moderado", classificacao: "DPOC Grave (GOLD 3)", nota: "VEF1 reduzido. Estágio grave (dado fictício).", fase: "GOLD 3" }, { valores: { vef1: [50, 79] }, status: "leve", classificacao: "DPOC Moderado (GOLD 2)", nota: "VEF1 levemente reduzido (dado fictício).", fase: "GOLD 2" }, { valores: { vef1: [80, 150] }, status: "negativo", classificacao: "DPOC Leve (GOLD 1) ou Ausente", nota: "VEF1 dentro do esperado ou levemente alterado (dado fictício).", fase: "GOLD 1" }] },
    "Tuberculose Extrapulmonar": { tipo: "diagnostico", sinonimos: ["tb extrapulmonar"], limites: { min: 0, max: 200 }, campos: [{ id: "adenosina_deaminase", tipo: "input", label: "ADA (líquido pleural/pericárdico)", unidade: "U/L" }], estagios: [{ valores: { adenosina_deaminase: [0, 39] }, status: "negativo", classificacao: "Improvável", nota: "ADA normal, tuberculose extrapulmonar improvável (dado fictício).", fase: "Ausente" }, { valores: { adenosina_deaminase: [40, 200] }, status: "grave", classificacao: "Sugestivo de TB Extrapulmonar", nota: "⚠️ ADA elevada! Sugestivo de tuberculose extrapulmonar (dado fictício).", fase: "Estabelecida" }] },
    "Anemia Ferropriva": { tipo: "diagnostico", sinonimos: ["anemia ferropriva"], limites: { min: 0, max: 200 }, campos: [{ id: "vcm", tipo: "input", label: "VCM", unidade: "fL" }], estagios: [{ valores: { vcm: [0, 79] }, status: "grave", classificacao: "Anemia Microcítica (sugestivo ferropriva)", nota: "⚠️ VCM baixo! Sugestivo de anemia ferropriva. Solicitar ferritina (dado fictício).", fase: "Microcítica" }, { valores: { vcm: [80, 100] }, status: "negativo", classificacao: "Normocítica", nota: "VCM normal (dado fictício).", fase: "Normocítica" }, { valores: { vcm: [101, 200] }, status: "moderado", classificacao: "Macrocítica (investigar B12/Folato)", nota: "VCM elevado. Investigar deficiência de B12/folato (dado fictício).", fase: "Macrocítica" }] },
    "Anemia por Doença Crônica": { tipo: "diagnostico", sinonimos: ["anemia doenca cronica"], limites: { min: 0, max: 300 }, campos: [{ id: "ferritina_pdc", tipo: "input", label: "Ferritina", unidade: "ng/mL" }], estagios: [{ valores: { ferritina_pdc: [0, 29] }, status: "leve", classificacao: "Improvável", nota: "Ferritina baixa, mais sugestivo de ferropenia que doença crônica (dado fictício).", fase: "Ausente" }, { valores: { ferritina_pdc: [30, 300] }, status: "moderado", classificacao: "Sugestivo de Anemia de Doença Crônica", nota: "Ferritina normal/elevada em contexto inflamatório (dado fictício).", fase: "Estabelecida" }] },
    "Anemia Megaloblástica": { tipo: "diagnostico", sinonimos: ["anemia megaloblastica"], limites: { min: 0, max: 200 }, campos: [{ id: "vcm_meg", tipo: "input", label: "VCM", unidade: "fL" }], estagios: [{ valores: { vcm_meg: [0, 99] }, status: "negativo", classificacao: "Improvável", nota: "VCM normal (dado fictício).", fase: "Ausente" }, { valores: { vcm_meg: [100, 200] }, status: "grave", classificacao: "Sugestivo de Anemia Megaloblástica", nota: "⚠️ VCM muito elevado! Investigar B12 e ácido fólico (dado fictício).", fase: "Estabelecida" }] },
    "Lúpus Eritematoso Sistêmico": { tipo: "diagnostico", sinonimos: ["lupus", "les"], limites: { min: 0, max: 10000 }, campos: [{ id: "fan", tipo: "input", label: "FAN (título)", unidade: "1/n" }], estagios: [{ valores: { fan: [0, 79] }, status: "negativo", classificacao: "Negativo", nota: "FAN negativo ou em título baixo (dado fictício).", fase: "Ausente" }, { valores: { fan: [80, 10000] }, status: "grave", classificacao: "FAN Positivo — Sugestivo de LES", nota: "⚠️ FAN em título elevado! Correlacionar com critérios clínicos (dado fictício).", fase: "Investigação" }] },
    "Artrite Reumatoide": { tipo: "diagnostico", sinonimos: ["artrite reumatoide", "ar"], limites: { min: 0, max: 1000 }, campos: [{ id: "fator_reumatoide", tipo: "input", label: "Fator Reumatoide", unidade: "UI/mL" }], estagios: [{ valores: { fator_reumatoide: [0, 19] }, status: "negativo", classificacao: "Negativo", nota: "Fator reumatoide negativo (dado fictício).", fase: "Ausente" }, { valores: { fator_reumatoide: [20, 1000] }, status: "grave", classificacao: "Positivo — Sugestivo de AR", nota: "⚠️ Fator reumatoide positivo! Correlacionar com clínica articular (dado fictício).", fase: "Investigação" }] },
    "Febre Reumática": { tipo: "diagnostico", sinonimos: ["febre reumatica"], limites: { min: 0, max: 5000 }, campos: [{ id: "aslo", tipo: "input", label: "ASLO (Anti-estreptolisina O)", unidade: "UI/mL" }], estagios: [{ valores: { aslo: [0, 199] }, status: "negativo", classificacao: "Negativo", nota: "ASLO dentro da normalidade (dado fictício).", fase: "Ausente" }, { valores: { aslo: [200, 5000] }, status: "grave", classificacao: "Positivo — Sugestivo de Febre Reumática", nota: "⚠️ ASLO elevado! Correlacionar com critérios de Jones (dado fictício).", fase: "Investigação" }] },
    "Gota": { tipo: "diagnostico", sinonimos: ["gota", "artrite gotosa"], limites: { min: 0, max: 20 }, campos: [{ id: "acido_urico_gota", tipo: "input", label: "Ácido Úrico", unidade: "mg/dL" }], estagios: [{ valores: { acido_urico_gota: [0, 6.9] }, status: "negativo", classificacao: "Improvável", nota: "Ácido úrico dentro da normalidade (dado fictício).", fase: "Ausente" }, { valores: { acido_urico_gota: [7, 20] }, status: "grave", classificacao: "Hiperuricemia — Sugestivo de Gota", nota: "⚠️ Ácido úrico elevado! Correlacionar com quadro articular agudo (dado fictício).", fase: "Estabelecida" }] },
    "Osteoporose": { tipo: "diagnostico", sinonimos: ["osteoporose"], limites: { min: -10, max: 4 }, campos: [{ id: "escore_t", tipo: "input", label: "Escore T (Densitometria)", unidade: "DP" }], estagios: [{ valores: { escore_t: [-10, -2.6] }, status: "grave", classificacao: "Osteoporose", nota: "⚠️ Escore T ≤ -2.5! Compatível com osteoporose (dado fictício).", fase: "Estabelecida" }, { valores: { escore_t: [-2.5, -1.1] }, status: "moderado", classificacao: "Osteopenia", nota: "Escore T entre -2.5 e -1.0. Compatível com osteopenia (dado fictício).", fase: "Intermediária" }, { valores: { escore_t: [-1, 4] }, status: "negativo", classificacao: "Normal", nota: "Densidade mineral óssea normal (dado fictício).", fase: "Ausente" }] },
    "Índice de Choque": { tipo: "escala", sinonimos: ["shock index"], referencia: { min: 0.5, max: 0.7, label: "Normal" }, limites: { min: 0, max: 3 }, campos: [{ id: "fc", tipo: "input", label: "Frequência Cardíaca", unidade: "bpm", min: 20, max: 250 }, { id: "pas", tipo: "input", label: "Pressão Arterial Sistólica", unidade: "mmHg", min: 30, max: 300 }], formula: "fc / pas", estagios: [{ soma_min: 0, soma_max: 0.49, status: "baixo", classificacao: "Baixo", nota: "Índice de choque baixo (dado fictício de protótipo).", interpretacao: "Estável" }, { soma_min: 0.5, soma_max: 0.7, status: "bom", classificacao: "Normal", nota: "Índice de choque normal (dado fictício de protótipo).", interpretacao: "Estável" }, { soma_min: 0.71, soma_max: 1.0, status: "moderado", classificacao: "Elevado", nota: "Índice de choque elevado. Considerar hipovolemia/choque compensado (dado fictício).", interpretacao: "Atenção" }, { soma_min: 1.01, soma_max: 3, status: "grave", classificacao: "Crítico", nota: "⚠️ Índice de choque crítico! Sugestivo de choque hemodinâmico (dado fictício).", interpretacao: "Risco" }] },
    "Superfície Corporal (Mosteller)": { tipo: "escala", sinonimos: ["superficie corporal", "bsa"], referencia: { min: 1.5, max: 2.0, label: "Adulto médio" }, limites: { min: 0, max: 3 }, campos: [{ id: "peso", tipo: "input", label: "Peso", unidade: "kg", min: 1, max: 500 }, { id: "altura", tipo: "input", label: "Altura", unidade: "cm", min: 30, max: 250 }], formula: "Math.sqrt((peso * altura) / 3600)", estagios: [{ soma_min: 0, soma_max: 0.99, status: "baixo", classificacao: "Reduzida", nota: "Superfície corporal reduzida (dado fictício de protótipo).", interpretacao: "Referência" }, { soma_min: 1.0, soma_max: 2.5, status: "bom", classificacao: "Dentro do esperado", nota: "Superfície corporal dentro do esperado para um adulto (dado fictício).", interpretacao: "Referência" }, { soma_min: 2.51, soma_max: 3, status: "moderado", classificacao: "Elevada", nota: "Superfície corporal elevada (dado fictício de protótipo).", interpretacao: "Referência" }] },
    "Osmolaridade Sérica Calculada": { tipo: "escala", sinonimos: ["osmolaridade"], referencia: { min: 275, max: 295, label: "Normal" }, limites: { min: 200, max: 400 }, campos: [{ id: "sodio", tipo: "input", label: "Sódio", unidade: "mEq/L", min: 100, max: 180 }, { id: "glicemia", tipo: "input", label: "Glicemia", unidade: "mg/dL", min: 10, max: 2000 }, { id: "ureia", tipo: "input", label: "Ureia", unidade: "mg/dL", min: 1, max: 300 }], formula: "(2 * sodio) + (glicemia / 18) + (ureia / 6)", estagios: [{ soma_min: 200, soma_max: 274.9, status: "baixo", classificacao: "Hipo-osmolar", nota: "Osmolaridade calculada baixa (dado fictício de protótipo).", interpretacao: "Atenção" }, { soma_min: 275, soma_max: 295, status: "bom", classificacao: "Normal", nota: "Osmolaridade calculada normal (dado fictício de protótipo).", interpretacao: "Estável" }, { soma_min: 295.1, soma_max: 400, status: "grave", classificacao: "Hiperosmolar", nota: "⚠️ Osmolaridade calculada elevada! Avaliar estado de hidratação (dado fictício).", interpretacao: "Risco" }] },
    "Anion Gap": { tipo: "escala", sinonimos: ["anion gap", "hiato anionico"], referencia: { min: 8, max: 12, label: "Normal" }, limites: { min: -10, max: 40 }, campos: [{ id: "sodio_ag", tipo: "input", label: "Sódio", unidade: "mEq/L", min: 100, max: 180 }, { id: "cloro_ag", tipo: "input", label: "Cloro", unidade: "mEq/L", min: 50, max: 150 }, { id: "bicarbonato", tipo: "input", label: "Bicarbonato", unidade: "mEq/L", min: 1, max: 50 }], formula: "sodio_ag - (cloro_ag + bicarbonato)", estagios: [{ soma_min: -10, soma_max: 7.9, status: "baixo", classificacao: "Reduzido", nota: "Anion gap reduzido (dado fictício de protótipo).", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 12, status: "bom", classificacao: "Normal", nota: "Anion gap dentro da normalidade (dado fictício).", interpretacao: "Estável" }, { soma_min: 12.1, soma_max: 40, status: "grave", classificacao: "Elevado", nota: "⚠️ Anion gap elevado! Investigar acidose metabólica com ânion gap aumentado (dado fictício).", interpretacao: "Risco" }] },
    "Cálcio Corrigido": { tipo: "escala", sinonimos: ["calcio corrigido"], referencia: { min: 8.5, max: 10.5, label: "Normal" }, limites: { min: 0, max: 20 }, campos: [{ id: "calcio_total", tipo: "input", label: "Cálcio Total", unidade: "mg/dL", min: 1, max: 20 }, { id: "albumina_cc", tipo: "input", label: "Albumina", unidade: "g/dL", min: 0.5, max: 6 }], formula: "calcio_total + (0.8 * (4 - albumina_cc))", estagios: [{ soma_min: 0, soma_max: 8.4, status: "baixo", classificacao: "Hipocalcemia Corrigida", nota: "Cálcio corrigido baixo (dado fictício de protótipo).", interpretacao: "Atenção" }, { soma_min: 8.5, soma_max: 10.5, status: "bom", classificacao: "Normal", nota: "Cálcio corrigido normal (dado fictício).", interpretacao: "Estável" }, { soma_min: 10.6, soma_max: 20, status: "grave", classificacao: "Hipercalcemia Corrigida", nota: "⚠️ Cálcio corrigido elevado! Investigar causa (dado fictício).", interpretacao: "Risco" }] },
    "LDL Calculado (Friedewald)": { tipo: "escala", sinonimos: ["ldl calculado", "friedewald"], referencia: { min: 0, max: 99, label: "Ótimo" }, limites: { min: 0, max: 500 }, campos: [{ id: "col_total", tipo: "input", label: "Colesterol Total", unidade: "mg/dL", min: 50, max: 600 }, { id: "hdl_f", tipo: "input", label: "HDL", unidade: "mg/dL", min: 5, max: 150 }, { id: "tg_f", tipo: "input", label: "Triglicerídeos", unidade: "mg/dL", min: 10, max: 800 }], formula: "col_total - hdl_f - (tg_f / 5)", estagios: [{ soma_min: 0, soma_max: 99, status: "bom", classificacao: "Ótimo", nota: "LDL calculado ótimo (dado fictício de protótipo).", interpretacao: "Estável" }, { soma_min: 99.1, soma_max: 159, status: "moderado", classificacao: "Limítrofe/Alto", nota: "LDL calculado limítrofe a alto. Orientar dieta (dado fictício).", interpretacao: "Atenção" }, { soma_min: 159.1, soma_max: 500, status: "grave", classificacao: "Muito Alto", nota: "⚠️ LDL calculado muito alto! Avaliar risco cardiovascular (dado fictício).", interpretacao: "Risco" }] },
    "Clearance de Creatinina (Cockcroft-Gault)": { tipo: "escala", sinonimos: ["clearance de creatinina", "cockcroft-gault"], referencia: { min: 90, max: 150, label: "Normal" }, limites: { min: 0, max: 300 }, campos: [{ id: "idade_cg", tipo: "input", label: "Idade", unidade: "anos", min: 1, max: 120 }, { id: "peso_cg", tipo: "input", label: "Peso", unidade: "kg", min: 1, max: 300 }, { id: "creatinina_cg", tipo: "input", label: "Creatinina", unidade: "mg/dL", min: 0.1, max: 20 }], formula: "((140 - idade_cg) * peso_cg) / (72 * creatinina_cg)", estagios: [{ soma_min: 0, soma_max: 29.9, status: "grave", classificacao: "Insuficiência Renal Grave", nota: "⚠️ Clearance muito reduzido! Avaliar necessidade de terapia renal substitutiva (dado fictício).", interpretacao: "Risco" }, { soma_min: 30, soma_max: 59.9, status: "moderado", classificacao: "Insuficiência Renal Moderada", nota: "Clearance reduzido. Ajustar doses de medicamentos (dado fictício).", interpretacao: "Atenção" }, { soma_min: 60, soma_max: 89.9, status: "leve", classificacao: "Insuficiência Renal Leve", nota: "Clearance levemente reduzido (dado fictício).", interpretacao: "Atenção" }, { soma_min: 90, soma_max: 300, status: "bom", classificacao: "Normal", nota: "Clearance de creatinina normal (dado fictício).", interpretacao: "Estável" }] },
    "QTc (Fórmula de Bazett)": { tipo: "escala", sinonimos: ["qtc", "bazett"], referencia: { min: 350, max: 450, label: "Normal" }, limites: { min: 100, max: 800 }, campos: [{ id: "qt", tipo: "input", label: "Intervalo QT", unidade: "ms", min: 100, max: 800 }, { id: "rr", tipo: "input", label: "Intervalo RR", unidade: "s", min: 0.2, max: 2.5 }], formula: "qt / Math.sqrt(rr)", estagios: [{ soma_min: 100, soma_max: 349.9, status: "baixo", classificacao: "QTc Curto", nota: "QTc calculado curto (dado fictício de protótipo).", interpretacao: "Atenção" }, { soma_min: 350, soma_max: 450, status: "bom", classificacao: "Normal", nota: "QTc calculado normal (dado fictício).", interpretacao: "Estável" }, { soma_min: 450.1, soma_max: 800, status: "grave", classificacao: "QTc Prolongado", nota: "⚠️ QTc prolongado! Risco de arritmia (torsades de pointes). Revisar medicações (dado fictício).", interpretacao: "Risco" }] },
    "Relação Cintura-Quadril": { tipo: "escala", sinonimos: ["rcq", "relacao cintura quadril"], referencia: { min: 0.7, max: 0.85, label: "Normal" }, limites: { min: 0.5, max: 1.5 }, campos: [{ id: "cintura", tipo: "input", label: "Circunferência da Cintura", unidade: "cm", min: 30, max: 200 }, { id: "quadril", tipo: "input", label: "Circunferência do Quadril", unidade: "cm", min: 30, max: 200 }], formula: "cintura / quadril", estagios: [{ soma_min: 0.5, soma_max: 0.85, status: "bom", classificacao: "Baixo Risco", nota: "Relação cintura-quadril dentro do esperado (dado fictício).", interpretacao: "Estável" }, { soma_min: 0.86, soma_max: 1.5, status: "grave", classificacao: "Alto Risco Cardiometabólico", nota: "⚠️ Relação cintura-quadril elevada! Risco cardiometabólico aumentado (dado fictício).", interpretacao: "Risco" }] },
    "Taxa de Filtração Glomerular (CKD-EPI Simplificado)": { tipo: "escala", sinonimos: ["tfg", "ckd-epi"], referencia: { min: 90, max: 150, label: "Normal" }, limites: { min: 0, max: 300 }, campos: [{ id: "creatinina_tfg", tipo: "input", label: "Creatinina", unidade: "mg/dL", min: 0.1, max: 20 }, { id: "idade_tfg", tipo: "input", label: "Idade", unidade: "anos", min: 1, max: 120 }], formula: "141 * Math.pow(0.993, idade_tfg) / creatinina_tfg", estagios: [{ soma_min: 0, soma_max: 14.9, status: "grave", classificacao: "DRC Estágio 5 (Falência Renal)", nota: "⚠️ TFG muito reduzida! Estágio terminal (dado fictício).", interpretacao: "Risco" }, { soma_min: 15, soma_max: 29.9, status: "grave", classificacao: "DRC Estágio 4", nota: "⚠️ TFG gravemente reduzida (dado fictício).", interpretacao: "Risco" }, { soma_min: 30, soma_max: 59.9, status: "moderado", classificacao: "DRC Estágio 3", nota: "TFG moderadamente reduzida (dado fictício).", interpretacao: "Atenção" }, { soma_min: 60, soma_max: 89.9, status: "leve", classificacao: "DRC Estágio 2", nota: "TFG levemente reduzida (dado fictício).", interpretacao: "Atenção" }, { soma_min: 90, soma_max: 300, status: "bom", classificacao: "Normal (Estágio 1)", nota: "TFG normal (dado fictício).", interpretacao: "Estável" }] },
    "Débito Cardíaco Estimado (Fórmula Simplificada)": { tipo: "escala", sinonimos: ["debito cardiaco"], referencia: { min: 4, max: 8, label: "Normal" }, limites: { min: 0, max: 20 }, campos: [{ id: "vs", tipo: "input", label: "Volume Sistólico", unidade: "mL", min: 10, max: 200 }, { id: "fc_dc", tipo: "input", label: "Frequência Cardíaca", unidade: "bpm", min: 20, max: 250 }], formula: "(vs * fc_dc) / 1000", estagios: [{ soma_min: 0, soma_max: 3.9, status: "baixo", classificacao: "Débito Cardíaco Baixo", nota: "Débito cardíaco estimado reduzido (dado fictício de protótipo).", interpretacao: "Atenção" }, { soma_min: 4, soma_max: 8, status: "bom", classificacao: "Normal", nota: "Débito cardíaco estimado normal (dado fictício).", interpretacao: "Estável" }, { soma_min: 8.1, soma_max: 20, status: "moderado", classificacao: "Débito Cardíaco Elevado", nota: "Débito cardíaco estimado elevado (dado fictício).", interpretacao: "Atenção" }] },
    "Pressão Arterial Média (PAM)": { tipo: "escala", sinonimos: ["pam", "pressao arterial media"], referencia: { min: 70, max: 100, label: "Normal" }, limites: { min: 0, max: 200 }, campos: [{ id: "pas_pam", tipo: "input", label: "Pressão Sistólica", unidade: "mmHg", min: 30, max: 300 }, { id: "pad_pam", tipo: "input", label: "Pressão Diastólica", unidade: "mmHg", min: 10, max: 200 }], formula: "((2 * pad_pam) + pas_pam) / 3", estagios: [{ soma_min: 0, soma_max: 69.9, status: "grave", classificacao: "PAM Baixa", nota: "⚠️ PAM baixa! Risco de hipoperfusão de órgãos (dado fictício).", interpretacao: "Risco" }, { soma_min: 70, soma_max: 100, status: "bom", classificacao: "Normal", nota: "PAM dentro do esperado (dado fictício).", interpretacao: "Estável" }, { soma_min: 100.1, soma_max: 200, status: "moderado", classificacao: "PAM Elevada", nota: "PAM elevada. Correlacionar com hipertensão (dado fictício).", interpretacao: "Atenção" }] },
    "Percentual de Gordura Corporal (Fórmula da Marinha dos EUA, Simplificada)": { tipo: "escala", sinonimos: ["percentual de gordura corporal", "gordura corporal"], referencia: { min: 10, max: 20, label: "Saudável" }, limites: { min: 0, max: 60 }, campos: [{ id: "cintura_gc", tipo: "input", label: "Circunferência da Cintura", unidade: "cm", min: 30, max: 200 }, { id: "pescoco_gc", tipo: "input", label: "Circunferência do Pescoço", unidade: "cm", min: 20, max: 60 }, { id: "altura_gc", tipo: "input", label: "Altura", unidade: "cm", min: 100, max: 250 }], formula: "(495 / (1.0324 - (0.19077 * Math.log10(cintura_gc - pescoco_gc)) + (0.15456 * Math.log10(altura_gc)))) - 450", estagios: [{ soma_min: 0, soma_max: 9.9, status: "baixo", classificacao: "Muito Baixo", nota: "Percentual de gordura corporal muito baixo (dado fictício de protótipo).", interpretacao: "Atenção" }, { soma_min: 10, soma_max: 20, status: "bom", classificacao: "Saudável", nota: "Percentual de gordura corporal dentro do esperado (dado fictício).", interpretacao: "Estável" }, { soma_min: 20.1, soma_max: 60, status: "moderado", classificacao: "Elevado", nota: "Percentual de gordura corporal elevado (dado fictício).", interpretacao: "Atenção" }] },
    "Correção da Glicemia pelo Sódio": { tipo: "escala", sinonimos: ["sodio corrigido"], referencia: { min: 135, max: 145, label: "Normal" }, limites: { min: 100, max: 200 }, campos: [{ id: "sodio_corr", tipo: "input", label: "Sódio Medido", unidade: "mEq/L", min: 100, max: 180 }, { id: "glicemia_corr", tipo: "input", label: "Glicemia", unidade: "mg/dL", min: 10, max: 2000 }], formula: "sodio_corr + (1.6 * ((glicemia_corr - 100) / 100))", estagios: [{ soma_min: 100, soma_max: 134.9, status: "baixo", classificacao: "Hiponatremia Corrigida", nota: "Sódio corrigido baixo (dado fictício de protótipo).", interpretacao: "Atenção" }, { soma_min: 135, soma_max: 145, status: "bom", classificacao: "Normal", nota: "Sódio corrigido normal (dado fictício).", interpretacao: "Estável" }, { soma_min: 145.1, soma_max: 200, status: "grave", classificacao: "Hipernatremia Corrigida", nota: "⚠️ Sódio corrigido elevado! (dado fictício).", interpretacao: "Risco" }] },
    "Índice Tornozelo-Braquial (ITB)": { tipo: "escala", sinonimos: ["itb", "indice tornozelo braquial"], referencia: { min: 0.9, max: 1.3, label: "Normal" }, limites: { min: 0, max: 2 }, campos: [{ id: "pas_tornozelo", tipo: "input", label: "PAS do Tornozelo", unidade: "mmHg", min: 30, max: 300 }, { id: "pas_braco", tipo: "input", label: "PAS do Braço", unidade: "mmHg", min: 30, max: 300 }], formula: "pas_tornozelo / pas_braco", estagios: [{ soma_min: 0, soma_max: 0.89, status: "grave", classificacao: "Doença Arterial Periférica", nota: "⚠️ ITB reduzido! Sugestivo de doença arterial periférica (dado fictício).", interpretacao: "Risco" }, { soma_min: 0.9, soma_max: 1.3, status: "bom", classificacao: "Normal", nota: "ITB dentro do esperado (dado fictício).", interpretacao: "Estável" }, { soma_min: 1.31, soma_max: 2, status: "moderado", classificacao: "Vasos Não Compressíveis", nota: "ITB elevado. Considerar calcificação arterial (dado fictício).", interpretacao: "Atenção" }] },
    "CURB-65 (Pneumonia)": { tipo: "escala", sinonimos: ["curb-65", "curb65"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Confusão Mental", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Ureia Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Frequência Respiratória Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Pressão Arterial Baixa", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Idade ≥ 65 anos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "CURB-65 (Pneumonia) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "CURB-65 (Pneumonia) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ CURB-65 (Pneumonia) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "qSOFA (Sepse)": { tipo: "escala", sinonimos: ["qsofa"], referencia: { min: 0, max: 2, label: "Baixo Risco" }, limites: { min: 0, max: 6 }, campos: [{ id: "c0", tipo: "select", label: "Frequência Respiratória ≥ 22", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Alteração do Nível de Consciência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Pressão Arterial Sistólica ≤ 100", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 2, status: "bom", classificacao: "Baixo Risco", nota: "qSOFA (Sepse) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 3, soma_max: 4, status: "moderado", classificacao: "Risco Moderado", nota: "qSOFA (Sepse) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 5, soma_max: 6, status: "grave", classificacao: "Alto Risco", nota: "⚠️ qSOFA (Sepse) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "SOFA (Simplificado)": { tipo: "escala", sinonimos: ["sofa"], referencia: { min: 0, max: 4, label: "Baixo Risco" }, limites: { min: 0, max: 12 }, campos: [{ id: "c0", tipo: "select", label: "Disfunção Respiratória", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Disfunção Cardiovascular", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Disfunção Renal", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Disfunção Hepática", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Disfunção Neurológica", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Disfunção de Coagulação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 4, status: "bom", classificacao: "Baixo Risco", nota: "SOFA (Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 5, soma_max: 8, status: "moderado", classificacao: "Risco Moderado", nota: "SOFA (Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 9, soma_max: 12, status: "grave", classificacao: "Alto Risco", nota: "⚠️ SOFA (Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Centor (Faringite Estreptocócica)": { tipo: "escala", sinonimos: ["centor"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Febre", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Ausência de Tosse", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Exsudato Amigdaliano", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Linfadenopatia Cervical", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Centor (Faringite Estreptocócica) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "Centor (Faringite Estreptocócica) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Centor (Faringite Estreptocócica) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Alvarado (Apendicite)": { tipo: "escala", sinonimos: ["alvarado"], referencia: { min: 0, max: 5, label: "Baixo Risco" }, limites: { min: 0, max: 14 }, campos: [{ id: "c0", tipo: "select", label: "Dor Migratória para FID", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Anorexia", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Náusea/Vômito", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Dor à Palpação em FID", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Descompressão Brusca Positiva", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Febre", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c6", tipo: "select", label: "Leucocitose", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 5, status: "bom", classificacao: "Baixo Risco", nota: "Alvarado (Apendicite) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 6, soma_max: 9, status: "moderado", classificacao: "Risco Moderado", nota: "Alvarado (Apendicite) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 10, soma_max: 14, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Alvarado (Apendicite) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Wells (Trombose Venosa Profunda)": { tipo: "escala", sinonimos: ["wells tvp"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Câncer Ativo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Edema Assimétrico", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Veias Colaterais Superficiais", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Dor ao Longo do Trajeto Venoso", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Imobilização Recente", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Wells (Trombose Venosa Profunda) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Wells (Trombose Venosa Profunda) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Wells (Trombose Venosa Profunda) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Wells (Embolia Pulmonar)": { tipo: "escala", sinonimos: ["wells tep"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Sinais de TVP", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Diagnóstico Alternativo Menos Provável", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Frequência Cardíaca > 100", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Imobilização/Cirurgia Recente", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "TVP/TEP Prévios", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Wells (Embolia Pulmonar) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Wells (Embolia Pulmonar) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Wells (Embolia Pulmonar) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "CHA2DS2-VASc (Risco Tromboembólico)": { tipo: "escala", sinonimos: ["cha2ds2-vasc"], referencia: { min: 0, max: 5, label: "Baixo Risco" }, limites: { min: 0, max: 14 }, campos: [{ id: "c0", tipo: "select", label: "Insuficiência Cardíaca", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Hipertensão", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Idade ≥ 75 anos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Diabetes", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "AVC/AIT Prévio", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Doença Vascular", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c6", tipo: "select", label: "Sexo Feminino", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 5, status: "bom", classificacao: "Baixo Risco", nota: "CHA2DS2-VASc (Risco Tromboembólico) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 6, soma_max: 9, status: "moderado", classificacao: "Risco Moderado", nota: "CHA2DS2-VASc (Risco Tromboembólico) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 10, soma_max: 14, status: "grave", classificacao: "Alto Risco", nota: "⚠️ CHA2DS2-VASc (Risco Tromboembólico) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "HAS-BLED (Risco de Sangramento)": { tipo: "escala", sinonimos: ["has-bled"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Hipertensão", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Função Renal/Hepática Alterada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "AVC Prévio", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Sangramento Prévio", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "INR Instável", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "HAS-BLED (Risco de Sangramento) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "HAS-BLED (Risco de Sangramento) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ HAS-BLED (Risco de Sangramento) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Child-Pugh (Cirrose Hepática)": { tipo: "escala", sinonimos: ["child-pugh"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Bilirrubina", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Albumina", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "INR", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Ascite", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Encefalopatia", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Child-Pugh (Cirrose Hepática) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Child-Pugh (Cirrose Hepática) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Child-Pugh (Cirrose Hepática) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Braden (Risco de Lesão por Pressão)": { tipo: "escala", sinonimos: ["braden"], referencia: { min: 0, max: 4, label: "Baixo Risco" }, limites: { min: 0, max: 12 }, campos: [{ id: "c0", tipo: "select", label: "Percepção Sensorial", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Umidade da Pele", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Atividade Física", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Mobilidade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Nutrição", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Fricção/Cisalhamento", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 4, status: "bom", classificacao: "Baixo Risco", nota: "Braden (Risco de Lesão por Pressão) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 5, soma_max: 8, status: "moderado", classificacao: "Risco Moderado", nota: "Braden (Risco de Lesão por Pressão) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 9, soma_max: 12, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Braden (Risco de Lesão por Pressão) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Morse (Risco de Queda)": { tipo: "escala", sinonimos: ["morse"], referencia: { min: 0, max: 4, label: "Baixo Risco" }, limites: { min: 0, max: 12 }, campos: [{ id: "c0", tipo: "select", label: "Histórico de Quedas", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Diagnóstico Secundário", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Uso de Auxílio para Marcha", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Terapia Endovenosa", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Marcha Alterada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Estado Mental Alterado", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 4, status: "bom", classificacao: "Baixo Risco", nota: "Morse (Risco de Queda) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 5, soma_max: 8, status: "moderado", classificacao: "Risco Moderado", nota: "Morse (Risco de Queda) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 9, soma_max: 12, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Morse (Risco de Queda) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Ramsay (Nível de Sedação)": { tipo: "escala", sinonimos: ["ramsay"], referencia: { min: 0, max: 1, label: "Baixo Risco" }, limites: { min: 0, max: 4 }, campos: [{ id: "c0", tipo: "select", label: "Nível de Consciência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Resposta a Estímulos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 1, status: "bom", classificacao: "Baixo Risco", nota: "Ramsay (Nível de Sedação) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 2, soma_max: 3, status: "moderado", classificacao: "Risco Moderado", nota: "Ramsay (Nível de Sedação) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 4, soma_max: 4, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Ramsay (Nível de Sedação) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Barthel (Independência Funcional, Simplificado)": { tipo: "escala", sinonimos: ["barthel"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Alimentação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Banho", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Vestir-se", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Mobilidade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Continência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Barthel (Independência Funcional, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Barthel (Independência Funcional, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Barthel (Independência Funcional, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "NIHSS (Simplificado)": { tipo: "escala", sinonimos: ["nihss"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Nível de Consciência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Força Motora", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Linguagem", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Negligência/Extinção", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "NIHSS (Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "NIHSS (Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ NIHSS (Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "APACHE II (Simplificado)": { tipo: "escala", sinonimos: ["apache ii", "apache 2"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Temperatura", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Pressão Arterial Média", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Frequência Cardíaca", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Frequência Respiratória", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Idade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "APACHE II (Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "APACHE II (Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ APACHE II (Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Escala de Coma de Glasgow Pediátrica": { tipo: "escala", sinonimos: ["glasgow pediatrica"], referencia: { min: 0, max: 2, label: "Baixo Risco" }, limites: { min: 0, max: 6 }, campos: [{ id: "c0", tipo: "select", label: "Abertura Ocular", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Resposta Verbal (Adaptada)", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Resposta Motora", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 2, status: "bom", classificacao: "Baixo Risco", nota: "Escala de Coma de Glasgow Pediátrica — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 3, soma_max: 4, status: "moderado", classificacao: "Risco Moderado", nota: "Escala de Coma de Glasgow Pediátrica — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 5, soma_max: 6, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Escala de Coma de Glasgow Pediátrica — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "PEWS (Pediatric Early Warning Score)": { tipo: "escala", sinonimos: ["pews"], referencia: { min: 0, max: 2, label: "Baixo Risco" }, limites: { min: 0, max: 6 }, campos: [{ id: "c0", tipo: "select", label: "Comportamento", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Cardiovascular", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Respiratório", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 2, status: "bom", classificacao: "Baixo Risco", nota: "PEWS (Pediatric Early Warning Score) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 3, soma_max: 4, status: "moderado", classificacao: "Risco Moderado", nota: "PEWS (Pediatric Early Warning Score) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 5, soma_max: 6, status: "grave", classificacao: "Alto Risco", nota: "⚠️ PEWS (Pediatric Early Warning Score) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "NEWS2 (National Early Warning Score)": { tipo: "escala", sinonimos: ["news2"], referencia: { min: 0, max: 4, label: "Baixo Risco" }, limites: { min: 0, max: 12 }, campos: [{ id: "c0", tipo: "select", label: "Frequência Respiratória", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Saturação de O2", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Pressão Arterial Sistólica", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Frequência Cardíaca", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Nível de Consciência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Temperatura", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 4, status: "bom", classificacao: "Baixo Risco", nota: "NEWS2 (National Early Warning Score) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 5, soma_max: 8, status: "moderado", classificacao: "Risco Moderado", nota: "NEWS2 (National Early Warning Score) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 9, soma_max: 12, status: "grave", classificacao: "Alto Risco", nota: "⚠️ NEWS2 (National Early Warning Score) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "PSI (Índice de Gravidade de Pneumonia, Simplificado)": { tipo: "escala", sinonimos: ["psi pneumonia"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Idade Avançada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Comorbidades", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Alteração de Sinais Vitais", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Achados Laboratoriais Alterados", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "PSI (Índice de Gravidade de Pneumonia, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "PSI (Índice de Gravidade de Pneumonia, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ PSI (Índice de Gravidade de Pneumonia, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Ranson (Pancreatite Aguda)": { tipo: "escala", sinonimos: ["ranson"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Idade > 55 anos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Leucocitose", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Glicemia Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "LDH Elevado", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "AST Elevado", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Ranson (Pancreatite Aguda) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Ranson (Pancreatite Aguda) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Ranson (Pancreatite Aguda) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Glasgow-Blatchford (Hemorragia Digestiva)": { tipo: "escala", sinonimos: ["glasgow-blatchford", "blatchford"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Ureia Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Hemoglobina Baixa", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Pressão Arterial Sistólica Baixa", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Frequência Cardíaca Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Melena/Síncope", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Glasgow-Blatchford (Hemorragia Digestiva) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Glasgow-Blatchford (Hemorragia Digestiva) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Glasgow-Blatchford (Hemorragia Digestiva) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Rockall (Hemorragia Digestiva)": { tipo: "escala", sinonimos: ["rockall"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Idade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Choque", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Comorbidades", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Diagnóstico Endoscópico", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Estigmas de Sangramento", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Rockall (Hemorragia Digestiva) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Rockall (Hemorragia Digestiva) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Rockall (Hemorragia Digestiva) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Bishop (Colo do Útero)": { tipo: "escala", sinonimos: ["bishop"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Dilatação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Apagamento", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Altura da Apresentação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Consistência do Colo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Posição do Colo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Bishop (Colo do Útero) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Bishop (Colo do Útero) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Bishop (Colo do Útero) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Silverman-Andersen (Desconforto Respiratório Neonatal)": { tipo: "escala", sinonimos: ["silverman-andersen"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Movimento Tóraco-Abdominal", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Tiragem Intercostal", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Retração Xifoide", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Batimento de Asa de Nariz", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Gemido Expiratório", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Silverman-Andersen (Desconforto Respiratório Neonatal) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Silverman-Andersen (Desconforto Respiratório Neonatal) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Silverman-Andersen (Desconforto Respiratório Neonatal) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Finnegan (Abstinência Neonatal)": { tipo: "escala", sinonimos: ["finnegan"], referencia: { min: 0, max: 4, label: "Baixo Risco" }, limites: { min: 0, max: 12 }, campos: [{ id: "c0", tipo: "select", label: "Choro", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Sono", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Reflexo de Moro", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Tremores", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Sucção", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Alimentação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 4, status: "bom", classificacao: "Baixo Risco", nota: "Finnegan (Abstinência Neonatal) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 5, soma_max: 8, status: "moderado", classificacao: "Risco Moderado", nota: "Finnegan (Abstinência Neonatal) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 9, soma_max: 12, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Finnegan (Abstinência Neonatal) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Downes (Desconforto Respiratório)": { tipo: "escala", sinonimos: ["downes"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Frequência Respiratória", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Retrações", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Entrada de Ar", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Cianose", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Sibilos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Downes (Desconforto Respiratório) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Downes (Desconforto Respiratório) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Downes (Desconforto Respiratório) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Tinetti (Equilíbrio e Marcha)": { tipo: "escala", sinonimos: ["tinetti"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Equilíbrio Sentado", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Levantar-se", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Equilíbrio em Pé", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Marcha", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Passo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Tinetti (Equilíbrio e Marcha) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Tinetti (Equilíbrio e Marcha) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Tinetti (Equilíbrio e Marcha) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Katz (Atividades de Vida Diária)": { tipo: "escala", sinonimos: ["katz"], referencia: { min: 0, max: 4, label: "Baixo Risco" }, limites: { min: 0, max: 12 }, campos: [{ id: "c0", tipo: "select", label: "Banho", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Vestir-se", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Higiene Pessoal", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Transferência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Continência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Alimentação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 4, status: "bom", classificacao: "Baixo Risco", nota: "Katz (Atividades de Vida Diária) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 5, soma_max: 8, status: "moderado", classificacao: "Risco Moderado", nota: "Katz (Atividades de Vida Diária) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 9, soma_max: 12, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Katz (Atividades de Vida Diária) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Lawton (Atividades Instrumentais)": { tipo: "escala", sinonimos: ["lawton"], referencia: { min: 0, max: 5, label: "Baixo Risco" }, limites: { min: 0, max: 14 }, campos: [{ id: "c0", tipo: "select", label: "Uso do Telefone", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Compras", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Preparo de Refeições", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Tarefas Domésticas", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Uso de Transporte", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Manejo de Medicações", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c6", tipo: "select", label: "Manejo Financeiro", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 5, status: "bom", classificacao: "Baixo Risco", nota: "Lawton (Atividades Instrumentais) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 6, soma_max: 9, status: "moderado", classificacao: "Risco Moderado", nota: "Lawton (Atividades Instrumentais) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 10, soma_max: 14, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Lawton (Atividades Instrumentais) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Mini Mental (Rastreio Cognitivo, Simplificado)": { tipo: "escala", sinonimos: ["mini mental", "mmse"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Orientação Temporal", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Orientação Espacial", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Memória Imediata", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Atenção e Cálculo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Linguagem", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Mini Mental (Rastreio Cognitivo, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Mini Mental (Rastreio Cognitivo, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Mini Mental (Rastreio Cognitivo, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Hamilton para Depressão (Simplificado)": { tipo: "escala", sinonimos: ["hamilton depressao"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Humor Deprimido", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Sentimentos de Culpa", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Insônia", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Trabalho e Atividades", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Ansiedade Somática", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Hamilton para Depressão (Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Hamilton para Depressão (Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Hamilton para Depressão (Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Hamilton para Ansiedade (Simplificado)": { tipo: "escala", sinonimos: ["hamilton ansiedade"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Humor Ansioso", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Tensão", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Sintomas Somáticos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Sintomas Cardiovasculares", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Hamilton para Ansiedade (Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "Hamilton para Ansiedade (Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Hamilton para Ansiedade (Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "PHQ-9 (Depressão, Simplificado)": { tipo: "escala", sinonimos: ["phq-9", "phq9"], referencia: { min: 0, max: 6, label: "Baixo Risco" }, limites: { min: 0, max: 18 }, campos: [{ id: "c0", tipo: "select", label: "Pouco Interesse/Prazer", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Humor Deprimido", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Distúrbios do Sono", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Fadiga", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Alterações do Apetite", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Sentimento de Culpa/Fracasso", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c6", tipo: "select", label: "Dificuldade de Concentração", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c7", tipo: "select", label: "Alterações Psicomotoras", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c8", tipo: "select", label: "Pensamentos Suicidas", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 6, status: "bom", classificacao: "Baixo Risco", nota: "PHQ-9 (Depressão, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 7, soma_max: 12, status: "moderado", classificacao: "Risco Moderado", nota: "PHQ-9 (Depressão, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 13, soma_max: 18, status: "grave", classificacao: "Alto Risco", nota: "⚠️ PHQ-9 (Depressão, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "GAD-7 (Ansiedade, Simplificado)": { tipo: "escala", sinonimos: ["gad-7", "gad7"], referencia: { min: 0, max: 5, label: "Baixo Risco" }, limites: { min: 0, max: 14 }, campos: [{ id: "c0", tipo: "select", label: "Nervosismo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Incapacidade de Controlar Preocupação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Preocupação Excessiva", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Dificuldade de Relaxar", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Inquietação", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Irritabilidade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c6", tipo: "select", label: "Medo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 5, status: "bom", classificacao: "Baixo Risco", nota: "GAD-7 (Ansiedade, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 6, soma_max: 9, status: "moderado", classificacao: "Risco Moderado", nota: "GAD-7 (Ansiedade, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 10, soma_max: 14, status: "grave", classificacao: "Alto Risco", nota: "⚠️ GAD-7 (Ansiedade, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Escala de Dor (Categorizada)": { tipo: "escala", sinonimos: ["escala de dor", "eva"], referencia: { min: 0, max: 1, label: "Baixo Risco" }, limites: { min: 0, max: 4 }, campos: [{ id: "c0", tipo: "select", label: "Intensidade Relatada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Impacto Funcional", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 1, status: "bom", classificacao: "Baixo Risco", nota: "Escala de Dor (Categorizada) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 2, soma_max: 3, status: "moderado", classificacao: "Risco Moderado", nota: "Escala de Dor (Categorizada) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 4, soma_max: 4, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Escala de Dor (Categorizada) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "RASS (Escala de Sedação de Richmond)": { tipo: "escala", sinonimos: ["rass"], referencia: { min: 0, max: 2, label: "Baixo Risco" }, limites: { min: 0, max: 6 }, campos: [{ id: "c0", tipo: "select", label: "Nível de Alerta", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Resposta à Estimulação Verbal", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Resposta à Estimulação Física", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 2, status: "bom", classificacao: "Baixo Risco", nota: "RASS (Escala de Sedação de Richmond) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 3, soma_max: 4, status: "moderado", classificacao: "Risco Moderado", nota: "RASS (Escala de Sedação de Richmond) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 5, soma_max: 6, status: "grave", classificacao: "Alto Risco", nota: "⚠️ RASS (Escala de Sedação de Richmond) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "FOUR (Escala de Coma, Alternativa ao Glasgow)": { tipo: "escala", sinonimos: ["four score"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Resposta Ocular", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Resposta Motora", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Reflexos de Tronco Cerebral", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Padrão Respiratório", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "FOUR (Escala de Coma, Alternativa ao Glasgow) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "FOUR (Escala de Coma, Alternativa ao Glasgow) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ FOUR (Escala de Coma, Alternativa ao Glasgow) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Rankin Modificada (AVC)": { tipo: "escala", sinonimos: ["rankin", "mrs"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Sintomas", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Limitação de Atividades", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Necessidade de Assistência", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Independência para Autocuidado", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Rankin Modificada (AVC) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "Rankin Modificada (AVC) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Rankin Modificada (AVC) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "ABCD2 (Risco de AVC após AIT)": { tipo: "escala", sinonimos: ["abcd2"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Idade ≥ 60 anos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Pressão Arterial Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Características Clínicas", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Duração dos Sintomas", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Diabetes", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "ABCD2 (Risco de AVC após AIT) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "ABCD2 (Risco de AVC após AIT) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ ABCD2 (Risco de AVC após AIT) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "PERC (Exclusão de Embolia Pulmonar)": { tipo: "escala", sinonimos: ["perc"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Idade ≥ 50 anos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Frequência Cardíaca ≥ 100", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Saturação < 95%", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Edema Unilateral de Perna", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Hemoptise", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "PERC (Exclusão de Embolia Pulmonar) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "PERC (Exclusão de Embolia Pulmonar) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ PERC (Exclusão de Embolia Pulmonar) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Framingham (Risco Cardiovascular, Simplificado)": { tipo: "escala", sinonimos: ["framingham"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 10 }, campos: [{ id: "c0", tipo: "select", label: "Idade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Colesterol Total", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "HDL", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Pressão Arterial Sistólica", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "Tabagismo", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Framingham (Risco Cardiovascular, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 7, status: "moderado", classificacao: "Risco Moderado", nota: "Framingham (Risco Cardiovascular, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 8, soma_max: 10, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Framingham (Risco Cardiovascular, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Reynolds (Risco Cardiovascular, Simplificado)": { tipo: "escala", sinonimos: ["reynolds"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Idade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "PCR de Alta Sensibilidade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Pressão Arterial Sistólica", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "História Familiar", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Reynolds (Risco Cardiovascular, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "Reynolds (Risco Cardiovascular, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Reynolds (Risco Cardiovascular, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "FRAX (Risco de Fratura, Simplificado)": { tipo: "escala", sinonimos: ["frax"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Idade Avançada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Fratura Prévia", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Uso de Corticoide", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Baixo Peso Corporal", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "FRAX (Risco de Fratura, Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "FRAX (Risco de Fratura, Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ FRAX (Risco de Fratura, Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "STOP-BANG (Apneia do Sono)": { tipo: "escala", sinonimos: ["stop-bang"], referencia: { min: 0, max: 4, label: "Baixo Risco" }, limites: { min: 0, max: 12 }, campos: [{ id: "c0", tipo: "select", label: "Ronco", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Cansaço Diurno", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Apneia Observada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Pressão Arterial Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c4", tipo: "select", label: "IMC Elevado", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c5", tipo: "select", label: "Idade > 50 anos", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 4, status: "bom", classificacao: "Baixo Risco", nota: "STOP-BANG (Apneia do Sono) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 5, soma_max: 8, status: "moderado", classificacao: "Risco Moderado", nota: "STOP-BANG (Apneia do Sono) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 9, soma_max: 12, status: "grave", classificacao: "Alto Risco", nota: "⚠️ STOP-BANG (Apneia do Sono) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Epworth (Sonolência Diurna)": { tipo: "escala", sinonimos: ["epworth"], referencia: { min: 0, max: 3, label: "Baixo Risco" }, limites: { min: 0, max: 8 }, campos: [{ id: "c0", tipo: "select", label: "Sonolência ao Ler", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Sonolência Assistindo TV", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Sonolência em Repouso", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c3", tipo: "select", label: "Sonolência como Passageiro", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 3, status: "bom", classificacao: "Baixo Risco", nota: "Epworth (Sonolência Diurna) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 4, soma_max: 5, status: "moderado", classificacao: "Risco Moderado", nota: "Epworth (Sonolência Diurna) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 6, soma_max: 8, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Epworth (Sonolência Diurna) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "Berlim (Apneia do Sono)": { tipo: "escala", sinonimos: ["berlim apneia", "berlin"], referencia: { min: 0, max: 2, label: "Baixo Risco" }, limites: { min: 0, max: 6 }, campos: [{ id: "c0", tipo: "select", label: "Ronco Frequente", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "Cansaço Diurno Frequente", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Pressão Arterial Elevada ou Obesidade", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 2, status: "bom", classificacao: "Baixo Risco", nota: "Berlim (Apneia do Sono) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 3, soma_max: 4, status: "moderado", classificacao: "Risco Moderado", nota: "Berlim (Apneia do Sono) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 5, soma_max: 6, status: "grave", classificacao: "Alto Risco", nota: "⚠️ Berlim (Apneia do Sono) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
    "MELD (Simplificado)": { tipo: "escala", sinonimos: ["meld"], referencia: { min: 0, max: 2, label: "Baixo Risco" }, limites: { min: 0, max: 6 }, campos: [{ id: "c0", tipo: "select", label: "Bilirrubina Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c1", tipo: "select", label: "INR Elevado", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }, { id: "c2", tipo: "select", label: "Creatinina Elevada", opcoes: ["0 (Ausente/Normal)", "1 (Leve/Presente)", "2 (Importante/Grave)"], pesos: [0, 1, 2] }], estagios: [{ soma_min: 0, soma_max: 2, status: "bom", classificacao: "Baixo Risco", nota: "MELD (Simplificado) — pontuação baixa (dado fictício de protótipo). Conduta conservadora/observação.", interpretacao: "Estável" }, { soma_min: 3, soma_max: 4, status: "moderado", classificacao: "Risco Moderado", nota: "MELD (Simplificado) — pontuação intermediária (dado fictício de protótipo). Reavaliar e considerar investigação adicional.", interpretacao: "Atenção" }, { soma_min: 5, soma_max: 6, status: "grave", classificacao: "Alto Risco", nota: "⚠️ MELD (Simplificado) — pontuação elevada (dado fictício de protótipo)! Considerar conduta mais intensiva/encaminhamento.", interpretacao: "Risco" }] },
};

// ============================================================================
// MAPEAMENTO DE STATUS (CORRIGIDO)
// ============================================================================
const STATUS_CONFIG = {
    baixo: { cor: "#f59e0b", icone: "ri-arrow-down-circle-fill", label: "Baixo" },
    normal: { cor: "#00843d", icone: "ri-checkbox-circle-fill", label: "Normal" },
    alto: { cor: "#ef4444", icone: "ri-arrow-up-circle-fill", label: "Alto" },
    negativo: { cor: "#00843d", icone: "ri-checkbox-circle-fill", label: "Negativo" },
    leve: { cor: "#f59e0b", icone: "ri-alert-fill", label: "Leve" },
    moderado: { cor: "#f97316", icone: "ri-alert-fill", label: "Moderado" },
    grave: { cor: "#ef4444", icone: "ri-error-warning-fill", label: "Grave" },
    muito_grave: { cor: "#dc2626", icone: "ri-skull-fill", label: "Muito Grave" },
    imune: { cor: "#00843d", icone: "ri-check-double-fill", label: "Imune" },
    bom: { cor: "#00843d", icone: "ri-checkbox-circle-fill", label: "Bom" },
    desconhecido: { cor: "#94a3b8", icone: "ri-question-line", label: "Desconhecido" }
};

// ============================================================================
// ESTADO GLOBAL (CORRIGIDO)
// ============================================================================
let itemAtual = null;
let valoresAtuais = {};

const inputSearch = document.getElementById("exame_nome");
const inputValor = document.getElementById("exame_valor");
const uniTag = document.getElementById("unidade_display");
const divSugestoes = document.getElementById("sugestoes_box");
const pResultado = document.getElementById("resultado");
const campoValorContainer = document.getElementById("campo_valor_container");
const camposDinamicosContainer = document.getElementById("campos_dinamicos_container");


// ============================================================================
// TEMA (CORRIGIDO)
// ============================================================================
const body = document.body;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

// Função para aplicar o tema
function aplicarTema(tema) {
    if (tema === 'dark') {
        body.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'ri-sun-line';
        localStorage.setItem('tema', 'dark');
    } else {
        body.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.className = 'ri-moon-line';
        localStorage.setItem('tema', 'light');
    }
}

// Carregar tema salvo
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo === 'dark') {
    aplicarTema('dark');
} else {
    aplicarTema('light');
}

// Evento do botão de tema
if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita conflitos com o menu
        const temaAtual = body.getAttribute('data-theme');
        if (temaAtual === 'dark') {
            aplicarTema('light');
        } else {
            aplicarTema('dark');
        }
    });
}

// ============================================================================
// MENU LATERAL (CORRIGIDO)
// ============================================================================
const btnHamburger = document.getElementById('btnHamburger');
const menuOverlay = document.getElementById('menuOverlay');
const menuLateral = document.getElementById('menuLateral');

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
    
    btnHamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menuLateral.classList.contains('ativo')) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    });
    
    menuOverlay.addEventListener('click', fecharMenu);
    
    // Fechar menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuLateral.classList.contains('ativo')) {
            fecharMenu();
        }
    });
}

// ============================================================================
// FECHAR SELECTS AO CLICAR FORA (CORRIGIDO - UNIFICADO)
// ============================================================================
function fecharTodosSelects() {
    document.querySelectorAll('.interpretador-select-options.aberto').forEach(options => {
        options.classList.remove('aberto');
        const trigger = options.closest('.interpretador-select-wrapper')?.querySelector('.interpretador-select-trigger');
        if (trigger) trigger.classList.remove('aberto');
    });
}

document.addEventListener('click', function(event) {
    // Fechar selects
    document.querySelectorAll('.interpretador-select-wrapper').forEach(wrapper => {
        if (!wrapper.contains(event.target)) {
            const options = wrapper.querySelector('.interpretador-select-options');
            const trigger = wrapper.querySelector('.interpretador-select-trigger');
            if (options) options.classList.remove('aberto');
            if (trigger) trigger.classList.remove('aberto');
        }
    });
    
    // Fechar sugestões
    if (!inputSearch.contains(event.target) && !divSugestoes.contains(event.target)) {
        divSugestoes.style.display = "none";
    }
});





// ============================================================================
// FUNÇÃO DE SELECT PERSONALIZADO (CORRIGIDO - PESOS)
// ============================================================================
function criarSelectPersonalizado(campo) {
    const wrapper = document.createElement("div");
    wrapper.className = "interpretador-select-wrapper";
    wrapper.style.marginBottom = "8px";

    const icon = document.createElement("i");
    icon.className = "ri-checkbox-line";
    wrapper.appendChild(icon);

    const group = document.createElement("div");
    group.className = "interpretador-select-group";

    const trigger = document.createElement("div");
    trigger.className = "interpretador-select-trigger";
    trigger.setAttribute("data-campo", campo.id);

    const spanSelecionado = document.createElement("span");
    spanSelecionado.className = "select-selecionado";
    spanSelecionado.textContent = "Selecione";
    trigger.appendChild(spanSelecionado);

    const arrow = document.createElement("i");
    arrow.className = "ri-arrow-down-s-line select-arrow";
    trigger.appendChild(arrow);

    trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        fecharTodosSelects(); // Fecha outros selects primeiro
        
        const wrapper = this.closest('.interpretador-select-wrapper');
        const options = wrapper.querySelector('.interpretador-select-options');
        if (!options) return;
        
        options.classList.toggle('aberto');
        this.classList.toggle('aberto');
    });

    group.appendChild(trigger);

    const label = document.createElement("label");
    label.className = "label-flutuante";
    label.textContent = campo.label;
    group.appendChild(label);

    wrapper.appendChild(group);

    if (campo.unidade) {
        const divider = document.createElement("div");
        divider.className = "interpretador-select-divider";
        wrapper.appendChild(divider);
        const unidadeSpan = document.createElement("span");
        unidadeSpan.className = "interpretador-select-unidade";
        unidadeSpan.textContent = campo.unidade;
        wrapper.appendChild(unidadeSpan);
    }

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "interpretador-select-options";

    campo.opcoes.forEach((opt, idx) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "interpretador-select-option";
        if (idx === 0) optionDiv.classList.add("selecionado");

        const labelSpan = document.createElement("span");
        labelSpan.className = "option-label";
        labelSpan.textContent = opt;
        optionDiv.appendChild(labelSpan);

        optionDiv.addEventListener("click", function(e) {
            e.stopPropagation();
            
            const label = this.querySelector('.option-label').textContent;
            const parentWrapper = this.closest('.interpretador-select-wrapper');
            const triggerEl = parentWrapper.querySelector('.interpretador-select-trigger');
            const selectedSpan = triggerEl.querySelector('.select-selecionado');
            const optionsContainer = parentWrapper.querySelector('.interpretador-select-options');
            
            selectedSpan.textContent = label;
            
            optionsContainer.querySelectorAll('.interpretador-select-option').forEach(opt => {
                opt.classList.remove('selecionado');
            });
            this.classList.add('selecionado');
            
            optionsContainer.classList.remove('aberto');
            triggerEl.classList.remove('aberto');

            // CORREÇÃO: Guarda o valor corretamente
            if (campo.pesos && campo.pesos[idx] !== undefined) {
                // Para escalas com pesos
                valoresAtuais[campo.id] = {
                    valor: label,
                    peso: campo.pesos[idx]
                };
            } else {
                // Para selects sem peso (diagnósticos)
                valoresAtuais[campo.id] = label;
            }
        });

        optionsContainer.appendChild(optionDiv);
    });

    wrapper.appendChild(optionsContainer);
    return wrapper;
}

// ============================================================================
// FUNÇÃO DE INPUT PERSONALIZADO (CORRIGIDO)
// ============================================================================
function criarInputPersonalizado(campo) {
    const wrapper = document.createElement("div");
    wrapper.className = "interpretador-input-wrapper";
    wrapper.style.marginBottom = "8px";

    const icon = document.createElement("i");
    icon.className = "ri-ruler-2-line";
    wrapper.appendChild(icon);

    const group = document.createElement("div");
    group.className = "interpretador-input-group";

    const input = document.createElement("input");
    input.type = "number";
    input.id = campo.id;
    input.placeholder = " ";
    input.step = "0.01";
    
    // CORREÇÃO: Adiciona validação de limites
    if (itemAtual && itemAtual.limites) {
        if (itemAtual.limites.min !== undefined) {
            input.min = itemAtual.limites.min;
        }
        if (itemAtual.limites.max !== undefined) {
            input.max = itemAtual.limites.max;
        }
    }

    // CORREÇÃO: Evento que guarda o valor corretamente
    input.addEventListener("input", (e) => {
        const valor = e.target.value;
        if (valor === "") {
            delete valoresAtuais[campo.id];
        } else {
            valoresAtuais[campo.id] = valor;
        }
    });

    group.appendChild(input);

    const label = document.createElement("label");
    label.className = "label-flutuante";
    label.textContent = campo.label;
    group.appendChild(label);

    wrapper.appendChild(group);

    if (campo.unidade) {
        const divider = document.createElement("div");
        divider.className = "interpretador-input-divider";
        wrapper.appendChild(divider);

        const unidadeSpan = document.createElement("span");
        unidadeSpan.className = "interpretador-input-unidade";
        unidadeSpan.textContent = campo.unidade;
        wrapper.appendChild(unidadeSpan);
    }

    return wrapper;
}

// ============================================================================
// MOSTRAR CAMPOS DO ITEM (CORRIGIDO)
// ============================================================================
function mostrarCamposDoItem(item) {
    if (!camposDinamicosContainer) return;

    // LIMPAR TUDO antes de recarregar
    camposDinamicosContainer.innerHTML = "";
    valoresAtuais = {}; // Reset dos valores
    
    // Reset do campo de valor único
    inputValor.value = "";
    inputValor.removeEventListener("input", handleInputValor);

    if (!item || !item.campos) {
        camposDinamicosContainer.style.display = "none";
        campoValorContainer.style.display = "none";
        return;
    }

    const temMultiplosCampos = item.campos.length > 1;
    const primeiroCampoNumerico = item.campos[0] && item.campos[0].tipo === "input";

    if (temMultiplosCampos || !primeiroCampoNumerico) {
        // Múltiplos campos ou select único
        campoValorContainer.style.display = "none";
        camposDinamicosContainer.style.display = "grid";
        camposDinamicosContainer.style.gridTemplateColumns = "1fr 1fr";
        camposDinamicosContainer.style.gap = "8px";
        camposDinamicosContainer.style.width = "100%";
        camposDinamicosContainer.style.marginTop = "10px";

        item.campos.forEach((campo) => {
            let elemento;
            if (campo.tipo === "select") {
                elemento = criarSelectPersonalizado(campo);
            } else {
                elemento = criarInputPersonalizado(campo);
            }
            camposDinamicosContainer.appendChild(elemento);
        });
    } else {
        // Campo único (exame simples)
        campoValorContainer.style.display = "flex";
        inputValor.style.display = "flex";
        inputValor.type = "number";
        inputValor.value = "";
        inputValor.id = item.campos[0].id;
        
        // CORREÇÃO: Adiciona validação de limites
        if (item.limites) {
            if (item.limites.min !== undefined) {
                inputValor.min = item.limites.min;
            }
            if (item.limites.max !== undefined) {
                inputValor.max = item.limites.max;
            }
        }
        
        camposDinamicosContainer.style.display = "none";

        const primeiroCampo = item.campos[0];
        if (primeiroCampo.unidade) {
            uniTag.textContent = primeiroCampo.unidade;
        } else {
            uniTag.textContent = "--";
        }
        
        const labelValor = document.querySelector("#campo_valor_container .label-flutuante");
        if (labelValor && primeiroCampo.label) {
            labelValor.textContent = primeiroCampo.label;
        }

        // CORREÇÃO: Remove eventos antigos e adiciona novo
        inputValor.removeEventListener("input", handleInputValor);
        inputValor.addEventListener("input", handleInputValor);
    }
}

// ============================================================================
// HANDLER PARA CAMPO DE VALOR ÚNICO (CORRIGIDO)
// ============================================================================
function handleInputValor(e) {
    if (itemAtual && itemAtual.campos && itemAtual.campos.length === 1) {
        const valor = e.target.value;
        const campoId = itemAtual.campos[0].id;
        if (valor === "") {
            delete valoresAtuais[campoId];
        } else {
            valoresAtuais[campoId] = valor;
        }
    }
}








// ============================================================================
// FILTRAR EXAMES (CORRIGIDO - EVITAR LOOP DE AUTOPREENCHIMENTO)
// ============================================================================
function filtrarExames() {
    const termo = inputSearch.value.trim().toLowerCase();
    
    if (!termo) {
        divSugestoes.style.display = "none";
        divSugestoes.innerHTML = "";
        return;
    }

    // Preparar lista de todos os itens
    const todos = Object.keys(database).map(nome => {
        const config = database[nome];
        return {
            nome: nome,
            tipo: config.tipo,
            sinonimos: config.sinonimos || []
        };
    });

    // CORREÇÃO 1: Verificar se é um nome exato - NÃO CARREGA AUTOMATICAMENTE
    const exato = todos.find(item => item.nome.toLowerCase() === termo);
    if (exato) {
        // Mostra o item nas sugestões, mas não carrega automaticamente
        mostrarSugestoes([exato], termo);
        return;
    }

    // CORREÇÃO 2: Verificar sinónimos - NÃO CARREGA AUTOMATICAMENTE
    // Apenas mostra sugestões, não autopreenche
    const filtrados = todos.filter(item => {
        const nomeMatch = item.nome.toLowerCase().includes(termo);
        
        const sinonimoMatch = item.sinonimos.some(sin => 
            sin.toLowerCase().includes(termo) || termo.includes(sin.toLowerCase())
        );
        
        const termoPalavras = termo.split(' ');
        const nomePalavras = item.nome.toLowerCase().split(' ');
        const palavrasMatch = termoPalavras.some(tp => 
            nomePalavras.some(np => np.includes(tp) || tp.includes(np))
        );
        
        return nomeMatch || sinonimoMatch || palavrasMatch;
    });

    if (filtrados.length === 0) {
        divSugestoes.style.display = "none";
        divSugestoes.innerHTML = "";
        return;
    }

    // Mostrar resultados
    mostrarSugestoes(filtrados, termo);
}

// ============================================================================
// MOSTRAR SUGESTÕES (NOVA FUNÇÃO)
// ============================================================================
function mostrarSugestoes(itens, termo) {
    divSugestoes.innerHTML = "";
    divSugestoes.style.display = "block";

    itens.slice(0, 8).forEach(item => {
        const div = document.createElement("div");
        div.className = "sugestao-item";
        
        let icone = "";
        if (item.tipo === "exame") icone = "🧪 ";
        else if (item.tipo === "diagnostico") icone = "🩺 ";
        else icone = "📊 ";
        
        let nomeDestacado = destacarTexto(item.nome, termo);
        
        const sinonimoEncontrado = item.sinonimos.find(sin => 
            sin.toLowerCase().includes(termo) && !item.nome.toLowerCase().includes(termo)
        );
        let destaqueSinonimo = "";
        if (sinonimoEncontrado) {
            const sinDestacado = destacarTexto(sinonimoEncontrado, termo);
            destaqueSinonimo = ` <span style="opacity: 0.7; font-size: 0.7rem;"> ou →  ${sinDestacado}</span>`;
        }
        
        div.innerHTML = `${icone}${nomeDestacado}${destaqueSinonimo}`;
        div.onclick = () => {
            inputSearch.value = item.nome;
            carregarItem(item.nome);
            divSugestoes.style.display = "none";
        };
        divSugestoes.appendChild(div);
    });
}


// ============================================================================
// DESTACAR TEXTO (CORRIGIDO)
// ============================================================================
function destacarTexto(texto, termo) {
    if (!termo || !texto) return texto;
    // Escapar caracteres especiais
    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${termoEscapado})`, 'gi');
    return texto.replace(regex, '<strong style="font-weight: 700; color: var(--primary);">$1</strong>');
}

// ============================================================================
// CARREGAR ITEM (CORRIGIDO)
// ============================================================================
function carregarItem(nome) {
    const config = database[nome];
    if (!config) return;
    
    // CORREÇÃO: Limpar valores antigos ANTES de carregar
    valoresAtuais = {};
    inputValor.value = "";
    
    // Atualizar item atual
    itemAtual = { nome, ...config };

    // Atualizar label flutuante do campo de busca
    const labelBusca = document.querySelector("#exame_nome + .label-flutuante");
    if (labelBusca) {
        if (config.tipo === "exame") labelBusca.textContent = "Exame";
        else if (config.tipo === "diagnostico") labelBusca.textContent = "Diagnóstico";
        else if (config.tipo === "escala") labelBusca.textContent = "Escala";
    }

    // CORREÇÃO: Reset do container de campos dinâmicos
    if (camposDinamicosContainer) {
        camposDinamicosContainer.innerHTML = "";
    }

    // Mostrar campos do item
    mostrarCamposDoItem(config);
    
    // Esconder resultado anterior
    pResultado.innerHTML = "";
    pResultado.style.display = "none";
}


// ============================================================================
// OBTER VALORES PREENCHIDOS (CORRIGIDO - GARANTE TODOS OS VALORES)
// ============================================================================
function getValoresPreenchidos() {
    const valores = {};
    let todosPreenchidos = true;
    let camposVazios = [];

    if (!itemAtual || !itemAtual.campos) {
        return { valores, todosPreenchidos: false, camposVazios: ['Nenhum campo disponível'] };
    }

    const temCamposDinamicos = camposDinamicosContainer && 
                               camposDinamicosContainer.children.length > 0 &&
                               camposDinamicosContainer.style.display !== "none";

    if (temCamposDinamicos) {
        // CORREÇÃO: Verifica cada campo do item
        for (const campo of itemAtual.campos) {
            let valor = valoresAtuais[campo.id];
            
            // Verifica se é um select com objeto {valor, peso}
            if (typeof valor === 'object' && valor !== null) {
                if (!valor.valor || valor.valor === "" || valor.valor === "Selecione") {
                    todosPreenchidos = false;
                    camposVazios.push(campo.label);
                } else {
                    valores[campo.id] = valor;
                }
            } 
            // Verifica se é um input
            else {
                if (valor === undefined || valor === null || valor === "") {
                    todosPreenchidos = false;
                    camposVazios.push(campo.label);
                } else {
                    // CORREÇÃO: Para inputs, guarda o valor como string (será convertido depois)
                    valores[campo.id] = valor;
                }
            }
        }
    } else {
        // Campo único (input normal)
        const valor = inputValor.value.trim();
        const campo = itemAtual.campos[0];
        
        if (!valor || valor === "") {
            todosPreenchidos = false;
            camposVazios.push(campo.label);
        } else {
            valores[campo.id] = valor;
        }
    }

    return { valores, todosPreenchidos, camposVazios };
}


// ============================================================================
// EXIBIR RESULTADO UNIFICADO (CORRIGIDO - APENAS UNDEFINED + VALOR NUMERO)
// ============================================================================
function exibirResultadoUnificado(resultado, config, tipo) {
    if (!resultado) {
        mostrarErro("Erro ao interpretar os dados.");
        return;
    }

    // Caso especial: erro de limite
    if (resultado.foraLimite) {
        const cor = resultado.cor || "#ef4444";
        const icone = "ri-error-warning-fill";
        const label = "Fora dos Limites";
        
        let valorDisplay = resultado.valor !== undefined && resultado.valor !== null 
            ? resultado.valor 
            : resultado.soma;
        
        if (valorDisplay === undefined || valorDisplay === null) {
            const campoId = config.campos?.[0]?.id;
            if (campoId && valoresAtuais[campoId] !== undefined) {
                valorDisplay = valoresAtuais[campoId];
            } else {
                valorDisplay = "—";
            }
        }
        
        if (typeof valorDisplay === 'number' && !isNaN(valorDisplay)) {
            if (Number.isInteger(valorDisplay)) {
                valorDisplay = valorDisplay.toString();
            } else {
                valorDisplay = valorDisplay.toFixed(valorDisplay % 1 === 0 ? 0 : 1);
            }
        }
        
        let unidadeDisplay = "";
        
        if (tipo === "exame" && resultado.unidade) {
            unidadeDisplay = resultado.unidade;
        } else if (tipo === "escala" && resultado.ehPontuacao) {
            unidadeDisplay = "pontos";
        } else if (config.referencia?.unidade) {
            unidadeDisplay = config.referencia.unidade;
        }
        
        let refDisplay = "";
        if (resultado.referenciaMin !== undefined && resultado.referenciaMax !== undefined) {
            refDisplay = `Referência: ${resultado.referenciaMin} - ${resultado.referenciaMax} ${resultado.referenciaLabel || ''}`;
        } else if (resultado.limiteMin !== undefined && resultado.limiteMax !== undefined) {
            refDisplay = `Limites: ${resultado.limiteMin} - ${resultado.limiteMax}`;
        }
        
        pResultado.innerHTML = `
            <div class="interpretador-card" style="background: var(--card-bg); border-radius: 20px; padding: 20px 22px;">
                <div class="interpretador-card-header">
                    <div class="interpretador-card-status" style="color: ${cor};">
                        <i class="${icone}"></i>
                        <span class="status-label">${label}</span>
                    </div>
                    <div class="interpretador-card-valor" style="color: ${cor};">
                        <span class="valor-numero">${valorDisplay}</span>${unidadeDisplay ? `<span class="valor-unidade"> ${unidadeDisplay}</span>` : ''}
                    </div>
                </div>
                <div class="interpretador-card-sub">
                    <span class="interpretador-card-referencia">${refDisplay}</span>
                </div>
                <div class="interpretador-card-nota critico">
                    ${resultado.nota}
                </div>
            </div>
        `;
        pResultado.style.display = "block";
        animarResultado();
        return;
    }

    // Configurações de status
    const configStatus = STATUS_CONFIG[resultado.status] || STATUS_CONFIG.desconhecido;
    let statusLabel = configStatus.label;
    let statusCor = resultado.cor || configStatus.cor;
    let statusIcone = configStatus.icone;
    let notaClasse = "normal";
    
    let classeCard = "normal";
    if (resultado.status === "normal" || resultado.status === "bom" || resultado.status === "negativo" || resultado.status === "imune") {
        classeCard = "normal";
        notaClasse = "normal";
    } else if (resultado.status === "baixo" || resultado.status === "leve") {
        classeCard = "alerta";
        notaClasse = "alerta";
    } else if (resultado.status === "moderado") {
        classeCard = "moderado";
        notaClasse = "alerta";
    } else if (resultado.status === "alto" || resultado.status === "grave" || resultado.status === "muito_grave") {
        classeCard = "critico";
        notaClasse = "critico";
    }

    let valorDireito = "—";
    let unidadeDireito = "";
    let infoEsquerda = "";
    let infoDireita = "";
    let mostrarBarra = false;
    let percentualBarra = 0;
    let corBarra = statusCor;
    let statusEsquerdo = statusLabel;

    if (tipo === "exame") {
        valorDireito = resultado.valor !== undefined && resultado.valor !== null 
            ? resultado.valor 
            : "—";
        unidadeDireito = resultado.unidade || "";
        
        const refMin = resultado.referenciaMin !== undefined ? resultado.referenciaMin : 0;
        const refMax = resultado.referenciaMax !== undefined ? resultado.referenciaMax : 100;
        const refLabel = resultado.referenciaLabel || "Referência";
        
        infoEsquerda = `Referência: ${refMin} - ${refMax} ${unidadeDireito}`;
        infoDireita = resultado.termo || "";
        
        if (resultado.status === "normal" || resultado.status === "bom") {
            mostrarBarra = true;
            const intervalo = refMax - refMin;
            if (intervalo > 0 && typeof resultado.valor === 'number') {
                percentualBarra = ((resultado.valor - refMin) / intervalo) * 100;
                percentualBarra = Math.max(5, Math.min(95, percentualBarra));
            } else {
                percentualBarra = 50;
            }
            const intensidade = percentualBarra / 100;
            const r = Math.round(74 - (74 - 0) * intensidade);
            const g = Math.round(222 - (222 - 132) * intensidade);
            const b = Math.round(128 - (128 - 61) * intensidade);
            corBarra = `rgb(${r}, ${g}, ${b})`;
            notaClasse = "normal";
        } else if (resultado.status === "baixo") {
            mostrarBarra = true;
            percentualBarra = 10;
            corBarra = "#f59e0b";
            notaClasse = "alerta";
        } else if (resultado.status === "alto") {
            mostrarBarra = true;
            percentualBarra = 100;
            corBarra = "#ef4444";
            notaClasse = "critico";
        } else {
            mostrarBarra = false;
        }

    } else if (tipo === "diagnostico") {
        const ehNegativo = resultado.status === "negativo" || resultado.status === "imune";
        
        const primeiroCampo = config.campos[0];
        let valorMarcador = "";
        let unidadeMarcador = "";
        if (primeiroCampo) {
            const val = valoresAtuais[primeiroCampo.id];
            if (val && typeof val === 'object') {
                valorMarcador = val.valor || "";
            } else if (val) {
                valorMarcador = val;
            }
            unidadeMarcador = primeiroCampo.unidade || "";
        }
        valorDireito = valorMarcador || "—";
        unidadeDireito = unidadeMarcador;
        
        statusEsquerdo = ehNegativo ? "Negativo" : "Positivo";
        infoEsquerda = resultado.classificacao || "";
        infoDireita = resultado.fase || "";
        
        if (ehNegativo) {
            mostrarBarra = true;
            percentualBarra = 20;
            corBarra = "#4ade80";
            notaClasse = "normal";
        } else {
            if (resultado.status === "grave" || resultado.status === "muito_grave") {
                mostrarBarra = true;
                percentualBarra = 100;
                corBarra = "#ef4444";
                notaClasse = "critico";
            } else if (resultado.status === "moderado") {
                mostrarBarra = true;
                percentualBarra = 60;
                corBarra = "#f97316";
                notaClasse = "alerta";
            } else {
                mostrarBarra = true;
                percentualBarra = 30;
                corBarra = "#f59e0b";
                notaClasse = "alerta";
            }
        }

    } else if (tipo === "escala") {
        const refMin = resultado.referenciaMin !== undefined ? resultado.referenciaMin : 0;
        const refMax = resultado.referenciaMax !== undefined ? resultado.referenciaMax : 100;
        const refLabel = resultado.referenciaLabel || "Normal";
        
        if (resultado.ehPontuacao && resultado.soma !== undefined) {
            valorDireito = resultado.soma;
            unidadeDireito = "pontos";
        } else if (resultado.soma !== undefined) {
            valorDireito = resultado.soma.toFixed(1);
            unidadeDireito = "";
        } else {
            valorDireito = "—";
            unidadeDireito = "";
        }
        
        infoEsquerda = `Referência: ${refMin} - ${refMax} (${refLabel})`;
        infoDireita = resultado.interpretacao || resultado.classificacao || "";

        // NOVO: a barra agora reage ao VALOR (soma) e à sua posição face à
        // referência/estágios da própria base de dados, em vez de comparar
        // nomes de status fixos (o que fazia "baixo" e "grave" se comportarem
        // igual, e escalas com status de referência diferente de "bom" — como
        // a Glasgow, cujo estado normal chama-se "leve" — nunca variarem).
        const soma = resultado.soma;
        const estagiosOrdenados = (config.estagios || [])
            .filter(e => e.soma_min !== undefined && e.soma_max !== undefined)
            .slice()
            .sort((a, b) => a.soma_min - b.soma_min);
        const idxAtual = estagiosOrdenados.findIndex(e => soma >= e.soma_min && soma <= e.soma_max);

        if (soma === undefined || isNaN(soma) || idxAtual === -1) {
            mostrarBarra = false;

        } else if (soma >= refMin && soma <= refMax) {
            // Dentro da referência: varia suavemente conforme a posição no intervalo
            mostrarBarra = true;
            const intervalo = refMax - refMin;
            percentualBarra = intervalo > 0 ? ((soma - refMin) / intervalo) * 100 : 50;
            percentualBarra = Math.max(10, Math.min(90, percentualBarra));
            const intensidade = percentualBarra / 100;
            const r = Math.round(74 - (74 - 0) * intensidade);
            const g = Math.round(222 - (222 - 132) * intensidade);
            const b = Math.round(128 - (128 - 61) * intensidade);
            corBarra = `rgb(${r}, ${g}, ${b})`;
            notaClasse = "normal";

        } else if (idxAtual === estagiosOrdenados.length - 1) {
            // Estágio mais extremo "para cima" da escala: barra cheia e vermelha
            mostrarBarra = true;
            percentualBarra = 100;
            corBarra = "#ef4444";
            notaClasse = "critico";

        } else if (idxAtual === 0) {
            // Estágio mais extremo "para baixo" da escala: barra vazia
            mostrarBarra = false;
            percentualBarra = 0;
            notaClasse = "critico";

        } else if (soma > refMax) {
            // Estágio intermédio acima da referência (ex.: sobrepeso)
            mostrarBarra = true;
            const estagio = estagiosOrdenados[idxAtual];
            const intervalo = estagio.soma_max - estagio.soma_min;
            const posicao = intervalo > 0 ? (soma - estagio.soma_min) / intervalo : 0.5;
            percentualBarra = 60 + posicao * 30; // ocupa a faixa 60%-90%
            corBarra = "#f97316";
            notaClasse = "alerta";

        } else {
            // Estágio intermédio abaixo da referência
            mostrarBarra = true;
            const estagio = estagiosOrdenados[idxAtual];
            const intervalo = estagio.soma_max - estagio.soma_min;
            const posicao = intervalo > 0 ? (soma - estagio.soma_min) / intervalo : 0.5;
            percentualBarra = 10 + posicao * 30; // ocupa a faixa 10%-40%
            corBarra = "#f59e0b";
            notaClasse = "alerta";
        }
    }

    // ===== MONTAR O CARD =====
    let html = `
        <div class="interpretador-card ${classeCard}" style="background: var(--card-bg); border-radius: 20px; padding: 20px 22px;">
            <!-- HEADER -->
            <div class="interpretador-card-header">
                <div class="interpretador-card-status" style="color: ${statusCor};">
                    <i class="${statusIcone}"></i> 
                    <span class="status-label">${statusEsquerdo}</span>
                </div>
                <div class="interpretador-card-valor" style="color: ${statusCor};">
                    <span class="valor-numero">${valorDireito}</span>${unidadeDireito ? `<span class="valor-unidade"> ${unidadeDireito}</span>` : ''}
                </div>
            </div>
            
            <!-- SUB-HEADER -->
            <div class="interpretador-card-sub">
    `;

    if (infoEsquerda) {
        const classeInfo = tipo === "exame" ? "interpretador-card-referencia" : "interpretador-card-classificacao";
        html += `<span class="${classeInfo}">${infoEsquerda}</span>`;
    } else {
        html += `<span></span>`;
    }

    if (infoDireita) {
        const classeInfo = tipo === "exame" ? "interpretador-card-termo" : "interpretador-card-fase";
        html += `<span class="${classeInfo}">${infoDireita}</span>`;
    }

    html += `
            </div>
    `;

    // ===== BARRA DE PROGRESSO =====
    if (mostrarBarra && percentualBarra > 0) {
        html += `
            <div class="interpretador-card-bar-wrapper">
                <div class="interpretador-card-bar">
                    <div class="interpretador-card-bar-fill" style="width: ${percentualBarra}%; background: ${corBarra};"></div>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="interpretador-card-bar-wrapper">
                <div class="interpretador-card-bar vazia">
                    <div class="interpretador-card-bar-fill" style="width: 0%;"></div>
                </div>
            </div>
        `;
    }

    // ===== NOTA =====
    html += `
            <div class="interpretador-card-nota ${notaClasse}">
                ${resultado.nota}
            </div>
        </div>
    `;

    pResultado.innerHTML = html;
    pResultado.style.display = "block";
    animarResultado();
}


// ============================================================================
// INTERPRETAR EXAME (CORRIGIDO - ESTRUTURA UNIFICADA)
// ============================================================================
function interpretarExame(valores, config) {
    const campo = config.campos[0];
    let valorNum;

    // NOVO: se o exame tiver uma "formula", o valor não vem direto de um único
    // campo — é calculado a partir de vários campos (ex.: TFG a partir de
    // creatinina, idade, peso). Se não tiver formula, comporta-se como antes.
    if (typeof config.formula === 'string') {
        const violacao = campoForaDoLimite(valores, config.campos);
        if (violacao) {
            return {
                status: "desconhecido",
                nota: mensagemCampoForaDoLimite(violacao),
                cor: "#ef4444",
                termo: "Fora dos Limites",
                valor: null,
                unidade: '',
                referenciaMin: config.referencia?.min ?? 0,
                referenciaMax: config.referencia?.max ?? 0,
                referenciaLabel: config.referencia?.label || "Referência",
                limiteMin: config.limites?.min ?? 0,
                limiteMax: config.limites?.max ?? 0,
                foraLimite: true,
                match: false
            };
        }
        valorNum = calcularFormula(config.formula, valores, config.campos);
        if (valorNum === null) return null;
    } else {
        valorNum = parseFloat(valores[campo.id]);
    }

    if (isNaN(valorNum)) return null;

    const limites = config.limites || { min: -Infinity, max: Infinity };
    const referencia = config.referencia || { min: 0, max: 0, unidade: '' };
    
    // CORREÇÃO: Verifica limites de segurança primeiro
    if (valorNum < limites.min || valorNum > limites.max) {
        const mensagem = valorNum < limites.min 
            ? `⚠️ VALOR EXTREMAMENTE BAIXO! Fora dos limites clinicamente esperados (${limites.min} - ${limites.max}). Verificar resultado.`
            : `⚠️ VALOR EXTREMAMENTE ALTO! Fora dos limites clinicamente esperados (${limites.min} - ${limites.max}). Verificar resultado.`;
        
        return {
            status: "desconhecido",
            nota: mensagem,
            cor: "#ef4444",
            termo: "Fora dos Limites",
            valor: valorNum,
            unidade: campo.unidade || referencia.unidade || '',
            referenciaMin: referencia.min,
            referenciaMax: referencia.max,
            referenciaLabel: referencia.label || "Referência",
            limiteMin: limites.min,
            limiteMax: limites.max,
            foraLimite: true,
            match: false
        };
    }

    // CORREÇÃO: Procura a faixa correta
    let resultadoEncontrado = null;
    for (const nota of config.notas) {
        if (valorNum >= nota.min && valorNum <= nota.max) {
            resultadoEncontrado = {
                status: nota.status,
                nota: nota.nota,
                cor: nota.cor || STATUS_CONFIG[nota.status]?.cor || "#00843d",
                termo: nota.termo || null,
                valor: valorNum,
                unidade: campo.unidade || referencia.unidade || '',
                referenciaMin: referencia.min,
                referenciaMax: referencia.max,
                referenciaLabel: referencia.label || "Referência",
                limiteMin: limites.min,
                limiteMax: limites.max,
                foraLimite: false,
                match: true
            };
            break;
        }
    }

    // Se não encontrou nenhuma faixa
    if (!resultadoEncontrado) {
        return {
            status: "desconhecido",
            nota: "Valor não se enquadra em nenhuma categoria conhecida. Verificar resultado.",
            cor: "#94a3b8",
            termo: "Indeterminado",
            valor: valorNum,
            unidade: campo.unidade || referencia.unidade || '',
            referenciaMin: referencia.min,
            referenciaMax: referencia.max,
            referenciaLabel: referencia.label || "Referência",
            limiteMin: limites.min,
            limiteMax: limites.max,
            foraLimite: false,
            match: false
        };
    }

    return resultadoEncontrado;
}

// ============================================================================
// INTERPRETAR DIAGNÓSTICO (CORRIGIDO)
// ============================================================================
function interpretarDiagnostico(valores, config) {
    const limites = config.limites || { min: -Infinity, max: Infinity };

    // NOVO: se o diagnóstico tiver uma "formula", calcula o valor e injeta-o
    // sob a chave reservada "_formula". Os "estagios" podem então usá-la como
    // qualquer outro campo, ex.: estagios: [{ valores: { _formula: [0, 3] }, ... }]
    let valoresParaAvaliar = valores;
    if (typeof config.formula === 'string') {
        const violacao = campoForaDoLimite(valores, config.campos);
        if (violacao) {
            return {
                status: "desconhecido",
                classificacao: null,
                nota: mensagemCampoForaDoLimite(violacao),
                fase: null,
                match: false,
                foraLimite: true,
                referenciaMin: limites.min,
                referenciaMax: limites.max,
                referenciaLabel: "Limites"
            };
        }

        const resultadoFormula = calcularFormula(config.formula, valores, config.campos);
        if (resultadoFormula === null) {
            return {
                status: "desconhecido",
                classificacao: null,
                nota: "⚠️ Valores inválidos. Verifique os dados inseridos.",
                fase: null,
                match: false,
                foraLimite: false,
                referenciaMin: limites.min,
                referenciaMax: limites.max,
                referenciaLabel: "Limites"
            };
        }
        valoresParaAvaliar = { ...valores, _formula: String(resultadoFormula) };
    }
    
    // CORREÇÃO: Verifica limites para valores numéricos
    for (const [key, valor] of Object.entries(valoresParaAvaliar)) {
        // Se for string numérica, converte e valida
        if (typeof valor === 'string' && !isNaN(parseFloat(valor)) && isFinite(valor)) {
            const num = parseFloat(valor);
            if (num < limites.min || num > limites.max) {
                const direcao = num < limites.min ? "baixo" : "alto";
                return {
                    status: "desconhecido",
                    classificacao: null,
                    nota: `⚠️ VALOR EXTREMAMENTE ${direcao.toUpperCase()}! Fora dos limites clinicamente esperados (${limites.min} - ${limites.max}). Verificar resultado.`,
                    fase: null,
                    match: false,
                    foraLimite: true,
                    referenciaMin: limites.min,
                    referenciaMax: limites.max,
                    referenciaLabel: "Limites"
                };
            }
        }
    }

    // CORREÇÃO: Procura o estágio que corresponde
    for (const estagio of config.estagios) {
        let match = true;
        for (const [key, valorEsperado] of Object.entries(estagio.valores)) {
            const valorInserido = valoresParaAvaliar[key];
            
            // Se for objeto com {valor, peso}
            let valorComparar = valorInserido;
            if (typeof valorInserido === 'object' && valorInserido !== null) {
                valorComparar = valorInserido.valor;
            }
            
            if (Array.isArray(valorEsperado)) {
                // Intervalo numérico
                const num = parseFloat(valorComparar);
                if (isNaN(num) || num < valorEsperado[0] || num > valorEsperado[1]) {
                    match = false;
                    break;
                }
            } else {
                // Valor exato (string)
                if (valorComparar !== valorEsperado) {
                    match = false;
                    break;
                }
            }
        }
        
        if (match) {
            const statusConfig = STATUS_CONFIG[estagio.status] || STATUS_CONFIG.desconhecido;
            return {
                status: estagio.status,
                classificacao: estagio.classificacao || null,
                nota: estagio.nota,
                fase: estagio.fase || null,
                match: true,
                foraLimite: false,
                cor: statusConfig.cor,
                referenciaMin: null,
                referenciaMax: null,
                referenciaLabel: null
            };
        }
    }
    
    return {
        status: "desconhecido",
        classificacao: null,
        nota: "Nenhum estágio corresponde aos valores inseridos. Verificar os dados.",
        fase: null,
        match: false,
        foraLimite: false,
        cor: "#94a3b8",
        referenciaMin: null,
        referenciaMax: null,
        referenciaLabel: null
    };
}

// ============================================================================
// VALIDAR LIMITES POR CAMPO (genérica — usa min/max opcionais definidos em
// cada campo da base de dados, ex.: { id: "altura", min: 0.3, max: 2.5 })
// ============================================================================
function campoForaDoLimite(valores, campos) {
    for (const campo of campos) {
        if (campo.min === undefined && campo.max === undefined) continue;
        const valor = parseFloat(valores[campo.id]);
        if (isNaN(valor)) continue; // campo vazio/inválido é tratado noutra validação
        if (campo.min !== undefined && valor < campo.min) {
            return { campo, valor, limite: campo.min, direcao: "baixo" };
        }
        if (campo.max !== undefined && valor > campo.max) {
            return { campo, valor, limite: campo.max, direcao: "alto" };
        }
    }
    return null;
}

function mensagemCampoForaDoLimite(violacao) {
    const tipoLimite = violacao.direcao === "baixo" ? "mínimo" : "máximo";
    const unidade = violacao.campo.unidade ? ` ${violacao.campo.unidade}` : "";
    return `⚠️ ${violacao.campo.label} fora do limite (${tipoLimite} ${violacao.limite}${unidade}). Verifique o valor inserido.`;
}

// ============================================================================
// CALCULAR FÓRMULA (genérica — interpreta uma string de expressão matemática
// usando os ids dos "campos" da base de dados como variáveis)
// ============================================================================
function calcularFormula(formula, valores, campos) {
    const nomes = campos.map(c => c.id);

    // Funções matemáticas seguras permitidas nas fórmulas (ex.: "Math.sqrt(peso)")
    const funcoesPermitidas = [
        'Math.sqrt', 'Math.pow', 'Math.log10', 'Math.log', 'Math.abs',
        'Math.min', 'Math.max', 'Math.round', 'Math.floor', 'Math.ceil',
        'Math.exp', 'Math.PI'
    ];

    // Validação de segurança: depois de remover os nomes de variáveis conhecidos
    // e as funções Math permitidas, só pode sobrar números, espaços, ponto
    // decimal, vírgulas, operadores e parênteses. Isto impede que a string
    // execute qualquer coisa além de uma conta matemática.
    let sobra = formula;
    for (const termo of funcoesPermitidas) {
        sobra = sobra.split(termo).join(' ');
    }
    for (const nome of nomes) {
        sobra = sobra.split(nome).join(' ');
    }
    if (!/^[\d\s+\-*/().,]*$/.test(sobra)) {
        console.error("Fórmula contém termos não permitidos:", formula);
        return null;
    }

    // Recolhe os valores numéricos de cada campo, na mesma ordem dos nomes
    const args = nomes.map(nome => parseFloat(valores[nome]));
    if (args.some(v => isNaN(v))) {
        return null;
    }

    try {
        const fn = new Function(...nomes, `return (${formula});`);
        const resultado = fn(...args);
        return (typeof resultado === 'number' && isFinite(resultado)) ? resultado : null;
    } catch (erro) {
        console.error("Erro ao calcular fórmula:", erro);
        return null;
    }
}

// ============================================================================
// INTERPRETAR ESCALA (CORRIGIDO - IMC FUNCIONAL)
// ============================================================================
function interpretarEscala(valores, config) {
    let soma = 0;
    let ehPontuacao = false;
    let todosPreenchidos = true;

    // Calcula soma de pontos para escalas com pesos por opção (selects, ex.: Apgar/Glasgow)
    for (const campo of config.campos) {
        const valor = valores[campo.id];
        if (valor && typeof valor === 'object' && valor.peso !== undefined) {
            soma += valor.peso;
            ehPontuacao = true;
        } else if (valor && typeof valor === 'object' && valor.valor) {
            const match = valor.valor.match(/^(\d+)/);
            if (match) {
                soma += parseInt(match[1]);
                ehPontuacao = true;
            }
        }
    }

    // Genérico: qualquer item da base de dados pode ter uma "formula" (texto)
    // que calcula o valor a partir dos campos preenchidos, em vez de somar pesos.
    if (!ehPontuacao && typeof config.formula === 'string') {
        // Verifica se todos os campos exigidos pela fórmula foram preenchidos
        for (const campo of config.campos) {
            const valor = valores[campo.id];
            if (valor === undefined || valor === null || valor === "") {
                return {
                    status: "desconhecido",
                    classificacao: null,
                    nota: `⚠️ Preencha ${campo.label.toUpperCase()} para calcular.`,
                    soma: 0,
                    interpretacao: null,
                    match: false,
                    ehPontuacao: false,
                    foraLimite: false,
                    referenciaMin: config.referencia?.min || 0,
                    referenciaMax: config.referencia?.max || 100,
                    referenciaLabel: config.referencia?.label || "Normal",
                    limiteMin: config.limites?.min || 0,
                    limiteMax: config.limites?.max || 100,
                    cor: "#ef4444"
                };
            }
        }

        // NOVO: valida os limites individuais de cada campo (ex.: altura entre
        // 0.3 e 2.5m) antes de calcular — evita que valores absurdos "se
        // cancelem" na fórmula e pareçam um resultado normal.
        const violacao = campoForaDoLimite(valores, config.campos);
        if (violacao) {
            return {
                status: "desconhecido",
                classificacao: null,
                nota: mensagemCampoForaDoLimite(violacao),
                soma: 0,
                interpretacao: null,
                match: false,
                ehPontuacao: false,
                foraLimite: true,
                referenciaMin: config.referencia?.min || 0,
                referenciaMax: config.referencia?.max || 100,
                referenciaLabel: config.referencia?.label || "Normal",
                limiteMin: config.limites?.min || 0,
                limiteMax: config.limites?.max || 100,
                cor: "#ef4444"
            };
        }

        const resultado = calcularFormula(config.formula, valores, config.campos);

        if (resultado === null || isNaN(resultado)) {
            return {
                status: "desconhecido",
                classificacao: null,
                nota: "⚠️ Valores inválidos. Verifique os dados inseridos.",
                soma: 0,
                interpretacao: null,
                match: false,
                ehPontuacao: false,
                foraLimite: false,
                referenciaMin: config.referencia?.min || 0,
                referenciaMax: config.referencia?.max || 100,
                referenciaLabel: config.referencia?.label || "Normal",
                limiteMin: config.limites?.min || 0,
                limiteMax: config.limites?.max || 100,
                cor: "#ef4444"
            };
        }

        soma = resultado;
        // NOTA: não marca ehPontuacao aqui — o valor vem de uma fórmula
        // (ex.: IMC), não de uma soma de pontos de opções, por isso não deve
        // ser exibido com a unidade "pontos".
    }

    const limites = config.limites || { min: -Infinity, max: Infinity };
    const referencia = config.referencia || { min: 0, max: 0, label: "Normal" };

    // CORREÇÃO: Verifica limites
    if (soma < limites.min || soma > limites.max) {
        const direcao = soma < limites.min ? "baixo" : "alto";
        return {
            status: "desconhecido",
            classificacao: null,
            nota: `⚠️ VALOR EXTREMAMENTE ${direcao.toUpperCase()}! Fora dos limites da escala (${limites.min} - ${limites.max}). Verificar os valores inseridos.`,
            soma: soma,
            interpretacao: null,
            match: false,
            ehPontuacao: ehPontuacao,
            foraLimite: true,
            referenciaMin: referencia.min,
            referenciaMax: referencia.max,
            referenciaLabel: referencia.label || "Normal",
            limiteMin: limites.min,
            limiteMax: limites.max,
            cor: "#ef4444"
        };
    }

    // CORREÇÃO: Procura o estágio correto
    for (const estagio of config.estagios) {
        if (soma >= estagio.soma_min && soma <= estagio.soma_max) {
            const statusConfig = STATUS_CONFIG[estagio.status] || STATUS_CONFIG.desconhecido;
            return {
                status: estagio.status,
                classificacao: estagio.classificacao || null,
                nota: estagio.nota,
                soma: soma,
                interpretacao: estagio.interpretacao || null,
                match: true,
                ehPontuacao: ehPontuacao,
                foraLimite: false,
                referenciaMin: referencia.min,
                referenciaMax: referencia.max,
                referenciaLabel: referencia.label || "Normal",
                limiteMin: limites.min,
                limiteMax: limites.max,
                cor: statusConfig.cor
            };
        }
    }

    // Se não encontrou estágio
    return {
        status: "desconhecido",
        classificacao: null,
        nota: "Pontuação fora dos intervalos esperados. Verificar os valores inseridos.",
        soma: soma,
        interpretacao: null,
        match: false,
        ehPontuacao: ehPontuacao,
        foraLimite: false,
        referenciaMin: referencia.min,
        referenciaMax: referencia.max,
        referenciaLabel: referencia.label || "Normal",
        limiteMin: limites.min,
        limiteMax: limites.max,
        cor: "#94a3b8"
    };
}


// ============================================================================
// ANALISAR (CORRIGIDO)
// ============================================================================
function analisar() {
    const nome = inputSearch.value.trim();
    
    if (!nome) {
        mostrarErro("⚠️ Pesquise um exame, doença ou escala!");
        return;
    }

    const config = database[nome];
    if (!config) {
        mostrarErro(`⚠️ "${nome}" não encontrado na base de dados!`);
        return;
    }

    // CORREÇÃO: Se o item carregado é diferente do que está na busca, recarrega
    if (!itemAtual || itemAtual.nome !== nome) {
        carregarItem(nome);
        // Aguarda o DOM atualizar e executa a análise
        setTimeout(() => executarAnalise(config), 150);
    } else {
        executarAnalise(config);
    }
}

// ============================================================================
// EXECUTAR ANÁLISE (CORRIGIDO)
// ============================================================================
function executarAnalise(config) {
    const { valores, todosPreenchidos, camposVazios } = getValoresPreenchidos();
    
    if (!todosPreenchidos) {
        const campos = camposVazios.join(', ');
        mostrarErro(`⚠️ Preencha todos os campos: ${campos}`);
        return;
    }

    let resultado;
    
    try {
        if (config.tipo === "exame") {
            // Exames com "formula" usam vários campos; sem formula, só o campo principal precisa estar preenchido
            if (typeof config.formula !== 'string') {
                const valor = valores[config.campos[0].id];
                if (!valor && valor !== 0) {
                    mostrarErro("⚠️ Valor do exame não informado!");
                    return;
                }
            }
            resultado = interpretarExame(valores, config);
            if (resultado) {
                exibirResultadoUnificado(resultado, config, "exame");
            } else {
                mostrarErro("⚠️ Erro ao interpretar o exame. Verifique o valor inserido.");
            }
            
        } else if (config.tipo === "diagnostico") {
            resultado = interpretarDiagnostico(valores, config);
            exibirResultadoUnificado(resultado, config, "diagnostico");
            
        } else if (config.tipo === "escala") {
            resultado = interpretarEscala(valores, config);
            exibirResultadoUnificado(resultado, config, "escala");
            
        } else {
            mostrarErro("⚠️ Tipo de item desconhecido!");
        }
    } catch (error) {
        console.error("Erro na análise:", error);
        mostrarErro("⚠️ Ocorreu um erro ao interpretar os dados. Tente novamente.");
    }
}

// ============================================================================
// MOSTRAR ERRO (CORRIGIDO)
// ============================================================================
function mostrarErro(mensagem) {
    pResultado.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.1); border-radius: 20px; padding: 20px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.2);">
            <i class="ri-error-warning-fill" style="font-size: 2.5rem; color: #ef4444; display: block; margin-bottom: 10px;"></i>
            <span style="color: var(--text); font-weight: 500; font-size: 0.95rem;">${mensagem}</span>
        </div>
    `;
    pResultado.style.display = "block";
    animarResultado();
}

// ============================================================================
// ANIMAR RESULTADO (CORRIGIDO)
// ============================================================================
function animarResultado() {
    if (!pResultado) return;
    
    // Remove a classe de animação se existir
    pResultado.classList.remove("vibrar");
    
    // Força reflow para reiniciar a animação
    void pResultado.offsetWidth;
    
    // Adiciona a classe novamente
    pResultado.classList.add("vibrar");
}

// ============================================================================
// LIMPAR TUDO (CORRIGIDO - COMPLETO)
// ============================================================================
function limpar() {
    // 1. Limpar campo de busca
    inputSearch.value = "";
    
    // 2. Limpar sugestões
    divSugestoes.style.display = "none";
    divSugestoes.innerHTML = "";
    
    // 3. Limpar campo de valor único
    inputValor.value = "";
    inputValor.removeEventListener("input", handleInputValor);
    campoValorContainer.style.display = "none";
    uniTag.textContent = "--";
    
    // 4. Limpar campos dinâmicos
    if (camposDinamicosContainer) {
        camposDinamicosContainer.innerHTML = "";
        camposDinamicosContainer.style.display = "none";
    }
    
    // 5. Limpar resultado
    pResultado.innerHTML = "";
    pResultado.style.display = "none";
    pResultado.classList.remove("vibrar");
    
    // 6. Reset do estado
    valoresAtuais = {};
    itemAtual = null;
    
    // 7. Restaurar label do campo de busca
    const labelBusca = document.querySelector("#exame_nome + .label-flutuante");
    if (labelBusca) {
        labelBusca.textContent = "Exame, Doença ou Escala";
    }
    
    // 8. Fechar todos os selects abertos
    fecharTodosSelects();
    
    // 9. Fechar menu se estiver aberto (opcional)
    // if (menuLateral && menuLateral.classList.contains('ativo')) {
    //     fecharMenu();
    // }
    
    // 10. Foco no campo de busca
    setTimeout(() => {
        inputSearch.focus();
    }, 100);
}


// ============================================================================
// EVENTOS (CORRIGIDO)
// ============================================================================

// CORREÇÃO: Evento de busca com debounce para melhor performance
let timeoutBusca = null;

inputSearch.addEventListener("input", function(e) {
    // Limpa o timeout anterior
    if (timeoutBusca) {
        clearTimeout(timeoutBusca);
    }
    
    // Aplica debounce de 300ms
    timeoutBusca = setTimeout(() => {
        filtrarExames();
    }, 300);
});

// CORREÇÃO: Tecla Enter no campo de busca
inputSearch.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        
        // Se houver sugestões, pega a primeira
        const primeiroItem = divSugestoes.querySelector('.sugestao-item');
        if (primeiroItem) {
            primeiroItem.click();
        } else {
            // Se não houver sugestões, tenta analisar diretamente
            const nome = inputSearch.value.trim();
            if (nome && database[nome]) {
                carregarItem(nome);
                setTimeout(() => analisar(), 150);
            } else {
                analisar();
            }
        }
    }
});

// CORREÇÃO: Evento de clique no botão Analisar
document.getElementById("btnAnalisar").addEventListener("click", function(e) {
    e.preventDefault();
    analisar();
});

// CORREÇÃO: Evento de clique no botão Limpar
document.getElementById("btnLimpar").addEventListener("click", function(e) {
    e.preventDefault();
    limpar();
});

// CORREÇÃO: Fechar selects e sugestões com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharTodosSelects();
        divSugestoes.style.display = "none";
    }
});

// CORREÇÃO: Prevenir envio de formulário (caso o input esteja dentro de um form)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        analisar();
    });
});

// ============================================================================
// INICIALIZAÇÃO (CORRIGIDO)
// ============================================================================
function inicializar() {
    console.log("🚀 Inicializando Interpretador Clínico...");
    
    // 1. Configurar label do campo de busca
    const labelBusca = document.querySelector("#exame_nome + .label-flutuante");
    if (labelBusca) {
        labelBusca.textContent = "Exame, Doença ou Escala";
    }
    
    // 2. Esconder containers inicialmente
    if (camposDinamicosContainer) {
        camposDinamicosContainer.style.display = "none";
        camposDinamicosContainer.innerHTML = "";
    }
    
    if (campoValorContainer) {
        campoValorContainer.style.display = "none";
    }
    
    // 3. Esconder resultado
    if (pResultado) {
        pResultado.innerHTML = "";
        pResultado.style.display = "none";
    }
    
    // 4. Configurar unidade
    if (uniTag) {
        uniTag.textContent = "--";
    }
    
    // 5. Reset do estado
    valoresAtuais = {};
    itemAtual = null;
    
    // 6. Verificar se há parâmetros na URL (para testes)
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get('item');
    if (itemParam && database[itemParam]) {
        setTimeout(() => {
            inputSearch.value = itemParam;
            carregarItem(itemParam);
            setTimeout(() => analisar(), 200);
        }, 500);
    }
    
    // 7. Aplicar tema (já feito na Parte 2)
    
    console.log(`✅ Interpretador Clínico inicializado com sucesso!`);
    console.log(`📊 ${Object.keys(database).length} itens disponíveis na base de dados.`);
    console.log(`📋 Tipos: Exames(${Object.values(database).filter(i => i.tipo === 'exame').length}), Diagnósticos(${Object.values(database).filter(i => i.tipo === 'diagnostico').length}), Escalas(${Object.values(database).filter(i => i.tipo === 'escala').length})`);
}

// ============================================================================
// INICIAR QUANDO O DOM ESTIVER PRONTO
// ============================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    // DOM já carregado
    inicializar();
}

// ============================================================================
// EXPOR FUNÇÕES PARA DEBUG (OPCIONAL)
// ============================================================================
if (window) {
    window.__interpretador = {
        database: database,
        itemAtual: () => itemAtual,
        valoresAtuais: () => valoresAtuais,
        analisar: analisar,
        limpar: limpar,
        carregarItem: carregarItem,
        fecharTodosSelects: fecharTodosSelects
    };
}

console.log("📌 Para debug, use window.__interpretador");