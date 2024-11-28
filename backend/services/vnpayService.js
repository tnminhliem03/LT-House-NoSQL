const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { format } = require('date-fns');
const moment = require('moment'); 
const axios = require('axios');
const qs = require('qs'); 

const VNPAY_TMN_CODE = 'BBJDENSU';
const VNPAY_HASH_SECRET_KEY = '1S8CJ30B6CNNK2G4I2A0GJ6RYKEQN966';
const VNPAY_PAYMENT_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNPAY_RETURN_URL = 'http://localhost:3000/paid';

function createLinkVNPAY(req, payment) {
    var date = new Date();
    var createDate = moment(date).format('YYYYMMDDHHmmss');

    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var tmnCode = VNPAY_TMN_CODE;
    var secretKey = VNPAY_HASH_SECRET_KEY;
    var vnpUrl = VNPAY_PAYMENT_URL;
    var returnUrl = VNPAY_RETURN_URL;
    var orderId = "VNP" + uuidv4().replace(/\D/g, '');
    var amount = payment.amount;

    var locale = req.body.language;

    if (locale === undefined || locale === ''){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};

    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toán hóa đơn ' + payment.name;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });

    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    vnp_Params['vnp_OrderInfo'] = decodeURIComponent(vnp_Params['vnp_OrderInfo'].replace(/\+/g, ' '));

    return {
        vnp_Params,
        vnpUrl,
    };
};

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
};

module.exports = { createLinkVNPAY };