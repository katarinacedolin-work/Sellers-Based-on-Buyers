/* QR Code, version 2, error correction M. Enough for a short ticket code. */
const QR_EXP = new Uint8Array(512);
const QR_LOG = new Uint8Array(256);
(() => {
  let value = 1;
  for (let i = 0; i < 255; i += 1) {
    QR_EXP[i] = value;
    QR_LOG[value] = i;
    value <<= 1;
    if (value & 0x100) value ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) QR_EXP[i] = QR_EXP[i - 255];
})();

const qrMul = (a, b) => (a && b ? QR_EXP[QR_LOG[a] + QR_LOG[b]] : 0);

function qrReedSolomon(data, eccCount) {
  const coefficients = new Uint8Array(eccCount);
  coefficients[eccCount - 1] = 1;
  let root = 1;
  for (let i = 0; i < eccCount; i += 1) {
    for (let j = 0; j < coefficients.length; j += 1) {
      coefficients[j] = qrMul(coefficients[j], root);
      if (j + 1 < coefficients.length) coefficients[j] ^= coefficients[j + 1];
    }
    root = qrMul(root, 0x02);
  }
  const result = new Uint8Array(eccCount);
  data.forEach((byte) => {
    const factor = byte ^ result[0];
    result.copyWithin(0, 1);
    result[result.length - 1] = 0;
    for (let i = 0; i < result.length; i += 1) result[i] ^= qrMul(coefficients[i], factor);
  });
  return result;
}

function qrDataCodewords(text) {
  const bytes = [...text].map((char) => char.charCodeAt(0) & 255);
  const bits = [];
  const push = (value, length) => {
    for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, 8);
  bytes.forEach((byte) => push(byte, 8));
  const capacity = 28 * 8;
  for (let i = 0; i < 4 && bits.length < capacity; i += 1) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const codewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let bit = 0; bit < 8; bit += 1) byte = (byte << 1) | bits[i + bit];
    codewords.push(byte);
  }
  for (let pad = 0; codewords.length < 28; pad += 1) codewords.push(pad % 2 ? 0x11 : 0xec);
  return codewords;
}

function qrFormatBits(mask) {
  const format = 0b00 << 3 | mask;
  let remainder = format << 10;
  for (let i = 4; i >= 0; i -= 1) {
    if (remainder & (1 << (i + 10))) remainder ^= 0x537 << i;
  }
  return ((format << 10) | remainder) ^ 0x5412;
}

function qrMatrix(text) {
  const size = 25;
  const modules = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const set = (row, col, dark) => {
    modules[row][col] = dark;
    reserved[row][col] = true;
  };
  const finder = (row, col) => {
    for (let y = -1; y <= 7; y += 1) {
      for (let x = -1; x <= 7; x += 1) {
        const yy = row + y;
        const xx = col + x;
        if (yy < 0 || xx < 0 || yy >= size || xx >= size) continue;
        const edge = x === -1 || y === -1 || x === 7 || y === 7;
        const box = x >= 0 && x <= 6 && y >= 0 && y <= 6 && (x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
        set(yy, xx, !edge && box);
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  for (let i = 8; i < size - 8; i += 1) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  const align = 18;
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      const edge = Math.max(Math.abs(x), Math.abs(y)) === 2 || (x === 0 && y === 0);
      set(align + y, align + x, edge);
    }
  }
  set(size - 8, 8, true);
  for (let i = 0; i < 9; i += 1) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }
  for (let i = 0; i < 8; i += 1) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }

  const codewords = qrDataCodewords(text);
  const ecc = qrReedSolomon(codewords, 16);
  const bits = [];
  [...codewords, ...ecc].forEach((byte) => {
    for (let i = 7; i >= 0; i -= 1) bits.push((byte >>> i) & 1);
  });
  for (let i = 0; i < 7; i += 1) bits.push(0);

  const masks = [
    (row, col) => (row + col) % 2 === 0,
    (row) => row % 2 === 0,
    (_, col) => col % 3 === 0,
    (row, col) => (row + col) % 3 === 0,
    (row, col) => (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0,
    (row, col) => ((row * col) % 2) + ((row * col) % 3) === 0,
    (row, col) => (((row * col) % 2) + ((row * col) % 3)) % 2 === 0,
    (row, col) => (((row + col) % 2) + ((row * col) % 3)) % 2 === 0
  ];

  const place = (mask) => {
    const grid = modules.map((row) => row.slice());
    let index = 0;
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col = 5;
      for (let rowStep = 0; rowStep < size; rowStep += 1) {
        const upward = ((col + 1) & 2) === 0;
        const row = upward ? size - 1 - rowStep : rowStep;
        for (let offset = 0; offset < 2; offset += 1) {
          const xx = col - offset;
          if (reserved[row][xx]) continue;
          const bit = index < bits.length ? bits[index] : 0;
          index += 1;
          grid[row][xx] = Boolean(bit) !== mask(row, xx);
        }
      }
    }
    return grid;
  };

  const penalty = (grid) => {
    let score = 0;
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        let run = 1;
        while (col + run < size && grid[row][col + run] === grid[row][col]) run += 1;
        if (run >= 5) score += run - 2;
        let down = 1;
        while (row + down < size && grid[row + down][col] === grid[row][col]) down += 1;
        if (down >= 5) score += down - 2;
        if (row + 1 < size && col + 1 < size) {
          const color = grid[row][col];
          if (grid[row][col + 1] === color && grid[row + 1][col] === color && grid[row + 1][col + 1] === color) score += 3;
        }
      }
    }
    const dark = grid.flat().filter(Boolean).length;
    score += Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10;
    return score;
  };

  let best = null;
  let bestScore = Infinity;
  let bestMask = 0;
  masks.forEach((mask, index) => {
    const grid = place(mask);
    const score = penalty(grid);
    if (score < bestScore) {
      best = grid;
      bestScore = score;
      bestMask = index;
    }
  });

  const format = qrFormatBits(bestMask);
  const bitAt = (index) => Boolean((format >>> index) & 1);
  for (let i = 0; i <= 5; i += 1) best[i][8] = bitAt(i);
  best[7][8] = bitAt(6);
  best[8][8] = bitAt(7);
  best[8][7] = bitAt(8);
  for (let i = 9; i < 15; i += 1) best[8][14 - i] = bitAt(i);
  for (let i = 0; i < 8; i += 1) best[8][size - 1 - i] = bitAt(i);
  for (let i = 8; i < 15; i += 1) best[size - 15 + i][8] = bitAt(i);
  best[size - 8][8] = true;
  return best;
}

function qrSvg(text) {
  const grid = qrMatrix(text);
  const quiet = 2;
  const cells = [];
  grid.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (dark) cells.push(`<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1"/>`);
    });
  });
  const size = grid.length + quiet * 2;
  return `<svg class="ticket-qr" viewBox="0 0 ${size} ${size}" role="img" aria-label="Ticket QR code">${cells.join("")}</svg>`;
}
