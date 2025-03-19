document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ El DOM ha sido cargado correctamente");

    // 🎯 Verificar si el canvas del gráfico de barras existe
    const canvas = document.getElementById("graficoEnergia");
    if (!canvas) {
        console.error("❌ No se encontró el elemento canvas con id 'graficoEnergia'");
        return;
    }

    const ctx = canvas.getContext("2d");

    // Datos del gráfico de barras
    const datosEnergia = {
        labels: ["Colombia", "Brasil", "Alemania", "Chile", "Noruega", "México", "Dinamarca", "Uruguay", "Portugal", "Suecia"], // Etiquetas del eje X
        datasets: [{
            label: "Producción de Energía Renovable (GW)", // Leyenda del gráfico
            data: [45, 120, 95, 60, 85, 75, 80, 50, 70, 45], // Datos de producción de energía
            backgroundColor: [
                "#3498db", // Colombia
                "#2ecc71", // Brasil
                "#f1c40f", // Alemania
                "#9b59b6", // Chile
                "#e74c3c", // Noruega
                "#e67e22", // México
                "#34495e", // Dinamarca
                "#1abc9c", // Uruguay
                "#d35400", // Portugal
                "#2FACA2"  // Suecia
            ],
            borderColor: [
                "#2980b9", // Colombia
                "#27ae60", // Brasil
                "#f39c12", // Alemania
                "#8e44ad", // Chile
                "#c0392b", // Noruega
                "#d35400", // México
                "#2c3e50", // Dinamarca
                "#16a085", // Uruguay
                "#e67e22", // Portugal
                "#249c92"  // Suecia
            ],
            borderWidth: 1 // Ancho del borde de las barras
        }]
    };

    // Opciones del gráfico de barras
    const opcionesGrafico = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Comparación de Producción de Energía Renovable (2025)",
                font: { size: 16 }
            },
            legend: {
                position: "bottom",
                labels: { font: { size: 12 } }
            },
            tooltip: {
                enabled: true, 
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw} GW`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Producción (GW)" }
            },
            x: {
                title: { display: true, text: "Países" }
            }
        },
        animation: {
            duration: 1000,
            easing: "easeInOutQuad"
        }
    };

    // Crear el gráfico de barras
    new Chart(ctx, {
        type: "bar",
        data: datosEnergia,
        options: opcionesGrafico
    });

    // 🎯 Verificar si el canvas del gráfico de torta existe
    
        const ctxLinea = document.getElementById("graficoEvolucion").getContext("2d");
    
        new Chart(ctxLinea, {
            type: "line",
            data: {
                labels: ["2000", "2005", "2010", "2015", "2020", "2025"],
                datasets: [
                    { label: "Colombia", data: [35, 40, 45, 50, 55, 60], borderColor: "#3498db", fill: false },
                    { label: "Brasil", data: [20, 30, 45, 60, 75, 85], borderColor: "#e74c3c", fill: false },
                    { label: "Alemania", data: [50, 55, 60, 65, 70, 75], borderColor: "#2ecc71", fill: false },
                    { label: "Chile", data: [40, 45, 50, 55, 60, 65], borderColor: "#9b59b6", fill: false },
                    { label: "Noruega", data: [60, 65, 70, 75, 80, 85], borderColor: "#f1c40f", fill: false },
                    { label: "México", data: [30, 35, 40, 45, 50, 55], borderColor: "#e67e22", fill: false },
                    { label: "Dinamarca", data: [55, 60, 65, 70, 75, 80], borderColor: "#34495e", fill: false },
                    { label: "Uruguay", data: [25, 30, 35, 40, 45, 50], borderColor: "#1abc9c", fill: false },
                    { label: "Portugal", data: [45, 50, 55, 60, 65, 70], borderColor: "#d35400", fill: false },
                    { label: "Suecia", data: [70, 75, 80, 85, 90, 95], borderColor: "#8e44ad", fill: false }
                ]   
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: "Evolución del % de Energía Renovable en el Consumo Total" },
                    legend: { position: "bottom" }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: "%" } },
                    x: { title: { display: true, text: "Año" } }
                }
            }
        });
    });

//Indicadores
const ctx = document.getElementById('graficoCircular').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie', // Gráfico circular
        data: {
            labels: ['Hidráulica', 'Solar', 'Eólica', 'Biomasa'],
            datasets: [{
                label: 'Energía Renovable en Colombia',
                data: [70, 15, 10, 5], // Datos en porcentaje
                backgroundColor: ['#3498db', '#f1c40f', '#2ecc71', '#e67e22']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    



