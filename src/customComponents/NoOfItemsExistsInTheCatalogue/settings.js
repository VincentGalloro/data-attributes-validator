// settings.js
// Utility for getting/setting index_key in chrome.storage

export function getIndexKey() {
  return new Promise((resolve) => {
    if (!chrome?.storage?.local) return resolve(undefined);
    chrome.storage.local.get(['index_key'], (result) => {
      resolve(result.index_key);
    });
  });
}

export function setIndexKey(key) {
  return new Promise((resolve, reject) => {
    if (!chrome?.storage?.local) {
      console.error('chrome.storage.local not available');
      return resolve();
    }
    chrome.storage.local.set({ index_key: key }, function() {
      if (chrome.runtime.lastError) {
        console.error('Error saving index_key:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log('index_key saved:', key);
        resolve();
      }
    });
  });
}
