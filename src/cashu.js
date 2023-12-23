const CASHU_URL = 'https://legend.lnbits.com/cashu/'
const WALLET_URL = 'api/v1/wallet'
const CASHU_MINT = 'TGFJLcXbX5Kw8p4WYP6fkS'
const MINT_ID_URL = `mint/${CASHU_MINT}/`
const CASHU_WALLET = '2278486a2cf04aae9d8ff1fb0ac3da20'
const USER_ID = '67a443f17085449186a3186b62ba3e26'


const getData = async (url, apikey, content_type) => {
    const headers = new Headers()
    if (apikey) {
        headers.append('X-Api-Key', apikey)
    }
    if (content_type) {
        headers.append('Content-type', content_type)
    }
   
    try {
        const response = await fetch(`${url}`, {
            method: 'GET',
            credentials: 'include',
            headers: headers,
        })
        if (!response.ok) {
            throw new Error(`Error getting data: ${response.status}`)
        }
        const data = await response.json()
        console.log(`data: ${data}`)
        return data
    } catch (error) {
        console.error(`Error getting data: ${error}`)
        throw error
    }   
}

const getWallet = async () => {
    let data = await getData(`${CASHU_URL}?usr=${USER_ID}` )
    console.log(`data: ${data}`)
}

export {
    getWallet
}