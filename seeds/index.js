const mongoose = require("mongoose");
const Cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = "pk.eyJ1IjoiYmxha2VwOTYiLCJhIjoiY2tvZDdzdXF5MDZhODJvcW5nOWY4MG1qYSJ9.AnmG-4IzDAnVrVh1XqfHhw"
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: "606e216d0c39f455d0fd383f",
            location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis, est.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    Cities[random1000].longitude,
                    Cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/keys-to-freedom/image/upload/v1619955562/YelpCamp/aivefgaaduzhk9e6czfp.jpg',
                    filename: 'YelpCamp/aivefgaaduzhk9e6czfp'
                }
            ]
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})