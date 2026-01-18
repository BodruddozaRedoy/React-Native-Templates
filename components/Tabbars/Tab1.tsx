import { Tabs } from 'expo-router';
import { Bell, Home, Search, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.9;
const TAB_WIDTH = TAB_BAR_WIDTH / 4; // Adjust based on number of tabs

// 1. Custom Tab Button with Animation
const TabButton = ({ focused, onPress, Icon, label }: any) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0, { damping: 15 });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.2]) }],
    color: focused ? '#ffffff' : '#94a3b8',
  }));

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center justify-center h-full"
    >
      <Animated.View style={animatedIconStyle}>
        {/* Pass custom SVG, Icon URL, or Expo Icon here */}
        <Icon size={24} color={focused ? "white" : "#94a3b8"} />
      </Animated.View>
    </Pressable>
  );
};

// 2. Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 20,
      stiffness: 150,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="absolute bottom-10 self-center items-center justify-center">
      <View
        style={{ width: TAB_BAR_WIDTH }}
        className="h-16 bg-slate-900 rounded-full flex-row items-center shadow-2xl px-2"
      >
        {/* Animated Sliding Background */}
        <Animated.View
          style={[
            indicatorStyle,
            { width: TAB_WIDTH - 12, height: 48 }
          ]}
          className="bg-blue-600 rounded-full absolute left-2"
        />

        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Define Icons for each route
          const icons = {
            index: Home,
            explore: Search,
            notifications: Bell,
            profile: User,
          };

          return (
            <TabButton
              key={route.name}
              focused={isFocused}
              onPress={onPress}
              Icon={icons[route.name] || Home}
              label={route.name}
            />
          );
        })}
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Search' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}