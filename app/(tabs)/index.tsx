import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import TaskForm from "../../components/TaskForm";
import TaskItem from "../../components/TaskItem";
import { supabase } from "../../lib/supabase";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Load Error", error.message);
      return;
    }
    if (data) setTasks(data);
  }

  async function addTask() {
    if (task.trim() === "") {
      Alert.alert("Empty", "Please enter a task first");
      return;
    }
    const { error } = await supabase
      .from("Task")
      .insert([{ title: task.trim(), completed: false }]);

    if (error) {
      Alert.alert("Add Error", error.message);
      return;
    }
    setTask("");
    loadTasks();
  }

  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from("Task")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) {
      Alert.alert("Update Error", error.message);
      return;
    }
    loadTasks();
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("Task").delete().eq("id", id);

    if (error) {
      Alert.alert("Delete Error", error.message);
      return;
    }
    loadTasks();
  }

  function handleAddTask() {
    addTask();
  }

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <TaskForm task={task} setTask={setTask} onAdd={handleAddTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem item={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
        }
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2A44",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 14,
  },
});
