import re
import sys
from openpyxl import load_workbook


class ErroFormato(Exception):
    def __init__(self, mensagem, contexto=None):
        prefixo = f"[{contexto}] " if contexto else ""
        super().__init__(f"{prefixo}{mensagem}")


# ---------------------------------------------------------------------------
# Tabelas de conversão
# ---------------------------------------------------------------------------

FATORES_MASSA_PARA_MG = {
    'mg': 1, 'g': 1000, 'mcg': 0.001, 'µg': 0.001, 'ug': 0.001, 'kg': 1_000_000,
}
FATORES_MASSA_PARA_MG_PLURAL = {
    'mgs': 1, 'gs': 1000, 'mcgs': 0.001, 'µgs': 0.001, 'ugs': 0.001, 'kgs': 1_000_000,
}
FATORES_MASSA_PARA_MG.update(FATORES_MASSA_PARA_MG_PLURAL)

FATORES_VOLUME_PARA_ML = {'ml': 1, 'mls': 1, 'l': 1000, 'ls': 1000}

DIAS_POR_UNIDADE_IDADE = {
    'dia': 1, 'dias': 1,
    'semana': 7, 'semanas': 7,
    'mes': 30, 'meses': 30, 'mês': 30, 'méses': 30,
    'ano': 365, 'anos': 365,
}

INTERVALO_DOSE_UNICA = {'dose única', 'dose unica', 'toma única', 'toma unica'}


def parse_valor_unidade(texto, tabela_unidades=None):
    texto = (texto or '').strip()
    if texto == '':
        return None
    m = re.match(r'^([\d.,]+)\s*([a-zA-Zµ]+)$', texto)
    if not m:
        raise ErroFormato(f"Não consegui interpretar '{texto}' como 'valor unidade' (ex. '20 mg')")
    valor = float(m.group(1).replace(',', '.'))
    unidade = m.group(2).lower()
    if tabela_unidades is not None and unidade not in tabela_unidades:
        raise ErroFormato(f"Unidade '{unidade}' não reconhecida em '{texto}'")
    return valor, unidade


def converter_massa_para_mg(valor, unidade):
    base = unidade.lower()
    if base in FATORES_MASSA_PARA_MG:
        return valor * FATORES_MASSA_PARA_MG[base]
    return None


# ---------------------------------------------------------------------------
# PARSER DO FORMULÁRIO INTERMÉDIO - VERSÃO CORRIGIDA
# ---------------------------------------------------------------------------

def dividir_linha_chave_valor(linha):
    linha = linha.strip()
    if ':' in linha:
        chave, _, valor = linha.partition(':')
        return chave.strip().lower(), valor.strip()
    return linha.strip().lower(), ''


CHAVES_CONDICAO_NIVEL_SUPERIOR = {'populacao', 'via', 'pesominimo', 'pesomaximo', 'idademinima', 'idademaxima'}
CHAVES_FASE = {'doseminima', 'dosemaxima', 'dosepadrao', 'unidadedose', 'fatorunidade', 'intervalo'}


