document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("reclamacoesChart");
  if (!canvas) return;

  const labels = JSON.parse(canvas.dataset.labels || "[]");
  const valores = JSON.parse(canvas.dataset.valores || "[]");

  console.log("Labels:", labels);  // DEBUG
  console.log("Valores:", valores); // DEBUG

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Quantidade de Devoluções",
        data: valores,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
});
