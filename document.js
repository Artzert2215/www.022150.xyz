//https://022150.xyz/document#docid:password

async function showError(description) {
    document.getElementById('content').innerHTML = `<p>An error occurred loadig the document:<br><b>${description}</b></p>`;
}

async function handleEncrypt() {
  const text = document.getElementById('htmlcontents').value;
  const password = document.getElementById('password').value;
  const encrypted = await encrypt(text, password);
  document.getElementById('base64bundle').value = `{"cipher": "${encrypted}"}`;
}

async function getDocumentNames() {
  const maxAge = 24 * 60 * 60 * 1000; //daily
  const cached = localStorage.getItem('document-list');
  const cachedTime = localStorage.getItem('document-list-time');

  if (cached && cachedTime && Date.now() - cachedTime < maxAge) {
    return JSON.parse(cached);
  } else {
    const res = await fetch('https://api.github.com/repos/Artzert2215/www.022150.xyz/contents/documents');
    if (!res.ok) {
      return false;
    }
    const files = await res.json();
    const list = files.filter(f => f.name.endsWith('.json')).map(f => f.name.replace('.json', ''));
    localStorage.setItem('document-list', JSON.stringify(list));
    localStorage.setItem('document-list-time', Date.now());
    return list;
  }
}

async function loadDocument() {
  // parse url
  const parts = window.location.hash.slice(1).split(':');
  if (!parts || parts == '') {
    let documentsHtml = ''
    const doclist = await getDocumentNames()
    if (doclist) {
      documentsHtml += '<p><b>List of existing documents:</b></p><ul>'
      doclist.forEach(doc => documentsHtml += `<li><a href="#" onclick="const password = prompt('Document password?'); if (!password) {return false;}; location.href=\`./document.html#${doc}:\${password}\`; location.reload(); return false;">${doc}</a></li>`);
      documentsHtml += '</ul>'
    }
    document.getElementById('content').innerHTML = `
    <p><b>Welcome to the document page!</b><br>
    You may request a document via the url (<code>/document#docid:password</code>).<br>
    Visit the <a href="./document.html#example:dummypassword" onclick="location.href=this.href; location.reload()">example document</a> to check out an example.<br>
    ${documentsHtml}
    You can also use the handy tool below to aid in the creation of new documents.</p>
    <p><b>Encryption tool:</b></p>
    <textarea id="htmlcontents" name="htmlcontents" cols="40" rows="5" placeholder="Enter the html contents of the document..."></textarea><br>
    <input type="text" id="password" name="password" placeholder="Enter a (secure) password..."><br>
    <button type="button" onclick="handleEncrypt();">Encrypt</button>
    <textarea id="base64bundle" name="base64bundle" cols="40" rows="5" placeholder="Output goes here..."></textarea><br>
    `;
    return;
  } else if (parts.length != 2) {
    showError("Invalid url, the accepted format is <code>/document#docid:password</code>.")
    return;
  }
  const docId = parts[0];
  const password = parts[1];

  // fetch document
  const res = await fetch(`./documents/${docId}.json`);
  if (!res.ok) {
    showError("Requested document does not exist or is not currently available.")
    return;
  }

  const { cipher } = await res.json();

  // decrypt
  try {
    const plaintext = await decrypt(cipher, password);
    document.getElementById('content').innerHTML = plaintext;
  } catch {
    showError("Decryption failed.")
    return;
  }
}

loadDocument();