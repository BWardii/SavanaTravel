export type Locale = "en" | "so";

export interface Translations {
  // Page shell
  pageTitle: string;
  pageSubtitle: string;
  sidebarProcess: string;
  sidebarSteps: { label: string; desc: string }[];
  sidebarNote: string;
  privacy: string;
  headerLabel: string;

  // Step indicator
  steps: [string, string, string];

  // Navigation
  back: string;
  continue: string;
  submitting: string;
  submitEnquiry: string;

  // Step 1 — Trip Details
  tripDetailsTitle: string;
  tripDetailsSubtitle: string;
  destination: string;
  tripTypeLabel: string;
  tripTypeOneWay: string;
  tripTypeReturn: string;
  departureDate: string;
  returnDate: string;
  numTravellers: string;
  specialRequests: string;
  optional: string;
  otherDestination: string;

  // Step 2 — Personal Info
  personalInfoTitle: string;
  personalInfoSubtitle: string;
  passportSectionLabel: string;
  additionalTravellersLabel: string;
  fullName: string;
  email: string;
  dob: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  travellerLabel: string;

  // Step 3 — Review
  reviewTitle: string;
  reviewSubtitle: string;
  reviewTripSection: string;
  reviewLeadSection: string;
  reviewDestination: string;
  reviewDeparture: string;
  reviewReturn: string;
  reviewTravellers: string;
  reviewRequests: string;
  reviewName: string;
  reviewEmail: string;
  reviewDob: string;
  reviewPhone: string;
  reviewNationality: string;
  reviewPassportNo: string;
  reviewPassportExpiry: string;
  personSingular: string;
  personPlural: string;
  whatHappensNext: string;
  whatHappensNextText: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    pageTitle: "Let's plan your journey.",
    pageSubtitle: "",
    sidebarProcess: "The Process",
    sidebarSteps: [
      { label: "Trip Details",    desc: "Where, when, and how many." },
      { label: "Personal Info",   desc: "So we can reach you quickly." },
      { label: "Review & Submit", desc: "We'll be in touch within 24 hrs." },
    ],
    sidebarNote:
      "No payment is required at this stage. A consultant will review your enquiry and send a personalised quote within one business day.",
    privacy: "Your information is encrypted and never shared with third parties.",
    headerLabel: "Travel Enquiry",

    steps: ["Trip Details", "Personal Info", "Review"],

    back: "← Back",
    continue: "Continue",
    submitting: "Submitting…",
    submitEnquiry: "Submit Enquiry",

    tripDetailsTitle: "Trip Details",
    tripDetailsSubtitle: "Tell us about your dream destination and travel dates.",
    destination: "Destination",
    tripTypeLabel: "Trip Type",
    tripTypeOneWay: "One Way",
    tripTypeReturn: "Return",
    departureDate: "Departure Date",
    returnDate: "Return Date",
    numTravellers: "Number of Travellers",
    specialRequests: "Special Requests",
    optional: "optional",
    otherDestination: "Other…",

    personalInfoTitle: "Your Details",
    personalInfoSubtitle: "Lead passenger information — as shown on your passport.",
    passportSectionLabel: "Passport Details",
    additionalTravellersLabel: "Additional Travellers",
    fullName: "Full Name",
    email: "Email",
    dob: "Date of Birth",
    phone: "Phone",
    nationality: "Nationality",
    passportNumber: "Passport No.",
    passportExpiry: "Expiry Date",
    travellerLabel: "Traveller",

