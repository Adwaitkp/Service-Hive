import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById } from '../store/slices/gigSlice';
import { submitBid } from '../store/slices/bidSlice';

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentGig, isLoading: gigLoading } = useSelector((state) => state.gigs);
  const { isLoading: bidLoading, error } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    message: '',
    price: '',
  });

  useEffect(() => {
    dispatch(fetchGigById(id));
  }, [dispatch, id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      submitBid({
        gigId: id,
        message: bidData.message,
        price: parseFloat(bidData.price),
      })
    );

    if (!result.error) {
      alert('Bid submitted successfully!');
      setShowBidForm(false);
      setBidData({ message: '', price: '' });
      navigate('/my-bids');
    }
  };

  if (gigLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Gig not found</p>
      </div>
    );
  }

  const isOwner = user?._id === currentGig.ownerId?._id;
  const canBid = isAuthenticated && !isOwner && currentGig.status === 'open';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{currentGig.title}</h1>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              currentGig.status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {currentGig.status}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{currentGig.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-2xl font-bold text-blue-600">${currentGig.budget}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Posted by</p>
            <p className="text-lg font-semibold text-gray-900">{currentGig.ownerId?.name}</p>
          </div>
        </div>

        {canBid && !showBidForm && (
          <button
            onClick={() => setShowBidForm(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Place a Bid
          </button>
        )}

        {showBidForm && (
          <form onSubmit={handleBidSubmit} className="mt-6 p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Bid</h3>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Your Price (USD) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your bid amount"
                value={bidData.price}
                onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Proposal Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                maxLength={500}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why you're the best fit for this project..."
                value={bidData.message}
                onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">{bidData.message.length}/500 characters</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={bidLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
              >
                {bidLoading ? 'Submitting...' : 'Submit Bid'}
              </button>
              <button
                type="button"
                onClick={() => setShowBidForm(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isOwner && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              This is your gig. You can view all bids from the "My Gigs" page.
            </p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">
              Please <a href="/login" className="underline font-medium">login</a> to place a bid on this gig.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;
