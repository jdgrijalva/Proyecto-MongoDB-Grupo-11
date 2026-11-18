# Registro de normalización – Google Analytics Customer Revenue Prediction

## 1. Objetivo

Transformar los registros originales importados desde `train.csv` a MongoDB, convirtiendo los campos JSON almacenados como texto en documentos anidados y adecuando los tipos de datos para facilitar las consultas, operaciones CRUD y agregaciones.

## 2. Origen y destino

| Elemento | Descripción |
|---|---|
| Base de datos | `GA_Analytics_DB` |
| Colección de origen | `sessions_raw` |
| Colección de destino | `sessions` |
| Archivo de origen | `train.csv` |
| Herramienta | `mongosh` |
| Script | `normalizar.js` |
| Tamaño de lote | 1.000 documentos |

Se conservó `sessions_raw` sin modificaciones para mantener los datos originales y permitir su comparación con los registros normalizados.

## 3. Transformaciones realizadas

| Campo | Transformación |
|---|---|
| `device` | Cadena JSON convertida en documento anidado. |
| `geoNetwork` | Cadena JSON convertida en documento anidado. |
| `totals` | Cadena JSON convertida en documento anidado y conversión de métricas numéricas. |
| `trafficSource` | Cadena JSON convertida en documento anidado, conservando sus objetos internos. |
| `visitNumber` | Cadena convertida a número. |
| `visitStartTime` | Cadena convertida a número. |
| `fullVisitorId` | Conservado como cadena de texto. |
| `sessionId` | Conservado como cadena de texto. |
| `visitId` | Conservado como cadena de texto. |
| `revenue` | Campo derivado a partir de `totals.transactionRevenue`, dividido entre 1.000.000. |
| `hasRevenue` | Campo booleano que indica si la sesión tiene ingresos positivos. |

Los campos originales de los documentos JSON se conservaron, incluidos los valores descriptivos como `(not set)` y `not available in demo dataset`.

Los identificadores se conservaron como texto para evitar pérdidas de precisión.

## 4. Tratamiento de ingresos

Durante la inspección de `sessions_raw` se encontraron 11.515 documentos que contienen el campo `transactionRevenue`.

Se obtuvieron las siguientes estadísticas sobre los valores originales:

| Métrica | Resultado |
|---|---:|
| Registros con `transactionRevenue` | 11.515 |
| Valor mínimo | 10.000 |
| Valor máximo | 23.129.500.000 |
| Promedio | 133.744.788,54 |

Los valores se interpretaron en micros de la moneda. Para facilitar las consultas posteriores, se creó el campo `revenue`, expresado en unidades monetarias.

Cuando no existe un ingreso positivo registrado, `revenue` toma el valor 0 y `hasRevenue` toma el valor `false`.

## 5. Resultados de la normalización

La normalización se ejecutó mediante el archivo `normalizar.js`.

| Comprobación | Resultado |
|---|---:|
| Documentos en `sessions_raw` | 903.653 |
| Documentos en `sessions` | 903.653 |
| Diferencia entre colecciones | 0 |

Se verificó mediante una consulta de tipos que los campos JSON se almacenaron como documentos y que los identificadores conservaron sus tipos de texto.

### Tipos comprobados

| Campo | Tipo MongoDB |
|---|---|
| `device` | object |
| `geoNetwork` | object |
| `totals` | object |
| `trafficSource` | object |
| `visitNumber` | int |
| `revenue` | int |
| `fullVisitorId` | string |

También se inspeccionó un documento normalizado para comprobar la estructura de los objetos anidados y los campos derivados.

## 6. Conclusión

La normalización permitió transformar los registros originales en documentos estructurados, adecuados para trabajar con consultas y agregaciones en MongoDB.

La conservación de `sessions_raw` permite mantener una referencia de los datos originales, comparar resultados y documentar las transformaciones realizadas.

Las colecciones `sessions_raw` y `sessions` contienen la misma cantidad de registros: 903.653 documentos.

## 7. Archivos relacionados

- `scripts/normalizar.js`: script utilizado para realizar la transformación.
- `dataset/train.csv`: archivo original utilizado para la importación.
- `evidencia/importacion/registro_importacion.md`: registro de la importación inicial.

