---
# PLANTILLA — no se publica.
# Los archivos que empiezan con "_" están excluidos de la colección `blog`
# (ver src/content.config.ts). Para crear un artículo, copia este archivo a
# src/content/blog/<slug>.md (sin "_"). El nombre del archivo es el slug:
#   /blog/<pillar>/<slug>/

# Título del artículo (se usa como H1, <title> y og:title).
title: "Título del artículo"

# Meta description. Máximo 160 caracteres (el build falla si se excede).
description: "Resumen de 1–2 frases con la keyword principal, máximo 160 caracteres."

# Fecha de publicación (YYYY-MM-DD).
pubDate: 2026-01-01

# Opcional: fecha de la última actualización relevante.
# updatedDate: 2026-02-01

# Categoría. Una de: retiro | finanzas | ventas | coaching
# retiro y finanzas muestran el aviso "Contenido informativo...".
pillar: retiro

# Keyword principal a posicionar.
keyword: "plan personal de retiro"

# CTA al final del artículo. Uno de:
#   patrimonial → "Agenda tu Estrategia Patrimonial sin costo"
#   comercial   → "Agenda tu Diagnóstico Comercial sin costo"
cta: patrimonial

# Opcional: imagen principal, ruta relativa a este archivo (se optimiza y se
# usa como og:image 1200×630). Guarda las imágenes en src/assets/blog/.
# heroImage: ../../assets/blog/mi-imagen.jpg

# Opcional: preguntas frecuentes. Se muestran al final y generan FAQPage JSON-LD.
faqs:
  - question: "¿Pregunta frecuente?"
    answer: "Respuesta directa en 1–3 frases."

# true = borrador (no se genera en producción). Cambiar a false para publicar.
draft: true
---

Primer párrafo: responde la pregunta principal de forma directa.

## Subtítulo H2

Contenido en Markdown.
