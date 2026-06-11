## Overview

An automated plant-monitoring system that waters plants based on **real-time soil
moisture**. A servo dispenses water whenever moisture falls below a set threshold, while
a DHT22 tracks temperature and humidity and a gas sensor watches air quality near the plant.

> Replace this with your Notion write-up — `projects/smart-plant.md`.

## What it does

- Measures soil moisture continuously and waters only when needed
- Monitors temperature and humidity with a DHT22 sensor
- Detects air quality near the plant with a gas sensor

## Engineering notes

- **Analog-to-digital conversion** for the moisture probe, with calibration against dry/wet references
- **Sensor fusion** across moisture, climate, and air-quality inputs
- **Actuation** — servo-driven watering triggered by threshold logic

## What I learned

Embedded systems fundamentals — ADC, sensor calibration, and integrating several hardware
components cleanly on a single microcontroller.

## Tech

`Embedded C` · `DHT22` · `Gas sensor` · `Servo` · `ADC`
