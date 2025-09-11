import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../../app/components/TaskCard';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Zap } from 'lucide-react-native';

export default function NextActionsScreen() {
  const { tasks, toggleTaskComplete, deleteTask } = useTasks();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const nextActions = tasks.filter((task) => {
    if (task.type !== 'next' || task.completed) return false;
    if (selectedContext && task.context !== selectedContext) return false;
    if (selectedPriority && task.priority !== selectedPriority) return false;
    return true;
  });

  const contexts = ['@home', '@college', '@errands', '@work', '@calls', '@computer'];
  const priorities = ['low', 'medium', 'high'];

  const renderFilterChips = (
    options: string[], 
    selected: string | null, 
    onSelect: (value: string | null) => void,
    colors?: { [key: string]: string }
  ) => (
    <View style={styles.filterRow}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(selected === option ? null : option)}
          style={[
            styles.filterChip,
            selected === option && styles.selectedFilter,
            colors?.[option] && selected === option && { backgroundColor: colors[option] }
          ]}
        >
          <Text style={[
            styles.filterText,
            selected === option && styles.selectedFilterText
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a0033', '#4b0082']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Zap size={28} color="#ffffff" />
              <Text style={styles.heading}>Next Actions</Text>
            </View>
            <Text style={styles.subtitle}>
              {nextActions.length} action{nextActions.length !== 1 ? 's' : ''} ready to do
            </Text>
          </View>

          <View style={styles.filtersContainer}>
            <Text style={styles.filterLabel}>
              <Filter size={16} color="#ffffff" /> Filter by Context
            </Text>
            {renderFilterChips(contexts, selectedContext, setSelectedContext)}

            <Text style={styles.filterLabel}>
              Filter by Priority
            </Text>
            {renderFilterChips(priorities, selectedPriority, setSelectedPriority, priorityColors)}
          </View>

          {nextActions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Next Actions</Text>
              <Text style={styles.emptySubtitle}>
                {selectedContext || selectedPriority 
                  ? 'Try adjusting your filters or add more tasks.'
                  : 'Move tasks from your inbox to next actions when you\'re ready to work on them.'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={nextActions}
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
    marginBottom: 24,
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
  filtersContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
  },
  selectedFilter: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  selectedFilterText: {
    color: '#06b6d4',
    fontFamily: 'System',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 80
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