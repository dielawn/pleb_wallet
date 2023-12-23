/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LN_BITS_API_ADMIN_KEY: () => (/* binding */ LN_BITS_API_ADMIN_KEY),
/* harmony export */   LN_BITS_INVOICE_READ_KEY: () => (/* binding */ LN_BITS_INVOICE_READ_KEY),
/* harmony export */   currentUser: () => (/* binding */ currentUser),
/* harmony export */   nextWallet: () => (/* binding */ nextWallet),
/* harmony export */   wallets: () => (/* binding */ wallets)
/* harmony export */ });
/* harmony import */ var _wallets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wallets */ "./wallets.js");

const wallets = [{
  wallet_id: 'd03030f5398a410fbe8a1343daca0f0e',
  admin_key: 'd5805522bd52408cac2153f0ec5176d7',
  inv_rd_key: '4788e7d2d7aa483495692127dccdd6f3',
  wallet_name: 'Pleb wallet'
}, {
  wallet_id: '2278486a2cf04aae9d8ff1fb0ac3da20',
  admin_key: '8b94a55696f445cb846f06c73f88e858',
  inv_rd_key: 'cf836d58fb5a46ae8ac861f061f5c7a9',
  wallet_name: 'Wallnut'
}];
const currentUser = new _wallets__WEBPACK_IMPORTED_MODULE_0__.User();
console.log(`${currentUser.wallets}`);
const handleUser = () => {
  for (let i = 0; i < wallets.length; i++) {
    const id = wallets[i].wallet_id;
    const admKey = wallets[i].admin_key;
    const invKey = wallets[i].inv_rd_key;
    const walletName = wallets[i].wallet_name;
    currentUser.addWallet(id, admKey, invKey, walletName);
  }
};
const handleDefault = () => {
  if (currentUser.currentWallet === null) {
    currentUser.currentWallet = wallets[1];
  }
};
const nextWallet = index => {
  if (wallets.length < index) {
    index = 0;
  }
  currentUser.currentWallet = wallets[index + 1];
};
handleUser();
handleDefault();
const LN_BITS_API_URL = `https://legend.lnbits.com/api/v1/payments`;
const LN_BITS_API_WALLET = `https://legend.lnbits.com/api/v1/wallet`;
let LN_BITS_API_ADMIN_KEY = currentUser.currentWallet.admin_key;
let LN_BITS_INVOICE_READ_KEY = currentUser.currentWallet.inv_rd_key;

// console.log(`4 currentUserWallets: ${currentUser.currentWallet.wallet_name}`)


/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   displayBtcPrice: () => (/* binding */ displayBtcPrice),
/* harmony export */   displayCurrentWallet: () => (/* binding */ displayCurrentWallet),
/* harmony export */   displayQrCode: () => (/* binding */ displayQrCode),
/* harmony export */   displayTransactions: () => (/* binding */ displayTransactions),
/* harmony export */   displayWalletBal: () => (/* binding */ displayWalletBal),
/* harmony export */   displayWalletName: () => (/* binding */ displayWalletName),
/* harmony export */   handleBtns: () => (/* binding */ handleBtns),
/* harmony export */   handleInvoice: () => (/* binding */ handleInvoice),
/* harmony export */   handleNewWallet: () => (/* binding */ handleNewWallet),
/* harmony export */   handlePayment: () => (/* binding */ handlePayment)
/* harmony export */ });
/* harmony import */ var _lnbits__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lnbits */ "./src/lnbits.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");


