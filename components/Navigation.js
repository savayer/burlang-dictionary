import React from 'react';
import Home from '../views/Home';
import Favorites from '../views/Favorites';
import Settings from '../views/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../constants/i18n';
import { TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import FadeInView from './FadeInView';

const Tab = createBottomTabNavigator();
const iconHeight = 20;
const iconWidth = 20;

const FadeHome = (props) => (
  <FadeInView>
    <Home {...props} />
  </FadeInView>
);

const FadeFavorites = (props) => (
  <FadeInView>
    <Favorites {...props} />
  </FadeInView>
);

const FadeSettings = (props) => (
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
        tabBarIcon: ({ color }) => (
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
        tabBarIcon: ({ color }) => (
          <Ionicons name="star-outline" size={iconHeight} color={color} />
        ),
        title: 'Избранное',
        tabBarLabel: i18n.t('favorites').toLowerCase(),
      },
    },
    {
      name: 'Information',
      component: FadeSettings,
      options: {
        tabBarIcon: ({ color }) => (
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
      screenOptions={{
        tabBarInactiveTintColor: colors.neutral400,
        tabBarActiveTintColor: colors.blue,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarButton: (props) => (
          <TouchableOpacity activeOpacity={0.8} {...props} />
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
