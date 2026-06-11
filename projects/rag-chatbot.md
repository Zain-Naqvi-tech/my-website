## Overview

A **Retrieval-Augmented Generation (RAG)** chatbot that answers questions from custom
uploaded documents — running entirely on local models.

> Replace this with your Notion write-up — `projects/rag-chatbot.md`.

## Pipeline

1. **Embed** documents with sentence transformers
2. **Index** the vectors in **FAISS** for fast similarity search
3. **Retrieve** the most relevant chunks for a query
4. **Generate** a grounded answer with **Llama 2**, served locally via **Ollama**

## Why it matters

Grounding the model in real source documents keeps answers accurate and avoids
hallucination — and running everything locally keeps the data private.

## What I learned

Embedding models, vector databases, and how to anchor large language models in
external knowledge.

## Tech

`LLMs` · `Sentence Transformers` · `FAISS` · `Llama 2` · `Ollama` · `Python`