const displayQrCode = async () => {
  const prevStuff = document.getElementById('displayQrBtn');
  if (prevStuff) prevStuff.remove();
  const container = document.getElementById('container');
  const toolbox = document.getElementById('toolBoxDiv');
  const displayQrBtn = document.createElement('button');
  displayQrBtn.textContent = 'View QR';
  displayQrBtn.classList.add('rndBtn');
  displayQrBtn.id = 'displayQrBtn';
  toolbox.appendChild(displayQrBtn);
  displayQrBtn.addEventListener('click', async () => {
    const invoice = await pasteFromClipBoard();
    console.log(`invoice: ${invoice}`);
    const qrCodeSvg = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getQrCode)(invoice);
    const qrDiv = document.createElement('div');
    qrDiv.classList.add('qrDiv');
    qrDiv.innerHTML = qrCodeSvg;
    const rmvBtn = document.createElement('button');
    rmvBtn.textContent = 'X';
    rmvBtn.classList.add('closeBtn');
    qrDiv.appendChild(rmvBtn);
    rmvBtn.addEventListener('click', () => {
      qrDiv.remove();
    });
    container.appendChild(qrDiv);
  });
};
const handleNewWallet = async () => {
  const toolbox = document.getElementById('toolBoxDiv');
  const container = document.getElementById('container');
  const newWalletBtn = document.createElement('button');
  newWalletBtn.textContent = 'New Wallet';
  newWalletBtn.classList.add('rndBtn');
  newWalletBtn.addEventListener('click', () => {
    const popUpWin = document.createElement('div');
    container.appendChild(popUpWin);
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Wallet name';
    popUpWin.appendChild(nameInput);
    const submitNameBtn = document.createElement('button');
    submitNameBtn.textContent = 'Create Wallet';
    popUpWin.appendChild(submitNameBtn);
    submitNameBtn.addEventListener('click', () => {
      (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.createNewWallet)(nameInput.value);
      displayCurrentWallet();
      popUpWin.remove();
    });
  });
  toolbox.appendChild(newWalletBtn);
};
const displayCurrentWallet = async () => {
  const prevWallets = document.querySelectorAll('.wallets');
  prevWallets.forEach(wallet => {
    wallet.remove();
  });
  const toolbox = document.getElementById('toolBoxDiv');
  console.log(`16 currentUserWallets: ${_config_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.currentWallet.wallet_name}`);
  for (let i = 0; i < _config_js__WEBPACK_IMPORTED_MODULE_1__.wallets.length; i++) {
    const option = document.createElement('div');
    option.innerText = _config_js__WEBPACK_IMPORTED_MODULE_1__.wallets[i].wallet_name;
    option.classList.add('wallets');
    option.id = `wallet${i}`;
    toolbox.appendChild(option);
    option.addEventListener('click', async () => {
      console.log(_config_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.currentWallet.wallet_name, i);
      _config_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.setCurrentWallet(i, () => {
        (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.updateApiKeys)();
        displayWalletName();
        displayWalletBal();
        displayTransactions();
      });
      console.log(_config_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.currentWallet.wallet_name, i);
    });
  }
};
const displayDecodedInvoice = async (invoiceResponse, invoice) => {
  const createInvoiceDiv = document.getElementById('createInvoice');
  const decodedInvoiceDiv = document.getElementById('decodedDiv');

  //ul for invoice data
  const dataList = document.createElement('ul');
  dataList.classList.add('data-list');
  const dataArray = [`Currency: ${invoiceResponse.currency}`, `${invoiceResponse.amount_msat / 1000} Sats`, new Date(invoiceResponse.date * 1000).toDateString(), new Date(invoiceResponse.date * 1000).toLocaleTimeString(),
  // `Signature: ${await abreviateHash(invoiceResponse.signature, 11, 11)}`,
  `Description: ${invoiceResponse.description}`
  // `Payment hash: ${await abreviateHash(invoiceResponse.payment_hash, 11, 11)}`,
  // `Payee: ${await abreviateHash(invoiceResponse.payee, 11, 11)}`,
  // `Expiry: ${invoiceResponse.expiry}`,
  // `Secret: ${await abreviateHash(invoiceResponse.payment_secret, 11, 11)}`,
  ];
  const listItems = dataArray.map(item => {
    const dataItem = document.createElement('li');
    dataItem.innerText = `${item}`;
    return dataItem;
  });
  const msg = document.createElement('h3');
  msg.textContent = 'Invoice copied to clipboard!';
  //copy btn
  const cpyToClpBrdBtn = document.createElement('button');
  cpyToClpBrdBtn.textContent = `Copy: ${await abreviateHash(invoice, 11, 11)}`;
  cpyToClpBrdBtn.classList.add('cpyInvoiceBtn');
  cpyToClpBrdBtn.addEventListener('click', () => {
    copyToClipboard(invoice);
  });
  //close btn
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'X';
  closeBtn.classList.add('closeBtn');
  closeBtn.addEventListener('click', () => {
    decodedInvoiceDiv.classList.toggle('hide');
    createInvoiceDiv.classList.toggle('hide');
    decodedInvoiceDiv.remove();
  });
  //qr element
  const qrCodeSvg = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getQrCode)(invoice);
  const qrDiv = document.createElement('div');
  qrDiv.classList.add('qrDiv');
  qrDiv.innerHTML = qrCodeSvg;
  if (decodedInvoiceDiv.classList.contains('hide')) {
    decodedInvoiceDiv.classList.remove('hide');
  }
  dataList.append(...listItems);
  decodedInvoiceDiv.appendChild(closeBtn);
  decodedInvoiceDiv.appendChild(msg);
  decodedInvoiceDiv.appendChild(cpyToClpBrdBtn);
  decodedInvoiceDiv.appendChild(dataList);
  decodedInvoiceDiv.appendChild(qrDiv);
  createInvoiceDiv.appendChild(decodedInvoiceDiv);
};
const displayTransactions = async () => {
  const transactionDiv = document.getElementById('transactionDiv');
  const transactions = await _config_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.currentWallet.getLnbitsTransactions();
  transactionDiv.innerHTML = '';
  //display message if no tx history
  if (transactions.length === 0) {
    const newTransaction = document.createElement('div');
    newTransaction.textContent = 'No transactions yet';
    createInvoiceDiv.appendChild(newTransaction);
    return;
  }
  transactions.forEach(function (tx) {
    const checkingId = tx.checking_id;
    const bolt11 = tx.bolt11;
    const pending = tx.pending;
    const preimage = tx.preimage;
    const fee = tx.fee;
    const memo = tx.memo;
    let amount = Math.floor(Number(tx.amount) / 1000);
    const time = new Date(tx.time * 1000);
    const formatedDate = time.toDateString();
    const formatedTime = time.toLocaleTimeString();
    const isPositive = amount > 0;
    const isValid = !pending && !document.querySelector(`p[data-checking-id="${checkingId}"]`);
    const isValidDeposit = isValid && isPositive;
    const isValidDebit = isValid && !isPositive && preimage !== "0000000000000000000000000000000000000000000000000000000000000000";
    const shouldDisplay = isValidDeposit || isValidDebit;
    if (shouldDisplay) {
      if (!isPositive) {
        amount += fee / 1000;
      }
      const transactionContainer = document.createElement('div');
      transactionContainer.classList.add('transaction-container');
      const txAmountEl = document.createElement('p');
      txAmountEl.classList.add('transaction-amount');
      txAmountEl.classList.add(isPositive ? 'green' : 'red');
      txAmountEl.innerHTML = `${isPositive ? '+' : ''}${amount} sats, <br>`;
      const txInvoiceEl = document.createElement('p');
      txInvoiceEl.classList.add('transaction');
      txInvoiceEl.setAttribute('data-checking-id', checkingId);
      txInvoiceEl.innerHTML = `${isPositive ? 'Received' : 'Sent'}: <span title= "${bolt11}">${bolt11.substring(0, 11)}...${bolt11.substring(bolt11.length - 11, bolt11.length)}</span>`;
      const txDetailEl = document.createElement('p');
      txDetailEl.classList.add('transaction');
      txDetailEl.innerHTML = `Memo:${memo} <br>${formatedDate}, <br>${formatedTime}`;
      transactionContainer.appendChild(txAmountEl);
      transactionContainer.appendChild(txInvoiceEl);
      transactionContainer.appendChild(txDetailEl);
      transactionDiv.appendChild(transactionContainer);
    }
  });
};
async function handleInvoice(amount) {
  const amountInput = document.getElementById('amountInput');
  const decodeInvoiceDiv = document.getElementById('decodedDiv');
  try {
    const response = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getInvoice)(amount);
    const invoice = response.payment_request;
    await copyToClipboard(invoice);
    const data = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.decodeInvoice)(invoice);
    decodeInvoiceDiv.classList.remove('hide');
    await displayDecodedInvoice(data, invoice);
    await displayQrCode(invoice);
    amountInput.value = '';
  } catch (error) {
    console.error(`Error getting invoice`, error);
  }
}
async function handlePayment(invoice) {
  const decodeInvoiceDiv = document.getElementById('decodedDiv');
  try {
    const response = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.submitInvoiceToPay)(invoice);
    console.log(`response: ${response}`);
    const newTransaction = document.createElement('div');
    newTransaction.textContent = response;
    decodeInvoiceDiv.appendChild(newTransaction);
  } catch (error) {
    console.error(`Error submitting invoice`, error);
  }
}
async function copyToClipboard(invoiceTxt) {
  try {
    await navigator.clipboard.writeText(invoiceTxt);
    return 'Copied to clipboard';
  } catch {
    return 'Error copying to clipboard';
  }
}
const inputBtnPkg = () => {
  const label = document.createElement('label');
  const input = document.createElement('input');
};
const renderPopUp = async () => {
  const container = document.getElementById('container');
  const popUp = document.createElement('div');
  const contentDiv = document.createElement('div');
  popUp.classList.add('flex');
  contentDiv.classList.add('flexColumn');
  const rmvBtn = document.createElement('button');
  rmvBtn.textContent = 'X';
  rmvBtn.classList.add('closeBtn');
  rmvBtn.addEventListener('click', () => {
    popUp.remove();
  });
  container.appendChild(popUp);
  popUp.appendChild(contentDiv);
  popUp.appendChild(rmvBtn);
};
const handleBtns = async () => {
  //decoded invoice
  const decodeInvoiceDiv = document.getElementById('decodedDiv');
  decodeInvoiceDiv.classList.add('hide');
  const createInvoiceDiv = document.getElementById('createInvoice');
  createInvoiceDiv.classList.add('hide');
  const decodeDivBtn = document.getElementById('decodeDivBtn');
  decodeDivBtn.addEventListener('click', async () => {
    decodeInvoiceDiv.classList.toggle('hide');
    const invoice = await pasteFromClipBoard();
    const data = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.decodeInvoice)(invoice);
    await displayDecodedInvoice(data, invoice);
    await displayQrCode(invoice);
  });
  const sendBtn = document.getElementById('sendBtn');
  sendBtn.addEventListener('click', async () => {
    try {
      const invoiceTxt = await pasteFromClipBoard();
      handlePayment(invoiceTxt);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  });
  const recieveBtn = document.getElementById('recieveBtn');
  recieveBtn.addEventListener('click', () => {
    const createInvoiceDiv = document.getElementById('createInvoice');
    //opens invoice input and submit
    createInvoiceDiv.classList.toggle('hide');
  });
  const newInvBtn = document.getElementById('createInvBtn');
  newInvBtn.addEventListener('click', async () => {
    //submits amount returns invoice and hides input and btn
    const amount = await returnAmount();
    handleInvoice(amount);
    // createInvoiceDiv.classList.toggle('hide')
  });
};
async function returnAmount() {
  const amountInput = document.getElementById('amountInput');
  if (amountInput.value <= 0 || amountInput.value === '') {
    return;
  }
  return amountInput.value;
}
async function pasteFromClipBoard() {
  try {
    const clipBrdTxt = await navigator.clipboard.readText();
    return clipBrdTxt;
  } catch {
    return `Error reading clipboard: ${error.message}`;
  }
}
async function displayBtcPrice() {
  const btcPrice = document.getElementById('btcPrice');
  const price = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getBitcoinPrice)();
  const string_price = Number(price).toLocaleString();
  btcPrice.textContent = `$${string_price}`;
}
async function displayWalletBal() {
  const walletBal = document.getElementById('walletBal');
  const balance = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getLnbitsBalance)();
  const string_bal = Number(balance).toLocaleString();
  walletBal.textContent = `${string_bal} sats`;
}
async function displayWalletName() {
  const walletName = document.getElementById('walletName');
  walletName.innerHTML = `${_config_js__WEBPACK_IMPORTED_MODULE_1__.currentUser.currentWallet.wallet_name}`;
}

