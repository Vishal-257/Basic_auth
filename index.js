import e, { response } from "express";
import bodyParser from "body-parser";
import https from "https"
import { hostname } from "os";
import path from "path";
import { error } from "console";


const app = e()

let apiKey="832a08d0-a3a3-41c3-a075-6a6140da7550"; //Since we don't have a data base to store the api key, we are hard coding it for now
app.use(bodyParser.urlencoded({extended: true}))

app.get("/",(req,res)=>{
    res.send("hi")
})

app.get("/generate",(req,res)=>{
    const options = {
        hostname: "secrets-api.appbrewery.com",
        path: "/generate-api-key",
        method: "GET"
    }
    const request = https.request(options,(response)=>{
        let data = ""
        response.on("data",(chunk)=>{
            data += chunk
        })
        response.on("end",()=>{
            try{
                apiKey = JSON.parse(data)
                console.log(apiKey)
                res.status(200).json(apiKey);
            }catch(error){
                console.log(error.message)
                res.status(500).send("cannot parse data")
            }
        })
    })
    request.on("error",(error)=>{
        console.log(error.message)
        res.status(500).send("cannot request data")
    })
    request.end()
})

app.get("/secrets",(req,res)=>{
    let score = 7
    const options = {
        hostname:"secrets-api.appbrewery.com",
        path:`/filter?score=${score}&apiKey=${apiKey}`,
        method:"GET"
    }
    const request = https.request(options,(response)=>{
        let data = ""
        response.on("data",(chunk)=>{
            data += chunk
        })
        response.on("end",()=>{
            try{
                let result = JSON.parse(data)
                console.log("using apiKey:",apiKey)
                res.send(result)
            }catch(error){
                console.log(error.message)
                res.status(500).send("cannot parse the data")
            }
        })
    })
    request.on("error",(error)=>{
        console.log(error.message)
        res.status(500).send("cannot request the data")
    })
    request.end()
})

app.post("/register",(req,res)=>{
    let username = req.body.username
    let password = req.body.password
    const options = {
        hostname: "www.secrets-api.appbrewery.com",
        path: `/register?username=${username}&passweord=${password}`,
        method: "POST"
    }
    const request = http.request(options,(response)=>{
        let data = ""
        response.on("data",(chunk)=>{
            data+=chunk
        })
        response.on("end",()=>{
            try{
                let result = JSON.parse(data)
                res.render("signup.ejx",{
                message: req.body.success
                })
            }catch(error){
                res.status(500).send("Cannot parse the data.")
                console.error("Cannot Parse the data.")
            }
        })
    })
    request.on("error",(error)=>{
        console.log(error.message)
        res.status(500).send("Cannot request Data")
    })
    request.end()
})
app.listen(3000,(req,res)=>{
    console.log("listening at port 3000.")
})