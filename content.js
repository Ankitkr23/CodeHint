// Content script for extracting code from coding platforms
(function() {
    'use strict';
    
    // Wait for page to load and editors to initialize
    function waitForEditor() {
        return new Promise((resolve) => {
            // If editors are already available, resolve immediately
            if ((window.monaco && window.monaco.editor && window.monaco.editor.getEditors().length > 0) ||
                (window.ace && document.querySelectorAll('.ace_editor').length > 0) ||
                document.querySelectorAll('.CodeMirror').length > 0 ||
                document.querySelectorAll('textarea[name*="code"], textarea[id*="code"]').length > 0) {
                resolve();
                return;
            }
            
            // Otherwise, wait up to 5 seconds for editors to load
            let attempts = 0;
            const maxAttempts = 25; // 5 seconds (200ms * 25)
            
            const checkInterval = setInterval(() => {
                attempts++;
                
                if ((window.monaco && window.monaco.editor && window.monaco.editor.getEditors().length > 0) ||
                    (window.ace && document.querySelectorAll('.ace_editor').length > 0) ||
                    document.querySelectorAll('.CodeMirror').length > 0 ||
                    document.querySelectorAll('textarea[name*="code"], textarea[id*="code"]').length > 0 ||
                    attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 200);
        });
    }
    
    // Function to extract code from LeetCode
    async function extractLeetCodeCode() {
        await waitForEditor();
        
        let code = '';
        
        // Method 1: Try to get Monaco Editor instance directly
        if (window.monaco && window.monaco.editor) {
            const editors = window.monaco.editor.getEditors();
            if (editors && editors.length > 0) {
                // Get the first editor (usually the main code editor)
                const editor = editors[0];
                code = editor.getValue();
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 2: Try to find Monaco editor through DOM and access its model
        const monacoEditor = document.querySelector('.monaco-editor');
        if (monacoEditor) {
            // Try to access the editor instance through React fiber
            const reactKey = Object.keys(monacoEditor).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('_reactInternalFiber'));
            if (reactKey) {
                let fiber = monacoEditor[reactKey];
                while (fiber) {
                    if (fiber.memoizedProps && fiber.memoizedProps.editor && typeof fiber.memoizedProps.editor.getValue === 'function') {
                        code = fiber.memoizedProps.editor.getValue();
                        if (code.trim()) return code.trim();
                    }
                    fiber = fiber.return;
                }
            }
            
            // Method 3: Try to get from DOM data attributes or properties
            if (monacoEditor._editor && typeof monacoEditor._editor.getValue === 'function') {
                code = monacoEditor._editor.getValue();
                if (code.trim()) return code.trim();
            }
            
            // Method 4: Try to find textarea within Monaco (fallback)
            const textarea = monacoEditor.querySelector('textarea');
            if (textarea && textarea.value) {
                code = textarea.value;
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 5: Try textarea selectors
        const textareaSelectors = [
            'textarea[data-mode-id]',
            'textarea[autocomplete="off"]',
            '#editor textarea',
            '.monaco-editor textarea',
            'textarea[class*="monaco"]'
        ];
        
        for (const selector of textareaSelectors) {
            const textarea = document.querySelector(selector);
            if (textarea && textarea.value) {
                code = textarea.value;
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 6: CodeMirror fallback
        const codeMirror = document.querySelector('.CodeMirror');
        if (codeMirror && codeMirror.CodeMirror) {
            code = codeMirror.CodeMirror.getValue();
            if (code.trim()) return code.trim();
        }
        
        // Method 7: Try global variables that might contain editor instances
        if (typeof window.editor !== 'undefined' && window.editor && typeof window.editor.getValue === 'function') {
            code = window.editor.getValue();
            if (code.trim()) return code.trim();
        }
        
        // Method 8: Look for specific LeetCode global variables
        if (window.leetcode || window.LC) {
            const lc = window.leetcode || window.LC;
            if (lc.editor && typeof lc.editor.getValue === 'function') {
                code = lc.editor.getValue();
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 9: Last resort - visible content (original method but improved)
        if (monacoEditor) {
            const viewLines = monacoEditor.querySelector('.view-lines');
            if (viewLines) {
                const lines = viewLines.querySelectorAll('.view-line');
                code = Array.from(lines).map(line => {
                    const text = line.textContent || '';
                    return text;
                }).join('\n');
                if (code.trim()) return code.trim();
            }
        }
        
        return code.trim();
    }
    
    // Function to extract code from GeeksforGeeks
    async function extractGFGCode() {
        await waitForEditor();
        
        let code = '';
        
        // Method 1: Try Monaco Editor API
        if (window.monaco && window.monaco.editor) {
            const editors = window.monaco.editor.getEditors();
            if (editors && editors.length > 0) {
                code = editors[0].getValue();
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 2: Try various GFG selectors
        const selectors = [
            'textarea[name="code"]',
            '#code-area textarea',
            '.code-container textarea',
            '.monaco-editor textarea',
            'textarea[class*="code"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.value) {
                code = element.value;
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 3: CodeMirror
        const codeMirror = document.querySelector('.CodeMirror');
        if (codeMirror && codeMirror.CodeMirror) {
            code = codeMirror.CodeMirror.getValue();
            if (code.trim()) return code.trim();
        }
        
        // Method 4: Monaco Editor DOM (fallback)
        const monacoEditor = document.querySelector('.monaco-editor');
        if (monacoEditor) {
            // Try to access editor instance
            if (monacoEditor._editor && typeof monacoEditor._editor.getValue === 'function') {
                code = monacoEditor._editor.getValue();
                if (code.trim()) return code.trim();
            }
            
            // Last resort - visible lines
            const viewLines = monacoEditor.querySelector('.view-lines');
            if (viewLines) {
                const lines = viewLines.querySelectorAll('.view-line');
                code = Array.from(lines).map(line => line.textContent || '').join('\n');
            }
        }
        
        return code.trim();
    }
    
    // Function to extract code from Codeforces
    async function extractCodeforcesCode() {
        await waitForEditor();
        
        let code = '';
        
        // Method 1: Try specific Codeforces selectors
        const selectors = [
            '#sourceCodeTextarea',
            'textarea[name="sourceCode"]',
            '#program-source-text',
            '.ace_editor',
            'textarea[class*="source"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.value) {
                code = element.value;
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 2: Try ACE Editor
        if (window.ace) {
            const aceEditors = document.querySelectorAll('.ace_editor');
            for (const aceEditor of aceEditors) {
                if (aceEditor.env && aceEditor.env.editor) {
                    code = aceEditor.env.editor.getValue();
                    if (code.trim()) return code.trim();
                }
            }
        }
        
        // Method 3: Monaco Editor
        if (window.monaco && window.monaco.editor) {
            const editors = window.monaco.editor.getEditors();
            if (editors && editors.length > 0) {
                code = editors[0].getValue();
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 4: Monaco DOM fallback
        const monacoEditor = document.querySelector('.monaco-editor');
        if (monacoEditor) {
            if (monacoEditor._editor && typeof monacoEditor._editor.getValue === 'function') {
                code = monacoEditor._editor.getValue();
                if (code.trim()) return code.trim();
            }
            
            const viewLines = monacoEditor.querySelector('.view-lines');
            if (viewLines) {
                const lines = viewLines.querySelectorAll('.view-line');
                code = Array.from(lines).map(line => line.textContent || '').join('\n');
            }
        }
        
        return code.trim();
    }
    
    // Generic function to extract code from any editor
    function extractGenericCode() {
        let code = '';
        
        // Method 1: Monaco Editor API (most reliable)
        if (window.monaco && window.monaco.editor) {
            const editors = window.monaco.editor.getEditors();
            if (editors && editors.length > 0) {
                code = editors[0].getValue();
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 2: ACE Editor
        if (window.ace) {
            const aceEditors = document.querySelectorAll('.ace_editor');
            for (const aceEditor of aceEditors) {
                if (aceEditor.env && aceEditor.env.editor) {
                    code = aceEditor.env.editor.getValue();
                    if (code.trim()) return code.trim();
                }
            }
        }
        
        // Method 3: CodeMirror
        const codeMirrors = document.querySelectorAll('.CodeMirror');
        for (const cm of codeMirrors) {
            if (cm.CodeMirror) {
                code = cm.CodeMirror.getValue();
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 4: Common textarea selectors
        const textareaSelectors = [
            'textarea[name*="code"]',
            'textarea[id*="code"]',
            'textarea[class*="code"]',
            'textarea[data-mode-id]',
            'textarea[autocomplete="off"]',
            '.monaco-editor textarea',
            '#editor textarea'
        ];
        
        for (const selector of textareaSelectors) {
            const textarea = document.querySelector(selector);
            if (textarea && textarea.value) {
                code = textarea.value;
                if (code.trim()) return code.trim();
            }
        }
        
        // Method 5: Monaco Editor through DOM
        const monacoEditors = document.querySelectorAll('.monaco-editor');
        for (const monacoEditor of monacoEditors) {
            if (monacoEditor._editor && typeof monacoEditor._editor.getValue === 'function') {
                code = monacoEditor._editor.getValue();
                if (code.trim()) return code.trim();
            }
        }
        
        return code.trim();
    }

    // Main function to extract code based on current site
    function extractCodeFromCurrentSite() {
        const url = window.location.href;
        let code = '';
        
        // Try site-specific extraction first
        if (url.includes('leetcode.com')) {
            code = extractLeetCodeCode();
        } else if (url.includes('geeksforgeeks.org')) {
            code = extractGFGCode();
        } else if (url.includes('codeforces.com')) {
            code = extractCodeforcesCode();
        }
        
        // If site-specific extraction didn't work, try generic extraction
        if (!code.trim()) {
            code = extractGenericCode();
        }
        
        return code.trim();
    }
    
    // Expose function globally for popup to use
    window.extractCodeFromPage = extractCodeFromCurrentSite;
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'extractCode') {
            // Return true to indicate we'll send response asynchronously
            waitForEditor().then(() => {
                const code = extractCodeFromCurrentSite();
                console.log('CodeHint: Extracted code length:', code.length);
                if (code.length > 0) {
                    console.log('CodeHint: First 100 chars:', code.substring(0, 100));
                } else {
                    console.log('CodeHint: No code found. Trying to detect available editors...');
                    
                    // Debug: Log available editors
                    if (window.monaco && window.monaco.editor) {
                        console.log('CodeHint: Monaco editors found:', window.monaco.editor.getEditors().length);
                    }
                    if (window.ace) {
                        console.log('CodeHint: ACE editors found:', document.querySelectorAll('.ace_editor').length);
                    }
                    console.log('CodeHint: CodeMirror instances found:', document.querySelectorAll('.CodeMirror').length);
                    console.log('CodeHint: Textareas found:', document.querySelectorAll('textarea').length);
                    console.log('CodeHint: Monaco editor divs found:', document.querySelectorAll('.monaco-editor').length);
                }
                sendResponse({ code: code });
            });
            return true; // Keep the message channel open for async response
        }
    });
})();
