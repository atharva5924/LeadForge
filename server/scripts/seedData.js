import connectDB from "../db/index.js";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Lead } from "../models/lead.model.js";
dotenv.config({
  path: "./.env",
});

const companies = [
  "TechCorp Inc",
  "Digital Solutions Ltd",
  "Innovative Systems",
  "Future Technologies",
  "Smart Solutions Inc",
  "Global Tech Partners",
  "NextGen Industries",
  "Advanced Systems Ltd",
  "Creative Digital Agency",
  "Modern Solutions Co",
  "Pioneer Technologies",
  "Dynamic Systems",
  "Elite Software Solutions",
  "Quantum Technologies",
  "Apex Digital Services",
  "Metro Tech Group",
  "Strategic Innovations",
  "Premier Systems Inc",
  "Velocity Digital",
  "Transform Technologies",
  "Synergy Solutions Ltd",
  "Catalyst Technologies",
  "Momentum Digital",
  "Pinnacle Systems",
  "Horizon Tech Group",
  "Evolution Software",
  "Nexus Technologies",
  "Vertex Solutions",
  "Prime Digital Services",
  "Summit Technologies",
  "Oracle Systems Inc",
  "Zenith Digital",
  "Alpha Technologies",
  "Beta Solutions Ltd",
  "Gamma Systems Inc",
  "Delta Innovations",
  "Epsilon Digital",
  "Zeta Technologies",
  "Eta Solutions",
  "Theta Systems",
  "Iota Innovations",
  "Kappa Digital Services",
];

const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Emily",
  "Robert",
  "Jessica",
  "William",
  "Ashley",
  "Richard",
  "Amanda",
  "Joseph",
  "Stephanie",
  "Thomas",
  "Melissa",
  "Christopher",
  "Nicole",
  "Charles",
  "Elizabeth",
  "Daniel",
  "Helen",
  "Matthew",
  "Deborah",
  "Anthony",
  "Rachel",
  "Mark",
  "Carolyn",
  "Donald",
  "Janet",
  "Steven",
  "Catherine",
  "Paul",
  "Frances",
  "Andrew",
  "Patricia",
  "Joshua",
  "Virginia",
  "Kenneth",
  "Maria",
  "Kevin",
  "Heather",
  "Brian",
  "Diane",
  "George",
  "Ruth",
  "Timothy",
  "Julie",
  "Ronald",
  "Joyce",
  "Jason",
  "Victoria",
  "Edward",
  "Kelly",
  "Jeffrey",
  "Christina",
  "Ryan",
  "Joan",
  "Jacob",
  "Evelyn",
  "Gary",
  "Lauren",
  "Nicholas",
  "Judith",
  "Eric",
  "Megan",
  "Jonathan",
  "Cheryl",
  "Stephen",
  "Andrea",
  "Larry",
  "Hannah",
  "Justin",
  "Jacqueline",
  "Scott",
  "Martha",
  "Brandon",
  "Gloria",
  "Benjamin",
  "Teresa",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
  "Stewart",
  "Morris",
  "Morales",
  "Murphy",
  "Cook",
  "Rogers",
  "Gutierrez",
  "Ortiz",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Ramos",
  "Kim",
  "Cox",
  "Ward",
  "Richardson",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
  "Boston",
  "El Paso",
  "Nashville",
  "Detroit",
  "Oklahoma City",
  "Portland",
  "Las Vegas",
  "Memphis",
  "Louisville",
  "Baltimore",
  "Milwaukee",
  "Albuquerque",
  "Tucson",
  "Fresno",
  "Sacramento",
  "Kansas City",
  "Long Beach",
  "Mesa",
  "Atlanta",
  "Colorado Springs",
  "Virginia Beach",
  "Raleigh",
  "Omaha",
  "Miami",
  "Oakland",
  "Minneapolis",
  "Tulsa",
  "Wichita",
  "New Orleans",
  "Arlington",
  "Cleveland",
  "Tampa",
  "Aurora",
  "Honolulu",
  "Anaheim",
  "Santa Ana",
  "St. Louis",
  "Riverside",
  "Corpus Christi",
  "Pittsburgh",
];

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const sources = [
  "website",
  "facebook_ads",
  "google_ads",
  "referral",
  "events",
  "other",
];
const statuses = ["new", "contacted", "qualified", "lost", "won"];

