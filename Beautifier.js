/* ---------- Helper: Notification ---------- */
  function notify(msg, type='success') {
    const el = document.getElementById('notification');
    el.textContent = msg;
    el.style.backgroundColor = type === 'error' ? '#e9573f' : '#333';
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 2000);
  }

  /* ---------- Bottom Tab Switch ---------- */
  function switchPane(which) {
    const isCSS = which === 'css';
    document.getElementById('pane-css').style.display = isCSS ? 'block' : 'none';
    document.getElementById('pane-js').style.display   = isCSS ? 'none'  : 'block';
    document.getElementById('tab-css').classList.toggle('active', isCSS);
    document.getElementById('tab-js').classList.toggle('active', !isCSS);
  }

  /* ===========================================================
     ===============   CSS BEAUTIFIER (Own Logic)   =============
     =========================================================== */

  function cssPaste() {
    navigator.clipboard.readText().then(txt => {
      document.getElementById('css-input').value = txt;
    }).catch(() => {
      document.getElementById('css-input').placeholder = "Press Ctrl+V to paste";
    });
  }

  function cssFormat(css) {
    // Keep comments, add newlines/indentation, tidy spaces after ':' and before '{'
    let out = '';
    let indent = 0;
    const indentStr = () => '  '.repeat(indent);
    let i = 0, inStr = false, strChar = '', inComment = false;

    while (i < css.length) {
      const ch = css[i];
      const next2 = css.slice(i, i+2);

      if (!inStr && !inComment && (ch === '"' || ch === "'")) { inStr = true; strChar = ch; out += ch; i++; continue; }
      if (inStr) { out += ch; if (ch === strChar && css[i-1] !== '\\') inStr = false; i++; continue; }

      if (!inComment && next2 === '/*') { inComment = true; out += '\n' + indentStr() + '/*'; i += 2; continue; }
      if (inComment) { 
        out += ch; 
        if (next2 === '*/') { out += '/'; inComment = false; i += 2; out += '\n' + indentStr(); continue; }
        i++; continue; 
      }

      if (ch === '{') {
        // tidy selector line
        out = out.replace(/\s+$/,''); 
        out += ' {\n';
        indent++;
        out += indentStr();
      } else if (ch === '}') {
        indent = Math.max(0, indent - 1);
        out = out.replace(/\s+$/,''); 
        out += '\n' + indentStr() + '}\n' + indentStr();
      } else if (ch === ';') {
        out = out.replace(/\s*:\s*/g, ': ');
        out += ';\n' + indentStr();
      } else if (ch === '\n' || ch === '\r' || ch === '\t') {
        // compress whitespace
        if (!/\s$/.test(out)) out += ' ';
      } else {
        out += ch;
      }
      i++;
    }

    // Cleanup: collapse extra blank lines and spaces
    out = out
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s*{\s*\n/g, ' {\n')
      .replace(/\n\s*\}/g, '\n}');

    return out.trim() + '\n';
  }

  function beautifyCSS() {
    const input = document.getElementById('css-input').value;
    if (!input.trim()) return notify('Please enter some CSS first', 'error');

    const beautified = cssFormat(input);
    document.getElementById('css-original-copy').value = input;
    document.getElementById('css-output').value = beautified;

    document.getElementById('css-input-section').style.display = 'none';
    document.getElementById('css-output-section').style.display = 'block';
    cssShowBeautified();
    notify('CSS Beautified!');
  }

  function cssShowOriginal() {
    document.getElementById('css-original-view').style.display = 'block';
    document.getElementById('css-beautified-view').style.display = 'none';
    document.getElementById('css-original-btn').classList.add('active');
    document.getElementById('css-beautified-btn').classList.remove('active');
  }

  function cssShowBeautified() {
    document.getElementById('css-original-view').style.display = 'none';
    document.getElementById('css-beautified-view').style.display = 'block';
    document.getElementById('css-original-btn').classList.remove('active');
    document.getElementById('css-beautified-btn').classList.add('active');
  }

  function cssCopy() {
    const isBeautified = document.getElementById('css-beautified-btn').classList.contains('active');
    const ta = isBeautified ? document.getElementById('css-output') : document.getElementById('css-original-copy');
    ta.select(); document.execCommand('copy'); notify('CSS copied!');
  }

  function cssDownload() {
    const isBeautified = document.getElementById('css-beautified-btn').classList.contains('active');
    const content = (isBeautified ? document.getElementById('css-output') : document.getElementById('css-original-copy')).value;
    const blob = new Blob([content], {type: 'text/css;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = isBeautified ? 'beautified.css' : 'original.css';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }

  function cssReset() {
    document.getElementById('css-input').value = '';
    document.getElementById('css-input-section').style.display = 'block';
    document.getElementById('css-output-section').style.display = 'none';
    document.getElementById('css-input').focus();
  }

  /* ===========================================================
     ===============   JS BEAUTIFIER (Own Logic)    =============
     =========================================================== */

  function jsPaste() {
    navigator.clipboard.readText().then(txt => {
      document.getElementById('js-input').value = txt;
    }).catch(() => {
      document.getElementById('js-input').placeholder = "Press Ctrl+V to paste";
    });
  }

  function jsFormat(code) {
    // Light-weight formatter: respects strings/comments, indents blocks, newlines after ; { }, spaces around keywords
    let out = '';
    let indent = 0;
    const IND = () => '  '.repeat(indent);

    let i = 0, len = code.length;
    let inStr = false, strChar = '', inSL = false, inML = false, inRegex = false, escape = false;

    function push(ch) { out += ch; }

    while (i < len) {
      let ch = code[i], nxt = code[i+1];

      // Handle start/end of comments
      if (!inStr && !inRegex && !inSL && !inML && ch === '/' && nxt === '/') { inSL = true; push('\n' + IND()); push('//'); i+=2; continue; }
      if (!inStr && !inRegex && !inSL && !inML && ch === '/' && nxt === '*') { inML = true; push('\n' + IND()); push('/*'); i+=2; continue; }
      if (inSL) { push(ch); if (ch === '\n') { inSL = false; push(IND()); } i++; continue; }
      if (inML) { push(ch); if (ch === '*' && nxt === '/') { push('/'); i+=2; inML=false; push('\n' + IND()); } else { i++; } continue; }

      // Strings & regex
      if (!inStr && !inRegex && (ch === '"' || ch === "'" || ch === '`')) { inStr = true; strChar = ch; push(ch); i++; escape=false; continue; }
      if (inStr) { push(ch); if (escape) { escape=false; } else if (ch === '\\') { escape=true; } else if (ch === strChar) { inStr=false; } i++; continue; }

      // heuristic regex start: after = ( { , : ; or line start
      if (!inRegex && ch === '/' && /[=({[:,;!?\n]\s*$/.test(out.slice(-20))) {
        // Also avoid comment starters handled above
        inRegex = true; push(ch); i++; escape=false; continue;
      }
      if (inRegex) { push(ch); if (escape) { escape=false; } else if (ch === '\\') { escape=true; } else if (ch === '/') { inRegex=false; } i++; continue; }

      // Structural tokens
      if (ch === '{') { 
        out = out.replace(/[ \t]+$/,'');
        push(' {\n'); indent++; push(IND()); i++; continue; 
      }
      if (ch === '}') { 
        indent = Math.max(0, indent-1);
        out = out.replace(/[ \t]+$/,'');
        push('\n' + IND() + '}\n' + IND()); i++; continue; 
      }
      if (ch === ';') { push(';\n' + IND()); i++; continue; }
      if (ch === '\n' || ch === '\r' || ch === '\t') { 
        // collapse whitespace
        if (!/\s$/.test(out)) push(' ');
        i++; continue; 
      }
      if (ch === '(' || ch === '[') { push(ch); i++; continue; }
      if (ch === ')' || ch === ']') { push(ch); i++; continue; }

      // Space around keywords/operators light pass
      if (/\s/.test(ch)) { 
        if (!/\s$/.test(out)) push(' ');
        i++; continue;
      }

      push(ch);
      i++;
    }

    // Tidy: one blank line max, trim trailing spaces
    out = out
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+$/gm, '');

    // Add indentation on top-level lines if missing
    return out.trim() + '\n';
  }

  function beautifyJS() {
    const input = document.getElementById('js-input').value;
    if (!input.trim()) return notify('Please enter some JavaScript first', 'error');

    const beautified = jsFormat(input);
    document.getElementById('js-original-copy').value = input;
    document.getElementById('js-output').value = beautified;

    document.getElementById('js-input-section').style.display = 'none';
    document.getElementById('js-output-section').style.display = 'block';
    jsShowBeautified();
    notify('JS Beautified!');
  }

  function jsShowOriginal() {
    document.getElementById('js-original-view').style.display = 'block';
    document.getElementById('js-beautified-view').style.display = 'none';
    document.getElementById('js-original-btn').classList.add('active');
    document.getElementById('js-beautified-btn').classList.remove('active');
  }

  function jsShowBeautified() {
    document.getElementById('js-original-view').style.display = 'none';
    document.getElementById('js-beautified-view').style.display = 'block';
    document.getElementById('js-original-btn').classList.remove('active');
    document.getElementById('js-beautified-btn').classList.add('active');
  }

  function jsCopy() {
    const isBeautified = document.getElementById('js-beautified-btn').classList.contains('active');
    const ta = isBeautified ? document.getElementById('js-output') : document.getElementById('js-original-copy');
    ta.select(); document.execCommand('copy'); notify('JavaScript copied!');
  }

  function jsDownload() {
    const isBeautified = document.getElementById('js-beautified-btn').classList.contains('active');
    const content = (isBeautified ? document.getElementById('js-output') : document.getElementById('js-original-copy')).value;
    const blob = new Blob([content], {type: 'application/javascript;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = isBeautified ? 'beautified.js' : 'original.js';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }

  function jsReset() {
    document.getElementById('js-input').value = '';
    document.getElementById('js-input-section').style.display = 'block';
    document.getElementById('js-output-section').style.display = 'none';
    document.getElementById('js-input').focus();
  }
  
  (function(){var _0xdomains=["edusynth.in","www.edusynth.in"],_0xcur=window.location.hostname.toLowerCase(),_0xallowed=_0xdomains.some(function(d){return _0xcur.indexOf(d)!==-1});_0xallowed?(function _0xtool(){console.log("Tool fully running!");/* Tumhara asli JS code */})():(console.log("Tool disabled: wrong domain or code tampered."),setTimeout(function(){window.location.href="https://www.edusynth.in"},2000));})();