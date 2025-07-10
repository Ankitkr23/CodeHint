document.addEventListener('DOMContentLoaded', function () {
    const hintButton = document.getElementById('get-hint-button');
    const timeComplexityButton = document.getElementById('get-time-complexity-button');
    const spaceComplexityButton = document.getElementById('get-space-complexity-button');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');
    const loadingDisplay = document.getElementById('loading');
  
    function showLoading() {
      if (loadingDisplay) loadingDisplay.style.display = 'block';
    }
  
    function hideLoading() {
      if (loadingDisplay) loadingDisplay.style.display = 'none';
    }

    function addMessageToChat(message, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `mb-4 p-4 rounded-2xl animate-fade-in ${isUser ? 'user-message' : 'ai-message'}`;
      
      const messageText = document.createElement('div');
      messageText.className = `text-sm ${isUser ? 'text-white font-medium' : 'text-white'} whitespace-pre-wrap leading-relaxed`;
      messageText.textContent = message;
      
      const timestamp = document.createElement('div');
      timestamp.className = `text-xs mt-2 ${isUser ? 'text-white/70' : 'text-white/60'}`;
      timestamp.textContent = new Date().toLocaleTimeString();
      
      messageDiv.appendChild(messageText);
      messageDiv.appendChild(timestamp);
      chatHistory.appendChild(messageDiv);
      
      // Scroll to bottom with smooth animation
      chatHistory.scrollTo({
        top: chatHistory.scrollHeight,
        behavior: 'smooth'
      });
      
      // Clear initial message if it exists
      const initialMessage = chatHistory.querySelector('.text-center');
      if (initialMessage && chatHistory.children.length > 1) {
        initialMessage.style.display = 'none';
      }
    }

    function showError(message) {
      addMessageToChat(`❌ Error: ${message}`);
    }

    async function extractCodeFromPage() {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tabId = tabs[0].id;
        
        const results = await chrome.scripting.executeScript({
          target: { tabId },
          func: function() {
            function extractCode() {
              let code = '';
              
              // Try specific selectors for different platforms
              const textareaSelectors = [
                'textarea[data-track-load="description_content"]', // LeetCode
                '.ace_text-input', // Ace Editor
                '#editor textarea', // Generic editor
                '.CodeMirror textarea', // CodeMirror
                'textarea[class*="editor"]', // Generic editor textarea
                'textarea[class*="code"]', // Code textarea
                '#solution_lang_txt', // GeeksforGeeks
                '.editor textarea' // Generic
              ];
              
              // Try textareas first
              for (const selector of textareaSelectors) {
                const textarea = document.querySelector(selector);
                if (textarea && textarea.value && textarea.value.trim()) {
                  code = textarea.value;
                  break;
                }
              }
              
              // Try Monaco Editor
              if (!code.trim() && window.monaco) {
                try {
                  const models = window.monaco.editor.getModels();
                  for (const model of models) {
                    const value = model.getValue();
                    if (value && value.trim()) {
                      code = value;
                      break;
                    }
                  }
                } catch (e) {
                  console.log('Monaco editor not accessible');
                }
              }
              
              // Try Ace Editor
              if (!code.trim() && window.ace) {
                try {
                  const editors = Object.values(window.ace.edit);
                  for (const editor of editors) {
                    if (editor && editor.getValue) {
                      const value = editor.getValue();
                      if (value && value.trim()) {
                        code = value;
                        break;
                      }
                    }
                  }
                } catch (e) {
                  console.log('Ace editor not accessible');
                }
              }
              
              // Try all textareas if no specific match
              if (!code.trim()) {
                const textareaSelectors = ['textarea'];
                for (const selector of textareaSelectors) {
                  const textarea = document.querySelector(selector);
                  if (textarea && textarea.value && textarea.value.trim()) {
                    code = textarea.value;
                    break;
                  }
                }
              }
              
              // Try CodeMirror
              if (!code.trim()) {
                const codeMirrorElements = document.querySelectorAll('.CodeMirror');
                for (const cm of codeMirrorElements) {
                  if (cm.CodeMirror && cm.CodeMirror.getValue) {
                    const value = cm.CodeMirror.getValue();
                    if (value && value.trim()) {
                      code = value;
                      break;
                    }
                  }
                }
              }
              
              // Try to find code in pre/code elements as last resort
              if (!code.trim()) {
                const codeElements = document.querySelectorAll('pre code, .hljs, .language-python, .language-java, .language-cpp, .language-javascript');
                for (const element of codeElements) {
                  const text = element.textContent || '';
                  if (text.trim().length > 50 && (text.includes('def ') || text.includes('function') || text.includes('class ') || text.includes('#include') || text.includes('public ') || text.includes('var ') || text.includes('let ') || text.includes('const '))) {
                    code = text;
                    break;
                  }
                }
              }
              
              return code.trim();
            }
            
            return extractCode();
          }
        });
        
        return results[0]?.result || '';
      } catch (error) {
        console.error('Error extracting code:', error);
        return '';
      }
    }

    async function makeRequest(requestType, userContext = '') {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tabUrl = tabs[0].url;
        
        console.log('Current tab URL:', tabUrl);
        
        const isSupported = tabUrl.includes('leetcode.com') || 
                          tabUrl.includes('geeksforgeeks.org') || 
                          tabUrl.includes('codeforces.com');
        
        if (!isSupported) {
          throw new Error('Please navigate to a supported coding platform (LeetCode, GeeksforGeeks, or Codeforces)');
        }
        
        // Extract question name
        let questionName = '';
        if (tabUrl.includes('leetcode.com/problems/')) {
          questionName = extractQuestionNameFromUrl(tabUrl);
        } else if (tabUrl.includes('geeksforgeeks.org')) {
          questionName = extractGFGQuestionName(tabUrl);
        } else if (tabUrl.includes('codeforces.com')) {
          questionName = extractCodeforcesQuestionName(tabUrl);
        }
        
        if (!questionName) {
          throw new Error('Could not identify the problem from the current page');
        }
        
        console.log('Extracting code from page...');
        const userCode = await extractCodeFromPage();
        
        // Show status about code extraction
        if (userCode) {
          addMessageToChat(`✅ Found ${userCode.split('\n').length} lines of code`);
        } else {
          addMessageToChat(`⚠️ No code found - giving general advice`);
        }
        
        console.log('Sending request:', { questionName, requestType, hasCode: !!userCode, codeLength: userCode?.length || 0 });
        
        const response = await fetch('http://localhost:3000/get-hint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            questionName, 
            userCode: userCode || undefined,
            requestType,
            userContext: userContext || undefined
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
          throw new Error(`Server error: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        return data.hint;
      } catch (error) {
        console.error('Request failed:', error);
        throw error;
      }
    }

    // Event Listeners
    if (hintButton) {
      hintButton.addEventListener('click', async function () {
        try {
          const context = userInput?.value?.trim() || '';
          showLoading();
          hintButton.disabled = true;
          hintButton.innerHTML = '<span class="animate-spin">⚡</span> Thinking...';
          
          if (context) {
            addMessageToChat(`💭 ${context}`, true);
          } else {
            addMessageToChat(`💡 Getting smart hint for your code...`, true);
          }
          
          const hint = await makeRequest('hint', context);
          addMessageToChat(hint);
          if (userInput) userInput.value = '';
        } catch (error) {
          showError(error.message);
        } finally {
          hideLoading();
          hintButton.disabled = false;
          hintButton.innerHTML = '<span class="emoji-bounce">💡</span> Get Smart Hint';
        }
      });
    }
    
    if (timeComplexityButton) {
      timeComplexityButton.addEventListener('click', async function () {
        try {
          const context = userInput?.value?.trim() || '';
          showLoading();
          timeComplexityButton.disabled = true;
          timeComplexityButton.innerHTML = '<span class="animate-spin">⚡</span> Analyzing...';
          
          addMessageToChat(`⏱️ Analyzing time complexity...`, true);
          const analysis = await makeRequest('time-complexity', context);
          addMessageToChat(analysis);
          if (userInput) userInput.value = '';
        } catch (error) {
          showError(error.message);
        } finally {
          hideLoading();
          timeComplexityButton.disabled = false;
          timeComplexityButton.innerHTML = '<span class="emoji-bounce">⏱️</span> Time O(?)';
        }
      });
    }
    
    if (spaceComplexityButton) {
      spaceComplexityButton.addEventListener('click', async function () {
        try {
          const context = userInput?.value?.trim() || '';
          showLoading();
          spaceComplexityButton.disabled = true;
          spaceComplexityButton.innerHTML = '<span class="animate-spin">⚡</span> Computing...';
          
          addMessageToChat(`💾 Evaluating space complexity...`, true);
          const analysis = await makeRequest('space-complexity', context);
          addMessageToChat(analysis);
          if (userInput) userInput.value = '';
        } catch (error) {
          showError(error.message);
        } finally {
          hideLoading();
          spaceComplexityButton.disabled = false;
          spaceComplexityButton.innerHTML = '<span class="emoji-bounce">💾</span> Space O(?)';
        }
      });
    }
    
    // Handle Enter key in textarea
    if (userInput) {
      userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          if (hintButton) hintButton.click();
        }
      });
    }
  });
  
  function extractQuestionNameFromUrl(url) {
    const match = url.match(/problems\/([^/]+)/);
    return match ? match[1] : null;
  }
  
  function extractGFGQuestionName(url) {
    const match = url.match(/geeksforgeeks\.org\/(.+?)(?:\/|$)/);
    return match ? match[1] : null;
  }
  
  function extractCodeforcesQuestionName(url) {
    const match = url.match(/codeforces\.com\/.*\/problem\/(.+)/);
    return match ? match[1] : null;
  }
