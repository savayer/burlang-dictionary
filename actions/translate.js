import axios from 'axios';

export const translateWord = async (translationType = 'bur2ru', value) => {
  try {
    const {
      data: { data },
    } = await axios.get(
      `${
        process.env.API_URL
      }/api/translate/${translationType}?word=${value?.toLowerCase()}`,
    );

    return data;
  } catch (error) {
    throw error;
  }
};
