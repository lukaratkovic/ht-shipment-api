function validateDate(date){
    return date instanceof Date && !isNaN(date)
}

module.exports = {validateDate}