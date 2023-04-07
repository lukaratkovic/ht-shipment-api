const express = require('express');
const router = express.Router();
const mysql = require('promise-mysql');
const config = require("../../config");
const {filterShipments,assignShipment,getShipmentProducts} = require("../../utils/utils");

initDb = async () => {
    pool = await mysql.createPool(config.pool);
}

initDb();

router.get('/', (req, res)=>{
    res.send('Connected to API.');
});

router.route('/shipments').get(async function(req,res){
    try{
        let conn = await pool.getConnection();
        let rows = await conn.query('CALL ShipmentInfo(NULL)');
        let shipments = filterShipments(rows[0], req.query);
        for (let i = 0; i < shipments.length; i++) {
            shipments[i].Products = await getShipmentProducts(conn, shipments[i].ShipmentID);
        }
        conn.release();
        res.json({"code": 200, "status": "OK", "data": shipments});
    } catch (e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
}).post(async function(req, res){
    try{
        const shipment = assignShipment(req);
        console.log(shipment);
        let conn = await pool.getConnection();
        await conn.query('INSERT INTO shipment SET ?', shipment);
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

router.route('/shipments/:id').get(async function(req,res){
    try{
        let conn = await pool.getConnection();
        //let rows = await conn.query('SELECT * FROM shipment WHERE ID = ?', req.params.id);
        let rows = await conn.query('CALL ShipmentInfo(?)', req.params.id);
        rows = rows[0];
        if(rows.length === 0){
            res.json({"code": 204, "status": "Shipment does not exist"});
            return;
        }
        let shipments = rows;
        shipments[0].Products = await getShipmentProducts(conn, req.params.id);
        conn.release();
        res.json({"code": 200, "status": "OK", "data": shipments});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
});

router.route('/users/:userId').get(async function(req,res){
    try{
        let conn = await pool.getConnection();
        let rows = await conn.query('CALL UserShipments(?)', req.params.userId);
        let shipments = filterShipments(rows[0], req.query);
        for (let i = 0; i < shipments.length; i++) {
            shipments[i].Products = await getShipmentProducts(conn, shipments[i].ShipmentID);
        }
        conn.release();
        res.json({"code": 200, "status": "OK", "data": shipments});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
});

router.use('*', async function(req,res){
    res.json({"code": 400, "status": "Invalid API call."});
});

module.exports = router;