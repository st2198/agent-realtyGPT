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

const captureBuyLead = async (
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
  locationPreferences,
  propertyType,
  specificFeatures,
  paymentType,
  preApprovedLender,
  workWithBroker,
  bestTimeToContact
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
          'Best Time To Contact': bestTimeToContact ?? 'N/A',
          'Location Preferences': locationPreferences,
          'Property Type': propertyType,
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

  await axios.post(url, data, { headers });
};

const captureSellLead = async params => {
  const {
    name,
    email,
    phoneNumber,
    whenReady,
    workWithAgent,
    committedWithAgent,
    reason,
    bedrooms,
    bathrooms,
    address,
    price,
    obtainedMarketAnalysis,
    firstTimeSeller,
    challengesSuccess,
  } = params;

  const data = {
    records: [
      {
        fields: {
          "Name": name,
          "Email": email,
          'Phone number': phoneNumber,
          'When ready to sell': whenReady,
          'Work with agent': workWithAgent,
          'Committed with agent': committedWithAgent ?? 'N/A',
          'Reason for selling': reason,
          'Bedrooms': bedrooms,
          'Bathrooms': bathrooms,
          'Address': address,
          'Price expectations': price,
          'Obtained market analysis': obtainedMarketAnalysis,
          'First time seller': firstTimeSeller,
          'Challenges and success of selling': challengesSuccess ?? 'N/A',
        }
      }
    ]
  };

  const base = 'appqTfPRTRvbIJybZ';
  const table = 'tblGmyNSLsU1xHMwj';
  const url = `https://api.airtable.com/v0/${base}/${table}/`;
  const headers = {
    method: 'POST',
    authorization: `Bearer ${process.env.AIRTABLE_ACCESS_KEY}`,
    contentType: 'application/json',
  };

  await axios.post(url, data, { headers });
};

const captureRentLead = async params => {
  const {
    name,
    email,
    phoneNumber,
    whenReady,
    workWithAgent,
    committedWithAgent,
    budget,
    creditScore,
    send410Form,
    propertyType,
    bedrooms,
    bathrooms,
    locationPreferences,
    amenities,
    leaseDuration,
  } = params;
  const data = {
    records: [
      {
        fields: {
          "Name": name,
          "Email": email,
          'Phone number': phoneNumber,
          'When ready to rent': whenReady,
          'Work with agent': workWithAgent,
          'Committed with agent': committedWithAgent ?? 'N/A',
          'Price range': budget,
          'Credit score': creditScore ?? 'N/A',
          'Send 410 form': send410Form,
          'Property Type': propertyType,
          'Bedrooms': bedrooms,
          'Bathrooms': bathrooms,
          'Location preferences': locationPreferences,
          'Amenities': amenities,
          'Lease duration': leaseDuration,
        }
      }
    ]
  };

  console.log(data)
  console.log('data')

  const base = 'appGioM24Q02oq8fd';
  const table = 'tblNFzfFwhsSlaqz8';
  const url = `https://api.airtable.com/v0/${base}/${table}/`;
  const headers = {
    method: 'POST',
    authorization: `Bearer ${process.env.AIRTABLE_ACCESS_KEY}`,
    contentType: 'application/json',
  };

  await axios.post(url, data, { headers });
};

const captureNurtureLead = async params => {
  const {
    name,
    email,
    phoneNumber,
    whenReady,
    actionType,
  } = params;
  const data = {
    records: [
      {
        fields: {
          "Name": name,
          "Email": email,
          'Phone number': phoneNumber,
          'When ready': whenReady,
          'Action type': actionType,
        }
      }
    ]
  };

  console.log(data)
  console.log('data')

  const base = 'appZb2zhrxKe6Z7dL';
  const table = 'tbl6yd2UTYc43JpxG';
  const url = `https://api.airtable.com/v0/${base}/${table}/`;
  const headers = {
    method: 'POST',
    authorization: `Bearer ${process.env.AIRTABLE_ACCESS_KEY}`,
    contentType: 'application/json',
  };

  await axios.post(url, data, { headers });
};

export {
  createAssistant,
  captureBuyLead,
  captureSellLead,
  captureRentLead,
  captureNurtureLead,
};