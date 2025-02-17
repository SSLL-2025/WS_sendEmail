const axios = require('axios');
const dotenv = require('dotenv').config()

async function getAttachment(id_card) {
    try {
      const response = await axios.get(`https://api.trello.com/1/cards/${id_card}/attachments?key=${process.env.KEY_TRELLO}&token=${process.env.TOKEN_TRELLO}`);
      //console.log(response);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  module.exports = {getAttachment}