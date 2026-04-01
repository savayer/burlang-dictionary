import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { twMerge } from 'tailwind-merge';
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

  const isFinished =
    !isLoading && questions.length > 0 && currentIndex >= questions.length;

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
    <View className="flex-1 bg-bur-bg">
      <StatusBar style="light" />
      <View style={{ height: insets.top }} className="bg-bur-blue" />

      <Navbar title={i18n.t('quiz')}>
        {isLoading && <ActivityIndicator color="#ffffff" className="ml-2.5" />}
      </Navbar>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-bur-bg">
        {isLoading && (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#0036a7" />
            <Text className="text-neutral-400 font-medium text-base mt-3">
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
          <View className="pt-6 px-4">
            <Text className="text-center font-bold text-xl text-neutral-800 mb-5">
              {i18n.t('results')}
            </Text>

            <View className="flex-row justify-center gap-4 mb-6">
              <View className="bg-green-50 rounded-xl px-5 py-3 items-center flex-1">
                <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
                <Text className="text-green-600 font-bold text-lg mt-1">
                  {correctAnswers}
                </Text>
                <Text className="text-green-600 text-xs font-medium">
                  {i18n.t('correct_answers')}
                </Text>
              </View>
              <View className="bg-red-50 rounded-xl px-5 py-3 items-center flex-1">
                <Ionicons name="close-circle" size={28} color="#ef4444" />
                <Text className="text-red-500 font-bold text-lg mt-1">
                  {wrongAnswers}
                </Text>
                <Text className="text-red-500 text-xs font-medium">
                  {i18n.t('wrong_answers')}
                </Text>
              </View>
            </View>

            <View className="gap-3 mb-4">
              {questions.map((q, i) => (
                <View
                  key={i}
                  className={`rounded-xl px-4 py-3 flex-row items-start ${
                    q.yourAnswer === q.correctAnswer
                      ? 'bg-green-50'
                      : 'bg-red-50'
                  }`}
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
                            ? 'text-green-600 font-bold'
                            : 'text-red-500 font-bold'
                        }
                      >
                        {q.answers[q.yourAnswer!]}
                      </Text>
                    </Text>

                    {q.yourAnswer !== q.correctAnswer && (
                      <Text className="text-neutral-600 mt-0.5">
                        {i18n.t('correct_answer')}:{' '}
                        <Text className="text-green-600 font-bold">
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
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    )}
                  </View>
                </View>
              ))}
            </View>

            <View className="flex-row justify-end gap-3 mt-2 mb-6">
              <Pressable onPress={tryAgain} className="flex-1">
                {({ pressed }) => (
                  <View
                    className={twMerge(
                      'border-2 border-bur-blue rounded-full px-4 py-3 bg-white',
                      pressed && 'bg-neutral-100',
                    )}
                  >
                    <Text className="text-bur-blue font-bold text-base text-center">
                      {i18n.t('try_again')}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable onPress={newGame} className="flex-1">
                {({ pressed }) => (
                  <View
                    className={twMerge(
                      'rounded-full px-4 py-3 bg-bur-blue',
                      pressed && 'bg-bur-blue/80',
                    )}
                  >
                    <Text className="text-white font-bold text-base text-center">
                      {i18n.t('new_words')}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {isFinished && correctAnswers >= 8 && (
        <ConfettiCannon
          count={150}
          explosionSpeed={200}
          origin={{ x: -30, y: -50 }}
        />
      )}
    </View>
  );
}
