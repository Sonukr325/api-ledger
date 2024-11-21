const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Add a new customer
router.post('/add-customer', async (req, res) => {
  const { customerId, name, mobile, photoUrl } = req.body;
  
  try {
    const newCustomer = new Customer({
      customerId,
      name,
      mobile,
      photoUrl,
      transactions: []
    });
    await newCustomer.save();
    res.status(201).send('Customer added successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Add a transaction for a specific customer
router.post('/add-transaction/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { amount, date, item, type } = req.body;

  if (!['cr', 'dr'].includes(type)) {
    return res.status(400).send("Invalid transaction type. Must be 'cr' or 'dr'.");
  }

  try {
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    const transaction = { amount, date: new Date(date), item, type };
    customer.transactions.push(transaction);
    await customer.save();
    res.status(200).send('Transaction added successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete a customer by customerId
router.delete('/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const deletedCustomer = await Customer.findOneAndDelete({ customerId });

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully', customer: deletedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});

// Get all customer details
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).send('Error fetching customers: ' + error.message);
  }
});

// Get customer details by customer ID
router.get('/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
