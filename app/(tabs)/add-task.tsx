import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks, Task } from '../../context/TaskContext';
import { ArrowLeft, Calendar, Flag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function AddTaskScreen() {
  const { addTask } = useTasks();
const router = useRouter();

const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [context, setContext] = useState('');
const [type, setType] = useState<Task['type']>('inbox');      
const [priority, setPriority] = useState<Task['priority']>('low'); 
const [dueDate, setDueDate] = useState('');

const handleCreate = () => {
  if (!title.trim()) {
    Alert.alert('Missing Title', 'Please enter a task title.');
    return;
  }

  addTask(title.trim(), description.trim(), context, dueDate, type, priority);
  
  // Reset form
  setTitle('');
  setDescription('');
  setContext('');
  setType('inbox');          // reset to 'inbox' (default)
  setPriority('low');        // reset to 'low' (default)
  setDueDate('');
  
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

      const backgroundColor = useColoredBackground
        ? isSelected
          ? colors?.[option] ?? '#ffffff'
          : '#ffffff'
        : isSelected
          ? '#ffffff'                          // white background when selected
          : 'rgba(255, 255, 255, 0.15)';      // purple translucent when unselected

      const textColor = useColoredBackground
        ? isSelected
          ? '#ffffff'                           // white text on colored bg
          : colors?.[option] ?? 'rgba(255,255,255,0.8)' // colored text on white bg for unselected
        : isSelected
          ? '#667eea'                          // purple text when selected (context/type)
          : '#ffffff';                         // white text when unselected (context/type)

      return (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={[
            styles.chip,
            { 
              backgroundColor, 
              borderColor: useColoredBackground 
                ? (isSelected ? backgroundColor : 'rgba(255, 255, 255, 0.4)')
                : (isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)')
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
  low: '#22c55e',    // Green
  medium: '#eab308',  // Yellow  
  high: '#ef4444'     // Red
};

const typeColors = {
  inbox: '#8b5cf6',
  next: '#06b6d4',
  project: '#f59e0b'
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
              <Text style={styles.heading}>Capture Task</Text>
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
                  autoFocus
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
                    true   // use colored backgrounds when selected
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
                  (value) => setType(value as 'inbox' | 'next' | 'project'), 
                  typeColors,
                  true
                )}
              </View>
  
              <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
                <Text style={styles.submitText}>Capture Task</Text>
              </TouchableOpacity>
              {/* <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Calendar size={16} color="#ffffff" /> Due Date (Optional)
                </Text>
                <TextInput
                  placeholder="e.g., Tomorrow, Dec 25, Next Friday"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={dueDate}
                  onChangeText={setDueDate}
                  style={styles.input}
                />
              </View> */}

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
    position: 'relative', // Enables absolute positioning of button
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
    paddingBottom: Platform.OS === 'ios' ? 140 : 120, // Extra space for iOS nav bar
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
  },
  selectedChip: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  selectedChipText: {
    color: '#667eea',
    fontFamily: 'System',
    fontWeight: '600',
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
  },
  submitText: {
    color: '#667eea',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '700',
  },
});