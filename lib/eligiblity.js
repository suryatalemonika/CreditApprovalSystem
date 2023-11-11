const xlsx = require('xlsx');
const loanData = xlsx.readFile('lib/loan_data.xlsx');
const loanSheet = loanData.Sheets[loanData.SheetNames[0]];
const loanJson = xlsx.utils.sheet_to_json(loanSheet);

function calculateCreditScore(customerId) {
    try {
        console.log(`${new Date().toJSON()} - register  - calculateCreditScore `);
        const customer = loanJson.find(entry => entry.customer_id === customerId);
        if (!customer) {
            return null;
        }
        const approved_limit = Math.round(36 * customer.monthly_payment / 100000) * 100000;
        if (customer.loan_amount > approved_limit) {
            return 0;
        }
        const loanActivity = customer['EMIs paid on Time'] / customer.tenure;
        const loanDurationInMonths = Math.floor((customer.end_date - customer.start_date) / (30 * 24 * 60 * 60 * 1000));
        const weights = {
            emisPaidOnTime: 0.2,
            tenure: 0.2,
            interestRate: 0.3,
            loanAmount: 0.2,
            loanActivity: 0.1,
        };
        let creditScore = (
            customer['EMIs paid on Time'] * weights.emisPaidOnTime +
            customer.tenure * weights.tenure +
            (100 - customer.interest_rate) * weights.interestRate +
            (customer.loan_amount / 10000) * weights.loanAmount +
            loanActivity * weights.loanActivity +
            loanDurationInMonths * weights.loanActivity
        );
        return Math.round(creditScore);
    } catch (error) {
        console.log(`${new Date().toJSON()} - register - calculateCreditScore - error ${error}`);
    }
}
const eligibility = async (req) => {
    try {
        console.log(`${new Date().toJSON()} - register - eligibility `);
        const {
            customer_id,
            loan_amount,
            tenure,
            interest_rate
        } = req.body
        const creditScore = calculateCreditScore(customer_id);
        return ({
            code: 200,
            res: {
                message: 'Customer eligible ',
                customer: {},
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
    eligibility
}