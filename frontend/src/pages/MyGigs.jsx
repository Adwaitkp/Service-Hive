import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs } from '../store/slices/gigSlice';
import { Link } from 'react-router-dom';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchMyGigs());
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
        <h1 className="text-4xl font-bold text-gray-900">My Posted Gigs</h1>
      </div>

      {myGigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't posted any gigs yet.</p>
          <Link
            to="/create-gig"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Post Your First Gig
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">${gig.budget}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gig.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {gig.status}
                </span>
              </div>
              <Link
                to={`/gigs/${gig._id}/bids`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Bids
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
