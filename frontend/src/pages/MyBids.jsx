import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBids } from '../store/slices/bidSlice';
import { Link } from 'react-router-dom';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Submitted Bids</h1>
      </div>

      {myBids.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't submitted any bids yet.</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Available Gigs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {bid.gigId?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Gig Budget: ${bid.gigId?.budget} • Gig Status:{' '}
                    <span
                      className={`font-medium ${
                        bid.gigId?.status === 'open' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {bid.gigId?.status}
                    </span>
                  </p>
                </div>
                <div className="text-right ml-4">
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
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Proposal</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{bid.message}</p>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <span>Submitted: {new Date(bid.createdAt).toLocaleDateString()}</span>
              </div>

              {bid.status === 'hired' && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 font-medium text-center">
                    🎉 Congratulations! You've been hired for this project!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;