def parse_formulario(texto):
    linhas = [l.rstrip() for l in texto.split('\n')]
    medicamentos = []
    med = None
    estado = None
    concentracao_atual = None
    condicao_atual = None
    lista_notas_ref = None

    def novo_medicamento():
        return {'nome': None, 'concentracoes': [], 'condicoes': [], 'notas_gerais': []}

    def nova_condicao():
        return {
            'nome': None, 'populacao': '', 'via': '',
            'pesoMinimo': '', 'pesoMaximo': '', 'idadeMinima': '', 'idadeMaxima': '',
            'simples': {'doseMinima': '', 'doseMaxima': '', 'dosePadrao': '', 'unidadeDose': '', 'fatorUnidade': '', 'intervalo': ''},
            'ataque': None, 'manutencao': None,
            'notas': [],
        }

    def finalizar_medicamento():
        nonlocal med, estado, concentracao_atual
        if med is not None:
            if estado == 'concentracao' and concentracao_atual is not None:
                # Verifica se a concentração tem pelo menos massa ou volume
                if concentracao_atual['massa'] or concentracao_atual['volume']:
                    med['concentracoes'].append(concentracao_atual)
            if med['nome'] and med['condicoes']:
                medicamentos.append(med)
            med = None
            estado = None
            concentracao_atual = None

    for num, linha_bruta in enumerate(linhas, start=1):
        linha = linha_bruta.strip()
        if linha == '' or linha.startswith('#'):
            continue

        # nota numerada
        m_nota = re.match(r'^(\d+)\.\s*(.*)$', linha)
        if m_nota and estado in ('notaExclusiva', 'notaGeral') and lista_notas_ref is not None:
            if m_nota.group(2).strip():
                lista_notas_ref.append(m_nota.group(2).strip())
            continue

        # separador de concentrações
        if linha == '.' and estado == 'concentracao' and concentracao_atual is not None:
            if concentracao_atual['massa'] or concentracao_atual['volume']:
                med['concentracoes'].append(concentracao_atual)
            concentracao_atual = {'massa': '', 'volume': '', 'instrucao': ''}
            continue

        chave, valor = dividir_linha_chave_valor(linha)

        if chave == 'nome':
            # Finaliza o medicamento anterior se existir
            if med is not None:
                finalizar_medicamento()
            med = novo_medicamento()
            med['nome'] = valor
            estado = None
            concentracao_atual = None
            continue

        if med is None:
            raise ErroFormato(f"Linha {num}: conteúdo antes de 'nome:' — todo medicamento começa por aí", linha)

        if chave == 'concentracao':
            estado = 'concentracao'
            concentracao_atual = {'massa': '', 'volume': '', 'instrucao': ''}
            continue

        if estado == 'concentracao' and chave in ('massa', 'volume', 'instrucao'):
            if concentracao_atual is not None:
                concentracao_atual[chave] = valor
            continue

        if chave == 'condicaoclinica':
            if estado == 'concentracao' and concentracao_atual is not None:
                if concentracao_atual['massa'] or concentracao_atual['volume']:
                    med['concentracoes'].append(concentracao_atual)
                estado = None
            condicao_atual = nova_condicao()
            condicao_atual['nome'] = valor
            med['condicoes'].append(condicao_atual)
            estado = 'condicao'
            continue

        if chave == 'ataque':
            if condicao_atual is not None:
                condicao_atual['ataque'] = {'doseMinima': '', 'doseMaxima': '', 'dosePadrao': '', 'unidadeDose': '', 'fatorUnidade': '', 'intervalo': ''}
                estado = 'ataque'
            continue
        if chave == 'manutencao':
            if condicao_atual is not None:
                condicao_atual['manutencao'] = {'doseMinima': '', 'doseMaxima': '', 'dosePadrao': '', 'unidadeDose': '', 'fatorUnidade': '', 'intervalo': ''}
                estado = 'manutencao'
            continue

        if chave == 'notaexclusiva':
            if condicao_atual is not None:
                estado = 'notaExclusiva'
                lista_notas_ref = condicao_atual['notas']
            continue

        if chave == 'notageral':
            estado = 'notaGeral'
            lista_notas_ref = med['notas_gerais']
            continue

        if estado == 'condicao' and condicao_atual is not None and chave in CHAVES_CONDICAO_NIVEL_SUPERIOR:
            mapa = {'pesominimo': 'pesoMinimo', 'pesomaximo': 'pesoMaximo',
                    'idademinima': 'idadeMinima', 'idademaxima': 'idadeMaxima'}
            campo = mapa.get(chave, chave)
            condicao_atual[campo] = valor
            continue

        if estado == 'condicao' and condicao_atual is not None and chave in CHAVES_FASE:
            mapa = {'doseminima': 'doseMinima', 'dosemaxima': 'doseMaxima', 'dosepadrao': 'dosePadrao',
                    'unidadedose': 'unidadeDose', 'fatorunidade': 'fatorUnidade', 'intervalo': 'intervalo'}
            condicao_atual['simples'][mapa[chave]] = valor
            continue

        if estado in ('ataque', 'manutencao') and condicao_atual is not None and chave in CHAVES_FASE:
            mapa = {'doseminima': 'doseMinima', 'dosemaxima': 'doseMaxima', 'dosepadrao': 'dosePadrao',
                    'unidadedose': 'unidadeDose', 'fatorunidade': 'fatorUnidade', 'intervalo': 'intervalo'}
            if condicao_atual[estado] is not None:
                condicao_atual[estado][mapa[chave]] = valor
            continue

        raise ErroFormato(f"Linha {num} não reconhecida no estado atual ({estado}): '{linha_bruta}'")

    # Finaliza o último medicamento
    finalizar_medicamento()

    return medicamentos


