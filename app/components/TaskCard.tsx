import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Trash2, Check, X } from 'lucide-react-native';
import { Task } from '../../context/TaskContext';
import { useRouter } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function TaskCard({ task, onToggleComplete, onDelete, showActions }: TaskCardProps) {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const SWIPE_THRESHOLD = 100;
  const DELETE_THRESHOLD = -100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleCardPress = () => {
    if (translateX.value === 0) {
      router.push(`../task-detail/${task.id}`);
    }
  };

  const handleComplete = () => {
    onToggleComplete(task.id);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldComplete = translateX.value > SWIPE_THRESHOLD;
      const shouldDelete = translateX.value < DELETE_THRESHOLD && onDelete;

      if (shouldComplete) {
        // Animate to complete position then trigger action
        translateX.value = withSpring(300, { damping: 15 }, () => {
          opacity.value = withSpring(0, { damping: 15 }, () => {
            runOnJS(handleComplete)();
            translateX.value = 0;
            opacity.value = 1;
          });
        });
      } else if (shouldDelete) {
        // Animate to delete position then trigger action
        translateX.value = withSpring(-300, { damping: 15 }, () => {
          opacity.value = withSpring(0, { damping: 15 }, () => {
            runOnJS(handleDelete)();
            translateX.value = 0;
            opacity.value = 1;
          });
        });
      } else {
        // Spring back to original position
        translateX.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [-200, DELETE_THRESHOLD, 0, SWIPE_THRESHOLD, 200],
      ['#ef4444', '#ef4444', 'transparent', '#10b981', '#10b981']
    );

    return {
      backgroundColor,
      opacity: Math.abs(translateX.value) > 20 ? 0.8 : 0,
    };
  });

  const animatedLeftIconStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value < DELETE_THRESHOLD ? 1 : 0,
      transform: [{ scale: translateX.value < DELETE_THRESHOLD ? 1 : 0.5 }],
    };
  });

  const animatedRightIconStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value > SWIPE_THRESHOLD ? 1 : 0,
      transform: [{ scale: translateX.value > SWIPE_THRESHOLD ? 1 : 0.5 }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background with action indicators */}
      <Animated.View style={[styles.background, animatedBackgroundStyle]}>
        <Animated.View style={[styles.leftAction, animatedLeftIconStyle]}>
          <X size={24} color="#ffffff" strokeWidth={3} />
          <Text style={styles.actionText}>Delete</Text>
        </Animated.View>
        <Animated.View style={[styles.rightAction, animatedRightIconStyle]}>
          <Check size={24} color="#ffffff" strokeWidth={3} />
          <Text style={styles.actionText}>Complete</Text>
        </Animated.View>
      </Animated.View>

      {/* Main card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedCardStyle}>
          <TouchableOpacity 
            style={[styles.card, task.completed && styles.completedCard]}
            onPress={handleCardPress}
            activeOpacity={0.7}
          >
            <TouchableOpacity onPress={() => onToggleComplete(task.id)} style={styles.checkButton}>
              {task.completed ? (
                <CheckCircle size={24} color="#10b981" />
              ) : (
                <Circle size={24} color="#9ca3af" />
              )}
            </TouchableOpacity>
            
            <View style={styles.content}>
              <Text style={[styles.title, task.completed && styles.strikethrough]}>
                {task.title}
              </Text>
              {task.description ? (
                <Text style={[styles.description, task.completed && styles.strikethrough]}>
                  {task.description}
                </Text>
              ) : null}
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{task.context}</Text>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                <Text style={styles.meta}>{task.type}</Text>
              </View>
            </View>

            {showActions && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(task.id)}
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
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
  },
  checkButton: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meta: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
    color: '#9ca3af',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});