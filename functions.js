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
    records: [
      {
        fields: {
          "Name": name,
          "Email": email,
          'Phone number': phoneNumber,
          'When ready to buy': whenReady,
          'Work with agent': workWithAgent,
          'Committed with agent': committedWithAgent ?? 'N/A',
          'Rent or own': rentOrOwn,
          'Planning to sell': planningToSell ?? 'N/A',
          'First time buyer': firstTimeHomeBuyer,
          'Free home evaluation': freeHomeEvaluation ?? 'N/A',
          'Home title': homeTitle ?? 'N/A',
          'Price range': priceRange,
          "Bedrooms": bedrooms,
          "Bathrooms": bathrooms,
          "Size": size,
          'Specific features': specificFeatures,
          'Payment type': paymentType,
          'Pre-approved lender': preApprovedLender ?? 'N/A',
          'Worked with mortgage broker': workWithBroker ?? 'N/A',
        }
      }
    ]
  };

  const base = 'appA4IjlJIwaNUxzg';
  const table = 'tbl4HodP9AEsNQEQj';
  const url = `https://api.airtable.com/v0/${base}/${table}/`;
  const headers = {
    method: 'POST',
    authorization: `Bearer ${process.env.AIRTABLE_ACCESS_KEY}`,
    contentType: 'application/json',
  };

  await axios.post(url, data, {headers});
};

export {
  createAssistant,
  captureLeadBuy,
};