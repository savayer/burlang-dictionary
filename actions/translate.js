import axios from 'axios';
import { catchHttpErrors } from '../utils/catchHttpErrors';

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
    catchHttpErrors(error);
  }
};
