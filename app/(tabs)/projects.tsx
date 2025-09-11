import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../../app/components/TaskCard';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FolderOpen, Target, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ProjectsScreen() {
  const { tasks, toggleTaskComplete, deleteTask } = useTasks();
  const [showCompleted, setShowCompleted] = useState(false);

  const projectTasks = tasks.filter((task) => {
    if (task.type !== 'project') return false;
    if (!showCompleted && task.completed) return false;
    return true;
  });

  const activeProjects = projectTasks.filter(task => !task.completed);
  const completedProjects = projectTasks.filter(task => task.completed);

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a0033', '#4b0082']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <FolderOpen size={28} color="#ffffff" />
              <Text style={styles.heading}>Projects</Text>
            </View>
            <Text style={styles.subtitle}>
              {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Target size={20} color="#f59e0b" />
              <Text style={styles.statNumber}>{activeProjects.length}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={20} color="#10b981" />
              <Text style={styles.statNumber}>{completedProjects.length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Text style={styles.toggleText}>
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </Text>
          </TouchableOpacity>

          {projectTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Projects Yet</Text>
              <Text style={styles.emptySubtitle}>
                Projects are outcomes that require multiple steps. Break down big goals into actionable projects.
              </Text>
            </View>
          ) : (
            <FlatList
              data={projectTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskCard 
                  task={item} 
                  onToggleComplete={toggleTaskComplete}
                  onDelete={deleteTask}
                  showActions={true}
                />
              )}
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
    paddingTop: 20,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  heading: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'System',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  toggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  toggleText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
    fontWeight: '400',
  },
  listContainer: {
    paddingBottom: 100,
  },
});