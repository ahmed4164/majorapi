const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
let db;
const connect = async () => {
    try {
        db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${db.connection.host}`);
        await createCollections();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
// Define schemas and models for collections
const studentSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true // Ensure uniqueness of email
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const teacherSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true // Ensure uniqueness of email
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const classroomSchema = new mongoose.Schema({
    name: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create models based on schemas
const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Classroom = mongoose.model('Classroom', classroomSchema);

// Ensure collections are created if they don't exist
async function createCollections() {
    try {
        await Student.createCollection();
        await Teacher.createCollection();
        await Classroom.createCollection();
        console.log('Collections created successfully');
    } catch (error) {
        console.error('Error creating collections:', error);
    }
}
const get = () => {
    return db;
}

module.exports = { connect, get, Student, Teacher, Classroom };
