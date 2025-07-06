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
const child_process_1 = require("child_process");
function isLikelyHumanUser(username) {
    // Exclude common system/service accounts
    const systemAccounts = [
        'root', 'daemon', 'bin', 'sys', 'sync', 'games', 'man', 'lp', 'mail', 'news', 'uucp', 'proxy', 'www-data',
        'backup', 'list', 'irc', 'gnats', 'nobody', 'systemd-network', 'systemd-resolve', 'syslog', 'messagebus',
        'usbmux', 'dnsmasq', 'avahi', 'ntp', 'sshd', 'mysql', 'postgres', 'ftp', 'rpc', 'rpcuser', 'nfsnobody',
        'admin', 'guest', 'defaultaccount', 'wdagutilityaccount', 'test', 'user', 'public', 'default', 'support_388945a0',
        'dwm', 'localservice', 'networkservice', 'trustedinstaller', 'iis_iusrs', 'krbtgt', 'helpassistant', 'aspnet',
        'tsinternetuser', 'vagrant', 'vboxadd', 'vboxsf', 'vboxguest', 'docker', 'containeruser', 'containeradministrator'
    ];
    if (!username)
        return false;
    const lower = username.toLowerCase();
    if (systemAccounts.includes(lower))
        return false;
    if (lower.startsWith('svc_') || lower.startsWith('sys_') || lower.startsWith('$'))
        return false;
    if (lower.length < 2)
        return false;
    return true;
}
function scanWindowsUsers() {
    try {
        const output = (0, child_process_1.execSync)('net user').toString();
        const lines = output.split(/\r?\n/);
        let users = [];
        let collecting = false;
        for (const line of lines) {
            if (line.includes('---')) {
                collecting = !collecting;
                continue;
            }
            if (collecting) {
                users.push(...line.trim().split(/\s+/).filter(Boolean));
            }
        }
        // Filter out system/service accounts
        return users.filter(isLikelyHumanUser).map(username => ({ username, groups: [] }));
    }
    catch {
        return [{ username: os_1.default.userInfo().username, groups: [] }];
    }
}
function scanLinuxUsers() {
    try {
        const passwd = fs_1.default.readFileSync('/etc/passwd', 'utf-8');
        const users = passwd.split('\n').filter(Boolean).map(line => {
            const [username, , uid] = line.split(':');
            return { username, uid: Number(uid), groups: [] };
        });
        // Only show users with UID >= 1000 (conventional for human users)
        return users.filter(u => u.uid >= 1000 && isLikelyHumanUser(u.username)).map(u => ({ username: u.username, groups: [] }));
    }
    catch {
        return [{ username: os_1.default.userInfo().username, groups: [] }];
    }
}
function scanMacUsers() {
    try {
        const passwd = fs_1.default.readFileSync('/etc/passwd', 'utf-8');
        const users = passwd.split('\n').filter(Boolean).map(line => {
            const [username, , uid] = line.split(':');
            return { username, uid: Number(uid), groups: [] };
        });
        // On macOS, human users usually have UID >= 501
        return users.filter(u => u.uid >= 501 && isLikelyHumanUser(u.username)).map(u => ({ username: u.username, groups: [] }));
    }
    catch {
        return [{ username: os_1.default.userInfo().username, groups: [] }];
    }
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
