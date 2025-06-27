export interface ItodoPayload {
    title: string;
    completed: boolean;
}

export interface Itodo {
    _id: string;
    title?: string;
    completed?: boolean;
}

export interface TodoStoreType {
    todos: Itodo[]
}