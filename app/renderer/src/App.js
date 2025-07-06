import React, { useEffect, useState } from 'react';
import './App.css';

function parseUserResourceCSV(content) {
  // Parse CSV with columns: username,full_name,department,role,resource_type,resource_name,permissions
  const lines = content.split('\n').filter(Boolean);
  const header = lines[0].toLowerCase().includes('username') ? lines.shift() : null;
  const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
  // Map: username -> array of resources
  const userMap = {};
  rows.forEach(cols => {
    const [username, , , , resource_type, resource_name, permissions] = cols;
    if (!username) return;
    if (!userMap[username]) userMap[username] = [];
    if (resource_type && resource_name && permissions) {
      userMap[username].push({
        type: resource_type,
        name: resource_name,
        permissions: permissions.split(';').map(p => p.trim()),
      });
    }
  });
  return userMap;
}

function App() {
  const [userMap, setUserMap] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blastRadius, setBlastRadius] = useState(null);

  useEffect(() => {
    // Default demo data
    const demoMap = {
      alice: [
        { type: 'file', name: '/home/alice/secret.txt', permissions: ['read', 'write'] },
        { type: 'db', name: 'finance_db', permissions: ['read'] },
      ],
      bob: [
        { type: 'server', name: 'prod-web-01', permissions: ['ssh'] },
        { type: 'file', name: '/etc/shadow', permissions: ['read'] },
      ],
      carol: [
        { type: 'folder', name: '/home/carol/docs', permissions: ['read', 'write', 'delete'] },
      ],
    };
    setUserMap(demoMap);
    setUsers(Object.keys(demoMap));
  }, []);

  const handleUserSelect = (e) => {
    const username = e.target.value;
    setSelectedUser(username);
    setBlastRadius({
      user: { username },
      accessibleResources: userMap[username] || [],
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const parsedMap = parseUserResourceCSV(content);
      setUserMap(parsedMap);
      setUsers(Object.keys(parsedMap));
      setSelectedUser(null);
      setBlastRadius(null);
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Permission Blast Radius Calculator</h1>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="user-upload">Upload user-resource CSV: </label>
          <input id="user-upload" type="file" accept=".csv,.txt" onChange={handleFileUpload} />
        </div>
        <div>
          <label htmlFor="user-select">Select User: </label>
          <select id="user-select" onChange={handleUserSelect} value={selectedUser || ''}>
            <option value="" disabled>Select a user</option>
            {users.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        {blastRadius && (
          <div style={{ marginTop: 24 }}>
            <h2>Blast Radius for {blastRadius.user.username}</h2>
            <ul>
              {blastRadius.accessibleResources.map((r, i) => (
                <li key={i}>
                  [{r.type}] <b>{r.name}</b> ({r.permissions.join(', ')})
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
