import requests
import json
import os

def descargar_y_guardar_json():
    # 1. Definimos el endpoint de la API y el nombre del archivo de salida
    url = "https://api.egdata.app/free-games"
    nombre_archivo = "juegos_gratis_epic.json"
    
    print(f"Conectando a la API: {url}...")
    
    try:
        # 2. Hacemos la petición GET
        respuesta = requests.get(url)
        
        # 3. Verificamos éxito (Código HTTP 200)
        if respuesta.status_code == 200:
            datos_json = respuesta.json()
            
            # 4. Abrimos (o creamos) el archivo en modo escritura ('w')
            with open(nombre_archivo, 'w', encoding='utf-8') as archivo:
                # json.dump escribe los datos en el archivo físico
                # indent=4 asegura que el archivo sea legible para humanos
                # ensure_ascii=False respeta los acentos y caracteres especiales
                json.dump(datos_json, archivo, indent=4, ensure_ascii=False)
                
            # Obtenemos la ruta absoluta para confirmar dónde se guardó
            ruta_completa = os.path.abspath(nombre_archivo)
            print(f"¡Éxito! El archivo se guardó correctamente en:\n{ruta_completa}")
            
        else:
            print(f"Error del servidor. Código HTTP: {respuesta.status_code}")
            
    except requests.exceptions.RequestException as error_red:
        print(f"Ocurrió un error de conexión: {error_red}")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

# Ejecución del script
if __name__ == "__main__":
    descargar_y_guardar_json()