
const xlsx = require('xlsx');
const { calculateEMI } = require('./eligiblity')
const loanData = xlsx.readFile('lib/loan_data.xlsx');
const loanSheet = loanData.Sheets[loanData.SheetNames[0]];
const loans = xlsx.utils.sheet_to_json(loanSheet);

const customerData = xlsx.readFile('lib/customer_data.xlsx');
const customerSheet = customerData.Sheets[customerData.SheetNames[0]];
const customers = xlsx.utils.sheet_to_json(customerSheet);
const viewLoan = (loan_id) => {
    try {
        console.log(`${new Date().toJSON()} - viewLoan  - Createloan `);
        const loanDetails = loans.filter(entry => entry.loan_id === parseInt(loan_id));
        console.log(`${new Date().toJSON()} - register  - viewLoan loanDetails ${JSON.stringify(loanDetails)}`);
        if (loanDetails.length>0) {
            const customerDetails = customers.filter(entry => entry.customer_id == loanDetails[0].customer_id)
            console.log(`${new Date().toJSON()} - register  - viewLoan customerDetails ${JSON.stringify(customerDetails)}`);
            delete customerDetails[0].approved_limit
            delete customerDetails[0].monthly_salary
            return {
                code: 200,
                res: {
                    loan_id: parseInt(loan_id),
                    customer: customerDetails[0],
                    loan_approved: true,
                    loan_amount: loanDetails[0].loan_amount,
                    interest_rate: loanDetails[0].interest_rate,
                    monthly_installment: calculateEMI(loanDetails[0].loan_amount, loanDetails[0].interest_rate, loanDetails[0].tenure),
                    tenure: loanDetails[0].tenure
                }
            }
        }else{
            return {
                code: 404,
                res: {
                    error: 'no loan found for the loan id'
                }
            }
        }

    } catch (error) {
        console.log(`${new Date().toJSON()} - viewLoan  - viewLoan error ${error}`);
        return {
            code: 400,
            res: {
                error: 'need to check previos data'
            }
        }
    }
}

module.exports = {
    viewLoan
}