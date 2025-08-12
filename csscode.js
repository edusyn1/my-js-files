let originalCSS = '';

function minifyCSS() {
  const input = document.getElementById('css-input').value.trim();
  if (!input) return showNotification('Please enter some CSS first', 'error');

  originalCSS = input;
  let output = input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/;\s*}/g, '}')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/}/g, '}\n');

  document.getElementById('original-copy').value = originalCSS;
  document.getElementById('css-output').value = output;
  document.getElementById('input-section').style.display = 'none';
  document.getElementById('output-section').style.display = 'block';
  showMinified();
}

function pasteCode() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('css-input').value = text;
  }).catch(() => {
    document.getElementById('css-input').placeholder = "Press Ctrl+V to paste";
  });
}

function showOriginal() {
  document.getElementById('original-view').style.display = 'block';
  document.getElementById('minified-view').style.display = 'none';
  document.getElementById('original-btn').classList.add('active');
  document.getElementById('minified-btn').classList.remove('active');
}

function showMinified() {
  document.getElementById('original-view').style.display = 'none';
  document.getElementById('minified-view').style.display = 'block';
  document.getElementById('original-btn').classList.remove('active');
  document.getElementById('minified-btn').classList.add('active');
}

function copyCSS() {
  const view = document.getElementById('minified-btn').classList.contains('active')
    ? document.getElementById('css-output')
    : document.getElementById('original-copy');
  view.select();
  document.execCommand('copy');
  showNotification('CSS copied to clipboard!');
}

function resetTool() {
  document.getElementById('css-input').value = '';
  document.getElementById('input-section').style.display = 'block';
  document.getElementById('output-section').style.display = 'none';
  document.getElementById('css-input').focus();
}

function showNotification(msg, type = 'success') {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.style.backgroundColor = type === 'error' ? '#e9573f' : '#333';
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 2000);
}