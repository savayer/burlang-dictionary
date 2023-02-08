import React from 'react';
import Home from '../views/Home';
import Favorites from '../views/Favorites';
import Settings from '../views/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Search, FolderWithStar, Tuning } from './icons';
import i18n from '../constants/i18n';
import { TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();
const iconHeight = 20;
const iconWidth = 20;

export default function Navigation() {
  const navItems = [
    {
      name: i18n.t('search'),
      component: Home,
      options: {
        tabBarIcon: ({ color }) => (
          <Search width={iconWidth} height={iconHeight} stroke={color} />
        ),
        title: '',
        tabBarLabel: i18n.t('search').toLowerCase(),
        header: () => null,
      },
    },
    {
      name: i18n.t('favorites'),
      component: Favorites,
      options: {
        tabBarIcon: ({ color }) => (
          <FolderWithStar
            width={iconWidth}
            height={iconHeight}
            stroke={color}
          />
        ),
        tabBarLabel: i18n.t('favorites').toLowerCase(),
      },
    },
    {
      name: i18n.t('settings'),
      component: Settings,
      options: {
        tabBarIcon: ({ color }) => (
          <Tuning width={iconWidth} height={iconHeight} stroke={color} />
        ),
        tabBarLabel: i18n.t('settings').toLowerCase(),
      },
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: colors.neutral400,
        tabBarActiveTintColor: colors.blue,
        tabBarActiveBackgroundColor: colors.neutral100,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
        },
        tabBarStyle: { marginTop: -10 },
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
