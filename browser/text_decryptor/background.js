// background.js

// Define your symmetric key here (16 bytes for AES-128)
const keyHex = '000102030405060708090A0B0C0D0E0F';
const keyBytes = new Uint8Array(
  keyHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
);

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "decryptText",
    title: "Decrypt Selected Text",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "decryptText") {
    chrome.tabs.sendMessage(tab.id, {
      action: "decryptText",
      keyBytes: Array.from(keyBytes)
    });
  }
});

