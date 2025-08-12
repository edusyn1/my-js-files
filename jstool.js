//js code
  function showNotification(msg, type = 'success') {
    const el = document.getElementById('notification');
    el.textContent = msg;
    el.style.backgroundColor = type === 'error' ? '#e9573f' : '#333';
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 2000);
  }

  function pasteCode() {
    navigator.clipboard.readText().then(text => {
      document.getElementById('js-input').value = text;
    }).catch(() => {
      document.getElementById('js-input').placeholder = "Press Ctrl+V to paste";
    });
  }

  function safeMinifyJS(jsCode) {
    try {
      let minified = jsCode
        .replace(/\/\/.*$/gm, '')             // Remove single line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')    // Remove multiline comments
        .replace(/\n|\r|\t/g, ' ')            // Remove new lines and tabs
        .replace(/\s+/g, ' ')                  // Remove extra spaces
        .replace(/\s*([{}();,:+=<>-])\s*/g, '$1') // Remove spaces around symbols
        .trim();

      return minified;
    } catch (e) {
      console.error('Minify error:', e);
      return null;
    }
  }

  function minifyJS() {
    const input = document.getElementById('js-input').value.trim();
    if (!input) return showNotification('Please enter some JavaScript first', 'error');

    const minified = safeMinifyJS(input);
    if (minified === null) {
      showNotification('Minify failed due to invalid JavaScript code', 'error');
      document.getElementById('original-copy').value = input;
      document.getElementById('js-output').value = input;
    } else {
      document.getElementById('original-copy').value = input;
      document.getElementById('js-output').value = minified;
    }

    document.getElementById('input-section').style.display = 'none';
    document.getElementById('output-section').style.display = 'block';
    showMinified();
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

  function copyJS() {
    const view = document.getElementById('minified-btn').classList.contains('active')
      ? document.getElementById('js-output')
      : document.getElementById('original-copy');
    view.select();
    document.execCommand('copy');
    showNotification('JavaScript copied to clipboard!');
  }

  function resetTool() {
    document.getElementById('js-input').value = '';
    document.getElementById('input-section').style.display = 'block';
    document.getElementById('output-section').style.display = 'none';
    document.getElementById('js-input').focus();
  }