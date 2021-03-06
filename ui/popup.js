/** @type chrome.tabs.Tab */
export let tab;

Promise.all([
  getSettings(),
  getActiveTab(),
  onDomLoaded(),
]).then(([
  settings,
  tab_,
]) => {
  tab = tab_;
  $.status.checked = settings.enabled !== false;
  $.status.onchange = toggle;
  $.openOptions.onclick = e => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  };
  renderStatus();
  import('./popup-load-more.js');
  import('./popup-exclude.js');
});

function renderStatus() {
  const enabled = $.status.checked;
  $.status.closest('[data-status]').dataset.status = enabled;
  $.statusText.textContent = i18n(enabled ? 'on' : 'off');
}

async function toggle() {
  inBG.writeSettings({
    ...await getSettings(),
    enabled: $.status.checked,
  });
  renderStatus();
}

function getActiveTab() {
  return new Promise(resolve =>
    chrome.tabs.query({active: true, currentWindow: true}, tabs =>
      resolve(tabs[0])));
}
