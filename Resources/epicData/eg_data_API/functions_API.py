import requests
import json
import os
import time

# ==========================================
# Configuración Exacta de la API
# ==========================================
BASE_URL = "https://api.egdata.app"
HEADERS = {
    "Accept": "application/json",
    # Es buena práctica en APIs públicas identificar tu script
    "User-Agent": "EpicSteamContrastBot/1.0"
}

def guardar_json(datos, nombre_archivo):
    """Guarda la estructura estructurada localmente."""
    ruta_completa = os.path.abspath(nombre_archivo)
    with open(ruta_completa, 'w', encoding='utf-8') as archivo:
        json.dump(datos, archivo, indent=4, ensure_ascii=False)
    print(f"[*] Guardado exitoso: {nombre_archivo}")

# ==========================================
# 1. Búsqueda Paginada (Endpoint: /search)
# ==========================================
def obtener_catalogo_completo(anio="2023"):
    """
    Realiza peticiones recursivas/iterativas para descargar el catálogo íntegro
    respetando la paginación de egdata.
    """
    endpoint = f"{BASE_URL}/search"
    resultados_totales = []
    
    # Parámetros estándar para paginación basados en OpenAPI
    limit = 50 
    offset = 0
    hay_mas_paginas = True
    
    print(f"\n[Búsqueda] Extrayendo catálogo del año {anio}...")
    
    while hay_mas_paginas:
        parametros = {
            "releaseYear": anio,
            "limit": limit,
            "offset": offset
        }
        
        respuesta = requests.get(endpoint, headers=HEADERS, params=parametros)
        
        if respuesta.status_code == 200:
            datos = respuesta.json()
            
            # La API de egdata suele envolver los arreglos en una llave (ej. 'elements' o 'data')
            # Asumimos una estructura estándar REST de listas paginadas
            elementos_pagina = datos.get('elements', datos.get('data', []))
            
            if not elementos_pagina:
                hay_mas_paginas = False
                break
                
            resultados_totales.extend(elementos_pagina)
            print(f"   -> Descargados {len(resultados_totales)} elementos...")
            
            # Aumentamos el offset para la siguiente página
            offset += limit
            
            # Pausa de cortesía para no saturar el servidor (Rate Limiting)
            time.sleep(0.5)
            
            # Condición de salida si la página devolvió menos del límite máximo
            if len(elementos_pagina) < limit:
                hay_mas_paginas = False
        else:
            print(f"[!] Error HTTP {respuesta.status_code}. Deteniendo paginación.")
            break
            
    guardar_json(resultados_totales, f"epic_catalogo_{anio}_completo.json")
    return resultados_totales

# ==========================================
# 2. Detalles de Ofertas (Endpoint: /offers)
# ==========================================
def obtener_detalles_oferta(offer_id):
    """
    Consulta el recurso '/offers' para obtener la metadata del juego.
    """
    endpoint = f"{BASE_URL}/offers/{offer_id}"
    print(f"\n[Ofertas] Consultando metadata de Offer ID: {offer_id}")
    
    respuesta = requests.get(endpoint, headers=HEADERS)
    if respuesta.status_code == 200:
        datos = respuesta.json()
        guardar_json(datos, f"epic_oferta_{offer_id}.json")
        return datos
    else:
        print(f"[!] Error HTTP {respuesta.status_code} al buscar oferta.")

# ==========================================
# 3. Juegos Gratis (Endpoint: /free-games)
# ==========================================
def obtener_juegos_gratis():
    """
    Consulta la ruta principal de promociones gratuitas.
    """
    endpoint = f"{BASE_URL}/free-games"
    print("\n[Promociones] Descargando listado de juegos gratis...")
    
    respuesta = requests.get(endpoint, headers=HEADERS)
    if respuesta.status_code == 200:
        datos = respuesta.json()
        guardar_json(datos, "epic_juegos_gratis.json")
        return datos
    else:
        print(f"[!] Error HTTP {respuesta.status_code} al buscar promociones.")

# ==========================================
# Ejecución Principal
# ==========================================
if __name__ == "__main__":
    # Descarga directa y paginada
    obtener_juegos_gratis()
    obtener_catalogo_completo("2023")
    
    # Ejemplo de consulta específica (Necesitarás un ID real de la API)
    # obtener_detalles_oferta("ID_ALFANUMERICO_DEL_JUEGO")