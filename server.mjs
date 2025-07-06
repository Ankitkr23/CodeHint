// server.mjs

// Import necessary modules using ES module syntax
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module specific fixes for __filename and __dirname if needed elsewhere
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Verify API key is present
if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set in your .env file!');
    console.error("Please create a .env file in the same directory as server.mjs and add GEMINI_API_KEY='YOUR_API_KEY_HERE'");
    process.exit(1); // Exit if API key is missing
}

// Initialize Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware to enable CORS for all origins (for development purposes)
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Define the POST endpoint for getting hints, solutions, and complexity analysis
app.post('/get-hint', async (req, res) => {
    // Extract questionName, userCode, requestType, and userContext from the request body
    const { questionName, userCode, requestType, userContext } = req.body;
    console.log('Received Request:', { questionName, requestType, hasCode: !!userCode, userContext });

    // Validate if questionName is provided
    if (!questionName) {
        return res.status(400).json({ error: 'No question name provided' });
    }

    try {
        // Format question name for the prompt (e.g., "two-sum" becomes "two sum")
        const formattedQuestion = questionName.split('-').join(' ');

        // Get the generative model
        // Using gemini-1.5-flash as it was previously confirmed to be working
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = '';

        // Construct the prompt based on request type and presence of user code
        switch (requestType) {
            case 'hint':
                prompt = `I am working on the LeetCode problem titled "${formattedQuestion}".`;
                if (userCode) {
                    prompt += ` My current code attempt is:\n\`\`\`\n${userCode}\n\`\`\`\n`;
                    prompt += `Please provide a very concise hint (max 10 words) that helps me move forward, focusing on my existing code if possible. Do NOT provide the full solution or intuition. Just a small nudge.`;
                } else {
                    prompt += ` I haven't written any code yet. Please provide a very concise hint (max 10 words) for solving this problem. Do NOT provide the full solution or intuition. Just a small nudge.`;
                }
                if (userContext) {
                    prompt += ` Additional context: "${userContext}".`;
                }
                prompt += ` Hint:`;
                break;


            case 'time-complexity':
                prompt = `I am working on the LeetCode problem titled "${formattedQuestion}".`;
                if (userCode) {
                    prompt += ` My current code attempt is:\n\`\`\`\n${userCode}\n\`\`\`\n`;
                    prompt += `Analyze the time complexity of the provided code for this problem. Explain it concisely using Big O notation.`;
                } else {
                    prompt += ` What is the typical time complexity for solving the LeetCode problem "${formattedQuestion}"? Explain it concisely using Big O notation.`;
                }
                if (userContext) {
                    prompt += ` Additional context: "${userContext}".`;
                }
                prompt += ` Time Complexity:`;
                break;

            case 'space-complexity':
                prompt = `I am working on the LeetCode problem titled "${formattedQuestion}".`;
                if (userCode) {
                    prompt += ` My current code attempt is:\n\`\`\`\n${userCode}\n\`\`\`\n`;
                    prompt += `Analyze the space complexity of the provided code for this problem. Explain it concisely using Big O notation.`;
                } else {
                    prompt += ` What is the typical space complexity for solving the LeetCode problem "${formattedQuestion}"? Explain it concisely using Big O notation.`;
                }
                if (userContext) {
                    prompt += ` Additional context: "${userContext}".`;
                }
                prompt += ` Space Complexity:`;
                break;

            case 'chat': // General chat
            default:
                prompt = `The user is asking a general question about the LeetCode problem "${formattedQuestion}". User's input: "${userContext}".`;
                if (userCode) {
                    prompt += ` They also provided their code: \n\`\`\`\n${userCode}\n\`\`\`\n`;
                }
                prompt += ` Please respond concisely to their query.`;
                break;
        }

        // Generate content using the AI model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text(); // Extract the generated text hint

        console.log('Successfully generated response:', text);
        // Send the generated hint back to the client
        res.json({ hint: text }); // Still sending as 'hint' for consistency with frontend
    } catch (error) {
        // Log the full error for debugging on the server side
        console.error('Error details:', error);
        // Send an error response to the client
        res.status(500).json({
            error: 'Error generating response', // More generic error message
            details: error.message // Provide error details for debugging
        });
    }
});

// Add a basic health check endpoint for verifying server status
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server and listen on the specified port
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
