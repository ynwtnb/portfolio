// Zero-phase second-order-section filtering, matching scipy.signal.sosfiltfilt
// (odd extension padding + sosfilt_zi initial conditions). Filter coefficients
// and zi are precomputed in Python and shipped in filters.json.

function sosfilt(sos, x, zi) {
  const n = x.length;
  const y = new Float64Array(n);
  let input = x;
  for (let s = 0; s < sos.length; s++) {
    const [b0, b1, b2, , a1, a2] = sos[s];
    let z0 = zi[s][0];
    let z1 = zi[s][1];
    const out = s === sos.length - 1 ? y : new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const xi = input[i];
      const yi = b0 * xi + z0;
      z0 = b1 * xi - a1 * yi + z1;
      z1 = b2 * xi - a2 * yi;
      out[i] = yi;
    }
    input = out;
  }
  return y;
}

function scaledZi(zi, v) {
  return zi.map(([a, b]) => [a * v, b * v]);
}

export function sosfiltfilt(sos, zi, x) {
  let ntaps = 2 * sos.length + 1;
  const zerosB = sos.filter((r) => r[2] === 0).length;
  const zerosA = sos.filter((r) => r[5] === 0).length;
  ntaps -= Math.min(zerosB, zerosA);
  const padlen = 3 * ntaps;
  const n = x.length;
  if (n <= padlen) return Float64Array.from(x);

  const ext = new Float64Array(n + 2 * padlen);
  for (let i = 0; i < padlen; i++) ext[i] = 2 * x[0] - x[padlen - i];
  for (let i = 0; i < n; i++) ext[padlen + i] = x[i];
  for (let i = 0; i < padlen; i++) ext[padlen + n + i] = 2 * x[n - 1] - x[n - 2 - i];

  const fwd = sosfilt(sos, ext, scaledZi(zi, ext[0]));
  fwd.reverse();
  const bwd = sosfilt(sos, fwd, scaledZi(zi, fwd[0]));
  bwd.reverse();
  return bwd.subarray(padlen, padlen + n);
}
