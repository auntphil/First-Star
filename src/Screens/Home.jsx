import { ProductBox } from './ProductBox';
import React, { useState } from 'react';

function Home(){
  const apiUrl = process.env.REACT_APP_API_URL

  const [itemURL, setItemURL] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault()  //Prevent Default Form Submission

    if( itemURL === "" ) return   

    fetch(`${apiUrl}get-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"url": `${itemURL}`})
    })
      .then( res => {
        res.json()
          .then( data => {
            products.push(data)
            setProducts(products)
            setLoading(false)
            setItemURL("")
          })
        })
        .catch( err => {
          console.error(err)
          setError(true)
          setErrorMsg("Error Retrieving Data")
          setLoading(false)
      })
  }
    return(
      <div id="wrapper">
          { loading?
          <h5>Loading...</h5>
          :
          <></>
        }
        <div id="product-wrapper">
          {
            products.map( product => <ProductBox product={product} /> )
          }
        </div>
        { error?
          <h5>{errorMsg}</h5>
          :
          <></>
        }
        <form onSubmit={handleSubmit}>
          <input type="text" value={itemURL} placeholder="Item URL" onChange={(e) => {setItemURL(e.target.value)}} />
          <input type="submit" value="Get Item" />
        </form>
      </div>
    )
}

export default Home