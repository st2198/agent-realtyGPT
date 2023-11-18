import fs from 'fs';
import axios from 'axios';
import { ASSISTANT_DESCRIPTION, ASSISTANT_NAME, ASSISTANT_PROMPT, MODEL_NAME, TOOLS } from './constant.js';

const createAssistant = async (client) => {
  const assistantJsonPath = 'assistant.json';
  let assistantJson = {};

  if (!fs.existsSync(assistantJsonPath)) {

    assistantJson = await client.beta.assistants.create({
      model: MODEL_NAME,
      description: ASSISTANT_DESCRIPTION,
      instructions: ASSISTANT_PROMPT,
      name: ASSISTANT_NAME,
      tools: TOOLS,
    });

    fs.writeFile(assistantJsonPath, JSON.stringify(assistantJson), (err) => {
      if (err) throw err;
      console.log('Assistant JSON has been created successfully');
    });

    console.log('Assistant has been successfully created');
  } else {
    assistantJson = JSON.parse(fs.readFileSync(assistantJsonPath));
  }

  return assistantJson;
};

const captureLeadBuy = async (
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
  ) => {
  const data = {
    records: {
      fields: {
        Name: name,
        Email: email,
        'Phone number': phoneNumber,
        'When ready to buy': whenReady,
        'Work with agent': workWithAgent,
        'Committed with agent': committedWithAgent,
        'Rent or own': rentOrOwn,
        'Planning to sell': planningToSell,
        'First time home buyer': firstTimeHomeBuyer,
        'Free home evaluation': freeHomeEvaluation,
        'Home title': homeTitle,
        'Price range': priceRange,
        Bedrooms: bedrooms,
        Bathrooms: bathrooms,
        Size: size,
        'Specific features': specificFeatures,
        'Payment type': paymentType,
        'Pre-approved lender': preApprovedLender,
        'Worked with mortgage broker': workWithBroker,
      }
    }
  };

  const base = 'appA4IjlJIwaNUxzg';
  const table = 'tbl4HodP9AEsNQEQj';
  const url = `https://api.airtable.com/v0/${base}/${table}/`;
  const headers = {
    method: 'POST',
    authorization: `Bearer ${process.env.AIRTABLE_ACCESS_KEY}`,
    contentType: 'application/json',
  };

  const response = await axios.post(url, data, headers);
  return response.json();
};

export {
  createAssistant,
  captureLeadBuy,
};