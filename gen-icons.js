// Gera icon-192.png e icon-512.png sem dependências externas (PNG RGBA puro)
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---- CRC32 ----
const tabelaCRC = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  tabelaCRC[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = tabelaCRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(tipo, dados) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(dados.length);
  const corpo = Buffer.concat([Buffer.from(tipo, 'ascii'), dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([len, corpo, crc]);
}

function gerarPNG(largura, altura, pixelFn) {
  const linhas = Buffer.alloc(altura * (1 + largura * 4));
  let p = 0;
  for (let y = 0; y < altura; y++) {
    linhas[p++] = 0; // filtro: nenhum
    for (let x = 0; x < largura; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      linhas[p++] = r; linhas[p++] = g; linhas[p++] = b; linhas[p++] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8;  // profundidade
  ihdr[9] = 6;  // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(linhas, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ---- Desenho: pata branca sobre gradiente teal ----
function dentroPata(sx, sy, S) {
  // mesma pata do logo do site, em coordenadas de 64x64
  const u = (sx / S) * 64, v = (sy / S) * 64;
  const dentro = (cx, cy, rx, ry) => ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2 <= 1;
  // 3 dedos
  if (dentro(18, 24.5, 7.2, 9.2)) return true;
  if (dentro(32, 17.5, 7.2, 9.2)) return true;
  if (dentro(46, 24.5, 7.2, 9.2)) return true;
  // palma
  if (dentro(32, 45.5, 16, 11.5)) return true;
  return false;
}

function pixelArt(x, y, S) {
  // sobreamostragem 3x3 para suavizar bordas
  let acertos = 0;
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      if (dentroPata(x + (i + 0.5) / 3, y + (j + 0.5) / 3, S)) acertos++;
    }
  }
  // gradiente vertical de fundo: #14b8a6 -> #0f766e
  const t = y / S;
  const bg = [Math.round(20 + (15 - 20) * t), Math.round(184 + (118 - 184) * t), Math.round(166 + (110 - 166) * t)];
  if (acertos === 0) return [...bg, 255];
  // mistura com branco conforme a cobertura
  const cob = acertos / 9;
  const mix = (b) => Math.round(b + (255 - b) * cob);
  return [mix(bg[0]), mix(bg[1]), mix(bg[2]), 255];
}

const saida = path.join(__dirname, '..', 'petshop-pwa');
fs.mkdirSync(saida, { recursive: true });
for (const S of [192, 512]) {
  fs.writeFileSync(path.join(saida, `icon-${S}.png`), gerarPNG(S, S, (x, y) => pixelArt(x, y, S)));
  console.log(`icon-${S}.png gerado`);
}
