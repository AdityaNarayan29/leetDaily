# Debugging LeetDaily Badge Update Issue

## Steps to Debug:

### 1. **Reload the Extension**
- Open `chrome://extensions/`
- Find "LeetDaily - Daily LeetCode Challenge"
- Click the reload button (circular arrow icon)

### 2. **Check Service Worker Console**
- On the same page (`chrome://extensions/`)
- Find your extension
- Click on "service worker" link (it's blue/underlined)
- This opens the background script console
- You should see logs like:
  ```
  [LeetDaily Background] Checking LeetCode API for completion...
  ```

### 3. **Check Content Script on LeetCode**
- Go to https://leetcode.com/problemset/
- Open DevTools (F12 or Cmd+Option+I)
- Go to Console tab
- You should see:
  ```
  [LeetDaily] Content script loaded on: https://leetcode.com/problemset/
  ```

### 4. **Test Badge Update**
- Go to today's daily challenge on LeetCode
- Submit a correct solution
- Watch the console for:
  ```
  [LeetDaily] "Accepted" detected in DOM!
  [LeetDaily] Sending startLoadingBlink message
  [LeetDaily] ✅ Daily challenge completed! Sending problemSolved message
  ```

### 5. **Check for Errors**
Look for any error messages in either console:
- Permission errors
- CORS errors
- "Extension context invalidated" (means you need to reload)
- Message passing errors

## Common Issues:

### Issue 1: Content script not loading
**Symptom**: No "[LeetDaily] Content script loaded" message
**Fix**:
- Check manifest.json has `content_scripts` section
- Reload extension
- Hard refresh LeetCode page (Cmd+Shift+R)

### Issue 2: Badge not blinking
**Symptom**: No response in service worker console
**Fix**:
- Check if service worker is running (should say "active")
- If it says "inactive", click "service worker" link to wake it up
- Check for errors in service worker console

### Issue 3: Messages not reaching background
**Symptom**: Content script logs show messages sent, but background doesn't receive
**Fix**:
- Extension context may be invalidated
- Reload the extension completely
- Close and reopen LeetCode tabs

### Issue 4: Already solved today
**Symptom**: Badge is already green
**Fix**:
- The code skips API checks if already solved
- Clear extension storage:
  - DevTools > Application tab > Storage > Extension Storage
  - Clear "lastVisitedDate"
  - Or wait until tomorrow

## Manual Test Commands:

### Test Loading Blink (from LeetCode page console):
```javascript
chrome.runtime.sendMessage({ action: "startLoadingBlink" }, response => {
  console.log('Response:', response);
});
```

### Test Problem Solved (from LeetCode page console):
```javascript
chrome.runtime.sendMessage({
  action: "problemSolved",
  data: {
    streak: 5,
    username: "testuser",
    avatar: "https://example.com/avatar.jpg"
  }
}, response => {
  console.log('Response:', response);
});
```

### Check Storage (from any console):
```javascript
chrome.storage.local.get(null, data => console.log(data));
```

## What Should Happen:

1. ✅ Content script loads when you visit LeetCode
2. ✅ MutationObserver watches for "Accepted" text
3. ✅ When detected, sends "startLoadingBlink" message
4. ✅ Badge starts blinking orange with streak number (300ms)
5. ✅ After 2 seconds, calls LeetCode API
6. ✅ If completed, sends "problemSolved" message
7. ✅ Badge stops blinking and turns solid green
8. ✅ Storage is updated with today's date

## Next Steps:

After following these steps, report back with:
1. What you see in the service worker console
2. What you see in the LeetCode page console
3. Any error messages
4. What happens to the badge when you solve a problem
