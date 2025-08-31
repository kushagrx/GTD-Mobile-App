import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Trash2, Clock } from 'lucide-react-native';
import { Task } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function TaskCard({ 
  task, 
  onToggleComplete, 
  onDelete,
  showActions = false 
}: TaskCardProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'inbox': return '#8b5cf6';
      case 'next': return '#06b6d4';
      case 'project': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>
      <TouchableOpacity
        onPress={() => onToggleComplete(task.id)}
        style={styles.checkboxContainer}
      >
        {task.completed ? (
          <CheckCircle size={24} color="#10b981" />
        ) : (
          <Circle size={24} color="#6b7280" />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, task.completed && styles.strikethrough]}>
            {task.title}
          </Text>
          <View style={styles.badges}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
              <Text style={styles.badgeText}>{task.priority}</Text>
            </View>
          </View>
        </View>

        {task.description ? (
          <Text style={[styles.description, task.completed && styles.strikethrough]}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.metaContainer}>
            {task.context ? (
              <Text style={styles.context}>{task.context}</Text>
            ) : null}
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(task.type) }]}>
              <Text style={styles.typeText}>{task.type}</Text>
            </View>
          </View>

          {task.dueDate ? (
            <View style={styles.dueDateContainer}>
              <Clock size={12} color="#6b7280" />
              <Text style={styles.dueDate}>{task.dueDate}</Text>
            </View>
          ) : null}
        </View>

        {showActions && onDelete && (
          <Pressable
            onPress={() => onDelete(task.id)}
            style={styles.deleteButton}
          >
            <Trash2 size={16} color="#ef4444" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    opacity: 0.6,
    backgroundColor: '#f9fafb',
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  context: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8b5cf6',
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});