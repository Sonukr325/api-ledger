const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const customerRoutes = require('../routes/customerRoutes');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  item: { type: String, required: false },
  type: { type: String, enum: ['cr', 'dr'], required: true } // Add type field with allowed values
});

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  photoUrl: { type: String },
  transactions: [transactionSchema] // Embed transaction schema in the customer schema
});

module.exports = mongoose.model('Customer', customerSchema);
