function toggleInList(list, domain) {
  const index = list.indexOf(domain);
  if (index === -1) list.push(domain);
  else list.splice(index, 1);
  return list;
}

chrome.action.onClicked.addListener(async (tab) => {
  const domain = new URL(tab.url).hostname;

  // Ask the content script whether auto-detection would skip this site
  const [{ result: autoSkipped }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.documentElement.dataset.systemDarkModeAutoSkipped === "true",
  });

  const storage = await chrome.storage.local.get(["disabledDomains", "enabledDomains"]);
  const disabledDomains = storage.disabledDomains || [];
  const enabledDomains = storage.enabledDomains || [];

  if (autoSkipped) {
    toggleInList(enabledDomains, domain);
  } else {
    toggleInList(disabledDomains, domain);
  }

  await chrome.storage.local.set({ disabledDomains, enabledDomains });
  chrome.tabs.sendMessage(tab.id, { type: "toggle" });
});
