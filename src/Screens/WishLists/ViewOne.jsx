import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../utils/firebase"
import { LoadingMagnifyingGlass, LoadingThreeCircles } from "../Loading"
import {WishBox} from '../WishBox'

const ViewOne = ({user}) => {
    const listId = new URLSearchParams(window.location.search).get('id')
    const apiUrl = process.env.REACT_APP_API_URL

    const docRef = doc(db,"lists",listId)
    const colRef = collection(docRef, "wishes")

    const [list, setList] = useState({})
    const [wishes, setWishes] = useState({})
    const [loading, setLoading] = useState(true)
    const [loadingNewItem, setLoadingNewItem] = useState(false)
    const [itemURL, setItemURL] = useState("")
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        const getList = async () => {
            const doc = await getDoc(docRef)
            const col = await getDocs(collection(docRef, "wishes"))
            
            let wishArray = []
            col.forEach( wish => {
                wishArray.push(wish)
            })
                        
            setList(doc)
            setWishes(wishArray)
            setLoading(false)
        }

        getList()
    },[])

    const saveProduct = async (data) => {
        const docRef = await addDoc(colRef, data)
        const wish = {
            id: docRef.id,
            ... data
        }
        return wish
    }

    const handleSubmit = (e) => {
        setLoadingNewItem(true)
        e.preventDefault()  //Prevent Default Form Submission
    
        if( itemURL === "" ) return   
    
        fetch(`${apiUrl}get-product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"url": `${itemURL}`})
        })
          .then( res => {
            res.json()
              .then( async data => {
                const newWish = await saveProduct(data)
                wishes.push(newWish)
                setWishes(wishes)
                setLoadingNewItem(false)
                setItemURL("")
              })
            })
            .catch( err => {
              console.error(err)
              setError(true)
              setErrorMsg("Error Retrieving Data")
              setLoadingNewItem(false)
          })
      }

    if(loading)return <LoadingThreeCircles />

    return(
        <div id="wrapper">
            <h2>{list.data().name}</h2>
            { error?
                <h5>{errorMsg}</h5>
                :
                <></>
            }
            <div id="product-wrapper">
                {wishes.map( wish => <WishBox wish={wish} key={wish.id} listId={listId} wishes={wishes} setWishes={setWishes} wishId={wish.id} user={user} />)}
                { loadingNewItem ? <div className="product-box-loading"><LoadingMagnifyingGlass s={'70px'} /></div> : '' }
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={itemURL} placeholder="Item URL" onChange={(e) => {setItemURL(e.target.value)}} />
                <input type="submit" value="Get Item" />
            </form>
        </div>
    )
}

export default ViewOne