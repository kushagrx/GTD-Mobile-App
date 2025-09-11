import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../../app/components/TaskCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, Plus, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, BounceIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function InboxScreen() {
  const { tasks, toggleTaskComplete, deleteTask } = useTasks();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const inboxTasks = tasks.filter((task) => {
    if (task.type !== 'inbox') return false;
    if (!showCompleted && task.completed) return false;
    return true;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const incompleteTasks = inboxTasks.filter(task => !task.completed);

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a0033', '#4b0082']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View>
              <Animated.Text entering={FadeInUp.delay(100)} style={styles.greeting}>
                Hello, Kushagra 
              </Animated.Text>
              <Animated.Text entering={FadeInUp.delay(200)} style={styles.heading}>
                Inbox
              </Animated.Text>
              {incompleteTasks.length > 0 && (
                <Animated.Text entering={FadeInUp.delay(300)} style={styles.subtitle}>
                  {incompleteTasks.length} task{incompleteTasks.length !== 1 ? 's' : ''} to process
                </Animated.Text>
              )}
            </View>
            <Animated.View entering={BounceIn.delay(400)}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowCompleted(!showCompleted)}
                activeOpacity={0.8}
              >
                <Filter size={20} color="#ffffff" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Stats Card */}
          {incompleteTasks.length > 0 && (
            <Animated.View entering={FadeInDown.delay(500)} style={styles.statsCard}>
              <View style={styles.statsContent}>
                <Sparkles size={20} color="#fbbf24" />
                <Text style={styles.statsText}>
                  You're doing great! {incompleteTasks.length} items to clear your mind.
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Filter Toggle */}
          {tasks.filter(t => t.type === 'inbox').length > 0 && (
            <Animated.View entering={FadeInDown.delay(600)} style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, showCompleted && styles.toggleButtonActive]}
                onPress={() => setShowCompleted(!showCompleted)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, showCompleted && styles.toggleTextActive]}>
                  {showCompleted ? 'Hide Completed' : 'Show Completed'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {inboxTasks.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(400)} style={styles.emptyState}>
              
              <Text style={styles.emptyTitle}>
                {tasks.filter(t => t.type === 'inbox').length === 0 
                  ? 'Your inbox is empty!' 
                  : 'All caught up!'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {tasks.filter(t => t.type === 'inbox').length === 0 
                  ? ' "Stay on top of your priorities." '
                  : showCompleted 
                    ? 'Great job! All your tasks are complete.'
                    : 'All active tasks are done. Toggle to see completed ones.'}
              </Text>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => router.push('/add-task')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={styles.addButtonGradient}
                >
                  <Plus size={24} color="#667eea" />
                  <Text style={styles.addButtonText}>
                    {tasks.filter(t => t.type === 'inbox').length === 0 ? 'Add Task' : 'Add Another Task'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.delay(700)} style={styles.listWrapper}>
              <FlatList
                data={inboxTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <Animated.View entering={FadeInDown.delay(800 + index * 100)}>
                    <TaskCard 
                      task={item} 
                      onToggleComplete={toggleTaskComplete}
                      onDelete={deleteTask}
                      showActions={true}
                    />
                  </Animated.View>
                )}
                refreshControl={
                  <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    tintColor="rgba(255, 255, 255, 0.8)"
                    colors={['#ffffff']}
                  />
                }
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
    fontWeight: '500',
    marginBottom: 4,
  },
  heading: {
    fontSize: 36,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
    fontWeight: '400',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  statsText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
    lineHeight: 20,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  toggleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listWrapper: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 100,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emptyTitle: {
    fontSize: 28,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    fontFamily: 'System',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  addButton: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
  },
  addButtonText: {
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#667eea',
    letterSpacing: 0.3,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  listContainer: {
    paddingBottom: 140,
    paddingHorizontal: 20,
  },
});