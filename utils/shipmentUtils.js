function filterShipments(shipments, filters){
    if(filters.startDate !== undefined) {
        shipments = shipments.filter(row => {
            return Date.parse(filters.startDate) <= Date.parse(row.Creation_Date);
        });
    }
    if(filters.endDate !== undefined){
        shipments = shipments.filter(row => {
            return Date.parse(filters.endDate) >= Date.parse(row.Creation_Date);
        });
    }
    if(filters.status !== undefined){
        shipments = shipments.filter(row => {
            return filters.status === row.STATUS
        });
    }
    return shipments;
}

function assignShipment(req){
    return {
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
}

async function getShipmentProducts(conn, id){
    let products = await
        conn.query('CALL ShipmentProducts(?)',id);
    return products[0];
}

module.exports = {filterShipments, assignShipment, getShipmentProducts};