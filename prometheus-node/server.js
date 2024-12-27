const http = require('http');
const client = require('prom-client');
const os = require('os');
const osu = require('os-utils');

const register = new client.Registry();

client.collectDefaultMetrics({ register });

// Custom metrics
const cpuUsageGauge = new client.Gauge({
  name: 'system_cpu_usage',
  help: 'CPU usage percentage',
});

const memoryUsageGauge = new client.Gauge({
  name: 'system_memory_usage',
  help: 'Memory usage in bytes',
});

const totalMemoryGauge = new client.Gauge({
  name: 'system_total_memory',
  help: 'Total system memory in bytes',
});

register.registerMetric(cpuUsageGauge);
register.registerMetric(memoryUsageGauge);
register.registerMetric(totalMemoryGauge);

setInterval(() => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  memoryUsageGauge.set(usedMemory);
  totalMemoryGauge.set(totalMemory);

  osu.cpuUsage((usage) => {
    cpuUsageGauge.set(Number((usage * 1000).toFixed(0)));
  });
}, 1000);

const server = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start the server
const PORT = 9100; // Prometheus convention for custom exporters
server.listen(PORT, () => {
  console.log(`Metrics server running at http://localhost:${PORT}/metrics`);
});