import { useEffect, useState } from "react"
import { LoadingMagnifyingGlass, LoadingThreeCircles } from "./Loading"
import {WishBox} from './WishBox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faPlus, faSave, faX } from "@fortawesome/free-solid-svg-icons"
import { createDocument, createProductInfo, deleteDocument, getDocument, getProductInfo, listDocuments } from "../utils/appwrite"
import { Query } from "appwrite"

const Wishes = ({user}) => {
    const listId = new URLSearchParams(window.location.search).get('list')

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
    const [wURL1, setWURL1] = useState("")
    const [wURL2, setWURL2] = useState("")
    const [wURL3, setWURL3] = useState("")
    const [wTitle, setWTitle] = useState("")
    const [wImageURL, setwImageURL] = useState("")
    
    
    useEffect(() => {
        const getList = async () => {
            getDocument('wishes','wish-lists', `${listId}`) 
            .then( list =>{
                setListTitle(list.name)
                listDocuments('wishes','wishes',[Query.equal('wishLists',[`${listId}`])])
                .then (wishes => {
                    setWishes(wishes.documents)
                    setLoading(false)
                })
                .catch(error => {
                    console.log(error)
                    setWishes([])
                    setLoading(false)
                })
            })
            .catch( error => {
                console.log(error)
                setLoading(false)
            })
        }
        
        getList()
    },[listId])
    
    const updateListTitle = async () => {
    }
    
    const saveWish = async () => {
        const urls = []
        if( wURL1.length !== 0 ){urls.push(wURL1)}
        if( wURL2.length !== 0 ){urls.push(wURL2)}
        if( wURL3.length !== 0 ){urls.push(wURL3)}


        const wish = {
            "name":wTitle,
            "url": urls,
            "image":wImageURL.length === 0 ? null : wImageURL,
            "wishLists":listId
        }
        createDocument('wishes','wishes',wish)
        .then(response => {
            wishes.push(response)
            setWishes(wishes)
            handleCancelWish()
        })
        .catch(error => console.log(error))
    }

    const handleDeleteWish = async (id) => {
        try{
            //Remove from Datastore
            await deleteDocument('wishes','wishes',id)
            //Successfull
            setWishes(wishes.filter( w => w.$id !== id))
            return true
        }catch(err){
            console.error(err)
            return false
        }
    }

    const handleCancelWish = () => {
        setShowNewWish(false)
        setWURL1('')
        setWURL2('')
        setWURL3('')
        setwImageURL('')
        setWTitle('')
    }

    const checkFunctionStatus = async (id, count = 0) => {
        getProductInfo(id)
            .then( funcData => {
                if( funcData.status === "completed" || funcData.status === "failed" ){
                    let data = JSON.parse(funcData.response)
                    if(data.success){
                        console.log(data)
                        setwImageURL(data.image)
                        setWTitle(data.name)
                        setWURL1(data.url)
                    }else{
                        console.log("Failed to load item")
                        setErrorMsg("Failed to load item")
                    }
                    setLoadingNewItem(false)
                } else {    
                    count++
                    if(count < 10){
                        setTimeout(() => checkFunctionStatus(id, count), 2000);
                    }else{
                        console.log("Failed to load item")
                        setErrorMsg("Failed to load item")
                    }
                }
            }, error => {
                console.log(error)
            })
    }

    const fetchWish = async () => {
        setLoadingNewItem(true)
        setError(false)
        if( wURL1 === "" ) return

        createProductInfo(wURL1)
            .then( async response => {
                setTimeout(() => checkFunctionStatus(response.$id), 2000);
            }, error => {
                console.log(error)
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
                    wishes.map( wish => <WishBox
                        wish={wish}
                        key={wish.$id}
                        wishId={wish.$id}
                        user={user}
                        listEdit={listEdit}
                        handleDeleteWish={handleDeleteWish}
                        />)
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
                                <input type="text" placeholder='New Wish URL' value={wURL1} onChange={(e) => setWURL1(e.target.value)} /><button onClick={fetchWish}>Fetch Wish</button>
                                <input type="text" placeholder='New Wish URL' value={wURL2} onChange={(e) => setWURL2(e.target.value)} /><button onClick={fetchWish}>Fetch Wish</button>
                                <input type="text" placeholder='New Wish URL' value={wURL3} onChange={(e) => setWURL3(e.target.value)} /><button onClick={fetchWish}>Fetch Wish</button>
                            </div>
                            <div className='footer'>
                                <span>{ error ? errorMsg : ''}</span>
                                <span></span>
                                <span className="rightBtn"></span>
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

export default Wishes