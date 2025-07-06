"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
describe('CLI', () => {
    it('should print help with no arguments', () => {
        const output = (0, child_process_1.execSync)('npx ts-node ./cli/index.ts').toString();
        expect(output).toMatch(/Usage: pbcli/);
    });
});
