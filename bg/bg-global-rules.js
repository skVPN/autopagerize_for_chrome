export async function buildGlobalRules() {
  globalRules = {};
  const index = /** @type IDBIndex */ await idb.exec({index: 'index'}).RAW;
  await new Promise((resolve, reject) => {
    const op = index.openCursor(null, 'prev');
    op.__ucs2 = new TextDecoder();
    op.__resolve = resolve;
    op.onsuccess = processCursor;
    op.onerror = reject;
  });
  chrome.storage.local.set({globalRules});
}

function processCursor({target: op}) {
  const cursor = /** @type IDBCursorWithValue */ op.result;
  if (cursor) {
    const url = op.__ucs2.decode(cursor.primaryKey).slice(1);
    if (isGlobalUrl(url)) {
      globalRules[cursor.key] = cursor.value;
      cursor.value.url = url;
      cursor.continue();
      return;
    }
  }
  op.__resolve();
}
