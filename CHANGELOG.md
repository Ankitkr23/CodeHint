# Changelog

All notable changes to CodeHint AI will be documented in this file.

## [2.0.1] - 2025-01-11

### 🔧 Fixed
- **Button Functionality**: Fixed all buttons not working due to empty `popup.js` file
- **Event Handlers**: Added complete event handling for all three main buttons:
  - 💡 Get Smart Hint
  - ⏱️ Time O(?) - Time Complexity Analysis  
  - 💾 Space O(?) - Space Complexity Analysis
- **Code Extraction**: Enhanced code detection with 7+ extraction methods
- **Error Handling**: Improved error messages and user feedback
- **Server Integration**: Fixed client-server communication issues

### 🚀 Added
- **Environment Template**: Added `.env.example` for easy setup
- **Setup Guide**: Comprehensive `SETUP.md` with step-by-step instructions
- **Gitignore**: Proper `.gitignore` to exclude sensitive files
- **License**: MIT License for open source compliance
- **Changelog**: This file to track all changes

### 🎨 Enhanced
- **UI Responsiveness**: All buttons now provide visual feedback during operations
- **Loading States**: Added proper loading indicators for better UX
- **Error Display**: Clear error messages shown in chat interface
- **Code Detection**: Enhanced extraction for Monaco, ACE, CodeMirror editors

### 📱 Platform Support
- ✅ LeetCode - Full support with Monaco API integration
- ✅ GeeksforGeeks - Enhanced textarea detection
- ✅ Codeforces - ACE Editor + textarea compatibility

## [2.0.0] - 2025-01-10

### ✨ Initial Release
- **Smart Hints**: AI-powered coding hints based on your code
- **Complexity Analysis**: Time and space complexity evaluation
- **Multi-Platform**: Support for major competitive programming sites
- **Modern UI**: Glassmorphic design with smooth animations
- **Privacy First**: Local processing with minimal data sharing

---

### 🐛 Known Issues
- Requires valid Gemini API key for functionality
- Server must be running on localhost:3000
- Some platforms may require page refresh for code detection

### 🔮 Upcoming Features
- Support for more coding platforms
- Offline mode capabilities
- Advanced code suggestions
- Performance optimizations