# ---------------------------------------------------------------------------
# CONSTRUÇÃO DAS LINHAS FINAIS
# ---------------------------------------------------------------------------

def montar_concentracao_e_adicionais_preparo(medicamento):
    if not medicamento['concentracoes']:
        raise ErroFormato("CONCENTRACAO em falta — campo obrigatório", medicamento['nome'])

    partes_concentracao = []
    instrucoes = []
    for i, c in enumerate(medicamento['concentracoes'], start=1):
        if not c['massa'] or not c['volume']:
            raise ErroFormato(f"Concentração #{i} sem massa/volume", medicamento['nome'])
        valor_massa, unidade_massa = parse_valor_unidade(c['massa'])
        valor_volume, unidade_volume = parse_valor_unidade(c['volume'], FATORES_VOLUME_PARA_ML)

        massa_mg = converter_massa_para_mg(valor_massa, unidade_massa)
        if massa_mg is None:
            raise ErroFormato(f"Unidade de massa '{unidade_massa}' não linear na concentração — confirma manualmente", medicamento['nome'])
        volume_ml = valor_volume * FATORES_VOLUME_PARA_ML[unidade_volume]

        fator = massa_mg / volume_ml
        texto = f"{c['massa'].strip()}/{c['volume'].strip()}"
        partes_concentracao.append(f"{texto}|{fator:g}")

        if c['instrucao'].strip():
            instrucoes.append(f"[{i}] {c['instrucao'].strip()}")

    concentracao_final = ';'.join(partes_concentracao)
    preparo_texto = ' '.join(instrucoes) if instrucoes else ''
    return concentracao_final, preparo_texto


def montar_peso_idade(condicao):
    def lado_peso(v):
        return v.replace(' kg', '').replace('kg', '').strip() if v else ''

    peso_str = f"{lado_peso(condicao['pesoMinimo'])};{lado_peso(condicao['pesoMaximo'])}" \
        if (condicao['pesoMinimo'] or condicao['pesoMaximo']) else ''

    idade_str = f"{condicao['idadeMinima'].strip()};{condicao['idadeMaxima'].strip()}" \
        if (condicao['idadeMinima'] or condicao['idadeMaxima']) else ''

    return peso_str, idade_str


def eh_invariavel(minimo, maximo, padrao):
    try:
        return float(minimo) == float(maximo) == float(padrao)
    except (TypeError, ValueError):
        return False


def _fmt(v):
    return str(int(v)) if float(v).is_integer() else f"{v:g}"


