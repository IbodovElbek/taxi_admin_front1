'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

const supportTickets = [
  {
    id: 'T001',
    user: 'Ahmad Karimov',
    userType: 'rider',
    subject: 'Haydovchi kech keldi',
    priority: 'medium',
    status: 'open',
    category: 'service_quality',
    description: 'Haydovchi belgilangan vaqtdan 15 daqiqa kech kelgan. Iltimos tekshirib ko\'ring.',
    createdAt: '2024-01-15 10:30',
    lastReply: '2024-01-15 11:45',
    assignedTo: 'Support Agent 1'
  },
  {
    id: 'T002',
    user: 'Jasur Toshev',
    userType: 'driver',
    subject: 'To\'lov muammosi',
    priority: 'high',
    status: 'in_progress',
    category: 'payment',
    description: 'Bugungi sayohatlarimning to\'lovi hisobimga o\'tmagan. Yordam bering.',
    createdAt: '2024-01-15 09:15',
    lastReply: '2024-01-15 14:20',
    assignedTo: 'Support Agent 2'
  },
  {
    id: 'T003',
    user: 'Malika Saidova',
    userType: 'rider',
    subject: 'Yo\'qolgan buyum',
    priority: 'low',
    status: 'resolved',
    category: 'lost_item',
    description: 'Mashinada telefon qoldirgan edim. Haydovchi bilan bog\'lanishga yordam bering.',
    createdAt: '2024-01-14 16:30',
    lastReply: '2024-01-15 08:15',
    assignedTo: 'Support Agent 1'
  },
  {
    id: 'T004',
    user: 'Bobur Rahmonov',
    userType: 'driver',
    subject: 'Ilovada xatolik',
    priority: 'high',
    status: 'open',
    category: 'technical',
    description: 'Ilova tez-tez o\'chib qolmoqda. Yangi sayohat so\'rovlarini ko\'ra olmayapman.',
    createdAt: '2024-01-15 08:45',
    lastReply: null,
    assignedTo: null
  }
];

