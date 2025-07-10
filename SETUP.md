# 🛠️ SETUP GUIDE

This guide will help you set up CodeHint AI Chrome Extension locally.

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Google Chrome Browser**
- **Gemini API Key** ([Get yours free](https://ai.google.dev/))

## 🚀 Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ankitkr23/CodeHint.git
cd CodeHint
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Copy the environment template
cp .env.example .env

# Edit .env file and add your API key
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Start the Server
```bash
# Start the server
npm start

# You should see: "Server is running on http://localhost:3000"
```

### 5. Load Chrome Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `CodeHint` folder
5. The extension should now appear in your toolbar

## 🧪 Testing

### Test Server Health
Open your browser and visit: `http://localhost:3000/health`
You should see: `{"status":"ok","timestamp":"..."}`

### Test Extension
1. Go to any supported platform:
   - [LeetCode](https://leetcode.com/problems/)
   - [GeeksforGeeks](https://www.geeksforgeeks.org/)
   - [Codeforces](https://codeforces.com/)

2. Write some code in the editor

3. Click the CodeHint AI icon in your toolbar

4. Test the buttons:
   - 💡 **Get Smart Hint**
   - ⏱️ **Time O(?)**
   - 💾 **Space O(?)**

## 🔧 Troubleshooting

### Extension Not Working?
- Check if the server is running on port 3000
- Verify your API key in `.env` file
- Reload the extension in `chrome://extensions/`

### Server Errors?
- Check if your API key is valid
- Ensure dependencies are installed (`npm install`)
- Check console logs for detailed error messages

### Code Not Being Detected?
- Wait 2-3 seconds after page load
- Ensure you're on a supported platform
- Check browser console for "CodeHint:" messages

## 📝 Supported Platforms

- ✅ LeetCode (`leetcode.com`)
- ✅ GeeksforGeeks (`geeksforgeeks.org`)  
- ✅ Codeforces (`codeforces.com`)

## 🆘 Need Help?

1. Check the [FAQ section](README.md#faq) in the main README
2. Open an [issue](https://github.com/Ankitkr23/CodeHint/issues) on GitHub
3. Ensure you've followed all setup steps correctly

---

**Happy Coding! 🚀**
