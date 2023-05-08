import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../utils/firebase"
import { LoadingMagnifyingGlass, LoadingThreeCircles } from "../Loading"
import {WishBox} from '../WishBox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faPlus, faSave, faX } from "@fortawesome/free-solid-svg-icons"

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

    //Edit Wish List
    const [listEdit, setListEdit] = useState(false)
    const [listTitle, setListTitle] = useState('')
    
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

            setListTitle(doc.data().name)
                        
            setList(doc)
            setWishes(wishArray)
            setLoading(false)
        }

        getList()
    },[])

    const updateListTitle = async () => {
        await updateDoc(docRef,{name: listTitle})
        setListEdit(false)
    }

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
            {
                listEdit ?
                    <h2><input type="text" value={listTitle} onChange={(e) => setListTitle(e.target.value)} /></h2>
                :
                    <h2>{listTitle}</h2>
            }
            <div id="product-wrapper">
                { wishes.length === 0 ?
                    <div>No Wishes</div>
                    :
                    wishes.map( wish => <WishBox wish={wish} key={wish.id} listId={listId} wishes={wishes} setWishes={setWishes} wishId={wish.id} user={user} listEdit={listEdit} />)
                }
                { showNewWish ?
                    <div className="product-box new-wish">
                        <div className='left-content' style={{backgroundImage: `url(${wImageURL})`}} >
                            { loadingNewItem ?
                                <LoadingMagnifyingGlass s={'70px'} />
                                :
                                ''
                            }
                            <input type="text" placeholder='New Wish Image' value={wImageURL} onChange={(e) => setwImageURL(e.target.value)} className="new-image-url" />
                        </div>
                        <div className="right-content">
                            <div className="new-title-wrapper">
                                <input type="text" placeholder='New Wish Title' className='title new-title' value={wTitle} onChange={(e) => {setWTitle(e.target.value)}} />
                            </div>
                            <div className="new-url-wrapper">
                                <input type="text" placeholder='New Wish URL' value={wURL} onChange={(e) => setWURL(e.target.value)} /><button onClick={fetchWish}>Fetch Wish</button>
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

            <div id="wish-floating-btn">
                {
                    !listEdit && !showNewWish ?
                        <>
                            <div onClick={() => {setShowNewWish(true)}} className="floating-btn" id="new-wish-btn"><FontAwesomeIcon icon={faPlus} style={{color: '#FFFFFF', fontSize: '2rem'}}/></div>
                            <div onClick={() => {setListEdit(true)}}className="floating-btn" id="edit-list-btn"><FontAwesomeIcon icon={faPencil} style={{color: '#FFFFFF', fontSize: '0.75rem'}}/></div>
                        </>
                    :
                        <>
                            {
                                listEdit ?
                                    <>
                                        <div onClick={updateListTitle} className="floating-btn" id="new-wish-btn"><FontAwesomeIcon icon={faSave} style={{color: '#FFFFFF', fontSize: '2rem'}}/></div>
                                        <div onClick={() => {setListEdit(false)}}className="floating-btn" id="close-list-btn"><FontAwesomeIcon icon={faX} style={{color: '#FFFFFF', fontSize: '0.75rem'}}/></div>
                                    </>
                                :
                                    <>
                                        {
                                            showNewWish ?
                                                <>
                                                    <div onClick={saveWish} className="floating-btn" id="new-wish-btn"><FontAwesomeIcon icon={faSave} style={{color: '#FFFFFF', fontSize: '2rem'}}/></div>
                                                    <div onClick={handleCancelWish}className="floating-btn" id="close-list-btn"><FontAwesomeIcon icon={faX} style={{color: '#FFFFFF', fontSize: '0.75rem'}}/></div>
                                                </>
                                            :
                                                ''
                                        }
                                    </>
                            }
                        </>
                }
            </div>
        </div>
    )
}

export default ViewOne