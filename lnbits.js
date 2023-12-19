import config from '/config'
import {getData, postJson} from './api.js'


const LN_BITS_API_URL = `https://legend.lnbits.com/api/v1/payments`
const LN_BITS_API_WALLET = `https://legend.lnbits.com/api/v1/wallet`
const LN_BITS_API_ADMIN_KEY = config.adminKey
const LN_BITS_INVOICE_READ_KEY = config.invKey

async function getBitcoinPrice() {
    let data = await getData(`https://api.coinbase.com/v2/prices/BTC-USD/spot`)
    console.log(data)
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
        const paymentHash = response.payment_hash
        return paymentHash
    } catch (error) {
        console.error(`Error submitting invoice: ${error}`)
    }    
}

async function decodeInvoice(invoice) {
    let json = {
        data: invoice
    }
    const data = await postJson('https://legend.lnbits.com/api/v1/payments/decode', LN_BITS_INVOICE_READ_KEY, 'application/json', JSON.stringify(json))
    console.log(data)
    return data
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

export default {
    getBitcoinPrice,
    getLnbitsBalance,
    getLnbitsTransactions,
    getInvoice,
    postLNURL,
    submitInvoiceToPay,

}