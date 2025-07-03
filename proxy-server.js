const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post('/api/proxy/payment', upload.none(), async (req, res) => {
  try {
    const data = new FormData();
    for (const key in req.body) {
      data.append(key, req.body[key]);
    }

    const response = await axios.post(
        // 'https://checkout.payway.com.kh/api/payment-gateway/v1/payments/purchase',
        'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase',
      data,
      {
        headers: {
          ...data.getHeaders()
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Proxy request failed' });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});