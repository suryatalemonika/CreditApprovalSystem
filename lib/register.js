const { client } = require('./dbconnection')
const registerUser = async (req) => {
    try {
        console.log(`${new Date().toJSON()} - register - registerUser - got new user for register`);
        const reqq = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            monthly_income: req.body.monthly_income,
            phone_number: req.body.phone_number
        }
        const approved_limit = Math.round(36 *reqq.monthly_income / 100000) * 100000;
        const result = await client.query(`INSERT INTO customer
          (first_name, last_name, age, monthly_income, phone_number, approved_limit)
          VALUES
          ('${reqq.first_name}', '${reqq.last_name}', ${reqq.age}, ${reqq.monthly_income}, '${reqq.phone_number}', ${approved_limit}) RETURNING *`);
          return ({
            code: 201,
            res: {
                message: 'Customer registered successfully',
                customer: result.rows[0],
            }
        })
    } catch (error) {
        console.log(`${new Date().toJSON()} - register - registerUser - error ${error}`);
        return ({
            code: 500,
            res: {
                message: ' internal server error'
            }
        })
    }
}

module.exports = {
    registerUser
}