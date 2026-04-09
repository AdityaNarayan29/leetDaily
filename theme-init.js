// Read theme before first paint — body hidden until resolved
document.documentElement.style.visibility = 'hidden';
chrome.storage.local.get(['theme'], (r) => {
  if (r.theme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
  document.documentElement.style.visibility = 'visible';
});
