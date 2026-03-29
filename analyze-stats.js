const fs = require('fs');
const stats = JSON.parse(fs.readFileSync('dist/gym-ui/stats.json', 'utf8'));

if (stats.inputs) {
  const inputs = Object.entries(stats.inputs)
    .map(([path, data]) => ({ path, size: data.bytesInOutput }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 20);
  console.log("TOP FILES BY SIZE:");
  inputs.forEach(i => console.log(`${(i.size / 1024).toFixed(2)} KB - ${i.path}`));
} else {
  console.log("No inputs field in stats.json");
}
