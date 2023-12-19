import config from '../config.js'

const LN_BITS_API_URL = `https://legend.lnbits.com/api/v1/payments`
const LN_BITS_API_WALLET = `https://legend.lnbits.com/api/v1/wallet`
const LN_BITS_API_ADMIN_KEY = config.adminKey
const LN_BITS_INVOICE_READ_KEY = config.invKey

async function getData(url, apikey, content_type) {
    const headers = new Headers()
    if (apikey) {
        headers.append('X-Api-Key', apikey)
    }
    if (content_type) {
        headers.append('Content-type', content_type)
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`)
        }

        return await response.text()
    } catch (error) {
        throw new Error(`Eroor fetching data. Status: ${error.message}`)
    }
}

async function postJson(url, apikey, content_type, json) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': content_type,
                'X-Api-Key': apikey,
            },
            body: json,
        })
        if (!response.ok) {
            throw new Error(`Failed to post data. Status: ${response.status}`)
        }
        const jsonResponse = await response.json()
       
        return jsonResponse
    } catch (error) {
        console.error(`Error posting data: ${error.message}`)
        throw error
    }
}

//get functions
async function getBitcoinPrice() {
    let data = await getData(`https://api.coinbase.com/v2/prices/BTC-USD/spot`)
    let json = JSON.parse(data)
    let price = json.data.amount
    
    return price
}

async function getLnbitsBalance() {
    let data = await getData(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY)
    let json = JSON.parse(data)
    
    let balance = Number(json.balance) / 1000

    return balance;
}

async function getLnbitsTransactions() {
    let data = await getData(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`)
    return  JSON.parse(data)   
}

//post functions
async function getInvoice(amount) {
    
    let json = {
        unit: 'sat',
        amount: Number(amount),
        memo: 'plebWallet',
        out: false,
        description_hash: ''
    }

    try {
        const response = await postJson(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`, JSON.stringify(json))
        return  response
    } catch (error) {
        console.error(`Error getting invoice: ${error}`)
        throw error
    }
}

async function getAmountFrom(invoice) {
    const data = await decodeInvoice(invoice)
    const amount = (data.amount_msat) / 1000
    return amount
}

async function decodeInvoice(invoice) {
    let json = {
        data: invoice
    }
    const data = await postJson('https://legend.lnbits.com/api/v1/payments/decode', LN_BITS_INVOICE_READ_KEY, 'application/json', JSON.stringify(json))
    console.log(data)
    return data
}

async function submitInvoiceToPay(invoice) {   
    
    const amount = await getAmountFrom(invoice)
    let isPlural = amount > 1

    if (!confirm(`${amount} sat${isPlural ? 's' : ''}
    Are you sure you want to pay this invoice? 
    ${invoice}`)) {
        return
    }
    let json = {
        out: true,
        bolt11: invoice,
    }
    try {
        const response = await postJson(LN_BITS_API_URL,  LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json))    
        console.log(response)
        const paymentHash = response.payment_hash
        console.log(`Payment successful: ${paymentHash}`)
        return paymentHash
    } catch (error) {
        console.error(`Error submitting invoice: ${error}`)
    }    
}
export {
    getBitcoinPrice, 
    getLnbitsBalance,
    getLnbitsTransactions,
    postJson,
    getInvoice,
    getAmountFrom,
    decodeInvoice,
    submitInvoiceToPay,
}

// async function getAmountFrom(invoice) {
//     const data = await decodeInvoice(invoice)
//     const amount = (data.amount_msat) / 1000
//     return amount
// }

// async function submitInvoiceToPay(invoice) {   
    
//     const amount = await getAmountFrom(invoice)
//     let isPlural = amount > 1

//     if (!confirm(`${amount} sat${isPlural ? 's' : ''}
//     Are you sure you want to pay this invoice? 
//     ${invoice}`)) {
//         return
//     }
//     let json = {
//         out: true,
//         bolt11: invoice,
//     }
//     try {
//         const response = await postJson(LN_BITS_API_URL,  LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json))    
//         const paymentHash = response.payment_hash
//         return paymentHash
//     } catch (error) {
//         console.error(`Error submitting invoice: ${error}`)
//     }    
// }

// async function decodeInvoice(invoice) {
//     let json = {
//         data: invoice
//     }
//     const data = await postJson('https://legend.lnbits.com/api/v1/payments/decode', LN_BITS_INVOICE_READ_KEY, 'application/json', JSON.stringify(json))
//     console.log(data)
//     return data
// }

// async function postLNURL(amount) {
//     let json = {
//         description_hash: 'string',
//         callback: 'string',
//         amount: amount,
//         comment: 'string',
//         description: 'string'
//     }
//     try {
//         const response = await postJson(`${LN_BITS_API_URL}/lnurl`, LN_BITS_API_ADMIN_KEY, 'application/json', JSON.stringify(json))
//         console.log(response)
//         return response
//     } catch (error) {
//         console.error(`Error posting json for LNURL ${error}`)
//     }
// }

