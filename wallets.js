import { getLnbitsBalance, getLnbitsTransactions, getData, postJson, } from "./src/lnbits"



class User {
    constructor() {
        this.wallets = []
        this.currentWallet = null
    }
    addWallet(id, admKey, invKey, walletName) {
        const wlt = new Wallet
        wlt.wallet_id = id
        wlt.admin_key = admKey
        wlt.inv_rd_key = invKey
        wlt.wallet_name = walletName

        this.wallets.push(wlt)
    }
    getBtcUsdPrice = async () => {
        let data = await getData(`https://api.coinbase.com/v2/prices/BTC-USD/spot`)
        let json = JSON.parse(data)
        let price = json.data.amount        
        return price
    }
    setCurrentWallet = async (i, callback) => {
        this.currentWallet = this.wallets[i]
        try {
            await this.updateApiData()
        } catch (error) {
            console.error(`'Error ${this.currentWallet.walletName}>setCurrentWallet: ${error}`)
        }       
        if (typeof callback === 'function') {
            callback()
        }
    }

}

class Wallet {
    constructor(id, admKey, invKey, walletName) {
        this.wallet_id = id
        this.admin_key = admKey
        this.inv_rd_key = invKey
        this.wallet_name = walletName
    }   
    getBalance = async () => {
        try {
            let data = await getData(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY)
            let json = JSON.parse(data)   
            //convert mili sats to sats 
            let balance = Number(json.balance) / 1000        
            return balance;
        } catch (error) {
            console.error(`'Error ${this.wallet_name}>getBalance: ${error}`)
        }        
    }
    getTxHistory = async () => {
        let data = await getData(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`)
        return  JSON.parse(data)  
    }
    //returns payable invoice
    postNewInvoice = async (amount) => {
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
            console.error(`Error ${this.wallet_name}>postNewInvoice: ${error}`)
            throw error
        }
    }
    //pays invoice
    postPayment = async (invoice) => {
        let json = {
            out: true,
            bolt11: invoice,
        } 
        try {
            await customAlert(invoice)  
            const response = await postJson(LN_BITS_API_URL,  LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json))    
            const paymentHash = response.payment_hash
            console.log(`Payment successful: ${paymentHash}`)
            return paymentHash
        } catch (error) {
            console.error(`Error  ${this.wallet_name}>postPayment: ${error}`)
        }    
    }
    decodeInvoice = async (invoice) => {
        let json = {
            data: invoice
        }
        try {
            const data = await postJson('https://legend.lnbits.com/api/v1/payments/decode', LN_BITS_INVOICE_READ_KEY, 'application/json', JSON.stringify(json))
            return data
        } catch (error) {
            console.error(`Error  ${this.wallet_name}>decodeInvoice: ${error}`)
        }
    }
    returnInvoiceAmount = async (invoice) => {
        try {
            const data = await this.decodeInvoice(invoice)
            const amount = (data.amount_msat) / 1000
            return amount
        } catch (error) {
            console.error(`Error  ${this.wallet_name}>returnInvoiceAmount: ${error}`)
        }
    }
    getQrCode = async (invoice) => {
        try {
            let data = await getData(`https://legend.lnbits.com/api/v1/qrcode/${invoice}`)          
            return data
        }catch (error) {
            console.error(`Error  ${this.wallet_name}>getQrCode: ${error}`)
        }
    }
    
    //under construction
    getWalletList = async () => {
        let data = await getData(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY)
        console.log(data)
    }

}

export {
    Wallet,
    User,

}