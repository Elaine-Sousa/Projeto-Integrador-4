// =====================================================
// CARROSSEL DE IMAGENS (MODAL EXCLUSIVO DA EMPRESA)
// =====================================================

let imagensCarrossel = [];
let indiceAtual = 0;

async function verImagens(id) {
    try {
        const response = await fetch(`/imagens_devolucao/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar imagens.");

        const data = await response.json();
        imagensCarrossel = data.imagens || [];

        if (imagensCarrossel.length === 0) {
            alert("Nenhuma imagem disponível.");
            return;
        }

        indiceAtual = 0;
        atualizarImagemCarrossel();
        document.getElementById("modal-carrossel").style.display = "flex";

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function atualizarImagemCarrossel() {
    const img = document.getElementById("carousel-image");

    let imagem = imagensCarrossel[indiceAtual];

    // remove "imagens/" duplicado caso venha do SQLite
    if (imagem.startsWith("imagens/")) {
        imagem = imagem.replace("imagens/", "");
    }

    img.src = `${window.location.origin}/static/imagens/${imagem}`;
    img.alt = `Imagem ${indiceAtual + 1} de ${imagensCarrossel.length}`;

    atualizarIndicador();
}

function atualizarIndicador() {
    const indicador = document.getElementById("carousel-indicador");
    indicador.textContent = `${indiceAtual + 1} / ${imagensCarrossel.length}`;
}

// Botões do modal
document.getElementById("close-modal").onclick = () =>
    document.getElementById("modal-carrossel").style.display = "none";

document.getElementById("modal-carrossel").onclick = (e) => {
    if (e.target.id === "modal-carrossel") {
        document.getElementById("modal-carrossel").style.display = "none";
    }
};

document.getElementById("prev-btn").onclick = () => {
    indiceAtual = (indiceAtual - 1 + imagensCarrossel.length) % imagensCarrossel.length;
    atualizarImagemCarrossel();
};

document.getElementById("next-btn").onclick = () => {
    indiceAtual = (indiceAtual + 1) % imagensCarrossel.length;
    atualizarImagemCarrossel();
};


// =====================================================
// AÇÃO: ACEITAR DEVOLUÇÃO
// =====================================================

async function aceitarDevolucao(id) {
    if (!confirm("Deseja realmente aceitar esta devolução?")) return;

    const btnAceitar = document.getElementById(`btn-aceitar-${id}`);
    const btnEstoque = document.getElementById(`btn-moverEstoque-${id}`);
    const btnDescarte = document.getElementById(`btn-moverDescarte-${id}`);

    try {
        const res = await fetch(`/aceitar_devolucao/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Erro ao aprovar devolução.");

        btnAceitar.disabled = true;
        btnAceitar.textContent = "Devolução Aceita ✓";
        btnAceitar.style.backgroundColor = "#27ae60";

        // libera botões após aprovação
        [btnEstoque, btnDescarte].forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        });

        // Atualiza o status no card
        const card = document.querySelector(`.card[data-id='${id}']`);
        if (card) {
            let statusElem = card.querySelector(".status-devolucao");
            if (!statusElem) {
                statusElem = document.createElement("p");
                statusElem.classList.add("status-devolucao");
                card.appendChild(statusElem);
            }
            statusElem.innerHTML = `<strong>Status:</strong> <span class="status-aprovado">Aprovado</span>`;
        }

        alert("Reembolso liberado para o cliente.");

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


// =====================================================
// AÇÃO: MOVER PARA ESTOQUE FÍSICO
// =====================================================

async function moverParaEstoqueFisico(id) {
    if (!confirm("Mover para estoque físico?")) return;

    try {
        const res = await fetch("/mover_estoque_fisico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        if (!res.ok) throw new Error("Erro ao mover para o estoque físico.");

        alert("Item movido para o estoque físico!");
        location.reload(); // pode ser removido depois — opcional

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


// =====================================================
// AÇÃO: MOVER PARA DESCARTE
// =====================================================

async function moverParaDescarte(id) {
    if (!confirm("Mover este item para descarte?")) return;

    if (!id) {
        alert("ID inválido!");
        return;
    }

    try {
        const res = await fetch(`/mover_para_descarte/${id}`, {
            method: "POST"
        });

        if (!res.ok) throw new Error("Erro ao mover para descarte.");

        alert("Item movido para descarte!");
        location.reload();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


// =====================================================
// FILTRO DE BUSCA (DEBOUNCE)
// =====================================================

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const filtroInput = document.getElementById("filtro");

if (filtroInput) {
    filtroInput.addEventListener("input", debounce(() => {
        const filtro = filtroInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            const nome = (card.dataset.nome || "").toLowerCase();
            card.style.display = nome.includes(filtro) ? "" : "none";
        });
    }, 300));

    filtroInput.addEventListener("keydown", e => {
        if (e.key === "Enter") e.preventDefault();
    });
}
