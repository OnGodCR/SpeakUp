import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight } from '@/constants/theme';

function HomeIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.primary : Colors.textMuted;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
        fill={focused ? Colors.primary + '20' : 'none'}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HistoryIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.primary : Colors.textMuted;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="2"
        fill={focused ? Colors.primary + '20' : 'none'}
      />
      <Path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function FriendsIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.primary : Colors.textMuted;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="9"
        cy="7"
        r="3"
        stroke={color}
        strokeWidth="2"
        fill={focused ? Colors.primary + '20' : 'none'}
      />
      <Path
        d="M3 21V18C3 16.34 4.34 15 6 15H12C13.66 15 15 16.34 15 18V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="17" cy="8" r="2.5" stroke={color} strokeWidth="1.5" />
      <Path
        d="M17 14C18.66 14 20 15.34 20 17V20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ProfileIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.primary : Colors.textMuted;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="4"
        stroke={color}
        strokeWidth="2"
        fill={focused ? Colors.primary + '20' : 'none'}
      />
      <Path
        d="M4 21V19C4 16.79 5.79 15 8 15H16C18.21 15 20 16.79 20 19V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function TabIcon({
  icon,
  label,
  focused,
}: {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabItem}>
      {icon}
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
      {focused ? <View style={styles.activeIndicator} /> : null}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.surfaceBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<HomeIcon focused={focused} />}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<HistoryIcon focused={focused} />}
              label="History"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<FriendsIcon focused={focused} />}
              label="Friends"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<ProfileIcon focused={focused} />}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    position: 'relative',
  },
  tabLabel: {
    fontSize: FontSize.xs - 1,
    fontWeight: FontWeight.semibold,
    marginTop: 3,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  tabLabelInactive: {
    color: Colors.textMuted,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -7,
    width: 28,
    height: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent,
  },
});
