const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const ratioOutput = document.getElementById('ratioValue');
const curveInfo = document.getElementById('curveInfo');
const statusMessage = document.getElementById('statusMessage');
const Rslider = document.getElementById('RRange');
const rslider = document.getElementById('rRange');
const dslider = document.getElementById('dRange');
const presetSelect = document.getElementById('presetSelect');

const defaults = { R: 70, r: 25, d: 35 };
const presets = {
  petal: { R: 70, r: 25, d: 35 },
  star: { R: 84, r: 12, d: 52 },
  lace: { R: 95, r: 38, d: 72 },
  orbit: { R: 72, r: 30, d: 25 }
};

function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function readSettingsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const values = {
    R: Number(params.get('R')),
    r: Number(params.get('r')),
    d: Number(params.get('d'))
  };
  if (Object.values(values).every(Number.isInteger) && values.R >= 20 && values.R <= 100 && values.r >= 1 && values.r < values.R && values.d >= 0 && values.d <= 100) {
    return values;
  }
  return null;
}

function setSettings(settings) {
  Rslider.value = String(settings.R);
  rslider.value = String(settings.r);
  dslider.value = String(settings.d);
  update();
}

function update() {
  const R = Number(Rslider.value);
  rslider.max = String(R - 1);
  if (Number(rslider.value) >= R) rslider.value = String(R - 1);

  const r = Number(rslider.value);
  const d = Number(dslider.value);
  document.getElementById('RValue').value = String(R);
  document.getElementById('rValue').value = String(r);
  document.getElementById('dValue').value = String(d);

  const divisor = gcd(R, r);
  const turns = r / divisor;
  ratioOutput.textContent = `${R / divisor} : ${r / divisor}`;
  curveInfo.textContent = `${turns} ${turns === 1 ? 'LOOP' : 'LOOPS'} TO CLOSE`;
  drawCurve(R, r, d, turns);
}

function drawCurve(R, r, d, turns) {
  const width = canvas.width;
  const height = canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);

  const maxRadius = Math.max(R - r + d, 1);
  const scale = (Math.min(width, height) * 0.43) / maxRadius;
  const end = 2 * Math.PI * turns;
  const steps = Math.max(1000, Math.ceil(end * 100));
  const gradient = ctx.createLinearGradient(-width * 0.42, -height * 0.42, width * 0.42, height * 0.42);
  gradient.addColorStop(0, '#ff6f91');
  gradient.addColorStop(0.2, '#ffbe55');
  gradient.addColorStop(0.4, '#a8e56a');
  gradient.addColorStop(0.6, '#59d5ce');
  gradient.addColorStop(0.8, '#7c91ff');
  gradient.addColorStop(1, '#df83ff');

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = (end * i) / steps;
    const x = ((R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t)) * scale;
    const y = ((R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t)) * scale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.1;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

function setPreset(name) {
  if (presets[name]) {
    setSettings(presets[name]);
    statusMessage.textContent = `${presetSelect.options[presetSelect.selectedIndex].text} preset loaded.`;
  }
}

async function copyDesignLink() {
  const url = new URL(window.location.href);
  url.searchParams.set('R', Rslider.value);
  url.searchParams.set('r', rslider.value);
  url.searchParams.set('d', dslider.value);
  try {
    await navigator.clipboard.writeText(url.toString());
    statusMessage.textContent = 'Design link copied. Anyone with the link can open these settings.';
  } catch {
    const temporaryInput = document.createElement('textarea');
    temporaryInput.value = url.toString();
    temporaryInput.setAttribute('readonly', '');
    temporaryInput.style.position = 'fixed';
    temporaryInput.style.opacity = '0';
    document.body.append(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand('copy');
    temporaryInput.remove();
    statusMessage.textContent = copied
      ? 'Design link copied. Anyone with the link can open these settings.'
      : 'Could not copy automatically. Copy the page URL and add your settings after publishing.';
  }
}

[Rslider, rslider, dslider].forEach((slider) => {
  slider.addEventListener('input', () => {
    presetSelect.value = 'custom';
    statusMessage.textContent = '';
    update();
  });
});

presetSelect.addEventListener('change', () => setPreset(presetSelect.value));
document.getElementById('resetButton').addEventListener('click', () => {
  presetSelect.value = 'petal';
  setSettings(defaults);
  statusMessage.textContent = 'Settings reset to the Petal garden preset.';
});
document.getElementById('savePNGbutton').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `orbit-R${Rslider.value}-r${rslider.value}-d${dslider.value}.png`;
  link.click();
  statusMessage.textContent = 'Your PNG is ready.';
});
document.getElementById('shareButton').addEventListener('click', copyDesignLink);

const sharedSettings = readSettingsFromUrl();
if (sharedSettings) {
  setSettings(sharedSettings);
  presetSelect.value = 'custom';
} else {
  setSettings(defaults);
}
