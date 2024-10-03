// contentScript.js

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "decryptText") {
    const keyBytesArray = message.keyBytes;
    try {
      const keyBytes = new Uint8Array(keyBytesArray);

      // Import the key
      let key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Get the selected text
      let selection = window.getSelection();
      if (!selection.rangeCount) {
        alert("No text selected.");
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText) {
        alert("No text selected.");
        return;
      }

      // Convert cipherText from base64 to ArrayBuffer
      let cipherBuffer = base64ToArrayBuffer(selectedText);

      // Assuming the IV is the first 12 bytes
      let iv = cipherBuffer.slice(0, 12);
      let data = cipherBuffer.slice(12);

      // Decrypt the data
      let decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        data
      );

      let decoder = new TextDecoder();
      let plaintext = decoder.decode(decrypted);

      // Replace the selected text with the plaintext
      replaceSelectedText(plaintext);
    } catch (e) {
      console.error(e);
      alert("Decryption failed: " + e.message);
    }
  }

  // Helper function to replace the selected text
  function replaceSelectedText(replacementText) {
    let selection = window.getSelection();
    if (!selection.rangeCount) return false;
    let range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(replacementText));
  }

  // Helper function to convert base64 to ArrayBuffer
  function base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
});
