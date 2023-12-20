/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst config = {\n  adminKey: 'd5805522bd52408cac2153f0ec5176d7',\n  invKey: '4788e7d2d7aa483495692127dccdd6f3'\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://pleb_wallet/./config.js?");

/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   displayBtcPrice: () => (/* binding */ displayBtcPrice),\n/* harmony export */   displayDecodedInvoice: () => (/* binding */ displayDecodedInvoice),\n/* harmony export */   displayTransactions: () => (/* binding */ displayTransactions),\n/* harmony export */   displayWalletBal: () => (/* binding */ displayWalletBal),\n/* harmony export */   handleBtns: () => (/* binding */ handleBtns),\n/* harmony export */   handleInvoice: () => (/* binding */ handleInvoice),\n/* harmony export */   handlePayment: () => (/* binding */ handlePayment)\n/* harmony export */ });\n/* harmony import */ var _lnbits__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lnbits */ \"./src/lnbits.js\");\n\nconst displayDecodedInvoice = invoiceResponse => {\n  const containerDiv = document.getElementById('decodeInvoiceDiv');\n  const decodedInvoiceDiv = document.createElement('div');\n  decodedInvoiceDiv.classList.add('decodedDiv');\n  const dataList = document.createElement('ul');\n  dataList.classList.add('data-list');\n  const dataArray = [`Currency: ${invoiceResponse.currency}`, `${invoiceResponse.amount_msat / 1000} Sats`, new Date(invoiceResponse.date * 1000).toDateString(), new Date(invoiceResponse.date * 1000).toLocaleTimeString(), `Signature: ${invoiceResponse.signature}`, `Description: ${invoiceResponse.description}`, `Payment hash: ${invoiceResponse.payment_hash}`, `Payee: ${invoiceResponse.payee}`, `Expiry: ${invoiceResponse.expiry}`, `Secret: ${invoiceResponse.payment_secret}`];\n  const listItems = dataArray.map(item => {\n    const dataItem = document.createElement('li');\n    dataItem.innerText = `${item}`;\n    return dataItem;\n  });\n  const closeBtn = document.createElement('button');\n  closeBtn.textContent = 'X';\n  closeBtn.classList.add('closeBtn');\n  closeBtn.addEventListener('click', () => {\n    decodeInvoiceDiv.classList.toggle('hide');\n    decodedInvoiceDiv.remove();\n  });\n  dataList.append(...listItems);\n  decodedInvoiceDiv.appendChild(closeBtn);\n  decodedInvoiceDiv.appendChild(dataList);\n  containerDiv.appendChild(decodedInvoiceDiv);\n};\nconst displayTransactions = async () => {\n  const transactionDiv = document.getElementById('transactionDiv');\n  const transactions = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getLnbitsTransactions)();\n  transactionDiv.innerHTML = '';\n  //display message if no tx history\n  if (transactions.length === 0) {\n    const newTransaction = document.createElement('div');\n    newTransaction.textContent = 'No transactions yet';\n    createInvoiceDiv.appendChild(newTransaction);\n    return;\n  }\n  transactions.forEach(function (tx) {\n    const checkingId = tx.checking_id;\n    const bolt11 = tx.bolt11;\n    const pending = tx.pending;\n    const preimage = tx.preimage;\n    const fee = tx.fee;\n    const memo = tx.memo;\n    let amount = Math.floor(Number(tx.amount) / 1000);\n    const time = new Date(tx.time * 1000);\n    const formatedDate = time.toDateString();\n    const formatedTime = time.toLocaleTimeString();\n    const isPositive = amount > 0;\n    const isValid = !pending && !document.querySelector(`p[data-checking-id=\"${checkingId}\"]`);\n    const isValidDeposit = isValid && isPositive;\n    const isValidDebit = isValid && !isPositive && preimage !== \"0000000000000000000000000000000000000000000000000000000000000000\";\n    const shouldDisplay = isValidDeposit || isValidDebit;\n    if (shouldDisplay) {\n      if (!isPositive) {\n        amount += fee / 1000;\n      }\n      const transactionContainer = document.createElement('div');\n      transactionContainer.classList.add('transaction-container');\n      const txAmountEl = document.createElement('p');\n      txAmountEl.classList.add('transaction-amount');\n      txAmountEl.classList.add(isPositive ? 'green' : 'red');\n      txAmountEl.innerHTML = `${isPositive ? '+' : ''}${amount} sats, <br>`;\n      const txInvoiceEl = document.createElement('p');\n      txInvoiceEl.classList.add('transaction');\n      txInvoiceEl.setAttribute('data-checking-id', checkingId);\n      txInvoiceEl.innerHTML = `${isPositive ? 'Received' : 'Sent'}: <span title= \"${bolt11}\">${bolt11.substring(0, 11)}...${bolt11.substring(bolt11.length - 11, bolt11.length)}</span>`;\n      const txDetailEl = document.createElement('p');\n      txDetailEl.classList.add('transaction');\n      txDetailEl.innerHTML = `Memo:${memo} <br>${formatedDate}, <br>${formatedTime}`;\n      transactionContainer.appendChild(txAmountEl);\n      transactionContainer.appendChild(txInvoiceEl);\n      transactionContainer.appendChild(txDetailEl);\n      transactionDiv.appendChild(transactionContainer);\n    }\n  });\n};\nasync function handleInvoice(amount) {\n  const amountInput = document.getElementById('amountInput');\n  const createInvoiceDiv = document.getElementById('createInvoice');\n  try {\n    const response = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getInvoice)(amount);\n    const paymentRequest = response.payment_request;\n    const clipMsg = await copyToClipboard(paymentRequest);\n    const newTransaction = document.createElement('div');\n    newTransaction.textContent += clipMsg;\n    createInvoiceDiv.appendChild(newTransaction);\n    amountInput.value = paymentRequest;\n    setTimeout(() => {\n      newTransaction.remove();\n      createInvoiceDiv.classList.toggle('hide');\n    }, 1000);\n  } catch (error) {\n    console.error(`Error getting invoice`, error);\n  }\n}\nasync function handlePayment(invoice) {\n  const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv');\n  try {\n    const response = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.submitInvoiceToPay)(invoice);\n    console.log(`response: ${response}`);\n    const newTransaction = document.createElement('div');\n    newTransaction.textContent = response;\n    decodeInvoiceDiv.appendChild(newTransaction);\n  } catch (error) {\n    console.error(`Error submitting invoice`, error);\n  }\n}\nasync function copyToClipboard(invoiceTxt) {\n  try {\n    await navigator.clipboard.writeText(invoiceTxt);\n    return 'Copied to clipboard';\n  } catch {\n    return 'Error copying to clipboard';\n  }\n}\nasync function handleBtns() {\n  const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv');\n  decodeInvoiceDiv.classList.add('hide');\n  const createInvoiceDiv = document.getElementById('createInvoice');\n  createInvoiceDiv.classList.add('hide');\n  const decodeDivBtn = document.getElementById('decodeDivBtn');\n  decodeDivBtn.addEventListener('click', async () => {\n    const decodeInvoiceDiv = document.getElementById('decodeInvoiceDiv');\n    decodeInvoiceDiv.classList.toggle('hide');\n    const invoice = await pasteFromClipBoard();\n    const data = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.decodeInvoice)(invoice);\n    displayDecodedInvoice(data);\n  });\n  const sendBtn = document.getElementById('sendBtn');\n  sendBtn.addEventListener('click', async () => {\n    try {\n      const invoiceTxt = await pasteFromClipBoard();\n      handlePayment(invoiceTxt);\n    } catch (error) {\n      console.error(`Error: ${error}`);\n    }\n  });\n  const recieveBtn = document.getElementById('recieveBtn');\n  recieveBtn.addEventListener('click', () => {\n    const createInvoiceDiv = document.getElementById('createInvoice');\n    createInvoiceDiv.classList.toggle('hide');\n  });\n  const newInvBtn = document.getElementById('createInvBtn');\n  newInvBtn.addEventListener('click', async () => {\n    const amount = await returnAmount();\n    handleInvoice(amount);\n  });\n}\nasync function returnAmount() {\n  const amountInput = document.getElementById('amountInput');\n  if (amountInput.value <= 0 || amountInput.value === '') {\n    return;\n  }\n  return amountInput.value;\n}\nasync function pasteFromClipBoard() {\n  try {\n    const clipBrdTxt = await navigator.clipboard.readText();\n    return clipBrdTxt;\n  } catch {\n    return `Error reading clipboard: ${error.message}`;\n  }\n}\nasync function displayBtcPrice() {\n  const btcPrice = document.getElementById('btcPrice');\n  const price = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getBitcoinPrice)();\n  const string_price = Number(price).toLocaleString();\n  btcPrice.textContent = `$${string_price}`;\n}\nasync function displayWalletBal() {\n  const walletBal = document.getElementById('walletBal');\n  const balance = await (0,_lnbits__WEBPACK_IMPORTED_MODULE_0__.getLnbitsBalance)();\n  const string_bal = Number(balance).toLocaleString();\n  walletBal.textContent = `${string_bal} sats`;\n}\n\nasync function abreviateHash(hash, start, end) {\n  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;\n}\n\n//# sourceURL=webpack://pleb_wallet/./src/dom.js?");

