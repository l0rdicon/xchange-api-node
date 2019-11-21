
[![Latest Version]](https://github.com/l0rdicon/xchange-node-api/releases)
[![GitHub last commit]](#)
[![npm downloads]](https://www.npmjs.com/package/xchange-node-api)

# Node Xchange API
This project is designed to help you make your own projects that interact with the [Xchange API]. You can stream candlestick chart data, market depth. This project seeks to have complete API coverage.

#### Installation
```
npm install xchange-node-api --save
```

#### Getting started
```javascript
const xchange = require('xchange-node-api')().options({
  APIKEY: '<key>',
  APISECRET: '<secret>',
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});
```

#### Getting latest price of a symbol
```js
xchange.prices('BTC_CLAM', (error, ticker) => {
  console.log("Price of HTC: ", ticker.BTC_CLAM);
});
```

#### Getting list of current balances
```javascript
xchange.balance((error, balances) => {
  if ( error ) return console.error(error);
  console.log("balances()", balances);
  console.log("ETH balance: ", balances.ETH.free);
});
// If you have problems with this function,
// see Troubleshooting at the bottom of this page.
```
<details>
 <summary>View Response</summary>

```js
{ BTC: { free: '0.77206464', locked: '0.00177975' },
  LTC: { free: '0.00000000', locked: '0.00000000' },
  ETH: { free: '1.14109900', locked: '0.00000000' }
  }
//ETH balance:  1.14109900
```
</details>

#### Getting bid/ask prices for a symbol
```js
xchange.bookTickers('BTC_CLAM', (error, ticker) => {
  console.log("bookTickers", ticker);
});
```

 <details>
  <summary>View Response</summary>

```js 		 
{
  "symbol": "BTC_CLAM",
  "bidPrice": "4.00000000",
  "bidQty": "431.00000000",
  "askPrice": "4.00000200",
  "askQty": "9.00000000"
}

```
</details>

#### Getting bid/ask prices for all symbols
```js
xchange.bookTickers((error, ticker) => {
  console.log("bookTickers()", ticker);
  console.log("Price of BNB: ", ticker.BNBBTC);
});
```

<details>
 <summary>View Response</summary>

```js
 { BTC_CLAM:
   { bid: '0.06201000',
     bids: '1.28200000',
     ask: '0.06201300',
     asks: '0.34200000' },
  BTC_LTC:
   { bid: '0.01042000',
     bids: '41.45000000',
     ask: '0.01048700',
     asks: '16.81000000' },
 }
```
</details>

#### Get all bid/ask prices
```javascript
xchange.bookTickers((error, ticker) => {
  console.log("bookTickers", ticker);
});
```
<details>
 <summary>View Response</summary>

```js
{ BTC_CLAM:
   { bid: '0.06187700',
     bids: '0.64000000',
     ask: '0.06188300',
     asks: '6.79700000' },
  BTC_LTC:
   { bid: '0.01036000',
     bids: '14.96000000',
     ask: '0.01037000',
     asks: '0.60000000' },
 }
```
</details>

#### Get market depth for a symbol
```javascript
xchange.depth("BTC_CLAM", (error, depth, symbol) => {
  console.log(symbol+" market depth", depth);
});
```
<details>
 <summary>View Response</summary>

```js
market depth for BTC_CLAM
{ bids:
   { '0.00022997': '49.00000000',
     '0.00022867': '11.00000000',
     '0.00022865': '1149.00000000',
     '0.00022810': '20.00000000',
     '0.00022800': '1000.00000000',
     '0.00022777': '1350.00000000',
     '0.00022774': '96.00000000',
     '0.00022765': '5.00000000',
     '0.00022741': '12.00000000',
     '0.00022705': '1372.00000000',
     '0.00022700': '402.00000000',
     '0.00022514': '756.00000000',
     '0.00022513': '761.00000000',
     '0.00022502': '2244.00000000',
     '0.00022501': '2190.00000000',
     '0.00022500': '5069.00000000',
     '0.00022419': '1871.00000000',
     '0.00022418': '1667.00000000',
     '0.00022167': '1889.00000000',
     '0.00022162': '1014.00000000',
     '0.00022112': '13563.00000000',
     '0.00022078': '4056.00000000',
     '0.00022000': '8060.00000000',
     '0.00021963': '13563.00000000',
     '0.00021850': '52.00000000',
     '0.00021800': '1282.00000000',
     '0.00021710': '102.00000000',
     '0.00021680': '100.00000000',
     '0.00021652': '29.00000000',
     '0.00021641': '154.00000000',
     '0.00021500': '1491.00000000',
     '0.00021471': '977.00000000',
     '0.00021405': '478.00000000',
     '0.00021400': '11.00000000',
     '0.00021314': '686.00000000',
     '0.00021219': '1089.00000000',
     '0.00021200': '767.00000000',
     '0.00021100': '5000.00000000',
     '0.00021011': '50.00000000',
     '0.00021000': '3468.00000000',
     '0.00020900': '169.00000000',
     '0.00020843': '90.00000000',
     '0.00020811': '200.00000000',
     '0.00020702': '50.00000000',
     '0.00020691': '283.00000000',
     '0.00020600': '3703.00000000',
     '0.00020500': '107.00000000',
     '0.00020450': '6363.00000000',
     '0.00020250': '301.00000000',
     '0.00020222': '200.00000000',
     '0.00020200': '123.00000000',
     '0.00020137': '50.00000000',
     '0.00020122': '727.00000000',
     '0.00020100': '6400.00000000',
     '0.00020088': '10.00000000',
     '0.00020020': '793.00000000',
     '0.00020010': '500.00000000',
     '0.00020009': '44.00000000',
     '0.00020001': '20020.00000000',
     '0.00020000': '45269.00000000',
     '0.00019990': '270.00000000',
     '0.00019880': '2117.00000000',
     '0.00019800': '1200.00000000',
     '0.00019783': '50.00000000',
     '0.00019702': '300.00000000',
     '0.00019686': '10.00000000',
     '0.00019600': '1025.00000000',
     '0.00019595': '139.00000000',
     '0.00019501': '3227.00000000',
     '0.00019500': '3832.00000000',
     '0.00019488': '82.00000000',
     '0.00019400': '1853.00000000',
     '0.00019293': '10.00000000',
     '0.00019289': '30.00000000',
     '0.00019234': '1999.00000000',
     '0.00019200': '4765.00000000',
     '0.00019190': '6.00000000',
     '0.00019100': '4353.00000000',
     '0.00019073': '12.00000000',
     '0.00019058': '28.00000000',
     '0.00019050': '718.00000000',
     '0.00019001': '20.00000000',
     '0.00019000': '39478.00000000',
     '0.00018907': '10.00000000',
     '0.00018888': '10045.00000000',
     '0.00018880': '15.00000000',
     '0.00018800': '3528.00000000',
     '0.00018700': '328.00000000',
     '0.00018600': '1000.00000000',
     '0.00018598': '2187.00000000',
     '0.00018538': '1383.00000000',
     '0.00018529': '10.00000000',
     '0.00018500': '1512.00000000',
     '0.00018253': '30.00000000',
     '0.00018200': '3000.00000000',
     '0.00018158': '10.00000000',
     '0.00018106': '250.00000000',
     '0.00018100': '4577.00000000',
     '0.00018011': '500.00000000',
     '0.00018000': '29832.00000000' },
  asks:
   { '0.00022999': '32.00000000',
     '0.00023086': '583.00000000',
     '0.00023095': '1154.00000000',
     '0.00023119': '781.00000000',
     '0.00023120': '3401.00000000',
     '0.00023180': '4889.00000000',
     '0.00023185': '83.00000000',
     '0.00023211': '750.00000000',
     '0.00023339': '9273.00000000',
     '0.00023340': '474.00000000',
     '0.00023440': '500.00000000',
     '0.00023450': '1433.00000000',
     '0.00023500': '1480.00000000',
     '0.00023573': '87.00000000',
     '0.00023580': '518.00000000',
     '0.00023999': '863.00000000',
     '0.00024000': '275.00000000',
     '0.00024100': '60.00000000',
     '0.00024119': '3736.00000000',
     '0.00024180': '989.00000000',
     '0.00024350': '1285.00000000',
     '0.00024399': '500.00000000',
     '0.00024400': '2964.00000000',
     '0.00024419': '500.00000000',
     '0.00024500': '4499.00000000',
     '0.00024580': '542.00000000',
     '0.00024584': '6.00000000',
     '0.00024700': '250.00000000',
     '0.00024789': '2938.00000000',
     '0.00024790': '5535.00000000',
     '0.00024800': '499.00000000',
     '0.00024892': '2000.00000000',
     '0.00024920': '652.00000000',
     '0.00024972': '9242.00000000',
     '0.00024999': '1262.00000000',
     '0.00025000': '3739.00000000',
     '0.00025078': '250.00000000',
     '0.00025348': '1000.00000000',
     '0.00025499': '220.00000000',
     '0.00025500': '6029.00000000',
     '0.00025518': '10.00000000',
     '0.00025698': '17.00000000',
     '0.00025700': '250.00000000',
     '0.00025800': '265.00000000',
     '0.00025925': '20.00000000',
     '0.00025984': '1048.00000000',
     '0.00025985': '1048.00000000',
     '0.00025987': '1165.00000000',
     '0.00025990': '465.00000000',
     '0.00025994': '571.00000000',
     '0.00025995': '390.00000000',
     '0.00026000': '5033.00000000',
     '0.00026028': '10.00000000',
     '0.00026280': '40.00000000',
     '0.00026300': '13.00000000',
     '0.00026348': '50.00000000',
     '0.00026500': '38.00000000',
     '0.00026548': '10.00000000',
     '0.00026594': '51.00000000',
     '0.00026666': '15000.00000000',
     '0.00026700': '500.00000000',
     '0.00026800': '27.00000000',
     '0.00026900': '1000.00000000',
     '0.00026929': '50.00000000',
     '0.00026990': '270.00000000',
     '0.00027000': '8750.00000000',
     '0.00027199': '50.00000000',
     '0.00027300': '351.00000000',
     '0.00027429': '50.00000000',
     '0.00027480': '270.00000000',
     '0.00027500': '38.00000000',
     '0.00027690': '242.00000000',
     '0.00027700': '500.00000000',
     '0.00027789': '1317.00000000',
     '0.00027906': '1457.00000000',
     '0.00027912': '98.00000000',
     '0.00027949': '50.00000000',
     '0.00027950': '2000.00000000',
     '0.00027977': '96.00000000',
     '0.00027980': '1031.00000000',
     '0.00028000': '782.00000000',
     '0.00028300': '25.00000000',
     '0.00028500': '48.00000000',
     '0.00028590': '364.00000000',
     '0.00028680': '50.00000000',
     '0.00028699': '50.00000000',
     '0.00028700': '1600.00000000',
     '0.00028800': '3509.00000000',
     '0.00028890': '175.00000000',
     '0.00028900': '11474.00000000',
     '0.00028999': '10000.00000000',
     '0.00029000': '623.00000000',
     '0.00029100': '303.00000000',
     '0.00029141': '456.00000000',
     '0.00029200': '9999.00000000',
     '0.00029234': '104.00000000',
     '0.00029300': '200.00000000',
     '0.00029358': '325.00000000',
     '0.00029399': '153.00000000',
     '0.00029428': '100.00000000' } }
```
</details>

#### Placing a LIMIT order
```javascript
var quantity = 1, price = 0.069;
xchange.buy("BTC_CLAM", quantity, price);
xchange.sell("BTC_CLAM", quantity, price);
```

#### Placing a MARKET order
```javascript
// These orders will be executed at current market price.
var quantity = 1;
xchange.marketBuy("BTC_CLAM", quantity);
xchange.marketSell("BTC_CLAM", quantity);
```

#### LIMIT order with callback
```javascript
var quantity = 5, price = 0.00402030;
xchange.buy("BTC_CLAM", quantity, price, {type:'LIMIT'}, (error, response) => {
  console.log("Limit Buy response", response);
  console.log("order id: " + response.order_id);
});
```

<details>
 <summary>View Response</summary>

```
Limit Buy response {
  market: 'BTC_CLAM',
  order_id: 'awefawef230-awefawef32f23f2-23f2f2-23f2,
  user_id: 'te38xGILZUXrPZHnTQPH6h',
  price: '0.00402030',
  quantity: '5.00000000',
  remaining: '0.00000000',
  status: 'filled',
  type: 'limit',
  side: 'buy' }

```

</details>

#### Chaining orders together
```js
var quantity = 1;
xchange.marketBuy("BTC_CLAM", quantity, (error, response) => {
  console.log("Market Buy response", response);
  console.log("order id: " + response.order_id);
});
```

<details>
 <summary>View Response</summary>

```
Market Buy response {
  market: 'BTC_CLAM',
  order_id: 'awefawef230-awefawef32f23f2-23f2f2-23f2,
  user_id: 'te38xGILZUXrPZHnTQPH6h',
  price: '0.00402030',
  quantity: '5.00000000',
  remaining: '0.00000000',
  status: 'filled',
  type: 'limit',
  side: 'buy' }
```

</details>

#### Cancel an order
```javascript
xchange.cancel("BTC_CLAM", orderid, (error, response, symbol) => {
  console.log(symbol+" cancel response:", response);
});
```

#### Cancel all open orders
```js
xchange.cancelOrders("BTC_CLAM", (error, response, symbol) => {
  console.log(symbol+" cancel response:", response);
});
```

#### Get open orders for a symbol
```javascript
xchange.openOrders("BTC_CLAM", (error, openOrders, symbol) => {
  console.log("openOrders("+symbol+")", openOrders);
});
```

#### Get list of all open orders
```javascript
xchange.openOrders(false, (error, openOrders) => {
  console.log("openOrders()", openOrders);
});
```

#### Check an order's status
```javascript
let orderid = "7610385";
xchange.orderStatus("BTC_CLAM", orderid, (error, orderStatus, symbol) => {
  console.log(symbol+" order status:", orderStatus);
});
```

#### Trade history
```javascript
xchange.trades("BTC_CLAM", (error, trades, symbol) => {
  console.log(symbol+" trade history", trades);
});
```
<details>
 <summary>View Response</summary>

```js
[ { id: 9572,
    orderId: 47884,
    price: '0.00003701',
    qty: '1467.00000000',
    commission: '0.06774660',
    commissionAsset: 'BNB',
    time: 1507062500456,
    isBuyer: true,
    isMaker: true,
    isBestMatch: true },
  { id: 9575,
    orderId: 47884,
    price: '0.00003701',
    qty: '735.00000000',
    commission: '0.03394257',
    commissionAsset: 'BNB',
    time: 1507062502528,
    isBuyer: true,
    isMaker: true,
    isBestMatch: true } } ]
```
</details>

#### Get all account orders; active, canceled, or filled.
```javascript
xchange.allOrders("BTC_CLAM", (error, orders, symbol) => {
  console.log(symbol+" orders:", orders);
});
```

#### Get 24hr ticker price change statistics for all symbols
```javascript
xchange.prevDay(false, (error, prevDay) => {
  // console.log(prevDay); // view all data
  for ( let obj of prevDay ) {
    let symbol = obj.symbol;
    console.log(symbol+" volume:"+obj.volume+" change: "+obj.priceChangePercent+"%");
  }
});
```

#### Get 24hr ticker price change statistics for a symbol
```javascript
xchange.prevDay("BTC_CLAM", (error, prevDay, symbol) => {
  console.log(symbol+" previous day:", prevDay);
  console.log("BNB change since yesterday: "+prevDay.priceChangePercent+"%")
});
```

#### Get Kline/candlestick data for a symbol
You can use the optional API parameters for getting historical candlesticks, these are useful if you want to import data from earlier back in time.
Optional parameters: limit (max/default 500), startTime, endTime.

```javascript
// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
xchange.candlesticks("BTC_CLAM", "5m", (error, ticks, symbol) => {
  console.log("candlesticks()", ticks);
  let last_tick = ticks[ticks.length - 1];
  let [openTime, open, high, low, close, volume, closeTime, count] = last_tick;
  console.log(symbol+" last close: "+close);
}, {limit: 500, endTime: 1514764800000});
```

### Deposit & Withdraw

#### Get Deposit Address
```js
xchange.depositAddress("BTC", (error, response) => {
  console.log(response);
});
```

#### Get All Deposit History
```js
xchange.depositHistory((error, response) => {
  console.log(response);
});
```

#### Get Deposit History for a specific symbol
```js
xchange.depositHistory((error, response) => {
  console.log(response);
}, "BTC");
```

#### Get All Withdraw History
```js
xchange.withdrawHistory((error, response) => {
  console.log(response);
});
```

#### Get Withdraw History for a specific symbol
```js
xchange.withdrawHistory((error, response) => {
  console.log(response);
}, "BTC");
```

#### Withdraw with Callback
```js
xchange.withdraw("ETH", "0x1d2034348c851ea29c7d03731c7968a5bcc91564", 1, false, (error, response) => {
  console.log(response);
});
```

#### Withdraw
```js
xchange.withdraw("BTC", "1C5gqLRs96Xq4V2ZZAR1347yUCpHie7sa", 0.2);
```

### Proxy Support
For the standard REST API the https_proxy or socks_proxy variable is honoured
*NOTE* proxy package has no dns name support, please use proxy IP address

**Linux**
```bash
export https_proxy=http://ip:port
#export socks_proxy=socks://ip:port
# run your app
```

**Windows**
```bash
set https_proxy=http://ip:port
#set socks_proxy=socks://ip:port
# run your app
```

### Troubleshooting
Verify that your system time is correct. If you have any suggestions don't hesitate to file an issue.

Having problems? Try adding `useServerTime` to your options or setting `recvWindow`:
```js
xchange.options({
  APIKEY: 'xxx',
  APISECRET: 'xxx',
  useServerTime: true,
  recvWindow: 60000, // Set a higher recvWindow to increase response timeout
  verbose: true, // Add extra output when subscribing to WebSockets, etc
  log: log => {
    console.log(log); // You can create your own logger here, or disable console output
  }
});
```

Problems getting your balance? Wrap the entry point of your application in useServerTime:
```js
xchange.useServerTime(function() {
	xchange.balance((error, balances) => {
		if ( error ) return console.error(error);
		console.log("balances()", balances);
		console.log("BTC balance: ", balances.BTC.avaliable);
	});
});
```
