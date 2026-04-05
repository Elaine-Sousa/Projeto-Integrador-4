// Seleciona todos os botões de descarte na tela
document.querySelectorAll('.btn-descarte').forEach((btn) => {

  // Adiciona evento de clique em cada botão
  btn.addEventListener('click', () => {

    // Pega o card mais próximo do botão clicado
    const card = btn.closest('.card');

    // Pega o ID do item (definido no HTML como data-id)
    const itemId = card.dataset.id;

    // Faz requisição para o Flask
    fetch(`/mover_para_descarte/${itemId}`, {
      method: 'POST' // IMPORTANTE: precisa bater com a rota Flask
    })

      // Converte a resposta para JSON
      .then((res) => {
        if (!res.ok) {
          // Se der erro (404, 500, etc), joga para o catch
          throw new Error("Erro na requisição");
        }
        return res.json();
      })

      // Trata a resposta da API
      .then((data) => {

        if (data.success) {
          // Remove o card da tela
          card.remove();

          // Mostra mensagem de sucesso
          alert('Item movido para descarte com sucesso!');
        } else {
          alert('Erro ao mover o item para descarte.');
        }

      })

      // Caso dê erro de conexão ou rota inexistente
      .catch((erro) => {
        console.error(erro);
        alert('Erro na comunicação com o servidor.');
      });

  });

});


// =========================
// 🔍 FILTRO EM TEMPO REAL
// =========================

// Seleciona o campo de busca
const filtroInput = document.getElementById('filtro');

// Evento ao digitar
filtroInput.addEventListener('input', debounce(() => {

  // Pega o valor digitado e normaliza
  const filtro = filtroInput.value.toLowerCase().trim();

  // Seleciona todos os cards
  const cards = document.querySelectorAll('.card');

  // Percorre todos os cards
  cards.forEach(card => {

    // Pega o nome do produto do atributo data-nome
    const nome = card.getAttribute('data-nome').toLowerCase();

    // Mostra ou esconde o card dependendo do filtro
    card.style.display = nome.includes(filtro) ? '' : 'none';

  });

}, 300));


// =========================
// ⛔ BLOQUEIA ENTER NO FILTRO
// =========================

// Evita que o Enter recarregue a página
filtroInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});