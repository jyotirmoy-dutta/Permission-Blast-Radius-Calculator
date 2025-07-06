"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permissionAnalysis_1 = require("./permissionAnalysis");
describe('Permission Analysis', () => {
    it('should return at least one user', () => {
        const users = (0, permissionAnalysis_1.scanLocalUsers)();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        expect(users[0]).toHaveProperty('username');
    });
    it('should analyze blast radius for a user', () => {
        const users = (0, permissionAnalysis_1.scanLocalUsers)();
        const user = users[0];
        const report = (0, permissionAnalysis_1.analyzeBlastRadius)(user);
        expect(report).toHaveProperty('user');
        expect(report).toHaveProperty('accessibleResources');
        expect(Array.isArray(report.accessibleResources)).toBe(true);
    });
});
