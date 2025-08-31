import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskCard({ task, onToggleComplete, onDelete, showActions }) {
  return (
    <TouchableOpacity
      style={[styles.card, task.completed && styles.completedCard]}
      onPress={() => onToggleComplete(task.id)}
    >
      <Ionicons
        name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={task.completed ? '#3a0ca3' : '#999'}
        style={{ marginRight: 10 }}
      />
      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.strike]}>
          {task.title}
        </Text>
        {!!task.description && (
        <Text style={[styles.desc, task.completed && styles.strike]}>
        {task.description}
        </Text>
      )}
        <Text style={styles.meta}>{task.context} · {task.type}</Text>
      </View>
      {showActions && onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    maxWidth:360,
  },
  content: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  completedCard: {
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 14,
    color: '#555',
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  strike: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});
