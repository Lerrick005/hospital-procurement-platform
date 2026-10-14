import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Users,
  Hotel,
  CreditCard,
  Calendar,
  Settings,
  Crown,
  Star,
  Shield,
  Zap
} from 'lucide-react';
import { HeroHeader } from '../../components/common/HeroHeader';
import { GoldCard } from '../../components/common/GoldCard';
import toast from 'react-hot-toast';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon?: React.ReactNode;
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'general', label: 'General', icon: Hotel },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'account', label: 'Account', icon: Users },
    { id: 'technical', label: 'Technical', icon: Settings },
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'general',
      question: 'What is BMA ONE Hospitality?',
      answer: 'BMA ONE Hospitality is a comprehensive, enterprise-grade hospitality management platform designed for hotels, resorts, and property managers worldwide. It offers everything from reservations and room management to guest relations and financial reporting.',
      icon: Hotel,
    },
    {
      id: '2',
      category: 'general',
      question: 'How do I get started with BMA ONE?',
      answer: 'To get started, simply create an account, set up your property profile, and begin adding rooms. Our onboarding team is available to help you configure your settings and train your staff.',
      icon: Crown,
    },
    {
      id: '3',
      category: 'bookings',
      question: 'How do I create a new reservation?',
      answer: 'Navigate to the Reservations page and click the "New Reservation" button. Fill in the guest details, select a room, choose dates, and confirm the booking. You can also check availability directly from the calendar view.',
      icon: Calendar,
    },
    {
      id: '4',
      category: 'bookings',
      question: 'How do I manage check-ins and check-outs?',
      answer: 'From the Reservations page, you can view all upcoming and active reservations. Click on any reservation to open the details drawer, where you can check guests in or out with a single click.',
      icon: Users,
    },
    {
      id: '5',
      category: 'payments',
      question: 'What payment methods are supported?',
      answer: 'BMA ONE supports all major payment methods including Credit Card, Debit Card, Cash, Bank Transfer, and Online payments. You can also set up automated billing for recurring guests.',
      icon: CreditCard,
    },
    {
      id: '6',
      category: 'payments',
      question: 'How do I track revenue and generate invoices?',
      answer: 'Revenue tracking is available in the Payments and Dashboard modules. You can view real-time revenue metrics, generate invoices, and export financial reports for accounting purposes.',
      icon: Shield,
    },
    {
      id: '7',
      category: 'account',
      question: 'How do I manage user roles and permissions?',
      answer: 'Administrators can manage user roles in the Settings page under the Security section. You can assign roles such as Admin, Manager, Receptionist, and Housekeeping with different permission levels.',
      icon: Users,
    },
    {
      id: '8',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking "Forgot Password" on the login page. An email with reset instructions will be sent to your registered email address.',
      icon: Shield,
    },
    {
      id: '9',
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'BMA ONE Hospitality supports all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Google Chrome.',
      icon: Zap,
    },
    {
      id: '10',
      category: 'technical',
      question: 'Is there a mobile app available?',
      answer: 'Yes! BMA ONE Hospitality offers a mobile app for iOS and Android, allowing your staff to manage reservations, check-in guests, and view property status from anywhere.',
      icon: Star,
    },
    {
      id: '11',
      category: 'general',
      question: 'How does the room management feature work?',
      answer: 'The Rooms module allows you to add, edit, and track all your rooms. You can set room types, pricing, amenities, and real-time status (Available, Occupied, Maintenance, etc.)',
      icon: Hotel,
    },
    {
      id: '12',
      category: 'payments',
      question: 'How do I handle cancellations and refunds?',
      answer: 'You can cancel a reservation from the Reservations page by clicking the Cancel button on any confirmed booking. Refunds can be processed from the Payments module.',
      icon: CreditCard,
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSupport = () => {
    toast.success('📧 Support ticket created. We\'ll respond within 24 hours.');
  };

  const handleCallSupport = () => {
    toast.success('📞 Connecting you to support...');
  };

  return (
    <div className="space-y-6">
      <HeroHeader
        title="Help Center"
        subtitle="Find answers to your questions or contact our support team"
        actionLabel="Contact Support"
        onAction={handleContactSupport}
        image="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80"
      />

      {/* Search Bar */}
      <div className="bg-[#20202C] rounded-2xl p-4 border border-[#2D2D3A]">
        <div className="flex items-center gap-3 px-4 py-2 bg-[#12121C] rounded-xl border border-[#2D2D3A]">
          <Search className="h-5 w-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6B7280] w-full"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-[#D4AF37] text-[#0D0D14]'
                  : 'bg-[#20202C] text-[#AAB4C5] hover:bg-[#28283A] border border-[#2D2D3A]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredFAQs.map((item, index) => {
            const isOpen = openItems.includes(item.id);
            const Icon = item.icon || HelpCircle;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-[#20202C] rounded-2xl border border-[#2D2D3A] overflow-hidden hover:border-[#D4AF37]/20 transition-all"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-all hover:bg-[#28283A]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-sm font-medium text-white">{item.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#6B7280] flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-0 text-sm text-[#AAB4C5] border-t border-[#2D2D3A] pt-3">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 text-[#6B7280]">
            <HelpCircle className="h-12 w-12 mx-auto mb-3 text-[#2D2D3A]" />
            <p>No results found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Contact Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <GoldCard className="text-center p-5">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Live Chat</h3>
          <p className="text-xs text-[#6B7280] mt-1">Chat with our support team</p>
          <button 
            onClick={() => toast.success('💬 Live chat started...')}
            className="mt-3 px-4 py-2 bg-[#D4AF37] text-[#0D0D14] rounded-xl text-xs font-medium hover:bg-[#B8962E] transition-all"
          >
            Start Chat
          </button>
        </GoldCard>

        <GoldCard className="text-center p-5">
          <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-3">
            <Phone className="h-6 w-6 text-[#3B82F6]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Phone Support</h3>
          <p className="text-xs text-[#6B7280] mt-1">Call us anytime</p>
          <button 
            onClick={handleCallSupport}
            className="mt-3 px-4 py-2 bg-[#3B82F6] text-white rounded-xl text-xs font-medium hover:bg-[#2563EB] transition-all"
          >
            Call Now
          </button>
        </GoldCard>

        <GoldCard className="text-center p-5">
          <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-3">
            <Mail className="h-6 w-6 text-[#22C55E]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Email Support</h3>
          <p className="text-xs text-[#6B7280] mt-1">We\'ll respond within 24 hours</p>
          <button 
            onClick={handleContactSupport}
            className="mt-3 px-4 py-2 bg-[#22C55E] text-white rounded-xl text-xs font-medium hover:bg-[#16A34A] transition-all"
          >
            Send Email
          </button>
        </GoldCard>
      </div>
    </div>
  );
};

export default FAQ;