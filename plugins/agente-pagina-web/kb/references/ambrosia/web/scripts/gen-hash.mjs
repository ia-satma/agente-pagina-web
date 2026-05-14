#!/usr/bin/env node
/**
 * Genera un hash bcrypt para una contraseña.
 * Uso:
 *   pnpm run gen-hash "tuPasswordAqui"
 * Output: pega el hash completo (incluyendo $2b$...) en .env como AUTH_PASS_HASH
 */
import bcrypt from 'bcryptjs';

const plain = process.argv[2];

if (!plain) {
  console.error('Uso: pnpm run gen-hash "<password>"');
  console.error('Ejemplo: pnpm run gen-hash "MiPasswordSegura123!"');
  process.exit(1);
}

if (plain.length < 8) {
  console.error('⚠  La contraseña debe tener al menos 8 caracteres.');
  process.exit(1);
}

const hash = bcrypt.hashSync(plain, 12);
const b64 = Buffer.from(hash, 'utf8').toString('base64');

console.log('');
console.log('───────────────────────────────────────────────────────');
console.log('  Hash generado — pega en .env o Replit Secrets:');
console.log('───────────────────────────────────────────────────────');
console.log('');
console.log('  AUTH_PASS_HASH_B64=' + b64);
console.log('');
console.log('───────────────────────────────────────────────────────');
console.log('  (alternativa — solo si tu sistema no expande $ en env:');
console.log('   AUTH_PASS_HASH=' + hash + ')');
console.log('───────────────────────────────────────────────────────');
console.log('');
console.log('NUNCA commitees la password en texto plano.');
console.log('');
