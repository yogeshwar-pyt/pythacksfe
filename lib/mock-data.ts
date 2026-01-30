/**
 * Sample mock data for testing the call coaching system
 * This content is used as INPUT ONLY - never displayed to agents
 */

export const mockTravelEmail = `
Greetings! I hope this message finds you well and ready for an unforgettable adventure ahead. 

We're thrilled to confirm that all arrangements for your upcoming trip are set, and your vouchers are live and ready to go on the Pickyourtrail app. To ensure a smooth experience, here's a handy guide to everything you'll need and a few final tips.

Important Documents to Carry:
Passports: Both the original and a printed copy
Flight Tickets: Printed copies
Hotel Vouchers: Printed copies
Visa Copies: Color printouts
Travel Insurance: Printed copy (if you've opted for insurance)

Flight Details: You'll be traveling on Emirates Airlines, both outbound and return, for the perfect start and end to your journey.

Baggage Allowance:
Checked Baggage: 30 kg per person
Cabin Baggage: 7 kg per person

A Few Reminders: If you have any specific seat or meal preferences, we recommend selecting these during the web check-in on Airlines' website. Meals are not included in your booking, so please make arrangements to suit your preferences if your flights are with a low-cost carrier.

Hotels:
Your Stay at
Enjoy a comfortable stay with complimentary amenities:
Breakfast and WiFi included

Since the Airport Pick up and Drop Off is provided complimentary from the Hotel. The Transfers would be on a Shared Basis only. If you wish to upgrade the Transfers to be on Pvt Basis it would be at an extra cost.

Check In Time: 02:00 PM & Check Out Time: 12:00 PM 

Tourism Tax in Dubai: All hotels in Dubai charge a 'Tourism Dirham Fee', payable on arrival at your hotel. The rate ranges from AED 7 to AED 20 per room, per night (Non refundable)

Activities:
All activities are arranged according to your itinerary, and I've attached your final voucher for reference. Please keep all vouchers handy throughout your trip.

Activity Timings:
Dubai City Tour: Pickup 8:30 AM – 9:00 AM | Return Pick up from the Activity Area at 1:30 PM from Dubai Mall (Shared Transfer)
Burj Khalifa + Aquarium & Underwater Zoo: Morning: Pickup 10:00 AM – 10:30 AM | Return Pick up from the Activity Area at 2:30 PM from Dubai Mall
Desert Safari: Pickup 3:30 PM to 4:00 PM | Return Pickup from the activity area will be accordingly once the activity ends. (Shared Transfer)
Dhow Cruise Dinner: Pickup 7:00 PM – 7:45 PM | Return Pickup from the activity area will be accordingly once the activity ends. (Shared Transfer)

Important Information for Desert Safari & Dhow Cruise:
Vegetarian Meal Options: As it is an Arab country, vegetarian food options may be limited.
Infant/Senior Citizens/Pregnant Woman Safety During Dune Bashing: Dune bashing is not recommended for Infant/Senior Citizens/Pregnant Woman due to safety concerns. Inform the transfer driver at the hotel to drop the concerned person with a guardian directly at the camp area, skipping the dune bashing activity.

Abu Dhabi City Tour:
Please fill in the BAPS Mandir form a day prior: https://www.mandir.ae/visit
The above link has to register in the BAPS mandir portal for the visit pass and has to carry ID as passport for verification while entering
Note - BAPS Mandir will be closed on Monday

Airport Transfers:
Your airport transfers are scheduled according to your flight timings. Upon arrival, your driver will be waiting in the arrivals hall, holding a placard with your name for easy identification.

Transfers Waiting Time:
Shared Transfers: 5-minute waiting time
Private Transfers: 10-minute waiting time

24/7 Live Chat Support:
Starting 3 days prior to your trip, you'll have access to our live chat feature on the app. Our support team will be available round-the-clock to assist you with any needs during your travels.

Contact Hours:
I'm personally available from 10 AM to 7 PM and am here to ensure your vacation goes smoothly, so don't hesitate to reach out!

Note: We don't provide support via WhatsApp. For immediate assistance, please use the app for the quickest response.

Wishing you a hassle-free holiday and a wonderful day ahead!
`;

export const mockChatHistory = [
  {
    sender: "Supervisor",
    content: "Customer confirmation call scheduled for 2 PM today. All vouchers are active and verified.",
    timestamp: "2026-01-30 09:00 AM"
  },
  {
    sender: "Operations",
    content: "Dubai hotel confirmed. Shared transfers assigned. Customer hasn't upgraded to private yet.",
    timestamp: "2026-01-30 09:15 AM"
  },
  {
    sender: "Agent Lead",
    content: "Make sure to emphasize the Tourism Dirham Fee - customers often miss this detail.",
    timestamp: "2026-01-30 09:30 AM"
  },
  {
    sender: "Quality Team",
    content: "Clearly explain BAPS Mandir registration requirement. Many customers forget this step.",
    timestamp: "2026-01-30 10:00 AM"
  }
];
