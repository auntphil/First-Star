import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Query } from 'appwrite';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createDocument, listDocuments } from '../utils/appwrite';
import { LoadingThreeCircles } from './Loading';

const Home = ( props ) => {
  const { user } = props
  const [wishLists, setWishLists] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewWish, setShowNewWish] = useState(false)
  const [wishListTitle, setWishListTitle] = useState([])

  useEffect(() => {
    const getWishLists = async() => {
      listDocuments('wishes', 'wish-lists',[])
        .then( response => {
          console.log(response)
          setWishLists(response.documents)
          setLoading(false)
        })
        .catch( error => {
          console.log(error)
        })
    }
    getWishLists()
  }, [])

  const handleShowNewWish = () => showNewWish ? setShowNewWish(false) : setShowNewWish(true)

  const handleSaveList = () => {
    if(wishListTitle.length < 3) return
    const data = {
      "name": `${wishListTitle}`
    }
    createDocument('wishes', 'wish-lists', data)
      .then( response => {
        wishLists.push(response)
        setWishLists(wishLists)
        setShowNewWish(false)
      } )
      .catch( error => console.log(error))
  }

  if(loading) return <LoadingThreeCircles />

  if (user) {
    //User Logged In
    return(
      <div id="wrapper">
        { wishLists === null || wishLists.length === 0 ?
          <div>The Sky Is Empty Tonight<br />Start a List</div>
        :
          <div>
            <ul>
              {wishLists.map(list => (
                <Link to={`/wishes?list=${list.$id}`} key={list.$id}>
                <li>{list.name} ({list.wishes.length})</li>
                </Link>
              ))}
            </ul>
          </div>
        }
        { showNewWish ? <div className='modal-wrapper'>
          <div className='modal-inner-wrapper'>
            <h3 className='title'>New Wish List</h3>
            <div className='modal-inputs'>
              <input type="text" placeholder='List Name' value={wishListTitle} onChange={(e) => setWishListTitle(e.target.value)} />
            </div>
            <div className='modal-buttons'>
              <button onClick={handleShowNewWish} className='btn btn-outline-danger'>Cancel</button>
              <button onClick={handleSaveList} className='btn btn-success' >Save</button>
            </div>
          </div>
            
        </div> : ''}
        { !showNewWish ? <div onClick={handleShowNewWish} className="floating-btn" id="new-wish-btn"><FontAwesomeIcon icon={faPlus} style={{color: '#FFFFFF', fontSize: '2rem'}}/></div> : '' }
      </div>
    )
  }else{
    //Not Logged In
    return(
      <div id="wrapper">
        Not Logged in
      </div>
    )
  }
}

export default Home