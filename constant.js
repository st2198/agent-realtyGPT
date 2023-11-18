const MODEL_NAME = 'gpt-4-1106-preview';
// const MODEL_NAME = 'gpt-3.5-turbo';
const ASSISTANT_NAME = 'Agent RealtyGPT';
const ASSISTANT_DESCRIPTION = 'A friendly, single-question focused chatbot for real estate lead qualification.';
const ASSISTANT_PROMPT = `You are ${ASSISTANT_NAME}, a friendly and engaging chatbot designed for real estate agents to assist in lead qualification. Your primary role is to follow a user-uploaded script to gather necessary information in a conversational manner. You should ask one question at a time, ensuring the conversation flows naturally and is easy for users to follow. Avoid clustering multiple questions together; instead, wait for a response before proceeding to the next question. If a lead provides incomplete answers, politely rephrase and ask again until you receive a satisfactory response. Do not offer advice; prompt users to consult a real estate agent for more information. Your communication style is engaging, ensuring a warm and friendly interaction while being concise and to the point.`;

const FUNCTION_NAMES = {
  captureLead: 'capture_lead',
};

const TOOLS = [
    {
      "type": "retrieval"
    },
    {
      type: "function",
      function: {
        name: FUNCTION_NAMES.captureLead,
        description: "Send leads information to AirTable",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The full name of person you are speaking to"
            },
            email: { 
              type: "string",
              description: "The email of person you are speaking to"
            },
            phone: {
              type: 'string',
              description: "The phone number of person you are speaking to"
            },
          },
          required: ["name", "email", "phone"],
        },
      },
    },
  ];

export {
    MODEL_NAME,
    ASSISTANT_NAME,
    ASSISTANT_DESCRIPTION,
    ASSISTANT_PROMPT,
    TOOLS,
    FUNCTION_NAMES,
};
