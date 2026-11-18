# Evaluación Práctica I Parcial
## Grupo 11 — Caso 01

### 1. Información del grupo

- **Grupo:** 11
- **Asignatura:** Modelo Avanzado de Bases de Datos
- **NRC:** 36740 
- **Caso de estudio:** Google Analytics Customer Revenue Prediction
- **Base de datos:** MongoDB 7
- **Integrantes:**
  - Joustin Damián Grijalva Marmol
  - Integrante 2
  - Integrante 3
  - Integrante 4

### 2. Descripción del proyecto

El proyecto consiste en importar, transformar y analizar el conjunto de datos *Google Analytics Customer Revenue Prediction* mediante MongoDB.

Se trabajará con operaciones CRUD, consultas de agregación, replicación mediante Replica Set y distribución de datos mediante Sharding.

### 3. Estructura del repositorio

```text
pruebaparcial1/
├── dataset/
│   └── train.csv
├── scripts/
│   ├── normalizar.js
│   └── analizar_calidad.js
├── documentacion/
│   ├── diccionario_datos.md
│   └── registro_normalizacion.md
├── docker-compose.yml
└── README.md
```

### 4. Estado del proyecto

- [x] Configuración inicial de Docker y MongoDB.
- [x] Creación de la base de datos y colecciones.
- [x] Importación del archivo `train.csv`.
- [x] Normalización de los documentos.
- [x] Análisis de calidad de los datos.
- [x] Elaboración del diccionario de datos.
- [x] Documentación del proceso de importación y normalización.
- [ ] Implementación y pruebas de operaciones CRUD.
- [ ] Desarrollo de consultas de agregación.
- [ ] Resolución de las preguntas de análisis gerencial.
- [ ] Implementación y pruebas del Replica Set.
- [ ] Implementación y pruebas de Sharding.
- [ ] Elaboración del informe final.
- [ ] Grabación del video de demostración.
- [ ] Revisión final de la documentación y del repositorio.

### 5. Requisitos para ejecutar el proyecto

- Docker Desktop.
- Docker Compose.
- MongoDB Server 7.
- MongoDB Shell (`mongosh`).
- MongoDB Database Tools (`mongoimport`).
- MongoDB Compass (opcional).
- Dataset train.csv

### 6. Fuente de datos

**Dataset:** Google Analytics Customer Revenue Prediction.

**Fuente:** [Kaggle — Google Analytics Customer Revenue Prediction](https://www.kaggle.com/competitions/ga-customer-revenue-prediction/data)

El archivo utilizado es `train.csv`.

**Descarga del dataset:** [Google Drive](https://drive.google.com/file/d/1uX1-RpyH_ldg0rFwSFkmRk1nP8wx6YVi/view?usp=sharing)