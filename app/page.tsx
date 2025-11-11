'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  LogIn,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Clock,
  Shield,
  Star,
  Phone,
  Mail,
  ChevronRight,
  Menu,
  X,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Professional",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
    text: "Excellent service! Always on time and professional drivers. My go-to choice for airport transfers.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Tourist",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
    text: "Best taxi service in town. Clean cars, friendly drivers, and very affordable rates. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Regular Customer",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
    text: "I use TaxiGo daily for work. They're reliable, safe, and the booking process is so easy!",
    rating: 5,
  },
];

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleBooking = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!pickupLocation || !dropoffLocation) {
      alert('Please fill in pickup and dropoff locations');
      return;
    }
    alert(`Booking confirmed!\nPickup: ${pickupLocation}\nDropoff: ${dropoffLocation}\nDate: ${dateTime}\nPassengers: ${passengers}`);
  };

  const handleContactSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    alert(`Thank you ${formData.name}! Your message has been sent successfully.`);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleLogin = () => {
    router.push("/dashboard");
  };
  

  const handleDeleteAccount = () => {
   router.push("/delete-account");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
            
              <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Pacifico, cursive' }}>
                TaxiGo
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-md font-semibold text-gray-900 hover:text-yellow-500 transition-colors">
                Home
              </a>
              <a href="#advantages" className="text-md font-medium text-gray-600 hover:text-yellow-500 transition-colors">
                Our Advantages
              </a>
              <a href="#testimonials" className="text-md font-medium text-gray-600 hover:text-yellow-500 transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-md font-medium text-gray-600 hover:text-yellow-500 transition-colors">
                Contact
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-900 hover:text-yellow-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg">
                Home
              </a>
              <a href="#advantages" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                Our Advantages
              </a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                Testimonials
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                Contact
              </a>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <button onClick={handleLogin} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg">
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button onClick={handleDeleteAccount} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 h-[800px] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Taxi Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative z-10 max-w-7xl h-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <p className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-4">
                Welcome to TaxiGo
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                BOOK <span className="text-yellow-500">TAXI</span> FOR YOUR RIDE
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                Enjoy seamless, reliable transportation wherever you go. Experience convenience like never before.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="px-8 py-4 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2">
                  Book Now
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a href="#advantages" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="lg:ml-auto w-full max-w-lg">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Book Your Ride
                </h2>

                <form onSubmit={handleBooking} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Pick Up Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Enter pickup location"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Drop Off Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500" />
                      <input
                        type="text"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        placeholder="Enter dropoff location"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Date & Time
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500 pointer-events-none" />
                        <input
                          type="datetime-local"
                          value={dateTime}
                          onChange={(e) => setDateTime(e.target.value)}
                          className="w-full pl-10 pr-3 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Passengers
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500 pointer-events-none" />
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={passengers}
                          onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                          className="w-full pl-10 pr-3 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-all hover:shadow-xl hover:scale-[1.02] mt-2"
                  >
                    Book Taxi Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="advantages" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the best taxi service with our professional drivers and modern fleet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 cursor-pointer">
            {[
              {
                icon: Clock,
                title: "24/7 Service",
                description: "Available anytime, day or night",
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                description: "Verified drivers and secure payments",
              },
              {
                icon: Star,
                title: "Top Rated",
                description: "Highly rated by thousands of customers",
              },
              {
                icon: Car,
                title: "Modern Fleet",
                description: "Clean and comfortable vehicles",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-yellow-500 hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 relative overflow-hidden min-h-[400px] flex items-center">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 p-8 sm:p-12 transition-all duration-500 ${
                    index === currentSlide 
                      ? 'opacity-100 translate-x-0' 
                      : index < currentSlide 
                        ? 'opacity-0 -translate-x-full' 
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover mb-6 border-4 border-yellow-500"
                    />
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-xl text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white hover:bg-yellow-500 text-gray-900 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white hover:bg-yellow-500 text-gray-900 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-yellow-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Write your message here..."
                    rows={4}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors text-gray-900 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-all hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 text-yellow ">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <p className="text-yellow/90">+998 (99) 940-07-78</p>
                      {/* <p className="text-yellow/90">+1 (555) 987-6543</p> */}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <p className="text-yellow/90">macibodovelbek@gmail.com</p>
                      {/* <p className="text-yellow/90">support@taxigo.com</p> */}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Address</p>
                      <p className="text-yellow/90">Uzbekistan</p>
                      {/* <p className="text-yellow/90">City Center, Country 12345</p> */}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Working Hours</p>
                      <p className="text-yellow/90">24/7 Available</p>
                      <p className="text-yellow/90">Every day of the week</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Response</h3>
                <p className="text-gray-600 mb-4">
                  Our customer support team is available 24/7 to assist you with any questions or concerns.
                </p>
                <p className="text-sm text-gray-500">
                  Average response time: <span className="font-semibold text-yellow-500">Under 2 hours</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
              
                <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Pacifico, cursive' }}>
                  TaxiGo
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Your trusted partner for safe and comfortable rides. Available 24/7 across the city.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#advantages" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                    Our Advantages
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Phone className="w-4 h-4 text-yellow-500" />
                  <span>+998 (99) 940-07-78</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Mail className="w-4 h-4 text-yellow-500" />
                  <span>macibodovelbek@gmail.com</span>
                </li>
                {/* <li className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-yellow-500 mt-1" />
                  <span>123 Main Street, City Center</span>
                </li> */}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} TaxiGo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}