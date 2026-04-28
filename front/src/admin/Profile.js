import { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId"); // Get userId from localStorage
  const token = localStorage.getItem("token"); // Get token from localStorage

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) {
        setError("User ID or token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError("Error fetching profile");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-4 mt-60 border rounded-lg shadow-md bg-white">
      {error && <p className="text-red-500 text-center">{error}</p>}

      {profile ? (
        <>
          <h2 className="text-xl font-bold text-center">{profile.name}</h2>
          <p className="text-gray-600 text-center">{profile.email}</p>
          <p className="mt-4 text-center">User ID: {profile._id}</p>
        </>
      ) : (
        <p className="text-red-500 text-center">Profile not found</p>
      )}
    </div>
  );
};

export default Profile;
