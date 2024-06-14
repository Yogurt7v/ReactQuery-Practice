import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import todoService from "./services/todo.service";
import { Todo } from "./services/todo.service";
import { useState } from "react";
import { URL } from "./services/todo.service";
import "./App.css";
import axios from "axios";


function App() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState({
    title: "",
    id: 1,
  });

  const mutation = useMutation({
    mutationFn: async (newTodo) => {
      return await axios.patch(`${URL}/1`, newTodo);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(["todos"], (old: Todo[]) => {
        old.map((todo) => {
          if (todo.id === result.data.id) {
            todo.title = result.data.title;
          }
          return todo;
        });
      });
    },
  });

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: () => todoService(),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <div className="wrapper">
        <h1>Todos</h1>
        <button onClick={() => queryClient.invalidateQueries()}>
          Refresh data
        </button>
        <h2>Add new todo</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(newTodo);
          }}
        >
          <input
            type="text"
            name="title"
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            value={newTodo.title}
            placeholder="title"
          />
          <input
            type="number"
            name="id"
            onChange={(e) =>
              setNewTodo({ ...newTodo, id: parseInt(e.target.value) })
            }
            value={newTodo.id}
            placeholder="userId"
          />
          <button type="submit">Submit</button>
        </form>
        {Array.isArray(data) ? (
          <div>
            {data?.map((todo: Todo) => (
              <p key={todo?.id}>
                {todo?.id}) {todo?.title}
              </p>
            ))}
          </div>
        ) : (
          <h1>
            Todos №{data?.id}: {data?.title}{" "}
          </h1>
        )}
      </div>
    </>
  );
}

export default App;
