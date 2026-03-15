// ============================================================
// CONTENT CONFIGURATION — Edit this file to update all copy.
// ============================================================

export const content = {
  business: {
    name: "Paws and Petals",
    tagline: "Where your dog feels truly at home.",
    locationShort: "Houghton neighborhood, Kirkland WA",
    serviceArea: ["Houghton (Kirkland), WA", "Kirkland, WA", "Bellevue, WA", "Redmond, WA"],
    phone: "7205696748",
    email: "serenahsiang@gmail.com",
    bookingFormUrl: "YOUR_GOOGLE_FORM_URL",  // full https:// URL to your Google Form
    bookingFormEmbedSrc: "YOUR_GOOGLE_FORM_EMBED_SRC", // embed URL (ends with ?embedded=true)
    siteUrl: "https://yourdomain.com",       // your production domain
  },

  pricing: {
    boardingPerNight: 70,
    currency: "USD",
    notes: [
      "Introductory rate — locked in for returning clients.",
      "No extra charge for medication administration (pills only).",
      "Holiday surcharge may apply for peak dates — ask when booking.",
    ],
  },

  ctas: {
    primary: "Request a Booking",
    secondary: "Learn More",
  },

  referral: {
    headline: "Love Paws and Petals? Share the love.",
    body: "Refer a friend and when they complete their first stay, you both get $20 off your next booking. No limits — refer as many friends as you like.",
    howItWorks: [
      "Tell a friend about us and have them mention your name when they book.",
      "Once their first stay is complete, we'll apply $20 credit to both accounts.",
      "Use your credit on any future service — boarding, day care, or walks.",
    ],
    badge: "$20 off for you · $20 off for them",
  },

  home: {
    heroHeadline: "Your dog, truly at home.",
    heroSubheadline:
      "Your dog stays with us — in our home in the Houghton neighborhood of Kirkland, in the yard, in their cozy bed — while you travel with total peace of mind.",
    bullets: [
      {
        icon: "Home",
        title: "A Real Home Environment",
        body: "Your pet lives in our home with us — free to roam, rest, and play. We hand-select every guest so each one gets genuine, unhurried attention.",
      },
      {
        icon: "Shield",
        title: "Safety First, Always",
        body: "Fully fenced yard, vaccine requirements, and careful meet-and-greet screening before every stay.",
      },
      {
        icon: "MessageCircle",
        title: "Daily Photo Updates",
        body: "You'll get texts with photos at least once a day so you can relax and enjoy your trip.",
      },
    ],
    socialProofTitle: "What Dog Parents Say",
    reviews: [
      {
        quote:
          "My dog came home happy and tired — the best combination. I could tell she was genuinely loved while I was away.",
        author: "Sarah M.",
        location: "Kirkland, WA",
      },
      {
        quote:
          "I was nervous leaving my anxious rescue for the first time. The daily photos and check-ins made all the difference.",
        author: "James T.",
        location: "Houghton, WA",
      },
      {
        quote:
          "Finally found a boarder who actually treats dogs like family. We won't go anywhere else.",
        author: "Linda K.",
        location: "Bellevue, WA",
      },
    ],
    finalCtaHeadline: "Ready to Book Your Dog's Next Stay?",
    finalCtaBody:
      "We're selective about who we accept — so every dog gets the attention they deserve. Reach out today to check availability.",
  },

  services: {
    dogBoarding: {
      title: "Home Dog Boarding",
      shortDesc:
        "Overnight dog boarding in a real Houghton home. A warm, settled environment with a fully fenced yard — your dog is treated like a valued guest.",
      priceLine: "$70 / night (introductory rate)",
      icon: "Home",
      included: [
        "All meals (you provide food to keep their diet consistent)",
        "Multiple outdoor play sessions per day in our fully fenced yard",
        "Their own cozy dog bed and personal space",
        "Daily photo/text updates to you",
        "Basic medication administration (pills)",
        "Lots of cuddles",
      ],
      requirements: [
        "Up-to-date Rabies vaccination (required)",
        "Up-to-date DHPP / DA2PP vaccination (required)",
        "Bordetella (kennel cough) vaccination (strongly recommended)",
        "Dog must be friendly with humans and non-reactive on leash",
        "No history of aggression",
        "No intact (unspayed/unneutered) dogs over 6 months",
      ],
      goodFit: [
        "Dogs who love people and indoor life",
        "Small to medium breeds",
        "Senior dogs who need a calm environment",
        "Dogs with mild anxiety who do better in a calm home setting",
      ],
      notIdeal: [
        "Dogs with bite history",
        "Highly reactive or dog-aggressive dogs",
        "Very large or giant breeds (case by case — ask)",
        "Dogs requiring injectable medication or complex medical care",
      ],
    },
    catBoarding: {
      title: "Home Cat Boarding",
      shortDesc:
        "Your cat stays in our home in a calm, private space — away from dogs and the stress of a boarding facility.",
      priceLine: "$60 / night",
      icon: "Cat",
      included: [
        "Private, quiet space separated from any dog guests",
        "All meals (you provide food for dietary consistency)",
        "Fresh water and clean litter box daily",
        "Playtime and affection on their schedule",
        "Daily photo/text updates to you",
        "Basic medication administration (pills)",
      ],
      requirements: [
        "Up-to-date Rabies vaccination (required)",
        "Up-to-date FVRCP vaccination (required)",
        "Cat must be comfortable with calm home environments",
        "No history of aggression toward people",
      ],
    },
    dogWalking: {
      title: "Dog Walking",
      shortDesc:
        "30-minute leashed walks in the Houghton neighborhood. Perfect for keeping your dog active and mentally stimulated on busy days.",
      priceLine: "$30 / walk",
      icon: "Footprints",
      included: [
        "30-minute leashed neighborhood walk",
        "Pick-up and drop-off at your door",
        "Fresh water after the walk",
        "Photo update sent to you",
        "Treats included (or we use yours)",
      ],
      requirements: [
        "Dog must be leash-friendly and non-reactive",
        "Must be current on Rabies vaccination",
        "Service area: Houghton neighborhood, Kirkland",
      ],
    },
    dayCare: {
      title: "Dog & Cat Day Care",
      shortDesc:
        "A full day of supervised care in our home. Drop off in the morning, pick up in the evening — no overnight stay required.",
      priceLine: "$60 / day",
      icon: "Sun",
      included: [
        "Full-day supervised care (drop-off by 9 am, pick-up by 6 pm)",
        "Outdoor play sessions in our fully fenced yard",
        "All meals (you provide food to keep their diet consistent)",
        "Their own cozy resting space",
        "Midday photo/text update to you",
        "Basic medication administration (pills)",
      ],
      requirements: [
        "Up-to-date Rabies vaccination (required)",
        "Up-to-date DHPP / DA2PP or FVRCP vaccination (required)",
        "Bordetella recommended for dogs",
        "Pet must be friendly and non-reactive",
        "No history of aggression",
      ],
    },
    dropIn: {
      title: "Drop-In Visit",
      shortDesc:
        "We come to your home to feed, play, and check on your dog. Great for dogs who are happiest in their own space.",
      priceLine: "$30 / visit",
      icon: "Clock",
      included: [
        "30-minute visit at your home",
        "Feeding and fresh water",
        "Playtime and affection",
        "Quick potty break in your yard or on leash",
        "Photo update sent to you",
        "Basic medication administration (pills)",
      ],
      requirements: [
        "Must be current on Rabies vaccination",
        "Dog must be comfortable with familiar visitors",
        "Service area: Houghton neighborhood, Kirkland",
      ],
    },
  },

  packages: [
    {
      title: "Weekly Stay",
      tagline: "Extended boarding, better rate",
      description: "7 consecutive nights of boarding. Best for longer trips — lock in a week and save.",
      price: "$450",
      originalPrice: "$490",
      savings: "Save $40",
      icon: "CalendarDays",
      highlight: true,
    },
    {
      title: "Walk Pack",
      tagline: "5 walks, one bundle",
      description: "Pre-pay for 5 walks and save. Use them any time within 30 days of purchase.",
      price: "$135",
      originalPrice: "$150",
      savings: "Save $15",
      icon: "Footprints",
      highlight: false,
    },
  ],

  areas: {
    houghton: {
      pageTitle: "Houghton Dog Boarding",
      metaDescription:
        "In-home dog boarding in the Houghton neighborhood of Kirkland, WA. $70/night. Selective availability, fenced yard, daily updates, vaccine-required.",
      h1: "Dog Boarding in Houghton, Kirkland WA",
      body: [
        "Looking for dog boarding in the Houghton neighborhood? We're your neighbors. Houghton is a quiet residential area within Kirkland, just minutes from Lake Washington — and it's exactly the kind of calm, home setting dogs thrive in.",
        "Unlike large boarding facilities, we keep our guest list intentionally small and selective. That means your dog gets real personal attention: morning walks, backyard play sessions, and evenings settled in their own cozy bed.",
        "We require current vaccinations (Rabies + DHPP required, Bordetella recommended) and a brief meet-and-greet before any first stay. This keeps our home safe for every pup.",
        "Prices start at $70 per night. We'll confirm availability and share our exact address after booking is confirmed.",
      ],
    },
    kirkland: {
      pageTitle: "Kirkland Dog Boarding",
      metaDescription:
        "Home dog boarding serving Kirkland, WA. $70/night, selective availability, fenced yard. Vaccine-required, daily photos. Book now.",
      h1: "Dog Boarding in Kirkland, WA",
      body: [
        "Searching for dog boarding in Kirkland? We're located right in the Houghton neighborhood — one of Kirkland's most peaceful residential areas — and we offer the kind of personal, home-based care that big boarding facilities simply can't match.",
        "Kirkland dog owners love us for our selectivity: we hand-pick our guests for a great temperament fit, so your pup is never lost in a crowd. They play in our fully fenced backyard, settle into their own cozy bed, and wake up to a calm morning routine.",
        "We send daily photo updates so you can keep tabs on your best friend from wherever you are. No news is good news — but we know you'll want the photos anyway.",
        "Our introductory rate is $70 per night. Current vaccinations (Rabies + DHPP) are required for all stays. We're happy to answer any questions before you book.",
      ],
    },
  },

  booking: {
    pageTitle: "Request a Booking",
    metaDescription: "Request a dog boarding stay in Houghton/Kirkland, WA. $70/night. Review our waiver and submit your booking request.",
    h1: "Request a Boarding Stay",
    intro: [
      "We're selective about every booking — so every dog in our care gets the attention they deserve. Here's how it works:",
    ],
    stepsTitle: "How It Works",
    steps: [
      { num: "1", title: "Submit Your Request", body: "Fill out the form below with your dates and dog info." },
      { num: "2", title: "We Confirm Availability", body: "We'll review your request and reach out within 24 hours to confirm fit and availability." },
      { num: "3", title: "Payment Link Sent", body: "Once confirmed, we'll send a secure payment link to hold your dates." },
      { num: "4", title: "You're Booked!", body: "We'll share our address and any pre-stay details after payment. See you soon!" },
    ],
    waiverTitle: "Before You Book",
    waiverCheckboxLabel: "I have read and agree to the Liability Waiver and Cancellation Policy.",
    waiverLinks: [
      { label: "Liability Waiver", href: "/legal/liability-waiver" },
      { label: "Cancellation Policy", href: "/legal/cancellation" },
    ],
    buttonLabel: "Open Booking Request Form",
    embedNote:
      "On mobile, use the button above to open the form in a new tab for the best experience.",
  },

  faq: {
    pageTitle: "FAQ",
    metaDescription: "Frequently asked questions about our Houghton/Kirkland dog boarding service. Vaccines, rates, policies, and more.",
    h1: "Frequently Asked Questions",
    items: [
      {
        q: "What vaccinations are required?",
        a: "Rabies and DHPP (DA2PP) are required for all stays. Bordetella (kennel cough) is strongly recommended — especially if your dog visits parks or other social settings. Please bring proof of vaccination to your meet-and-greet.",
      },
      {
        q: "How many dogs do you board at once?",
        a: "We keep our guest list intentionally small and hand-selected. Keeping it selective is the whole point — your dog deserves real attention, not just a spot in a crowd. Not every booking request is accepted.",
      },
      {
        q: "What's your rate, and are there holiday surcharges?",
        a: "Our introductory rate is $70 per night, locked in for returning clients. A holiday surcharge may apply for peak travel dates (Thanksgiving, Christmas, New Year's, July 4th). Ask us when you inquire.",
      },
      {
        q: "Do you do a meet-and-greet before the first stay?",
        a: "Yes — always. We do a brief, no-cost meet-and-greet before any first stay to make sure your dog is comfortable in our home and gets along with us. It usually takes about 20–30 minutes.",
      },
      {
        q: "Will my dog be in a crate?",
        a: "Only if you want them to be. If your dog is crate-trained and you prefer they sleep in it, bring their crate. Otherwise, they'll have their own cozy dog bed and personal space. Pets are not permitted on furniture.",
      },
      {
        q: "Can you administer medication?",
        a: "Yes, for basic oral medications (pills, chewables). We're not equipped for injections or complex medical protocols. Reach out if you have questions about your dog's specific needs.",
      },
      {
        q: "What areas do you serve?",
        a: "We're based in the Houghton neighborhood of Kirkland, WA, and serve the greater Eastside area including Bellevue and Redmond. Drop-off and pick-up happen at our home — address shared after booking is confirmed.",
      },
      {
        q: "What's your cancellation policy?",
        a: "Please review our full Cancellation Policy before booking. In short: cancellations more than 7 days before the stay receive a full refund; cancellations within 7 days may forfeit a portion of payment depending on timing.",
      },
      {
        q: "Do you offer package deals?",
        a: "Yes! We offer a Weekly Stay package (7 nights for $450, save $40) and a Walk Pack (5 walks for $135, valid 30 days). Ask us about packages when you inquire.",
      },
      {
        q: "Do you have a referral program?",
        a: "Yes! Refer a friend and when they complete their first stay, you both get $20 off your next booking. Just have your friend mention your name when they book. There's no limit — refer as many friends as you like.",
      },
    ],
  },

  legal: {
    cancellation: {
      pageTitle: "Cancellation Policy",
      h1: "Cancellation Policy",
      bullets: [
        "Cancellations made 7+ days before the scheduled start date: full refund.",
        "Cancellations made 3–6 days before the start date: 50% refund.",
        "Cancellations made within 48 hours of the start date: no refund.",
        "No-shows (failure to drop off without notice): no refund.",
        "Early pick-up during a stay: no refund for unused nights.",
        "Holiday and peak-date reservations may have stricter terms — we'll note this clearly at time of booking.",
        "We reserve the right to cancel any booking if a dog is found to be a safety risk. A full refund will be issued in that case.",
      ],
      note: "To cancel or modify a reservation, please contact us by text or email as early as possible. We're reasonable people — if something unexpected happens, reach out and we'll do our best to work with you.",
    },
    waiver: {
      pageTitle: "Liability Waiver",
      h1: "Liability Waiver",
      paragraphs: [
        "By submitting a booking request and using our services, you (the dog owner / \"Client\") agree to the following terms.",
        "Assumption of Risk: Client acknowledges that boarding involves inherent risks, including but not limited to injury, illness, escape, or death of the pet. Client assumes full responsibility for any such risks.",
        "Authorization for Emergency Care: Client authorizes Paws and Petals to seek emergency veterinary care for the pet if deemed necessary. Client agrees to reimburse all reasonable veterinary costs incurred.",
        "Accurate Disclosure: Client warrants that all information provided about the pet (vaccination records, temperament, medical history) is accurate and complete. Misrepresentation is grounds for immediate termination of the stay without refund.",
        "Limitation of Liability: Paws and Petals shall not be held liable for injury, illness, or death of the pet except in cases of gross negligence or willful misconduct.",
        "Indemnification: Client agrees to indemnify and hold harmless Paws and Petals from any claims, damages, or expenses arising from the pet's behavior during the stay, including injury to persons or property.",
        "Vaccination Compliance: Client confirms that the pet meets all vaccination requirements (current Rabies and DHPP). Failure to provide current records may result in cancellation of the stay without refund.",
        "House Rules: Pets are not permitted on furniture at any time during their stay. Clients are responsible for informing us of any habits or behaviors that may conflict with this policy.",
      ],
      note: "This is a simplified MVP waiver for a small home-based boarding service. It is not a substitute for legal advice. Consult an attorney to ensure this document meets your jurisdiction's requirements before relying on it commercially.",
    },
  },

  contact: {
    pageTitle: "Contact Us",
    metaDescription: "Get in touch with Paws and Petals. Text or email us.",
    h1: "Get in Touch",
    intro:
      "The best way to reach us is by text or email. We typically respond within a few hours during the day.",
    preferTextNote:
      "We prefer texts over calls — they're easier to respond to quickly. But if you'd rather talk, we're happy to chat.",
  },
} as const;

export type Content = typeof content;
