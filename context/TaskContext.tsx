import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  description: string;
  context: string;
  dueDate: string;
  type: 'inbox' | 'next' | 'project';
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string, context: string, dueDate: string, type: Task['type'], priority?: Task['priority']) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  getTasksByContext: (context: string) => Task[];
  getTasksByType: (type: Task['type']) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = '@gtd_tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from storage on app start
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to storage whenever tasks change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = (
    title: string, 
    description: string, 
    context: string, 
    dueDate: string, 
    type: Task['type'],
    priority: Task['priority'] = 'medium'
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      context,
      dueDate,
      type,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksByContext = (context: string) => {
    return tasks.filter((task) => task.context === context);
  };

  const getTasksByType = (type: Task['type']) => {
    return tasks.filter((task) => task.type === type);
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        deleteTask, 
        updateTask, 
        toggleTaskComplete,
        getTasksByContext,
        getTasksByType
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};