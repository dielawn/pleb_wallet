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
    try {
        await customAlert(invoice)
    let json = {
        out: true,
        bolt11: invoice,
    }
   
        const response = await postJson(LN_BITS_API_URL,  LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json))    
        console.log(response)
        const paymentHash = response.payment_hash
        console.log(`Payment successful: ${paymentHash}`)
        return paymentHash
    } catch (error) {
        console.error(`Error submitting invoice: ${error}`)
    }    
}

async function payLNURL(invoice) {
    try {
        let json = {
            description_hash: 'string',
            callback: 'string',
            amount: 'string',
            comment: 'string',
            description: 'string',
        }
        const response = await postJson(`${LN_BITS_API_URL}/lnurl`, LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json))
        console.log(`LNURL: ${response}`)

    } catch(error) {
        console.error(`Error paying LNURL: ${error}`)
    }
}

async function customAlert(invoice) {
    const amount = await getAmountFrom(invoice)
    const abrevInv = await abreviateHash(invoice, 11, 11)
    return new Promise((resolve, reject) => {
        
        let isPlural = amount > 1

        Swal.fire({
            title: `Pay Invoice`,
            showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
              },
            html: `${amount} sat${isPlural ? 's' : ''}<br>Are you sure you want to pay this invoice?<br> ${abrevInv} `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-thumbs-up"></i>  Yes, pay it!`,
            cancelButtonText: `<i class="fa fa-thumbs-down"></i>  Cancel`,
            customClass: {
                confirmButton: 'btnConfirm',
                cancelButton: 'btnCancel',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                resolve()
            } else {
                reject(false)
            }
            
        })
    })
    
}
//on success 
async function confirmedPayment() {
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Transaction Sucess!",
        showConfirmButton: false,
        timer: 1500
      });
}
async function postLNURL(amount) {
    let json = {
        description_hash: 'string',
        callback: 'string',
        amount: amount,
        comment: 'string',
        description: 'string'
    }
    try {
        const response = await postJson(`${LN_BITS_API_URL}/lnurl`, LN_BITS_API_ADMIN_KEY, 'application/json', JSON.stringify(json))
        console.log(response)
        return response
    } catch (error) {
        console.error(`Error posting json for LNURL ${error}`)
    }
}
async function abreviateHash(hash, start, end) {
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`
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





