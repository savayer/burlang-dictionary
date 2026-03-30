import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { QuizQuestion } from '@/actions/quiz';

interface QuizGameProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

function getButtonClassName(
  index: number,
  selectedAnswer: number | null,
  correctAnswer: number,
) {
  if (selectedAnswer === null) {
    return 'bg-neutral-100 border-neutral-300';
  }
  if (index === correctAnswer) {
    return 'bg-green-500 border-green-500';
  }
  if (index === selectedAnswer && index !== correctAnswer) {
    return 'bg-red-500 border-red-500';
  }
  return 'bg-neutral-100 border-neutral-300 opacity-50';
}

function getTextClassName(
  index: number,
  selectedAnswer: number | null,
  correctAnswer: number,
) {
  if (selectedAnswer === null) {
    return 'text-neutral-800';
  }
  if (index === correctAnswer || index === selectedAnswer) {
    return 'text-white';
  }
  return 'text-neutral-800';
}

export default function QuizGame({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuizGameProps) {
  return (
    <View className="flex-1 px-4 pt-6">
      <Text className="text-center text-neutral-400 mb-2 font-medium">
        {questionNumber} / {totalQuestions}
      </Text>

      <Text className="text-xl font-bold text-center text-neutral-800 mb-8">
        {question.question}
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {question.answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            disabled={selectedAnswer !== null}
            onPress={() => onSelectAnswer(index)}
            className={`w-[48%] mb-3 p-4 rounded-lg border ${getButtonClassName(index, selectedAnswer, question.correctAnswer)}`}
          >
            <Text
              className={`text-center font-bold ${getTextClassName(index, selectedAnswer, question.correctAnswer)}`}
            >
              {answer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