    reviewTitle: "Review Your Request",
    reviewSubtitle: "Please check everything is correct before submitting.",
    reviewTripSection: "Trip Details",
    reviewLeadSection: "Lead Passenger",
    reviewDestination: "Destination",
    reviewDeparture: "Departure",
    reviewReturn: "Return",
    reviewTravellers: "Travellers",
    reviewRequests: "Requests",
    reviewName: "Name",
    reviewEmail: "Email",
    reviewDob: "Date of Birth",
    reviewPhone: "Phone",
    reviewNationality: "Nationality",
    reviewPassportNo: "Passport No.",
    reviewPassportExpiry: "Passport Expiry",
    personSingular: "person",
    personPlural: "people",
    whatHappensNext: "What happens next?",
    whatHappensNextText:
      "Your travel consultant will review your request, confirm flight pricing and availability, then contact you within 24 hours.",
  },

  so: {
    pageTitle: "Aan qorsheynno safarkaaga.",
    pageSubtitle: "",
    sidebarProcess: "Habka",
    sidebarSteps: [
      { label: "Faahfaahinta Safarka", desc: "Xaggee, goorma, iyo imisa." },
      { label: "Macluumaadkaaga",      desc: "Si aan kuula xiriiri karno degdeg." },
      { label: "Dib u Eeg & Dir",      desc: "Waxaan kugula xiriiri doonaa 24 saac." },
    ],
    sidebarNote:
      "Lacag lama bixinayso marxaladdan. Xirfadlahayagu wuxuu dib u eegi doonaa codsigaaga oo soo diri doonaa qiimaha gaarka ah maalinta shaqada gudahood.",
    privacy: "Macluumaadkaagu wuu sirnaanayaa mana la wadaagayno cid kale.",
    headerLabel: "Codsiga Safarka",

    steps: ["Faahfaahinta Safarka", "Macluumaadkaaga", "Dib u Eeg"],

    back: "← Dib",
    continue: "Sii Wad",
    submitting: "La Dirayaa…",
    submitEnquiry: "Dir Codsiga",

    tripDetailsTitle: "Faahfaahinta Safarka",
    tripDetailsSubtitle: "Noo sheeg goobta aad u safri doonto iyo taariikhaha safarka.",
    destination: "Meesha La Socdo",
    tripTypeLabel: "Nooca Safarka",
    tripTypeOneWay: "Hal Dhinac",
    tripTypeReturn: "Noqosho",
    departureDate: "Taariikhda Bixitaanka",
    returnDate: "Taariikhda Noqoshada",
    numTravellers: "Tirada Musaafirada",
    specialRequests: "Codsiyada Gaar ah",
    optional: "ikhtiyaari",
    otherDestination: "Kale…",

    personalInfoTitle: "Macluumaadkaaga",
    personalInfoSubtitle: "Macluumaadka Musaafirka hogaaminaya — sida ku qoran baasaboorkaaga.",
    passportSectionLabel: "Faahfaahinta Baasaboorka",
    additionalTravellersLabel: "Musaafirada Dheeraadka ah",
    fullName: "Magaca Oo Dhamaystiran",
    email: "Iimaylka",
    dob: "Taariikhda Dhashada",
    phone: "Telefoonka",
    nationality: "Jinsiyadda",
    passportNumber: "Lambarka Baasaboorka",
    passportExpiry: "Taariikhda Dhicitaanka",
    travellerLabel: "Musaafir",

    reviewTitle: "Dib u Eeg Codsiyadaada",
    reviewSubtitle: "Fadlan hubi in wax walba saxsan yihiin kahor inta aanad gudbinin.",
    reviewTripSection: "Faahfaahinta Safarka",
    reviewLeadSection: "Musaafirka Hogaaminaya",
    reviewDestination: "Meesha La Socdo",
    reviewDeparture: "Bixitaanka",
    reviewReturn: "Noqoshada",
    reviewTravellers: "Musaafirada",
    reviewRequests: "Codsiyada",
    reviewName: "Magaca",
    reviewEmail: "Iimaylka",
    reviewDob: "Taariikhda Dhashada",
    reviewPhone: "Telefoonka",
    reviewNationality: "Jinsiyadda",
    reviewPassportNo: "Lambarka Baasaboorka",
    reviewPassportExpiry: "Dhicitaanka Baasaboorka",
    personSingular: "qof",
    personPlural: "qof",
    whatHappensNext: "Maxaa Xiga?",
    whatHappensNextText:
      "Xirfadlahaaga safarka wuxuu dib u eegi doonaa codsigaaga, xaqiijin doonaa qiimaha duulimaadka iyo diyaargarowga, kadib kugula xiriiri doonaa 24 saac gudahood.",
  },
};
