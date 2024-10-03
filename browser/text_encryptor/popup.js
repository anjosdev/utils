document.getElementById('encryptButton').addEventListener('click', async () => {
  const plaintext = document.getElementById('plaintext').value;

  // Define your symmetric key here (16 bytes for AES-128)
  const keyHex = '000102030405060708090A0B0C0D0E0F';
  const keyBytes = new Uint8Array(
    keyHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );

  // Import the key using the SubtleCrypto API
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Encode the plaintext
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate a random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  try {
    // Encrypt the data
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );

    // Combine IV and encrypted data
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    // Convert to Base64 for display
    const base64Encrypted = btoa(
      String.fromCharCode.apply(null, combined)
    );

    // Display the encrypted text
    document.getElementById('encryptedText').value = base64Encrypted;
  } catch (e) {
    console.error('Encryption failed', e);
    alert('Encryption failed. See console for details.');
  }
});

