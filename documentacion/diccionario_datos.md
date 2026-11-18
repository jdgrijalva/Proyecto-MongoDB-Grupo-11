# Diccionario de datos — Google Analytics Customer Revenue Prediction

## 1. Información general

- **Base de datos:** `GA_Analytics_DB`
- **Colección documentada:** `sessions`
- **Documentos analizados:** 903.653
- **Origen:** `train.csv` del conjunto Google Analytics Customer Revenue Prediction.
- **Formato:** documentos BSON de MongoDB con subdocumentos anidados.

La colección `sessions` contiene los registros originales importados desde el CSV, normalizados para convertir los campos JSON almacenados como texto en subdocumentos y transformar determinadas métricas a tipos numéricos.

## 2. Campos principales

| Campo | Tipo BSON | Descripción |
|---|---|---|
| `_id` | ObjectId | Identificador único generado durante la importación. Se conserva en la normalización. |
| `channelGrouping` | string | Agrupación del canal de adquisición de la sesión. |
| `date` | string | Fecha de la sesión en formato `YYYYMMDD`. |
| `device` | object | Información del dispositivo y navegador. |
| `fullVisitorId` | string | Identificador del visitante. Se conserva como cadena para evitar pérdida de precisión. |
| `geoNetwork` | object | Información geográfica y de red del visitante. |
| `sessionId` | string | Identificador compuesto de la sesión. |
| `socialEngagementType` | string | Clasificación de la interacción social asociada a la sesión. |
| `totals` | object | Métricas y resultados acumulados de la sesión. |
| `trafficSource` | object | Información sobre la fuente de adquisición del tráfico. |
| `visitId` | string | Identificador numérico original de la visita, conservado como cadena. |
| `visitNumber` | int | Número de visita del usuario. |
| `visitStartTime` | int | Marca temporal de inicio de la visita, expresada en segundos Unix. |
| `revenue` | int / double | Ingreso derivado de `totals.transactionRevenue`, convertido desde micros mediante una división para 1.000.000. |
| `hasRevenue` | bool | Indica si la sesión tiene ingresos registrados (`true`) o no (`false`). |

## 3. Subdocumento `device`

Contiene información del navegador, sistema operativo y dispositivo utilizado.

| Campo | Tipo BSON | Descripción |
|---|---|---|
| `device.browser` | string | Navegador utilizado. |
| `device.browserSize` | string | Tamaño del navegador. |
| `device.browserVersion` | string | Versión del navegador. |
| `device.deviceCategory` | string | Categoría del dispositivo, por ejemplo desktop, mobile o tablet. |
| `device.flashVersion` | string | Versión de Flash detectada. |
| `device.isMobile` | bool | Indica si el dispositivo es móvil. |
| `device.language` | string | Idioma configurado en el dispositivo o navegador. |
| `device.mobileDeviceBranding` | string | Marca del dispositivo móvil. |
| `device.mobileDeviceInfo` | string | Información del dispositivo móvil. |
| `device.mobileDeviceMarketingName` | string | Nombre comercial del dispositivo móvil. |
| `device.mobileDeviceModel` | string | Modelo del dispositivo móvil. |
| `device.mobileInputSelector` | string | Selector o tipo de entrada del dispositivo móvil. |
| `device.operatingSystem` | string | Sistema operativo utilizado. |
| `device.operatingSystemVersion` | string | Versión del sistema operativo. |
| `device.screenColors` | string | Información sobre los colores de pantalla. |
| `device.screenResolution` | string | Resolución de pantalla. |

## 4. Subdocumento `geoNetwork`

Contiene información geográfica y de red asociada a la sesión.

| Campo | Tipo BSON | Descripción |
|---|---|---|
| `geoNetwork.city` | string | Ciudad del visitante. |
| `geoNetwork.cityId` | string | Identificador de la ciudad. |
| `geoNetwork.continent` | string | Continente del visitante. |
| `geoNetwork.country` | string | País del visitante. |
| `geoNetwork.latitude` | string | Latitud geográfica. |
| `geoNetwork.longitude` | string | Longitud geográfica. |
| `geoNetwork.metro` | string | Área metropolitana. |
| `geoNetwork.networkDomain` | string | Dominio de red asociado a la conexión. |
| `geoNetwork.networkLocation` | string | Información de ubicación de red. |
| `geoNetwork.region` | string | Región geográfica. |
| `geoNetwork.subContinent` | string | Subcontinente del visitante. |

## 5. Subdocumento `totals`

Contiene las métricas de actividad y los ingresos de cada sesión.

