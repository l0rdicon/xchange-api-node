/* ============================================================
 * node-xchange-api
 * https://github.com/l0rdicon/xchange-node-api
 * ============================================================
 * Copyright 2017-, Jon Eyrick
 * Released under the MIT License
 * ============================================================ */

/**
 * Node Xchange API
 * @module l0rdicon/xchange-node-api
 * @return {object} instance to class object
 */
let api = function Xchange() {
    let Xchange = this; // eslint-disable-line consistent-this
    'use strict'; // eslint-disable-line no-unused-expressions
    const request = require('request');
    const crypto = require('crypto');
    const file = require('fs');
    const async = require('async');
    const base = 'https://dev.freebitcoins.com/xchange/api/';
    const userAgent = 'Mozilla/4.0 (compatible; Node Xchange API)';
    const contentType = 'application/x-www-form-urlencoded';
    Xchange.depthCache = {};
    Xchange.depthCacheContext = {};
    Xchange.ohlcLatest = {};
    Xchange.klineQueue = {};
    Xchange.ohlc = {};
    const default_options = {
        recvWindow: 5000,
        useServerTime: false,
        reconnect: true,
        verbose: false,
        test: false,
        log: function (...args) {
            console.log(Array.prototype.slice.call(args));
        }
    };
    Xchange.options = default_options;
    Xchange.info = { timeOffset: 0 };

    /**
     * Checks to see of the object is iterable
     * @param {object} obj - The object check
     * @return {boolean} true or false is iterable
     */
    const isIterable = function (obj) {
        // checks for null and undefined
        if (obj === null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

    const addProxy = opt => {
        let proxy = Xchange.options.proxy
            ? `http://${
            Xchange.options.proxy.auth
                ? Xchange.options.proxy.auth.username +
                ':' +
                Xchange.options.proxy.auth.password +
                '@'
                : ''
            }${Xchange.options.proxy.host}:${Xchange.options.proxy.port}`
            : '';
        if (proxy) {
            opt.proxy = proxy;
        }
        return opt;
    }

    const reqHandler = cb => (error, response, body) => {
        if (!cb) return;

        if (error) return cb(error, {});

        if (response && response.statusCode !== 200) return cb(response, {});

        return cb(null, JSON.parse(body));
    }

    const proxyRequest = (opt, cb) => request(addProxy(opt), reqHandler(cb));

    const reqObj = (url, data = {}, method = 'GET', key) => ({
        url: url,
        qs: data,
        method: method,
        timeout: Xchange.options.recvWindow,
        headers: {
            'User-Agent': userAgent,
            'Content-type': contentType,
            'X-MBX-APIKEY': key || ''
        }
    })
    const reqObjPOST = (url, data = {}, method = 'POST', key) => ({
        url: url,
        qs: data,
        method: method,
        timeout: Xchange.options.recvWindow,
        headers: {
            'User-Agent': userAgent,
            'Content-type': contentType,
            'X-MBX-APIKEY': key || ''
        }
    })
    /**
     * Create a http request to the public API
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @return {undefined}
     */
    const publicRequest = function (url, data = {}, callback, method = 'GET') {
        let opt = reqObj(url, data, method);
        proxyRequest(opt, callback);
    };

    /**
     * Create a http request to the public API
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @return {undefined}
     */
    const apiRequest = function (url, data = {}, callback, method = 'GET') {
        if (!Xchange.options.APIKEY) throw Error('apiRequest: Invalid API Key');
        let opt = reqObj(
            url,
            data,
            method,
            Xchange.options.APIKEY
        );
        proxyRequest(opt, callback);
    };

    /**
     * Make market request
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @return {undefined}
     */
    const marketRequest = function (url, data = {}, callback, method = 'GET') {
        if (!Xchange.options.APIKEY) throw Error('apiRequest: Invalid API Key');
        let query = Object.keys(data).reduce(function (a, k) {
            a.push(k + '=' + encodeURIComponent(data[k]));
            return a;
        }, []).join('&');

        let opt = reqObj(
            url + (query ? '?' + query : ''),
            data,
            method,
            Xchange.options.APIKEY
        );
        proxyRequest(opt, callback);
    };

    /**
     * Create a signed http request to the signed API
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @param {boolean} noDataInSignature - Prevents data from being added to signature
     * @return {undefined}
     */
    const signedRequest = function (url, data = {}, callback, method = 'GET', noDataInSignature = false) {
        if (!Xchange.options.APIKEY) throw Error('apiRequest: Invalid API Key');
        if (!Xchange.options.APISECRET) throw Error('signedRequest: Invalid API Secret');
        data.timestamp = new Date().getTime() + Xchange.info.timeOffset;
        if (typeof data.recvWindow === 'undefined') data.recvWindow = Xchange.options.recvWindow;
        let query = method === 'POST' && noDataInSignature ? '' : Object.keys(data).reduce(function (a, k) {
            a.push(k + '=' + encodeURIComponent(data[k]));
            return a;
        }, []).join('&');

        let signature = crypto.createHmac('sha256', Xchange.options.APISECRET).update(query).digest('hex'); // set the HMAC hash header
        if (method === 'POST') {
            let opt = reqObjPOST(
                url + '?' + query + '&signature=' + signature,
                data,
                method,
                Xchange.options.APIKEY
            );
            proxyRequest(opt, callback);
        } else {
            let opt = reqObj(
                url + '?' + query + '&signature=' + signature,
                data,
                method,
                Xchange.options.APIKEY
            );
            proxyRequest(opt, callback);
        }
    };

    /**
     * Create a signed http request to the signed API
     * @param {string} side - BUY or SELL
     * @param {string} market - The symbol to buy or sell
     * @param {string} quantity - The quantity to buy or sell
     * @param {string} price - The price per unit to transact each unit at
     * @param {object} flags - additional order settings
     * @param {function} callback - the callback function
     * @return {undefined}
     */
    const order = function (side, market, quantity, price, flags = {}, callback = false) {
        let endpoint = 'v1/order';
        let opt = {
            market: market,
            side: side,
            type: 'limit',
            quantity: quantity
        };
        if (typeof flags.type !== 'undefined') opt.type = flags.type;
        if (opt.type.includes('limit')) {
            opt.price = price;
        }
        signedRequest(base + endpoint, opt, function (error, response) {
            if (!response) {
                if (callback) callback(error, response);
                else Xchange.options.log('Order() error:', error);
                return;
            }
            if (typeof response.msg !== 'undefined' && response.msg === 'Filter failure: MIN_NOTIONAL') {
                Xchange.options.log('Order quantity too small. See exchangeInfo() for minimum amounts');
            }
            if (callback) callback(error, response);
            else Xchange.options.log(side + '(' + symbol + ',' + quantity + ',' + price + ') ', response);
        }, 'POST');
    };

    /**
     * No-operation function
     * @return {undefined}
     */
    const noop = function () {
        // do nothing
    };

    /**
     * Gets the price of a given market or market
     * @param {array} data - array of markets
     * @return {array} - markets with their current prices
     */
    const priceData = function (data) {
        const prices = {};
        if (Array.isArray(data)) {
            for (let obj of data) {
                prices[obj.market] = obj.price;
            }
        } else { // Single price returned
            prices[data.market] = data.price;
        }
        return prices;
    };

    /**
     * Used by bookTickers to format the bids and asks given given symbols
     * @param {array} data - array of symbols
     * @return {object} - symbols with their bids and asks data
     */
    const bookPriceData = function (data) {
        let prices = {};
        for (let obj of data) {
            prices[obj.market] = {
                bid: obj.bidPrice,
                bids: obj.bidQty,
                ask: obj.askPrice,
                asks: obj.askQty
            };
        }
        return prices;
    };

    /**
     * Used by balance to get the balance data
     * @param {array} data - account info object
     * @return {object} - balances hel with available, onorder amounts
     */
    const balanceData = function (data) {
        let balances = {};
        if (typeof data === 'undefined') return {};
        if (typeof data.balances === 'undefined') {
            Binance.options.log('balanceData error', data);
            return {};
        }
        for (let obj of data.balances) {
            balances[obj.asset] = { available: obj.free, locked: obj.locked, pending: obj.pending };
        }
        return balances;
    };

    /**
     * Used by web sockets depth and populates OHLC and info
     * @param {string} market - market to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    const klineData = function (market, interval, ticks) { // Used for /depth
        let last_time = 0;
        if (isIterable(ticks)) {
            for (let tick of ticks) {
                // eslint-disable-next-line no-unused-vars
                let [openTime, open, high, low, close, volume, closeTime, count] = tick;
                Xchange.ohlc[market][interval][openTime] = { open: open, high: high, low: low, close: close, volume: volume };
                last_time = time;
            }

            Xchange.info[market][interval].timestamp = last_time;
        }
    };

    /**
     * Used for /depth endpoint
     * @param {object} data - containing the bids and asks
     * @return {undefined}
     */
    const depthData = function (data) {
        if (!data) return { bids: [], asks: [] };
        let bids = {}, asks = {}, obj;
        if (typeof data.bids !== 'undefined') {
            for (obj of data.bids) {
                bids[obj[0]] = parseFloat(obj[1]);
            }
        }
        if (typeof data.asks !== 'undefined') {
            for (obj of data.asks) {
                asks[obj[0]] = parseFloat(obj[1]);
            }
        }
        return { sequence: data.sequence, bids: bids, asks: asks };
    }

    /**
     * Used for /depth endpoint
     * @param {object} depth - information
     * @return {undefined}
     */
    const depthHandler = function (depth) {
        let market = depth.s, obj;
        let context = Xchange.depthCacheContext[market];

        let updateDepthCache = function () {
            Xchange.depthCache[symbol].eventTime = depth.E;
            for (obj of depth.b) { //bids
                if (obj[1] === '0.00000000') {
                    delete Xchange.depthCache[market].bids[obj[0]];
                } else {
                    Xchange.depthCache[market].bids[obj[0]] = parseFloat(obj[1]);
                }
            }
            for (obj of depth.a) { //asks
                if (obj[1] === '0.00000000') {
                    delete Xchange.depthCache[market].asks[obj[0]];
                } else {
                    Xchange.depthCache[market].asks[obj[0]] = parseFloat(obj[1]);
                }
            }
            context.skipCount = 0;
            context.lastEventUpdateId = depth.u;
            context.lastEventUpdateTime = depth.E;
        };
    };

    /**
     * Gets depth cache for given market
     * @param {string} market - the market to fetch
     * @return {object} - the depth cache object
     */
    const getDepthCache = function (market) {
        if (typeof Xchange.depthCache[market] === 'undefined') return { bids: {}, asks: {} };
        return Xchange.depthCache[market];
    };

    /**
     * Calculate Buy/Sell volume from DepthCache
     * @param {string} market - the symbol to fetch
     * @return {object} - the depth volume cache object
     */
    const depthVolume = function (market) {
        let cache = getDepthCache(market), quantity, price;
        let bidbase = 0, askbase = 0, bidqty = 0, askqty = 0;
        for (price in cache.bids) {
            quantity = cache.bids[price];
            bidbase += parseFloat((quantity * parseFloat(price)).toFixed(8));
            bidqty += quantity;
        }
        for (price in cache.asks) {
            quantity = cache.asks[price];
            askbase += parseFloat((quantity * parseFloat(price)).toFixed(8));
            askqty += quantity;
        }
        return { bids: bidbase, asks: askbase, bidQty: bidqty, askQty: askqty };
    };

    return {

        /**
        * Gets depth cache for given market
        * @param {symbol} market - get depch cache for this market
        * @return {object} - object
        */
        depthCache: function (market) {
            return getDepthCache(market);
        },

        /**
        * Gets depth volume for given market
        * @param {market} market - get depch volume for this market
        * @return {object} - object
        */
        depthVolume: function (market) {
            return depthVolume(market);
        },

        /**
        * Count decimal places
        * @param {float} float - get the price precision point
        * @return {int} - number of place
        */
        getPrecision: function (float) {
            if (!float || Number.isInteger(float)) return 0;
            return float.toString().split('.')[1].length || 0;
        },

        /**
        * rounds number with given step
        * @param {float} qty - quantity to round
        * @param {float} stepSize - stepSize as specified by exchangeInfo
        * @return {float} - number
        */
        roundStep: function (qty, stepSize) {
            // Integers do not require rounding
            if (Number.isInteger(qty)) return qty;
            const qtyString = qty.toFixed(16);
            const desiredDecimals = Math.max(stepSize.indexOf('1') - 1, 0);
            const decimalIndex = qtyString.indexOf('.');
            return parseFloat(qtyString.slice(0, decimalIndex + desiredDecimals + 1));
        },

        /**
        * rounds price to required precision
        * @param {float} price - price to round
        * @param {float} tickSize - tickSize as specified by exchangeInfo
        * @return {float} - number
        */
        roundTicks: function (price, tickSize) {
            const formatter = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 8 });
            const precision = formatter.format(tickSize).split('.')[1].length || 0;
            if (typeof price === 'string') price = parseFloat(price);
            return price.toFixed(precision);
        },

        /**
        * Gets percentage of given numbers
        * @param {float} min - the smaller number
        * @param {float} max - the bigger number
        * @param {int} width - percentage width
        * @return {float} - percentage
        */
        percent: function (min, max, width = 100) {
            return (min * 0.01) / (max * 0.01) * width;
        },

        /**
        * Gets the sum of an array of numbers
        * @param {array} array - the number to add
        * @return {float} - sum
        */
        sum: function (array) {
            return array.reduce((a, b) => a + b, 0);
        },

        /**
        * Reverses the keys of an object
        * @param {object} object - the object
        * @return {object} - the object
        */
        reverse: function (object) {
            let range = Object.keys(object).reverse(), output = {};
            for (let price of range) {
                output[price] = object[price];
            }
            return output;
        },

        /**
        * Converts an object to an array
        * @param {object} obj - the object
        * @return {array} - the array
        */
        array: function (obj) {
            return Object.keys(obj).map(function (key) {
                return [Number(key), obj[key]];
            });
        },

        /**
        * Sorts bids
        * @param {string} market - the object
        * @param {int} max - the max number of bids
        * @param {string} baseValue - the object
        * @return {object} - the object
        */
        sortBids: function (market, max = Infinity, baseValue = false) {
            let object = {}, count = 0, cache;
            if (typeof market === 'object') cache = market;
            else cache = getDepthCache(symbol).bids;
            let sorted = Object.keys(cache).sort(function (a, b) {
                return parseFloat(b) - parseFloat(a)
            });
            let cumulative = 0;
            for (let price of sorted) {
                if (baseValue === 'cumulative') {
                    cumulative += parseFloat(cache[price]);
                    object[price] = cumulative;
                } else if (!baseValue) object[price] = parseFloat(cache[price]);
                else object[price] = parseFloat((cache[price] * parseFloat(price)).toFixed(8));
                if (++count >= max) break;
            }
            return object;
        },

        /**
        * Sorts asks
        * @param {string} symbmarketol - the object
        * @param {int} max - the max number of bids
        * @param {string} baseValue - the object
        * @return {object} - the object
        */
        sortAsks: function (symbol, max = Infinity, baseValue = false) {
            let object = {}, count = 0, cache;
            if (typeof market === 'object') cache = market;
            else cache = getDepthCache(market).asks;
            let sorted = Object.keys(cache).sort(function (a, b) {
                return parseFloat(a) - parseFloat(b);
            });
            let cumulative = 0;
            for (let price of sorted) {
                if (baseValue === 'cumulative') {
                    cumulative += parseFloat(cache[price]);
                    object[price] = cumulative;
                } else if (!baseValue) object[price] = parseFloat(cache[price]);
                else object[price] = parseFloat((cache[price] * parseFloat(price)).toFixed(8));
                if (++count >= max) break;
            }
            return object;
        },

        /**
        * Returns the first property of an object
        * @param {object} object - the object to get the first member
        * @return {string} - the object key
        */
        first: function (object) {
            return Object.keys(object).shift();
        },

        /**
        * Returns the last property of an object
        * @param {object} object - the object to get the first member
        * @return {string} - the object key
        */
        last: function (object) {
            return Object.keys(object).pop();
        },

        /**
        * Returns an array of properties starting at start
        * @param {object} object - the object to get the properties form
        * @param {int} start - the starting index
        * @return {array} - the array of entires
        */
        slice: function (object, start = 0) {
            return Object.entries(object).slice(start).map(entry => entry[0]);
        },

        /**
        * Gets the minimum key form object
        * @param {object} object - the object to get the properties form
        * @return {string} - the minimum key
        */
        min: function (object) {
            return Math.min.apply(Math, Object.keys(object));
        },

        /**
        * Gets the maximum key form object
        * @param {object} object - the object to get the properties form
        * @return {string} - the minimum key
        */
        max: function (object) {
            return Math.max.apply(Math, Object.keys(object));
        },

        /**
        * Sets an option given a key and value
        * @param {string} key - the key to set
        * @param {object} value - the value of the key
        * @return {undefined}
        */
        setOption: function (key, value) {
            Xchange.options[key] = value;
        },

        /**
        * Gets an option given a key
        * @param {string} key - the key to set
        * @return {undefined}
        */
        getOption: function (key) {
            return Xchange.options[key];
        },

        /**
        * Returns the entire info object
        * @return {object} - the info object
        */
        getInfo: function () {
            return Xchange.info;
        },

        /**
        * Returns the entire options object
        * @return {object} - the options object
        */
        getOptions: function () {
            return Xchange.options;
        },

        /**
        * Gets an option given a key
        * @param {object} opt - the object with the class configuration
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        options: function (opt, callback = false) {
            if (typeof opt === 'string') { // Pass json config filename
                Xchange.options = JSON.parse(file.readFileSync(opt));
            } else Xchange.options = opt;
            if (typeof Xchange.options.recvWindow === 'undefined') Xchange.options.recvWindow = default_options.recvWindow;
            if (typeof Xchange.options.useServerTime === 'undefined') Xchange.options.useServerTime = default_options.useServerTime;
            if (typeof Xchange.options.reconnect === 'undefined') Xchange.options.reconnect = default_options.reconnect;
            if (typeof Xchange.options.test === 'undefined') Xchange.options.test = default_options.test;
            if (typeof Xchange.options.log === 'undefined') Xchange.options.log = default_options.log;
            if (typeof Xchange.options.verbose === 'undefined') Xchange.options.verbose = default_options.verbose;
            if (Xchange.options.useServerTime) {
                apiRequest(base + 'v1/time', {}, function (error, response) {
                    Xchange.info.timeOffset = response.serverTime - new Date().getTime();
                    //Binance.options.log("server time set: ", response.serverTime, Binance.info.timeOffset);
                    if (callback) callback();
                });
            } else if (callback) callback();
            return this;
        },


        /**
        * Creates an order
        * @param {string} side - BUY or SELL
        * @param {string} market - the market to buy
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to pay for each unit
        * @param {object} flags - aadditionalbuy order flags
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        order: function (side, market, quantity, price, flags = {}, callback = false) {
            order(side, market, quantity, price, flags, callback);
        },

        /**
        * Creates a buy order
        * @param {string} market - the market to buy
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to pay for each unit
        * @param {object} flags - additional buy order flags
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        buy: function (market, quantity, price, flags = {}, callback = false) {
            order('buy', market, quantity, price, flags, callback);
        },

        /**
        * Creates a sell order
        * @param {string} market - the market to sell
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to sell each unit for
        * @param {object} flags - additional order flags
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        sell: function (market, quantity, price, flags = {}, callback = false) {
            order('sell', market, quantity, price, flags, callback);
        },

        /**
        * Creates a market buy order
        * @param {string} market - the market to buy
        * @param {numeric} quantity - the quantity required
        * @param {object} flags - additional buy order flags
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        marketBuy: function (market, quantity, flags = { type: 'market' }, callback = false) {
            if (typeof flags === 'function') { // Accept callback as third parameter
                callback = flags;
                flags = { type: 'market' };
            }
            if (typeof flags.type === 'undefined') flags.type = 'market';
            order('buy', market, quantity, 0, flags, callback);
        },

        /**
        * Creates a market sell order
        * @param {string} market - the market to sell
        * @param {numeric} quantity - the quantity required
        * @param {object} flags - additional sell order flags
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        marketSell: function (market, quantity, flags = { type: 'market' }, callback = false) {
            if (typeof flags === 'function') { // Accept callback as third parameter
                callback = flags;
                flags = { type: 'market' };
            }
            if (typeof flags.type === 'undefined') flags.type = 'market';
            order('sell', market, quantity, 0, flags, callback);
        },

        /**
        * Cancels an order
        * @param {string} market - the market to cancel
        * @param {string} orderid - the orderid to cancel
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        cancel: function (market, orderid, callback = false) {
            signedRequest(base + 'v1/order', { market: market, orderId: orderid }, function (error, data) {
                if (callback) return callback.call(this, error, data, market);
            }, 'DELETE');
        },

        /**
        * Gets the status of an order
        * @param {string} market - the market to check
        * @param {string} orderid - the orderid to check
        * @param {function} callback - the callback function
        * @param {object} flags - any additional flags
        * @return {undefined}
        */
        orderStatus: function (market, orderid, callback, flags = {}) {
            let parameters = Object.assign({ market: market, orderId: orderid }, flags);
            signedRequest(base + 'v1/order', parameters, function (error, data) {
                if (callback) return callback.call(this, error, data, market);
            });
        },

        /**
        * Gets open orders
        * @param {string} market - the market to get
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        openOrders: function (market, callback) {
            let parameters = market ? { market: market } : {};
            signedRequest(base + 'v1/openOrders', parameters, function (error, data) {
                return callback.call(this, error, data, market);
            });
        },

        /**
        * Cancels all order of a given market
        * @param {string} market - the market to cancel all orders for
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        cancelOrders: function (market, callback = false) {
            signedRequest(base + 'v1/openOrders', { market: market }, function (error, json) {
                if (json.length === 0) {
                    if (callback) return callback.call(this, 'No orders present for this market', {}, market);
                }
                for (let obj of json) {
                    let quantity = obj.origQty - obj.executedQty;
                    Xchange.options.log('cancel order: ' + obj.side + ' ' + market + ' ' + quantity + ' @ ' + obj.price + ' #' + obj.orderId);
                    signedRequest(base + 'v1/order', { market: market, orderId: obj.orderId }, function (error, data) {
                        if (callback) return callback.call(this, error, data, market);
                    }, 'DELETE');
                }
            });
        },

        /**
        * Gets all order of a given market
        * @param {string} market - the market
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {undefined}
        */
        allOrders: function (market, callback, options = {}) {
            let parameters = Object.assign({ market: market }, options);
            signedRequest(base + 'v1/allOrders', parameters, function (error, data) {
                if (callback) return callback.call(this, error, data, market);
            });
        },

        /**
        * Gets the depth information for a given market
        * @param {string} market - the market
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of returned orders
        * @return {undefined}
        */
        depth: function (market, callback, limit = 100) {
            publicRequest(base + 'v1/depth', { market: market, limit: limit }, function (error, data) {
                return callback.call(this, error, depthData(data), market);
            });
        },

        /**
        * Gets the prices of a given market(s)
        * @param {string} market - the market
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        prices: function (symbol, callback = false) {
            const params = typeof symbol === 'string' ? '?market=' + market : '';
            if (typeof symbol === 'function') callback = symbol; // backwards compatibility

            let opt = {
                url: base + 'v1/ticker/price' + params,
                timeout: Xchange.options.recvWindow
            };

            request(addProxy(opt), function (error, response, body) {
                if (!callback) return;

                if (error) return callback(error);

                if (response && response.statusCode !== 200) return callback(response);

                if (callback) return callback(null, priceData(JSON.parse(body)));
            });
        },

        /**
        * Gets the book tickers of given market(s)
        * @param {string} market - the market
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        bookTickers: function (market, callback) {
            const params = typeof market === 'string' ? '?market=' + market : '';
            if (typeof market === 'function') callback = market; // backwards compatibility

            let opt = {
                url: base + 'v1/ticker/bookTicker' + params,
                timeout: Xchange.options.recvWindow
            };

            request(addProxy(opt), function (error, response, body) {
                if (!callback) return;

                if (error) return callback(error);

                if (response && response.statusCode !== 200) return callback(response);

                if (callback) {
                    const result = market ? JSON.parse(body) : bookPriceData(JSON.parse(body));
                    return callback(null, result);
                }
            });
        },

        /**
        * Gets the prevday percentage change
        * @param {string} market - the market or market
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        prevDay: function (market, callback) {
            let input = market ? { market: market } : {};
            publicRequest(base + 'v1/ticker/24hr', input, function (error, data) {
                if (callback) return callback.call(this, error, data, market);
            });
        },

        /**
        * Gets the the exchange info
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        exchangeInfo: function (callback) {
            publicRequest(base + 'v1/exchangeInfo', {}, callback);
        },

        /**
        * Withdraws asset to given wallet id
        * @param {string} symbol - the asset symbol
        * @param {string} address - the wallet to transfer it to
        * @param {number} amount - the amount to transfer
        * @param {string} addressTag - and addtional address tag
        * @param {function} callback - the callback function
        * @param {string} name - the name to save the address as. Set falsy to prevent Binance saving to address book
        * @return {undefined}
        */
        withdraw: function (symbol, address, amount, addressTag = false, callback = false, name = 'API Withdraw') {
            let params = { symbol, address, amount };
            if (addressTag) params.addressTag = addressTag;
            if (name) params.name = name
            signedRequest(base + 'v1/withdraw', params, callback, 'POST', true);
        },

        /**
        * Get the Withdraws history for a given asset
        * @param {function} callback - the callback function
        * @param {object} params - supports limit 
        * @return {undefined}
        */
        withdrawHistory: function (params, callback) {
            if (typeof params === 'string') params = { asset: params };
            signedRequest(base + 'v1/withdrawHistory', params, callback);
        },

        /**
        * Get the deposit history
        * @param {function} callback - the callback function
        * @param {object} params - additional params
        * @return {undefined}
        */
        depositHistory: function (params, callback) {
            if (typeof params === 'string') params = { symbol: params }; // Support 'asset' (string) or optional parameters (object)
            signedRequest(base + 'v1/depositHistory', params, callback);
        },

        /**
        * Get the deposit history for given asset
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        depositAddress: function (symbol, callback) {
            // signedRequest(base + 'v1/withdraw', params, callback, 'POST', true);
            signedRequest(base + 'v1/deposit', { symbol: symbol }, callback);
        },

        /**
        * Get the account
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        account: function (callback) {
            signedRequest(base + 'v1/account', {}, callback);
        },

        /**
        * Get the balance data
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        balance: function (callback) {
            signedRequest(base + 'v1/account', {}, function (error, data) {
                if (callback) callback(error, balanceData(data));
            });
        },

        /**
        * Get trades for a given market
        * @param {string} market - the market
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {undefined}
        */
        trades: function (market, callback, options = {}) {
            let parameters = Object.assign({ market: market }, options);
            signedRequest(base + 'v1/myTrades', parameters, function (error, data) {
                if (callback) return callback.call(this, error, data, market);
            });
        },

        /**
        * Tell api to use the server time to offset time indexes
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        useServerTime: function (callback = false) {
            apiRequest(base + 'v1/time', {}, function (error, response) {
                Xchange.info.timeOffset = response.serverTime - new Date().getTime();
                //Binance.options.log("server time set: ", response.serverTime, Binance.info.timeOffset);
                if (callback) callback();
            });
        },

        /**
        * Gets the time
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        time: function (callback) {
            apiRequest(base + 'v1/time', {}, callback);
        },

        /**
        * Get the recent trades
        * @param {string} market - the market
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of items returned
        * @return {undefined}
        */
        recentTrades: function (market, callback, limit = 500) {
            marketRequest(base + 'v1/trades', { market: market, limit: limit }, callback);
        },

        /**
        * Convert chart data to highstock array [timestamp,open,high,low,close]
        * @param {object} chart - the chart
        * @param {boolean} include_volume - to include the volume or not
        * @return {array} - an array
        */
        highstock: function (chart, include_volume = false) {
            let array = [];
            for (let timestamp in chart) {
                let obj = chart[timestamp];
                let line = [
                    Number(timestamp),
                    parseFloat(obj.open),
                    parseFloat(obj.high),
                    parseFloat(obj.low),
                    parseFloat(obj.close)
                ];
                if (include_volume) line.push(parseFloat(obj.volume));
                array.push(line);
            }
            return array;
        },

        /**
        * Populates hte OHLC information
        * @param {object} chart - the chart
        * @return {object} - object with candle information
        */
        ohlc: function (chart) {
            let open = [], high = [], low = [], close = [], volume = [];
            for (let timestamp in chart) { //Binance.ohlc[market][interval]
                let obj = chart[timestamp];
                open.push(parseFloat(obj.open));
                high.push(parseFloat(obj.high));
                low.push(parseFloat(obj.low));
                close.push(parseFloat(obj.close));
                volume.push(parseFloat(obj.volume));
            }
            return { open: open, high: high, low: low, close: close, volume: volume };
        },

        /**
        * Gets the candles information for a given market
        * intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
        * @param {string} market - the market
        * @param {function} interval - the callback function
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {undefined}
        */
        candlesticks: function (market, interval = '5m', callback = false, options = { limit: 500 }) {
            if (!callback) return;
            let params = Object.assign({ market: market, interval: interval }, options);
            publicRequest(base + 'v1/klines', params, function (error, data) {
                return callback.call(this, error, data, market);
            });
        },

        /**
        * Queries the public api
        * @param {string} url - the public api endpoint
        * @param {object} data - the data to send
        * @param {function} callback - the callback function
        * @param {string} method - the http method
        * @return {undefined}
        */
        publicRequest: function (url, data, callback, method = 'GET') {
            publicRequest(url, data, callback, method)
        },

        /**
        * Queries the signed api
        * @param {string} url - the signed api endpoint
        * @param {object} data - the data to send
        * @param {function} callback - the callback function
        * @param {string} method - the http method
        * @param {boolean} noDataInSignature - Prevents data from being added to signature
        * @return {undefined}
        */
        signedRequest: function (url, data, callback, method = 'GET', noDataInSignature) {
            signedRequest(url, data, callback, method, noDataInSignature);
        },

        /**
        * Gets the base symbol of given market
        * @param {string} market - the public api endpoint
        * @return {undefined}
        */
        getMarket: function (market) {
            const substring = market.substr(-4);
            if (substring === 'BTC') return 'BTC';
        }
    };
}
module.exports = api;
//https://github.com/link to official docs go here
