import { useState, useEffect } from "react";



export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const useFetchTodos = () => {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const response = await fetch("https://jsonplaceholder.typicode.com/todos");
            const data = await response.json();

            // Optionally, map data to ensure it matches the Todo interface
            const listOfTodos: Todo[] = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                completed: item.completed,
            }));

            setTodos(listOfTodos);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTodos()
    }, []);

    return {loading, error, todos}
}

export default useFetchTodos