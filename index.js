import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";
import axios from "axios";

const app = express();
app.use(cors());
var jsonParser = bodyParser.json()

app.post("/register", jsonParser, function (req, res) {
    var registerData = req.body;

    async function registerUserMotv() {
        var timestamp = new Date().getTime();
        const str = timestamp + 'api.lbr' + 'ap2auncv94r5pv0h4ksdgpxjvj5rggm0ahik91b9';
        const hash = crypto.createHash('sha1').update(str).digest('hex');
        const authHead = 'api.lbr' + ':' + timestamp + ':' + hash; 
    
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