const express = require('express');
const bodyParser = require('body-parser');
const { createLinkVNPAY } = require('./services/vnpayService');
const { createLinkMOMO } = require('./services/momoService');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.post('/create-link-vnpay', async (req, res) => {
  try {
      const { payment } = req.body;
      const result = createLinkVNPAY(req, payment);

      res.json({
        payment_url: result.vnpUrl,
        vnp_Params: result.vnp_Params,
      });
  } catch (error) {
      console.error('Error creating VNPay link: ', error);
      res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

app.post('/create-link-momo', async (req, res) => {
  const { payment } = req.body;

  try {
    const result = await createLinkMOMO(payment); 
    return res.status(200).json(result); 
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Server Error",
      error: error.message,
    });
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
