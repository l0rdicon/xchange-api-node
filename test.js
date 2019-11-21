/* ============================================================
 * xchange-node-api
 * https://github.com/l0rdicon/xchange-node-api
 * ============================================================
 * Copyright 2017-, Jon Eyrick
 * Released under the MIT License
 * ============================================================ */

'use strict';

const WARN_SHOULD_BE_OBJ = 'should be an object';
const WARN_SHOULD_BE_NULL = 'should be null';
const WARN_SHOULD_BE_NOT_NULL = 'should not be null';
const WARN_SHOULD_HAVE_KEY = 'should have key ';
const WARN_SHOULD_NOT_HAVE_KEY = 'should not have key ';
const WARN_SHOULD_BE_UNDEFINED = 'should be undefined';
const WARN_SHOULD_BE_TYPE = 'should be a ';
const TIMEOUT = 10000;

let chai = require('chai');
let assert = chai.assert;
let path = require('path');
let Xchange = require(path.resolve(__dirname, 'xchange-node-api.js'));
let xchange = new Xchange();
let util = require('util');

let num_pairs = 299;
let num_currencies = 155;

let logger = {
  log: function (msg) {
    let logLineDetails = ((new Error().stack).split('at ')[3]).trim();
    let logLineNum = logLineDetails.split(':');
    console.log('DEBUG', logLineNum[1] + ':' + logLineNum[2], msg);
  }
}

let debug = function (x) {
  if (typeof (process.env.node_xchange_api) === 'undefined') {
    return;
  }
  logger.log(typeof (x));
  logger.log(util.inspect(x));
}

debug('Begin');

/*global describe*/
/*eslint no-undef: "error"*/
describe('Construct', function () {
  /*global it*/
  /*eslint no-undef: "error"*/
  it('Construct the xchange object', function (done) {
    xchange.options({
      APIKEY: '5enQYcMQk2J3syHCao9xgJOnnPoGtDMhSRRAzG2Gxo90TBzXPG1itcXikQc2VRDh',
      APISECRET: 'uWJQXigS3AjftKe8c6xK2t3rkTqkmfeeNPwcycBLGXXsuU4eUvLkPY9qcOnB2UYI',
      useServerTime: true,
      reconnect: false,
      verbose: true,
      log: debug
    });
    assert(typeof (xchange) === 'object', 'Xchange is not an object');
    done();
  }).timeout(TIMEOUT);
});


describe('UseServerTime', function () {
  it('Call use server time', function (done) {
    xchange.useServerTime();
    done();
  }).timeout(TIMEOUT);
});

describe('Prices', function () {
  it('Checks the price of BNBBTC', function (done) {
    xchange.prices('BTC_CLAM', (error, ticker) => {
      debug(error);
      debug(ticker);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (ticker) === 'object', WARN_SHOULD_BE_OBJ);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(ticker !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.prototype.hasOwnProperty.call(ticker, 'BTC_CLAM'), WARN_SHOULD_HAVE_KEY + 'BTC_CLAM');
      assert(Object.prototype.hasOwnProperty.call(ticker, 'BTC_ETH') === false, WARN_SHOULD_NOT_HAVE_KEY + 'BTC_ETH');
      done();
    });
  }).timeout(TIMEOUT);
});

