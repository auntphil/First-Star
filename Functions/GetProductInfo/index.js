const getProductData = require('get-product-name');

function cleanUrl(url){
    if(url.includes("www.amazon")){
        const parts = url.split("?")
        return parts[0]
    }
}

module.exports = async function(req, res){
    let { url } = JSON.parse(req.payload)
    if( url ){
        url = cleanUrl(url)
        let response = {}
        try{
            const response = await getProductData(url)
            response.url = url
            response.name = response.name.substring(0, 60).concat('...')
            response.success = true
            res.json(response)
        }catch(error){
            console.log(error)
            response = {
                success : false,
                message : error
            }
            res.json(response)
        }
    } else {
        console.log('No URL')
        response = {
            success : false,
            message : "Failed to retrieve item"
        }
        res.json(response)
    }

}
