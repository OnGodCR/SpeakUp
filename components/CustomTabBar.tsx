import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../constants/colors';

type TabBarProps = {
  state: { routes: { name: string; key: string; params?: object }[]; index: number };
  descriptors: Record<
    string,
    { options: { tabBarAccessibilityLabel?: string; tabBarTestID?: string }; navigation: any }
  >;
  navigation: { navigate: (name: string, params?: object) => void; emit: (e: any) => { defaultPrevented: boolean } };
};

const TAB_ICONS: Record<string, string> = {
  index: 'home',
  history: 'clock-outline',
  friends: 'account-group',
  profile: 'account-circle',
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  history: 'History',
  friends: 'Friends',
  profile: 'Profile',
};

export default function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconName = TAB_ICONS[route.name] ?? 'circle';
        const label = TAB_LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={iconName as any}
              size={24}
              color={isFocused ? Theme.primary : Theme.muted}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? Theme.primary : Theme.muted },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {isFocused ? <View style={styles.pill} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.cardBorderTint,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    height: Platform.OS === 'ios' ? 88 : 72,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  pill: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.primary,
  },
});
