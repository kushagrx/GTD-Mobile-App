import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks, Task } from '../../context/TaskContext';
import { ArrowLeft, Save, Flag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function TaskDetailScreen() {
  const { tasks, updateTask } = useTasks();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [type, setType] = useState<Task['type']>('inbox');
  const [priority, setPriority] = useState<Task['priority']>('low');
  const [dueDate, setDueDate] = useState('');

  const task = tasks.find(t => t.id === id);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setContext(task.context);
      setType(task.type);
      setPriority(task.priority);
      setDueDate(task.dueDate);
    }
  }, [task]);

  if (!task) {
    return (
      <LinearGradient colors={['#1a0033', '#4b0082']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Task not found</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title.');
      return;
    }

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      context,
      type,
      priority,
      dueDate,
    });
    
    router.back();
  };

  const renderSelectionChips = (
    options: string[],
    selected: string,
    onSelect: (value: string) => void,
    colors?: { [key: string]: string },
    useColoredBackground: boolean = false
  ) => (
    <View style={styles.chipContainer}>
      {options.map((option) => {
        const isSelected = selected === option;

        const backgroundColor = useColoredBackground && isSelected
          ? colors?.[option] ?? 'rgba(255, 255, 255, 0.15)'
          : isSelected
            ? '#ffffff'
            : 'rgba(255, 255, 255, 0.15)';

        const textColor = useColoredBackground && isSelected
          ? '#ffffff'
          : isSelected
            ? '#667eea'
            : '#ffffff';

        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={[
              styles.chip,
              { 
                backgroundColor, 
                borderColor: isSelected 
                  ? (useColoredBackground ? backgroundColor : '#ffffff')
                  : 'rgba(255, 255, 255, 0.4)'
              },
            ]}
          >
            <Text style={[
              styles.chipText,
              { color: textColor }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const priorityColors = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#ef4444'
  };

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1a0033', '#4b0082']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.heading}>Edit Task</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView 
              style={styles.formView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>What needs to be done?</Text>
                <TextInput
                  placeholder="Enter task title..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.titleInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Additional details</Text>
                <TextInput
                  placeholder="Add description, notes, or clarifications..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.descriptionInput}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Flag size={16} color="#ffffff" /> Priority
                </Text>
                {renderSelectionChips(
                  ['low', 'medium', 'high'], 
                  priority, 
                  (value) => setPriority(value as 'low' | 'medium' | 'high'), 
                  priorityColors, 
                  true
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Context (Where/When)</Text>
                {renderSelectionChips(
                  ['@home', '@college', '@errands', '@work', '@calls', '@computer'], 
                  context, 
                  setContext
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type</Text>
                {renderSelectionChips(
                  ['inbox', 'next', 'project'], 
                  type, 
                  (value) => setType(value as 'inbox' | 'next' | 'project')
                )}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <Save size={20} color="#667eea" />
                <Text style={styles.submitText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'System',
    fontWeight: '700',
  },
  formView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'System',
    fontWeight: '600',
  },
  titleInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '400',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  descriptionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: '#667eea',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '600',
  },
});