def montar_termo_dose(fase, nome_medicamento, sufixo_placeholder, pedacos_dose):
    minimo, maximo, padrao = fase['doseMinima'], fase['doseMaxima'], fase['dosePadrao']
    unidade = fase['unidadeDose'].strip()
    if minimo == '' or maximo == '' or padrao == '':
        raise ErroFormato(f"doseMinima/doseMaxima/dosePadrao incompletos ({sufixo_placeholder})", nome_medicamento)

    if eh_invariavel(minimo, maximo, padrao):
        valor_mg = converter_massa_para_mg(float(minimo), unidade)
        if valor_mg is None:
            if not fase['fatorUnidade'].strip():
                raise ErroFormato(
                    f"Dose invariável ({sufixo_placeholder}) em unidade não linear ('{unidade}') sem fatorUnidade — confirma manualmente",
                    nome_medicamento
                )
            valor_fator, unidade_fator = parse_valor_unidade(fase['fatorUnidade'])
            fator_mg = converter_massa_para_mg(valor_fator, unidade_fator)
            if fator_mg is None:
                raise ErroFormato(f"fatorUnidade '{fase['fatorUnidade']}' não é uma massa reconhecida", nome_medicamento)
            valor_mg = float(minimo) * valor_fator * fator_mg
        return _fmt(valor_mg)
    else:
        campo = f"dose_{sufixo_placeholder}" if sufixo_placeholder != 'simples' else 'dose'
        pedacos_dose.append(f"{minimo},{maximo},{padrao},{unidade}" + (f",{fase['fatorUnidade']}" if fase['fatorUnidade'].strip() else ""))
        return f"#d_{sufixo_placeholder}" if sufixo_placeholder != 'simples' else "#d"


def montar_termo_intervalo(fase, sufixo_placeholder, pedacos_intervalo):
    txt = fase['intervalo'].strip()
    if txt.lower() in INTERVALO_DOSE_UNICA:
        valor_intervalo = "24*"
    else:
        valor_intervalo = txt.replace(' h', '').replace('h', '').strip()
    campo = f"intervalo_{sufixo_placeholder}" if sufixo_placeholder != 'simples' else 'intervalo'
    pedacos_intervalo.append(valor_intervalo)
    return f"#i_{sufixo_placeholder}" if sufixo_placeholder != 'simples' else "#i", valor_intervalo


def _aplicar_peso_unidade(termo_dose, unidade, termo_intervalo):
    unidade = (unidade or '').lower()
    calc = termo_dose
    if '/kg' in unidade:
        calc = f"#p*{calc}"
    if '/dia' in unidade:
        calc = f"{calc}/{termo_intervalo}"
    calc = f"{calc}/#c"
    return calc


def montar_formula_e_dose_intervalo(condicao, nome_medicamento):
    if condicao['ataque'] or condicao['manutencao']:
        ataque = condicao['ataque'] or condicao['manutencao']
        manutencao = condicao['manutencao'] or condicao['ataque']

        pedacos_dose, pedacos_intervalo = [], []
        termo_dose_a = montar_termo_dose(ataque, nome_medicamento, 'ataque', pedacos_dose)
        termo_dose_m = montar_termo_dose(manutencao, nome_medicamento, 'manutencao', pedacos_dose)
        termo_int_a, val_int_a = montar_termo_intervalo(ataque, 'ataque', pedacos_intervalo)
        termo_int_m, val_int_m = montar_termo_intervalo(manutencao, 'manutencao', pedacos_intervalo)

        calc_a = _aplicar_peso_unidade(termo_dose_a, ataque['unidadeDose'], termo_int_a)
        calc_m = _aplicar_peso_unidade(termo_dose_m, manutencao['unidadeDose'], termo_int_m)
        formula = "{" + calc_a + "} ml {" + calc_m + "} ml"

        dose_col = f"ataque({ataque['doseMinima']},{ataque['doseMaxima']},{ataque['dosePadrao']},{ataque['unidadeDose']});manutencao({manutencao['doseMinima']},{manutencao['doseMaxima']},{manutencao['dosePadrao']},{manutencao['unidadeDose']})"
        intervalo_col = f"ataque({val_int_a});manutencao({val_int_m})"
        return dose_col, intervalo_col, formula
    else:
        fase = condicao['simples']
        pedacos_dose, pedacos_intervalo = [], []
        termo_dose = montar_termo_dose(fase, nome_medicamento, 'simples', pedacos_dose)
        termo_int, val_int = montar_termo_intervalo(fase, 'simples', pedacos_intervalo)
        calc = _aplicar_peso_unidade(termo_dose, fase['unidadeDose'], termo_int)
        formula = "{" + calc + "} ml"

        dose_col = '' if termo_dose != '#d' else f"{fase['doseMinima']},{fase['doseMaxima']},{fase['dosePadrao']},{fase['unidadeDose']}"
        intervalo_col = val_int
        return dose_col, intervalo_col, formula


