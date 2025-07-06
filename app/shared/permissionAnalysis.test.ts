import { scanLocalUsers, analyzeBlastRadius } from './permissionAnalysis';

describe('Permission Analysis', () => {
  it('should return at least one user', () => {
    const users = scanLocalUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('username');
  });

  it('should analyze blast radius for a user', () => {
    const users = scanLocalUsers();
    const user = users[0];
    const report = analyzeBlastRadius(user);
    expect(report).toHaveProperty('user');
    expect(report).toHaveProperty('accessibleResources');
    expect(Array.isArray(report.accessibleResources)).toBe(true);
  });
}); 