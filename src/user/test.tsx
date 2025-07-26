import useFetchTodos from "../hooks/useFetchTodos";

const TestingComponent = () => {
  const { loading, error, todos } = useFetchTodos();

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span className="text-2xl font-bold">{todo.id}</span> {todo.title}{" "}
            {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TestingComponent;
