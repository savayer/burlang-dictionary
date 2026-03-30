import React from 'react';
import Home from '@/views/Home';
import Favorites from '@/views/Favorites';
import Quiz from '@/views/Quiz';
import Settings from '@/views/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '@/constants/i18n';
import { TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import FadeInView from './FadeInView';
import getShadow from '@/utils/getShadow';

const Tab = createBottomTabNavigator();
const iconHeight = 22;

const FadeHome = (props: any) => (
  <FadeInView>
    <Home {...props} />
  </FadeInView>
);

const FadeFavorites = (props: any) => (
  <FadeInView>
    <Favorites {...props} />
  </FadeInView>
);

const FadeQuiz = (props: any) => (
  <FadeInView>
    <Quiz {...props} />
  </FadeInView>
);

const FadeSettings = (props: any) => (
  <FadeInView>
    <Settings {...props} />
  </FadeInView>
);

export default function Navigation() {
  const navItems = [
    {
      name: 'Home',
      component: FadeHome,
      options: {
        tabBarIcon: ({ color }: { color: string }) => (
          <Ionicons name="search" size={iconHeight} color={color} />
        ),
        tabBarLabel: i18n.t('search').toLowerCase(),
        headerShown: false,
      },
    },
    {
      name: 'Favorites',
      component: FadeFavorites,
      options: {
        tabBarIcon: ({ color }: { color: string }) => (
          <Ionicons name="star-outline" size={iconHeight} color={color} />
        ),
        title: 'Избранное',
        tabBarLabel: i18n.t('favorites').toLowerCase(),
      },
    },
    {
      name: 'Quiz',
      component: FadeQuiz,
      options: {
        tabBarIcon: ({ color }: { color: string }) => (
          <MaterialCommunityIcons name="head-question-outline" size={iconHeight} color={color} />
        ),
        title: i18n.t('quiz'),
        tabBarLabel: i18n.t('quiz').toLowerCase(),
        headerShown: false,
      },
    },
    {
      name: 'Information',
      component: FadeSettings,
      options: {
        tabBarIcon: ({ color }: { color: string }) => (
          <Ionicons
            name="information-circle-outline"
            size={iconHeight}
            color={color}
          />
        ),
        title: 'Информация',
        headerLargeStyle: true,
        headerLargeTitle: 'Информация',
        tabBarLabel: i18n.t('information').toLowerCase(),
      },
    },
  ];

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarInactiveTintColor: colors.neutral400,
        tabBarActiveTintColor: colors.yellow,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          borderTopWidth: 0,
          ...getShadow(8, 4),
        },
        tabBarButton: (props) => (
          <TouchableOpacity activeOpacity={0.8} {...(props as any)} />
        ),
      }}
    >
      {navItems.map((navItem, i) => (
        <Tab.Screen
          key={i}
          name={navItem.name}
          component={navItem.component}
          options={navItem.options}
        />
      ))}
    </Tab.Navigator>
  );
}