/***/ }),

/***/ "./src/lnbits.js":
/*!***********************!*\
  !*** ./src/lnbits.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decodeInvoice: () => (/* binding */ decodeInvoice),\n/* harmony export */   getAmountFrom: () => (/* binding */ getAmountFrom),\n/* harmony export */   getBitcoinPrice: () => (/* binding */ getBitcoinPrice),\n/* harmony export */   getInvoice: () => (/* binding */ getInvoice),\n/* harmony export */   getLnbitsBalance: () => (/* binding */ getLnbitsBalance),\n/* harmony export */   getLnbitsTransactions: () => (/* binding */ getLnbitsTransactions),\n/* harmony export */   postJson: () => (/* binding */ postJson),\n/* harmony export */   submitInvoiceToPay: () => (/* binding */ submitInvoiceToPay)\n/* harmony export */ });\n/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ \"./config.js\");\n\nconst LN_BITS_API_URL = `https://legend.lnbits.com/api/v1/payments`;\nconst LN_BITS_API_WALLET = `https://legend.lnbits.com/api/v1/wallet`;\nconst LN_BITS_API_ADMIN_KEY = _config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].adminKey;\nconst LN_BITS_INVOICE_READ_KEY = _config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].invKey;\nasync function getData(url, apikey, content_type) {\n  const headers = new Headers();\n  if (apikey) {\n    headers.append('X-Api-Key', apikey);\n  }\n  if (content_type) {\n    headers.append('Content-type', content_type);\n  }\n  try {\n    const response = await fetch(url, {\n      method: 'GET',\n      headers: headers\n    });\n    if (!response.ok) {\n      throw new Error(`Failed to fetch data. Status: ${response.status}`);\n    }\n    return await response.text();\n  } catch (error) {\n    throw new Error(`Eroor fetching data. Status: ${error.message}`);\n  }\n}\nasync function postJson(url, apikey, content_type, json) {\n  try {\n    const response = await fetch(url, {\n      method: 'POST',\n      headers: {\n        'Content-Type': content_type,\n        'X-Api-Key': apikey\n      },\n      body: json\n    });\n    if (!response.ok) {\n      throw new Error(`Failed to post data. Status: ${response.status}`);\n    }\n    const jsonResponse = await response.json();\n    return jsonResponse;\n  } catch (error) {\n    console.error(`Error posting data: ${error.message}`);\n    throw error;\n  }\n}\n\n//get functions\nasync function getBitcoinPrice() {\n  let data = await getData(`https://api.coinbase.com/v2/prices/BTC-USD/spot`);\n  let json = JSON.parse(data);\n  let price = json.data.amount;\n  return price;\n}\nasync function getLnbitsBalance() {\n  let data = await getData(LN_BITS_API_WALLET, LN_BITS_API_ADMIN_KEY);\n  let json = JSON.parse(data);\n  let balance = Number(json.balance) / 1000;\n  return balance;\n}\nasync function getLnbitsTransactions() {\n  let data = await getData(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`);\n  return JSON.parse(data);\n}\n\n//post functions\nasync function getInvoice(amount) {\n  let json = {\n    unit: 'sat',\n    amount: Number(amount),\n    memo: 'plebWallet',\n    out: false,\n    description_hash: ''\n  };\n  try {\n    const response = await postJson(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, `application/json`, JSON.stringify(json));\n    return response;\n  } catch (error) {\n    console.error(`Error getting invoice: ${error}`);\n    throw error;\n  }\n}\nasync function getAmountFrom(invoice) {\n  const data = await decodeInvoice(invoice);\n  const amount = data.amount_msat / 1000;\n  return amount;\n}\nasync function decodeInvoice(invoice) {\n  let json = {\n    data: invoice\n  };\n  const data = await postJson('https://legend.lnbits.com/api/v1/payments/decode', LN_BITS_INVOICE_READ_KEY, 'application/json', JSON.stringify(json));\n  console.log(data);\n  return data;\n}\nasync function submitInvoiceToPay(invoice) {\n  try {\n    await customAlert(invoice);\n    let json = {\n      out: true,\n      bolt11: invoice\n    };\n    const response = await postJson(LN_BITS_API_URL, LN_BITS_API_ADMIN_KEY, \"application/json\", JSON.stringify(json));\n    console.log(response);\n    const paymentHash = response.payment_hash;\n    console.log(`Payment successful: ${paymentHash}`);\n    return paymentHash;\n  } catch (error) {\n    console.error(`Error submitting invoice: ${error}`);\n  }\n}\nasync function customAlert(invoice) {\n  const amount = await getAmountFrom(invoice);\n  const abrevInv = await abreviateHash(invoice, 11, 11);\n  return new Promise((resolve, reject) => {\n    let isPlural = amount > 1;\n    Swal.fire({\n      title: `Pay Invoice`,\n      showClass: {\n        popup: `\n                  animate__animated\n                  animate__fadeInUp\n                  animate__faster\n                `\n      },\n      hideClass: {\n        popup: `\n                  animate__animated\n                  animate__fadeOutDown\n                  animate__faster\n                `\n      },\n      html: `${amount} sat${isPlural ? 's' : ''}<br>Are you sure you want to pay this invoice?<br> ${abrevInv} `,\n      icon: 'question',\n      showCancelButton: true,\n      confirmButtonText: `<i class=\"fas fa-thumbs-up\"></i>  Yes, pay it!`,\n      cancelButtonText: `<i class=\"fa fa-thumbs-down\"></i>  Cancel`,\n      customClass: {\n        confirmButton: 'btnConfirm',\n        cancelButton: 'btnCancel'\n      }\n    }).then(result => {\n      if (result.isConfirmed) {\n        resolve();\n      } else {\n        reject(false);\n      }\n    });\n  });\n}\nasync function confirmedPayment() {\n  Swal.fire({\n    position: \"top-center\",\n    icon: \"success\",\n    title: \"Transaction Sucess!\",\n    showConfirmButton: false,\n    timer: 1500\n  });\n}\n// async function postLNURL(amount) {\n//     let json = {\n//         description_hash: 'string',\n//         callback: 'string',\n//         amount: amount,\n//         comment: 'string',\n//         description: 'string'\n//     }\n//     try {\n//         const response = await postJson(`${LN_BITS_API_URL}/lnurl`, LN_BITS_API_ADMIN_KEY, 'application/json', JSON.stringify(json))\n//         console.log(response)\n//         return response\n//     } catch (error) {\n//         console.error(`Error posting json for LNURL ${error}`)\n//     }\n// }\nasync function abreviateHash(hash, start, end) {\n  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;\n}\n\n\n//# sourceURL=webpack://pleb_wallet/./src/lnbits.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ \"./src/dom.js\");\n\nasync function app() {\n  (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayBtcPrice)();\n  (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayWalletBal)();\n  (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.displayTransactions)();\n  setTimeout(function () {\n    app();\n  }, 10000);\n}\ndocument.addEventListener('DOMContentLoaded', async function () {\n  await (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.handleBtns)();\n  await app();\n});\n\n//# sourceURL=webpack://pleb_wallet/./src/script.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/script.js");
/******/ 	
/******/ })()
;