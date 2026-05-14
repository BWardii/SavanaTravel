export type CustomerStatus = "Pending" | "Partial" | "Paid";

export interface Traveller {
  id: string;
  customer_id: string;
  name: string;
  dob: string;
  nationality: string;
  passport_number: string;
  passport_expiry: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  dob: string;
  destination: string;
  departure_date?: string | null;
  return_date?: string | null;
  num_travelers?: number;
  special_requests?: string | null;
  phone?: string | null;
  nationality?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  skyrise_reference?: string | null;
  flight_price: number | null;
  amount_paid: number | null;
  payment_due_date: string | null;
  status: CustomerStatus;
  last_notified_at?: string | null;
  created_at: string;
  travellers?: Traveller[];
}

export interface TravellerFormData {
  name: string;
  dob: string;
  nationality: string;
  passport_number: string;
  passport_expiry: string;
}
