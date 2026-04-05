import os  # Biblioteca para lidar com caminhos de arquivos
from flask import Flask, jsonify, render_template, g, request
import sqlite3  # Banco de dados SQLite

# Cria a aplicação Flask
app = Flask(__name__)

# Define uma chave secreta (usada para sessões, flash, etc.)
app.secret_key = 'uma_chave_secreta_qualquer'

# Nome do banco de dados
DATABASE = 'banco.db'


# ---------------------- CONEXÃO COM BANCO ---------------------- #

def get_db():
    """
    Cria ou retorna uma conexão com o banco durante a requisição.
    Usa o 'g' para armazenar a conexão temporariamente.
    """
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)  # conecta no banco
        db.row_factory = sqlite3.Row  # permite acessar colunas por nome
    return db


def get_db_connection():
    """
    Cria uma nova conexão independente com o banco.
    Usada fora do ciclo principal (ex: funções auxiliares).
    """
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


@app.teardown_appcontext
def close_connection(exception):
    """
    Fecha a conexão com o banco automaticamente
    ao final de cada requisição.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


# ---------------------- ROTAS DO CORPORATIVO ---------------------- #

@app.route('/')
def home():
    """Página inicial"""
    return render_template('home.html')


@app.route('/login')
def login():
    """Tela de login do sistema"""
    return render_template('login.html')


@app.route('/cadastro')
def cadastro():
    """Tela de cadastro interno"""
    return render_template('cadastro.html')


@app.route('/acesso', methods=['GET', 'POST'])
def acesso():
    """
    Recebe dados do login (POST)
    e renderiza a página de acesso
    """
    if request.method == 'POST':
        dados = request.get_json()
        matricula = dados.get('matricula')
        email = dados.get('email')
        senha = dados.get('senha')
    return render_template('acesso.html')


@app.route('/reclamacoes')
def reclamacoes():
    """Exibe gráfico de reclamações"""
    db = get_db()
    cursor = db.execute("SELECT motivo, COUNT(*) FROM devolucoes GROUP BY motivo")
    resultados = cursor.fetchall()

    labels = [linha[0] for linha in resultados]
    valores = [linha[1] for linha in resultados]

    return render_template("reclamacoes.html", labels=labels, valores=valores)


@app.route('/estoqueFisico')
def estoque_fisico():
    """Lista produtos do estoque físico"""
    db = get_db()
    produtos = db.execute(
        'SELECT nome, categoria, quantidade, preco, status_estoque FROM estoque_fisico'
    ).fetchall()

    return render_template('estoqueFisico.html', produtos=produtos)


@app.route('/estoqueDevolucao')
def estoque_devolucao():
    """Lista produtos devolvidos"""
    db = get_db()
    devolucoes = db.execute('SELECT * FROM devolucoes').fetchall()

    lista = []
    for d in devolucoes:
        item = dict(d)
        if item['preco'] is None:
            item['preco'] = 0.0
        lista.append(item)

    return render_template('estoqueDevolucao.html', devolucoes=lista)


@app.route('/descarte')
def descarte():
    """Lista itens descartados"""
    db = get_db()
    itens = db.execute('SELECT * FROM descarte').fetchall()

    return render_template('descarte.html', itens=itens)

@app.route('/aceitar_devolucao/<int:id>', methods=['POST'])
def aceitar_devolucao(id):
    db = get_db()

    # Busca o item na tabela devoluções
    item = db.execute(
        "SELECT * FROM devolucoes WHERE id = ?",
        (id,)
    ).fetchone()

    if item:
        # Move para estoque físico
        db.execute('''
            INSERT INTO estoque_fisico (nome, categoria, quantidade, preco, status_estoque)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            item['nome'],
            'Categoria',
            item['quantidade'],
            item['preco'],
            'Em Estoque'
        ))

        # Remove da tabela devoluções
        db.execute("DELETE FROM devolucoes WHERE id = ?", (id,))
        db.commit()

        return jsonify({"success": True})

    return jsonify({"error": "Item não encontrado"}), 404




@app.route('/corporativo')
def corporativo():
    """Tela corporativa"""
    return render_template('corporativo.html')


@app.route('/teste')
def teste():
    """Página de teste"""
    return render_template('teste.html')


# ---------------------- ROTAS CLIENTE ---------------------- #

@app.route('/cliente')
def cliente():
    """Página principal do cliente"""
    return render_template('cliente.html')



@app.route('/cadastroc')
def cadastroc():
    """Cadastro do cliente"""
    return render_template('cadastroc.html')


@app.route('/loginc', endpoint='loginc')
def login():
    return render_template('loginc.html')
    


@app.route('/loginc', methods=['POST'])
def login_cliente():
    print("🔥 POST RECEBIDO")

    cpf = request.form.get('cpf')
    email = request.form.get('email')
    senha = request.form.get('senha')

    print(cpf, email, senha)

    return jsonify({
        "status": "success",
        "cliente_id": 1,
        "nome": "Teste"
    })


@app.route('/registroDevolucao', methods=['GET', 'POST'])
def registro_devolucao():
    if request.method == "GET":
        # Só para não dar erro 405 se alguém acessar direto
        return render_template("registroDevolucao.html")  # retorna seu HTML do formulário

    # Se for POST, processa a devolução
    order_number = request.form.get('orderNumber')
    name = request.form.get('name')
    reason = request.form.get('reason')
    customer_id = request.form.get('customerId')
    imagens = request.files.getlist("images")

    print("Pedido:", order_number)
    print("Nome:", name)
    print("Motivo:", reason)
    print("Cliente:", customer_id)
    print("Imagens recebidas:", imagens)

    return jsonify({"status": "success"})


# ---------------------- IMAGENS DEVOLUÇÃO ---------------------- #

def buscar_imagens_por_id(id_devolucao):
    """Busca imagens relacionadas a uma devolução"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT url_imagem FROM imagens_devolucoes WHERE devolucao_id = ?",
        (id_devolucao,)
    )

    resultados = cursor.fetchall()
    conn.close()

    return [row['url_imagem'] for row in resultados]


