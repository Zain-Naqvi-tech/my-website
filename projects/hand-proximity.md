## Overview

A real-time computer-vision project using **OpenCV** to identify hand positions and
nearby objects in live video, determine which hand is closest to which object, and
announce the result with **text-to-speech**.

> Replace this with your Notion write-up — `projects/hand-proximity.md`.

## How it works

- Detects hand and object **contours** in each video frame
- Computes the **minimum distance** between hand contours and object contours
- Decides which hand is closer to which object
- A TTS module **speaks** the result out loud

## What I learned

Contour detection, real-time video processing, spatial analysis, and wiring audio
feedback into a computer-vision pipeline.

## Tech

`OpenCV` · `Python` · `Real-time CV` · `Text-to-Speech`
