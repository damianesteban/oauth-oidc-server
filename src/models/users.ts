
export type User = {
    id: number,
    username: string,
    password: string
}

// Users data
const users: User[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin'
    },
    {
        id: 2,
        username: 'user',
        password: 'user'
    }
]

// User database
export const userDatabase = {
    findByUsername: (username: string): User | undefined => users.find(user => user.username === username),
    findById: (id: number): User | undefined => users.find(user => user.id === id),
}

