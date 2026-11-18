
// ============================================
// PROYECTO: Google Analytics Customer Revenue
// ARCHIVO: analizar_calidad.js
// OBJETIVO: Revisar estructura y valores ausentes
// ============================================

const dbProyecto = db.getSiblingDB("GA_Analytics_DB");
const coleccion = dbProyecto.sessions;

const total = coleccion.countDocuments();

const marcadores = [
    "(not set)",
    "(not provided)",
    "not available in demo dataset"
];

print("======================================");
print("ANALISIS DE CALIDAD DE DATOS");
print("======================================");
print("Documentos analizados: " + total);

// Analizar los campos de un documento o subdocumento
function analizarEstructura(ruta, nombre, esPrincipal = false) {

    const pipeline = [
        {
            $match: {
                $expr: {
                    $eq: [{ $type: ruta }, "object"]
                }
            }
        },
        {
            $project: {
                pares: { $objectToArray: ruta }
            }
        },
        { $unwind: "$pares" }
    ];

    if (esPrincipal) {
        pipeline.push({
            $match: { "pares.k": { $ne: "_id" } }
        });
    }

    pipeline.push(
        {
            $group: {
                _id: {
                    campo: "$pares.k",
                    tipo: { $type: "$pares.v" }
                },
                presentes: { $sum: 1 },

                nulos: {
                    $sum: {
                        $cond: [
                            { $eq: [{ $type: "$pares.v" }, "null"] },
                            1,
                            0
                        ]
                    }
                },

                vacios: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: [{ $type: "$pares.v" }, "string"] },
                                    { $eq: ["$pares.v", ""] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },

                marcadores: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: [{ $type: "$pares.v" }, "string"] },
                                    { $in: ["$pares.v", marcadores] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        { $sort: { "_id.campo": 1 } }
    );

    const resultados = coleccion.aggregate(pipeline).toArray();

    const campos = {};

    resultados.forEach(resultado => {
        const nombreCampo = resultado._id.campo;

        if (!campos[nombreCampo]) {
            campos[nombreCampo] = {
                presentes: 0,
                nulos: 0,
                vacios: 0,
                marcadores: 0,
                tipos: []
            };
        }

        const campo = campos[nombreCampo];

        campo.presentes += resultado.presentes;
        campo.nulos += resultado.nulos;
        campo.vacios += resultado.vacios;
        campo.marcadores += resultado.marcadores;

        campo.tipos.push(
            resultado._id.tipo + ": " + resultado.presentes
        );
    });

    print("");
    print("--------------------------------------");
    print("ESTRUCTURA: " + nombre);
    print("--------------------------------------");

    Object.keys(campos).forEach(nombreCampo => {
        const campo = campos[nombreCampo];

        print("Campo: " + nombreCampo);
        print("  Tipos: " + campo.tipos.join(", "));
        print("  Presentes: " + campo.presentes);
        print("  Ausentes: " + (total - campo.presentes));
        print("  Nulos: " + campo.nulos);
        print("  Vacios: " + campo.vacios);
        print("  Marcadores: " + campo.marcadores);
    });
}

// Analizar campos principales y documentos anidados
analizarEstructura("$$ROOT", "Documento principal", true);

analizarEstructura("$device", "device");
analizarEstructura("$geoNetwork", "geoNetwork");
analizarEstructura("$totals", "totals");
analizarEstructura("$trafficSource", "trafficSource");

analizarEstructura(
    "$trafficSource.adwordsClickInfo",
    "trafficSource.adwordsClickInfo"
);

print("");
print("======================================");
print("ANALISIS FINALIZADO");
print("======================================");
