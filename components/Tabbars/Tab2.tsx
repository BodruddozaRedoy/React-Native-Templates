import { Tabs } from 'expo-router';
import { Bell, Compass, Home, User } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width;
const TAB_WIDTH = TAB_BAR_WIDTH / 4;

// The "Curve" SVG Path
const TabPath = ({ color = "#0f172a" }) => {
  // This path creates a smooth "U" shape cutout
  const d = `M0,0 L${TAB_WIDTH * 0.2},0 
             C${TAB_WIDTH * 0.35},0 ${TAB_WIDTH * 0.35},35 ${TAB_WIDTH * 0.5},35 
             C${TAB_WIDTH * 0.65},35 ${TAB_WIDTH * 0.65},0 ${TAB_WIDTH * 0.8},0 
             L${TAB_WIDTH},0 L${TAB_WIDTH},60 L0,60 Z`;

  return (
    <Svg width={TAB_WIDTH} height={60} viewBox={`0 0 ${TAB_WIDTH} 60`}>
      <Path fill={color} d={d} />
    </Svg>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const translateX = useSharedValue(0);

  // Animate the SVG curve and the "jump"
  const handlePress = (index, routeName, isFocused) => {
    translateX.value = withSpring(index * TAB_WIDTH, { damping: 15 });

    if (!isFocused) {
      navigation.navigate(routeName);
    }
  };

  const animatedCurveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="absolute bottom-0 w-full h-20 bg-transparent">
      {/* 1. The Background Layer */}
      <View className="absolute bottom-0 w-full h-16 bg-slate-900" />

      {/* 2. The Moving Curved Cutout */}
      <Animated.View style={[animatedCurveStyle, { position: 'absolute', top: 0 }]}>
        <TabPath color="#0f172a" />
      </Animated.View>

      {/* 3. The Interactive Icons */}
      <View className="flex-row items-center h-16 mt-4">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const icons = {
            index: Home,
            explore: Compass,
            notifications: Bell,
            profile: User,
          };

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              Icon={icons[route.name]}
              onPress={() => handlePress(index, route.name, isFocused)}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabItem = ({ isFocused, Icon, onPress }) => {
  // Icon "Jump" animation
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(isFocused ? -28 : 0, { damping: 12 }) },
        { scale: withSpring(isFocused ? 1.2 : 1) }
      ],
    };
  });

  return (
    <Pressable onPress={onPress} className="flex-1 items-center justify-center h-full">
      <Animated.View
        style={animatedIconStyle}
        // You can use Tailwind classes for the icon container too
        className={`p-3 rounded-full ${isFocused ? 'bg-blue-500 shadow-lg shadow-blue-500' : ''}`}
      >
        {/* Placeholder for SVG / Custom URL Icon */}
        <Icon
          size={24}
          color={isFocused ? "white" : "#94a3b8"}
          strokeWidth={isFocused ? 2.5 : 2}
        />
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ title: 'User' }} />
    </Tabs>
  );
}