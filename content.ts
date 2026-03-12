// ============================================================
// CONTENT CONFIGURATION — Edit this file to update all copy.
// ============================================================

export const content = {
  business: {
    name: "Houghton Home Dog Boarding",
    tagline: "Where your dog feels truly at home.",
    locationShort: "Houghton, Kirkland WA",
    serviceArea: ["Houghton, WA", "Kirkland, WA", "Bellevue, WA", "Redmond, WA"],
    phone: "YOUR_GOOGLE_VOICE_NUMBER",       // e.g. "(425) 555-0100"
    email: "YOUR_GMAIL_ADDRESS",             // e.g. hello@houghtonpetcare.com
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

  home: {
    heroHeadline: "A Real Home. Not a Kennel.",
    heroSubheadline:
      "Your dog stays with us — in our Houghton home, on the couch, in the yard — while you travel with total peace of mind.",
    bullets: [
      {
        icon: "Home",
        title: "Home-Based, Not a Kennel",
        body: "Your dog lives in our home, not a cage. Limited to 1–2 guests at a time so every pup gets real attention.",
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
      "Spots are limited — we keep it small so every dog gets the attention they deserve. Reach out today to check availability.",
  },

  services: {
    dogBoarding: {
      title: "Home Dog Boarding",
      shortDesc:
        "Overnight dog boarding in a real Houghton home. No cages, no kennels — just warm laps, a fenced yard, and plenty of love.",
      priceLine: "$70 / night (introductory rate)",
      included: [
        "All meals (you provide food to keep their diet consistent)",
        "Multiple outdoor play sessions per day in our fully fenced yard",
        "Sleeping on the couch or dog bed — your call",
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
        "Dogs with mild anxiety who do better in a home than a kennel",
      ],
      notIdeal: [
        "Dogs with bite history",
        "Highly reactive or dog-aggressive dogs",
        "Very large or giant breeds (case by case — ask)",
        "Dogs requiring injectable medication or complex medical care",
      ],
    },
  },

  areas: {
    houghton: {
      pageTitle: "Houghton Dog Boarding | Houghton Home Dog Boarding",
      metaDescription:
        "In-home dog boarding in Houghton, WA. $70/night. Small capacity, big hearts. Fenced yard, daily updates, vaccine-required. Serving Houghton and Kirkland.",
      h1: "Dog Boarding in Houghton, WA",
      body: [
        "Looking for dog boarding in Houghton? We're your neighbors. Our home is located in the heart of Houghton, just minutes from Lake Washington — a calm, residential setting that's perfect for dogs who thrive in a home environment.",
        "Unlike large boarding facilities, we accept only 1–2 dogs at a time. That means your dog gets real one-on-one attention: morning walks, backyard play sessions, and evenings curled up on the couch — not in a kennel run.",
        "We require current vaccinations (Rabies + DHPP required, Bordetella recommended) and a brief meet-and-greet before any first stay. This keeps our home safe for every pup.",
        "Prices start at $70 per night. We'll confirm availability and share our exact address after booking is confirmed.",
      ],
    },
    kirkland: {
      pageTitle: "Kirkland Dog Boarding | Houghton Home Dog Boarding",
      metaDescription:
        "Home dog boarding serving Kirkland, WA. $70/night, limited spots, fenced yard. Vaccine-required, daily photos. Book now.",
      h1: "Dog Boarding in Kirkland, WA",
      body: [
        "Searching for dog boarding in Kirkland? We're just a short drive away in neighboring Houghton — and we offer the kind of personal, home-based care that big Kirkland boarding facilities simply can't match.",
        "Kirkland dog owners love us for our small size: we limit stays to 1–2 dogs at a time, so your pup is never lost in a crowd. They play in our fully fenced backyard, nap on the couch, and wake up to a calm morning routine.",
        "We send daily photo updates so you can keep tabs on your best friend from wherever you are. No news is good news — but we know you'll want the photos anyway.",
        "Our introductory rate is $70 per night. Current vaccinations (Rabies + DHPP) are required for all stays. We're happy to answer any questions before you book.",
      ],
    },
  },

  booking: {
    pageTitle: "Request a Booking | Houghton Home Dog Boarding",
    metaDescription: "Request a dog boarding stay in Houghton/Kirkland, WA. $70/night. Review our waiver and submit your booking request.",
    h1: "Request a Boarding Stay",
    intro: [
      "We keep a small roster on purpose — so every dog gets real attention. Here's how booking works:",
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
    pageTitle: "FAQ | Houghton Home Dog Boarding",
    metaDescription: "Frequently asked questions about our Houghton/Kirkland dog boarding service. Vaccines, rates, policies, and more.",
    h1: "Frequently Asked Questions",
    items: [
      {
        q: "What vaccinations are required?",
        a: "Rabies and DHPP (DA2PP) are required for all stays. Bordetella (kennel cough) is strongly recommended — especially if your dog visits parks or other social settings. Please bring proof of vaccination to your meet-and-greet.",
      },
      {
        q: "How many dogs do you board at once?",
        a: "We keep it to 1–2 dogs at a time. Keeping it small is the whole point — your dog deserves real attention, not just a spot in a crowd.",
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
        a: "Only if you want them to be. If your dog is crate-trained and you prefer they sleep in it, bring their crate. Otherwise, they're welcome on the couch or dog bed. We don't cage dogs — that's kind of the whole point.",
      },
      {
        q: "Can you administer medication?",
        a: "Yes, for basic oral medications (pills, chewables). We're not equipped for injections or complex medical protocols. Reach out if you have questions about your dog's specific needs.",
      },
      {
        q: "What areas do you serve?",
        a: "We're based in Houghton, WA and serve the greater Kirkland area, including Bellevue and Redmond. Drop-off and pick-up happen at our home — address shared after booking is confirmed.",
      },
      {
        q: "What's your cancellation policy?",
        a: "Please review our full Cancellation Policy before booking. In short: cancellations more than 7 days before the stay receive a full refund; cancellations within 7 days may forfeit a portion of payment depending on timing.",
      },
    ],
  },

  legal: {
    cancellation: {
      pageTitle: "Cancellation Policy | Houghton Home Dog Boarding",
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
      note: "To cancel or modify a reservation, please contact us by phone or email as early as possible. We're reasonable people — if something unexpected happens, reach out and we'll do our best to work with you.",
    },
    waiver: {
      pageTitle: "Liability Waiver | Houghton Home Dog Boarding",
      h1: "Liability Waiver",
      paragraphs: [
        "By submitting a booking request and using our services, you (the dog owner / \"Client\") agree to the following terms.",
        "Assumption of Risk: Client acknowledges that boarding involves inherent risks, including but not limited to injury, illness, escape, or death of the pet. Client assumes full responsibility for any such risks.",
        "Authorization for Emergency Care: Client authorizes Houghton Home Dog Boarding to seek emergency veterinary care for the pet if deemed necessary. Client agrees to reimburse all reasonable veterinary costs incurred.",
        "Accurate Disclosure: Client warrants that all information provided about the pet (vaccination records, temperament, medical history) is accurate and complete. Misrepresentation is grounds for immediate termination of the stay without refund.",
        "Limitation of Liability: Houghton Home Dog Boarding shall not be held liable for injury, illness, or death of the pet except in cases of gross negligence or willful misconduct.",
        "Indemnification: Client agrees to indemnify and hold harmless Houghton Home Dog Boarding from any claims, damages, or expenses arising from the pet's behavior during the stay, including injury to persons or property.",
        "Vaccination Compliance: Client confirms that the pet meets all vaccination requirements (current Rabies and DHPP). Failure to provide current records may result in cancellation of the stay without refund.",
      ],
      note: "This is a simplified MVP waiver for a small home-based boarding service. It is not a substitute for legal advice. Consult an attorney to ensure this document meets your jurisdiction's requirements before relying on it commercially.",
    },
  },

  contact: {
    pageTitle: "Contact Us | Houghton Home Dog Boarding",
    metaDescription: "Get in touch with Houghton Home Dog Boarding. Call, text, or email us.",
    h1: "Get in Touch",
    intro:
      "The best way to reach us is by text or email. We typically respond within a few hours during the day.",
    preferTextNote:
      "We prefer texts over calls — they're easier to respond to quickly. But if you'd rather talk, we're happy to chat.",
  },
} as const;

export type Content = typeof content;
