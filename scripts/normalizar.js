// ============================================
// PROYECTO: Google Analytics Customer Revenue
// ARCHIVO: normalizar.js
// ORIGEN: GA_Analytics_DB.sessions_raw
// DESTINO: GA_Analytics_DB.sessions
// ============================================

const dbProyecto = db.getSiblingDB("GA_Analytics_DB");

const origen = dbProyecto.sessions_raw;
const destino = dbProyecto.sessions;

// 1. Verificar que existan datos de origen
const totalOrigen = origen.countDocuments();

if (totalOrigen === 0) {
    throw new Error("La colección sessions_raw está vacía.");
}

// 2. Evitar duplicar documentos si se ejecuta dos veces
const totalDestino = destino.countDocuments();

if (totalDestino > 0) {
    throw new Error(
        "La colección sessions ya contiene documentos. " +
        "No se realizará la normalización para evitar duplicados."
    );
}

print("======================================");
print("INICIANDO NORMALIZACIÓN");
print("Documentos de origen: " + totalOrigen);
print("======================================");

// 3. Campos numéricos dentro de totals
const camposNumericosTotals = [
    "visits",
    "hits",
    "pageviews",
    "bounces",
    "newVisits",
    "transactions",
    "transactionRevenue",
    "timeOnSite",
    "sessionQualityDim"
];

// Convierte los valores numéricos de un documento
function convertirCamposNumericos(documento, campos) {
    campos.forEach(campo => {
        if (
            documento[campo] !== undefined &&
            documento[campo] !== null &&
            documento[campo] !== ""
        ) {
            const valor = Number(documento[campo]);

            if (Number.isFinite(valor)) {
                documento[campo] = valor;
            }
        }
    });

    return documento;
}

// 4. Variables de control
let lote = [];
const tamanoLote = 1000;

let procesados = 0;
let insertados = 0;
let errores = 0;

const primerosErrores = [];

// 5. Procesar cada documento
origen.find().forEach(documento => {
    try {
        // Convertir los cuatro campos JSON de texto
        const device = JSON.parse(documento.device);
        const geoNetwork = JSON.parse(documento.geoNetwork);
        const totals = JSON.parse(documento.totals);
        const trafficSource = JSON.parse(documento.trafficSource);

        // Comprobar que los JSON sean objetos válidos
        if (
            device === null || Array.isArray(device) ||
            geoNetwork === null || Array.isArray(geoNetwork) ||
            totals === null || Array.isArray(totals) ||
            trafficSource === null || Array.isArray(trafficSource)
        ) {
            throw new Error("Uno de los campos JSON no es un objeto válido.");
        }

        // Convertir métricas numéricas de totals
        convertirCamposNumericos(totals, camposNumericosTotals);

        // Convertir identificadores numéricos de sesión
        const visitNumber = Number(documento.visitNumber);
        const visitStartTime = Number(documento.visitStartTime);

        if (
            !Number.isSafeInteger(visitNumber) ||
            !Number.isSafeInteger(visitStartTime)
        ) {
            throw new Error("visitNumber o visitStartTime no es válido.");
        }

        // Obtener ingresos originales en micros
        const transactionRevenue = totals.transactionRevenue;

        const tieneIngresos =
            typeof transactionRevenue === "number" &&
            transactionRevenue > 0;

        // Construir documento normalizado
        const normalizado = {
            _id: documento._id,

            channelGrouping: documento.channelGrouping,
            date: documento.date,

            device: device,
            fullVisitorId: documento.fullVisitorId,
            geoNetwork: geoNetwork,
            sessionId: documento.sessionId,
            socialEngagementType: documento.socialEngagementType,
            totals: totals,
            trafficSource: trafficSource,

            visitId: documento.visitId,
            visitNumber: visitNumber,
            visitStartTime: visitStartTime,

            revenue: tieneIngresos
                ? transactionRevenue / 1000000
                : 0,

            hasRevenue: tieneIngresos
        };

        lote.push(normalizado);
        procesados++;

        // Insertar cada lote de 1000 documentos
        if (lote.length >= tamanoLote) {
            destino.insertMany(lote);

            insertados += lote.length;
            lote = [];

            print("Procesados: " + procesados + " / " + totalOrigen);
        }

    } catch (error) {
        errores++;

        if (primerosErrores.length < 20) {
            primerosErrores.push({
                id: documento._id,
                error: error.message
            });
        }
    }
});

// 6. Insertar los documentos restantes
if (lote.length > 0) {
    destino.insertMany(lote);
    insertados += lote.length;
}

// 7. Mostrar resumen final
const totalDestinoFinal = destino.countDocuments();

print("");
print("======================================");
print("RESUMEN DE NORMALIZACIÓN");
print("======================================");
print("Documentos de origen: " + totalOrigen);
print("Documentos procesados: " + procesados);
print("Documentos insertados: " + insertados);
print("Documentos con errores: " + errores);
print("Documentos en sessions: " + totalDestinoFinal);
print("======================================");

if (primerosErrores.length > 0) {
    print("Primeros errores encontrados:");
    printjson(primerosErrores);
}