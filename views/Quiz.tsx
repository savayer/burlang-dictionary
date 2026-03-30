import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '@/components/Navbar';
import QuizGame from '@/components/QuizGame';
import { fetchQuizQuestions, QuizQuestion } from '@/actions/quiz';
import { useFetchData } from '@/components/hooks/useFetchData';
import i18n from '@/constants/i18n';

export default function Quiz() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isLoading,
    result: questions,
    handleResponse: loadQuestions,
  } = useFetchData<QuizQuestion[], []>([], fetchQuizQuestions);

  useEffect(() => {
    loadQuestions().catch(() => {
      Alert.alert(i18n.t('error'), i18n.t('something_went_wrong'), [
        { text: 'OK' },
      ]);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isFinished = !isLoading && questions.length > 0 && currentIndex >= questions.length;

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    questions[currentIndex].yourAnswer = index;

    if (index === questions[currentIndex].correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }, 1000);
  };

  const tryAgain = () => {
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setSelectedAnswer(null);
  };

  const newGame = () => {
    tryAgain();
    loadQuestions().catch(() => {
      Alert.alert(i18n.t('error'), i18n.t('something_went_wrong'), [
        { text: 'OK' },
      ]);
    });
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <View style={{ height: insets.top }} className="bg-bur-blue" />

      <View className="flex-1 bg-bur-blue">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
        >
          {Platform.OS === 'ios' && (
            <View className="bg-white h-[1000px] absolute left-0 right-0 -bottom-[1000px]" />
          )}

          <Navbar title={i18n.t('quiz')}>
            {isLoading && <ActivityIndicator color="#fff" className="ml-2.5" />}
          </Navbar>

          <View className="px-2.5 pb-2.5 -mt-4 bg-white rounded-tl-2xl rounded-tr-2xl overflow-hidden flex-1">
            {isLoading && (
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-neutral-600 font-bold text-lg">
                  {i18n.t('loading')}
                </Text>
              </View>
            )}

            {!isLoading && !isFinished && questions.length > 0 && (
              <QuizGame
                question={questions[currentIndex]}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleAnswer}
              />
            )}

            {isFinished && (
              <View className="pt-6 px-2">
                <Text className="text-center font-bold text-xl text-neutral-800 mb-4">
                  {i18n.t('results')}
                </Text>

                <View className="flex-row justify-center gap-6 mb-6">
                  <Text className="text-green-500 font-bold text-base">
                    {i18n.t('correct_answers')}: {correctAnswers}
                  </Text>
                  <Text className="text-red-500 font-bold text-base">
                    {i18n.t('wrong_answers')}: {wrongAnswers}
                  </Text>
                </View>

                {questions.map((q, i) => (
                  <View
                    key={i}
                    className="mb-4 flex-row items-start"
                  >
                    <View className="flex-1">
                      <Text className="font-bold text-neutral-800">
                        {i + 1}. {q.question}
                      </Text>

                      <Text className="text-neutral-600 mt-1">
                        {i18n.t('your_answer')}:{' '}
                        <Text
                          className={
                            q.yourAnswer === q.correctAnswer
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                        >
                          {q.answers[q.yourAnswer!]}
                        </Text>
                      </Text>

                      {q.yourAnswer !== q.correctAnswer && (
                        <Text className="text-neutral-600 mt-0.5">
                          {i18n.t('correct_answer')}:{' '}
                          <Text className="text-green-500">
                            {q.answers[q.correctAnswer]}
                          </Text>
                        </Text>
                      )}
                    </View>

                    <View className="ml-3 mt-0.5">
                      {q.yourAnswer === q.correctAnswer ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="#22c55e"
                        />
                      ) : (
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#ef4444"
                        />
                      )}
                    </View>
                  </View>
                ))}

                <View className="flex-row justify-end gap-3 mt-4 mb-6">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={tryAgain}
                    className="rounded-lg overflow-hidden"
                  >
                    <View className="bg-neutral-200 rounded-lg px-4 py-2.5">
                      <Text className="text-neutral-800 font-bold text-base">
                        {i18n.t('try_again')}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={newGame}
                    className="rounded-lg overflow-hidden"
                  >
                    <View className="bg-bur-yellow rounded-lg px-4 py-2.5">
                      <Text className="text-white font-bold text-base">
                        {i18n.t('new_words')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
