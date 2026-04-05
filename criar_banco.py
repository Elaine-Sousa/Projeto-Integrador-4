import sqlite3

# Conectar ao banco (ou criar se não existir)
conn = sqlite3.connect('banco.db')
cursor = conn.cursor()

# Criar a tabela 'clientes'
cursor.execute('''
    CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            telefone TEXT,
            endereco TEXT,
            cpf TEXT,
            senha TEXT NOT NULL
    )
''')

# Criar a tabela 'devolucoes'
cursor.execute('''
     CREATE TABLE IF NOT EXISTS devolucoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido INTEGER,  -- Permite NULL
        nome TEXT NOT NULL,
        motivo TEXT NOT NULL,
        imagem TEXT NOT NULL,
        preco REAL,
        quantidade INTEGER NOT NULL,
        customer_id INTEGER,
        status TEXT DEFAULT 'Aguardando Aprovação',
        FOREIGN KEY (customer_id) REFERENCES clientes(id)
    )
''')

# Criar a tabela 'imagens_devolucoes'
cursor.execute('''
    CREATE TABLE IF NOT EXISTS imagens_devolucoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    devolucao_id INTEGER NOT NULL,
    url_imagem TEXT NOT NULL,
    FOREIGN KEY (devolucao_id) REFERENCES devolucoes(id)
    )
''')

# Criar a tabela 'estoque_fisico'
cursor.execute('''
    CREATE TABLE IF NOT EXISTS estoque_fisico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        preco REAL,
        status_estoque TEXT NOT NULL
    )
''')

# Criar a tabela 'descarte'
cursor.execute('''
    CREATE TABLE IF NOT EXISTS descarte (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido INTEGER,  -- Permite NULL
        nome TEXT NOT NULL,
        motivo TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        imagem TEXT NOT NULL
    )
''')

# Inserção de dados nas tabelas
clientes = [
    ('João Silva', 'joao.silva@email.com', '123456789', 'Rua das Flores, 123','12345678900','senha123'),
    ('Maria Oliveira', 'maria.oliveira@email.com', '987654321', 'Avenida Brasil, 456','98765432100','senha456'),
    ('Carlos Souza', 'carlos.souza@gmail.com', '456123789', 'Praça Central, 789','45612378900','senha789'),
    ('Ana Pereira','ana_pereira@hotmail.com', '321654987', 'Rua do Sol, 101','32165498700','senha321'),
    ]

# Inserir dados na tabela 'clientes'
cursor.executemany('''
    INSERT INTO clientes (nome, email, telefone, endereco, cpf, senha)
    VALUES (?, ?, ?, ?, ?, ?)
''', clientes)

# Dados para a tabela devolucoes (agora com 'customer_id')
devolucoes = [
    (1,"Tênis", "Tamanho incorreto", "imagens/tenis.jpg", None, 2, 1),
    (2, "Camisa","Produto com defeito", "imagens/camisa.jpg", None, 1, 1),
    (3, "Calça Feminina","Não serviu", "imagens/calça.jpg", None, 3, 2),
    (4, "JaquetaCorta-Vento","Cor diferente da esperada", "imagens/JaquetaCorta-Vento.jpg", None, 1, 2),
    (5, "Meia Esportiva","Material desconfortável", "imagens/MeiaEsportiva.jpg", None, 5, 1),
    (6, "Bone Casual","Produto amassado", "imagens/BoneCasual.jpg", None, 2, 2),
    (7, "Relogio Digital","Não funcionou", "imagens/RelogioDigital.jpg", None, 1, 2),
    (8, "Mochila Escolar","Zíper com defeito", "imagens/MochilaEscolar.jpg", None, 2, 1),
    (9, "Oculos de Sol","Risco na lente", "imagens/oculosdeSol.jpg", None, 1, 1),
    (20, "Ventilador Portatil","Desisti da compra", "imagens/ventilado.jpg", None, 1, 1),
    (45, "Ventilador","Não liga", "imagens/ventilador.jpg", None, 1, 2),
    (56, "Tablet","Risco na lente", "imagens/Tablet.jpg", None, 1, 2),
]

# Inserir dados na tabela devolucoes
cursor.executemany('''
    INSERT INTO devolucoes (pedido,nome, motivo, imagem, preco, quantidade, customer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
''', devolucoes)

# Dados para imagens_devolucoes
imagens_devolucoes = imagens_devolucoes = [

    (1, 'static/imagens/tenis1.png'),
    (1, 'static/imagens/tenis2.png'),

    (2, 'static/imagens/camisa1.png'),
    (2, 'static/imagens/camisa2.png'),

    (3, 'static/imagens/calça1.png'),
    (3, 'static/imagens/calça2.png'),

    (4, 'static/imagens/JaquetaCorta-Vento1.png'),

    (5, 'static/imagens/MeiaEsportiva.jpg'),

    (6, 'static/imagens/BoneCasual.jpg'),

    (7, 'static/imagens/RelogioDigital.jpg'),

    (8, 'static/imagens/MochilaEscolar.jpg'),

    (9, 'static/imagens/oculosdeSol.jpg'),

    (10, 'static/imagens/ventilado.jpg'),

    (11, 'static/imagens/ventilador.jpg'),

    (12, 'static/imagens/Tablet.jpg')
]

# Inserir dados na tabela imagens_devolucoes
cursor.executemany('''
    INSERT INTO imagens_devolucoes (devolucao_id, url_imagem)
    VALUES (?, ?)
''', imagens_devolucoes)

# Dados para estoque_fisico
estoque_fisico = [
    ('Camiseta Básica', 'Roupas', 50, 39.99, 'Em Estoque'),
    ('Calça Jeans', 'Roupas', 30, 89.99, 'Em Estoque'),
    ('Smartphone', 'Eletrônicos', 0, 1499.99, 'Fora de Estoque'),
    ('Fone de Ouvido', 'Eletrônicos', 15, 199.99, 'Em Estoque'),
    ('Relógio de Pulso', 'Acessórios', 8, 250.00, 'Fora de Estoque'),
    ('Jaqueta de Couro', 'Roupas', 25, 349.99, 'Em Estoque'),
    ('Boné New Era', 'Acessórios', 18, 89.90, 'Em Estoque'),
    ('Blusa de Frio', 'Roupas', 40, 129.99, 'Em Estoque'),
    ('Macbook Pro', 'Eletrônicos', 5, 12999.00, 'Em Estoque'),
    ('Xbox Series X', 'Eletrônicos', 20, 4499.99, 'Em Estoque'),
    ('PlayStation 5', 'Eletrônicos', 3, 5299.00, 'Em Estoque'),
    ('Tablet Samsung', 'Eletrônicos', 8, 1199.00, 'Em Estoque'),
    ('Smartwatch', 'Eletrônicos', 10, 799.99, 'Em Estoque'),
    ('Óculos de Sol Ray-Ban', 'Acessórios', 15, 450.00, 'Em Estoque'),
]

# Inserir dados na tabela estoque_fisico
cursor.executemany('''
    INSERT INTO estoque_fisico (nome, categoria, quantidade, preco, status_estoque)
    VALUES (?, ?, ?, ?, ?)
''', estoque_fisico)


# Commit e fechamento da conexão
conn.commit()
conn.close()

print("✅ Banco de dados criado e populado com sucesso!")
