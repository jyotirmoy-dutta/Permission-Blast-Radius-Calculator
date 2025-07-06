import { execSync } from 'child_process';

describe('CLI', () => {
  it('should print help with no arguments', () => {
    const output = execSync('npx ts-node ./cli/index.ts').toString();
    expect(output).toMatch(/Usage: pbcli/);
  });
}); 