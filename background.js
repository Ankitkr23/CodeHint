chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      const supportedSites = [
        'leetcode.com/problems/',
        'geeksforgeeks.org',
        'codeforces.com'
      ];
      
      if (supportedSites.some(site => tab.url.includes(site))) {
        chrome.storage.local.set({ currentURL: tab.url });
      }
    }
  });
  
  // Handle extension icon click to ensure popup works
  chrome.action.onClicked.addListener((tab) => {
    // This is handled by the popup, but we can add any additional logic here
    console.log('Extension clicked on tab:', tab.url);
  });
  