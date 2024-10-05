
export type Client = {
    id: string,
    secret: string,
    redirectUri: string
}

// Clients data
const clients: Client[] = [
    {
        id: '1',
        secret: 'client_secret_1',
        redirectUri: 'http://localhost:3000/callback'
    }
]

// Client database
export const clientDatabase = {
    findById: (id: string): Client | undefined => clients.find(client => client.id === id),
    findByClientId: (clientId: string, clientSecret: string): Client | undefined => clients.find(client => client.id === clientId && client.secret === clientSecret),
}  