const faqItems = [
  {
    id: 1,
    question: 'Qanday qilib haydovchi bo\'lib ro\'yxatdan o\'taman?',
    answer: 'Haydovchi bo\'lish uchun ilovani yuklab oling, ro\'yxatdan o\'ting va barcha kerakli hujjatlarni yuklang. Bizning jamoamiz sizning arizangizni ko\'rib chiqadi.',
    category: 'driver_registration',
    views: 1250
  },
  {
    id: 2,
    question: 'To\'lov qanday amalga oshiriladi?',
    answer: 'Siz naqd pul, bank kartasi yoki ilovadagi hamyon orqali to\'lov qilishingiz mumkin. To\'lov avtomatik tarzda hisoblanadi.',
    category: 'payment',
    views: 980
  },
  {
    id: 3,
    question: 'Sayohatni qanday bekor qilaman?',
    answer: 'Sayohatni bekor qilish uchun ilovadagi "Bekor qilish" tugmasini bosing. Bekor qilish shartlari qoidalar bo\'limida ko\'rsatilgan.',
    category: 'booking',
    views: 750
  },
  {
    id: 4,
    question: 'Yo\'qolgan buyumni qanday topaman?',
    answer: 'Agar biror narsangizni mashinada qoldirgan bo\'lsangiz, qo\'llab-quvvatlash xizmatiga murojaat qiling. Biz haydovchi bilan bog\'lanishga yordam beramiz.',
    category: 'lost_item',
    views: 425
  }
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState(supportTickets);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showCreateFaq, setShowCreateFaq] = useState(false);

  const filteredTickets = tickets.filter(ticket => {
    return filterStatus === 'all' || ticket.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-red-100 text-red-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    
    const labels = {
      open: 'Ochiq',
      in_progress: 'Jarayonda',
      resolved: 'Hal qilingan',
      closed: 'Yopilgan'
    };
    
    return { 
      style: styles[status as keyof typeof styles] || styles.open,
      label: labels[status as keyof typeof labels] || status
    };
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    
    const labels = {
      high: 'Yuqori',
      medium: 'O\'rta',
      low: 'Past'
    };
    
    return { 
      style: styles[priority as keyof typeof styles] || styles.medium,
      label: labels[priority as keyof typeof labels] || priority
    };
  };

  const handleTicketAction = (ticketId: string, action: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? {...ticket, status: action} : ticket
    ));
    if (showTicketDetails) {
      setShowTicketDetails(false);
    }
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleCreateFaq = (faqData: any) => {
    setShowCreateFaq(false);
    alert(`FAQ yaratildi: ${faqData.question}`);
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Qo'llab-quvvatlash Markazi</h1>
                <p className="text-gray-600">Foydalanuvchi murojaatlari va ko'mak markazini boshqaring</p>
              </div>
              <button 
                onClick={() => setShowCreateFaq(true)}
                className="bg-[#1E2A38] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-question-line"></i>
                </div>
                FAQ Qo'shish
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-error-warning-line text-red-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'open').length}</p>
                    <p className="text-sm text-gray-600">Ochiq Murojaatlar</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-time-line text-yellow-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'in_progress').length}</p>
                    <p className="text-sm text-gray-600">Jarayonda</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'resolved').length}</p>
                    <p className="text-sm text-gray-600">Hal qilingan</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-question-line text-blue-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{faqItems.length}</p>
                    <p className="text-sm text-gray-600">FAQ Maqolalar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-6 py-4 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === 'tickets'
                      ? 'border-b-2 border-[#1E2A38] text-[#1E2A38]'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Support Murojaatlari
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-6 py-4 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === 'faq'
                      ? 'border-b-2 border-[#1E2A38] text-[#1E2A38]'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  FAQ Boshqaruvi
                </button>
              </div>

              {activeTab === 'tickets' && (
                <div>
                  {/* Filters */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {['all', 'open', 'in_progress', 'resolved'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                            filterStatus === status
                              ? 'bg-[#1E2A38] text-white'
                              : 'bg-[#F4F6F8] text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status === 'all' ? 'Barchasi' : 
                           status === 'open' ? 'Ochiq' :
                           status === 'in_progress' ? 'Jarayonda' : 'Hal qilingan'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tickets List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => {
                        const statusBadge = getStatusBadge(ticket.status);
                        const priorityBadge = getPriorityBadge(ticket.priority);
                        
                        return (
                          <div key={ticket.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => handleViewTicket(ticket)}>
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-800">{ticket.subject}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.style}`}>
                                    {statusBadge.label}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityBadge.style}`}>
                                    {priorityBadge.label}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>#{ticket.id}</span>
                                  <span>•</span>
                                  <span>{ticket.user} ({ticket.userType === 'rider' ? 'Yo\'lovchi' : 'Haydovchi'})</span>
                                  <span>•</span>
                                  <span>Yaratilgan: {ticket.createdAt}</span>
                                  {ticket.assignedTo && (
                                    <>
                                      <span>•</span>
                                      <span>Mas\'ul: {ticket.assignedTo}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTicketAction(ticket.id, 'in_progress');
                                  }}
                                  className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors text-sm whitespace-nowrap"
                                >
                                  Jarayonga o'tkazish
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTicketAction(ticket.id, 'resolved');
                                  }}
                                  className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm whitespace-nowrap"
                                >
                                  Hal qilish
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="p-6">
                  <div className="space-y-4">
                    {faqItems.map((faq) => (
                      <div key={faq.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                            <p className="text-gray-600 mb-3">{faq.answer}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {faq.category === 'driver_registration' ? 'Haydovchi Ro\'yxati' :
                                 faq.category === 'payment' ? 'To\'lov' :
                                 faq.category === 'booking' ? 'Bron qilish' : 'Yo\'qolgan Buyum'}
                              </span>
                              <span>{faq.views} marta ko'rilgan</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-[#F4F6F8] text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
                              Tahrirlash
                            </button>
                            <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm whitespace-nowrap">
                              O'chirish
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Murojaat Tafsilotlari</h3>
              <button 
                onClick={() => setShowTicketDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-close-line text-gray-500"></i>
                </div>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Muammo ta\'rifi</h4>
                    <p className="text-gray-600">{(selectedTicket as any).description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Javoblar</h4>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-blue-800">Support Agent</span>
                          <span className="text-xs text-blue-600">2024-01-15 11:45</span>
                        </div>
                        <p className="text-blue-700">Assalomu alaykum! Sizning murojaatingizni ko\'rib chiqdik. Haydovchi bilan bog\'landik va bu masala hal qilindi. Agar yana muammo bo\'lsa, bizga murojaat qiling.</p>
                      </div>
                      
                      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-800">{(selectedTicket as any).user}</span>
                          <span className="text-xs text-gray-600">2024-01-15 12:30</span>
                        </div>
                        <p className="text-gray-700">Rahmat, muammo hal qilindi. Xizmatlaringizdan mamnunman!</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Javob yozish</h4>
                    <div className="space-y-3">
                      <textarea 
                        placeholder="Foydalanuvchiga javobingizni yozing..."
                        className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-3">
                        <button className="bg-[#1E2A38] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap">
                          Javob Yuborish
                        </button>
                        <button 
                          onClick={() => handleTicketAction((selectedTicket as any).id, 'resolved')}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                        >
                          Hal Qilingan Deb Belgilash
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Murojaat Ma\'lumotlari</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Murojaat ID:</span>
                        <p className="font-medium">{(selectedTicket as any).id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Foydalanuvchi:</span>
                        <p className="font-medium">{(selectedTicket as any).user}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Foydalanuvchi turi:</span>
                        <p className="font-medium">{(selectedTicket as any).userType === 'rider' ? 'Yo\'lovchi' : 'Haydovchi'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Kategoriya:</span>
                        <p className="font-medium">
                          {(selectedTicket as any).category === 'service_quality' ? 'Xizmat Sifati' :
                           (selectedTicket as any).category === 'payment' ? 'To\'lov' :
                           (selectedTicket as any).category === 'lost_item' ? 'Yo\'qolgan Buyum' : 'Texnik'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Yaratilgan:</span>
                        <p className="font-medium">{(selectedTicket as any).createdAt}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Oxirgi javob:</span>
                        <p className="font-medium">{(selectedTicket as any).lastReply || 'Javob yo\'q'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Mas\'ul:</span>
                        <p className="font-medium">{(selectedTicket as any).assignedTo || 'Tayinlanmagan'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-yellow-100 text-yellow-600 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm whitespace-nowrap">
                      Jarayonga O'tkazish
                    </button>
                    <button className="w-full bg-green-100 text-green-600 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm whitespace-nowrap">
                      Hal Qilingan
                    </button>
                    <button className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
                      Yopish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create FAQ Modal */}
      {showCreateFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Yangi FAQ Qo'shish</h3>
              <button 
                onClick={() => setShowCreateFaq(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-close-line text-gray-500"></i>
                </div>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const faqData = {
                question: formData.get('question'),
                answer: formData.get('answer'),
                category: formData.get('category')
              };
              handleCreateFaq(faqData);
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Savol</label>
                  <input 
                    type="text" 
                    name="question"
                    required
                    placeholder="Tez-tez beriladigan savol"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya</label>
                  <select 
                    name="category"
                    className="w-full p-3 border border-gray-300 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="driver_registration">Haydovchi Ro'yxati</option>
                    <option value="payment">To'lov</option>
                    <option value="booking">Bron qilish</option>
                    <option value="lost_item">Yo'qolgan Buyum</option>
                    <option value="technical">Texnik</option>
                    <option value="general">Umumiy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Javob</label>
                  <textarea 
                    name="answer"
                    required
                    placeholder="Savolga batafsil javob"
                    className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button 
                  type="submit"
                  className="flex-1 bg-[#1E2A38] text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                >
                  FAQ Qo'shish
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateFaq(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}