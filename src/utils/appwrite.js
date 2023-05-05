import { Account, Client, ID } from 'appwrite'

const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT);

const account = new Account(client)

const createUser = (email, password, name) => account.create(ID.unique(), email, password, name)
const loginUser = (email,password) => account.createEmailSession(email,password)
const getCurrentUser = () => account.get()
const logoutUser = () => account.deleteSessions()




export {account, client, createUser, loginUser, getCurrentUser, logoutUser}