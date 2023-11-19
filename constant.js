const MODEL_NAME = 'gpt-4-1106-preview';
// const MODEL_NAME = 'gpt-3.5-turbo-1106';
const ASSISTANT_NAME = 'Agent RealtyGPT';
const ASSISTANT_DESCRIPTION = 'Script-following chatbot for real estate lead qualification.';
const ASSISTANT_PROMPT = `You are ${ASSISTANT_NAME}, a friendly and engaging chatbot designed for real estate agents to assist in lead qualification. Your primary role is to follow a specific user-uploaded script to gather necessary information in a conversational manner. This script guides you through a series of questions to determine if a lead is interested in buying, renting, or selling a property, and includes various scenarios based on the lead's responses. You should ask one question at a time, following the script's flow, ensuring the conversation is natural and easy for users to follow. If a lead provides incomplete answers, politely rephrase and ask again until you receive a satisfactory response. Do not offer advice; prompt users to consult a real estate agent for more information. Your communication style is engaging, ensuring a warm and friendly interaction while being concise and to the point.`;

const FUNCTION_NAMES = {
  captureBuyLead: 'capture_lead_buy',
};

const TOOLS = [
  {
    "type": "code_interpreter"
  },
  {
    type: "function",
    function: {
      name: FUNCTION_NAMES.captureBuyLead,
      description: "Send buy leads information to AirTable",
      parameters: {
        type: "object",
        properties: {
          whenReady: {
            type: 'string',
            description: "How soon is lead ready to buy a property?. If more than 6 months, say good bye."
          },
          workWithAgent: {
            type: 'string',
            description: "Ask if lead work with any other agents",
            enum: ['Yes', 'No'],
          },
          committedWithAgent: {
            type: 'string',
            description: "if lead work with agent, ask if sign the BRA/Buyer representation agreement, Form 300, and & Working with Realtor, Form 810 with the Agent. If yes, end the chat",
            enum: ['Yes', 'No'],
          },
          rentOrOwn: {
            type: 'string',
            description: 'Ask a lead if they are owning a property or renting',
            enum: ['Rent', 'Own'],
          },
          planningToSell: {
            type: 'string',
            description: 'Ask a lead if they are planning to seel the property. Ask only in case they own they a property',
            enum: ['Yes', 'No'],
          },
          firstTimeHomeBuyer: {
            type: 'string',
            description: 'Ask if a lead is a first time home buyer',
            enum: ['Yes', 'No'],
          },
          freeHomeEvaluation: {
            type: 'string',
            description: 'If a lead plans to sell a property, ask if a lead wants a free home evaluation',
            enum: ['Yes', 'No'],
          },
          homeTitle: {
            type: 'string',
            description: 'Ask who\'s on your home title',
          },
          priceRange: {
            type: 'string',
            description: 'Ask lead what\'s their ideal price range for a property they want to buy'
          },
          size: {
            type: 'string',
            description: 'Ask lead how squere feet are they looking for. Make sure it\'s not too small',
          },
          bedrooms: {
            type: 'number',
            description: 'Ask lead how many bedrooms would be ideal for them'
          },
          bathrooms: {
            type: 'number',
            description: 'Ask lead how many bathrooms would be ideal for them'
          },
          specificFeatures: {
            type: 'string',
            description: 'Ask lead about any specific features are they looking to be ideal in their property'
          },
          paymentType: {
            type: 'string',
            description: 'Ask lead how are they going to pay? Cash or Mortgage',
            enum: ['Cash', 'Mortgage'],
          },
          preApprovedLender: {
            type: 'string',
            description: 'Ask lead if there are preapproved by lender if a lead uses mortagage',
            enum: ['Yes', 'No'],
          },
          workWithBroker: {
            type: 'string',
            description: 'Ask lead if they had the opportunity to speak with a mortgage broker. if a lead uses mortagage',
            enum: ['Yes', 'No'],
          },
          name: {
            type: "string",
            description: "The full name of lead you are speaking to"
          },
          email: {
            type: "string",
            description: "The email of lead you are speaking to"
          },
          phone: {
            type: 'string',
            description: "The phone number of lead you are speaking to"
          },

        },
        required: [
          "name", 
          "email", 
          "phone", 
          "whenReady", 
          "workWithAgent", 
          "committedWithAgent", 
          "rentOrOwn", 
          "planningToSell",
          "firstTimeHomeBuyer",
          "freeHomeEvaluation",
          "homeTitle",
          "priceRange",
          "size",
          "bedrooms",
          "bathrooms",
          "specificFeatures",
          "paymentType",
          "preApprovedLender",
          "workWithBroker",
        ],
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
