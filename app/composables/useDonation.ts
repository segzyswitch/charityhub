import { addDoc, collection, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";

type DonationData = {
  email: string;
  causeId: string;
  amount: number;
  paymentMethod: string;
  proofFile?: string[]; // array of image urls
};

export function useDonations() {
  const { $db } = useNuxtApp();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const submitDonation = async (donation: DonationData) => {
    loading.value = true;
    error.value = null;

    try {
      // Firestore document structure
      const donationRecord: any = {
        email: donation.email,
        causeId: donation.causeId,
        amount: donation.amount,
        paymentMethod: donation.paymentMethod,
        proofFile: donation.proofFile || [],
        createdAt: serverTimestamp(),
      };

      // 1. Save donation to "donations" collection
      await addDoc(collection($db, "donations"), donationRecord);

      // 2. Increase the cause's total raisedAmount
      const causeRef = doc($db, "causes", donationRecord.causeId);
      await updateDoc(causeRef, {
        raisedAmount: increment(donationRecord.amount),
      });

      return { success: true };
    } catch (err: any) {
      error.value = err.message || "Failed to submit donation";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return { submitDonation, loading, error };
}
