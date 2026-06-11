## Overview

A two-legged robot built around an **Arduino Nano** that moves and reacts based on
ultrasonic distance input, performs custom dance routines, and shows animated "eyes"
on an LED matrix. Every part was fabricated by hand — cutting plastics, drilling metal
and PCBs, and soldering the circuitry.

> Paste your Notion write-up here. This file lives at `projects/dancing-robot.md` —
> anything you type is rendered as the project page. Markdown, images, and code all work.

## What it does

- Reads distance with ultrasonic sensors and reacts to nearby objects
- Runs custom dance routines programmed in the Arduino IDE
- Drives an LED matrix for animated eyes and visual feedback

## How I built it

- **Fabrication** — cut plastic body panels, drilled metal brackets and perfboard, soldered the circuit
- **Firmware** — wrote the control loop and motion sequencing in C++ on the Arduino Nano
- **Integration** — tuned sensor thresholds so movement felt responsive, not jittery

## What I learned

Hands-on circuit design, sensor integration, and the realities of embedded timing —
keeping the control loop fast enough to feel alive while driving motors and a display.

## Tech

`Arduino Nano` · `C++` · `Ultrasonic sensors` · `LED matrix` · `Soldering`
