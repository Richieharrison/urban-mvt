const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(cors());
app.options('*', cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

const port = process.env.port || 3000

mongoose.connect(`mongodb+srv://ngatia:10richharry10@cluster0.6kjpxi7.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    dbName: 'Quickfast',
    useUnifiedTopology: true
}).then(()=>{
    console.log('The database has been connected')
}).catch((err)=>console.log(err))

const orderSchema = new mongoose.Schema({
    currentLocation: { type: Object, required: true },
    destination: { type: Object, required: true },
    phoneNumber: { type: String, required: true },
    distance: { type: Number, required: true},
    amountPaid: { type: Number, required: true },
    status: {type: String, default: 'pending'}
});

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    nationalId: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', orderSchema);

app.get('/', (req, res)=>{
    console.log('welcome')
    res.send('Welcome here')
})

app.post('/register/user', async(req, res)=>{
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationalId: req.body.nationalId,
        phoneNumber: req.body.phoneNumber
    })
    
    await newUser.save()
    .then(result => {res.status(200).send(result);})
    .catch(error => {console.error(error);res.status(500).send('Internal server error');});
})

app.post('/user', (req, res)=>{
    console.log(req.body)
    res.send(req.body)
})


app.get('/all-orders', async(req, res)=>{
    try{
        const orders = await Order.find()

        if(!orders)
        return res.status(404).send("You don't have any orders")

        return res.status(200).send(orders)
    }catch{
        (err) => console.log(err)
    }
})

app.get('/all-users', async(req, res)=>{
    try{
        const orders = await User.find()

        if(!orders)
        return res.status(404).send("You don't have any orders")

        return res.status(200).send(orders)
    }catch{
        (err) => console.log(err)
    }
})

app.get('/cors', (req, res)=>{
    res.send('Cors has been enabled')
})


app.listen(port, ()=>{
    console.log(`The server is listening in ${port}`)
})

