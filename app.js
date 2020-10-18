const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");
const chalk = require("chalk");

const client = redis.createClient({host:"127.0.0.1",port:6379});

const app = express();

function sendResponse(Key,value){
  // var myval= JSON.parse(value); 
  return "<h2>"+Key+"</h2><h1>"+value+"</h1>";
}

async function getresponse(req,res,next){
  const countryInfo =  req.params.country;

//  console.log(chalk.yellow(countryInfo));
  const data = await fetch("https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page="+countryInfo);
    const country = await data.json();
    const countrydata = JSON.stringify(country);
     console.log("country details are ");
      console.log(countrydata);
     client.set(countryInfo,countrydata);

    res.send(sendResponse(countryInfo,countrydata));
};

function middleware(req,res,next){
  const countryname = req.params.country;

  client.get(countryname,(err,data)=>{
    console.log(chalk.blue("My name is chitti"));
      if(err) {throw err};
      if(data!=null){
        console.log(chalk.yellow(data));
        console.log(chalk.green("entered for the country "+countryname));
          res.send(sendResponse("CountryInfo",JSON.stringify(data)));
      }
      else{
        console.log("The data in else is ");
        console.log(chalk.blue(data));
        next();
      }
  });

}


app.get("/getinfo/:country",middleware,getresponse);


app.listen(5050,()=>{
    console.log("app is listening on port 5050");
});
