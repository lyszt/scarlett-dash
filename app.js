import express, {response} from 'express';
const session = require('express-session');
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const password = process.env.PASSWORD;
function loginAuthentication(req) {
    const pass_input = req.body.password;
    if(pass_input){
        if(pass_input === password){
            window.location.href('/app')
        } else {
            response.send('Incorrect password.');
        }
    }
}
