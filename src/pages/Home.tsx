import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { Header } from "../components/Header";
import { Task, TasksList } from "../components/TasksList";
import { TodoInput } from "../components/TodoInput";

export type EditTaskArgs = {
  taskId: number;
  taskNewTitle: string;
};

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function verifyIfTaskExist(title: string): Task | null {
    const taskAlreadyCreated = tasks.find((task) => task.title === title);
    if (taskAlreadyCreated) {
      return taskAlreadyCreated;
    }
    return null;
  }

  function handleAddTask(title: string) {
    const newTask = {
      id: new Date().getTime(),
      title,
      done: false,
    };

    const haveTaskWithSameTitle = verifyIfTaskExist(title);

    if (haveTaskWithSameTitle) {
      return Alert.alert(
        "Task já cadastrada",
        "Você não pode cadastar uma task com o mesmo nome"
      );
    }

    setTasks([...tasks, newTask]);
  }

  function handleToggleTaskDone(id: number) {
    //const updatedTasks = [...tasks]; //errado, por ser objeto, é passado a referencia e nao a copia (shallow copy)
    const updatedTasks = tasks.map((task) => ({ ...task }));

    updatedTasks.forEach((task) => {
      if (task.id === id) {
        task.done = !task.done;
      }
    });
    setTasks(updatedTasks);
  }

  function handleRemoveTask(id: number) {
    Alert.alert(
      "Remover item",
      "Tem certeza que você deseja remover este item?",
      [
        { text: "nao", style: "cancel" },
        {
          text: "sim",
          style: "destructive",
          onPress: () => setTasks(tasks.filter((task) => task.id !== id)),
        },
      ]
    );
  }

  function handleEditTask({ taskId, taskNewTitle }: EditTaskArgs) {
    const updatedTasks = tasks.map((task) => ({ ...task }));
    updatedTasks.forEach((task) => {
      if (task.id === taskId) {
        task.title = taskNewTitle;
      }
    });
    setTasks(updatedTasks);
  }

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      <TasksList
        tasks={tasks}
        toggleTaskDone={handleToggleTaskDone}
        removeTask={handleRemoveTask}
        editTask={handleEditTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
  },
});
