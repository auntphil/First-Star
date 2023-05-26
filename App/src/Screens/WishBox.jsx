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
                    <div className='footer'>
                        <a href={wish.url[0]} target="_blank" rel="noreferrer" className='boringLink' key={wish.url[0]}>
                            <div className='favIcon' style={{backgroundImage: `url(${ wish.urlIcons[0] })`}}></div>
                        </a>
                        <a href={wish.url[1]} target="_blank" rel="noreferrer" className='boringLink' key={wish.url[1]}>
                            <div className='favIcon' style={{backgroundImage: `url(${ wish.urlIcons[1] })`}}></div>
                        </a>
                        <a href={wish.url[2]} target="_blank" rel="noreferrer" className='boringLink' key={wish.url[2]}>
                            <div className='favIcon' style={{backgroundImage: `url(${ wish.urlIcons[2] })`}}></div>
                        </a>
                        <div className='footer-space'>Priority</div>
                    </div>
                </div>
                <div className='remove-wish-wrapper'>
                    {
                        loading ?
                            <LoadingThreeCircles s={'22'} p={'0px'} />
                        :
                            user && listEdit ?
                                <div className="remove-wish-btn" onClick={handleRemoveWish}><FontAwesomeIcon icon={faTrash} style={{color: '#b12525' }} /><span className="remove-wish-text">Trash</span></div>
                            :
                            ''
                    }
                </div>
            </div>
        </div>
    )
}