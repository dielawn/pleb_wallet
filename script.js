import {handleBtns, displayTransactions, } from './dom.js'
import {displayBtcPrice, displayWalletBal, } from './lnbits.js'

const LN_BITS_API_URL = `https://legend.lnbits.com/api/v1/payments`
const LN_BITS_API_WALLET = `https://legend.lnbits.com/api/v1/wallet`
// const LN_BITS_API_ADMIN_KEY = config.adminKey
// const LN_BITS_INVOICE_READ_KEY = config.invKey


// async function getData(url, apikey, content_type) {
//     const headers = new Headers()
//     if (apikey) {
//         headers.append('X-Api-Key', apikey)
//     }
//     if (content_type) {
//         headers.append('Content-type', content_type)
//     }
//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: headers,
//         })
//         if (!response.ok) {
//             throw new Error(`Failed to fetch data. Status: ${response.status}`)
//         }

//         return await response.text()
//     } catch (error) {
//         throw new Error(`Eroor fetching data. Status: ${error.message}`)
//     }
// }

// async function getBitcoinPrice() {
//     let data = await getData(`https://api.coinbase.com/v2/prices/BTC-USD/spot`)
//     let json = JSON.parse(data)
//     let price = json.data.amount
    
//     return price
// }

// async function getLnbitsBalance() {
//     let data = await getData(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY)
//     let json = JSON.parse(data)
    
//     let balance = Number(json.balance) / 1000

//     return balance;
// }

// async function getLnbitsTransactions() {
//     let data = await getData(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`)
//     return  JSON.parse(data)   
// }

// async function postJson(url, apikey, content_type, json) {
//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': content_type,
//                 'X-Api-Key': apikey,
//             },
//             body: json,
//         })
//         if (!response.ok) {
//             throw new Error(`Failed to post data. Status: ${response.status}`)
//         }
//         const jsonResponse = await response.json()
       
//         return jsonResponse
//     } catch (error) {
//         console.error(`Error posting data: ${error.message}`)
//         throw error
//     }
// }

// async function getInvoice(amount) {
    
//     let json = {
//         unit: 'sat',
//         amount: Number(amount),
//         memo: 'plebWallet',
//         out: false,
//         description_hash: ''
//     }

//     try {
//         const response = await postJson(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`, JSON.stringify(json))
//         return  response
//     } catch (error) {
//         console.error(`Error getting invoice: ${error}`)
//         throw error
//     }
// }

// async function getAmountFrom(invoice) {
//     const data = await decodeInvoice(invoice)
//     const amount = (data.amount_msat) / 1000
//     return amount
// }

// async function abreviateHash(hash, start, end) {
//     return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`
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
//         console.log(response)
//         const paymentHash = response.payment_hash
//         console.log(`Payment successful: ${paymentHash}`)
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

//DOM stuff
// const displayDecodedInvoice = (invoiceResponse) => {
    
//     const containerDiv = document.getElementById('decodeInvoiceDiv')
//     const decodedInvoiceDiv = document.createElement('div')
//     decodedInvoiceDiv.classList.add('decodedDiv')
//     const dataList = document.createElement('ul')
//     dataList.classList.add('data-list')
    
//     const dataArray = [ 
//         `Currency: ${invoiceResponse.currency}`, 
//         `${(invoiceResponse.amount_msat) / 1000} Sats`,
//         (new Date(invoiceResponse.date * 1000).toDateString()),
//         (new Date(invoiceResponse.date * 1000).toLocaleTimeString()),
//         `Signature: ${invoiceResponse.signature}`,
//         `Description: ${invoiceResponse.description}`,
//         `Payment hash: ${invoiceResponse.payment_hash}`,
//         `Payee: ${invoiceResponse.payee}`,
//         `Expiry: ${invoiceResponse.expiry}`,
//         `Secret: ${invoiceResponse.payment_secret}`,
//     ]

//     const listItems = dataArray.map(item => {
//         const dataItem = document.createElement('li')
//         dataItem.innerText = `${item}`    
//         return dataItem
//    })

//     const closeBtn = document.createElement('button')
//     closeBtn.textContent = 'X'
//     closeBtn.classList.add('closeBtn')
//     closeBtn.addEventListener('click', () => {
//         decodeInvoiceDiv.classList.toggle('hide')
//         decodedInvoiceDiv.remove()
//     })

//    dataList.append(...listItems)
//    decodedInvoiceDiv.appendChild(closeBtn)
//    decodedInvoiceDiv.appendChild(dataList)
   
//    containerDiv.appendChild(decodedInvoiceDiv)
// }

// const displayTransactions = async () => {
//     const transactionDiv = document.getElementById('transactionDiv')
//     transactionDiv.innerHTML = ''

//     const transactions = await getLnbitsTransactions()

//     //display message if no tx history
//     if (transactions.length === 0) {
//         const newTransaction = document.createElement('div')
//         newTransaction.textContent = 'No transactions yet'
//         createInvoiceDiv.appendChild(newTransaction)       
//         return
//     }

//     transactions.forEach(function (tx) {        
//         const checkingId = tx.checking_id
//         const bolt11 = tx.bolt11
//         const pending = tx.pending
//         const preimage = tx.preimage
//         const fee = tx.fee
//         const memo = tx.memo
       
//         let amount = Math.floor(Number(tx.amount) / 1000)

//         const time = new Date(tx.time * 1000)
//         const formatedDate = time.toDateString()
//         const formatedTime = time.toLocaleTimeString()

