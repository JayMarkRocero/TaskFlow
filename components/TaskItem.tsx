import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  item: Task;
  onToggle: (item: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ item, onToggle, onDelete }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={styles.taskRow}>
        <MaterialIcons
          name={item.completed ? "check-box" : "check-box-outline-blank"}
          size={20}
          color={item.completed ? "#2E5BBA" : "#5A6472"}
        />
        <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
