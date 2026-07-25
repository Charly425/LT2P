// obj_3.js
const pozoSinFondo = () => {
    let svg, width, height, chartGroup;
    let xLeft, xRight, y;
    let maxOwners, maxCCU;
    let dataset = [];
    
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };

    // --- 1. PROCESAMIENTO DE DATOS ---
    async function procesarCSV() {
        try {
            const generos = {};

            await d3.csv("steam_data_set/game_analytics.csv", (d) => {
                const genero = d.genre_primary;
                if (!genero) return;

                if (!generos[genero]) {
                    generos[genero] = { genero: genero, owners: 0, ccu: 0 };
                }
                generos[genero].owners += +d.owners_midpoint;
                generos[genero].ccu += +d.peak_ccu;
            });

            // Convertir a arreglo, ordenar por dueños y tomar el Top 5
            dataset = Object.values(generos)
                .sort((a, b) => b.owners - a.owners)
                .slice(0, 5);

            maxOwners = d3.max(dataset, d => d.owners);
            maxCCU = d3.max(dataset, d => d.ccu);

            return true;
        } catch (error) {
            console.error("Error al procesar CSV en obj_3:", error);
            return false;
        }
    }

    // --- 2. INICIALIZACIÓN D3 ---
    function inicializarD3() {
        const container = document.getElementById("contenedor-d3-3");
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        width = containerWidth - margin.left - margin.right;
        height = containerHeight - margin.top - margin.bottom;

        // 1. Declarar y crear el tooltip genérico en el body
        let tooltip = d3.select("body").select(".tooltip-d3");
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div").attr("class", "tooltip-d3");
        }

        d3.select("#contenedor-d3-3").selectAll("*").remove();

        svg = d3.select("#contenedor-d3-3")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight);

        chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const centroX = width / 2;

        // Escala Y (Categorías en el centro)
        y = d3.scaleBand()
            .domain(dataset.map(d => d.genero))
            .range([0, height])
            .padding(0.4);

        // Escala Derecha (Dueños)
        xRight = d3.scaleLinear()
            .domain([0, maxOwners * 1.1])
            .range([centroX + 70, width]); // +70 para dejar espacio al texto central

        // Escala Izquierda (CCU Inicial)
        xLeft = d3.scaleLinear()
            .domain([0, maxCCU * 1.1])
            .range([centroX - 70, 0]);

        // Dibujar Etiquetas Centrales
        chartGroup.selectAll(".label-genero")
            .data(dataset)
            .enter().append("text")
            .attr("class", "label-genero")
            .attr("x", centroX)
            .attr("y", d => y(d.genero) + y.bandwidth() / 2 + 5)
            .attr("text-anchor", "middle")
            .text(d => d.genero)
            .style("font-weight", "bold")
            .style("font-size", "14px")
            .style("fill", "#333");

        // --- CREACIÓN E INTERACTIVIDAD DE BARRAS DERECHAS (DUEÑOS) ---
        chartGroup.selectAll(".bar-right")
            .data(dataset)
            .enter().append("rect")
            .attr("class", "bar-right")
            .attr("x", centroX + 70)
            .attr("y", d => y(d.genero))
            .attr("height", y.bandwidth())
            .attr("width", 0) // Inician en 0
            .attr("fill", "#2643a3") // Azul Steam
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 0.7);
                tooltip.style("opacity", 1)
                        .html(`<strong>${d.genero}</strong><br>Copias: ${Math.round(d.owners).toLocaleString()}`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 25) + "px");
            })
            .on("mouseleave", function(event, d) {
                d3.select(this).style("opacity", 1);
                tooltip.style("opacity", 0);
            });

        // --- CREACIÓN E INTERACTIVIDAD DE BARRAS IZQUIERDAS (CCU) ---
        chartGroup.selectAll(".bar-left")
            .data(dataset)
            .enter().append("rect")
            .attr("class", "bar-left")
            .attr("x", centroX - 70)
            .attr("y", d => y(d.genero))
            .attr("height", y.bandwidth())
            .attr("width", 0) // Inician en 0
            .attr("fill", "#c7d5e0")
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 0.7);
                tooltip.style("opacity", 1)
                        .html(`<strong>${d.genero}</strong><br>Jugadores Activos: ${Math.round(d.ccu).toLocaleString()}`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 25) + "px");
            })
            .on("mouseleave", function(event, d) {
                d3.select(this).style("opacity", 1);
                tooltip.style("opacity", 0);
            });

        // Títulos estáticos superiores
        chartGroup.append("text")
            .attr("class","titulo-izquierdo")
            .attr("x", centroX - 70)
            .attr("y", -20)
            .attr("text-anchor", "end")
            .text("Jugadores Simultáneos (Miles)")
            .style("font-weight", "bold");

        chartGroup.append("text")
            .attr("x", centroX + 70)
            .attr("y", -20)
            .attr("text-anchor", "start")
            .text("Copias en Bibliotecas (Millones)")
            .style("font-weight", "bold");

        // Ejes X visuales
        chartGroup.append("g")
            .attr("class", "eje-izquierdo")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xLeft).ticks(4).tickFormat(d3.format(".2s")));

        chartGroup.append("g")
            .attr("class", "eje-derecho")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xRight).ticks(4).tickFormat(d3.format(".2s")));
    }

    // --- 3. ACTUALIZACIÓN DINÁMICA (SCROLLYTELLING) ---
    function updateChart(stepIndex) {
        if (!chartGroup || dataset.length === 0) return;
        const parsedIndex = parseInt(stepIndex);
        const centroX = width / 2;

        if (parsedIndex === 0) {
            // BLOQUE 0: Escalas Independientes (Muestran los datos "inflados")
            xLeft.domain([0, maxCCU * 1.1]);

            // Actualizar título izquierdo
            chartGroup.select(".titulo-izquierdo")
                .text("Jugadores Simultáneos (Miles)");

            // Actualizar Eje Izquierdo
            chartGroup.select(".eje-izquierdo")
                .transition().duration(800)
                .call(d3.axisBottom(xLeft).ticks(4).tickFormat(d3.format(".2s")));

            // Animar Barras
            chartGroup.selectAll(".bar-right")
                .transition().duration(800)
                .attr("width", d => xRight(d.owners) - (centroX + 70));

            chartGroup.selectAll(".bar-left")
                .transition().duration(800)
                .attr("x", d => xLeft(d.ccu))
                .attr("width", d => (centroX - 70) - xLeft(d.ccu))
                .attr("fill", "#c7d5e0");

        } else if (parsedIndex === 1) {
            // BLOQUE 1: El Golpe de Realidad (Misma escala para ambos lados)
            // Forzamos a la izquierda a usar la escala masiva de la derecha
            xLeft.domain([0, maxOwners * 1.1]);

            // Actualizar título izquierdo
            chartGroup.select(".titulo-izquierdo")
                .text("Jugadores Simultáneos (Millones)");

            // Actualizar Eje Izquierdo
            chartGroup.select(".eje-izquierdo")
                .transition().duration(800)
                .call(d3.axisBottom(xLeft).ticks(4).tickFormat(d3.format(".2s")));

            // Colapsar Barras
            chartGroup.selectAll(".bar-left")
                .transition().duration(800)
                .attr("x", d => xLeft(d.ccu)) // Ahora esto dará casi el punto central
                .attr("width", d => Math.max(2, (centroX - 70) - xLeft(d.ccu))) // Math.max(2) para usabilidad
                .attr("fill", "#d9534f"); // Cambia a rojo para impacto narrativo
        }
    }

    async function setup() {
        const cargaExitosa = await procesarCSV();
        if (cargaExitosa) {
            inicializarD3();
            updateChart(0);
        }
    }

    return { setup, updateChart };
};

export default pozoSinFondo;