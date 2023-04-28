import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../utils/firebase"
import { LoadingMagnifyingGlass, LoadingThreeCircles } from "../Loading"
import {WishBox} from '../WishBox'
import '../../styles/ProductBox.css'

const ViewOne = ({user}) => {
    const listId = new URLSearchParams(window.location.search).get('id')
    const apiUrl = process.env.REACT_APP_API_URL

    const docRef = doc(db,"lists",listId)
    const colRef = collection(docRef, "wishes")

    const [list, setList] = useState({})
    const [wishes, setWishes] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    
    //New Wish
    const [showNewWish, setShowNewWish] = useState(false)
    const [loadingNewItem, setLoadingNewItem] = useState(false)
    const [wURL, setWURL] = useState("")
    const [wTitle, setWTitle] = useState("")
    const [wImageURL, setwImageURL] = useState("")


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
    },[docRef])

    const saveWish = async () => {
        const data ={
            image: wImageURL,
            title: wTitle,
            url: wURL
        }
        const docRef = await addDoc(colRef, data)
        const wish = {
            id: docRef.id,
            ...data
        }
        wishes.push(wish)
        setWishes(wishes)
        handleCancelWish()
    }

    const handleCancelWish = () => {
        setShowNewWish(false)
        setWURL('')
        setwImageURL('')
        setWTitle('')
    }

    const fetchWish = () => {
        setLoadingNewItem(true)
        setError(false)
        if( wURL === "" ) return
    
        fetch(`${apiUrl}get-product`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({"url": `${wURL}`})
            })
            .then( res => {
                if( res.status === 200){
                    res.json()
                        .then( async data => {
                        setWURL(data.url)
                        setwImageURL(data.image)
                        setWTitle(data.title)
                        setLoadingNewItem(false)
                        })
                }else{
                    setError(true)
                    setErrorMsg("Error Fetching")
                    setLoadingNewItem(false)
                }
            })
            .catch( err => {
                console.error(err)
                setError(true)
                setErrorMsg("Error Fetching Data")
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
                { wishes.length === 0 ?
                    <div>No Wishes</div>
                    :
                    wishes.map( wish => <WishBox wish={wish} key={wish.id} listId={listId} wishes={wishes} setWishes={setWishes} wishId={wish.id} user={user} />)
                }
                { showNewWish ?
                    <div className="product-box new-wish">
                        <div className='left-content' style={{backgroundImage: `url(${wImageURL})`}} >
                            { loadingNewItem ?
                                <LoadingMagnifyingGlass s={'70px'} />
                                :
                                ''
                            }
                            <input type="text" placeholder='Wish Image' value={wImageURL} onChange={(e) => setwImageURL(e.target.value)} className="new-image-url" />
                        </div>
                        <div className="right-content">
                            <div className="new-title-wrapper">
                                <input type="text" placeholder='Wish Title' className='title new-title' value={wTitle} onChange={(e) => {setWTitle(e.target.value)}} />
                            </div>
                            <div className="new-url-wrapper">
                                <input type="text" placeholder='Wish URL' value={wURL} onChange={(e) => setWURL(e.target.value)} /><button onClick={fetchWish}>Fetch Wish</button>
                            </div>
                            <div className='footer'>
                                <span>{ error ? errorMsg : ''}</span>
                                <span></span>
                                <span className="rightBtn"><button onClick={saveWish}>Save Wish</button></span>
                            </div>
                        </div>
                    </div>
                :
                ''
            }
            </div>
            { showNewWish ?
                <button onClick={handleCancelWish}>Cancel Wish</button>
                :
                <button onClick={() => {setShowNewWish(true)}}>Add Wish</button>
            }
        </div>
    )
}

export default ViewOne