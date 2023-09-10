let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin ,X-Requested-With, Content-Type, Accept"
    );
    next();
});

// const port = 2410;

var port = process.env.PORT||2410;

app.listen(port ,()=> console.log(`Node app listening on port ${port}!`));

const {Client} = require("pg");
const client = new Client({
    user : "postgres",
    password: "Duggu@2001Papa",
    database: "postgres",
    port : 5432,
    host: "db.vesdrqrmiualsiikdyzc.supabase.co",
    ssl: { rejectUnauthorized: false},
});

client.connect(function (res,error) {
    console.log(`Connected!!!`);
});

app.get("/svr/mobiles",function(req,res){ 
    let {brand="",ram="",rom="",os=""} = req.query;
    if(brand || ram || rom || os){
        let sql1 = "SELECT * FROM mobiles WHERE ";
        let a = [];
        let str = "";
        if(brand){
            let br1 = brand.split(",");
            let br = br1.reduce((acc,cur)=> acc?acc+`,'${cur}'`:acc+`'${cur}'`,"");
            str += `brand IN (${br})`;
        }
        if(ram){
            let br1 = ram.split(",");
            let br = br1.reduce((acc,cur)=> acc?acc+`,'${cur}'`:acc+`'${cur}'`,"");
            str += str? ` AND ram IN (${br}) `:` ram IN (${br})`;
        }
        if(rom){
            let br1 = rom.split(",");
            let br = br1.reduce((acc,cur)=> acc?acc+`,'${cur}'`:acc+`'${cur}'`,"");
            str += str? ` AND rom IN (${br}) `:` rom IN (${br})`;
        }
        sql1 += str;
        console.log(sql1)
        client.query(sql1,a,function(err,result){
            if (err) {
                res.status(400).send(err);
            }
            res.send(result.rows);
        });
    }
    else{
        let query = "SELECT * FROM mobiles";
        client.query(query,function(err,result){
            if (err) {
                res.status(400).send(err);
            }
            res.send(result.rows);
        });
    }
});

app.get("/svr/mobiles/:name",function(req,res,next){
    let name = req.params.name
    let query = `SELECT * FROM mobiles WHERE name= $1`;
    client.query(query,[name],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        res.send(result.rows);
    });
});

app.get("/svr/mobiles/brand/:br",function(req,res){
    let brand = req.params.br;
    let query = `SELECT * FROM mobiles WHERE brand= $1`;
    client.query(query,[brand],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        else res.send(result.rows);
    });
});

app.get("/svr/mobiles/ram/:rm",function(req,res){
    let ram = req.params.rm;
    let query = "SELECT * FROM mobiles WHERE RAM= $1";
    client.query(query,[ram],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        else res.send(result.rows);
    });
});

app.get("/svr/mobiles/rom/:ro",function(req,res){
    let rom = req.params.ro;
    let query = "SELECT * FROM mobiles WHERE ROM= $1";
    client.query(query,[rom],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        else res.send(result.rows);
    });
});

app.get("/svr/mobiles/os/:os",function(req,res){
    let os = req.params.os;
    let query = "SELECT * FROM mobiles WHERE OS=$1";
    client.query(query,[os],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        else res.send(result.rows);
    });
});

app.post("/svr/mobiles",function(req,res){
    let body = Object.values(req.body);
    let query = `INSERT INTO mobiles(name, price, brand, RAM, ROM, OS) VALUES ($1, $2, $3, $4, $5, $6)`;
    client.query(query,body,function(err,result){
        if (err) {
            res.status(400).send(err);
        }
        res.send(`${result.rowCount} insertion successful`);
    })
});

app.put("/svr/mobiles/:name",function(req,res){
    let name = req.params.name; 
    let body = Object.values(req.body);
    body.push(name);
    console.log(body);
    let query = `UPDATE mobiles SET name=$1, price=$2, brand=$3, RAM=$4, ROM=$5, OS=$6  WHERE name= $7`;
    client.query(query,body,function(err,result){
        if(err){
            res.status(400).send(err);
        }
        res.send(`${result.rowCount} updation successful`);
    })
})

app.delete("/svr/mobiles/:name",function(req,res){
    let name = req.params.name; 
    let query = `DELETE from mobiles WHERE name= $1`;
    client.query(query,[name],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        res.send(`deleted successfuly`);
    })
})