@app.route('/imagens_devolucao/<int:id>')
def imagens_devolucao(id):
    """Retorna imagens em formato JSON"""
    imagens = buscar_imagens_por_id(id)
    return jsonify({"imagens": imagens})


# ---------------------- MOVIMENTAÇÃO ---------------------- #

@app.route('/mover_estoque_fisico/<int:id>', methods=['POST'])
def mover_para_estoque_fisico(id):
    db = get_db()

    item = db.execute(
        "SELECT * FROM devolucoes WHERE id = ?",
        (id,)
    ).fetchone()

    if item:
        db.execute('''
            INSERT INTO estoque_fisico (nome, categoria, quantidade, preco, status_estoque)
            VALUES (?, ?, ?, ?, ?)
        ''', (item['nome'], 'Categoria', item['quantidade'], item['preco'], 'Em Estoque'))

        db.execute("DELETE FROM devolucoes WHERE id = ?", (id,))
        db.commit()

        return jsonify({'success': True})

    return jsonify({'error': 'Item não encontrado'}), 404


@app.route('/mover_para_descarte/<int:id>', methods=['POST'])
def mover_para_descarte(id):
    """Move item para descarte"""
    db = get_db()

    item = db.execute(
        "SELECT * FROM devolucoes WHERE id = ?",
        (id,)
    ).fetchone()

    if item:
        db.execute('''
            INSERT INTO descarte (nome, motivo, quantidade, preco, imagem)
            VALUES (?, ?, ?, ?, ?)
        ''', (item['nome'], item['motivo'], item['quantidade'], item['preco'], item['imagem']))

        db.execute("DELETE FROM devolucoes WHERE id = ?", (id,))
        db.commit()

        return jsonify({'success': True})

    return jsonify({'error': 'Item não encontrado'}), 404


# ---------------------- ERRO 404 ---------------------- #

@app.errorhandler(404)
def pagina_nao_encontrada(e):
    """Página personalizada de erro"""
    return render_template('404.html'), 404


# ---------------------- MAIN ---------------------- #

if __name__ == '__main__':
    app.run(debug=True)