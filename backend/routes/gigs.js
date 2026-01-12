const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const { protect } = require('../middleware/auth');

// @route GET /api/gigs | @desc Fetch all open gigs (with search query) | @access Public
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'open' };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/gigs/user/my-gigs | @desc Get gigs posted by current user | @access Private
router.get('/user/my-gigs', protect, async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/gigs/:id | @desc Get single gig | @access Public
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/gigs | @desc Create a new job post | @access Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // Validation
    if (!title || !description || !budget) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

    res.status(201).json(populatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
