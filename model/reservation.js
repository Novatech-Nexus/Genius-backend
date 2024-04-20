import mongoose from 'mongoose';

const { Schema } = mongoose;

const categoryTNumberMap ={
    'Couple': ['C1', 'C2', 'C3','C4', 'C5' , 'C6', 'C7', 'C8'],
    'Family/Friends': ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
    'Business Meeting': ['B1', 'B2', 'B3', 'B4', 'B5'] 
}

const reservationSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true,
        enum: ['6.30am - 10.30am', '12.00pm - 3.30pm', '4.00pm - 6.30pm', '7.30pm - 11.30pm']
    },
    category: {
        type: String,
        required: true,
        enum: ['Couple', 'Family/Friends', 'Business Meeting'] // Corrected spelling
    },
    tNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Access the selected category and its associated tNumbers
                const validTNumbers = categoryTNumberMap[this.category] || [];
                return validTNumbers.includes(value); // Check if value is in validTNumbers
            },
            message: props => `${props.value} is not a valid tNumber for the selected category`
        }
    },
    nGuest: {
        type: Number,
        required: true
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
