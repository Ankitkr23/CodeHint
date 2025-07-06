CodeHint AI 🤖💡
Your Smart Coding Assistant for LeetCode, GeeksforGeeks, and Codeforces!
![alt text](image.png)

CodeHint AI is a powerful Chrome Extension that provides instant, AI-powered hints, solution approaches, and complexity analysis directly on your favorite coding platforms. Stuck on a problem? Get a nudge without spoiling the fun!

✨ Features
Intelligent Hints: Get concise hints tailored to your current problem, even considering your existing code.

Solution Approaches: Understand high-level algorithms and step-by-step logic for problems.

Time Complexity Analysis: Instantly analyze the time complexity of your code or a typical solution.

Space Complexity Analysis: Get insights into the space complexity of your code or a typical solution.

Code Detection: Automatically extracts your code from popular online editors (LeetCode, GFG, Codeforces) to provide context-aware help.

Interactive Chatbot UI: A sleek, multicolor interface with dark mode toggle for a pleasant user experience.

🚀 Getting Started
Follow these steps to set up and run CodeHint AI locally.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS recommended): Download from nodejs.org.

npm (comes with Node.js): Verify with npm -v in your terminal.

Google Generative AI API Key: Obtain one from Google AI Studio.

Installation & Setup
1. Clone the Repository
First, clone this repository to your local machine:

git clone https://github.com/Ankitkr23/CodeHint.git # Replace with your actual repo URL
cd CodeHint

2. Backend Server Setup
The extension communicates with a local Node.js server to interact with the Google Generative AI.

a.  Install Backend Dependencies:
Navigate to the root of your CodeHint directory (where server.mjs and its package.json are located) and install the dependencies:

```bash
npm install
```

b.  Configure API Key:
Create a file named .env in the same directory as server.mjs. Add your Google Generative AI API key to this file:

```
GEMINI_API_KEY="YOUR_ACTUAL_GOOGLE_GENERATIVE_AI_API_KEY"
```
**Replace `YOUR_ACTUAL_GOOGLE_GENERATIVE_AI_API_KEY` with the API key you obtained from Google AI Studio.**

c.  Start the Backend Server:
Run the server from the same directory:

```bash
npm start
```
You should see `Server is running on http://localhost:3000` in your terminal. Keep this terminal open while using the extension.

3. Frontend Extension Build (if using Vite/React)
If your project includes a frontend build process (e.g., using Vite/React, as suggested by previous conversations), you'll need to build the extension files.

a.  Install Frontend Dependencies:
If your frontend has a separate package.json (or if it's in the same root, run npm install again to ensure all dev dependencies are installed):

```bash
npm install
```

b.  Build the Extension:

```bash
npm run build
```
This will create a `dist` folder containing the compiled extension files.

4. Load into Chrome
Now, load the extension into your Chrome browser:

a.  Open Chrome Extensions:
Open your Chrome browser and navigate to chrome://extensions.

b.  Enable Developer Mode:
Toggle on the "Developer mode" switch, usually found in the top right corner.

c.  Load Unpacked Extension:
Click the "Load unpacked" button.

d.  Select Extension Folder:
Browse to your CodeHint directory.
* If you performed the frontend build step (Step 3), select the dist folder inside your CodeHint directory.
* If you don't have a build step, select the main CodeHint directory itself.

e.  Pin the Extension (Optional):
Click the puzzle piece icon next to your address bar, then click the pin icon next to "CodeHint AI" to pin it to your toolbar for easy access.

💡 Usage
Navigate to a Problem Page: Go to any problem page on LeetCode (leetcode.com/problems/), GeeksforGeeks (geeksforgeeks.org/), or Codeforces (codeforces.com/).

Open the Extension: Click on the CodeHint AI icon in your browser toolbar.

Interact:

Type your code into the problem editor on the webpage.

Click "Get Hint" for a small nudge.

Click "Get Solution" for a high-level approach.

Click "Time Complexity" to analyze the time complexity of your code or the problem.

Click "Space Complexity" to analyze the space complexity of your code or the problem.

You can also type general questions into the input box and press Enter for a chat response.

Dark Mode: Use the moon/sun toggle button in the top right corner to switch between light and dark themes.

Scroll to Top: Use the floating arrow button in the bottom right to quickly scroll to the top of the chat history.

✏️ Editing the Code
This project is designed for easy local development and customization.

Frontend (HTML/CSS/JS):

You can directly edit popup.html (for UI structure and basic styling), popup.js (for frontend logic and interaction), and any associated CSS files.

After making changes, if you have a build step (like Vite), run npm run build again.

Then, reload the extension in Chrome (chrome://extensions -> refresh icon for CodeHint AI). Your changes will be reflected immediately.

Backend (Node.js Server):

Edit server.mjs to modify how hints are generated, add new API endpoints, or change AI model interaction.

After making changes, you must restart your backend server (Ctrl + C then npm start) for the changes to take effect.

This "edit" process is fundamental to how browser extensions and Node.js applications are developed. You modify the source files, rebuild (if necessary), and then reload the application to see your changes.

🤝 Contributing
Contributions are welcome! If you have suggestions or improvements, please feel free to:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Make your changes.

Commit your changes (git commit -m 'Add new feature').

Push to the branch (git push origin feature/your-feature).

Open a Pull Request.

📄 License
This project is licensed under the ISC License - see the LICENSE file for details.

Made with ❤️ by Your Name/Community