const Todo = require('../models/dowloadResume');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { myMail, googlePwd } = require('../config/serverConfig');


// Function to send email
const sendEmail = async (toEmail, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myMail,
        pass: googlePwd,
      },
    });

    const mailOptions = {
      from: myMail,
      cc: myMail,
      to: toEmail,
      subject: 'Resume Form Submission Confirmation',
      text: `Dear ${name},\n\nThank you for submitting your details. We have received your request successfully.\n\nBest regards,\nRaj Kumar Singha`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to database
    const todoItem = await Todo.create({ name, email, phoneNumber });

    // Send email notification
    await sendEmail(email, name);

    res.status(201).json({
      message: 'Resume Form Submitted successfully',
      data: todoItem,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTodo = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id.toString() })
      .populate('userId', 'name _id')
      .select('-__v');

    res
      .status(200)
      .json({ noOfTodo: todos.length, Todo: todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
};

exports.getByIdTodo = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid Todo ID' });
    }

    const todo = await Todo.findById(_id)
      .populate('userId', 'name _id')
      .select('-__v');

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ Msg: "Todo Get Successfully", Todo: todo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid Todo ID' });
    }
    const update = req.body;
    const todos = await Todo.findByIdAndUpdate(
      _id,
      update,
      { new: true }
    )
      .populate('userId', 'name _id')
      .select('-__v');

    if (!todos) return res.status(404).json({ error: 'Todo not found' });
    res
      .status(200)
      .json({ Msg: 'Todo updated successfully', Todo: todos });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid Todo ID' });
    }
    const todos = await Todo.findByIdAndDelete({
      _id
    });
    if (!todos) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: `${_id} Todo deleted successfully` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
