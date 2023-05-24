import { useEffect, useState } from "react"
import { LoadingMagnifyingGlass, LoadingThreeCircles } from "./Loading"
import {WishBox} from './WishBox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPencil, faPlus, faSave, faX } from "@fortawesome/free-solid-svg-icons"
import { createDocument, createFavIcon, createProductInfo, deleteDocument, getDocument, getFavIcon, getProductInfo, listDocuments } from "../utils/appwrite"
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
    const [icon, setIcon] = useState("")
    const [iconLoading, setIconLoading] = useState(false)
    
    
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
        
        const icons = []
        if( wURL1.length !== 0 ){icons.push(icon)}
        if( wURL2.length !== 0 ){icons.push('')}
        if( wURL3.length !== 0 ){icons.push('')}


        const wish = {
            "name":wTitle,
            "url": urls,
            "urlIcons": icons,
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
        setIcon('')
    }

    const checkFunctionStatus = async (id, getFunc, func, count = 0) => {
        getFunc(id)
            .then( funcData => {
                if( funcData.status === "completed" || funcData.status === "failed" ){
                    let data = JSON.parse(funcData.response)
                    if(data.success){
                        func(data)
                    }else{
                        console.log("Failed to load item")
                        setErrorMsg("Failed to load item")
                    }
                } else {    
                    count++
                    if(count < 20){
                        setTimeout(() => checkFunctionStatus(id, getFunc, func, count), 2000);
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
            
            fetchIcon()
            createProductInfo(wURL1)
            .then( async response => {
                setTimeout(() => checkFunctionStatus(response.$id, getProductInfo, updateWish), 2000);
            }, error => {
                console.log(error)
        })
    }
    
    const updateWish = (data) => {
        setwImageURL(data.image)
        setWTitle(data.name)
        setWURL1(data.url)
        setLoadingNewItem(false)
    }

    const fetchIcon = async () => {
        setIconLoading(true)
        setError(false)
        if( wURL1 === "" ) return

        createFavIcon(wURL1)
            .then( async response => {
                setTimeout(() => checkFunctionStatus(response.$id, getFavIcon, updateIcon), 2000)
            })
    }

    const updateIcon = (data) => {
        setIcon(data.icons[0].src)
        setIconLoading(false)
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
                    <div className="product-box">
                        <h2>Make a Wish</h2>
                        <div className="product-box-wrapper new-wish">
                            <div className='left-content' style={{backgroundImage: `url(${wImageURL})`}} >
                                { loadingNewItem ?
                                    <LoadingMagnifyingGlass s={'70px'} />
                                    :
                                    ''
                                }
                                <div className="image-input-wrapper">

                                    <div className="input-wrapper-inner single">
                                        <input type="text" placeholder='Image Url' value={wImageURL} onChange={(e) => setwImageURL(e.target.value)} className="new-image-url" />
                                    </div>
                                </div>  
                            </div>
                            <div className="right-content">
                                <div className="input-wrapper-inner single">
                                    <input type="text" placeholder='Title' className='title new-title ' value={wTitle} onChange={(e) => {setWTitle(e.target.value)}} />
                                </div>
                                <div className="new-url-wrapper">
                                    <div className="input-wrapper-inner">
                                        <div className="favIcon" style={{backgroundImage: `url(${icon})`}}>
                                        { iconLoading ?
                                            <LoadingMagnifyingGlass s={'29'} p={'0px'} />
                                            :
                                            ''
                                        }
                                        </div>
                                        <input type="text" placeholder='1st Link' value={wURL1} onChange={(e) => setWURL1(e.target.value)} />
                                        <button onClick={fetchWish} className="btn btn-info">
                                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: '#FFFFFF', fontSize: '0.75rem'}} />
                                        </button>
                                    </div>
                                    <div className="input-wrapper-inner">
                                        <div className="favIcon"></div>
                                        <input type="text" placeholder='2nd Link' value={wURL2} onChange={(e) => setWURL2(e.target.value)} />
                                    </div>
                                    <div className="input-wrapper-inner">
                                        <div className="favIcon"></div>
                                        <input type="text" placeholder='3rd Link' value={wURL3} onChange={(e) => setWURL3(e.target.value)} />
                                    </div>
                                </div>
                                <div className='footer'>
                                    <span>{ error ? errorMsg : ''}</span>
                                    <span></span>
                                    <span className="rightBtn"></span>
                                </div>
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
                        <div id="bottom-button-wrapper">
                            <div onClick={() => {setShowNewWish(true)}} className="bottom-button left" id="new-wish-btn"><FontAwesomeIcon icon={faPlus} style={{color: '#FFFFFF', fontSize: '2rem'}}/></div>
                            <div onClick={() => {setListEdit(true)}}className="bottom-button right" id="edit-list-btn"><FontAwesomeIcon icon={faPencil} style={{color: '#FFFFFF', fontSize: '1.25rem'}}/></div>
                        </div>
                    :
                        <>
                            {
                                listEdit ?
                                    <div id="bottom-button-wrapper">
                                        <div onClick={updateListTitle} className="bottom-button left" id="new-wish-btn"><FontAwesomeIcon icon={faSave} style={{color: '#FFFFFF', fontSize: '2rem'}}/></div>
                                        <div onClick={() => {setListEdit(false)}}className="bottom-button right" id="close-list-btn"><FontAwesomeIcon icon={faX} style={{color: '#FFFFFF', fontSize: '1.25rem'}}/></div>
                                    </div>
                                :
                                    <>
                                        {
                                            showNewWish ?
                                                <div id="bottom-button-wrapper">
                                                    <div onClick={saveWish} className="bottom-button left" id="new-wish-btn"><FontAwesomeIcon icon={faSave} style={{color: '#FFFFFF', fontSize: '2rem'}}/></div>
                                                    <div onClick={handleCancelWish}className="bottom-button right" id="close-list-btn"><FontAwesomeIcon icon={faX} style={{color: '#FFFFFF', fontSize: '1.25rem'}}/></div>
                                                </div>
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