async function abreviateHash(hash, start, end) {
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
}

/***/ }),

/***/ "./src/lnbits.js":
/*!***********************!*\
  !*** ./src/lnbits.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNewWallet: () => (/* binding */ createNewWallet),
/* harmony export */   decodeInvoice: () => (/* binding */ decodeInvoice),
/* harmony export */   getAmountFrom: () => (/* binding */ getAmountFrom),
/* harmony export */   getBitcoinPrice: () => (/* binding */ getBitcoinPrice),
/* harmony export */   getData: () => (/* binding */ getData),
/* harmony export */   getInvoice: () => (/* binding */ getInvoice),
/* harmony export */   getLnbitsBalance: () => (/* binding */ getLnbitsBalance),
/* harmony export */   getLnbitsTransactions: () => (/* binding */ getLnbitsTransactions),
/* harmony export */   getQrCode: () => (/* binding */ getQrCode),
/* harmony export */   getWallets: () => (/* binding */ getWallets),
/* harmony export */   postJson: () => (/* binding */ postJson),
/* harmony export */   submitInvoiceToPay: () => (/* binding */ submitInvoiceToPay),
/* harmony export */   updateApiKeys: () => (/* binding */ updateApiKeys)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./config.js");

const LN_BITS_API_URL = `https://legend.lnbits.com/api/v1/payments`;
const LN_BITS_API_WALLET = `https://legend.lnbits.com/api/v1/wallet`;
let LN_BITS_API_ADMIN_KEY = _config__WEBPACK_IMPORTED_MODULE_0__.currentUser.currentWallet.admin_key;
let LN_BITS_INVOICE_READ_KEY = _config__WEBPACK_IMPORTED_MODULE_0__.currentUser.currentWallet.inv_rd_key;
async function updateApiKeys() {
  LN_BITS_API_ADMIN_KEY = _config__WEBPACK_IMPORTED_MODULE_0__.currentUser.currentWallet.admin_key;
  LN_BITS_INVOICE_READ_KEY = _config__WEBPACK_IMPORTED_MODULE_0__.currentUser.currentWallet.inv_rd_key;
}
async function getData(url, apikey, content_type) {
  const headers = new Headers();
  if (apikey) {
    headers.append('X-Api-Key', apikey);
  }
  if (content_type) {
    headers.append('Content-type', content_type);
  }
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Eroor fetching data. Status: ${error.message}`);
  }
}
async function postJson(url, apikey, content_type, json) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': content_type,
        'X-Api-Key': apikey
      },
      body: json
    });
    if (!response.ok) {
      throw new Error(`Failed to post data. Status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(`Error posting data: ${error.message}`);
    throw error;
  }
}

