import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../components/TaskCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

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
              <Text style={styles.greeting}>Hello, Kushagra</Text>
              <Text style={styles.heading}>Inbox</Text>
              {incompleteTasks.length > 0 && (
                <Text style={styles.subtitle}>
                  {incompleteTasks.length} task{incompleteTasks.length !== 1 ? 's' : ''} to process
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowCompleted(!showCompleted)}
            >
              <Filter size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {inboxTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Inbox is empty!</Text>
              <Text style={styles.emptySubtitle}>
                Your mind is clear. Capture new thoughts as they come.
              </Text>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => router.push('/add-task')}
              >
                <Plus size={24} color="#667eea" />
                <Text style={styles.addButtonText}>Add First Task</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={inboxTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskCard 
                  task={item} 
                  onToggleComplete={toggleTaskComplete}
                  onDelete={deleteTask}
                  showActions={true}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 20,
  },
  greeting: {
    fontFamily: 'System',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 4,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'System',
    fontWeight: '400',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'System',
    fontWeight: '400',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#667eea',
  },
  listContainer: {
    paddingBottom: 20,
  },
});