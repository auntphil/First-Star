import '../styles/ProductBox.css'
export const WishBox = ({wish}) => {
    let data = {}
    if(wish.title){
        data = wish
    }else{
        data = wish.data()
    }
    return(
        <div className='product-box'>
            <div className="left-content"
                style={{backgroundImage: `url(${data.image})`}}
            >

                <a href={data.url} target="_blank">
                    <img className="image" src={data.image} />
                </a>
            </div>
            <div className='right-content'>
                <span className='title'>{data.title}</span>
                <span className='price'>
                    <a href={data.url} target="_blank">
                        {data.price}
                    </a>
                </span>
            </div>
        </div>
    )
}