//get functions
const getQrCode = async invoice => {
  let data = await getData(`https://legend.lnbits.com/api/v1/qrcode/${invoice}`);
  console.log(`data: ${data}`);
  return data;
};
const getWallets = async () => {
  let data = await getData(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY);
  console.log(data);
};
async function getBitcoinPrice() {
  let data = await getData(`https://api.coinbase.com/v2/prices/BTC-USD/spot`);
  let json = JSON.parse(data);
  let price = json.data.amount;
  return price;
}
async function getLnbitsBalance() {
  let data = await getData(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY);
  let json = JSON.parse(data);
  let balance = Number(json.balance) / 1000;
  return balance;
}
async function getLnbitsTransactions() {
  let data = await getData(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`);
  return JSON.parse(data);
}

//post functions
const createNewWallet = async name => {
  let json = {
    name: name
  };
  try {
    const response = await postJson(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY, 'application/json', JSON.stringify(json));
    console.log(_config__WEBPACK_IMPORTED_MODULE_0__.wallets.length);
    _config__WEBPACK_IMPORTED_MODULE_0__.currentUser.addWallet(response.id, response.adminKey, response.inkey, response.name);
    _config__WEBPACK_IMPORTED_MODULE_0__.wallets.push({
      wallet_id: response.id,
      admin_key: response.adminKey,
      inv_rd_key: response.inkey,
      wallet_name: response.name
    });
    console.log(_config__WEBPACK_IMPORTED_MODULE_0__.wallets.length);
    return response;
  } catch (err) {
    console.error(`Error creating new wallet: ${err}`);
  }
};
async function getInvoice(amount) {
  let json = {
    unit: 'sat',
    amount: Number(amount),
    memo: 'plebWallet',
    out: false,
    description_hash: ''
  };
  try {
    const response = await postJson(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`, JSON.stringify(json));
    return response;
  } catch (error) {
    console.error(`Error getting invoice: ${error}`);
    throw error;
  }
}
async function getAmountFrom(invoice) {
  const data = await decodeInvoice(invoice);
  const amount = data.amount_msat / 1000;
  return amount;
}
async function decodeInvoice(invoice) {
  let json = {
    data: invoice
  };
  const data = await postJson('https://legend.lnbits.com/api/v1/payments/decode', LN_BITS_INVOICE_READ_KEY, 'application/json', JSON.stringify(json));
  console.log(data);
  return data;
}
async function submitInvoiceToPay(invoice) {
  try {
    await customAlert(invoice);
    let json = {
      out: true,
      bolt11: invoice
    };
    const response = await postJson(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json));
    const paymentHash = response.payment_hash;
    console.log(`Payment successful: ${paymentHash}`);
    return paymentHash;
  } catch (error) {
    console.error(`Error submitting invoice: ${error}`);
  }
}
async function payLNURL(invoice) {
  const data = decodeInvoice(invoice);
  console.log(data);
  try {
    let json = {
      description_hash: data.description_hash,
      callback: null,
      amount: data.amount,
      comment: '',
      description: 'LNURL'
    };
    const response = await postJson(`${LN_BITS_API_URL}/lnurl`, LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json));
    console.log(`LNURL: ${response}`);
  } catch (error) {
    console.error(`Error paying LNURL: ${error}`);
  }
}
const lnurAuth = async () => {
  let json = {
    callback: ''
  };
  const response = await postJson('https://legend.lnbits.com/api/v1/lnurlauth', LN_BITS_API_ADMIN_KEY, 'application/json', JSON.stringify(json));
};

