const express = require('express');
const router = express.Router();
const mysql = require('promise-mysql');
const config = require("../../config");

initDb = async () => {
    pool = await mysql.createPool(config.pool);
}

initDb();

router.get('/', (req, res)=>{
    res.send('Connected to API.');
});

router.route('/shipment').get(async function(req,res){
   try{
       let conn = await pool.getConnection();
       let rows = await conn.query('SELECT * FROM shipment');
       conn.release();
       res.json({"code": 200, "status": "OK", "data": rows});
   } catch (e){
       console.log(e);
       return res.json({"code": 100, "status": "Error with query"});
   }
}).post(async function(req, res){
    try{
        const shipment = {
            status: req.body.status,
            creation_date: req.body.creation_date,
            delivery_date: req.body.delivery_date,
            user_oib: req.body.user_oib,
            delivery_city_id: req.body.delivery_city_id,
            delivery_street_name: req.body.delivery_street_name,
            delivery_house_number: req.body.delivery_house_number,
            receipt_city_id: req.body.receipt_city_id,
            receipt_street_name: req.body.receipt_street_name,
            receipt_house_number: req.body.receipt_house_number
        }
        console.log(shipment);
        let conn = await pool.getConnection();
        let q = await conn.query('INSERT INTO shipment SET ?', shipment);
        conn.release();
        res.json({"code": 200, "status": "OK"});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
}).put(async function(req,res){
    try{
        if(req.body.id === undefined) {
            res.json({"code": 400, "status": "Shipment ID not provided"});
            return;
        }
        const shipment = {
            status: req.body.status,
            creation_date: req.body.creation_date,
            delivery_date: req.body.delivery_date,
            user_oib: req.body.user_oib,
            delivery_city_id: req.body.delivery_city_id,
            delivery_street_name: req.body.delivery_street_name,
            delivery_house_number: req.body.delivery_house_number,
            receipt_city_id: req.body.receipt_city_id,
            receipt_street_name: req.body.receipt_street_name,
            receipt_house_number: req.body.receipt_house_number
        }
        console.log(shipment);
        let conn = await pool.getConnection();
        let q = await conn.query('UPDATE shipment SET ? WHERE id = ?', [shipment,req.body.id]);
        conn.release();
        res.json({"code": 200, "status": "OK"});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
});

router.route('/shipment/:id').get(async function(req,res){
    try{
        let conn = await pool.getConnection();
        //let rows = await conn.query('SELECT * FROM shipment WHERE ID = ?', req.params.id);
        let rows = await conn.query('CALL ShipmentInfo(?)', req.params.id);
        res.json({"code": 200, "status": "OK", "data": rows});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
});

module.exports = router;