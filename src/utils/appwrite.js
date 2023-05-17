import { Account, Client, Databases, ID } from 'appwrite'

const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT);

const account = new Account(client)
const databases = new Databases(client)

//User
const createUser = (email, password, name) => account.create(ID.unique(), email, password, name)
const loginUser = (email,password) => account.createEmailSession(email,password)
const getCurrentUser = () => account.get()
const logoutUser = () => account.deleteSessions()

//Databases
const createDocument = (databaseID, collectionID, data) => databases.createDocument(`${databaseID}`, `${collectionID}`, `${ID.unique()}`, data)
const listDocuments = (databaseID, collectionID, query) => databases.listDocuments(`${databaseID}`,`${collectionID}`, query)
const getDocument = (databaseID, collectionID, documentID) => databases.getDocument(`${databaseID}`, `${collectionID}`, `${documentID}`)
const deleteDocument = (databaseID, collectionID, documentID) => databases.deleteDocument(`${databaseID}`, `${collectionID}`, `${documentID}`)




export {account, client, createUser, loginUser, getCurrentUser, logoutUser, createDocument, listDocuments, getDocument, deleteDocument}