import axios from 'axios';
import { catchHttpErrors } from '@/utils/catchHttpErrors';
// @ts-ignore react-native-dotenv
import { API_URL } from '@env';

export type QuizQuestion = {
  question: string;
  answers: [string, string, string, string];
  correctAnswer: number;
  yourAnswer?: number;
};

type QuizQuestionsApiResponse = {
  data: {
    data: QuizQuestion[];
    meta: { count: number };
  };
};

export type FetchQuizQuestions = () => Promise<QuizQuestion[]>;

export const fetchQuizQuestions: FetchQuizQuestions = async () => {
  try {
    const {
      data: { data },
    } = (await axios.get(
      `${API_URL}/api/quiz/questions`,
    )) as QuizQuestionsApiResponse;

    return data;
  } catch (error) {
    catchHttpErrors(error);
  }
};
