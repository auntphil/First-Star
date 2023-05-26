import { useEffect, useState } from "react"
import { LoadingMagnifyingGlass, LoadingThreeCircles } from "./Loading"
import {WishBox} from './WishBox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPencil, faPlus, faSave, faX } from "@fortawesome/free-solid-svg-icons"
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
    const [wishURLs, setWishURLs] = useState(["","",""])
    const [wTitle, setWTitle] = useState("")
    const [wImageURL, setwImageURL] = useState("")

    const [wishIcons, setWishIcons] = useState(["","",""])
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
        if( wishURLs[0].length !== 0 ){urls.push(wishURLs[0])}
        if( wishURLs[1].length !== 0 ){urls.push(wishURLs[1])}
        if( wishURLs[2].length !== 0 ){urls.push(wishURLs[2])}
        
        const icons = []
        if( wishURLs[0].length !== 0 ){icons.push(wishIcons[0])}
        if( wishURLs[1].length !== 0 ){icons.push(wishIcons[1])}
        if( wishURLs[2].length !== 0 ){icons.push(wishIcons[2])}


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
        setWishURLs(["","",""])
        setwImageURL('')
        setWTitle('')
        setWishIcons(["","",""])
    }

    const checkFunctionStatus = async (param, getFunc, func, id, count = 0) => {
        getFunc(param)
            .then( funcData => {
                if( funcData.status === "completed" || funcData.status === "failed" ){
                    let data = JSON.parse(funcData.response)
                    if(data.success){
                        func(data, id)
                    }else{
                        console.log("Failed to load item")
                        setErrorMsg("Failed to load item")
                    }
                } else {    
                    count++
                    if(count < 20){
                        setTimeout(() => checkFunctionStatus(param, getFunc, func, id, count), 2000);
                    }else{
                        console.log("Failed to load item")
                        setErrorMsg("Failed to load item")
                    }
                }
            }, error => {
                console.log(error)
            })
        }
        
        
        const fetchWish = async (id) => {
            setLoadingNewItem(true)
            setError(false)
            if( wishURLs[0] === "" ) return
            
            fetchIcon(id)
            createProductInfo(wishURLs[0])
            .then( async response => {
                setTimeout(() => checkFunctionStatus(response.$id, getProductInfo, updateWish, id), 2000);
            }, error => {
                console.log(error)
        })
    }

    const handleWishURLChange = (id, value) => {
        fetchIcon(id, value)
        const temp = [...wishURLs]
        temp[id] = value
        setWishURLs(temp)
    }
    
    const updateWish = (data, id) => {
        const temp = [...wishURLs]
        temp[id] = data.url
        setwImageURL(data.image)
        setWTitle(data.name)
        setWishURLs(temp)
        setLoadingNewItem(false)
    }

    const fetchIcon = (id, value = '') => {
        if( value === "" ) return
        if( value === ''){
            value = wishURLs[id]
        }
        setIconLoading(true)
        setError(false)

        try{
            let newURL = new URL(value)
            const temp = [...wishIcons]
            temp[id] = `${newURL.origin}/favicon.ico`
            setWishIcons(temp)
        }catch(error) {}

        setIconLoading(false)
    }

    if(loading)return <LoadingThreeCircles />

    return(
        <div id="wrapper">
            <div>
                {
                    listEdit ?
                        <h2><input type="text" value={listTitle} onChange={(e) => setListTitle(e.target.value)} /></h2>
                    :
                        <h2>{listTitle}</h2>
                }
            </div>
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
            </div>
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
                                    <div className="favIcon" style={{backgroundImage: `url(${wishIcons[0]})`}}>
                                    { iconLoading ?
                                        <LoadingMagnifyingGlass s={'29'} p={'0px'} />
                                        :
                                        ''
                                    }
                                    </div>
                                    <input type="text" placeholder='1st Link' value={wishURLs[0]} onChange={(e) => handleWishURLChange(0,e.target.value)} />
                                    <button onClick={() => {fetchWish(0)}} className="btn btn-info">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: '#FFFFFF', fontSize: '0.75rem'}} />
                                    </button>
                                </div>
                                <div className="input-wrapper-inner">
                                    <div className="favIcon" style={{backgroundImage: `url(${wishIcons[1]})`}}>
                                        { iconLoading ?
                                            <LoadingMagnifyingGlass s={'29'} p={'0px'} />
                                            :
                                            ''
                                        }
                                    </div>
                                    <input type="text" placeholder='2nd Link' value={wishURLs[1]} onChange={(e) => handleWishURLChange(1,e.target.value)} />
                                    <button onClick={() => {fetchIcon(1)}} className="btn btn-info">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: '#FFFFFF', fontSize: '0.75rem'}} />
                                    </button>
                                </div>
                                <div className="input-wrapper-inner">
                                    <div className="favIcon" style={{backgroundImage: `url(${wishIcons[2]})`}}>
                                        { iconLoading ?
                                            <LoadingMagnifyingGlass s={'29'} p={'0px'} />
                                            :
                                            ''
                                        }
                                    </div>
                                    <input type="text" placeholder='3rd Link' value={wishURLs[2]} onChange={(e) => handleWishURLChange(2,e.target.value) } />
                                    <button onClick={() => {fetchIcon(2)}} className="btn btn-info">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: '#FFFFFF', fontSize: '0.75rem'}} />
                                    </button>
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