import { useEffect, useState } from 'react'
import {LoadingThreeCircles} from '../Screens/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const WishBox = ({wish, wishId, user, listEdit, handleDeleteWish}) => {

    let [loading, setLoading] = useState(false)
    let [errorMsg, setErrorMsg] = useState('')

    useEffect( () => {
    }, [])

    const handleRemoveWish = async (id) => {
        setLoading(true)
        const status = await handleDeleteWish(wishId)
        if( !status ){
            setErrorMsg('Failed to remove wish')
        }
        setLoading(false)
    }

    return(
        <div className='product-box item'>
            <div className="product-box-wrapper">
                <div className="left-content" style={{backgroundImage: `url(${wish.image})`}} ></div>
                <div className='right-content'>
                    <div className='title'>{wish.name}</div>
                    <span className='footer'>
                        <span className='footer-space'>
                            {wish.url.map( url => (
                                <a href={url} target="_blank" rel="noreferrer" className='boringLink' key={url}>Link</a>
                            ))}
                        </span>
                        <span className='footer-space'>Priority</span>
                    </span>
                </div>
                <span className='remove-wish-wrapper'>
                    {
                        loading ?
                            <LoadingThreeCircles s={'22'} p={'0px'} />
                        :
                            user && listEdit ?
                                <div className="remove-wish-btn" onClick={handleRemoveWish}><FontAwesomeIcon icon={faTrash} style={{color: '#b12525' }} /><span className="remove-wish-text">Trash</span></div>
                            :
                            ''
                    }
                </span>
            </div>
        </div>
    )
}