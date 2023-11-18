import 'dotenv/config'
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import OpenAI from "openai";
import { createAssistant, createLead } from './functions.js';
import { ASSISTANT_PROMPT, FUNCTION_NAMES, TOOLS } from './constant.js';

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant = await createAssistant(openai);

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enables CORS
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded bodies

// Routes
app.get('/start', async (_, res) => {
  const thread = await openai.beta.threads.create();
  console.log(assistant);
  res.json({ threadId: thread.id });
});

app.post('/chat', async (req, res, next) => {
  const { threadId, message } = req.body;
  if (!threadId) {
    res.status(500).on({ error: 'Thread ID isn\'t provided' });
  }

  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  })

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistant.id,
  });

  const retrieve = async () => {
    while (run.status !== "completed") {
      const keepRetrievingRun = await openai.beta.threads.runs.retrieve(threadId, run.id);

      console.log(`Run status: ${keepRetrievingRun.status}`);

      if (keepRetrievingRun.status === "completed") {
        console.log("\n");
        break;
      } else if (keepRetrievingRun.status === "requires_action") {
        for (const tool_call of keepRetrievingRun.required_action.submit_tool_outputs.tool_calls) {
          switch (tool_call.function.name) {
            
            case FUNCTION_NAMES.captureBuyLead:
              console.log('tool_call.function.name');
              console.log(tool_call.function.name);
              console.log('tool_call.function.arguments');
              console.log(tool_call.function.arguments);
              const { name, email, phoneNumber } = JSON.parse(tool_call.function.arguments);
              console.log('name, email, phoneNumber');
              console.log(name, email, phoneNumber);

              try {
                await createLead(name, email, phoneNumber);

                await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
                  tool_outputs: [
                    {
                      output: `Contact information ${name}, ${email} and ${phoneNumber} has be added successfully`,
                      tool_call_id: tool_call.id,
                    }
                  ]
                });

              } catch (e) {
                next(e);
              }

              break;
            default:
              next(`Function hasn't been provided: ${tool_call.function.name}`);
          }
        }
      }
    }
  };

  await retrieve();

  const messages = await openai.beta.threads.messages.list(threadId);
  const response = messages.data[0].content[0].text.value;

  res.json({ response });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).on({ error: 'Something is broken!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
