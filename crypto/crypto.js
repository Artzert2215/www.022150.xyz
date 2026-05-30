async function encrypt(plaintext, password) {
  const enc = new TextEncoder();
  
  // password -> key
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );

  // create content bundle
  const bundle = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, 16);
  bundle.set(new Uint8Array(encrypted), 28);
  
  return btoa(String.fromCharCode(...bundle));
}

async function decrypt(base64Bundle, password) {
  // decode content bundle
  const enc = new TextEncoder();
  const bundle = Uint8Array.from(atob(base64Bundle), c => c.charCodeAt(0));

  const salt = bundle.slice(0, 16);
  const iv = bundle.slice(16, 28);
  const ciphertext = bundle.slice(28);

  // password -> key
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}