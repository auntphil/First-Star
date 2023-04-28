import { deleteDoc, doc } from 'firebase/firestore'
import { useState } from 'react'
import '../styles/ProductBox.css'
import { db } from '../utils/firebase'
import {LoadingThreeCircles} from '../Screens/Loading'

export const WishBox = ({wish, listId, wishId, wishes, setWishes, user}) => {
    let data = {}

    let [loading, setLoading] = useState(false)

    const removeWish = async () => {
        setLoading(true)
        try{
            //Remove from FireStore
            const wishRef = doc(db, `lists/${listId}/wishes`, wishId)
            await deleteDoc(wishRef)

            //Remove from State
            setWishes(wishes.filter( w => w.id !== wishId))
        }catch(err){
            console.error(err)
        }
    }

    if(wish.title){
        data = wish
    }else{
        data = wish.data()
    }
    return(
        <div className='product-box'>
            <a href={data.url} target="_blank">
                <div className="left-content"
                    style={{backgroundImage: `url(${data.image})`}}
                >
            </div>
            </a>
            <div className='right-content'>
                <a href={data.url} target="_blank" className='boringLink'>
                    <span className='title'>{data.title}</span>
                </a>
                <span className='footer'>
                    <span className='footer-space'>Store Logo</span>
                    <span className='footer-space'></span>
                    <span className='footer-space removeBtn'>
                        {
                            loading ?
                                <LoadingThreeCircles s={'22'} p={'0px'} />
                            :
                                user ?
                                    <button onClick={removeWish}>Remove Wish</button>
                                :
                                ''
                        }
                    </span>
                </span>
            </div>
        </div>
    )
}