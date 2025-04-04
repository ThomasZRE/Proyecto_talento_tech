// Inicializar gráficos solo si existen en el documento
document.addEventListener('DOMContentLoaded', function() {
    inicializarGraficos();
    
    // Manejar redimensionamiento de ventana para gráficos responsivos
    window.addEventListener('resize', function() {
        // Opcional: Añadir función debounce aquí si es necesario
    });
    
    // Hacer que los gráficos sean visibles con animación cuando entren en el viewport
    const contenedoresGraficos = document.querySelectorAll('.contenedor-graficos');
    const opcionesObservador = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observador = new IntersectionObserver(function(entradas) {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0)';
                observador.unobserve(entrada.target);
            }
        });
    }, opcionesObservador);
    
    contenedoresGraficos.forEach(contenedor => {
        observador.observe(contenedor);
    });
});




/* BASE DE DATOS */


// 2. Función para cargar datos de Excel
function cargarDatosExcel(archivo, callback) {
    const lector = new FileReader();
    
    lector.onload = function(e) {
        const datos = e.target.result;
        const libro = XLSX.read(datos, { type: 'binary' });
        
        // Asumimos que queremos la primera hoja
        const nombreHoja = libro.SheetNames[0];
        const hoja = libro.Sheets[nombreHoja];
        
        // Convertir a JSON
        const datosJSON = XLSX.utils.sheet_to_json(hoja);
        
        callback(datosJSON);
    };
    
    lector.readAsBinaryString(archivo);
}
    































// Modificar la función inicializarGraficos para incluir todos los gráficos
function inicializarGraficos() {
    // Comprobar gráfico de evolución
    const elementoGraficoEvolucion = document.getElementById("graficoEvolucion");
    if (elementoGraficoEvolucion) {
        crearGraficoEvolucion(elementoGraficoEvolucion);
    }
    
    // Comprobar gráfico circular
    const elementoGraficoCircular = document.getElementById("graficoCircular");
    if (elementoGraficoCircular) {
        const paisInicial = document.getElementById('selectorPais')?.value || "Brasil";
        actualizarGrafico(paisInicial);
        animarCambioPais();
    }
    
   // Comprobar gráfico de renovables
   const elementoRenovablesChart = document.getElementById("renovablesChart");
   if (elementoRenovablesChart) {
       // Crear el selector de años si no existe
       crearSelectorAnios();
       // Inicializar gráfico con todos los años por defecto
       crearGrafico();
}
}



