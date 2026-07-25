// obj_2.js
const contrasteTiers = () => {
    // Variables privadas
    let svg, chartGroup, width, height, yAxisGroup, xAxisGroup;
    let tituloGrafica;
    let dataset = [];
    
    // Dejamos un margen izquierdo amplio para las cifras millonarias
    const margin = { top: 80, right: 30, bottom: 50, left: 100 };

    // --- 1. PROCESAMIENTO DE DATOS ---
    async function procesarCSV() {
        try {
            // Estructura temporal para agrupar los datos
            const metricas = {
                "Indie": { tier: "Indie", juegos: 0, dueños: 0, ganancias: 0 },
                "AA": { tier: "AA", juegos: 0, dueños: 0, ganancias: 0 },
                "AAA": { tier: "AAA", juegos: 0, dueños: 0, ganancias: 0 }
            };

            await d3.csv("steam_data_set/game_analytics.csv", (d) => {
                const tier = d.publisher_tier;
                // Si el tier existe en nuestro objeto, acumulamos los valores
                if (metricas[tier]) {
                    metricas[tier].juegos += 1;
                    metricas[tier].dueños += +d.owners_midpoint;
                    metricas[tier].ganancias += (+d.price_initial * +d.owners_midpoint);
                }
            });

            // Convertimos el objeto en un arreglo para que D3 pueda iterarlo
            dataset = Object.values(metricas);
            
            // Ordenamos intencionalmente para la narrativa: Indie -> AA -> AAA
            dataset.sort((a, b) => {
                const orden = { "Indie": 1, "AA": 2, "AAA": 3 };
                return orden[a.tier] - orden[b.tier];
            });

            return true;
        } catch (error) {
            console.error("Error al procesar la muestra:", error);
            return false;
        }
    }

    // --- 2. INICIALIZACIÓN DE D3 ---
    function inicializarD3() {
        // Asumiendo que crearás un <div id="contenedor-d3-2"> para esta nueva sección
        const container = document.getElementById("contenedor-d3-2");
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        width = containerWidth - margin.left - margin.right;
        height = containerHeight - margin.top - margin.bottom;

        d3.select("#contenedor-d3-2").selectAll("*").remove();

        svg = d3.select("#contenedor-d3-2")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight);

        chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Título dinámico
        tituloGrafica = svg.append("text")
            .attr("x", containerWidth / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold");

        // Preparar grupos para los ejes vacíos
        xAxisGroup = chartGroup.append("g").attr("transform", `translate(0,${height})`);
        yAxisGroup = chartGroup.append("g");
    }

    // --- 3. ACTUALIZACIÓN DINÁMICA (SCROLLYTELLING) ---
    function updateChart(stepIndex) {
        if (!chartGroup || dataset.length === 0) return;
        
        const parsedIndex = parseInt(stepIndex);

        // Definir qué métrica leer según la etapa del scroll
        let metricaActiva = "juegos";
        let textoTitulo = "Cantidad de Juegos Publicados";
        let formatoEjeY = d3.format("d"); // Números enteros simples

        if (parsedIndex === 1) {
            metricaActiva = "dueños";
            textoTitulo = "Copias Totales en Bibliotecas";
            formatoEjeY = d3.format(".2s"); // Formato de millones (ej. 120M)
        } else if (parsedIndex >= 2) {
            metricaActiva = "ganancias";
            textoTitulo = "Ganancias Brutas Estimadas (USD)";
            formatoEjeY = d3.format("$.2s"); // Formato monetario en millones (ej. $2.2G)
        }

        // Actualizar el título
        tituloGrafica.text(textoTitulo);

        // Recalcular las escalas con los nuevos máximos de la métrica activa
        const x = d3.scaleBand()
            .domain(dataset.map(d => d.tier))
            .range([0, width])
            .padding(0.3);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[metricaActiva]) * 1.1])
            .range([height, 0]);

        // Transicionar el Eje Y para que los números cambien de escala suavemente
        yAxisGroup.transition().duration(800)
            .call(d3.axisLeft(y).ticks(6).tickFormat(formatoEjeY))
            .selectAll("text").attr("font-size", "14px");

        // Dibujar el Eje X (Solo se anima la primera vez)
        xAxisGroup.transition().duration(800)
            .call(d3.axisBottom(x))
            .selectAll("text").attr("font-size", "16px").attr("font-weight", "bold");

        // Binding de Datos a las barras
        const bars = chartGroup.selectAll(".bar").data(dataset);

        // Enter + Update
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.tier))
            .attr("width", x.bandwidth())
            .attr("y", height) // Inician escondidas en el suelo
            .attr("height", 0)
            .merge(bars)
            .transition()
            .duration(800)
            .attr("y", d => y(d[metricaActiva]))
            .attr("height", d => height - y(d[metricaActiva]))
            .attr("fill", d => {
                // Colores semánticos
                if (d.tier === "Indie") return "#c7d5e0"; // Gris claro
                if (d.tier === "AA") return "#66c0f4";    // Azul claro
                return "#2a475e";                         // Azul oscuro AAA
            });
    }

    async function setup() {
        const cargaExitosa = await procesarCSV();
        if (cargaExitosa) {
            inicializarD3();
            updateChart(0);
        }
    }

    // --- REVELACIÓN ---
    return {
        setup: setup,
        updateChart: updateChart
    };
};

export default contrasteTiers;