//         const isPositive = amount > 0
//         const isValid = !pending && !document.querySelector(`p[data-checking-id="${checkingId}"]`) 
//         const isValidDeposit = isValid && isPositive
        
//         const isValidDebit = isValid && !isPositive && preimage !== "0000000000000000000000000000000000000000000000000000000000000000"
        
//         const shouldDisplay = isValidDeposit || isValidDebit

//         if (shouldDisplay) {
//             if (!isPositive) {
//                 amount  += fee / 1000
//             }
//             const transactionContainer = document.createElement('div')
//             transactionContainer.classList.add('transaction-container')

//             const txAmountEl = document.createElement('p')
//             txAmountEl.classList.add('transaction-amount')
//             txAmountEl.classList.add(isPositive ? 'green' : 'red')
//             txAmountEl.innerHTML = `${isPositive ? '+' : ''}${amount} sats, <br>`

//             const txInvoiceEl = document.createElement('p')
//             txInvoiceEl.classList.add('transaction')
//             txInvoiceEl.setAttribute('data-checking-id', checkingId)           
//             txInvoiceEl.innerHTML = `${isPositive ? 'Received' : 'Sent'}: <span title= "${bolt11}">${bolt11.substring(0, 11)}...${bolt11.substring((bolt11.length) - 11, bolt11.length)}</span>`

//             const txDetailEl = document.createElement('p')
//             txDetailEl.classList.add('transaction')
//             txDetailEl.innerHTML = `Memo:${memo} <br>${formatedDate}, <br>${formatedTime}`

            
//             transactionContainer.appendChild(txAmountEl)
//             transactionContainer.appendChild(txInvoiceEl)
//             transactionContainer.appendChild(txDetailEl)
            
//             transactionDiv.appendChild(transactionContainer)
//         }
//     })
// }

// async function handleInvoice(amount) {    
//     const amountInput = document.getElementById('amountInput')
//     const createInvoiceDiv = document.getElementById('createInvoice')
//     try {        
//         const response = await getInvoice(amount)      
//         const paymentRequest = response.payment_request  
//         const clipMsg =  await copyToClipboard(paymentRequest)
        
//         const newTransaction = document.createElement('div')
//         newTransaction.textContent += clipMsg
       
//         createInvoiceDiv.appendChild(newTransaction)
//         amountInput.value = paymentRequest
//         setTimeout(() => {
//             newTransaction.remove()
//             createInvoiceDiv.classList.toggle('hide')
//         }, 1000)
       
//     } catch (error) {
//         console.error(`Error getting invoice`, error)
//     }
// }

// async function handlePayment(invoice) {
//     const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv')
//     try {
//         const response = await submitInvoiceToPay(invoice)
//         console.log(`response: ${response}`)

//         const newTransaction = document.createElement('div')        
//         newTransaction.textContent = response
        
//         decodeInvoiceDiv.appendChild(newTransaction)
//     } catch (error) {
//         console.error(`Error submitting invoice`, error)
//     }
// }

// async function handleBtns() {
//     const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv')
// decodeInvoiceDiv.classList.add('hide')

// const createInvoiceDiv = document.getElementById('createInvoice')
// createInvoiceDiv.classList.add('hide')

// const decodeDivBtn = document.getElementById('decodeDivBtn')
// decodeDivBtn.addEventListener('click', async () => {
//     const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv')
//     decodeInvoiceDiv.classList.toggle('hide')    

//     const invoice = await pasteFromClipBoard()
//     const data = await decodeInvoice(invoice)
//     displayDecodedInvoice(data)
// })

// const sendBtn = document.getElementById('sendBtn')
//    sendBtn.addEventListener('click', async () => {
//         try {
//             const invoiceTxt = await pasteFromClipBoard()
//             handlePayment(invoiceTxt)
//         } catch (error) {
//             console.error(`Error: ${error}`)
//         }
//     })    

// const recieveBtn = document.getElementById('recieveBtn')
//     recieveBtn.addEventListener('click', () => {
//         const createInvoiceDiv = document.getElementById('createInvoice')
//         createInvoiceDiv.classList.toggle('hide')
  
//     })
//     const newInvBtn = document.getElementById('createInvBtn')
//     newInvBtn.addEventListener('click', () => {
//         const amountInput = document.getElementById('amountInput')
//         if (amountInput.value <= 0) {
//             return
//         }
//         handleInvoice(amountInput.value)
//     })
// }

// async function copyToClipboard(invoiceTxt) {
//     try {  
//        await navigator.clipboard.writeText(invoiceTxt)
//         return 'Copied to clipboard'
//     } catch {
//         return 'Error copying to clipboard'
//     }
    
// }
// async function pasteFromClipBoard() {
//     try {
//       const clipBrdTxt = await navigator.clipboard.readText()
//       return clipBrdTxt
//     } catch {
//         return `Error reading clipboard: ${error.message}`
//     }
// }


// async function displayBtcPrice() {
//     const btcPrice = document.getElementById('btcPrice')
//     const price = await getBitcoinPrice();
//     const string_price = Number( price ).toLocaleString();
//     btcPrice.textContent= `$${string_price}`
// }

// async function displayWalletBal() {
//     const walletBal = document.getElementById('walletBal')
//     const balance = await getLnbitsBalance()
//     const string_bal = Number( balance ).toLocaleString()
//     walletBal.textContent = `${string_bal} sats`
// }

async function app() { 
    displayBtcPrice()
    displayWalletBal()
    displayTransactions()  
    setTimeout( function() {app();}, 10000)
} 

document.addEventListener('DOMContentLoaded', async function () {
    await handleBtns()
    await app();


})