import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigBids, hireBid } from '../store/slices/bidSlice';
import { fetchGigById } from '../store/slices/gigSlice';

const GigBids = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bids, isLoading } = useSelector((state) => state.bids);
  const { currentGig } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchGigById(id));
    dispatch(fetchGigBids(id));
  }, [dispatch, id]);

  const handleHire = async (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) {
      const result = await dispatch(hireBid(bidId));
      if (!result.error) {
        alert('Freelancer hired successfully!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bids for: {currentGig?.title}</h1>
        <p className="text-gray-600">
          Budget: <span className="font-semibold text-blue-600">${currentGig?.budget}</span> •
          Status:{' '}
          <span
            className={`font-semibold ${
              currentGig?.status === 'open' ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            {currentGig?.status}
          </span>
        </p>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No bids yet. Share your gig to get more attention!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {bid.freelancerId?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${bid.price}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      bid.status === 'hired'
                        ? 'bg-green-100 text-green-800'
                        : bid.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Proposal</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{bid.message}</p>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Submitted: {new Date(bid.createdAt).toLocaleDateString()}
              </div>

              {bid.status === 'pending' && currentGig?.status === 'open' && (
                <button
                  onClick={() => handleHire(bid._id)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Hire This Freelancer
                </button>
              )}

              {bid.status === 'hired' && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 font-medium text-center">
                    ✓ Hired - This freelancer has been selected for the project
                  </p>
                </div>
              )}

              {bid.status === 'rejected' && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-red-800 text-center">This bid was not selected</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GigBids;
