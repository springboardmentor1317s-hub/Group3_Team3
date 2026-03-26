/**
 * SEED SCRIPT — Group3_Team3 Event Management System
 * 
 * HOW TO RUN:
 *   1. Make sure your MongoDB is running and .env has MONGO_URI set
 *   2. Run:  node seed.js
 *
 * This script will DROP existing data and insert fresh sample data.
 * Collections seeded: users, events, registrations, feedbacks, comments, notifications
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// ─── Connect ──────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/event_management";

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB:", MONGO_URI);

// ─── Inline schemas (mirrors your models exactly) ─────────────────────────────

// We insert raw documents using insertMany so no need to re-import models.
// Just use db collections directly for speed.

const db = mongoose.connection.db;

// ─── Helper ───────────────────────────────────────────────────────────────────
const id = () => new mongoose.Types.ObjectId();
const hashPassword = async (pw) => bcrypt.hash(pw, 10);
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// ─── Clear existing data ──────────────────────────────────────────────────────
console.log("\n🗑️  Clearing existing data...");
await db.collection("users").deleteMany({});
await db.collection("events").deleteMany({});
await db.collection("registrations").deleteMany({});
await db.collection("feedbacks").deleteMany({});
await db.collection("comments").deleteMany({});
await db.collection("notifications").deleteMany({});
await db.collection("admin_logs").deleteMany({});
console.log("✅ Collections cleared");

// ─── 1. USERS ─────────────────────────────────────────────────────────────────
console.log("\n👤 Seeding users...");

const superAdminId   = id();
const collegeAdmin1Id = id();
const collegeAdmin2Id = id();
const student1Id     = id();
const student2Id     = id();
const student3Id     = id();
const student4Id     = id();
const student5Id     = id();

const now = new Date();

const users = [
  {
    _id: superAdminId,
    name: "Super Admin",
    email: "superadmin@eventapp.com",
    password: await hashPassword("Admin@123"),
    college: "Platform HQ",
    role: "super_admin",
    isActive: true,
    lastLogin: now,
    phone: "9000000001",
    bio: "Platform super administrator",
    department: "Administration",
    year: null,
    interests: ["management", "technology"],
    socialLinks: { linkedin: null, github: null, twitter: null },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: false, push: true },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(60),
    updatedAt: now,
  },
  {
    _id: collegeAdmin1Id,
    name: "Dr. Priya Sharma",
    email: "admin@iitbhopal.ac.in",
    password: await hashPassword("Admin@123"),
    college: "IIT Bhopal",
    role: "college_admin",
    isActive: true,
    lastLogin: daysAgo(1),
    phone: "9000000002",
    bio: "Event coordinator at IIT Bhopal",
    department: "Computer Science",
    year: null,
    interests: ["hackathons", "workshops", "technical events"],
    socialLinks: { linkedin: "https://linkedin.com/in/priyasharma", github: null, twitter: null },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: true, push: true },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(50),
    updatedAt: now,
  },
  {
    _id: collegeAdmin2Id,
    name: "Prof. Rajesh Verma",
    email: "admin@nitraipur.ac.in",
    password: await hashPassword("Admin@123"),
    college: "NIT Raipur",
    role: "college_admin",
    isActive: true,
    lastLogin: daysAgo(2),
    phone: "9000000003",
    bio: "Cultural fest organizer at NIT Raipur",
    department: "Mechanical Engineering",
    year: null,
    interests: ["cultural events", "sports", "seminars"],
    socialLinks: { linkedin: null, github: null, twitter: null },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: false, push: true },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(45),
    updatedAt: now,
  },
  {
    _id: student1Id,
    name: "Aarav Patel",
    email: "aarav.patel@student.iitbhopal.ac.in",
    password: await hashPassword("Student@123"),
    college: "IIT Bhopal",
    role: "student",
    isActive: true,
    lastLogin: daysAgo(1),
    phone: "9111111111",
    bio: "Third year CSE student passionate about AI and open source",
    department: "Computer Science",
    year: 3,
    interests: ["AI", "open source", "hackathons"],
    socialLinks: { linkedin: "https://linkedin.com/in/aaravpatel", github: "https://github.com/aaravpatel", twitter: null },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: false, push: true },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(30),
    updatedAt: now,
  },
  {
    _id: student2Id,
    name: "Sneha Joshi",
    email: "sneha.joshi@student.iitbhopal.ac.in",
    password: await hashPassword("Student@123"),
    college: "IIT Bhopal",
    role: "student",
    isActive: true,
    lastLogin: daysAgo(2),
    phone: "9222222222",
    bio: "Second year student, loves dancing and coding",
    department: "Electronics",
    year: 2,
    interests: ["dance", "robotics", "workshops"],
    socialLinks: { linkedin: null, github: null, twitter: "@snehajoshi" },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: false, push: true },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(28),
    updatedAt: now,
  },
  {
    _id: student3Id,
    name: "Rohan Mehta",
    email: "rohan.mehta@student.nitraipur.ac.in",
    password: await hashPassword("Student@123"),
    college: "NIT Raipur",
    role: "student",
    isActive: true,
    lastLogin: daysAgo(3),
    phone: "9333333333",
    bio: "Final year student, football captain",
    department: "Civil Engineering",
    year: 4,
    interests: ["sports", "football", "leadership"],
    socialLinks: { linkedin: "https://linkedin.com/in/rohanmehta", github: null, twitter: null },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: true, push: true },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(25),
    updatedAt: now,
  },
  {
    _id: student4Id,
    name: "Divya Rao",
    email: "divya.rao@student.nitraipur.ac.in",
    password: await hashPassword("Student@123"),
    college: "NIT Raipur",
    role: "student",
    isActive: true,
    lastLogin: daysAgo(1),
    phone: "9444444444",
    bio: "First year student eager to explore everything!",
    department: "Information Technology",
    year: 1,
    interests: ["cultural events", "photography", "music"],
    socialLinks: { linkedin: null, github: null, twitter: null },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: false, push: false },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(20),
    updatedAt: now,
  },
  {
    _id: student5Id,
    name: "Karan Singh",
    email: "karan.singh@student.iitbhopal.ac.in",
    password: await hashPassword("Student@123"),
    college: "IIT Bhopal",
    role: "student",
    isActive: true,
    lastLogin: daysAgo(5),
    phone: "9555555555",
    bio: "Machine learning enthusiast, loves hackathons",
    department: "Computer Science",
    year: 4,
    interests: ["ML", "data science", "hackathons"],
    socialLinks: { linkedin: "https://linkedin.com/in/karansingh", github: "https://github.com/karansingh", twitter: null },
    registeredEvents: [],
    attendedEvents: [],
    certificates: [],
    notificationPreferences: { email: true, sms: false, push: true },
    emailVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpire: null,
    createdAt: daysAgo(22),
    updatedAt: now,
  },
];

await db.collection("users").insertMany(users);
console.log(`✅ Inserted ${users.length} users`);

// ─── 2. EVENTS ────────────────────────────────────────────────────────────────
console.log("\n📅 Seeding events...");

const event1Id = id(); // Hackathon — upcoming (IIT Bhopal)
const event2Id = id(); // Cultural Fest — upcoming (NIT Raipur)
const event3Id = id(); // Workshop — completed (IIT Bhopal)
const event4Id = id(); // Sports Meet — upcoming (NIT Raipur)
const event5Id = id(); // Seminar — upcoming (IIT Bhopal)

const events = [
  {
    _id: event1Id,
    title: "HackFest 2026 — 24-Hour Hackathon",
    description: "The biggest hackathon of the year! Build innovative solutions for real-world problems in 24 hours. Open to all engineering students. Prizes worth ₹1,50,000 to be won!",
    category: "hackathon",
    college_id: collegeAdmin1Id,
    organizer: "IIT Bhopal Tech Club",
    location: "IIT Bhopal",
    venue: "Main Auditorium & Labs",
    start_date: daysFromNow(15),
    end_date: daysFromNow(16),
    registration_start: daysAgo(5),
    registration_end: daysFromNow(10),
    max_participants: 200,
    current_participants: 87,
    registration_fee: 0,
    event_type: "offline",
    status: "published",
    image_url: null,
    tags: ["hackathon", "coding", "innovation", "prizes"],
    requirements: "Laptop, charger, and enthusiasm! Teams of 2-4.",
    prizes: [
      { position: "1st", prize: "Cash + Internship Offer", amount: 75000 },
      { position: "2nd", prize: "Cash", amount: 50000 },
      { position: "3rd", prize: "Cash", amount: 25000 },
    ],
    schedule: [
      { time: "09:00 AM", activity: "Registration & Check-in", description: "Collect kits and set up" },
      { time: "10:00 AM", activity: "Problem Statement Release", description: "Themes announced" },
      { time: "10:00 AM (Next Day)", activity: "Final Submission", description: "Submit your projects" },
      { time: "12:00 PM", activity: "Results & Prize Distribution", description: "Award ceremony" },
    ],
    contact: { email: "hackfest@iitbhopal.ac.in", phone: "9000000002", website: null },
    social_links: { facebook: null, instagram: "@hackfest_iitb", twitter: null, linkedin: null },
    rules_and_regulations: "No plagiarism. Teams must present their own work. Judges' decision is final.",
    eligibility: "Open to all engineering students",
    certificates: true,
    certificate_template: null,
    is_featured: true,
    views: 432,
    likes: 78,
    rating: { average: 0, count: 0 },
    created_at: daysAgo(10),
    updated_at: daysAgo(2),
    createdAt: daysAgo(10),
    updatedAt: daysAgo(2),
  },
  {
    _id: event2Id,
    title: "Rangmanch — Annual Cultural Fest",
    description: "NIT Raipur's flagship cultural festival! Three days of music, dance, drama, and art. Celebrate the spirit of creativity and culture with students from across India.",
    category: "cultural",
    college_id: collegeAdmin2Id,
    organizer: "NIT Raipur Cultural Committee",
    location: "NIT Raipur",
    venue: "Open Air Theatre & Cultural Hall",
    start_date: daysFromNow(20),
    end_date: daysFromNow(22),
    registration_start: daysAgo(3),
    registration_end: daysFromNow(18),
    max_participants: 500,
    current_participants: 143,
    registration_fee: 50,
    event_type: "offline",
    status: "published",
    image_url: null,
    tags: ["cultural", "dance", "music", "drama", "arts"],
    requirements: "Register for individual events separately on-site.",
    prizes: [
      { position: "Best Performer", prize: "Trophy + Cash", amount: 10000 },
      { position: "Runner Up", prize: "Trophy + Cash", amount: 5000 },
    ],
    schedule: [
      { time: "Day 1 - 5 PM", activity: "Inauguration & Band Night", description: "Opening ceremony" },
      { time: "Day 2 - 10 AM", activity: "Solo & Group Dance Competition", description: "Multiple categories" },
      { time: "Day 3 - 6 PM", activity: "Grand Finale & Prize Distribution", description: "Closing ceremony" },
    ],
    contact: { email: "rangmanch@nitraipur.ac.in", phone: "9000000003", website: null },
    social_links: { facebook: null, instagram: "@rangmanch_nitr", twitter: "@rangmanch", linkedin: null },
    rules_and_regulations: "Participants must carry their college ID. Vulgarity will lead to disqualification.",
    eligibility: "Open to all college students",
    certificates: true,
    certificate_template: null,
    is_featured: true,
    views: 891,
    likes: 212,
    rating: { average: 0, count: 0 },
    created_at: daysAgo(7),
    updated_at: daysAgo(1),
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
  {
    _id: event3Id,
    title: "Web Dev Bootcamp — React & Node.js",
    description: "A 2-day intensive workshop on building full-stack applications with React and Node.js. Hands-on projects, expert mentors, and take-home project kit included.",
    category: "workshop",
    college_id: collegeAdmin1Id,
    organizer: "IIT Bhopal Dev Club",
    location: "IIT Bhopal",
    venue: "CS Department Lab",
    start_date: daysAgo(10),
    end_date: daysAgo(9),
    registration_start: daysAgo(25),
    registration_end: daysAgo(12),
    max_participants: 50,
    current_participants: 50,
    registration_fee: 100,
    event_type: "offline",
    status: "completed",
    image_url: null,
    tags: ["workshop", "react", "nodejs", "fullstack", "webdev"],
    requirements: "Basic knowledge of HTML, CSS, and JavaScript. Bring your laptop.",
    prizes: [],
    schedule: [
      { time: "Day 1 - 9 AM", activity: "React Fundamentals", description: "Components, hooks, state management" },
      { time: "Day 1 - 2 PM", activity: "Building a React App", description: "Hands-on project" },
      { time: "Day 2 - 9 AM", activity: "Node.js & Express Backend", description: "REST APIs and MongoDB" },
      { time: "Day 2 - 3 PM", activity: "Full-Stack Integration & Deployment", description: "Connect frontend & backend" },
    ],
    contact: { email: "devclub@iitbhopal.ac.in", phone: "9000000002", website: null },
    social_links: { facebook: null, instagram: null, twitter: null, linkedin: null },
    rules_and_regulations: "Attendance mandatory for certificate. No refunds.",
    eligibility: "Open to all college students with basic HTML/CSS knowledge",
    certificates: true,
    certificate_template: null,
    is_featured: false,
    views: 275,
    likes: 63,
    rating: { average: 4.6, count: 42 },
    created_at: daysAgo(30),
    updated_at: daysAgo(9),
    createdAt: daysAgo(30),
    updatedAt: daysAgo(9),
  },
  {
    _id: event4Id,
    title: "Techno Sports Meet 2026",
    description: "Annual inter-college sports competition featuring football, basketball, cricket, badminton, and chess. Compete with the best athletes from colleges across Chhattisgarh!",
    category: "sports",
    college_id: collegeAdmin2Id,
    organizer: "NIT Raipur Sports Committee",
    location: "NIT Raipur",
    venue: "Sports Complex",
    start_date: daysFromNow(30),
    end_date: daysFromNow(32),
    registration_start: now,
    registration_end: daysFromNow(25),
    max_participants: 300,
    current_participants: 45,
    registration_fee: 200,
    event_type: "offline",
    status: "published",
    image_url: null,
    tags: ["sports", "football", "basketball", "cricket", "badminton"],
    requirements: "Team registration required for team sports. Individual registration for individual events.",
    prizes: [
      { position: "Football Champion", prize: "Trophy + Cash", amount: 15000 },
      { position: "Basketball Champion", prize: "Trophy + Cash", amount: 10000 },
      { position: "Cricket Champion", prize: "Trophy + Cash", amount: 20000 },
    ],
    schedule: [
      { time: "Day 1", activity: "Football & Basketball", description: "Group stage matches" },
      { time: "Day 2", activity: "Cricket & Badminton", description: "Knockout rounds" },
      { time: "Day 3", activity: "Finals & Prize Distribution", description: "All sport finals" },
    ],
    contact: { email: "sports@nitraipur.ac.in", phone: "9000000003", website: null },
    social_links: { facebook: null, instagram: "@nitr_sports", twitter: null, linkedin: null },
    rules_and_regulations: "College ID mandatory. Fair play rules apply. Referee decision is final.",
    eligibility: "Open to all college students",
    certificates: true,
    certificate_template: null,
    is_featured: false,
    views: 167,
    likes: 38,
    rating: { average: 0, count: 0 },
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    _id: event5Id,
    title: "AI & Machine Learning Seminar",
    description: "Industry experts from Google, Microsoft and startups will speak on the latest trends in AI, LLMs, and career opportunities in ML. Q&A session included.",
    category: "seminar",
    college_id: collegeAdmin1Id,
    organizer: "IIT Bhopal AI Research Group",
    location: "IIT Bhopal",
    venue: "Conference Hall, Block A",
    start_date: daysFromNow(7),
    end_date: daysFromNow(7),
    registration_start: daysAgo(3),
    registration_end: daysFromNow(5),
    max_participants: 150,
    current_participants: 99,
    registration_fee: 0,
    event_type: "hybrid",
    status: "published",
    image_url: null,
    tags: ["AI", "machine learning", "seminar", "career", "LLM"],
    requirements: "Register online to get the virtual meeting link.",
    prizes: [],
    schedule: [
      { time: "10:00 AM", activity: "Keynote: Future of AI", description: "By Google AI Research" },
      { time: "11:30 AM", activity: "Panel Discussion", description: "AI in Industry" },
      { time: "01:00 PM", activity: "Lunch Break", description: "" },
      { time: "02:00 PM", activity: "LLM & GenAI Deep Dive", description: "Technical session" },
      { time: "04:00 PM", activity: "Q&A and Networking", description: "" },
    ],
    contact: { email: "aigroup@iitbhopal.ac.in", phone: "9000000002", website: null },
    social_links: { facebook: null, instagram: null, twitter: "@iitb_ai", linkedin: null },
    rules_and_regulations: "Online attendees must have a stable internet connection.",
    eligibility: "Open to all students and professionals",
    certificates: true,
    certificate_template: null,
    is_featured: false,
    views: 524,
    likes: 111,
    rating: { average: 0, count: 0 },
    created_at: daysAgo(8),
    updated_at: daysAgo(1),
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
  },
];

await db.collection("events").insertMany(events);
console.log(`✅ Inserted ${events.length} events`);

// ─── 3. REGISTRATIONS ─────────────────────────────────────────────────────────
console.log("\n📝 Seeding registrations...");

const reg1Id = id();
const reg2Id = id();
const reg3Id = id();
const reg4Id = id();
const reg5Id = id();
const reg6Id = id();
const reg7Id = id();

const registrations = [
  // HackFest registrations
  { _id: reg1Id, event_id: event1Id, user_id: student1Id, status: "approved", timestamp: daysAgo(4), createdAt: daysAgo(4), updatedAt: daysAgo(3) },
  { _id: reg2Id, event_id: event1Id, user_id: student2Id, status: "approved", timestamp: daysAgo(3), createdAt: daysAgo(3), updatedAt: daysAgo(2) },
  { _id: reg3Id, event_id: event1Id, user_id: student5Id, status: "pending",  timestamp: daysAgo(1), createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  // Rangmanch (cultural fest)
  { _id: reg4Id, event_id: event2Id, user_id: student3Id, status: "approved", timestamp: daysAgo(2), createdAt: daysAgo(2), updatedAt: daysAgo(1) },
  { _id: reg5Id, event_id: event2Id, user_id: student4Id, status: "approved", timestamp: daysAgo(2), createdAt: daysAgo(2), updatedAt: daysAgo(1) },
  // Web Dev Bootcamp (completed event)
  { _id: reg6Id, event_id: event3Id, user_id: student1Id, status: "approved", timestamp: daysAgo(22), createdAt: daysAgo(22), updatedAt: daysAgo(20) },
  { _id: reg7Id, event_id: event3Id, user_id: student2Id, status: "approved", timestamp: daysAgo(21), createdAt: daysAgo(21), updatedAt: daysAgo(19) },
  // AI Seminar
  { _id: id(), event_id: event5Id, user_id: student1Id, status: "approved", timestamp: daysAgo(2), createdAt: daysAgo(2), updatedAt: daysAgo(1) },
  { _id: id(), event_id: event5Id, user_id: student5Id, status: "approved", timestamp: daysAgo(1), createdAt: daysAgo(1), updatedAt: daysAgo(1) },
];

await db.collection("registrations").insertMany(registrations);
console.log(`✅ Inserted ${registrations.length} registrations`);

// ─── 4. FEEDBACK (on completed event) ─────────────────────────────────────────
console.log("\n💬 Seeding feedback...");

const feedbacks = [
  {
    _id: id(),
    event: event3Id,
    student: student1Id,
    rating: 5,
    comment: "Absolutely amazing workshop! The hands-on approach really helped me understand React hooks. The mentor was super patient and explained everything clearly. Will definitely attend more events like this!",
    likes: [student2Id],
    dislikes: [],
    replies: [
      {
        _id: id(),
        student: student2Id,
        comment: "Totally agree! The React session was my favourite part too.",
        likes: [],
        dislikes: [],
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
      },
    ],
    createdAt: daysAgo(9),
    updatedAt: daysAgo(8),
  },
  {
    _id: id(),
    event: event3Id,
    student: student2Id,
    rating: 4,
    comment: "Great content and well organised. Would have loved a longer session on deployment. The lab setup was excellent. Looking forward to more such workshops!",
    likes: [student1Id, student5Id],
    dislikes: [],
    replies: [],
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
  },
];

await db.collection("feedbacks").insertMany(feedbacks);
console.log(`✅ Inserted ${feedbacks.length} feedback entries`);

// ─── 5. COMMENTS ──────────────────────────────────────────────────────────────
console.log("\n💭 Seeding comments...");

const comments = [
  {
    _id: id(),
    event: event1Id,
    user: student1Id,
    content: "Super excited for HackFest! Anyone forming teams? I'm looking for 2 more members with backend and ML experience.",
    likes: [student5Id, student2Id],
    replies: [
      {
        _id: id(),
        user: student5Id,
        content: "I'm in! I have strong ML and Python skills. Let's connect!",
        likes: [student1Id],
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3),
      },
      {
        _id: id(),
        user: student2Id,
        content: "Count me in too! I can handle frontend and UI/UX.",
        likes: [],
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
      },
    ],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },
  {
    _id: id(),
    event: event1Id,
    user: student5Id,
    content: "Will there be any practice problem statements shared before the event? Would love to prepare in advance.",
    likes: [student1Id],
    replies: [
      {
        _id: id(),
        user: student2Id,
        content: "Check the official Instagram page, they usually post hints a week before!",
        likes: [student5Id],
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
      },
    ],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    _id: id(),
    event: event2Id,
    user: student4Id,
    content: "So thrilled for Rangmanch! First time attending a cultural fest. Any tips for first-timers?",
    likes: [student3Id],
    replies: [
      {
        _id: id(),
        user: student3Id,
        content: "Reach early on Day 1! The inauguration is always spectacular. Also carry your college ID.",
        likes: [student4Id],
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
      },
    ],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    _id: id(),
    event: event5Id,
    user: student1Id,
    content: "Is this seminar open for students from other colleges too? The topic is super relevant to my final year project!",
    likes: [],
    replies: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

await db.collection("comments").insertMany(comments);
console.log(`✅ Inserted ${comments.length} comments`);

// ─── 6. NOTIFICATIONS ─────────────────────────────────────────────────────────
console.log("\n🔔 Seeding notifications...");

const notifications = [
  // student1 registration approved for hackfest
  {
    _id: id(),
    recipient: student1Id,
    sender: collegeAdmin1Id,
    type: "registration_approved",
    title: "Registration Approved!",
    message: "Your registration for HackFest 2026 has been approved. Get ready to build something amazing!",
    relatedEvent: event1Id,
    relatedRegistration: reg1Id,
    relatedUser: null,
    isRead: true,
    readAt: daysAgo(2),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  // student2 registration approved for hackfest
  {
    _id: id(),
    recipient: student2Id,
    sender: collegeAdmin1Id,
    type: "registration_approved",
    title: "Registration Approved!",
    message: "Your registration for HackFest 2026 has been approved. See you there!",
    relatedEvent: event1Id,
    relatedRegistration: reg2Id,
    relatedUser: null,
    isRead: false,
    readAt: null,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  // student5 — pending approval
  {
    _id: id(),
    recipient: student5Id,
    sender: null,
    type: "event_registration",
    title: "Registration Received",
    message: "Your registration for HackFest 2026 has been received and is pending approval.",
    relatedEvent: event1Id,
    relatedRegistration: reg3Id,
    relatedUser: null,
    isRead: false,
    readAt: null,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  // collegeAdmin1 — new event registration to review
  {
    _id: id(),
    recipient: collegeAdmin1Id,
    sender: student5Id,
    type: "admin_approval_request",
    title: "New Registration Pending",
    message: "Karan Singh has registered for HackFest 2026 and is awaiting your approval.",
    relatedEvent: event1Id,
    relatedRegistration: reg3Id,
    relatedUser: student5Id,
    isRead: false,
    readAt: null,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  // New event created notification for students
  {
    _id: id(),
    recipient: student1Id,
    sender: collegeAdmin1Id,
    type: "event_created",
    title: "New Event: AI & ML Seminar",
    message: "A new seminar on AI & Machine Learning has been announced! Register now — limited seats.",
    relatedEvent: event5Id,
    relatedRegistration: null,
    relatedUser: null,
    isRead: true,
    readAt: daysAgo(6),
    createdAt: daysAgo(8),
    updatedAt: daysAgo(6),
  },
  // Feedback notification for admin
  {
    _id: id(),
    recipient: collegeAdmin1Id,
    sender: student1Id,
    type: "event_feedback",
    title: "New Feedback Received",
    message: "Aarav Patel submitted feedback (⭐ 5/5) for Web Dev Bootcamp.",
    relatedEvent: event3Id,
    relatedRegistration: null,
    relatedUser: student1Id,
    isRead: false,
    readAt: null,
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
  },
];

await db.collection("notifications").insertMany(notifications);
console.log(`✅ Inserted ${notifications.length} notifications`);

// ─── 7. ADMIN LOGS ────────────────────────────────────────────────────────────
console.log("\n📋 Seeding admin logs...");

const adminLogs = [
  {
    _id: id(),
    action: "Approved registration for HackFest 2026",
    user_id: collegeAdmin1Id,
    target_type: "registration",
    target_id: reg1Id,
    details: { student: "Aarav Patel", event: "HackFest 2026" },
    ip_address: "192.168.1.10",
    timestamp: daysAgo(3),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    _id: id(),
    action: "Created event: AI & Machine Learning Seminar",
    user_id: collegeAdmin1Id,
    target_type: "event",
    target_id: event5Id,
    details: { event_title: "AI & Machine Learning Seminar" },
    ip_address: "192.168.1.10",
    timestamp: daysAgo(8),
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
  },
  {
    _id: id(),
    action: "Approved registration for Rangmanch Cultural Fest",
    user_id: collegeAdmin2Id,
    target_type: "registration",
    target_id: reg4Id,
    details: { student: "Rohan Mehta", event: "Rangmanch Cultural Fest" },
    ip_address: "192.168.1.20",
    timestamp: daysAgo(1),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

await db.collection("admin_logs").insertMany(adminLogs);
console.log(`✅ Inserted ${adminLogs.length} admin logs`);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(55));
console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
console.log("=".repeat(55));
console.log("\n📧 LOGIN CREDENTIALS (password same for all):");
console.log("┌─────────────────────────────────────────────────────┐");
console.log("│ ROLE           EMAIL                    PASSWORD    │");
console.log("├─────────────────────────────────────────────────────┤");
console.log("│ Super Admin    superadmin@eventapp.com  Admin@123   │");
console.log("│ College Admin  admin@iitbhopal.ac.in    Admin@123   │");
console.log("│ College Admin  admin@nitraipur.ac.in    Admin@123   │");
console.log("│ Student        aarav.patel@student...   Student@123 │");
console.log("│ Student        sneha.joshi@student...   Student@123 │");
console.log("│ Student        rohan.mehta@student...   Student@123 │");
console.log("│ Student        divya.rao@student...     Student@123 │");
console.log("│ Student        karan.singh@student...   Student@123 │");
console.log("└─────────────────────────────────────────────────────┘");
console.log("\n📦 DATA SUMMARY:");
console.log(`  Users:         ${users.length} (1 super admin, 2 college admins, 5 students)`);
console.log(`  Events:        ${events.length} (2 upcoming featured, 1 completed, 1 sports, 1 seminar)`);
console.log(`  Registrations: ${registrations.length}`);
console.log(`  Feedback:      ${feedbacks.length} (on completed event)`);
console.log(`  Comments:      ${comments.length}`);
console.log(`  Notifications: ${notifications.length}`);
console.log(`  Admin Logs:    ${adminLogs.length}`);

await mongoose.disconnect();
console.log("\n✅ Disconnected. Happy presenting! 🚀\n");