#!/bin/bash
# usage: shot.sh "<query>" out.png
timeout 100 google-chrome --headless=new --no-sandbox --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --window-size=1024,778 --virtual-time-budget=20000 --screenshot=$2 "http://localhost:8765/?$1" >/dev/null 2>&1
