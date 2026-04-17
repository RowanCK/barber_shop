import React, { useState, useEffect } from 'react';

export default function App() {
  // 1. State for barber data
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Track the active tab (defaults to 'barbers')
  const [activeTab, setActiveTab] = useState('barbers'); 

  // 3. Booking form state
  const [selectedBarber, setSelectedBarber] = useState(null); 
  const [formData, setFormData] = useState({ name: '', email: '', appointment_time: '' }); 
  const [bookingSuccess, setBookingSuccess] = useState(false); 

  // 4. Booking history management state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Fetch barbers once when the component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/barbers/')
      .then(response => response.json())
      .then(data => {
        setBarbers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  // Fetch appointment history only when activeTab switches to 'bookings'
  useEffect(() => {
    if (activeTab === 'bookings') {
      setLoadingAppointments(true);
      fetch('http://127.0.0.1:8000/api/appointments/')
        .then(response => response.json())
        .then(data => {
          setAppointments(data);
          setLoadingAppointments(false);
        })
        .catch(error => console.error("Fetch appointments error:", error));
    }
  }, [activeTab]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission with a real POST request
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      barber: selectedBarber.id 
    };

    console.log("準備送出的預約資料：", payload);
    
    fetch('http://127.0.0.1:8000/api/book/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(payload) 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Booking failed with status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Booking successful", data);
      setBookingSuccess(true);
      
      // Add the new appointment to the top of the table immediately after a successful booking
      setAppointments(prev => [data, ...prev]);
      
      // Close the modal and reset the form after two seconds
      setTimeout(() => {
        setSelectedBarber(null); 
        setBookingSuccess(false); 
        setFormData({ name: '', email: '', appointment_time: '' }); 
      }, 2000);
    })
    .catch(error => {
      console.error("Booking failed:", error);
      alert("Booking failed, please check your input or contact customer service.");
    });
  };

  // Helper function: convert a barber ID to a display name for the table
  const getBarberName = (barberId) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? barber.name : 'Unknown Barber';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-12 relative">
      
      {/* 1. Hero Section */}
      <div className="relative h-[200px] w-full bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-sm font-bold tracking-[0.2em] uppercase mb-2 text-gray-300">
            Selected Shop
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
            Empire Barber Studio
          </h1>
          <p className="text-base font-semibold text-gray-200">
            CALGARY, AB
          </p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="px-8 py-6 flex gap-3 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm shadow-sm border transition duration-200 ${
            activeTab === 'overview' ? 'bg-[#1E293B] text-white border-transparent' : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm shadow-sm border transition duration-200 ${
            activeTab === 'services' ? 'bg-[#1E293B] text-white border-transparent' : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Services
        </button>
        <button 
          onClick={() => setActiveTab('barbers')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm shadow-sm border transition duration-200 ${
            activeTab === 'barbers' ? 'bg-[#1E293B] text-white border-transparent' : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Our Barbers
        </button>
        
        {/* Added booking management tab */}
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm shadow-sm border transition duration-200 ${
            activeTab === 'bookings' ? 'bg-[#3B82F6] text-white border-transparent shadow-blue-200' : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          📅 My Bookings
        </button>
      </div>

      {/* 3. Main Content Card */}
      <div className="mx-8 bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 min-h-[400px]">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-[#1E293B] mb-6">About Empire Barber Studio</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <p className="text-gray-600 leading-relaxed">
                Welcome to Empire Barber Studio, Calgary's premier destination for modern grooming and classic barbering. 
                Our mission is to transform the Barber industry by combining traditional techniques with cutting-edge 
                Barber-OS technology to enhance your experience. Relax, have a coffee, and let our professionals take care of you.
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-slate-800 mb-4">Location & Hours</h3>
                <p className="text-gray-600 text-sm mb-2">📍 Calgary, AB T2E 6K9</p>
                <ul className="text-sm text-gray-500 space-y-2 mt-4">
                  <li className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 8:00 PM</span></li>
                  <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 6:00 PM</span></li>
                  <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="animate-fade-in">
             <h2 className="text-3xl font-extrabold text-[#1E293B] mb-2">Our Services</h2>
             <p className="text-gray-500 font-medium mb-8">Premium grooming services tailored for you.</p>
             <div className="space-y-4 max-w-3xl">
                {[
                  { name: "Signature Haircut", price: "$45", desc: "Precision cut, wash, and style." },
                  { name: "Beard Trim & Line Up", price: "$25", desc: "Detailed beard shaping with hot towel finish." },
                  { name: "The Empire Package", price: "$65", desc: "Haircut and beard trim combo." },
                  { name: "Kids Cut (Under 12)", price: "$30", desc: "Classic cuts for the younger gentlemen." }
                ].map((service, index) => (
                  <div key={index} className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{service.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">{service.desc}</p>
                    </div>
                    <div className="font-extrabold text-xl text-[#3B82F6]">{service.price}</div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Barbers Tab */}
        {activeTab === 'barbers' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <p className="text-[#3B82F6] font-bold tracking-[0.15em] uppercase text-xs mb-3">
                  Meet The Team
                </p>
                <h2 className="text-3xl font-extrabold text-[#1E293B]">
                  Professional Barbers
                </h2>
                <p className="text-gray-500 mt-2 font-medium">
                  Browse our available barbers and book your next appointment.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-400 font-bold animate-pulse">
                Loading barbers...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {barbers.length === 0 ? (
                  <p className="text-gray-500 col-span-full">No barbers available at the moment.</p>
                ) : (
                  barbers.map((barber) => (
                    <div key={barber.id} className="border border-gray-200 rounded-3xl overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                      <div className="h-56 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
                        <span className="text-5xl font-bold text-white/20 uppercase">
                          {barber.name.charAt(0)}
                        </span>
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                          {barber.experience} YRS EXP
                        </div>
                      </div>
                      <div className="p-5 text-center bg-white flex flex-col flex-grow">
                        <h3 className="font-extrabold text-lg text-slate-800 mb-1">
                          {barber.name}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium mb-4 flex-grow">
                          {barber.bio || "Professional Barber"}
                        </p>
                        
                        <button 
                          onClick={() => setSelectedBarber(barber)}
                          className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors duration-300"
                        >
                          View profile & book →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Added My Bookings tab */}
        {activeTab === 'bookings' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-[#1E293B] mb-2">Upcoming Appointments</h2>
            <p className="text-gray-500 font-medium mb-8">Manage and view all customer bookings here.</p>

            {loadingAppointments ? (
              <div className="py-10 text-center text-gray-400 font-bold animate-pulse">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No appointments booked yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="py-4 px-4 text-slate-400 font-bold text-sm uppercase tracking-wider">Customer</th>
                      <th className="py-4 px-4 text-slate-400 font-bold text-sm uppercase tracking-wider">Email</th>
                      <th className="py-4 px-4 text-slate-400 font-bold text-sm uppercase tracking-wider">Date & Time</th>
                      <th className="py-4 px-4 text-slate-400 font-bold text-sm uppercase tracking-wider">Barber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="py-4 px-4 font-bold text-slate-800">{apt.name}</td>
                        <td className="py-4 px-4 text-gray-500 text-sm">{apt.email}</td>
                        <td className="py-4 px-4 text-blue-600 font-semibold text-sm">
                          {new Date(apt.appointment_time).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-medium">
                          <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-700">
                            {getBarberName(apt.barber)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Booking modal */}
      {selectedBarber && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            
            <button 
              onClick={() => setSelectedBarber(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {bookingSuccess ? (
               <div className="text-center py-10">
                 <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                 <h3 className="text-2xl font-extrabold text-slate-800">Booking Confirmed!</h3>
                 <p className="text-gray-500 mt-2">We look forward to seeing you.</p>
               </div>
            ) : (
              <>
                <h3 className="text-2xl font-extrabold text-[#1E293B] mb-2">Book Appointment</h3>
                <p className="text-gray-500 mb-6 font-medium">with <span className="text-blue-600 font-bold">{selectedBarber.name}</span></p>
                
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Date & Time</label>
                    <input required type="datetime-local" name="appointment_time" value={formData.appointment_time} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                  </div>
                  <button type="submit" className="w-full mt-4 bg-[#1E293B] text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition shadow-lg">
                    Confirm Booking
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}