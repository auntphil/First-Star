export const ProductBox = (product) => {
    console.log(product)
    return(
        <div className='product-box'>
            <div className="left-content"
                style={{backgroundImage: `url(${product.product.image})`}}
            >

                <a href={product.product.url} target="_blank">
                    <img className="image" src={product.product.image} />
                </a>
            </div>
            <div className='right-content'>
                <span className='title'>{product.product.title}</span>
                <span className='price'>
                    <a href={product.product.url} target="_blank">
                        {product.product.price}
                    </a>
                </span>
            </div>
        </div>
    )
}