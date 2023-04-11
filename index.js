const express = require('express');
const cors = require('cors');
const app = express();
const CryptoJS = require("crypto-js");
const bodyParser = require('body-parser');
const axios = require('axios');
const sha1 = require('sha1');


app.use(cors({
    origin: '*'
}));
var jsonParser = bodyParser.json()

app.get('/', function (req, res, next) {
    res.send("Server is running")
})

app.post("/register", jsonParser, function (req, res) {
    var registerData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

    async function registerUserMotv() {
        var timestamp = new Date().getTime();
        const str = timestamp + 'api.lbr' + 'ap2auncv94r5pv0h4ksdgpxjvj5rggm0ahik91b9';
        const hashSha1 = sha1(str);

        const authHead = 'api.lbr' + ':' + timestamp + ':' + hashSha1; 
    
        const api = axios.create({
            baseURL: "https://sms.yplay.com.br/",
            headers: {
              Authorization: authHead
            },
          })

        const response = await api.post(
            'api/integration/createMotvCustomer', registerData)
            .then(function (response) {
                if(response.data.status === 1) {
                    var viewers_id = response.data.response;
                    var products_id1 = 151;
                    var data = {viewers_id, products_id: products_id1 };
                    var products_id2 = 153;
                    var products_id3 = 688;
                    
                    api.post('api/integration/subscribe', {data})
                    .then(function (response) {
                        if(response.data.status !== 1) {
                            api.post('api/integration/subscribe', {data})
                        }else if(response.data.status === 1) {
                            var data = {viewers_id, products_id: products_id2};
                            api.post('api/integration/subscribe', {data})
                            .then(function (response) {
                                if(response.data.status !== 1) {
                                    api.post('api/integration/subscribe', {data})
                                }else if(response.data.status === 1) {
                                    var data = {viewers_id, products_id: products_id3};
                                    api.post('api/integration/subscribe', {data})
                                    .then(function (response) {
                                        if(response.data.status !== 1) {
                                            api.post('api/integration/subscribe', {data});
                                        }else if(response.data.status === 1) {
                                            res.send(response.data);
                                        }
                                    })
                                }
                            })
                        }
                    })

                } else {
                    res.send(response.data);
                }
            })
    }
    registerUserMotv();
})

app.listen(5000, () => console.log("Server is running"))