import { 
    getLnbitsTransactions, 
    getInvoice, 
    submitInvoiceToPay, 
    decodeInvoice, 
    getBitcoinPrice, 
    getLnbitsBalance,
    updateApiKeys,
    createNewWallet,
    getQrCode,

    } from "./lnbits"

import {  
    wallets , 
    currentUser,
    } from "../config.js"

const displayQrCode = async () => {

    const prevStuff = document.getElementById('displayQrBtn')
    if (prevStuff) prevStuff.remove()

    const container = document.getElementById('container')
    const toolbox = document.getElementById('toolBoxDiv')
  
    const displayQrBtn = document.createElement('button')
    displayQrBtn.textContent = 'View QR'
    displayQrBtn.classList.add('rndBtn')
    displayQrBtn.id = 'displayQrBtn'
    toolbox.appendChild(displayQrBtn)
    displayQrBtn.addEventListener('click', async () => {
        const invoice = await pasteFromClipBoard()
        console.log(`invoice: ${invoice}`)
        const qrCodeSvg = await getQrCode(invoice)

        const qrDiv = document.createElement('div')
        qrDiv.classList.add('qrDiv')
        qrDiv.innerHTML = qrCodeSvg

        const rmvBtn = document.createElement('button')
        rmvBtn.textContent = 'X'
        rmvBtn.classList.add('closeBtn')
        qrDiv.appendChild(rmvBtn)

        rmvBtn.addEventListener('click', () => {
            qrDiv.remove()
        })
    
        container.appendChild(qrDiv)

    })
}

const handleNewWallet = async () => {
    const toolbox = document.getElementById('toolBoxDiv')
    const container = document.getElementById('container')

    const newWalletBtn = document.createElement('button')
    newWalletBtn.textContent = 'New Wallet'
    newWalletBtn.classList.add('rndBtn')
    newWalletBtn.addEventListener('click', () => {
        const popUpWin = document.createElement('div')        
        container.appendChild(popUpWin)

        const nameInput = document.createElement('input')
        nameInput.placeholder = 'Wallet name'
        popUpWin.appendChild(nameInput)

        const submitNameBtn = document.createElement('button')
        submitNameBtn.textContent = 'Create Wallet'
        popUpWin.appendChild(submitNameBtn)

        submitNameBtn.addEventListener('click', () => {
            createNewWallet(nameInput.value)
            displayCurrentWallet()
            popUpWin.remove()
        })
    })

    toolbox.appendChild(newWalletBtn)

}



const displayCurrentWallet = async () => {
    const prevWallets =  document.querySelectorAll('.wallets')
    prevWallets.forEach(wallet => {
        wallet.remove()
    })
  
    const toolbox = document.getElementById('toolBoxDiv')

    console.log(`16 currentUserWallets: ${currentUser.currentWallet.wallet_name}`)

    for (let i = 0; i < wallets.length; i++) {
        const option = document.createElement('div')
        option.innerText = wallets[i].wallet_name
        option.classList.add('wallets')
        option.id = `wallet${i}`
        
        toolbox.appendChild(option)

        option.addEventListener('click', async () => {
            console.log(currentUser.currentWallet.wallet_name, i)
            
            currentUser.setCurrentWallet(i, () => {
                updateApiKeys()              
                displayWalletName()
                displayWalletBal()
                displayTransactions()
            })
            
            console.log(currentUser.currentWallet.wallet_name, i)
            
        })
    }     
}


const displayDecodedInvoice = async (invoiceResponse, invoice) => {
    
    const createInvoiceDiv = document.getElementById('createInvoice')
    const decodedInvoiceDiv = document.getElementById('decodedDiv')

//ul for invoice data
    const dataList = document.createElement('ul')
    dataList.classList.add('data-list')    
    const dataArray = [ 
        `Currency: ${invoiceResponse.currency}`, 
        `${(invoiceResponse.amount_msat) / 1000} Sats`,
        (new Date(invoiceResponse.date * 1000).toDateString()),
        (new Date(invoiceResponse.date * 1000).toLocaleTimeString()),
        // `Signature: ${await abreviateHash(invoiceResponse.signature, 11, 11)}`,
        `Description: ${invoiceResponse.description}`,
        // `Payment hash: ${await abreviateHash(invoiceResponse.payment_hash, 11, 11)}`,
        // `Payee: ${await abreviateHash(invoiceResponse.payee, 11, 11)}`,
        // `Expiry: ${invoiceResponse.expiry}`,
        // `Secret: ${await abreviateHash(invoiceResponse.payment_secret, 11, 11)}`,
    ]

    const listItems = dataArray.map(item => {
        const dataItem = document.createElement('li')
        dataItem.innerText = `${item}`    
        return dataItem
   })

   const msg = document.createElement('h3')
   msg.textContent = 'Invoice copied to clipboard!'
//copy btn
   const cpyToClpBrdBtn = document.createElement('button')
   cpyToClpBrdBtn.textContent = `Copy: ${await abreviateHash(invoice, 11, 11)}`
   cpyToClpBrdBtn.classList.add('cpyInvoiceBtn')
   cpyToClpBrdBtn.addEventListener('click', () => {
        copyToClipboard(invoice)
   })
//close btn
    const closeBtn = document.createElement('button')
    closeBtn.textContent = 'X'
    closeBtn.classList.add('closeBtn')
    closeBtn.addEventListener('click', () => {
        decodedInvoiceDiv.classList.toggle('hide')
        createInvoiceDiv.classList.toggle('hide')
        decodedInvoiceDiv.remove()
    })
//qr element
    const qrCodeSvg = await getQrCode(invoice)
    const qrDiv = document.createElement('div')
        qrDiv.classList.add('qrDiv')
        qrDiv.innerHTML = qrCodeSvg

    if (decodedInvoiceDiv.classList.contains('hide')) {
        decodedInvoiceDiv.classList.remove('hide')
    }

   dataList.append(...listItems)
   decodedInvoiceDiv.appendChild(closeBtn)
   decodedInvoiceDiv.appendChild(msg)
   decodedInvoiceDiv.appendChild(cpyToClpBrdBtn)
   decodedInvoiceDiv.appendChild(dataList)
   decodedInvoiceDiv.appendChild(qrDiv)
   
   createInvoiceDiv.appendChild(decodedInvoiceDiv)
   
}

