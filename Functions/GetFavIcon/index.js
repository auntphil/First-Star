const getFavicons = require('get-website-favicon')

module.exports = async function(req, res){
    const { url } = JSON.parse(req.payload)
    if( url ){
        let response = {}
        try{
            getFavicons(url)
                .then(response => {
                    response.success = true
                    res.json(response)
                })
        }catch(err){
            response = {
                success: false,
                message: err
            }
        }
    }
}