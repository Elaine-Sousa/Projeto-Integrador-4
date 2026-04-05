import sqlite3

# Conectar ao banco de dados
conn = sqlite3.connect('banco.db')
cursor = conn.cursor()

# Atualizar registros onde preco está NULL
cursor.execute("UPDATE devolucoes SET preco = 0 WHERE preco IS NULL;")

conn.commit()
conn.close()

print("Todos os preços NULL foram atualizados para 0.")