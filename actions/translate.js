import axios from 'axios';
import { catchHttpErrors } from '../utils/catchHttpErrors';
import { API_URL } from '@env';

export const translateWord = async (translationType = 'bur2ru', value) => {
  try {
    const {
      data: { data },
    } = await axios.get(
      `${API_URL}/api/translate/${translationType}?word=${value?.toLowerCase()}`,
    );

    return data;
  } catch (error) {
    catchHttpErrors(error);
  }
};
