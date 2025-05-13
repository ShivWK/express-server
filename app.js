const express =require("express");
const fs = require("fs");
const app = express();

const file = JSON.parse(fs.readFileSync("./movies.json"));

app.use(express.json());

app.get("/api/v1/movies", (req, res) => {
    res.status(200).json({
        status: "success",
        count: file.length,
        data: {
            movies: file
        }
    });
})

app.post("/api/v1/movies", (req, res) => {
    const id = file[file.length - 1].id + 1;
    const obj = Object.assign({id}, req.body);
    file.push(obj);

    // for writing we are using async writing method, because this callback will be executed by the event loop and if we use sync method then if file is long then it will block the event loop so i use the async method
    fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
        if (err) {
            console.log(err);
        }
        res.status(201).json({
            status: "success",
            data: {
                movies: obj,
            } 
            
            // when a post method is send to the server then it returns an object basically the object created by this given data so this is what we are sending back.
        });
    });
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("server has started...");
});

