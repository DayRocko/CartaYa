const fs = require('fs');
const file = 'dashboard.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');

console.log('--- DIAGNÓSTICO LÍNEAS 1940 - 1968 ---');
for (let i = 1939; i <= 1967; i++) {
    console.log(`${i + 1} | ${lines[i] ? lines[i].trim() : ''}`);
}

console.log('\n--- DIAGNÓSTICO FUNCIONES 1900 - 1970 ---');
const funcRegex = /function\s+\w+\s*\(/;
for (let i = 1899; i < 1969; i++) {
    if (funcRegex.test(lines[i])) {
        console.log(`${i + 1}: ${lines[i].trim()}`);
    }
}