describe('All Prices', function () {
  it('Checks the prices of coin pairs', function (done) {
    xchange.prices((error, ticker) => {
      debug(error);
      debug(ticker);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (ticker) === 'object', WARN_SHOULD_BE_OBJ);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(ticker !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.prototype.hasOwnProperty.call(ticker, 'BTC_CLAM'), WARN_SHOULD_HAVE_KEY + 'BTC_CLAM');
      assert(Object.keys(ticker).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?');
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Balances', function () {
  it('Get the balances in the account', function (done) {
    xchange.balance((error, balances) => {
      debug(error);
      debug(balances);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(balances !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(balances);
      assert(Object.prototype.hasOwnProperty.call(balances, 'BNB'), WARN_SHOULD_HAVE_KEY + 'BNB');
      assert(Object.prototype.hasOwnProperty.call(balances.BNB, 'available'), WARN_SHOULD_HAVE_KEY + 'available');
      assert(Object.prototype.hasOwnProperty.call(balances.BNB, 'onOrder'), WARN_SHOULD_HAVE_KEY + 'onOrder');
      assert(Object.keys(balances).length >= num_currencies, 'should at least ' + num_currencies + 'currencies?');
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Book Ticker', function () {
  it('Get the CLAM book ticker', function (done) {
    xchange.bookTickers('BTC_CLAM', (error, ticker) => {
      debug(error);
      debug(ticker);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(ticker !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(ticker);

      let members = ['symbol', 'bidPrice', 'bidQty', 'askPrice', 'askQty'];
      members.forEach(function (value) {
        assert(Object.prototype.hasOwnProperty.call(ticker, value), WARN_SHOULD_HAVE_KEY + value);
      });
      done();
    });
  }).timeout(TIMEOUT);

  it('Get all book tickers', function (done) {
    xchange.bookTickers(false, (error, ticker) => {
      assert(ticker);
      /*
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( ticker );

      let members = ['symbol', 'bidPrice', 'bidQty', 'askPrice', 'askQty'];
      members.forEach( function( value ) {
        assert( Object.prototype.hasOwnProperty.call(ticker, value ), WARN_SHOULD_HAVE_KEY + value );
      });
      */
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Booker Tickers', function () {
  it('Get the tickers for all pairs', function (done) {
    xchange.bookTickers((error, ticker) => {
      debug(error);
      debug(ticker);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (ticker) === 'object', WARN_SHOULD_BE_OBJ);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(ticker !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.keys(ticker).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?');

      let members = ['symbol', 'bidPrice', 'bidQty', 'askPrice', 'askQty'];
      ticker.forEach(function (obj) {
        members.forEach(function (member) {
          assert(Object.prototype.hasOwnProperty.call(obj, member), WARN_SHOULD_HAVE_KEY + member);
        });
      });
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Market', function () {
  it('Get the market base symbol of a symbol pair', function (done) {
    let tocheck = ['BTC_CLAM', 'BTC_ETH', 'BTC_DOGE', 'BTC_LTC'];
    tocheck.forEach(function (element) {
      let mark = xchange.getMarket(element);
      assert(typeof (mark) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(element.endsWith(mark), 'should end with: ' + mark);
    });

    assert.isNotOk(xchange.getMarket('ABCDEFG'), WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout(TIMEOUT);
});

describe('Depth chart CLAM', function () {
  it('Get the depth chart information for BTC_CLAM', function (done) {
    xchange.depth('BTC_CLAM', (error, depth, symbol) => {
      debug(error);
      debug(depth);
      debug(symbol);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(depth !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(symbol !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(typeof (symbol) === 'string', 'should be type of string');
      assert(symbol === 'BTC_CLAM', 'should be BTC_CLAM');
      assert(typeof (depth) === 'object', WARN_SHOULD_BE_OBJ);
      assert(Object.keys(depth).length === 3, 'should have length 3');

      let members = ['sequence', 'asks', 'bids'];
      members.forEach(function (value) {
        assert(Object.prototype.hasOwnProperty.call(depth, value), WARN_SHOULD_HAVE_KEY + value);
      });
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Buy', function () {
  it('Attempt to buy ETH', function (done) {
    let quantity = 1;
    let price = 0.069;
    assert(typeof (xchange.buy('BTC_ETH', quantity, price)) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout(TIMEOUT);
});

describe('Sell', function () {
  it('Attempt to sell ETH', function (done) {
    let quantity = 1;
    let price = 0.069;
    assert(typeof (xchange.sell('BTC_ETH', quantity, price)) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout(TIMEOUT);
});

describe('MarketBuy', function () {
  it('Attempt to buy ETH at market price', function (done) {
    let quantity = 1;
    assert(typeof (xchange.marketBuy('BTC_ETH', quantity)) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout(TIMEOUT);
});

describe('MarketSell', function () {
  it('Attempt to sell ETH at market price', function (done) {
    let quantity = 1;
    assert(typeof (xchange.marketSell('BTC_ETH', quantity)) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout(TIMEOUT);
});

describe('Buy order advanced', function () {
  it('Attempt to buy CLAM specifying order type', function (done) {
    let type = 'LIMIT';
    let quantity = 1;
    let price = 0.069;
    assert(typeof (xchange.buy('BTC_CLAM', quantity, price, { type: type })) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout(TIMEOUT);
});

describe('Cancel order', function () {
  it('Attempt to cancel an order', function (done) {
    let orderid = '7610385';
    xchange.cancel('BTC_CLAM', orderid, (error, response, symbol) => {
      debug(error);
      debug(response);
      debug(symbol);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (response) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM');
      assert(error !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(response !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(error.body === '{"code":-2011,"msg":"UNKNOWN_ORDER"}');
      assert(typeof (response.orderId) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
      assert(Object.keys(response).length === 0);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Cancel orders', function () {
  it('Attempt to cancel all orders given a symbol', function (done) {
    xchange.cancelOrders('BTC_CLAM', (error, response, symbol) => {
      debug(error);
      debug(response);
      debug(symbol);
      assert(typeof (error) === 'string', WARN_SHOULD_BE_OBJ);
      assert(typeof (response) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM');
      assert(error !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(error === 'No orders present for this symbol', WARN_SHOULD_BE_TYPE + 'string');
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Open Orders', function () {
  it('Attempt to show all orders to BTC_CLAM', function (done) {
    xchange.openOrders('BTC_CLAM', (error, openOrders, symbol) => {
      debug(error);
      debug(openOrders);
      debug(symbol);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (openOrders) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM');
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(openOrders !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(symbol !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.keys(openOrders).length === 0);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Open Orders', function () {
  it('Attempt to show all orders for all symbols', function (done) {
    xchange.openOrders(false, (error, openOrders) => {
      debug(error);
      debug(openOrders);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (openOrders) === 'object', WARN_SHOULD_BE_OBJ);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(openOrders !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.keys(openOrders).length === 0);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Order status', function () {
  it('Attempt to get the order status for a given order id', function (done) {
    xchange.orderStatus('BTC_CLAM', '1234567890', (error, orderStatus, symbol) => {
      debug(error);
      debug(orderStatus);
      debug(symbol);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (orderStatus) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM');
      assert(error !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(orderStatus !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(error.body === '{"code":-1113,"msg":"Order does not exist."}');
      assert(Object.keys(orderStatus).length === 0);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('trades', function () {
  it('Attempt get all trade history for given symbol', function (done) {
    xchange.trades('BTC_CLAM', (error, trades, symbol) => {
      debug(error);
      debug(trades);
      debug(symbol);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (trades) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM');
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(trades !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.keys(trades).length === 0);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Orders', function () {
  it('Attempt get all orders for given symbol', function (done) {
    xchange.allOrders('BTC_CLAM', (error, orders, symbol) => {
      debug(error);
      debug(orders);
      debug(symbol);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (orders) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM');
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(orders !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.keys(orders).length === 0);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Prevday all symbols', function () {
  it('Attempt get prevday trade status for all symbols', function (done) {
    xchange.prevDay(false, (error, prevDay) => {
      debug(error);
      debug(prevDay);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (prevDay) === 'object', WARN_SHOULD_BE_OBJ);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(prevDay !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.keys(prevDay).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?');

      let members = [
        'symbol', 'priceChange', 'priceChangePercent', 'weightedAvgPrice', 'prevClosePrice',
        'lastPrice', 'lastQty', 'bidPrice', 'bidQty', 'askQty', 'openPrice', 'highPrice', 'lowPrice',
        'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstId', 'lastId', 'count'
      ];
      prevDay.forEach(function (obj) {
        members.forEach(function (key) {
          assert(Object.prototype.hasOwnProperty.call(obj, key), WARN_SHOULD_HAVE_KEY + key);
        });
      });
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Prevday', function () {
  it('Attempt get prevday trade status for given symbol', function (done) {
    xchange.prevDay('BTC_CLAM', (error, prevDay, symbol) => {
      debug(error);
      debug(prevDay);
      debug(symbol);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (prevDay) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM', 'Should be BTC_CLAM');
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(prevDay !== null, WARN_SHOULD_BE_NOT_NULL);

      let members = [
        'symbol', 'priceChange', 'priceChangePercent', 'weightedAvgPrice', 'prevClosePrice',
        'lastPrice', 'lastQty', 'bidPrice', 'bidQty', 'askQty', 'openPrice', 'highPrice', 'lowPrice',
        'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstId', 'lastId', 'count'
      ];
      members.forEach(function (key) {
        assert(Object.prototype.hasOwnProperty.call(prevDay, key), WARN_SHOULD_HAVE_KEY + key);
      });
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Candle sticks', function () {
  it('Attempt get candlesticks for a given symbol', function (done) {
    xchange.candlesticks('BTC_CLAM', '5m', (error, ticks, symbol) => {
      debug(error);
      debug(ticks);
      debug(symbol);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (ticks) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (symbol) === 'string', WARN_SHOULD_BE_TYPE + 'string');
      assert(symbol === 'BTC_CLAM', 'Should be BTC_CLAM');
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(ticks !== null, WARN_SHOULD_BE_NOT_NULL);

      ticks.forEach(function (tick) {
        assert(tick.length === 12);
      });
      done();
    }, {
      limit: 500,
      endTime: 1514764800000
    });
  }).timeout(TIMEOUT);
});

describe('Object keys', function () {
  describe('First', function () {
    it('Gets the first key', function (done) {
      let first = xchange.first({ first: '1', second: '2', third: '3' });
      assert.strictEqual('first', first, 'should be first');
      done();
    }).timeout(TIMEOUT);
  });

  describe('Last', function () {
    it('Gets the last key', function (done) {
      let last = xchange.last({ first: '1', second: '2', third: '3' });
      assert.strictEqual('third', last, 'should be third');
      done();
    }).timeout(TIMEOUT);
  });

  describe('slice', function () {
    it('Gets slice of the object keys', function (done) {
      let slice = xchange.slice({ first: '1', second: '2', third: '3' }, 2);
      assert.deepEqual(['third'], slice, 'should be ian array with the third');
      done();
    }).timeout(TIMEOUT);
  });

  describe('Min', function () {
    it('Gets the math min of object', function (done) {
      xchange.min({ first: '1', second: '2', third: '3' });
      done();
    }).timeout(TIMEOUT);
  });

  describe('Max', function () {
    it('Gets the math max of object', function (done) {
      xchange.max({ first: '1', second: '2', third: '3' });
      done();
    }).timeout(TIMEOUT);
  });
});

describe('Set/Get options', function () {
  it('Sets/Gets option to specified value', function (done) {
    xchange.setOption('test', 'value');
    assert.equal(xchange.getOption('test'), 'value', 'should be value');
    done();
  }).timeout(TIMEOUT);
});

describe('Get options', function () {
  it('Gets all options', function (done) {
    assert(typeof (xchange.getOptions()) === 'object', 'should be object');
    done();
  }).timeout(TIMEOUT);
});

describe('Percent', function () {
  it('Get Percentage of two values', function (done) {
    assert(xchange.percent(25, 100) === 25, 'should be 25 percent');
    done();
  }).timeout(TIMEOUT);
});

describe('Sum', function () {
  it('Get sum of array of values', function (done) {
    assert(xchange.sum([1, 2, 3]) === 6, 'should be 6');
    done();
  }).timeout(TIMEOUT);
});

describe('Reverse', function () {
  it('Reverse the keys in an object', function (done) {
    assert(xchange.reverse({ '3': 3, '2': 2, '1': 1 }).toString() === { '1': 1, '2': 2, '3': 3 }.toString(), 'should be {\'1\': 1, \'2\': 2, \'3\': 3 }');
    done();
  }).timeout(TIMEOUT);
});

describe('Array', function () {
  it('Convert object to an array', function (done) {
    let actual = xchange.array({ 'a': 1, 'b': 2, 'c': 3 });
    let expected = [[NaN, 1], [NaN, 2], [NaN, 3]];
    assert.isArray(actual, 'should be an array');
    assert(actual.length === 3, 'should be of lenght 3');
    assert.deepEqual(actual, expected, 'should be both arrays with same vlaues');
    done();
  }).timeout(TIMEOUT);
});

describe('sortBids', function () {
  it('Sorts symbols bids and returns an object', function (done) {
    /* let actual = xchange.sortBids( 'BNBBTC' );
       debug( actual ); */
    debug('todo');
    done();
  });
});

describe('sortAsks', function () {
  it('Sorts symbols asks and returns an object', function (done) {
    //let actual = xchange.sortBids( 'BNBBTC' );
    debug('todo');
    done();
  }).timeout(TIMEOUT);
});

describe('Exchange Info', function () {
  let async_error;
  let async_data;
  /*global beforeEach*/
  /*eslint no-undef: "error"*/
  beforeEach(function (done) {
    xchange.exchangeInfo(function (error, data) {
      async_error = error;
      async_data = data;
      done(error);
    })
  });

  it('Gets the exchange info as an object', function () {
    assert(typeof (async_error) === 'object', 'error should be object');
    assert(async_error === null, 'Error should be null');
    assert(typeof (async_data) === 'object', 'data should be object');
    assert(async_data !== null, 'data should not be null');
    assert(Object.prototype.hasOwnProperty.call(async_data, 'symbols'), 'data should have property \'symbols\'');

    let symbolMembers = ['status', 'orderTypes', 'base', 'basePrecision', 'quote', 'quotePrecision'];
    async_data.symbols.forEach(function (symbol) {
      symbolMembers.forEach(function (member) {
        assert(Object.prototype.hasOwnProperty.call(symbol, member), WARN_SHOULD_HAVE_KEY + member);
      });
    });
  }).timeout(TIMEOUT);
});

describe('System status', function () {
  let async_error;
  let async_data;
  /*global beforeEach*/
  beforeEach(function (done) {
    xchange.systemStatus(function (error, data) {
      async_error = error;
      async_data = data;
      done(error);
    })
  });

  it('Gets the system status info as an object', function () {
    debug(async_error);
    debug(async_data);
    assert(typeof (async_error) === 'object', 'error should be object');
    assert(async_error === null, 'Error should be null');
    assert(typeof (async_data) === 'object', 'data should be object');
    assert(async_data !== null, 'data should not be null');
    assert(Object.prototype.hasOwnProperty.call(async_data, 'msg'), WARN_SHOULD_HAVE_KEY + 'msg');
    assert(Object.prototype.hasOwnProperty.call(async_data, 'status'), WARN_SHOULD_HAVE_KEY + 'status');

    let members = ['msg', 'status'];
    members.forEach(function (member) {
      assert(Object.prototype.hasOwnProperty.call(async_data, member), WARN_SHOULD_HAVE_KEY + member);
    });
  }).timeout(TIMEOUT);
});

describe('Withdraw', function () {
  it('Attempt to withdraw BTC to another address', function (done) {
    xchange.withdraw('BTC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '5', false, (error, result) => {
      debug(error);
      debug(result);
      assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
      assert(typeof (result) === 'object', WARN_SHOULD_BE_OBJ);
      assert(error === null, WARN_SHOULD_BE_NULL);
      assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
      assert(Object.prototype.hasOwnProperty.call(result, 'msg'), WARN_SHOULD_HAVE_KEY + 'msg');
      assert(result.msg === 'You don\'t have permission.');
      assert(Object.prototype.hasOwnProperty.call(result, 'success'), WARN_SHOULD_HAVE_KEY + 'success');
      assert(result.success === false);
      done();
    });
  }).timeout(TIMEOUT);


  describe('Withdraw history', function () {
    it('Attempt to get withdraw history for BTC', function (done) {
      xchange.withdrawHistory((error, result) => {
        debug(error);
        debug(result);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (result) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
        assert(Object.prototype.hasOwnProperty.call(result, 'withdrawList'), WARN_SHOULD_HAVE_KEY + 'withdrawList');
        assert(Array.isArray(result.withdrawList));
        assert(Object.prototype.hasOwnProperty.call(result, 'success'), WARN_SHOULD_HAVE_KEY + 'success');
        assert(result.success === true);
        done();
      }, 'BTC');
    }).timeout(TIMEOUT);

    it('Attempt to get withdraw history for all assets', function (done) {
      xchange.withdrawHistory((error, result) => {
        debug(error);
        debug(result);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (result) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
        assert(Object.prototype.hasOwnProperty.call(result, 'withdrawList'), WARN_SHOULD_HAVE_KEY + 'withdrawList');
        assert(Array.isArray(result.withdrawList));
        assert(Object.prototype.hasOwnProperty.call(result, 'success'), WARN_SHOULD_HAVE_KEY + 'success');
        assert(result.success === true);
        done();
      });
    }).timeout(TIMEOUT);
  });


  describe('Deposit history', function () {
    it('Attempt to get deposit history for all assets', function (done) {
      xchange.depositHistory((error, result) => {
        debug(error);
        debug(result);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (result) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
        assert(Object.prototype.hasOwnProperty.call(result, 'depositList'), WARN_SHOULD_HAVE_KEY + 'depositList');
        assert(Array.isArray(result.depositList));
        assert(Object.prototype.hasOwnProperty.call(result, 'success'), WARN_SHOULD_HAVE_KEY + 'success');
        assert(result.success === true);
        done();
      });
    }).timeout(TIMEOUT);
  });

  describe('Deposit address', function () {
    it('Attempt to get deposit address for BTC', function (done) {
      xchange.depositAddress('BTC', (error, result) => {
        debug(error);
        debug(result);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (result) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
        assert(Object.prototype.hasOwnProperty.call(result, 'address'), WARN_SHOULD_HAVE_KEY + 'address');
        assert(Object.prototype.hasOwnProperty.call(result, 'success'), WARN_SHOULD_HAVE_KEY + 'success');
        assert(Object.prototype.hasOwnProperty.call(result, 'addressTag'), WARN_SHOULD_HAVE_KEY + 'addressTag');
        assert(Object.prototype.hasOwnProperty.call(result, 'asset'), WARN_SHOULD_HAVE_KEY + 'asset');
        assert(result.asset === 'BTC');
        assert(result.success === true);
        done();
      });
    }).timeout(TIMEOUT);

    it('Attempt to get deposit address for LTC', function (done) {
      xchange.depositAddress('LTC', (error, result) => {
        debug(error);
        debug(result);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (result) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
        assert(Object.prototype.hasOwnProperty.call(result, 'address') === false, WARN_SHOULD_NOT_HAVE_KEY + 'address');
        assert(Object.prototype.hasOwnProperty.call(result, 'success'), WARN_SHOULD_NOT_HAVE_KEY + 'success');
        assert(Object.prototype.hasOwnProperty.call(result, 'addressTag') === false, WARN_SHOULD_NOT_HAVE_KEY + 'addressTag');
        assert(Object.prototype.hasOwnProperty.call(result, 'asset') === false, WARN_SHOULD_NOT_HAVE_KEY + 'asset');
        assert(result.success === false);
        done();
      });
    }).timeout(TIMEOUT);
  });

  describe('Account status', function () {
    it('Attempt to get account status', function (done) {
      xchange.accountStatus((error, data) => {
        debug(error);
        debug(data);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (data) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(data !== null, WARN_SHOULD_BE_NOT_NULL);
        done();
      });
    }).timeout(TIMEOUT);
  });

  describe('Account', function () {
    it('Attempt to get account information', function (done) {
      xchange.account((error, data) => {
        debug(error);
        debug(data);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (data) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(data !== null, WARN_SHOULD_BE_NOT_NULL);
        done();
      });
    }).timeout(TIMEOUT);
  });

  describe('Time', function () {
    it('Attempt to get server time', function (done) {
      xchange.time((error, data) => {
        debug(error);
        debug(data);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (data) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(data !== null, WARN_SHOULD_BE_NOT_NULL);
        assert(Object.prototype.hasOwnProperty.call(data, 'serverTime'), WARN_SHOULD_HAVE_KEY + 'serverTime');
        done();
      });
    }).timeout(TIMEOUT);
  });

  describe('Recent Trades', function () {
    it('Attempt get recent Trades for a given symbol', function (done) {
      xchange.recentTrades('BNBBTC', (error, data) => {
        debug(error);
        debug(data);
        assert(typeof (error) === 'object', WARN_SHOULD_BE_OBJ);
        assert(typeof (data) === 'object', WARN_SHOULD_BE_OBJ);
        assert(error === null, WARN_SHOULD_BE_NULL);
        assert(data !== null, WARN_SHOULD_BE_NOT_NULL);
        assert(data.length > 0);
        data.forEach(function (obj) {
          assert(Object.prototype.hasOwnProperty.call(obj, 'id'), WARN_SHOULD_HAVE_KEY + 'id');
          assert(Object.prototype.hasOwnProperty.call(obj, 'price'), WARN_SHOULD_HAVE_KEY + 'price');
          assert(Object.prototype.hasOwnProperty.call(obj, 'qty'), WARN_SHOULD_HAVE_KEY + 'qty');
          assert(Object.prototype.hasOwnProperty.call(obj, 'time'), WARN_SHOULD_HAVE_KEY + 'time');
        });
        done();
      });
    }).timeout(TIMEOUT);
  });

  describe('getInfo', function () {
    it('Gets the info array form the xchange object', function (done) {
      assert(typeof (xchange.getInfo()) === 'object', 'Should be of type array')
      done();
    }).timeout(TIMEOUT);
  });

  describe('depthCache', function () {
    it('depthCache', function (done) {
      xchange.depthCache('BNBBTC');
      done();
    }).timeout(TIMEOUT);
  });

  describe('depthVolume', function () {
    it('depthVolume', function (done) {
      xchange.depthVolume('BNBBTC');
      done();
    }).timeout(TIMEOUT);
  });

  describe('getPrecision', function () {
    it('getPrecision', function (done) {
      xchange.getPrecision(1.9999999);
      done();
    }).timeout(TIMEOUT);
  });

  describe('roundStep', function () {
    it('roundStep', function (done) {
      xchange.roundStep(10, 0.8);
      done();
    }).timeout(TIMEOUT);
  });

  describe('ohlc', function () {
    let chart = [{ 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 }, { 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 }];
    it('Calls ohlc', function () {
      xchange.ohlc(chart);
    });
  });

  describe('highstock', function () {
    let chart = [{ 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 }, { 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 }];
    it('Calls highstock', function () {
      xchange.highstock(chart);
    });
  });
