import 'dotenv/config'
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import OpenAI from "openai";
import { createAssistant, captureBuyLead, captureSellLead, captureRentLead } from './functions.js';
import { FUNCTION_NAMES } from './constant.js';

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
              const {
                name,
                email,
                phoneNumber,
                whenReady,
                workWithAgent,
                committedWithAgent,
                rentOrOwn,
                planningToSell,
                firstTimeHomeBuyer,
                freeHomeEvaluation,
                homeTitle,
                priceRange,
                size,
                bedrooms,
                bathrooms,
                specificFeatures,
                paymentType,
                preApprovedLender,
                workWithBroker,
              } = JSON.parse(tool_call.function.arguments);

              try {
                await captureBuyLead(
                  name,
                  email,
                  phoneNumber,
                  whenReady,
                  workWithAgent,
                  committedWithAgent,
                  rentOrOwn,
                  planningToSell,
                  firstTimeHomeBuyer,
                  freeHomeEvaluation,
                  homeTitle,
                  priceRange,
                  size,
                  bedrooms,
                  bathrooms,
                  specificFeatures,
                  paymentType,
                  preApprovedLender,
                  workWithBroker
                );

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
              case FUNCTION_NAMES.captureSellLead:
                const sellArgs = JSON.parse(tool_call.function.arguments);

                try {
                  await captureSellLead(sellArgs);

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
                case FUNCTION_NAMES.captureRentLead:
                const rentArgs = JSON.parse(tool_call.function.arguments);

                try {
                  await captureRentLead(rentArgs);

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
