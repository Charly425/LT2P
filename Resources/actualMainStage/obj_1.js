const contrasteMonopolio = () => {
    async function procesarCSV() {
        try {
            // Se prepara un primer conjunto de objetos con datos de importancia 
            const cleanData = await d3.csv("../steamDataSet/game_analytics.csv", (d) => {
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

            // Se descartan los juegos fuera del rango comparativo y aquellos que no generaron ganancias directas
            const ganJuego = gananciasPorJuego(cleanData).filter((d) => d.ganEst != 0 && d.anio > 2017 && d.anio < 2026);

            // Se calcula el estimado de ganacias por año referentes a 'Terceros'.
            const steam2018 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan18, 0))*100)/100;
            const steam2019 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan19, 0))*100)/100;
            const steam2020 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan20, 0))*100)/100;
            const steam2021 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan21, 0))*100)/100;
            const steam2022 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan22, 0))*100)/100;
            const steam2023 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan23, 0))*100)/100;
            const steam2024 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan24, 0))*100)/100;
            const steam2025 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan25, 0))*100)/100;

        } catch (error) {
            console.error("Hubo un error al recuperar los datos:", error);
            return null;
        }
    };

    const gananciasPorJuego = function (objetosFiltrados) {
        try {
            const ganNeto = objetosFiltrados.map((d) => {
                // Se aplica un cálculo '(HCCU * PrecioBase)' en conjunto con un Coeficiente de Ajuste (o.45) para estimar las ganacias. 
                let netoVentas = Math.ceil((d.hccu*(d.genero === 'Strategy' || 'Simulation' ? 60 : 35)*d.precioBase*0.45)*100) / 100;
                let fecha = d.lanzamiento.substring(0,4);

                // Segun el año, se evalua el decaímiento de las ganacias para el 1er, 2do ---> hasta el 5to año de cada juego.  
                switch (true) {
                    case (2018-fecha == 0):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: Math.ceil((netoVentas*0.55)*100)/100,
                            gan19: Math.ceil((netoVentas*0.18)*100)/100,
                            gan20: Math.ceil((netoVentas*0.12)*100)/100,
                            gan21: Math.ceil((netoVentas*0.08)*100)/100,
                            gan22: Math.ceil((netoVentas*0.07)*100)/100,
                            gan23: Math.ceil((netoVentas*0.07)*100)/100,
                            gan24: Math.ceil((netoVentas*0.07)*100)/100,
                            gan25: Math.ceil((netoVentas*0.07)*100)/100
                        }
                        break;

                    case (2018-fecha == -1):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: Math.ceil((netoVentas*0.55)*100)/100,
                            gan20: Math.ceil((netoVentas*0.18)*100)/100,
                            gan21: Math.ceil((netoVentas*0.12)*100)/100,
                            gan22: Math.ceil((netoVentas*0.08)*100)/100,
                            gan23: Math.ceil((netoVentas*0.07)*100)/100,
                            gan24: Math.ceil((netoVentas*0.07)*100)/100,
                            gan25: Math.ceil((netoVentas*0.07)*100)/100
                        }
                        break;

                    case (2018-fecha == -2):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: 0,
                            gan20: Math.ceil((netoVentas*0.55)*100)/100,
                            gan21: Math.ceil((netoVentas*0.18)*100)/100,
                            gan22: Math.ceil((netoVentas*0.12)*100)/100,
                            gan23: Math.ceil((netoVentas*0.08)*100)/100,
                            gan24: Math.ceil((netoVentas*0.07)*100)/100,
                            gan25: Math.ceil((netoVentas*0.07)*100)/100
                        }
                        break;
                    
                    case (2018-fecha == -3):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: 0,
                            gan20: 0,
                            gan21: Math.ceil((netoVentas*0.55)*100)/100,
                            gan22: Math.ceil((netoVentas*0.18)*100)/100,
                            gan23: Math.ceil((netoVentas*0.12)*100)/100,
                            gan24: Math.ceil((netoVentas*0.08)*100)/100,
                            gan25: Math.ceil((netoVentas*0.07)*100)/100
                        }
                        break;

                    case (2018-fecha == -4):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: 0,
                            gan20: 0,
                            gan21: 0,
                            gan22: Math.ceil((netoVentas*0.55)*100)/100,
                            gan23: Math.ceil((netoVentas*0.18)*100)/100,
                            gan24: Math.ceil((netoVentas*0.12)*100)/100,
                            gan25: Math.ceil((netoVentas*0.08)*100)/100
                        }
                        break;

                    case (2018-fecha == -5):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: 0,
                            gan20: 0,
                            gan21: 0,
                            gan22: 0,
                            gan23: Math.ceil((netoVentas*0.55)*100)/100,
                            gan24: Math.ceil((netoVentas*0.18)*100)/100,
                            gan25: Math.ceil((netoVentas*0.12)*100)/100
                        }
                        break;

                    case (2018-fecha == -6):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: 0,
                            gan20: 0,
                            gan21: 0,
                            gan22: 0,
                            gan23: 0,
                            gan24: Math.ceil((netoVentas*0.55)*100)/100,
                            gan25: Math.ceil((netoVentas*0.18)*100)/100
                        }
                        break;

                    case (2018-fecha == -7):
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: 0,
                            gan20: 0,
                            gan21: 0,
                            gan22: 0,
                            gan23: 0,
                            gan24: 0,
                            gan25: Math.ceil((netoVentas*0.55)*100)/100
                        }
                        break;

                    default:
                        return {
                            id: +d.id,
                            nombre: d.nombre,
                            anio: fecha,
                            ganEst: netoVentas,
                            gan18: 0,
                            gan19: 0,
                            gan20: 0,
                            gan21: 0,
                            gan22: 0,
                            gan23: 0,
                            gan24: 0,
                            gan25:0
                        }
                        break;
                }
            });
            return ganNeto;
        } catch (error) {
            console.error("Ocurrio algo inesperado al calcular las ganacias", error);
            return null;
        }
    };

    return {
        setup: procesarCSV 
    };
}
export default contrasteMonopolio;