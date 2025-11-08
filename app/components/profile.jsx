"use client";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage"; // make sure you add this util (below)

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // User data from localStorage
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('userName');
      const storedImage = localStorage.getItem('profileImage');
      
      if (storedEmail) setUserEmail(storedEmail);
      if (storedName) {
        // Try to split name into first and last name
        const nameParts = storedName.split(' ');
        if (nameParts.length >= 2) {
          setFirstName(nameParts[0]);
          setLastName(nameParts.slice(1).join(' '));
        } else {
          setFirstName(storedName);
        }
      }
      if (storedImage) setProfileImage(storedImage);
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  }, []);

  // Handle form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    try {
      // Combine firstName and lastName for full name
      const fullName = `${firstName} ${lastName}`.trim() || firstName || lastName;
      
      // Save to localStorage
      if (fullName) {
        localStorage.setItem('userName', fullName);
      }
      if (profileImage) {
        localStorage.setItem('profileImage', profileImage);
      }
      
      // Dispatch custom event to update sidebar (since storage event only fires cross-window)
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      // Show success message (optional)
      alert('Profile saved successfully!');
    } catch (err) {
      console.error("Error saving profile:", err);
      alert('Error saving profile. Please try again.');
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // handle upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  // save cropped photo
  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setProfileImage(croppedImage);
      // Save to localStorage immediately when crop is saved
      localStorage.setItem('profileImage', croppedImage);
      // Dispatch custom event to update sidebar
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const countries = [
    "Pakistan",
    "India",
    "China",
    "Japan",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Saudi Arabia",
    "UAE",
    "Malaysia",
    "Singapore",
    "Turkey",
    "Indonesia",
    "Bangladesh",
  ];

  // Filter countries by user input
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  ); 

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">Profile Setup</h1>

      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl space-y-6">
        {/* profile picture */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={profileImage || "/assets/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-blue-900 shadow-sm"
            />
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 right-0 bg-blue-900 text-white p-2 rounded-full cursor-pointer hover:bg-blue-800 transition-all duration-200"
            >
              <img src="/assets/upload.png" alt="camera" className="w-5 h-5" />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-slate-600 text-sm">Upload or take a new photo</p>
        </div>

        {/* form */}
        <form className="space-y-5" onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 text-sm mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 text-sm mb-1">Email Address</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              disabled
              placeholder="example@email.com"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-sm mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-sm mb-1">Contact Number</label>
            <input
              type="tel"
              placeholder="+92 300 1234567"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
            />
          </div>

            {/* Country Dropdown (Searchable) */}
          <div className="relative">
            <label className="block text-slate-600 text-sm mb-1">Country</label>
            <input
              type="text"
              placeholder="Search or select your country"
              value={searchTerm || selectedCountry}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
            />

            {showDropdown && (
              <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-lg">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedCountry(country);
                        setSearchTerm(country);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-slate-700"
                    >
                      {country}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-slate-400">No country found</li>
                )}
              </ul>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 hover:scale-[1.02] transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* cropper modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Adjust Your Photo
            </h3>
            <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full mt-4 accent-blue-900"
            />

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setShowCropper(false)}
                className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="px-5 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
