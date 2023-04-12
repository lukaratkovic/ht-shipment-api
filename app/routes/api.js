const express = require('express');
const router = express.Router();
const mysql = require('promise-mysql');
const config = require("../../config");
const {filterShipments,assignShipment,getShipmentProducts} = require("../../utils/shipmentUtils");

initDb = async () => {
    pool = await mysql.createPool(config.pool);
}

initDb();

router.get('/', (req, res)=>{
    res.send('Connected to API.');
});

// GET, POST and PUT requests for shipments
router.route('/shipments').get(async function(req,res){
    try{
        let conn = await pool.getConnection();
        // Get all shipments
        let rows = await conn.query('CALL ShipmentInfo(NULL)');
        // Filter shipments by request parameters
        let shipments = filterShipments(rows[0], req.query);
        // Fetch and add products for each shipment
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
        // Assign request parameters to shipment object
        const shipment
            = assignShipment(req);

        // Check for invalid or missing properties
        let missingProperties = [];
        for(const property in shipment){
            if(shipment[property] === undefined || shipment[property] == null)
                missingProperties.push(property);
        }
        if(missingProperties.length > 0){
            res.json({"code": 400, "status": `Missing properties: ${missingProperties}`})
            return;
        }
        if(shipment.user_oib.length !== 11){
            res.json({"code": 400, "status": "Invalid user OIB"});
            return;
        }

        let conn = await pool.getConnection();
        // Insert new shipment and its products into database
        let q = await conn.query('INSERT INTO shipment SET ?', shipment);
        for (let i = 0; i < req.body.products.length; i++) {
            let product = req.body.products[i];
            await conn.query("INSERT INTO shipment_products VALUES (?, ?, ?)",
                [q.insertId, product.product_id, product.amount]);
        }
        conn.release();
        res.json({"code": 200, "status": "OK"});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
});

// GET and PUT route for shipments by specific ID
router.route('/shipments/:id').get(async function(req,res){
    try{
        let conn = await pool.getConnection();
        // Fetch shipment by ID from database
        let rows = await conn.query('CALL ShipmentInfo(?)', req.params.id);
        rows = rows[0];
        // Check if shipments exists
        if(rows.length === 0){
            res.json({"code": 204, "status": "Shipment does not exist"});
            return;
        }
        let shipments = rows;
        // Get shipment products from database
        shipments[0].Products = await getShipmentProducts(conn, req.params.id);
        conn.release();
        res.json({"code": 200, "status": "OK", "data": shipments});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
}).put(async function(req,res){
    try{
        // Assign request parameters to shipment object
        let shipment
            = assignShipment(req);
        // Check for invalid or missing properties
        if(req.params.id === undefined) {
            res.json({"code": 400, "status": "Shipment ID not provided"});
            return;
        }
        if(shipment.user_oib !== undefined && shipment.user_oib.length !== 11){
            res.json({"code": 400, "status": "Invalid user OIB"});
        }

        // Remove undefined and null fields so they remain unchanged in the database
        for(let key in shipment){
            if(shipment[key] === undefined || shipment[key] == null)
                delete shipment[key]
        }

        console.log(shipment);

        let conn = await pool.getConnection();
        // Update the shipment and its products
        await conn.query('UPDATE shipment SET ? WHERE id = ?', [shipment,req.params.id]);
        if(req.body.products !== undefined) {
            await conn.query("DELETE FROM shipment_products WHERE shipment_id = ?",req.params.id);
            for (let i = 0; i < req.body.products.length; i++) {
                let product = req.body.products[i];
                await conn.query("INSERT INTO shipment_products VALUES (?, ?, ?)",
                    [req.params.id, product.product_id, product.amount]);
            }
        }

        conn.release();
        res.json({"code": 200, "status": "OK"});
    } catch(e){
        console.log(e);
        return res.json({"code": 100, "status": "Error with query"});
    }
});

//GET route for all user shipments
router.route('/users/:userId').get(async function(req,res){
    try{
        let conn = await pool.getConnection();
        // Fetch all shipments of user
        let rows = await conn.query('CALL UserShipments(?)', req.params.userId);
        // Filter shipments by request parameters
        let shipments = filterShipments(rows[0], req.query);
        // Fetch products for each shipment
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

// Default route for invalid API calls
router.use('*', async function(req,res){
    res.json({"code": 400, "status": "Route does not exist"});
});

module.exports = router;