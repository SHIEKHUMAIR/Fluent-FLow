"use client";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";

// COUNTRY LIST WITH FLAGS + CODES + PHONE LENGTH
const countryData = [
  { name: "Pakistan", code: "PK", dial: "+92", flag: "/flags/pk.png", phoneLength: 10 },
  { name: "India", code: "IN", dial: "+91", flag: "/flags/in.png", phoneLength: 10 },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "/flags/sa.png", phoneLength: 9 },
  { name: "United States", code: "US", dial: "+1", flag: "/flags/us.png", phoneLength: 10 },
  { name: "United Kingdom", code: "UK", dial: "+44", flag: "/flags/uk.png", phoneLength: 10 },
];

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // COUNTRY + PHONE STATES
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // RESIDENCE COUNTRY
  const [searchResidence, setSearchResidence] = useState("");
  const [selectedResidenceCountry, setSelectedResidenceCountry] = useState(null);
  const [showResidenceDropdown, setShowResidenceDropdown] = useState(false);

  // USER DATA
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // DOB
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");

  // LOAD USER DATA
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        
        // Try to load from API first
        if (userId) {
          try {
            const { API_ENDPOINTS } = await import("../../lib/config");
            const { apiGet } = await import("../../lib/api");
            
            const result = await apiGet(API_ENDPOINTS.PROFILE.GET(userId));
            if (result.success && result.data) {
              const user = result.data;
              setUserEmail(user.email || "");
              setFirstName(user.firstName || "");
              setLastName(user.lastName || "");
              if (user.profileImage) setProfileImage(user.profileImage);
              if (user.phone) {
                // Extract phone number (remove country code)
                const phoneNum = user.phone.replace(/^\+\d+/, "");
                setPhone(phoneNum);
                // Try to find country by phone code
                const countryCode = user.phone.match(/^\+(\d+)/)?.[1];
                if (countryCode) {
                  const country = countryData.find(c => c.dial.includes(countryCode));
                  if (country) setSelectedCountry(country);
                }
              }
              if (user.country) {
                const c = countryData.find(x => x.name === user.country);
                if (c) setSelectedCountry(c);
              }
              if (user.residenceCountry) setSearchResidence(user.residenceCountry);
              if (user.dateOfBirth) setDob(user.dateOfBirth);
              
              // Also update localStorage
              if (user.firstName && user.lastName) {
                localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
              }
              if (user.profileImage) localStorage.setItem("profileImage", user.profileImage);
              
              return; // Exit early if API data loaded
            }
          } catch (apiErr) {
            console.error("Error loading from API, falling back to localStorage:", apiErr);
          }
        }

        // Fallback to localStorage
        const storedEmail = localStorage.getItem("userEmail");
        const storedName = localStorage.getItem("userName");
        const storedImage = localStorage.getItem("profileImage");
        const storedPhone = localStorage.getItem("userPhone");
        const storedCountry = localStorage.getItem("userCountry");
        const storedResidence = localStorage.getItem("userResidenceCountry");
        const storedDob = localStorage.getItem("userDob");

        if (storedEmail) setUserEmail(storedEmail);
        if (storedName) {
          const nameParts = storedName.split(" ");
          if (nameParts.length >= 2) {
            setFirstName(nameParts[0]);
            setLastName(nameParts.slice(1).join(" "));
          } else setFirstName(storedName);
        }
        if (storedImage) setProfileImage(storedImage);
        if (storedPhone) setPhone(storedPhone);
        if (storedCountry) {
          const c = countryData.find(x => x.name === storedCountry);
          if (c) setSelectedCountry(c);
        }
        if (storedResidence) setSearchResidence(storedResidence);
        if (storedDob) setDob(storedDob);
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    loadUserData();
  }, []);

  // PHONE FORMATTING + VALIDATION
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setPhone(value);

    if (value.length !== selectedCountry.phoneLength) {
      setPhoneError(`Phone number must be ${selectedCountry.phoneLength} digits for ${selectedCountry.name}`);
    } else {
      setPhoneError("");
    }
  };

  // DOB CHANGE + VALIDATION
  const handleDobChange = (e) => {
    const value = e.target.value;
    setDob(value);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    if (value > today) setDobError("Date of Birth cannot be in the future.");
    else setDobError("");
  };

  // FORM SUBMISSION
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) { alert("Fix phone number before saving!"); return; }
    if (dobError) { alert("Fix Date of Birth before saving!"); return; }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please login to save profile");
        return;
      }

      // Import API utilities
      const { API_ENDPOINTS } = await import("../../lib/config");
      const { apiPost } = await import("../../lib/api");

      const fullName = `${firstName} ${lastName}`.trim();
      const fullPhone = selectedCountry.dial + phone;

      // Save to backend
      const result = await apiPost(API_ENDPOINTS.PROFILE.UPDATE, {
        userId: parseInt(userId),
        firstName: firstName,
        lastName: lastName,
        profileImage: profileImage,
        phone: fullPhone,
        dateOfBirth: dob,
        country: selectedCountry.name,
        residenceCountry: searchResidence
      });

      if (result.success) {
        // Also save to localStorage for immediate UI update
        if (fullName) localStorage.setItem("userName", fullName);
        if (profileImage) localStorage.setItem("profileImage", profileImage);
        if (phone) localStorage.setItem("userPhone", phone);
        if (dob) localStorage.setItem("userDob", dob);
        if (selectedCountry) localStorage.setItem("userCountry", selectedCountry.name);
        if (searchResidence) localStorage.setItem("userResidenceCountry", searchResidence);

        window.dispatchEvent(new CustomEvent("profileUpdated"));
        alert("Profile saved successfully!");
      } else {
        alert(result.error || "Error saving profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setProfileImage(croppedImage);
      localStorage.setItem("profileImage", croppedImage);
      
      // Save to backend immediately
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const { API_ENDPOINTS } = await import("../../lib/config");
          const { apiPost } = await import("../../lib/api");
          
          await apiPost(API_ENDPOINTS.PROFILE.UPDATE, {
            userId: parseInt(userId),
            profileImage: croppedImage
          });
        } catch (apiErr) {
          console.error("Error saving image to backend:", apiErr);
          // Continue anyway - at least it's saved locally
        }
      }
      
      window.dispatchEvent(new CustomEvent("profileUpdated"));
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredResidenceCountries = countryData.filter((c) =>
    c.name.toLowerCase().includes(searchResidence.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">Profile Setup</h1>

      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl space-y-6">
        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={profileImage || "/assets/default-avatar.png"}
              className="w-32 h-32 object-cover rounded-full border-4 border-blue-900 shadow-sm"
            />
            <label htmlFor="imageUpload" className="absolute bottom-0 right-0 bg-blue-900 text-white p-2 rounded-full cursor-pointer">
              <img src="/assets/upload.png" className="w-5 h-5" />
            </label>
            <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleProfileSubmit}>
          {/* NAME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 text-sm mb-1">First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 rounded-xl border" />
            </div>
            <div>
              <label className="block text-slate-600 text-sm mb-1">Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 rounded-xl border" />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-slate-600 text-sm mb-1">Email</label>
            <input type="email" value={userEmail} disabled className="w-full px-4 py-2 rounded-xl border bg-slate-100" />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-slate-600 text-sm mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={handleDobChange} className="w-full px-4 py-2 rounded-xl border" />
            {dobError && <p className="text-red-600 text-sm mt-2">{dobError}</p>}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-slate-600 text-sm mb-1">Contact Number</label>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <select
                value={selectedCountry.code}
                onChange={e => {
                  const c = countryData.find(x => x.code === e.target.value);
                  setSelectedCountry(c);
                  setPhone("");
                  setPhoneError("");
                }}
                className="px-3 py-2 bg-slate-50 text-sm border-r outline-none min-w-[160px]"
              >
                {countryData.map(c => <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>)}
              </select>
              <input type="tel" value={phone} onChange={handlePhoneChange} placeholder="Enter phone number" className="flex-1 px-4 py-2 outline-none" />
            </div>
            {phoneError && <p className="text-red-600 text-sm mt-2">{phoneError}</p>}
          </div>

          {/* RESIDENCE COUNTRY */}
          <div className="relative">
            <label className="block text-slate-600 text-sm mb-1">Country of Residence</label>
            <input
              placeholder="Search or select"
              value={searchResidence}
              onFocus={() => setShowResidenceDropdown(true)}
              onChange={e => setSearchResidence(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border"
            />
            {showResidenceDropdown && (
              <ul className="absolute bg-white shadow-lg w-full border rounded-xl max-h-40 overflow-y-auto">
                {filteredResidenceCountries.map((c, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      setSelectedResidenceCountry(c);
                      setSearchResidence(c.name);
                      setShowResidenceDropdown(false);
                    }}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="w-full bg-blue-900 text-white py-3 rounded-xl">Save Changes</button>
        </form>
      </div>

      {/* CROPPER */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">Adjust Your Photo</h3>
            <div className="relative w-full h-64 bg-gray-200">
              <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={e => setZoom(e.target.value)} className="w-full mt-4" />
            <div className="flex justify-between mt-5">
              <button onClick={() => setShowCropper(false)} className="border px-5 py-2 rounded-xl">Cancel</button>
              <button onClick={handleCropSave} className="bg-blue-900 text-white px-5 py-2 rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
