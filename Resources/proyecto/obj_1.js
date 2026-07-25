const contrasteMonopolio = () => {
    let svg, width, height;
    let datasetFinal = []; 
    const margin = { top: 80, right: 120, bottom: 50, left: 120 };

    // --- Base de datos manual de Epic Games 
    const epicData = [
        { anio: "2018", usuariosActivos: 0, gananciasTerceros: 0 }, 
        { anio: "2019", usuariosActivos: 7000000, gananciasTerceros: 251000000 }, 
        { anio: "2020", usuariosActivos: 13000000, gananciasTerceros: 265000000 }, 
        { anio: "2021", usuariosActivos: 13200000, gananciasTerceros: 300000000 }, 
        { anio: "2022", usuariosActivos: 25000000, gananciasTerceros: 355000000 }, 
        { anio: "2023", usuariosActivos: 36000000, gananciasTerceros: 310000000 }, 
        { anio: "2024", usuariosActivos: 38000000, gananciasTerceros: 320000000 }, 
        { anio: "2025", usuariosActivos: 40000000, gananciasTerceros: 330000000 }  
    ];

    // --- Función para el cálculo de usuarios anuales (Steam) ---
    const calcularUsuariosPorAno = function (datos) {
        const usuarios = { "2018": 0, "2019": 0, "2020": 0, "2021": 0, "2022": 0, "2023": 0, "2024": 0, "2025": 0 };
        const factorEscala = 25; 

        datos.forEach(d => {
            const anioLanzamiento = parseInt(d.lanzamiento.substring(0, 4));
            const ccuExtrapolado = (d.hccu || 0) * factorEscala;

            for (let anioActual = 2018; anioActual <= 2025; anioActual++) {
                const diff = anioActual - anioLanzamiento;
                
                if (diff === 0) usuarios[anioActual.toString()] += ccuExtrapolado * 0.55;
                else if (diff === 1) usuarios[anioActual.toString()] += ccuExtrapolado * 0.18;
                else if (diff === 2) usuarios[anioActual.toString()] += ccuExtrapolado * 0.12;
                else if (diff === 3) usuarios[anioActual.toString()] += ccuExtrapolado * 0.08;
                else if (diff >= 4 && diff <= 7) usuarios[anioActual.toString()] += ccuExtrapolado * 0.07;
            }
        });
        return usuarios;
    };

    // --- Fusión de datos estructurados para las coordenadas paralelas ---
    function combinarDatos(datosSteamGanancias, datosSteamUsuarios, datosEpic) {
        const combinados = [];

        datosSteamGanancias.forEach(d => {
            combinados.push({
                plataforma: "Steam",
                anio: d.anio,
                gananciasTerceros: d.ganancia,
                usuariosActivos: datosSteamUsuarios[d.anio] || 0 
            });
        });

        datosEpic.forEach(d => {
            combinados.push({
                plataforma: "Epic",
                anio: d.anio,
                gananciasTerceros: d.gananciasTerceros,
                usuariosActivos: d.usuariosActivos
            });
        });

        return combinados;
    }

    // --- Procesamiento del Archivo  ---
    async function procesarCSV() {
        try {
            const cleanData = await d3.csv("steam_data_set/game_analytics.csv", (d) => {
                return {
                    id: +d.appid,
                    nombre: d.name,
                    lanzamiento: d.release_date,
                    genero: d.genre_primary,
                    dev: d.developer,
                    tier: d.publisher_tier,
                    precioBase: +d.price_initial,
                    hccu: +d.peak_ccu
                }
            });

            const ganJuego = gananciasPorJuego(cleanData).filter((d) => d.ganEst != 0 && d.anio > 2017 && d.anio < 2026);
            
            const usuariosSteam = calcularUsuariosPorAno(cleanData);
            
            const steamGanancias = [
                { anio: "2018", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan18, 0))*100)/100 },
                { anio: "2019", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan19, 0))*100)/100 },
                { anio: "2020", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan20, 0))*100)/100 },
                { anio: "2021", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan21, 0))*100)/100 },
                { anio: "2022", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan22, 0))*100)/100 },
                { anio: "2023", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan23, 0))*100)/100 },
                { anio: "2024", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan24, 0))*100)/100 },
                { anio: "2025", ganancia: Math.ceil((ganJuego.reduce((suma, j) => suma + j.gan25, 0))*100)/100 }
            ];

            datasetFinal = combinarDatos(steamGanancias, usuariosSteam, epicData);
            return true;

        } catch (error) {
            console.error("Hubo un error al recuperar los datos:", error);
            return false;
        }
    };

    // --- Calculo de ganancias por juego (Optimizado) ---
    const gananciasPorJuego = function (objetosFiltrados) {
        try {
            return objetosFiltrados.map((d) => {
                let netoVentas = Math.ceil((d.hccu*(d.genero === 'Strategy' || d.genero === 'Simulation' ? 60 : 35)*d.precioBase*0.45)*100) / 100;
                let fecha = d.lanzamiento.substring(0,4);
                const anioLanzamiento = parseInt(fecha);

                // Patrón de decaimiento
                const decadencia = [0.55, 0.18, 0.12, 0.08, 0.07, 0.07, 0.07, 0.07];

                // Inicializamos todo en 0 por defecto
                const ganancias = {
                    gan18: 0, gan19: 0, gan20: 0, gan21: 0, 
                    gan22: 0, gan23: 0, gan24: 0, gan25: 0
                };

                // Asignación dinámica según el año de lanzamiento
                if (anioLanzamiento >= 2018 && anioLanzamiento <= 2025) {
                    for (let anioActual = anioLanzamiento; anioActual <= 2025; anioActual++) {
                        const edadJuego = anioActual - anioLanzamiento; 
                        
                        if (edadJuego < decadencia.length) {
                            const porcentaje = decadencia[edadJuego];
                            // Construye la propiedad (ej: 2018 -> "gan18")
                            const propGanancia = `gan${anioActual.toString().slice(-2)}`; 
                            
                            ganancias[propGanancia] = Math.ceil((netoVentas * porcentaje) * 100) / 100;
                        }
                    }
                }

                return {
                    id: +d.id,
                    nombre: d.nombre,
                    anio: fecha,
                    ganEst: netoVentas,
                    ...ganancias // Expande las 8 propiedades de ganancias automáticamente
                };
            });
        } catch (error) {
            console.error("Ocurrio algo inesperado", error);
            return [];
        }
    };

    // --- VISUALIZACIÓN D3 (Coordenadas Paralelas) --- 
    function inicializarD3() {
        const container = document.getElementById("contenedor-d3");
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        width = containerWidth - margin.left - margin.right;
        height = containerHeight - margin.top - margin.bottom;

        // Creamos el Tooltip en el 'body' si aún no existe 
        let tooltip = d3.select("body").select(".tooltip-d3");
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div").attr("class", "tooltip-d3");
        }

        d3.select("#contenedor-d3").selectAll("*").remove();

        svg = d3.select("#contenedor-d3")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Leyenda de plataformas (Centrado)
        const leyenda = svg.append("g")
            .attr("transform", `translate(${width / 2}, -55)`); 

        // Steam (Desplazado a la izquierda del centro)
        leyenda.append("rect")
            .attr("x", -100).attr("y", -12).attr("width", 15).attr("height", 15).attr("rx", 3)
            .style("fill", "#2643a3");
        leyenda.append("text")
            .attr("x", -75).attr("y", 0)
            .text("Steam")
            .style("font-size", "14px").style("font-weight", "bold").style("fill", "#333");

        // Epic Games (Desplazado a la derecha del centro)
        leyenda.append("rect")
            .attr("x", 10).attr("y", -12).attr("width", 15).attr("height", 15).attr("rx", 3)
            .style("fill", "#3e4e58");
        leyenda.append("text")
            .attr("x", 35).attr("y", 0)
            .text("Epic Games")
            .style("font-size", "14px").style("font-weight", "bold").style("fill", "#333");


        const dimensiones = ["usuariosActivos", "gananciasTerceros"];
        const x = d3.scalePoint()
            .range([0, width])
            .padding(0) 
            .domain(dimensiones);

        const y = {};
        dimensiones.forEach(dim => {
            y[dim] = d3.scaleLinear()
                .domain([0, d3.max(datasetFinal, d => d[dim]) * 1.1])
                .range([height, 0]);
        });

        function path(d) {
            return d3.line()(dimensiones.map(p => [x(p), y[p](d[p])]));
        }

        // Trazado de lines con Path (Solo lineas activas)
        svg.selectAll("myPath")
            .data(datasetFinal)
            .enter().append("path")
            .attr("class", "ruta-plataforma")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", d => d.plataforma === "Steam" ? "#2643a3" : "#3e4e58")
            .style("stroke-width", 2.5)
            .style("opacity", 0) 
            .on("mouseover", function(event, d) {
                // Se opacan solo líneas ACTIVAS
                d3.selectAll(".ruta-plataforma")
                    .filter(function() { return d3.select(this).style("pointer-events") === "auto"; })
                    .style("opacity", 0.15);

                // Resaltado de línea ACTUAL
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke-width", 4.5);

                // Mostrar tooltip
                tooltip.style("opacity", 1)
                        .html(`<strong>${d.plataforma}</strong><br>Año: ${d.anio}`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 25) + "px");
            })
            .on("mouseleave", function(event, d) {
                tooltip.style("opacity", 0);
                
                // Forzamos la actualización para restaurar el estado del scrollytelling
                const activeStep = document.querySelector('.step.is-active');
                const currentIndex = activeStep ? activeStep.getAttribute('data-index') : 0;
                updateChart(currentIndex); 
            });

        // Ejes Y (Postes intercalados)
        dimensiones.forEach((dim, i) => {
            const ejeY = svg.append("g")
                .attr("transform", `translate(${x(dim)}, 0)`)
                // Si es el índice 0, usa axisLeft. Si es el 1, usa axisRight.
                .call(i === 0 
                    ? d3.axisLeft(y[dim]).ticks(6).tickFormat(d3.format(".2s"))
                    : d3.axisRight(y[dim]).ticks(6).tickFormat(d3.format(".2s"))
                );
            
            // Títulos de los ejes
            ejeY.append("text")
                .style("text-anchor", "middle")
                .attr("y", -20)
                .text(dim === "usuariosActivos" ? "Usuarios Activos" : "Ganancias (USD)")
                .style("fill", "black")
                .style("font-weight", "bold")
                .style("font-size", "14px");
        });
    }

    // --- Posteo de funciones ---
    async function setup() {
        const cargaExitosa = await procesarCSV();
        if (cargaExitosa && datasetFinal.length > 0) {
            inicializarD3();
            updateChart(0); 
        }
    }

    // --- Seguimiento de la narrativa (Actualiza el gráfico) ---
    function updateChart(stepIndex) {
        if (!svg) return;
        const parsedIndex = parseInt(stepIndex);
        
        // Control global: Defines hasta qué bloque la gráfica entera es visible
        const esVisible = parsedIndex <= 2; 

        svg.selectAll(".ruta-plataforma")
            .transition()
            .duration(500) // Transición suave
            .style("opacity", (d) => {
                if (!esVisible) return 0;

                const anioNumero = parseInt(d.anio);

                if (parsedIndex === 0) {
                    const rangoEpic = d.plataforma === "Epic" && anioNumero >= 2018 && anioNumero <= 2022;
                    const rangoSteam = d.plataforma === "Steam" && anioNumero >= 2020 && anioNumero <= 2023;
                    return (rangoEpic || rangoSteam) ? 0.8 : 0; 
                }
                else if (parsedIndex === 1) {
                    return (anioNumero > 2022) ? 0.8 : 0;
                }
                else if (parsedIndex === 2) {
                    return (anioNumero === 2025) ? 0.8 : 0;
                }
                
                return 0;
            })
            .style("pointer-events", (d) => {
                if (!esVisible) return "none";

                const anioNumero = parseInt(d.anio);

                if (parsedIndex === 0) {
                    const rangoEpic = d.plataforma === "Epic" && anioNumero >= 2018 && anioNumero <= 2022;
                    const rangoSteam = d.plataforma === "Steam" && anioNumero >= 2020 && anioNumero <= 2023;
                    return (rangoEpic || rangoSteam) ? "auto" : "none";
                }
                else if (parsedIndex === 1) {
                    return (anioNumero > 2022) ? "auto" : "none";
                }
                else if (parsedIndex === 2) {
                    return (anioNumero === 2025) ? "auto" : "none";
                }

                return "none";
            })
            .style("stroke-width", 2.5);
    }

    return { setup: setup, updateChart: updateChart };
};

export default contrasteMonopolio;