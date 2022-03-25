const axios = require("axios");
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

module.exports = async term => {
  const { data } = await axios.get(API_URL + term);
  const defData = {};
  data.forEach(({ meanings }) => {
    meanings.forEach(({ partOfSpeech, definitions }) => {
      if (!defData[partOfSpeech]) {
        defData[partOfSpeech] = [];
      }
      defData[partOfSpeech].push(...definitions.map(({ definition, example }) => {
        return { definition, example };
      }));
    });
  });
  return defData;
};