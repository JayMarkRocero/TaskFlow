import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item)}
            onLongPress={() => deleteTask(item.id)}
          >
            <View style={styles.taskRow}>
              <MaterialIcons
                name={item.completed ? "check-box" : "check-box-outline-blank"}
                size={20}
                color={item.completed ? "#2E5BBA" : "#5A6472"}
              />
              <Text
                style={[styles.taskText, item.completed && styles.taskTextDone]}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
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
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2E5BBA",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskText: {
    fontSize: 15,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 14,
  },
});