| Campo | Tipo BSON | Descripción |
|---|---|---|
| `totals.visits` | int | Número de visitas contabilizadas. |
| `totals.hits` | int | Cantidad de interacciones o impactos registrados. |
| `totals.pageviews` | int | Número de páginas visualizadas. |
| `totals.bounces` | int | Indicador o cantidad de rebotes de la sesión. |
| `totals.newVisits` | int | Indicador de visita nueva. |
| `totals.transactionRevenue` | int / double | Ingreso original de la transacción expresado en micros. |

Algunos campos de este subdocumento no están presentes en todas las sesiones. En particular, `transactionRevenue` solo aparece en 11.515 documentos.

## 6. Subdocumento `trafficSource`

Describe el origen y los medios mediante los cuales el visitante llegó al sitio.

| Campo | Tipo BSON | Descripción |
|---|---|---|
| `trafficSource.adContent` | string | Contenido o identificador del anuncio. |
| `trafficSource.adwordsClickInfo` | object | Información relacionada con clics de Google Ads. |
| `trafficSource.campaign` | string | Nombre o identificador de la campaña. |
| `trafficSource.campaignCode` | string | Código de campaña. |
| `trafficSource.isTrueDirect` | bool | Indica si la visita corresponde a tráfico directo. |
| `trafficSource.keyword` | string | Palabra clave asociada al origen del tráfico. |
| `trafficSource.medium` | string | Medio de adquisición, por ejemplo organic, referral o cpc. |
| `trafficSource.referralPath` | string | Ruta de referencia desde la que llegó el visitante. |
| `trafficSource.source` | string | Fuente de adquisición del tráfico. |

### 6.1. Subdocumento `trafficSource.adwordsClickInfo`

Contiene detalles adicionales de los clics asociados a Google Ads.

| Campo | Tipo BSON | Descripción |
|---|---|---|
| `trafficSource.adwordsClickInfo.adNetworkType` | string | Tipo de red publicitaria. |
| `trafficSource.adwordsClickInfo.criteriaParameters` | string | Parámetros de criterios de segmentación. |
| `trafficSource.adwordsClickInfo.gclId` | string | Identificador del clic de Google Ads. |
| `trafficSource.adwordsClickInfo.isVideoAd` | bool | Indica si el anuncio corresponde a un anuncio de video. |
| `trafficSource.adwordsClickInfo.page` | string | Página asociada al anuncio. |
| `trafficSource.adwordsClickInfo.slot` | string | Ubicación del anuncio. |
| `trafficSource.adwordsClickInfo.targetingCriteria` | object | Criterios de segmentación del anuncio. |

## 7. Campos derivados durante la normalización

Se añadieron dos campos para facilitar el análisis de ingresos:

| Campo | Tipo BSON | Transformación |
|---|---|---|
| `revenue` | int / double | Se obtiene dividiendo `totals.transactionRevenue` entre 1.000.000. Cuando no existe un ingreso registrado, se asigna 0. |
| `hasRevenue` | bool | Se establece en `true` cuando `totals.transactionRevenue` es mayor que cero; de lo contrario, se establece en `false`. |

El campo original `totals.transactionRevenue` se conserva en el documento normalizado para mantener el valor original expresado en micros.

## 8. Observaciones sobre los tipos y la calidad de los datos

El análisis de los 903.653 documentos permitió identificar lo siguiente:

- Los 13 campos principales analizados están presentes en todos los documentos.
- Los subdocumentos `device`, `geoNetwork`, `totals` y `trafficSource` están presentes en los 903.653 registros.
- Los identificadores `fullVisitorId`, `sessionId` y `visitId` se mantienen como cadenas para evitar pérdida de precisión.
- Los campos `visitNumber` y `visitStartTime` se convirtieron a enteros.
- El campo `revenue` presenta 892.422 valores de tipo `int` y 11.231 de tipo `double`.
- Existen atributos anidados ausentes en determinadas sesiones. Por ejemplo, `totals.transactionRevenue` está ausente en 892.138 documentos.
- Se identificaron valores marcadores como `not available in demo dataset`, `(not set)` y `(not provided)`, que representan información no disponible y no campos BSON ausentes.
- Los campos ausentes y los valores marcadores se conservaron, sin sustituirlos indiscriminadamente durante la normalización.

## 9. Conclusión

La colección `sessions` contiene 903.653 documentos normalizados. Su estructura permite consultar los atributos originales mediante campos y subdocumentos BSON, utilizar métricas numéricas para agregaciones y analizar los ingresos de las sesiones mediante los campos derivados `revenue` y `hasRevenue`.

Este diccionario describe la estructura observada en la colección después del proceso de importación y normalización.