// 3. Función para actualizar el gráfico de evolución con los nuevos datos
function actualizarGraficoEvolucion(datos) {
    // Asumimos que los datos tienen un formato como:
    // [{año: "2000", colombia: 35, brasil: 20, ...}, {año: "2005", colombia: 40, ...}, ...]
    
    const canvas = document.getElementById("graficoEvolucion");
    const ctx = canvas.getContext("2d");
    
    // Extraer los años para las etiquetas
    const años = datos.map(fila => fila.año);
    
    // Extraer los datos de cada país
    // Primero obtenemos los nombres de los países (excluyendo la columna 'año')
    const nombrePaises = Object.keys(datos[0]).filter(key => key !== 'año');
    
    // Luego creamos datasets para cada país
    const datasets = nombrePaises.map(pais => {
        // Definimos colores para cada país (puedes mantener los colores de tu original)
        const colores = {
            colombia: 'rgba(52, 152, 219, 0.8)',
            brasil: 'rgba(231, 76, 60, 0.8)',
            alemania: 'rgba(46, 204, 113, 0.8)',
            chile: 'rgba(155, 89, 182, 0.8)',
            noruega: 'rgba(241, 196, 15, 0.8)',
            mexico: 'rgba(230, 126, 34, 0.8)',
            dinamarca: 'rgba(52, 73, 94, 0.8)',
            uruguay: 'rgba(26, 188, 156, 0.8)',
            portugal: 'rgba(211, 84, 0, 0.8)',
            suecia: 'rgba(142, 68, 173, 0.8)'
        };
        
        // Color predeterminado en caso de que el país no esté en la lista
        const colorPais = colores[pais.toLowerCase()] || 'rgba(100, 100, 100, 0.8)';
        
        return {
            label: pais.charAt(0).toUpperCase() + pais.slice(1), // Capitalizar nombre
            data: datos.map(fila => fila[pais]),
            borderColor: colorPais,
            backgroundColor: colorPais.replace('0.8', '0.1'),
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: colorPais,
            tension: 0.3,
            fill: false
        };
    });
    
    // Crear gráfico
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: años,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: "Evolución del % de Energía Renovable en el Consumo Total",
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: { 
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        boxWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    title: { 
                        display: true, 
                        text: "Porcentaje (%)",
                        font: {
                            weight: 'bold'
                        },
                        padding: {
                            bottom: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        precision: 0,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: { 
                    title: { 
                        display: true, 
                        text: "Año",
                        font: {
                            weight: 'bold'
                        },
                        padding: {
                            top: 10
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}



/* Función para cargar datos del gráfico circular*/
function actualizarGraficoCircular(datos, coloresFuentesEnergia) {
    // Asumimos que los datos tienen un formato como:
    // [{pais: "Brasil", hidraulica: 64.9, eolica: 11.2, ...}, {...}]
    
    // Crear un objeto con los datos de cada país
    const datosEnergiaPorPais = {};
    
    datos.forEach(fila => {
        const pais = fila.pais;
        const datosDelPais = {...fila};
        
        // Eliminar la columna 'pais'
        delete datosDelPais.pais;
        
        datosEnergiaPorPais[pais] = datosDelPais;
    });
    
    // Actualizar el selector de países
    const selectorPais = document.getElementById('selectorPais');
    if (selectorPais) {
        // Limpiar selector
        selectorPais.innerHTML = '';
        
        // Añadir opciones para cada país
        Object.keys(datosEnergiaPorPais).forEach(pais => {
            const opcion = document.createElement('option');
            opcion.value = pais;
            opcion.textContent = pais;
            selectorPais.appendChild(opcion);
        });
        
        // Actualizar gráfico con el primer país
        const primerPais = Object.keys(datosEnergiaPorPais)[0];
        actualizarGrafico(primerPais, datosEnergiaPorPais, coloresFuentesEnergia);
    }
}


// 5. Agregar un input para cargar el archivo Excel
function agregarSelectorExcel() {
    const contenedor = document.querySelector('.contenedor-graficos');
    if (!contenedor) return;
    
    // Crear contenedor para el selector
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'selector-excel';
    selectorContainer.style.margin = '20px 0';
    selectorContainer.style.padding = '10px';
    selectorContainer.style.backgroundColor = '#f8f9fa';
    selectorContainer.style.borderRadius = '8px';
    selectorContainer.style.textAlign = 'center';
    
    // Crear título
    const titulo = document.createElement('h3');
    titulo.textContent = 'Cargar datos desde Excel';
    titulo.style.marginBottom = '10px';
    
    // Crear input para archivo de evolución
    const inputEvolucion = document.createElement('div');
    inputEvolucion.innerHTML = `
        <p style="margin-bottom: 5px; font-weight: bold;">Datos para gráfico de evolución:</p>
        <input type="file" id="archivoEvolucion" accept=".xlsx, .xls" style="margin-bottom: 15px;">
    `;
    
    // Crear input para archivo de distribución
    const inputDistribucion = document.createElement('div');
    inputDistribucion.innerHTML = `
        <p style="margin-bottom: 5px; font-weight: bold;">Datos para gráfico de distribución:</p>
        <input type="file" id="archivoDistribucion" accept=".xlsx, .xls">
    `;
    
    // Añadir elementos al contenedor
    selectorContainer.appendChild(titulo);
    selectorContainer.appendChild(inputEvolucion);
    selectorContainer.appendChild(inputDistribucion);
    
    // Insertar al inicio del contenedor de gráficos
    contenedor.insertBefore(selectorContainer, contenedor.firstChild);
    
    // Añadir eventos
    document.getElementById('archivoEvolucion').addEventListener('change', function(e) {
        const archivo = e.target.files[0];
        if (archivo) {
            cargarDatosExcel(archivo, function(datos) {
                actualizarGraficoEvolucion(datos);
            });
        }
    });
    
    document.getElementById('archivoDistribucion').addEventListener('change', function(e) {
        const archivo = e.target.files[0];
        if (archivo) {
            cargarDatosExcel(archivo, function(datos) {
                // Definir colores para tipos de energía
                const coloresFuentesEnergia = {
                    "hidraulica": 'rgba(52, 152, 219, 0.8)',
                    "solar": 'rgba(241, 196, 15, 0.8)',
                    "eolica": 'rgba(46, 204, 113, 0.8)',
                    "biomasa": 'rgba(230, 126, 34, 0.8)',
                    "geotermica": 'rgba(155, 89, 182, 0.8)',
                    "termica": 'rgba(231, 76, 60, 0.8)',
                    "otras": 'rgba(52, 73, 94, 0.8)'
                };
                
                actualizarGraficoCircular(datos, coloresFuentesEnergia);
            });
        }
    });
}

// Llamar a esta función cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los gráficos con datos de ejemplo
    inicializarGraficos();
    
    // Añadir selector de archivos Excel
    agregarSelectorExcel();
});

































































function crearGraficoEvolucion(canvas) {
    const ctx = canvas.getContext("2d");
    
    // Definir colores del gráfico con mejor paleta 
    const coloresGrafico = {
        colombia: 'rgba(52, 152, 219, 0.8)',    // Azul
        brasil: 'rgba(231, 76, 60, 0.8)',       // Rojo
        alemania: 'rgba(46, 204, 113, 0.8)',    // Verde
        chile: 'rgba(155, 89, 182, 0.8)',       // Púrpura
        noruega: 'rgba(241, 196, 15, 0.8)',     // Amarillo
        mexico: 'rgba(230, 126, 34, 0.8)',      // Naranja
        dinamarca: 'rgba(52, 73, 94, 0.8)',     // Azul oscuro
        uruguay: 'rgba(26, 188, 156, 0.8)',     // Turquesa
        portugal: 'rgba(211, 84, 0, 0.8)',      // Naranja oscuro
        suecia: 'rgba(142, 68, 173, 0.8)'       // Púrpura oscuro
    };
    
    // Estilo de cuadrícula y texto
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.font.size = 13;
    
    const graficoLinea = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["2000", "2005", "2010", "2015", "2020", "2025"],
            datasets: [
                { 
                    label: "Colombia", 
                    data: [35, 40, 45, 50, 55, 60], 
                    borderColor: coloresGrafico.colombia,
                    backgroundColor: coloresGrafico.colombia.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.colombia,
                    tension: 0.3,  // Añade una ligera curva a las líneas
                    fill: false 
                },
                { 
                    label: "Brasil", 
                    data: [20, 30, 45, 60, 75, 85], 
                    borderColor: coloresGrafico.brasil,
                    backgroundColor: coloresGrafico.brasil.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.brasil,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "Alemania", 
                    data: [50, 55, 60, 65, 70, 75], 
                    borderColor: coloresGrafico.alemania,
                    backgroundColor: coloresGrafico.alemania.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.alemania,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "Chile", 
                    data: [40, 45, 50, 55, 60, 65], 
                    borderColor: coloresGrafico.chile,
                    backgroundColor: coloresGrafico.chile.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.chile,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "Noruega", 
                    data: [60, 65, 70, 75, 80, 85], 
                    borderColor: coloresGrafico.noruega,
                    backgroundColor: coloresGrafico.noruega.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.noruega,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "México", 
                    data: [30, 35, 40, 45, 50, 55], 
                    borderColor: coloresGrafico.mexico,
                    backgroundColor: coloresGrafico.mexico.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.mexico,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "Dinamarca", 
                    data: [55, 60, 65, 70, 75, 80], 
                    borderColor: coloresGrafico.dinamarca,
                    backgroundColor: coloresGrafico.dinamarca.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.dinamarca,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "Uruguay", 
                    data: [25, 30, 35, 40, 45, 50], 
                    borderColor: coloresGrafico.uruguay,
                    backgroundColor: coloresGrafico.uruguay.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.uruguay,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "Portugal", 
                    data: [45, 50, 55, 60, 65, 70], 
                    borderColor: coloresGrafico.portugal,
                    backgroundColor: coloresGrafico.portugal.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.portugal,
                    tension: 0.3,
                    fill: false 
                },
                { 
                    label: "Suecia", 
                    data: [70, 75, 80, 85, 90, 95], 
                    borderColor: coloresGrafico.suecia,
                    backgroundColor: coloresGrafico.suecia.replace('0.8', '0.1'),
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: coloresGrafico.suecia,
                    tension: 0.3,
                    fill: false 
                }
            ]   
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: "Evolución del % de Energía Renovable en el Consumo Total",
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: { 
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        boxWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    title: { 
                        display: true, 
                        text: "Porcentaje (%)",
                        font: {
                            weight: 'bold'
                        },
                        padding: {
                            bottom: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        precision: 0,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: { 
                    title: { 
                        display: true, 
                        text: "Año",
                        font: {
                            weight: 'bold'
                        },
                        padding: {
                            top: 10
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.3
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
    
    return graficoLinea;
}

// Datos de distribución de energías renovables por país (en porcentajes)
const datosEnergiaPorPais = {
    "Brasil": {
        "Hidráulica": 64.9,
        "Eólica": 11.2,
        "Biomasa": 8.9,
        "Solar": 3.7,
        "Otras Renovables": 1.3
    },
    "Chile": {
        "Hidráulica": 23.2,
        "Solar": 19.5,
        "Eólica": 9.8,
        "Biomasa": 2.1,
        "Geotérmica": 0.4
    },
    "México": {
        "Hidráulica": 9.7,
        "Eólica": 7.2,
        "Solar": 5.3,
        "Geotérmica": 1.8,
        "Biomasa": 0.9
    },
    "Uruguay": {
        "Eólica": 38.1,
        "Hidráulica": 36.9,
        "Biomasa": 15.7,
        "Solar": 5.2
    },
    "Alemania": {
        "Eólica": 26.8,
        "Solar": 10.5,
        "Biomasa": 8.3,
        "Hidráulica": 3.8,
        "Otras Renovables": 1.6
    },
    "Noruega": {
        "Hidráulica": 91.2,
        "Eólica": 6.8,
        "Térmica": 1.5,
        "Solar": 0.5
    },
    "Dinamarca": {
        "Eólica": 57.4,
        "Biomasa": 17.6,
        "Solar": 6.1,
        "Otras Renovables": 3.9
    },
    "Portugal": {
        "Eólica": 25.7,
        "Hidráulica": 16.5,
        "Solar": 9.3,
        "Biomasa": 6.8,
        "Otras Renovables": 1.7
    },
    "Suecia": {
        "Hidráulica": 39.5,
        "Eólica": 17.6,
        "Biomasa": 9.2,
        "Solar": 1.8,
        "Otras Renovables": 0.9
    }
};

// Información descriptiva de cada país
const infoEnergiaPorPais = {
    "Brasil": "Brasil es líder en Latinoamérica en energía hidroeléctrica con casi 65% de su matriz renovable.",
    "Chile": "Chile destaca por su fuerte crecimiento en energía solar, aprovechando el desierto de Atacama.",
    "México": "México ha incrementado su capacidad de energía solar y eólica en los últimos años.",
    "Uruguay": "Uruguay ha logrado que más del 95% de su electricidad provenga de fuentes renovables.",
    "Alemania": "Alemania lidera la transición energética europea con su plan Energiewende.",
    "Noruega": "Noruega produce casi toda su electricidad mediante energía hidroeléctrica.",
    "Dinamarca": "Dinamarca es pionera mundial en energía eólica, con más del 50% de su electricidad.",
    "Portugal": "Portugal ha logrado días enteros funcionando solo con energías renovables.",
    "Suecia": "Suecia tiene como objetivo ser 100% renovable para 2040."
};

// Colores para cada fuente de energía
const coloresFuentesEnergia = {
    "Hidráulica": 'rgba(52, 152, 219, 0.8)',     // Azul
    "Solar": 'rgba(241, 196, 15, 0.8)',          // Amarillo
    "Eólica": 'rgba(46, 204, 113, 0.8)',         // Verde
    "Biomasa": 'rgba(230, 126, 34, 0.8)',        // Naranja
    "Geotérmica": 'rgba(155, 89, 182, 0.8)',     // Púrpura
    "Térmica": 'rgba(231, 76, 60, 0.8)',         // Rojo
    "Otras Renovables": 'rgba(52, 73, 94, 0.8)'  // Azul oscuro
};

// Variable para almacenar la instancia del gráfico
let graficoCircular = null;

// Función para crear o actualizar el gráfico circular con animación
function actualizarGrafico(pais) {
    const datosDelPais = datosEnergiaPorPais[pais];
    const etiquetas = Object.keys(datosDelPais);
    const valores = Object.values(datosDelPais);
    
    // Obtener los colores en el orden correcto según las etiquetas
    const coloresOrdenados = etiquetas.map(tipo => coloresFuentesEnergia[tipo]);
    
    const ctx = document.getElementById('graficoCircular').getContext('2d');
    
    // Destruir el gráfico anterior si existe
    if (graficoCircular) {
        graficoCircular.destroy();
    }
    
    // Crear el nuevo gráfico
    graficoCircular = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: etiquetas,
            datasets: [{
                label: `Energía Renovable en ${pais}`,
                data: valores,
                backgroundColor: coloresOrdenados,
                borderColor: 'white',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Distribución de Energías Renovables en ${pais}`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1200,
                easing: 'easeOutElastic'
            }
        }
    });
    
    // Animar entrada de información
    animarInformacionPais(pais, valores, etiquetas);
}

// Función para animar la información adicional del país
function animarInformacionPais(pais, valores, etiquetas) {
    // Calcular la fuente predominante
    const energiaPredominante = etiquetas[valores.indexOf(Math.max(...valores))];
    const valorPredominante = Math.max(...valores);
    
    // Obtener o crear el elemento para la información
    let infoElement = document.getElementById('infoEnergia');
    if (!infoElement) {
        infoElement = document.createElement('div');
        infoElement.id = 'infoEnergia';
        infoElement.style.opacity = 0;
        infoElement.style.transform = 'translateY(20px)';
        infoElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        document.querySelector('.contenedor-graficos').appendChild(infoElement);
    } else {
        // Reset para animación
        infoElement.style.opacity = 0;
        infoElement.style.transform = 'translateY(20px)';
    }
    
    // Actualizar la información
    infoElement.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 5px; font-size: 18px; color: #2c3e50;">Análisis de ${pais}:</p>
        <div class="dato-principal" style="padding: 10px; border-radius: 8px; background-color: #f8f9fa; margin: 10px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p>Fuente predominante: <span style="font-weight: bold; color: ${coloresFuentesEnergia[energiaPredominante].replace('0.8', '1')};">
                ${energiaPredominante} (${valorPredominante}%)
            </span></p>
        </div>
        <p style="margin-top: 10px; line-height: 1.5; font-size: 15px;">${infoEnergiaPorPais[pais]}</p>
        <div class="indicadores" style="display: flex; justify-content: space-between; margin-top: 15px;">
            ${generarIndicadoresFuentes(etiquetas, valores)}
        </div>
    `;
    
    // Animar entrada con delay para coordinar con la animación del gráfico
    setTimeout(() => {
        infoElement.style.opacity = 1;
        infoElement.style.transform = 'translateY(0)';
    }, 200);
    
    // Animar secciones individuales del gráfico al pasar el mouse
    configuraAnimacionHover();
}

// Función para generar indicadores visuales para cada fuente
function generarIndicadoresFuentes(etiquetas, valores) {
    let indicadoresHTML = '';
    
    // Tomar solo las 3 principales fuentes para no saturar
    const principalesFuentes = etiquetas
        .map((etiqueta, index) => ({ etiqueta, valor: valores[index] }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 3);
    
    principalesFuentes.forEach(fuente => {
        indicadoresHTML += `
            <div class="indicador" style="text-align: center; min-width: 80px;">
                <div style="height: 8px; background-color: ${coloresFuentesEnergia[fuente.etiqueta]}; border-radius: 4px; margin-bottom: 5px;"></div>
                <span style="font-size: 12px;">${fuente.etiqueta}</span>
            </div>
        `;
    });
    
    return indicadoresHTML;
}

// Función para configurar animaciones al pasar el mouse sobre las secciones
function configuraAnimacionHover() {
    const canvasElement = document.getElementById('graficoCircular');
    
    canvasElement.addEventListener('mousemove', (e) => {
        const activePoints = graficoCircular.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        
        if (activePoints.length > 0) {
            const index = activePoints[0].index;
            destacarSeccion(index);
        } else {
            resetearDestacados();
        }
    });
    
    canvasElement.addEventListener('mouseleave', resetearDestacados);
}

// Función para destacar una sección del gráfico
function destacarSeccion(index) {
    // Resetear todos los segmentos
    resetearDestacados();
    
    // Destacar el segmento seleccionado
    const dataset = graficoCircular.data.datasets[0];
    if (!dataset._originalBorderWidth) {
        dataset._originalBorderWidth = [...dataset.borderWidth];
    }
    
    // Modificar el ancho del borde para el segmento activo
    if (Array.isArray(dataset.borderWidth)) {
        dataset.borderWidth[index] = 4;
    } else {
        dataset.borderWidth = Array(dataset.data.length).fill(2);
        dataset.borderWidth[index] = 4;
    }
    
    // Aplicar un ligero desplazamiento al segmento
    if (!dataset._savedOffsets) {
        dataset._savedOffsets = { x: 0, y: 0 };
    }
    
    dataset._savedOffsets = {
        x: Math.cos(index * Math.PI / 3) * 10,
        y: Math.sin(index * Math.PI / 3) * 10
    };
    
    // Mostrar etiqueta encima del segmento (opcional)
    const label = graficoCircular.data.labels[index];
    const valor = graficoCircular.data.datasets[0].data[index];
    
    // Crear o actualizar tooltip personalizado
    let tooltipPersonalizado = document.getElementById('tooltipPersonalizado');
    if (!tooltipPersonalizado) {
        tooltipPersonalizado = document.createElement('div');
        tooltipPersonalizado.id = 'tooltipPersonalizado';
        tooltipPersonalizado.style.position = 'absolute';
        tooltipPersonalizado.style.backgroundColor = 'rgba(0,0,0,0.7)';
        tooltipPersonalizado.style.color = 'white';
        tooltipPersonalizado.style.padding = '5px 10px';
        tooltipPersonalizado.style.borderRadius = '4px';
        tooltipPersonalizado.style.fontSize = '12px';
        tooltipPersonalizado.style.pointerEvents = 'none';
        tooltipPersonalizado.style.opacity = 0;
        tooltipPersonalizado.style.transition = 'opacity 0.3s ease';
        tooltipPersonalizado.style.zIndex = 1000;
        document.body.appendChild(tooltipPersonalizado);
    }
    
    graficoCircular.update('none');
}

// Función para resetear las secciones destacadas
function resetearDestacados() {
    const dataset = graficoCircular.data.datasets[0];
    
    if (dataset._originalBorderWidth) {
        dataset.borderWidth = dataset._originalBorderWidth;
    }
    
    if (dataset._savedOffsets) {
        dataset._savedOffsets = { x: 0, y: 0 };
    }
    
    // Ocultar tooltip personalizado
    const tooltipPersonalizado = document.getElementById('tooltipPersonalizado');
    if (tooltipPersonalizado) {
        tooltipPersonalizado.style.opacity = 0;
    }
    
    graficoCircular.update('none');
}

// Animación en cambio de país
function animarCambioPais() {
    const selectorPais = document.getElementById('selectorPais');
    if (selectorPais) {
        selectorPais.addEventListener('change', function() {
            // Animación de salida
            const canvasContainer = document.getElementById('graficoCircular').parentElement;
            canvasContainer.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            canvasContainer.style.transform = 'scale(0.95) rotate(-5deg)';
            canvasContainer.style.opacity = 0.3;
            
            // Info desaparece
            const infoElement = document.getElementById('infoEnergia');
            if (infoElement) {
                infoElement.style.opacity = 0;
                infoElement.style.transform = 'translateY(20px)';
            }
            
            // Después de un breve delay, actualizar el gráfico y animar entrada
            setTimeout(() => {
                actualizarGrafico(this.value);
                
                // Animar entrada
                canvasContainer.style.transform = 'scale(1) rotate(0)';
                canvasContainer.style.opacity = 1;
            }, 400);
        });
    }
}


// Manejar selector de país si existe
const selectorPais = document.getElementById('selectorPais');
if (selectorPais) {
    selectorPais.addEventListener('change', function() {
        actualizarGrafico(this.value);
    });
}














// Manejar redimensionamiento de ventana
window.addEventListener('resize', function() {
    if (graficoCircular) {
        graficoCircular.resize();
    }
});


/* Visualizaciones */

const datosEjemplo = {
    años: ['2000', '2002', '2004', '2006', '2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2023'],
    tasasCrecimiento: [1.2, 1.5, 1.8, 2.3, 3.1, 4.2, 5.5, 7.8, 10.2, 13.6, 17.2, 20.5, 22.1]
};

// Variable para almacenar la instancia del gráfico de renovables
let graficoRenovables = null;

// Función para crear el selector de años
function crearSelectorAnios() {
    // Verificar si el contenedor del gráfico existe
    const contenedorGrafico = document.getElementById('renovablesChart').parentElement;
    if (!contenedorGrafico) return;
    
    // Verificar si ya existe el selector
    if (document.getElementById('selectorAnios')) return;
    
    // Crear el contenedor para el selector
    const contenedorSelector = document.createElement('div');
    contenedorSelector.className = 'selector-container';
    contenedorSelector.style.marginBottom = '20px';
    
    // Crear etiqueta
    const etiqueta = document.createElement('label');
    etiqueta.htmlFor = 'selectorAnios';
    etiqueta.textContent = 'Filtrar por rango de años: ';
    etiqueta.style.marginRight = '10px';
    etiqueta.style.fontWeight = 'bold';
    
    // Crear selector de año inicial
    const selectorInicio = document.createElement('select');
    selectorInicio.id = 'selectorAnioInicio';
    selectorInicio.style.marginRight = '10px';
    selectorInicio.style.padding = '5px';
    selectorInicio.style.borderRadius = '4px';
    
    // Crear selector de año final
    const selectorFin = document.createElement('select');
    selectorFin.id = 'selectorAnioFin';
    selectorFin.style.padding = '5px';
    selectorFin.style.borderRadius = '4px';
    
    // Texto entre selectores
    const textoEntre = document.createElement('span');
    textoEntre.textContent = ' hasta ';
    textoEntre.style.margin = '0 5px';
    
    // Llenar los selectores con las opciones de años
    const años = datosEjemplo.años;
    
    años.forEach(año => {
        // Opción para año inicial
        const opcionInicio = document.createElement('option');
        opcionInicio.value = año;
        opcionInicio.textContent = año;
        selectorInicio.appendChild(opcionInicio);
        
        // Opción para año final
        const opcionFin = document.createElement('option');
        opcionFin.value = año;
        opcionFin.textContent = año;
        selectorFin.appendChild(opcionFin);
    });
    
    // Establecer valores por defecto
    selectorInicio.value = años[0]; // Primer año
    selectorFin.value = años[años.length - 1]; // Último año
    
    // Agregar evento de cambio a los selectores
    selectorInicio.addEventListener('change', function() {
        // Validar que año inicial no sea mayor que año final
        if (this.value > selectorFin.value) {
            selectorFin.value = this.value;
        }
        filtrarGrafico();
    });
    
    selectorFin.addEventListener('change', function() {
        // Validar que año final no sea menor que año inicial
        if (this.value < selectorInicio.value) {
            selectorInicio.value = this.value;
        }
        filtrarGrafico();
    });
    
    // Crear botón para restaurar todos los años
    const botonRestaurar = document.createElement('button');
    botonRestaurar.textContent = 'Mostrar todos los años';
    botonRestaurar.style.marginLeft = '15px';
    botonRestaurar.style.padding = '5px 10px';
    botonRestaurar.style.backgroundColor = '#4CAF50';
    botonRestaurar.style.color = 'white';
    botonRestaurar.style.border = 'none';
    botonRestaurar.style.borderRadius = '4px';
    botonRestaurar.style.cursor = 'pointer';
    
    botonRestaurar.addEventListener('click', function() {
        selectorInicio.value = años[0];
        selectorFin.value = años[años.length - 1];
        filtrarGrafico();
    });
    
    // Agregar elementos al contenedor
    contenedorSelector.appendChild(etiqueta);
    contenedorSelector.appendChild(selectorInicio);
    contenedorSelector.appendChild(textoEntre);
    contenedorSelector.appendChild(selectorFin);
    contenedorSelector.appendChild(botonRestaurar);
    
    // Agregar el contenedor antes del gráfico
    contenedorGrafico.insertBefore(contenedorSelector, document.getElementById('renovablesChart'));
}

// Función para filtrar el gráfico según el rango de años seleccionado
function filtrarGrafico() {
    const anioInicio = document.getElementById('selectorAnioInicio').value;
    const anioFin = document.getElementById('selectorAnioFin').value;
    
    // Obtener datos completos
    const datos = obtenerDatosDeBD();
    
    // Filtrar datos según el rango seleccionado
    const indiceInicio = datos.años.indexOf(anioInicio);
    const indiceFin = datos.años.indexOf(anioFin);
    
    const añosFiltrados = datos.años.slice(indiceInicio, indiceFin + 1);
    const tasasFiltradas = datos.tasasCrecimiento.slice(indiceInicio, indiceFin + 1);
    
    // Actualizar gráfico con los datos filtrados
    actualizarGraficoRenovables(añosFiltrados, tasasFiltradas);
}

// Función para obtener datos (simulando una conexión a BD)
function obtenerDatosDeBD() {
    // Aquí conectarías con tu BD real y obtendrías los datos
    // Por ahora usamos los datos de ejemplo
    return datosEjemplo;
}

// Función para crear o actualizar el gráfico de renovables con datos filtrados
function actualizarGraficoRenovables(años, tasasCrecimiento) {
    const ctx = document.getElementById('renovablesChart').getContext('2d');
    
    // Destruir gráfico existente si hay uno
    if (graficoRenovables) {
        graficoRenovables.destroy();
    }
    
    // Crear nuevo gráfico
    graficoRenovables = new Chart(ctx, {
        type: 'line',
        data: {
            labels: años,
            datasets: [{
                label: 'Tasa de crecimiento (%)',
                data: tasasCrecimiento,
                borderColor: 'rgb(75, 192, 75)',
                backgroundColor: 'rgba(75, 192, 75, 0.2)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tasa de crecimiento (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Año'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Crecimiento Anual de Energías Renovables en Colombia'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Crecimiento: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Actualizar función crearGrafico para usar la nueva función actualizar
function crearGrafico() {
    const datos = obtenerDatosDeBD();
    actualizarGraficoRenovables(datos.años, datos.tasasCrecimiento);
}

      