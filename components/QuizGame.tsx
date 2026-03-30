import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { QuizQuestion } from '@/actions/quiz';
import getShadow from '@/utils/getShadow';

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
    return 'bg-white border-neutral-200';
  }
  if (index === correctAnswer) {
    return 'bg-green-50 border-green-400';
  }
  if (index === selectedAnswer && index !== correctAnswer) {
    return 'bg-red-50 border-red-400';
  }
  return 'bg-white border-neutral-200 opacity-40';
}

function getTextClassName(
  index: number,
  selectedAnswer: number | null,
  correctAnswer: number,
) {
  if (selectedAnswer === null) {
    return 'text-neutral-800';
  }
  if (index === correctAnswer) {
    return 'text-green-700';
  }
  if (index === selectedAnswer) {
    return 'text-red-700';
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
  const progress = questionNumber / totalQuestions;

  return (
    <View className="flex-1 px-4 pt-6">
      {/* Progress Bar */}
      <View className="mb-2">
        <Text className="text-center text-neutral-400 mb-2 font-medium text-sm">
          {questionNumber} / {totalQuestions}
        </Text>
        <View className="h-2.5 bg-bur-yellow-light rounded-full overflow-hidden">
          <View
            className="h-full bg-bur-yellow rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>

      {/* Question Card */}
      <View className="bg-bur-blue-light rounded-2xl px-6 py-6 mt-4 mb-6 items-center">
        <View className="bg-bur-yellow rounded-full p-2 mb-3">
          <Ionicons name="help" size={20} color="#ffffff" />
        </View>
        <Text className="text-2xl font-bold text-center text-bur-blue">
          {question.question}
        </Text>
      </View>

      {/* Answer Buttons */}
      <View className="gap-3">
        {question.answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            disabled={selectedAnswer !== null}
            onPress={() => onSelectAnswer(index)}
            className={`p-4 rounded-xl border ${getButtonClassName(
              index,
              selectedAnswer,
              question.correctAnswer,
            )}`}
          >
            <Text
              className={`text-center font-bold text-base ${getTextClassName(
                index,
                selectedAnswer,
                question.correctAnswer,
              )}`}
            >
              {answer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
