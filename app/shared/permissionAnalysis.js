"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanLocalUsers = scanLocalUsers;
exports.scanLocalResources = scanLocalResources;
exports.analyzeBlastRadius = analyzeBlastRadius;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
function scanWindowsUsers() {
    // TODO: Use 'net user' or PowerShell to list users and groups
    // Placeholder implementation
    return [{ username: os_1.default.userInfo().username, groups: [] }];
}
function scanLinuxUsers() {
    // Parse /etc/passwd and /etc/group
    try {
        const passwd = fs_1.default.readFileSync('/etc/passwd', 'utf-8');
        const users = passwd.split('\n').filter(Boolean).map(line => {
            const [username] = line.split(':');
            return { username, groups: [] };
        });
        return users;
    }
    catch {
        return [{ username: os_1.default.userInfo().username, groups: [] }];
    }
}
function scanMacUsers() {
    // macOS is similar to Linux
    return scanLinuxUsers();
}
function scanLocalUsers() {
    const platform = os_1.default.platform();
    if (platform === 'win32')
        return scanWindowsUsers();
    if (platform === 'darwin')
        return scanMacUsers();
    return scanLinuxUsers();
}
function scanWindowsResources(user) {
    // TODO: Use PowerShell to enumerate file/folder permissions for user
    return [];
}
function scanLinuxResources(user) {
    // TODO: Use fs and 'ls -l' to enumerate file/folder permissions for user
    return [];
}
function scanMacResources(user) {
    // macOS is similar to Linux
    return scanLinuxResources(user);
}
function scanLocalResources(user) {
    const platform = os_1.default.platform();
    if (platform === 'win32')
        return scanWindowsResources(user);
    if (platform === 'darwin')
        return scanMacResources(user);
    return scanLinuxResources(user);
}
/**
 * Analyze the blast radius for a given user account.
 * @param user The user account to analyze.
 * @returns A report of all resources the user can access.
 */
function analyzeBlastRadius(user) {
    const accessibleResources = scanLocalResources(user);
    return {
        user,
        accessibleResources,
    };
}
