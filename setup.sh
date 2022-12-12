#!/usr/bin/env bash

echo "[Fast-Setup]"

if [[ $OSTYPE == 'darwin'* ]]; then
  sh ./macOS/setup.sh
else
  sh ./linux/ubuntu/setup.sh
fi