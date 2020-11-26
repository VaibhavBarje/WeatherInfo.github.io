const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgval) => {
    let temperture = tempVal.replace("{%tempval%}", orgval.main.temp);
    temperture = temperture.replace("{%tempmin%}", orgval.main.temp_min);
    temperture = temperture.replace("{%tempmax%}", orgval.main.temp_max);
    temperture = temperture.replace("{%location%}", orgval.name);
    temperture = temperture.replace("{%country%}", orgval.sys.country);
    temperture = temperture.replace("{%tempsatus%}", orgval.weather[0].main);
    return temperture;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=efc84f5fa9fe61a839c2164f7adeb6c9")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
                // console.log("end");
            });
    } else {
        res.end("File not found");
    }

});

server.listen(8000, "127.0.0.1");