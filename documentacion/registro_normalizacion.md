# Registro de importación, calidad y normalización

## 1. Información del proyecto

- **Proyecto:** Google Analytics Customer Revenue Prediction.
- **Base de datos:** `GA_Analytics_DB`.
- **Motor:** MongoDB 7.
- **Infraestructura:** Replica Set `rs0`, compuesto por tres nodos.
- **Archivo de origen:** `train.csv`.
- **Tamaño del archivo:** 1.503.430.926 bytes (aproximadamente 1,50 GB).
- **Fuente:** [Kaggle - Google Analytics Customer Revenue Prediction](https://www.kaggle.com/competitions/ga-customer-revenue-prediction/data).
- **Fecha de descarga:** 17/11/2026 (confirmar con el registro original de descarga).

## 2. Importación del dataset

El archivo `train.csv` se importó mediante la herramienta `mongoimport`, utilizando el formato CSV y especificando los doce campos originales como cadenas de texto.

La importación se realizó en la colección `sessions_raw` de la base de datos `GA_Analytics_DB`.

Se especificaron los tipos como `string` para conservar correctamente los identificadores, especialmente `fullVisitorId`, `sessionId` y `visitId`, evitando conversiones automáticas que pudieran alterar su precisión.

Durante una primera prueba de importación se detectó que `sessionId` podía convertirse incorrectamente a un valor numérico. Por esta razón, se repitió la importación especificando explícitamente los tipos de los doce campos y se eliminó el documento correspondiente a la cabecera CSV.

**Resultado de la importación definitiva:**

- Documentos importados: 903.653.
- Campos originales: 12.
- Colección de destino: `sessions_raw`.
- Los identificadores se conservaron como cadenas.
- La colección `sessions_raw` se mantuvo como copia de referencia de los datos importados.

## 3. Proceso de normalización

Se desarrolló el script `scripts/normalizar.js`, ejecutado mediante `mongosh`.

El objetivo fue transformar los campos JSON almacenados como texto en subdocumentos BSON y preparar las métricas para su análisis.

### 3.1. Transformaciones aplicadas

**Conversión de campos JSON**

Se procesaron los siguientes campos:

- `device`
- `geoNetwork`
- `totals`
- `trafficSource`

Los valores de texto se interpretaron mediante `JSON.parse()` y se almacenaron como objetos anidados.

**Conversión de métricas numéricas**

Dentro de `totals` se convirtieron los siguientes atributos cuando estaban presentes:

- `visits`
- `hits`
- `pageviews`
- `bounces`
- `newVisits`
- `transactions`
- `transactionRevenue`
- `timeOnSite`
- `sessionQualityDim`

Los valores se convirtieron a números para facilitar consultas y operaciones de agregación.

**Conservación de identificadores**

Los campos `fullVisitorId`, `sessionId` y `visitId` permanecieron como cadenas de texto, evitando pérdida de precisión.

Los campos `visitNumber` y `visitStartTime` se convirtieron a enteros.

### 3.2. Cálculo de ingresos

El atributo original `totals.transactionRevenue` almacena los ingresos en micros.

Se añadió el campo `revenue`, calculado mediante:

`revenue = transactionRevenue / 1.000.000`

Cuando no existe un ingreso registrado, se asignó el valor numérico `0`.

También se añadió el campo booleano `hasRevenue`, que indica si la sesión tiene ingresos registrados:

- `true`: existe un ingreso mayor que cero.
- `false`: no existe un ingreso registrado.

El atributo original `totals.transactionRevenue` se conservó para mantener el valor de origen.

## 4. Resultados de la normalización

La colección de destino fue `sessions`.

| Indicador | Resultado |
|---|---:|
| Documentos en `sessions_raw` | 903.653 |
| Documentos procesados | 903.653 |
| Documentos insertados en `sessions` | 903.653 |
| Documentos finales en `sessions` | 903.653 |

La normalización se realizó mediante inserciones por lotes de 1.000 documentos.

Se verificó que las colecciones de origen y destino conservaran la misma cantidad de registros.

## 5. Análisis de calidad de los datos

Se desarrolló el script `scripts/analizar_calidad.js` para revisar la estructura de los documentos normalizados.

El análisis consideró tipos BSON, campos presentes, campos ausentes, valores nulos, valores vacíos y valores marcadores.

### 5.1. Campos principales

Los campos principales analizados están presentes en los 903.653 documentos.

No se encontraron valores nulos, vacíos ni marcadores en esos campos.

Los cuatro subdocumentos principales (`device`, `geoNetwork`, `totals` y `trafficSource`) también están presentes en todos los registros.

### 5.2. Tipos de datos

Se identificaron los siguientes tipos para los campos principales:

| Campo | Tipo | Cantidad |
|---|---|---:|
| `fullVisitorId` | string | 903.653 |
| `sessionId` | string | 903.653 |
| `visitId` | string | 903.653 |
| `visitNumber` | int | 903.653 |
| `visitStartTime` | int | 903.653 |
| `revenue` | int | 892.422 |
| `revenue` | double | 11.231 |
| `hasRevenue` | bool | 903.653 |

La diferencia entre `int` y `double` en `revenue` se debe al resultado numérico de la división de los ingresos entre un millón. Ambos tipos representan valores numéricos válidos.

### 5.3. Campos anidados ausentes

Se identificaron atributos que no están presentes en todas las sesiones.

Algunos resultados relevantes son:

| Campo | Presentes | Ausentes |
|---|---:|---:|
| `totals.bounces` | 450.630 | 453.023 |
| `totals.newVisits` | 703.060 | 200.593 |
| `totals.pageviews` | 903.553 | 100 |
| `totals.transactionRevenue` | 11.515 | 892.138 |
| `trafficSource.adContent` | 10.946 | 892.707 |
| `trafficSource.isTrueDirect` | 274.005 | 629.648 |
| `trafficSource.keyword` | 400.724 | 502.929 |
| `trafficSource.referralPath` | 330.941 | 572.712 |

La ausencia de estos atributos no implica necesariamente que los documentos sean incorrectos. Algunos datos dependen de las características de la sesión o de la fuente de adquisición.

### 5.4. Valores marcadores

También se identificaron valores que representan información no