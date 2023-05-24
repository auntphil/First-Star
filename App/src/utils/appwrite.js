import { Account, Client, Databases, Functions, ID } from 'appwrite'

const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT);

const account = new Account(client)
const databases = new Databases(client)
const functions = new Functions(client)

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

//Functions
const createProductInfo = (url) => functions.createExecution("645594ed49b51c758c6d", `{"url" : "${url}"}`, true)
const getProductInfo = (id) => functions.getExecution("645594ed49b51c758c6d",`${id}`)
const createFavIcon = (url) => functions.createExecution("64642d1eda084906568e",`{"url" : "${url}"}`, true)
const getFavIcon = (id) => functions.getExecution("64642d1eda084906568e",`${id}`)




export {account, client,
    createUser, loginUser, getCurrentUser, logoutUser,
    createDocument, listDocuments, getDocument, deleteDocument,
    createProductInfo, getProductInfo,
    createFavIcon, getFavIcon
}