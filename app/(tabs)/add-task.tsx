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
  Platform,
  Dimensions,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks, Task } from '../../context/TaskContext';
import { ArrowLeft, Calendar, Flag, Sparkles, Target } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function AddTaskScreen() {
  const { addTask } = useTasks();
const router = useRouter();

const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [context, setContext] = useState('');
const [type, setType] = useState<Task['type']>('inbox');      
const [priority, setPriority] = useState<Task['priority']>('low'); 
const [dueDate, setDueDate] = useState('');
const [showDatePicker, setShowDatePicker] = useState(false);
const [date, setDate] = useState<Date | null>(null);

const handleCreate = () => {
  if (!title.trim()) {
    Alert.alert('Missing Title', 'Please enter a task title.');
    return;
  }

  addTask(title.trim(), description.trim(), context, dueDate, type, priority);
  
  setTitle('');
  setDescription('');
  setContext('');
  setType('inbox');          
  setPriority('low');        
  setDueDate('');
  
  router.back();
};

const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  const { type } = event;
  
  if (Platform.OS === 'android') {
    setShowDatePicker(false);
    if (type === "set" && selectedDate) {
      setDate(selectedDate);
      setDueDate(selectedDate.toLocaleDateString());
    }
  } else {
    // For iOS, just update the date without closing the modal
    if (selectedDate) {
      setDate(selectedDate);
      setDueDate(selectedDate.toLocaleDateString());
    }
  }
};

const showDatePickerModal = () => {
  setShowDatePicker(true);
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

      const backgroundColor = isSelected && useColoredBackground
        ? colors?.[option] ?? '#ffffff'
        : 'rgba(255, 255, 255, 0.15)';      

      const textColor = isSelected
        ? useColoredBackground 
          ? '#ffffff'
          : '#667eea'
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
                ? useColoredBackground 
                  ? colors?.[option] ?? '#ffffff'
                  : '#ffffff'
                : 'rgba(255, 255, 255, 0.4)'
            },
          ]}
          keyboardShouldPersistTaps="handled"
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
              <Animated.Text entering={FadeInUp.delay(200)} style={styles.heading}>
                Capture Task
              </Animated.Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Motivational Header */}
            <Animated.View entering={FadeInDown.delay(300)} style={styles.motivationCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.motivationContent}
              >
                <Sparkles size={20} color="#fbbf24" />
                <Text style={styles.motivationText}>
                  Stay productive by recording tasks here.
                </Text>
              </LinearGradient>
            </Animated.View>
  
            <ScrollView 
              style={styles.formView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View entering={FadeInDown.delay(400)} style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Target size={16} color="#ffffff" /> What needs to be done?
                </Text>
                <TextInput
                  placeholder="Enter task title..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.titleInput}
                />
              </Animated.View>
  
              <Animated.View entering={FadeInDown.delay(500)} style={styles.inputGroup}>
                <Text style={styles.label}>Additional details</Text>
                <TextInput
                  placeholder="Add description, notes, or clarifications..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.descriptionInput}
                  multiline
                  numberOfLines={3}
                />
              </Animated.View>
  
              <Animated.View entering={FadeInDown.delay(600)} style={styles.inputGroup}>
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
              </Animated.View>
  
              <Animated.View entering={FadeInDown.delay(700)} style={styles.inputGroup}>
                <Text style={styles.label}>Context (Where/When)</Text>
                {renderSelectionChips(
                    ['@home', '@college', '@errands', '@work', '@calls', '@computer'], 
                    context, 
                    setContext
                  )}
              </Animated.View>
  
              <Animated.View entering={FadeInDown.delay(800)} style={styles.inputGroup}>
                <Text style={styles.label}>Type</Text>
                {renderSelectionChips(
                  ['inbox', 'next', 'project'], 
                  type, 
                  (value) => setType(value as 'inbox' | 'next' | 'project'), 
                  typeColors,
                  true
                )}
              </Animated.View>
  
              <Animated.View entering={FadeInDown.delay(800)} style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Calendar size={16} color="#ffffff" /> Due Date (Optional)
                </Text>
                <TouchableOpacity
                  onPress={showDatePickerModal}
                  style={styles.datePickerButton}
                >
                  <Text style={[styles.datePickerText, date && styles.datePickerTextSelected]}>
                    {date ? date.toLocaleDateString() : 'Select due date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  Platform.OS === 'ios' ? (
                    <Modal
                      visible={showDatePicker}
                      transparent={true}
                      animationType="slide"
                    >
                      <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalHeader}>
                            <TouchableOpacity
                              style={styles.modalHeaderButton}
                              onPress={() => setShowDatePicker(false)}
                            >
                              <Text style={[styles.modalHeaderText, { color: '#667eea' }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.modalHeaderButton}
                              onPress={() => setShowDatePicker(false)}
                            >
                              <Text style={[styles.modalHeaderText, { color: '#667eea', fontWeight: '600' }]}>Done</Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                            textColor="#000000"
                          />
                        </View>
                      </View>
                    </Modal>
                  ) : (
                    <DateTimePicker
                      value={date || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )
                )}
              </Animated.View>
  
              <Animated.View entering={SlideInRight.delay(900)}>
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleCreate}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f8fafc']}
                    style={styles.submitGradient}
                  >
                    <Sparkles size={20} color="#667eea" />
                    <Text style={styles.submitText}>Capture Task</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
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
    position: 'relative', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heading: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'System',
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  motivationCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  motivationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  motivationText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  formView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 160 : 140,
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    color: '#ffffff',
    fontSize: 17,
    marginBottom: 14,
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  titleInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    borderRadius: 16,
    padding: 18,
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    borderRadius: 16,
    padding: 18,
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    minHeight: 90,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    borderRadius: 16,
    padding: 18,
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  submitButton: {
    borderRadius: 20,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 10,
  },
  submitText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  datePickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  datePickerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '500',
  },
  datePickerTextSelected: {
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalHeaderButton: {
    padding: 10,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#667eea',
    borderRadius: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});