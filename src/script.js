import {displayQrCode, handleNewWallet, displayCurrentWallet, displayTransactions,  handleBtns, displayBtcPrice, displayWalletBal, displayWalletName} from './dom.js'
import { getWallets } from './lnbits.js'
// import { getWallet } from './cashu.js'


async function app() { 
    await displayBtcPrice()
    await displayCurrentWallet()
    await displayWalletBal()
    await displayTransactions() 
   
    setTimeout( function() {app()}, 10000)
} 

document.addEventListener('DOMContentLoaded', async function () {
    await displayQrCode()
    await getWallets()
    await handleNewWallet()
    await displayCurrentWallet()
    await displayWalletBal()
    await displayTransactions() 
    await displayWalletName()
    await handleBtns()
    await app()
    // await getWallet()
})

