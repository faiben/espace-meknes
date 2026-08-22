const fs = require('fs');
const buf = fs.readFileSync('src/data/index.ts');
const text = buf.toString('utf8');

// Find the Arabic section
const idx = text.indexOf('\u00d8\u00a7');
if (idx >= 0) {
  const chunk = buf.slice(Math.max(0,idx-5), idx+50);
  console.log('Raw bytes:', Array.from(chunk).map(b=>'0x'+b.toString(16).padStart(2,'0')).join(' '));
  const chars = text.substring(Math.max(0,idx-5), idx+20);
  console.log('Char codes:', chars.split('').map(c=>'U+'+c.charCodeAt(0).toString(16).padStart(4,'0')).join(' '));
}

// Try: read as utf8, then for each byte in the original buffer, check if it's a double-encoded sequence
// The file was originally UTF-8, then treated as CP1252 and re-encoded to UTF-8
// So we need: UTF-8 decode -> CP1252 encode -> UTF-8 decode
try {
  const cp1252 = Buffer.from(text, 'binary');
  const fixed = cp1252.toString('utf8');
  console.log('\n--- binary approach ---');
  console.log('Sample:', fixed.substring(0, 300));
  console.log('Has Arabic:', /[\u0627-\u064a]/.test(fixed));
} catch(e) {
  console.log('binary error:', e.message);
}
