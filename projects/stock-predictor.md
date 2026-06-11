## Overview

A **Streamlit** web app that predicts whether a stock will move up or down by combining
**real-time news sentiment** with historical price trends.

> Replace this with your Notion write-up — `projects/stock-predictor.md`.

## How it works

- Pulls recent headlines through **NewsAPI**
- Applies NLP — tokenization, cleaning, and sentiment scoring — to gauge market tone
- Uses market data to compute 5-day moving averages
- Correlates sentiment with actual price trends to make a call

## What I built

- The full Python backend and prediction logic
- API integrations with secure key management
- A deployable Streamlit front end

## What I learned

API integration, lightweight financial analysis, and shipping a full app with secrets
handled safely.

## Tech

`Python` · `NLP` · `Streamlit` · `NewsAPI` · `Market data`