const displayTransactions = async () => {
    const transactionDiv = document.getElementById('transactionDiv')
    
    const transactions = await currentUser.currentWallet.getLnbitsTransactions()
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

async function handleInvoice(amount) {    
    const amountInput = document.getElementById('amountInput')
    const decodeInvoiceDiv = document.getElementById('decodedDiv')
    try {        
        const response = await getInvoice(amount)      
        const invoice = response.payment_request  

        await copyToClipboard(invoice)        
       
        const data = await decodeInvoice(invoice)
        decodeInvoiceDiv.classList.remove('hide')   
        await displayDecodedInvoice(data, invoice)
        await displayQrCode(invoice)
        amountInput.value = ''
           
    } catch (error) {
        console.error(`Error getting invoice`, error)
    }
}
async function handlePayment(invoice) {
    const decodeInvoiceDiv = document.getElementById('decodedDiv')
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



async function copyToClipboard(invoiceTxt) {
    try {  
       await navigator.clipboard.writeText(invoiceTxt)
        return 'Copied to clipboard'
    } catch {
        return 'Error copying to clipboard'
    }
    
}

const inputBtnPkg = () => {
    const label = document.createElement('label')
    const input = document.createElement('input')
}

const renderPopUp = async () => {
    const container = document.getElementById('container')
    const popUp = document.createElement('div')
    const contentDiv = document.createElement('div')
    
    popUp.classList.add('flex')
    contentDiv.classList.add('flexColumn')

    


    const rmvBtn = document.createElement('button')
        rmvBtn.textContent = 'X'
        rmvBtn.classList.add('closeBtn')
        rmvBtn.addEventListener('click', () => {
            popUp.remove()
        })
        
    
    container.appendChild(popUp)
    popUp.appendChild(contentDiv)
    popUp.appendChild(rmvBtn)
}

const handleBtns = async () => {
    //decoded invoice
    const decodeInvoiceDiv = document.getElementById('decodedDiv')
    decodeInvoiceDiv.classList.add('hide')

    const createInvoiceDiv = document.getElementById('createInvoice')
    createInvoiceDiv.classList.add('hide')

    const decodeDivBtn = document.getElementById('decodeDivBtn')
    decodeDivBtn.addEventListener('click', async () => {       
        decodeInvoiceDiv.classList.toggle('hide')    
        const invoice = await pasteFromClipBoard()
        const data = await decodeInvoice(invoice)
        await displayDecodedInvoice(data, invoice)
        await displayQrCode(invoice)
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
            //opens invoice input and submit
            createInvoiceDiv.classList.toggle('hide')
  
        })
    const newInvBtn = document.getElementById('createInvBtn')
        newInvBtn.addEventListener('click', async () => {
            //submits amount returns invoice and hides input and btn
            const amount = await returnAmount()
            handleInvoice(amount)
            // createInvoiceDiv.classList.toggle('hide')
            
        })
    }

async function returnAmount() {
    const amountInput = document.getElementById('amountInput')
        if (amountInput.value <= 0 || amountInput.value === '') {
            return
        }
    return amountInput.value
}

async function pasteFromClipBoard() {
    try {
      const clipBrdTxt = await navigator.clipboard.readText()
      return clipBrdTxt
    } catch {
        return `Error reading clipboard: ${error.message}`
    }
}

async function displayBtcPrice() {
    const btcPrice = document.getElementById('btcPrice')
    const price = await getBitcoinPrice();
    const string_price = Number( price ).toLocaleString();
    btcPrice.textContent= `$${string_price}`
}

async function displayWalletBal() {
    const walletBal = document.getElementById('walletBal')
    const balance = await getLnbitsBalance()
    const string_bal = Number( balance ).toLocaleString()
    walletBal.textContent = `${string_bal} sats`
}

async function displayWalletName() {
    const walletName = document.getElementById('walletName')
    walletName.innerHTML = `${currentUser.currentWallet.wallet_name}`
}

export {
    
    displayTransactions,
    handleInvoice,
    handlePayment,
    handleBtns,
    displayBtcPrice,
    displayWalletBal,
    displayWalletName,
    displayCurrentWallet,
    handleNewWallet,
    displayQrCode,

}

async function abreviateHash(hash, start, end) {
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`
}