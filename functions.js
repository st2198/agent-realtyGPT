import fs from 'fs';
import axios from 'axios';
import { ASSISTANT_NAME, ASSISTANT_PROMPT, MODEL_NAME, TOOLS } from './constant.js';

const createAssistant = async (client) => {
  const assistantJsonPath = 'assistant.json';
  let assistantJson = {};

  if (!fs.existsSync(assistantJsonPath)) {
    const knowledgeBase = await client.files.create({
      file: fs.createReadStream("KnowledgeBase.pdf"),
      purpose: "assistants",
    });

    console.log('Knowledge base uploaded successfully');

    assistantJson = await client.beta.assistants.create({
      model: MODEL_NAME,
      instructions: ASSISTANT_PROMPT,
      name: ASSISTANT_NAME,
      tools: TOOLS,
      file_ids: [knowledgeBase.id],
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

const createLead = async (name, email, phoneNumber) => {
  try {
    const data = {
      records: {
        fields: {
          Name: name,
          Email: email,
          PhoneNumber: phoneNumber,
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
  } catch (e) {
    console.error(e);
  }
};

export {
  createAssistant,
  createLead,
};