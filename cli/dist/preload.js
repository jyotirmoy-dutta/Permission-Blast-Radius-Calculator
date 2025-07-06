// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require('electron');
const { scanLocalUsers, analyzeBlastRadius } = require('../../shared/permissionAnalysis');

window.addEventListener('DOMContentLoaded', () => {
  // Example: Expose a version API
  window.electronAPI = {
    getAppVersion: () => require('electron').remote.app.getVersion()
  };
});

contextBridge.exposeInMainWorld('permissionBlastAPI', {
  getUsers: () => scanLocalUsers(),
  analyzeBlastRadius: (username) => {
    const users = scanLocalUsers();
    const user = users.find(u => u.username === username);
    if (!user) return null;
    return analyzeBlastRadius(user);
  },
}); 