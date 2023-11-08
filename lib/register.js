const registerUser = (user) => {
    try {
        console.log(`${new Date().toJSON()} - register - registerUser - got new user for register`);
        console.log(`${new Date().toJSON()} - register - registerUser - ${user}`);
        let approved_limit = 36 * monthly_salary
    } catch (error) {
        console.log(`${new Date().toJSON()} - register - registerUser - error ${error}`);
    }
}

const another = () => {
    try {
        console.log(`${new Date().toJSON()} - register - another - got new user for register`);
    } catch (error) {
        console.log(`${new Date().toJSON()} - register - another -  error ${error}`);
    }
}
module.exports = {
    registerUser,
    another
}