from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import openpyxl
from collections import OrderedDict
import os

# Função para ler o Excel
def ler_excel(caminho):
    try:
        workbook = openpyxl.load_workbook(caminho, data_only=True)
        planilha = workbook.active
        
        # Pega cabeçalhos da primeira linha
        cabecalhos = []
        for celula in planilha[1]:
            if celula.value:
                cabecalhos.append(str(celula.value).strip())
            else:
                cabecalhos.append(f"Coluna_{len(cabecalhos)+1}")
        
        # Lê os dados a partir da linha 2
        dados = []
        for linha in planilha.iter_rows(min_row=2, values_only=True):
            # Pula linhas completamente vazias
            if all(celula is None for celula in linha):
                continue
            
            linha_dict = OrderedDict()
            for idx, valor in enumerate(linha):
                if idx < len(cabecalhos):
                    # Converte valores para tipos que o JSON aceita
                    if valor is None:
                        linha_dict[cabecalhos[idx]] = ""
                    elif isinstance(valor, (int, float, str, bool)):
                        linha_dict[cabecalhos[idx]] = valor
                    else:
                        linha_dict[cabecalhos[idx]] = str(valor)
            dados.append(linha_dict)
        
        return dados
    except FileNotFoundError:
        return {"erro": f"Arquivo '{caminho}' não encontrado"}
    except Exception as e:
        return {"erro": str(e)}

# Handler personalizado
class MeuHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Rota /api/dados - retorna os dados do Excel
        if self.path == '/api/dados':
            dados = ler_excel('medicamentos.xlsx')
            
            # Prepara resposta
            if isinstance(dados, list):
                resposta = {
                    'status': 'sucesso',
                    'total': len(dados),
                    'dados': dados
                }
            else:
                resposta = {
                    'status': 'erro',
                    'mensagem': dados.get('erro', 'Erro desconhecido')
                }
            
            # Envia resposta JSON
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(resposta, ensure_ascii=False, indent=2).encode('utf-8'))
        
        # Rota / - serve arquivos estáticos (index.html, script.js, style.css, etc)
        else:
            # Chama o handler padrão para servir arquivos estáticos
            super().do_GET()
    
    # Adiciona suporte a OPTIONS para CORS (opcional)
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# Inicia o servidor
if __name__ == '__main__':
    PORT = 8080
    server = HTTPServer(('', PORT), MeuHandler)
    print(f'✅ Servidor rodando em: http://localhost:{PORT}')
    print(f'📊 Dados do Excel: http://localhost:{PORT}/api/dados')
    print('📁 Servindo arquivos: index.html, script.js, style.css')
    print('🔄 Pressione Ctrl+C para parar')
    server.serve_forever()