def montar_adicionais(condicao, preparo_texto):
    segmentos = []
    for n in condicao['notas']:
        segmentos.append(('destaque', n))
    if preparo_texto:
        segmentos.append(('normal', preparo_texto))
    if not segmentos:
        return ''
    texto = '#'
    for tipo, conteudo in segmentos:
        texto += f"@@{conteudo}@" if tipo == 'destaque' else conteudo
        texto += '#'
    return texto.replace('##', '#')


def construir_linhas(medicamento):
    concentracao_final, preparo_texto = montar_concentracao_e_adicionais_preparo(medicamento)
    condicoes_unicas = len(medicamento['condicoes'])
    linhas = []

    for cond in medicamento['condicoes']:
        peso_str, idade_str = montar_peso_idade(cond)
        dose_col, intervalo_col, formula = montar_formula_e_dose_intervalo(cond, medicamento['nome'])
        adicionais = montar_adicionais(cond, preparo_texto)

        condicao_col = cond['nome'] if condicoes_unicas > 1 else ''
        populacoes_unicas = len({c['populacao'] for c in medicamento['condicoes'] if c['nome'] == cond['nome']})
        vias_unicas = len({c['via'] for c in medicamento['condicoes'] if c['nome'] == cond['nome'] and c['populacao'] == cond['populacao']})
        populacao_col = cond['populacao'] if populacoes_unicas > 1 else ''
        via_col = cond['via'] if vias_unicas > 1 else ''

        linhas.append([
            medicamento['nome'], condicao_col, populacao_col, via_col,
            idade_str, peso_str, dose_col, concentracao_final,
            intervalo_col, formula, adicionais, ''
        ])

    return linhas


# ---------------------------------------------------------------------------
# INJEÇÃO NA PLANILHA
# ---------------------------------------------------------------------------

def injetar_na_planilha(arquivo_xlsx, aba, linhas_para_inserir, nome_medicamento_por_linha):
    wb = load_workbook(arquivo_xlsx)
    ws = wb[aba]
    linha_vaga = max(8, ws.max_row + 1)

    medicamento_anterior = None
    for linha, nome_med in zip(linhas_para_inserir, nome_medicamento_por_linha):
        if medicamento_anterior is not None and nome_med != medicamento_anterior:
            linha_vaga += 1
        for col_idx, valor in enumerate(linha, start=1):
            ws.cell(row=linha_vaga, column=col_idx).value = valor
        linha_vaga += 1
        medicamento_anterior = nome_med

    wb.save(arquivo_xlsx)
    print(f"Sucesso! {len(linhas_para_inserir)} linhas adicionadas a partir da linha {linha_vaga - len(linhas_para_inserir)}.")


def processar_texto(texto):
    medicamentos = parse_formulario(texto)
    todas_as_linhas, nomes = [], []
    for med in medicamentos:
        if not med['nome']:
            raise ErroFormato("Medicamento sem 'nome:' — campo obrigatório")
        linhas = construir_linhas(med)
        todas_as_linhas.extend(linhas)
        nomes.extend([med['nome']] * len(linhas))
    return todas_as_linhas, nomes


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Uso: python injector.py <formulario.txt> <medicamentos.xlsx>")
        sys.exit(1)

    with open(sys.argv[1], encoding='utf-8') as f:
        texto = f.read()

    try:
        linhas, nomes = processar_texto(texto)
    except ErroFormato as e:
        print(f"ERRO DE FORMATO — nada foi escrito na planilha:\n{e}")
        sys.exit(1)

    for l in linhas:
        print(l)

    injetar_na_planilha(sys.argv[2], 'msf', linhas, nomes)