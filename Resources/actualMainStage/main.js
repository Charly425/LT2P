

async function procesarCSV() {
    try {
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
        console.log("Se han recuperado los datos necesarios de cada Objeto");
        console.log(cleanData);

        const ganJuego = gananciasPorJuego(cleanData).filter((d) => d.ganEst != 0);
        console.log("Se han descartado los juegos que no generaron ganancias")
        console.log(ganJuego);

        const steam2018 = Math.ceil((ganJuego.reduce((suma, juego) => suma + juego.gan18, 0))*100)/100;
        // Para calcular la suma de valores por año 
        // .reduce((suma, juego) => suma + juego.ganEst, 0);

        console.log("Se ha calculado las ganancias netas por Terceros en 2018...");
        console.log(steam2018);
    } catch (error) {
        console.error("Hubo un error al recuperar los datos:", error);
        return null;
    }
}

const gananciasPorJuego = function (objetosFiltrados) {
    try {
        const ganNeto = objetosFiltrados.map((d) => {
            let netoVentas = Math.ceil((d.hccu*(d.genero === 'Strategy' || 'Simulation' ? 60 : 35)*d.precioBase*0.45)*100) / 100;
            let fecha = d.lanzamiento.substring(0,4);

            switch (true) {
                case (2018-fecha >= 4):
                    return {
                        id: +d.id,
                        nombre: d.nombre,
                        anio: fecha,
                        ganEst: netoVentas,
                        gan18: Math.ceil((netoVentas*0.07)*100)/100,
                        gan19: Math.ceil((netoVentas*0.07)*100)/100,
                        gan20: Math.ceil((netoVentas*0.07)*100)/100,
                        gan21: Math.ceil((netoVentas*0.07)*100)/100,
                        gan22: Math.ceil((netoVentas*0.07)*100)/100,
                        gan23: Math.ceil((netoVentas*0.07)*100)/100,
                        gan24: Math.ceil((netoVentas*0.07)*100)/100,
                        gan25: Math.ceil((netoVentas*0.07)*100)/100
                    }
                    break;

                case (2018-fecha == 3):
                    return {
                        id: +d.id,
                        nombre: d.nombre,
                        anio: fecha,
                        ganEst: netoVentas,
                        gan18: Math.ceil((netoVentas*0.08)*100)/100,
                        gan19: Math.ceil((netoVentas*0.07)*100)/100,
                        gan20: Math.ceil((netoVentas*0.07)*100)/100,
                        gan21: Math.ceil((netoVentas*0.07)*100)/100,
                        gan22: Math.ceil((netoVentas*0.07)*100)/100,
                        gan23: Math.ceil((netoVentas*0.07)*100)/100,
                        gan24: Math.ceil((netoVentas*0.07)*100)/100,
                        gan25: Math.ceil((netoVentas*0.07)*100)/100
                    }
                    break;
        
                case (2018-fecha == 2): 
                    return {
                        id: +d.id,
                        nombre: d.nombre,
                        anio: fecha,
                        ganEst: netoVentas,
                        gan18: Math.ceil((netoVentas*0.12)*100)/100,
                        gan19: Math.ceil((netoVentas*0.08)*100)/100,
                        gan20: Math.ceil((netoVentas*0.07)*100)/100,
                        gan21: Math.ceil((netoVentas*0.07)*100)/100,
                        gan22: Math.ceil((netoVentas*0.07)*100)/100,
                        gan23: Math.ceil((netoVentas*0.07)*100)/100,
                        gan24: Math.ceil((netoVentas*0.07)*100)/100,
                        gan25: Math.ceil((netoVentas*0.07)*100)/100
                    }
                    break;
                
                case (2018-fecha == 1):
                    return {
                        id: +d.id,
                        nombre: d.nombre,
                        anio: fecha,
                        ganEst: netoVentas,
                        gan18: Math.ceil((netoVentas*0.18)*100)/100,
                        gan19: Math.ceil((netoVentas*0.12)*100)/100,
                        gan20: Math.ceil((netoVentas*0.08)*100)/100,
                        gan21: Math.ceil((netoVentas*0.07)*100)/100,
                        gan22: Math.ceil((netoVentas*0.07)*100)/100,
                        gan23: Math.ceil((netoVentas*0.07)*100)/100,
                        gan24: Math.ceil((netoVentas*0.07)*100)/100,
                        gan25: Math.ceil((netoVentas*0.07)*100)/100
                    }
                    break;
                
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
                        gan18: Math.ceil((netoVentas*0.07)*100)/100,
                        gan19: Math.ceil((netoVentas*0.07)*100)/100,
                        gan20: Math.ceil((netoVentas*0.07)*100)/100,
                        gan21: Math.ceil((netoVentas*0.07)*100)/100,
                        gan22: Math.ceil((netoVentas*0.07)*100)/100,
                        gan23: Math.ceil((netoVentas*0.07)*100)/100,
                        gan24: Math.ceil((netoVentas*0.07)*100)/100,
                        gan25: Math.ceil((netoVentas*0.07)*100)/100
                    }
                    break;
            }
        });
        console.log("Se han calculado las ganancias históricas estimadas por juego y por año");
        console.log(ganNeto);
        return ganNeto;
    } catch (error) {
        console.error("Ocurrio algo inesperado al calcular las ganacias", error);
        return null;
    }
}


const main = function (){
    console.log(procesarCSV());
}

main();


// Se ha logrado todo lo necesario para calcular el rendimiento anual para terceros por parte de Steam. 
//  
/* 
Ahora queda resolver el tema 'First-Party' que es completamente privado, 
por lo tanto, tendría que ser un añadido NO VERIFICABLE o en lugar de ver las ingresos generales 
(siendo la suma de las comisiones y el First-Party) podríamos centrarnos en \textit{Como los números
apoyan la decisión de los terceros de publicar en Steam y no en Epic}
*/