// async function getHash(){
//     const crypto = require('crypto')

//     const paymentDetails = {
//         amount: 'string',
//         description: 'string',
//         comment: 'string',
//     }
// }

async function customAlert(invoice) {
  const amount = await getAmountFrom(invoice);
  const abrevInv = await abreviateHash(invoice, 11, 11);
  const isPlural = amount !== 1 || amount !== -1;
  return new Promise((resolve, reject) => {
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
      html: `${amount} ${isPlural ? 'sats' : 'sat'}<br>Are you sure you want to pay this invoice?<br> ${abrevInv} `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `<i class="fas fa-thumbs-up"></i>  Yes, pay it!`,
      cancelButtonText: `<i class="fa fa-thumbs-down"></i>  Cancel`,
      customClass: {
        confirmButton: 'btnConfirm',
        cancelButton: 'btnCancel'
      }
    }).then(result => {
      if (result.isConfirmed) {
        resolve();
      } else {
        reject(false);
      }
    });
  });
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
  };
  try {
    const response = await postJson(`${LN_BITS_API_URL}/lnurl`, LN_BITS_API_ADMIN_KEY, 'application/json', JSON.stringify(json));
    console.log(response);
    return response;
  } catch (error) {
    console.error(`Error posting json for LNURL ${error}`);
  }
}
async function abreviateHash(hash, start, end) {
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
}


