const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const { protect } = require('../middleware/auth');

// @route POST /api/bids | @desc Submit a bid for a gig | @access Private
router.post('/', protect, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Validation
    if (!gigId || !message || !price) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer accepting bids' });
    }

    // Check if user is not the gig owner
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this gig' });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    res.status(201).json(populatedBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/bids/user/my-bids | @desc Get bids submitted by current user | @access Private
router.get('/user/my-bids', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title budget status')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PATCH /api/bids/:bidId/hire | @desc Hire a freelancer (race-condition safe) | @access Private
router.patch('/:bidId/hire', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.bidId)) {
      return res.status(400).json({ message: 'Invalid bid id' });
    }

    // MongoDB transactions require a replica set; atomic updates keep this race-condition safe.
    const bid = await Bid.findById(req.params.bidId).populate('gigId');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = bid.gigId;

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // Only pending bids can be hired
    if (bid.status !== 'pending') {
      return res.status(400).json({ message: `This bid is already ${bid.status}` });
    }

    // Check if gig is still open (prevents race condition).
    const updatedGig = await Gig.findOneAndUpdate(
      {
        _id: gig._id,
        status: 'open', // Only update if status is still 'open'
      },
      {
        status: 'assigned',
      },
      {
        new: true,
      }
    );

    // If no document was updated, another request already assigned the gig.
    if (!updatedGig) {
      return res.status(400).json({ 
        message: 'This gig is no longer open. Another freelancer may have just been hired.' 
      });
    }

    // Update the hired bid status
    await Bid.updateOne(
      { _id: bid._id, status: 'pending' },
      { status: 'hired' }
    );

    // Reject all other pending bids for this gig
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: 'pending',
      },
      {
        status: 'rejected',
      }
    );

    // Get updated bid with populated fields
    const updatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title status');

    // Emit Socket.io event for real-time notification.
    const io = req.app.get('io');
    if (io) {
      io.to(updatedBid.freelancerId._id.toString()).emit('hired', {
        message: `You have been hired for ${updatedBid.gigId.title}!`,
        gigTitle: updatedBid.gigId.title,
        gigId: updatedBid.gigId._id,
        bidId: updatedBid._id,
        timestamp: new Date()
      });
    }

    res.json(updatedBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/bids/:gigId | @desc Get all bids for a specific gig (owner only) | @access Private
router.get('/:gigId', protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these bids' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
