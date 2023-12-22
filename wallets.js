import { getLnbitsBalance, getLnbitsTransactions } from "./src/lnbits"

class User {
    constructor() {
        this.wallets = []
        this.currentWallet = null
    }
    addWallet(id, admKey, invKey, walletName) {
        const wlt = new Wallet
        wlt.setWalletId(id)
        wlt.setAdminKey(admKey)
        wlt.setInvRdKey(invKey)
        wlt.setWalletName(walletName)

        this.wallets.push(wlt)
    }
    async setCurrentWallet(i, callback) {
        this.currentWallet = this.wallets[i]
        console.log(this.currentWallet)
        try {
            await this.updateApiData()
        } catch (error) {
            console.error(`'Error Updating while setting current wallet: ${error}`)
        }
        if (typeof callback === 'function') {
            callback()
        }
    }
    async updateApiData() {
        try {
            await getLnbitsBalance()
            await getLnbitsTransactions()
        } catch (error) {
            throw new Error(`Error updating api: ${error}`)
        }
    }

}

class Wallet {

    constructor() {
        this.wallet_id = ''
        this.admin_key = ''
        this.inv_rd_key = ''
        this.wallet_name = ''
    }   
    setWalletId(id) {
        this.wallet_id = id
    }
    setAdminKey(key) {
        this.admin_key = key
    }
    setInvRdKey(key) {
        this.inv_rd_key = key
    }
    setWalletName(name) {
        this.wallet_name = name
    }
}

export {
    Wallet,
    User,

}