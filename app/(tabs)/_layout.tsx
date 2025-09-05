import { Tabs } from 'expo-router';
import { Inbox, Plus, Zap, FolderOpen, Settings } from 'lucide-react-native';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 60 : 60,
          paddingBottom: Platform.OS === 'ios' ? 10 : 10,
          paddingTop: 8,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 40 : 30,
          left: 40,
          right: 40,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 25,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
          ) : (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(100, 100, 100, 0.3)',
                borderRadius: 25,
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
          )
        ),
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 5
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size, focused }) => (
            <Inbox 
              size={28} 
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
              size={28} 
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
              size={28} 
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
              size={28} 
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
              size={28} 
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