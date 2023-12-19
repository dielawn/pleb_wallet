import { displayTransactions,  handleBtns, displayBtcPrice, displayWalletBal} from './dom.js'

async function app() { 
    displayBtcPrice()
    displayWalletBal()
    displayTransactions()  
    setTimeout( function() {app()}, 10000)
} 

document.addEventListener('DOMContentLoaded', async function () {
    await handleBtns()
    await app()
})

