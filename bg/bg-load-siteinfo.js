export function loadBuiltinSiteinfo() {
  return Promise.all([
    fetch('/siteinfo.json').then(r => r.json()),
    idb.execRW().clear().then(() =>
      idb.execRW({store: 'urlCache'}).clear()),
  ]).then(([si]) => loadSiteinfo(si));
}

export async function loadSiteinfo(si, fnCanWrite) {
  cache.clear();
  cacheUrls.length = 0;
  cacheUrlsRE.length = 0;
  globalRules = {};
  const utf8 = new TextEncoder();
  let /** @type IDBObjectStore */ store, op;
  for (let i = 0; i < si.length; i++) {
    const rule = si[i];
    const {url} = rule;
    cacheUrls.push(url);
    cache.set(i, rule);
    if (isGlobalUrl(url))
      globalRules[i] = rule;
    if (fnCanWrite && !fnCanWrite(rule))
      continue;
    if (!store)
      store = await idb.execRW().RAW;
    const {createdAt, ...toWrite} = rule;
    toWrite.url = utf8.encode(String.fromCharCode(createdAt + 32) + url);
    toWrite.index = i;
    op = store.put(toWrite);
  }
  setCacheDate();
  chrome.storage.local.set({globalRules});
  if (op) {
    return new Promise((resolve, reject) => {
      op.onsuccess = resolve;
      op.onerror = reject;
    });
  }
}
