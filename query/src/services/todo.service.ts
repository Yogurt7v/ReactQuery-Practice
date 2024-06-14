import axios from "axios";

export type Todo = {
    id?: number;
    title: string;
    completed: boolean;
    userId: number;
}

export const URL = `https://jsonplaceholder.typicode.com/todos`

const todoService = async (id?: number) => {


    if (id === undefined) {
        return await axios.get<Todo[]>(`${URL}?_start=0&_limit=10`).then(res => res.data)
    }
    return await axios.get<Todo>(`${URL}/${id}`).then(res => res.data)
}


export default todoService