const generatePhoneNumber = () => {
  return `+1-${Math.floor(Math.random() * 900) + 100}-${
    Math.floor(Math.random() * 900) + 100
  }-${Math.floor(Math.random() * 9000) + 1000}`;
};

const generateEmail = (firstName, lastName, company) => {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  return `${emailPrefix}@${domain}`;
};

const generateRandomDate = (daysBack = 90) => {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000
  );
  return pastDate;
};

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected to MongoDB successfully");

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log("Existing data cleared");

    console.log("Creating test user...");

    const testUser = new User({
      email: "test@example.com",
      password: "testuser123",
      firstName: "Test",
      lastName: "User",
    });
    await testUser.save();
    console.log("✅ Test user created: test@example.com / testuser123");

    console.log("Generating leads...");
    const leads = [];
    const totalLeads = 175; 

    for (let i = 1; i <= totalLeads; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const state = states[Math.floor(Math.random() * states.length)];

      let status;
      const statusRand = Math.random();
      if (statusRand < 0.4) status = "new";
      else if (statusRand < 0.65) status = "contacted";
      else if (statusRand < 0.8) status = "qualified";
      else if (statusRand < 0.95) status = "won";
      else status = "lost";

      let score;
      switch (status) {
        case "new":
          score = Math.floor(Math.random() * 40) + 10; 
          break;
        case "contacted":
          score = Math.floor(Math.random() * 40) + 30; 
          break;
        case "qualified":
        case "won":
          score = Math.floor(Math.random() * 30) + 70; 
          break;
        case "lost":
          score = Math.floor(Math.random() * 30) + 5;
          break;
        default:
          score = Math.floor(Math.random() * 101);
      }

      let leadValue;
      if (status === "won") {
        leadValue = Math.floor(Math.random() * 80000) + 20000; 
      } else if (status === "qualified") {
        leadValue = Math.floor(Math.random() * 50000) + 10000; 
      } else if (status === "contacted") {
        leadValue = Math.floor(Math.random() * 30000) + 5000; 
      } else if (status === "lost") {
        leadValue = Math.floor(Math.random() * 10000) + 1000; 
      } else {
        leadValue = Math.floor(Math.random() * 20000) + 2000; 
      }

      const lead = {
        first_name: firstName,
        last_name: lastName,
        email: generateEmail(firstName, lastName, company),
        phone: generatePhoneNumber(),
        company: company,
        city: city,
        state: state,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: status,
        score: score,
        lead_value: leadValue,
        is_qualified:
          status === "qualified" || status === "won" || Math.random() > 0.7,
        created_by: testUser._id,
        created_at: generateRandomDate(90), 
        last_activity_at: Math.random() > 0.3 ? generateRandomDate(30) : null, 
      };

      leads.push(lead);

      if (i % 25 === 0) {
        console.log(`Generated ${i}/${totalLeads} leads...`);
      }
    }

    console.log("Inserting leads into database...");
    const batchSize = 25;
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      await Lead.insertMany(batch);
      console.log(
        `Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          leads.length / batchSize
        )}`
      );
    }

    const statsArray = await Lead.getStatistics(testUser._id);
    const stats = statsArray[0] || {};

    console.log(`📋 Total Leads: ${stats.totalLeads || 0}`);
    console.log(
      `💰 Total Lead Value: $${(stats.totalValue || 0).toLocaleString()}`
    );
    console.log(`📈 Average Score: ${(stats.avgScore || 0).toFixed(1)}`);
    console.log(
      `💵 Average Lead Value: $${(stats.avgValue || 0).toLocaleString()}`
    );
    console.log(`✅ Qualified Leads: ${stats.qualifiedCount || 0}`);
    console.log(`🆕 New Leads: ${stats.newCount || 0}`);
    console.log(`📞 Contacted Leads: ${stats.contactedCount || 0}`);
    console.log(`🎯 Qualified Status: ${stats.qualifiedStatusCount || 0}`);
    console.log(`🏆 Won Leads: ${stats.wonCount || 0}`);
    console.log(`❌ Lost Leads: ${stats.lostCount || 0}`);

    console.log("=================================\n");

    console.log("🚀 Ready for testing and deployment!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

export default seedDatabase;
