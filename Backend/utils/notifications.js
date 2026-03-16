// ✅ utils/notifications.js
const sendAdminNotification = async (studentId, eventId, type) => {
  // Save to admin notifications collection
  await Notification.create({
    to: 'admin',
    from: studentId,
    type: 'new_registration',
    title: `New Registration Request`,
    message: `Student registered for event. Please approve/reject.`,
    eventId,
    read: false
  });
};

const sendStudentNotification = async (studentId, eventId, status) => {
  const message = status === 'approved' 
    ? 'Your registration approved! 🎉' 
    : 'Your registration rejected. Please contact admin.';
    
  await Notification.create({
    to: studentId,
    type: `registration_${status}`,
    title: status === 'approved' ? 'Registration Approved!' : 'Registration Rejected',
    message,
    eventId,
    read: false
  });
};
