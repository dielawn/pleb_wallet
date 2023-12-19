import {getInvoice, submitInvoiceToPay, decodeInvoice,  } from '.lnbits.js'

async function abreviateHash(hash, start, end) {
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`
}

const displayDecodedInvoice = (invoiceResponse) => {
    
    const containerDiv = document.getElementById('decodeInvoiceDiv')
    const decodedInvoiceDiv = document.createElement('div')
    decodedInvoiceDiv.classList.add('decodedDiv')
    const dataList = document.createElement('ul')
    dataList.classList.add('data-list')
    
    const dataArray = [ 
        `Currency: ${invoiceResponse.currency}`, 
        `${(invoiceResponse.amount_msat) / 1000} Sats`,
        (new Date(invoiceResponse.date * 1000).toDateString()),
        (new Date(invoiceResponse.date * 1000).toLocaleTimeString()),
        `Signature: ${invoiceResponse.signature}`,
        `Description: ${invoiceResponse.description}`,
        `Payment hash: ${invoiceResponse.payment_hash}`,
        `Payee: ${invoiceResponse.payee}`,
        `Expiry: ${invoiceResponse.expiry}`,
        `Secret: ${invoiceResponse.payment_secret}`,
    ]

    const listItems = dataArray.map(item => {
        const dataItem = document.createElement('li')
        dataItem.innerText = `${item}`    
        return dataItem
   })

    const closeBtn = document.createElement('button')
    closeBtn.textContent = 'X'
    closeBtn.classList.add('closeBtn')
    closeBtn.addEventListener('click', () => {
        decodeInvoiceDiv.classList.toggle('hide')
        decodedInvoiceDiv.remove()
    })

   dataList.append(...listItems)
   decodedInvoiceDiv.appendChild(closeBtn)
   decodedInvoiceDiv.appendChild(dataList)
   
   containerDiv.appendChild(decodedInvoiceDiv)
}

const displayTransactions = (transactions) => {
    const transactionDiv = document.getElementById('transactionDiv')
    transactionDiv.innerHTML = ''

    //display message if no tx history
    if (transactions.length === 0) {
        const newTransaction = document.createElement('div')
        newTransaction.textContent = 'No transactions yet'
        createInvoiceDiv.appendChild(newTransaction)       
        return
    }

    transactions.forEach(function (tx) {        
        const checkingId = tx.checking_id
        const bolt11 = tx.bolt11
        const pending = tx.pending
        const preimage = tx.preimage
        const fee = tx.fee
        const memo = tx.memo
       
        let amount = Math.floor(Number(tx.amount) / 1000)

        const time = new Date(tx.time * 1000)
        const formatedDate = time.toDateString()
        const formatedTime = time.toLocaleTimeString()

        const isPositive = amount > 0
        const isValid = !pending && !document.querySelector(`p[data-checking-id="${checkingId}"]`) 
        const isValidDeposit = isValid && isPositive
        
        const isValidDebit = isValid && !isPositive && preimage !== "0000000000000000000000000000000000000000000000000000000000000000"
        
        const shouldDisplay = isValidDeposit || isValidDebit

        if (shouldDisplay) {
            if (!isPositive) {
                amount  += fee / 1000
            }
            const transactionContainer = document.createElement('div')
            transactionContainer.classList.add('transaction-container')

            const txAmountEl = document.createElement('p')
            txAmountEl.classList.add('transaction-amount')
            txAmountEl.classList.add(isPositive ? 'green' : 'red')
            txAmountEl.innerHTML = `${isPositive ? '+' : ''}${amount} sats, <br>`

            const txInvoiceEl = document.createElement('p')
            txInvoiceEl.classList.add('transaction')
            txInvoiceEl.setAttribute('data-checking-id', checkingId)           
            txInvoiceEl.innerHTML = `${isPositive ? 'Received' : 'Sent'}: <span title= "${bolt11}">${bolt11.substring(0, 11)}...${bolt11.substring((bolt11.length) - 11, bolt11.length)}</span>`

            const txDetailEl = document.createElement('p')
            txDetailEl.classList.add('transaction')
            txDetailEl.innerHTML = `Memo:${memo} <br>${formatedDate}, <br>${formatedTime}`

            
            transactionContainer.appendChild(txAmountEl)
            transactionContainer.appendChild(txInvoiceEl)
            transactionContainer.appendChild(txDetailEl)
            
            transactionDiv.appendChild(transactionContainer)
        }
    })
}



const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv')

const createInvoiceDiv = document.getElementById('createInvoice')
createInvoiceDiv.classList.add('hide')

async function handleInvoice(amount) {    
    try {        
        const response = await getInvoice(amount)      
        const paymentRequest = response.payment_request  
        const clipMsg =  await copyToClipboard(paymentRequest)
        
        const newTransaction = document.createElement('div')
        newTransaction.textContent += clipMsg
       
        createInvoiceDiv.appendChild(newTransaction)
        amountInput.value = paymentRequest
        setTimeout(() => {
            newTransaction.remove()
            createInvoiceDiv.classList.toggle('hide')
        }, 2000)
       
    } catch (error) {
        console.error(`Error getting invoice`, error)
    }
}

async function handlePayment(invoice) {
    try {
        const response = await submitInvoiceToPay(invoice)
        console.log(`response: ${response}`)

        const newTransaction = document.createElement('div')        
        newTransaction.textContent = response
        
        decodeInvoiceDiv.appendChild(newTransaction)
    } catch (error) {
        console.error(`Error submitting invoice`, error)
    }
}

async function handleBtns() {
    const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv')
decodeInvoiceDiv.classList.add('hide')

const createInvoiceDiv = document.getElementById('createInvoice')
createInvoiceDiv.classList.add('hide')

const decodeDivBtn = document.getElementById('decodeDivBtn')
decodeDivBtn.addEventListener('click', async () => {
    const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv')
    decodeInvoiceDiv.classList.toggle('hide')    

    const invoice = await pasteFromClipBoard()
    const data = await decodeInvoice(invoice)
    displayDecodedInvoice(data)
})

const sendBtn = document.getElementById('sendBtn')
   sendBtn.addEventListener('click', async () => {
        try {
            const invoiceTxt = await pasteFromClipBoard()
            handlePayment(invoiceTxt)
        } catch (error) {
            console.error(`Error: ${error}`)
        }
    })    

const recieveBtn = document.getElementById('recieveBtn')
    recieveBtn.addEventListener('click', () => {
        const createInvoiceDiv = document.getElementById('createInvoice')
        createInvoiceDiv.classList.toggle('hide')
  
    })
    const newInvBtn = document.getElementById('createInvBtn')
    newInvBtn.addEventListener('click', () => {
        const amountInput = document.getElementById('amountInput')
        if (amountInput.value <= 0) {
            return
        }
        handleInvoice(amountInput.value)
    })
}


async function copyToClipboard(invoiceTxt) {
    try {  
       await navigator.clipboard.writeText(invoiceTxt)
        return 'Copied to clipboard'
    } catch {
        return 'Error copying to clipboard'
    }
    
}
async function pasteFromClipBoard() {
    try {
      const clipBrdTxt = await navigator.clipboard.readText()
      return clipBrdTxt
    } catch {
        return `Error reading clipboard: ${error.message}`
    }
}

export default {
    handleBtns,
    displayTransactions,
    
}
