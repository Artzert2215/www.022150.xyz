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

async function loadDocument() {
  // parse url
  const parts = window.location.hash.slice(1).split(':');
  if (!parts || parts == '') {
    document.getElementById('content').innerHTML = `
    <p><b>Welcome to the document page!</b><br>
    You may request a document via the url (<code>/document#docid:password</code>).<br>
    Visit the <a href="./document.html#example:dummypassword" onclick="location.href=this.href; location.reload()">example document</a> to check out an example.<br>
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