/***/ }),

/***/ "./wallets.js":
/*!********************!*\
  !*** ./wallets.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   User: () => (/* binding */ User),
/* harmony export */   Wallet: () => (/* binding */ Wallet)
/* harmony export */ });
/* harmony import */ var _src_lnbits__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/lnbits */ "./src/lnbits.js");

class User {
  constructor() {
    this.wallets = [];
    this.currentWallet = null;
  }
  addWallet(id, admKey, invKey, walletName) {
    const wlt = new Wallet();
    wlt.wallet_id = id;
    wlt.admin_key = admKey;
    wlt.inv_rd_key = invKey;
    wlt.wallet_name = walletName;
    this.wallets.push(wlt);
  }
  getBtcUsdPrice = async () => {
    let data = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.getData)(`https://api.coinbase.com/v2/prices/BTC-USD/spot`);
    let json = JSON.parse(data);
    let price = json.data.amount;
    return price;
  };
  setCurrentWallet = async (i, callback) => {
    this.currentWallet = this.wallets[i];
    try {
      await this.updateApiData();
    } catch (error) {
      console.error(`'Error ${this.currentWallet.walletName}>setCurrentWallet: ${error}`);
    }
    if (typeof callback === 'function') {
      callback();
    }
  };
}
class Wallet {
  constructor(id, admKey, invKey, walletName) {
    this.wallet_id = id;
    this.admin_key = admKey;
    this.inv_rd_key = invKey;
    this.wallet_name = walletName;
  }
  getBalance = async () => {
    try {
      let data = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.getData)(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY);
      let json = JSON.parse(data);
      //convert mili sats to sats 
      let balance = Number(json.balance) / 1000;
      return balance;
    } catch (error) {
      console.error(`'Error ${this.wallet_name}>getBalance: ${error}`);
    }
  };
  getTxHistory = async () => {
    let data = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.getData)(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`);
    return JSON.parse(data);
  };
  //returns payable invoice
  postNewInvoice = async amount => {
    let json = {
      unit: 'sat',
      amount: Number(amount),
      memo: 'plebWallet',
      out: false,
      description_hash: ''
    };
    try {
      const response = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.postJson)(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`, JSON.stringify(json));
      return response;
    } catch (error) {
      console.error(`Error ${this.wallet_name}>postNewInvoice: ${error}`);
      throw error;
    }
  };
  //pays invoice
  postPayment = async invoice => {
    let json = {
      out: true,
      bolt11: invoice
    };
    try {
      await customAlert(invoice);
      const response = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.postJson)(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, "application/json", JSON.stringify(json));
      const paymentHash = response.payment_hash;
      console.log(`Payment successful: ${paymentHash}`);
      return paymentHash;
    } catch (error) {
      console.error(`Error  ${this.wallet_name}>postPayment: ${error}`);
    }
  };
  decodeInvoice = async invoice => {
    let json = {
      data: invoice
    };
    try {
      const data = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.postJson)('https://legend.lnbits.com/api/v1/payments/decode', LN_BITS_INVOICE_READ_KEY, 'application/json', JSON.stringify(json));
      return data;
    } catch (error) {
      console.error(`Error  ${this.wallet_name}>decodeInvoice: ${error}`);
    }
  };
  returnInvoiceAmount = async invoice => {
    try {
      const data = await this.decodeInvoice(invoice);
      const amount = data.amount_msat / 1000;
      return amount;
    } catch (error) {
      console.error(`Error  ${this.wallet_name}>returnInvoiceAmount: ${error}`);
    }
  };
  getQrCode = async invoice => {
    try {
      let data = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.getData)(`https://legend.lnbits.com/api/v1/qrcode/${invoice}`);
      return data;
    } catch (error) {
      console.error(`Error  ${this.wallet_name}>getQrCode: ${error}`);
    }
  };

  //under construction
  getWalletList = async () => {
    let data = await (0,_src_lnbits__WEBPACK_IMPORTED_MODULE_0__.getData)(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY);
    console.log(data);
  };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./src/dom.js");
/* harmony import */ var _lnbits_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lnbits.js */ "./src/lnbits.js");


// import { getWallet } from './cashu.js'

async function app() {
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayBtcPrice)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayCurrentWallet)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayWalletBal)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayTransactions)();
  setTimeout(function () {
    app();
  }, 10000);
}
document.addEventListener('DOMContentLoaded', async function () {
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayQrCode)();
  await (0,_lnbits_js__WEBPACK_IMPORTED_MODULE_1__.getWallets)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.handleNewWallet)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayCurrentWallet)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayWalletBal)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayTransactions)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayWalletName)();
  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.handleBtns)();
  await app();
  // await getWallet()
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map