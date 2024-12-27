#!/bin/sh
TARGETS_ARRAY=$(echo $METRICS_TARGET | sed 's/,/","/g' | sed 's/^/["/' | sed 's/$/"]/')

echo "[
  {
    \"targets\": ${TARGETS_ARRAY},
    \"labels\": {
      \"job\": \"node-metrics\"
    }
  }
]" > /etc/prometheus/targets.json