import { Tabs } from 'expo-router';
import { Inbox, Plus, Zap, FolderOpen, Settings } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 6,
          position: 'absolute',
          bottom: 30,
          left: 30,
          right: 30,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(100, 100, 100, 0.3)',
              borderRadius: 30,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
          marginTop: 2,
          color: '#ffffff',
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size, focused }) => (
            <Inbox 
              size={size * 0.9} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add-task"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size, focused }) => (
            <Plus 
              size={size * 0.9} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="next-actions"
        options={{
          title: 'Next',
          tabBarIcon: ({ color, size, focused }) => (
            <Zap 
              size={size * 0.9} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size, focused }) => (
            <FolderOpen 
              size={size * 0.9} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Settings 
              size={size * 0.9} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            />
          ),
        }}
      />
    </Tabs>
  );
}