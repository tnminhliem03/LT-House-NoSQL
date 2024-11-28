const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const MOMO_ACCESS_KEY = 'F8BBA842ECF85';
const MOMO_SECRET_KEY = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const MOMO_PARTNER_CODE = 'MOMO';
const MOMO_RETURN_URL = 'http://localhost:3000/paid';


async function createLinkMOMO(payment) {
    var accessKey = MOMO_ACCESS_KEY;
    var secretKey = MOMO_SECRET_KEY;
    var orderInfo = `Thanh toán hóa đơn ${payment.name} bằng Momo`;
    var partnerCode = MOMO_PARTNER_CODE;
    var redirectUrl = MOMO_RETURN_URL;
    var ipnUrl = MOMO_RETURN_URL;
    var requestType = "payWithMethod";
    var amount = payment.amount;
    var orderId = partnerCode + uuidv4().replace(/\D/g, '');
    var requestId = orderId;
    var extraData ='';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "LT House",
        storeId : "LT House Payment",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });

    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }

    try {
        const result = await axios(options);
        return result.data;
    } catch (error) {
        console.error("Error occurred while making request to MoMo:", error);
        throw new Error('Error occurred while creating MoMo link');
    }
}
  
module.exports = { createLinkMOMO };