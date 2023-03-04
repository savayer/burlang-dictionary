import axios from 'axios';
import { catchHttpErrors } from '../utils/catchHttpErrors';
// @ts-ignore react-native-dotenv
import { API_URL } from '@env';

export type translationImage = {
  id: number;
  filepath: string;
  ruword_id?: number;
  burword_id?: number;
  url: string;
};

export type voiceActing = {
  id: number;
  filepath: string;
  ruword_id?: number;
  burword_id?: number;
  url: string;
};

export type word = {
  id: number;
  name: string;
};

export type translationItem = {
  id: number;
  slug: string | null;
  images: translationImage[];
  speechs: voiceActing[];
  name: string;
  translations: word[];
};

export type translation = {
  exactTranslations: translationItem[];
  occurrences: translationItem[];
  possibleTranslation: translationItem[];
};

type translationApiResponse = {
  data: {
    data: {
      result: translationItem[];
      includes: translationItem[];
      fuzzy: translationItem[];
    };
  };
};

export type TranslateWord = (
  translationType: string,
  value: string,
) => Promise<translation>;

export const translateWord: TranslateWord = async (
  translationType = 'bur2ru',
  value,
) => {
  try {
    const {
      data: { data },
    } = (await axios.get(
      `${API_URL}/api/translate/${translationType}?word=${value.toLowerCase()}`,
    )) as translationApiResponse;

    return {
      exactTranslations: data.result,
      occurrences: data.includes,
      possibleTranslation: data.fuzzy,
    };
  } catch (error) {
    catchHttpErrors(error);
  }
};
