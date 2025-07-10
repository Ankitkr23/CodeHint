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
    
    // Enhanced logging
    console.log('\n=== New Request ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Question:', questionName);
    console.log('Request Type:', requestType || 'hint');
    console.log('Has User Code:', !!userCode);
    console.log('Code Length:', userCode ? userCode.length : 0);
    console.log('User Context:', userContext || 'none');
    console.log('==================');

    // Validate if questionName is provided
    if (!questionName) {
        console.error('❌ Error: No question name provided');
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
                if (userCode && userCode.trim()) {
                    prompt = `Code for "${formattedQuestion}":
\`\`\`
${userCode}
\`\`\`

Give a VERY SHORT hint (max 10-12 words) about what's missing or wrong. No explanations.`;
                } else {
                    prompt = `Problem: "${formattedQuestion}". Give a VERY SHORT hint (max 10-12 words) about the approach. No explanations.`;
                }
                if (userContext) {
                    prompt += ` Context: "${userContext}".`;
                }
                break;

            case 'time-complexity':
                if (userCode && userCode.trim()) {
                    prompt = `Code for "${formattedQuestion}":
\`\`\`
${userCode}
\`\`\`

Response format: "Time Complexity: O(n²)" - ONLY the Big O notation, no explanation.`;
                } else {
                    prompt = `Problem: "${formattedQuestion}". Response format: "Time Complexity: O(n)" - ONLY the Big O notation, no explanation.`;
                }
                if (userContext) {
                    prompt += ` Context: "${userContext}".`;
                }
                break;

            case 'space-complexity':
                if (userCode && userCode.trim()) {
                    prompt = `Code for "${formattedQuestion}":
\`\`\`
${userCode}
\`\`\`

Response format: "Space Complexity: O(1)" - ONLY the Big O notation, no explanation.`;
                } else {
                    prompt = `Problem: "${formattedQuestion}". Response format: "Space Complexity: O(n)" - ONLY the Big O notation, no explanation.`;
                }
                if (userContext) {
                    prompt += ` Context: "${userContext}".`;
                }
                break;

            case 'chat': // General chat
            default:
                prompt = `Question about "${formattedQuestion}": "${userContext}".`;
                if (userCode && userCode.trim()) {
                    prompt += ` Code:
\`\`\`
${userCode}
\`\`\`
`;
                }
                prompt += ` Give a concise answer (max 15 words).`;
                break;
        }

        console.log('🤖 Sending prompt to AI...');
        
        // Generate content using the AI model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text(); // Extract the generated text hint

        console.log('✅ AI Response received:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
        
        // Send the generated hint back to the client
        res.json({ hint: text }); // Still sending as 'hint' for consistency with frontend
    } catch (error) {
        // Enhanced error logging
        console.error('❌ Error generating response:');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
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
