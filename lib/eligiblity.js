
const xlsx = require('xlsx');
const loanData = xlsx.readFile('lib/loan_data.xlsx');
const loanSheet = loanData.Sheets[loanData.SheetNames[0]];
const customers = xlsx.utils.sheet_to_json(loanSheet);
function calculateCreditScore(customerId) {
    try {
        console.log(`${new Date().toJSON()} - register  - calculateCreditScore `);
        const customer = customers.find(entry => entry.customer_id === customerId);
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


function calculateEMI(loanAmount, interestRate, tenure) {
    try {
        console.log(`${new Date().toJSON()} - register  - calculateEMI `);
        const monthlyInterestRate = interestRate / (12 * 100);
        const numerator = Math.pow(1 + monthlyInterestRate, tenure);
        const denominator = numerator - 1;
        const emi = loanAmount * monthlyInterestRate * (numerator / denominator);
        return emi;
    } catch (error) {
        console.log(`${new Date().toJSON()} - register  - calculateEMI error ${error}`);
    }
}
function isLoanApprovalAllowed(customer) {
    try {
        console.log(`${new Date().toJSON()} - register  - isLoanApprovalAllowed `);
        const totalEMIs = [customer]
            .reduce((sum, loan) => sum + calculateEMI(loan.loan_amount, loan.interest_rate, loan.tenure), 0);
            console.log(`${new Date().toJSON()} - register  - isLoanApprovalAllowed  totalEMIs ${Math.round(totalEMIs)} : half of monthly payment ${Math.round(0.5 * customer.monthly_payment)}`);
        return 0.5 * customer.monthly_payment > totalEMIs
    } catch (error) {
        console.log(`${new Date().toJSON()} - register  - isLoanApprovalAllowed error ${error}`);
    }
}

const eligibility = async (req) => {
    try {
        console.log(`${new Date().toJSON()} - register  - eligibility `);
        const { customer_id, loan_amount, interest_rate, tenure } = req.body;
        if (!customer_id || !loan_amount || !interest_rate || !tenure) {
            console.log(`${new Date().toJSON()} - register  - eligibility missing fields in request body `);
            return ({ code: 400, res: 'Missing required fields in the request body' });
        }
        const customer = customers.find((c) => c.customer_id === customer_id);
        if (!customer) {
            console.log(`${new Date().toJSON()} - register  - eligibility customer not found in database `);
            return ({ code: 404, res: { error: 'Customer not found' } })
        }

        const credit_score = calculateCreditScore(customer_id);
        let loan_approval = false;
        let corrected_interest_rate;

        if (credit_score > 50) {
            loan_approval = true;
            corrected_interest_rate = interest_rate
        } else if (50 > credit_score && credit_score > 30) {
            corrected_interest_rate = 12;
            loan_approval = true;
        } else if (30 > credit_score && credit_score > 10) {
            corrected_interest_rate = 16;
            loan_approval = true;
        } else if (10 > credit_score) {
            corrected_interest_rate = interest_rate;
        }
        if (loan_approval) {
            loan_approval = isLoanApprovalAllowed(customer);
        }
        console.log(`${new Date().toJSON()} - register  - eligibility  credit_score ${credit_score} `);

        if (loan_approval) {
            console.log(`${new Date().toJSON()} - register  - eligibility If case `);
            return ({
                code: 200,
                res: {
                    "customer_id": customer_id,
                    "approval": true,
                    "interest_rate": interest_rate,
                    "corrected_interest_rate": corrected_interest_rate || interest_rate,
                    "tenure": tenure,
                    "monthly_installment": Math.round(calculateEMI(loan_amount, corrected_interest_rate || interest_rate, tenure))
                }
            })
        } else {
            console.log(`${new Date().toJSON()} - register  - eligibility else case `);
            return ({
                code: 400,
                res: { "approval": false }
            })
        }
    } catch (error) {
        console.log(`${new Date().toJSON()} - register  - eligibility error ${error}`);
        return ({
            code: 400,
            res: { "approval": false }
        })
    }

}

module.exports = {
    eligibility
}

