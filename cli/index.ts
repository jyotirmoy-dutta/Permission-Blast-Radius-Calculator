#!/usr/bin/env node
import { scanLocalUsers, analyzeBlastRadius } from '../app/shared/permissionAnalysis';

const args = process.argv.slice(2);

function printHelp() {
  console.log('Permission Blast Radius Calculator CLI');
  console.log('Usage: pbcli --user <username>');
  console.log('--user <username>   Analyze blast radius for a user');
  console.log('--list-users        List all local users');
  console.log('--help              Show help');
}

if (args.includes('--help') || args.length === 0) {
  printHelp();
  process.exit(0);
}

if (args.includes('--list-users')) {
  const users = scanLocalUsers();
  console.log('Local users:');
  users.forEach(u => console.log(`- ${u.username}`));
  process.exit(0);
}

const userIdx = args.indexOf('--user');
if (userIdx !== -1 && args[userIdx + 1]) {
  const username = args[userIdx + 1];
  const users = scanLocalUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    console.error(`User not found: ${username}`);
    process.exit(1);
  }
  const report = analyzeBlastRadius(user);
  console.log(`Blast radius for ${username}:`);
  if (report.accessibleResources.length === 0) {
    console.log('No accessible resources found (stub implementation).');
  } else {
    report.accessibleResources.forEach(r => {
      console.log(`- [${r.type}] ${r.name} (${r.permissions.join(', ')})`);
    });
  }
  process.exit(0);
}

printHelp();
process.exit(1); 