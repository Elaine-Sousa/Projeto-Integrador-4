function filterStock() {
    console.log("Filtro acionado");  // Para verificar se a função é chamada

    // Obter o valor do campo de pesquisa
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();  // Converter para minúsculas

    // Obter a tabela e todas as suas linhas
    const table = document.getElementById('stockTable');
    const rows = table.getElementsByTagName('tr');

    // Loop pelas linhas da tabela (começando da linha 1 para pular o cabeçalho)
    for (let i = 1; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName('td')[0];  // Pega a primeira coluna (produto)

        if (td) {
            const txtValue = td.textContent || td.innerText;  // Obter o texto da célula

            // Verificar se o texto da célula contém o valor da pesquisa
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = '';  // Exibir a linha
            } else {
                rows[i].style.display = 'none';  // Ocultar a linha
            }
        }
    }
}
