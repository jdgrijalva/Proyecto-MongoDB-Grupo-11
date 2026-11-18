# Registro de ingesta del dataset

## 1. Fuente de datos

Dataset: Google Analytics Customer Revenue Prediction

Archivo: train.csv

Fuente: Kaggle

Tamaño: 1.503.430.926 bytes

Fecha de descarga: 17/11/2026 (confirmar fecha exacta)

## 2. Entorno de almacenamiento

Motor: MongoDB 7

Ejecución: Docker Compose

Replica Set: rs0

Base de datos: GA_Analytics_DB

Colección de destino: sessions_raw

## 3. Resultado de importación inicial

Documentos importados: 903.653

Duración: 77,74 segundos

Errores registrados: 0

## 4. Observaciones de inspección

El CSV contiene 12 columnas.

Los campos device, geoNetwork, totals y trafficSource contienen estructuras JSON almacenadas como texto.

La importación inicial convirtió sessionId en un valor numérico de punto flotante.

Se decidió revisar la estrategia de importación para conservar los identificadores originales como cadenas de texto.

## 5. Estado

Ingesta inicial: completada.

Validación de tipos: pendiente.

Importación definitiva: pendiente de confirmar.

Normalización: pendiente.