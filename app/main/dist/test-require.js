const path = require('path');
console.log('Trying to require:', path.resolve(__dirname, '../../shared/dist/permissionAnalysis'));
const mod = require(path.resolve(__dirname, '../../shared/dist/permissionAnalysis'));
console.log('Loaded:', mod);
