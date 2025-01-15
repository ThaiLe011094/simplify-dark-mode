let tabStates = {};

chrome.action.onClicked.addListener((tab) => {
    const tabId = tab.id;

    const currentState = tabStates[tabId] || false; // default to light mode
    const newState = !currentState;
    tabStates[tabId] = newState;

    const newIcon = newState
        ? { 128: "src/dark.png" }
        : { 128: "src/light.png" };

    chrome.action.setIcon({ tabId, path: newIcon });

    if (newState) {
        chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                document.querySelector('html').style.filter = 'invert(1) hue-rotate(180deg)';
            },
        });
    } else {
        chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                document.querySelector('html').style.filter = '';
            },
        });
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    const isDarkMode = tabStates[tabId] || false;

    const iconPath = isDarkMode
        ? { 128: "src/dark.png" }
        : { 128: "src/light.png" };

    chrome.action.setIcon({ tabId, path: iconPath });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const isDarkMode = tabStates[tabId] || false;

        const iconPath = isDarkMode
            ? { 128: "src/dark.png" }
            : { 128: "src/light.png" };

        chrome.action.setIcon({ tabId, path: iconPath });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabStates[tabId];
});
