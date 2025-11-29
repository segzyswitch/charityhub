<script setup lang="ts">
definePageMeta({
	layout: "landing"
});
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
const { $db } = useNuxtApp();
import { useCloudinary } from '~/composables/useCloudinary';
const { uploadImage } = useCloudinary();
// SweetAlert
const { $swal } = useNuxtApp();
// Router
const router = useRouter();
// Route
const route = useRoute();
const causeid = route.params.causeid as string;

const votePricing = [50, 100, 200, 300, 500, 1000];

const activePage:any = ref(null);
const manualAmount:any = ref(0);
const donateTerms = ref(false);

const payAuto = ref(true);
function makeVote(query: any) {
	if (query == 'manual') {
		payAuto.value = false;
		manualAmount.value = null;
		return false;
	}
	manualAmount.value = query;
	payAuto.value = true;
}

// Payment methods
const selectedMethod:any = ref(null);
function selectMethod(method:any) {
	selectedMethod.value = method;
	if ( !method ) return false;
	// copy to clipboard
	const text = method.tag;
  navigator.clipboard.writeText(text)
  .then(() => {
    console.log('Copied!');
  })
  .catch(() => {
    console.log('Failed to copy.');
  });
}
const formdata:any = ref({
	email: '',
});
const formerr:any = ref({
	email: '',
	payment_method: '',
});

const files = ref<File[]>([]);
const previews:any = ref([]);
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const newFiles = Array.from(target.files);
    // append instead of replace
    files.value = [...files.value, ...newFiles];
    previews.value = [...previews.value, ...newFiles.map((f) => URL.createObjectURL(f))];
  }
};
const removeFile = (index: number) => {
  // revoke object URL to avoid memory leaks
  URL.revokeObjectURL(previews.value[index]);
  files.value.splice(index, 1);
  previews.value.splice(index, 1);
};

const loadData = ref(true);
const singleCause = ref({} as any);
const payment_methods = ref<any[]>([]);

onMounted(async () => {
	// single contestants
	const CauseSnapshot = await getDoc(doc($db, "causes", causeid));
	singleCause.value =  { id: CauseSnapshot.id, ...CauseSnapshot.data() };
	loadData.value = false;
	// fetch payment methods
	const paymentSnapshot = await getDocs(collection($db, "payment_methods"));
	payment_methods.value = paymentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	// console.log(payment_methods.value);
});


const loadDonate = ref(false);
// Send votes
import { useDonations } from '~/composables/useDonation';
const { submitDonation } = useDonations();
async function makeDonation() {
	loadDonate.value = true;
	// validate form
	formerr.value.email = formdata.value.email ? null : 'Email is required';
	formerr.value.payment_method = selectedMethod.value ? null : 'Select payment method';
	if (formerr.value.email || formerr.value.payment_method) {
		loadDonate.value = false;
		return;
	}

	// upload proofs if available
	let proofUrls:any = [];
	if (files.value.length > 0) {
		proofUrls = await Promise.all(
			files.value.map((f) => uploadImage(f)) // call your uploadImage for each file
		);
		// filter out any failed uploads (nulls)
		proofUrls = proofUrls.filter((url: any): url is string => url !== null);
	}
	// prepare data
	const voteData = {
		email: formdata.value.email,
		causeId: singleCause.value.id,
		amount: manualAmount.value,
		paymentMethod: selectedMethod.value?.name || '',
		proofFile: proofUrls,
	};
	// return console.log(voteData);
	submitDonation(voteData).then((resp:any) => {
		loadDonate.value = false;
		console.log(resp);
		if ( resp?.success == true ) {
			payAuto.value = true;
			manualAmount.value = null;
			formdata.value.email = '';
			selectedMethod.value = null;
			$swal.fire({
        title: 'Thank You!',
        icon: 'success',
        text: "Thanks for impacting the world, we will send you updates via email!",
      });
			router.push(`/${causeid}`);
		}else {
			$swal.fire({
        title: 'Error!',
        icon: 'warning',
        text: resp.error,
      });
		}
	}).catch((err) => {
		loadDonate.value = false;
		console.log(err);
	});
}
</script>

<template>
	<section class="section">
		<div class="container">
			<div class="row" style="display:flex;">
				<div class="col-md-8" style="clear:left;margin:auto;">
					<header style="margin-bottom:15px;padding-bottom:0;">
						<p style="margin-bottom:15px;">
							<a href="#" @click.prevent="router.back" style="display:inline-flex;align-items:center;">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
									<path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
								</svg>
								<span> go back</span>
							</a>
						</p>
						<div class="payment-card" id="aside">
							<div class="widget">
								<div class="widget-causes">
									<p class="text-center" v-if="loadData">loading ...</p>
									<a v-else>
										<div class="widget-img" style="width:100px;">
											<img :src="singleCause.banner" alt="" />
										</div>
										<div class="widget-content" style="padding-left:115px;">
											{{ singleCause.title }}
											<div class="causes-progress">
												<div class="causes-progress-bar">
													<div :style="`width: ${Math.round((singleCause.raisedAmount / singleCause.goalAmount) * 100)}%;`"></div>
												</div>
											</div>
										</div>
										<div style="padding-left:115px;">
											<span class="causes-raised"><i style="opacity:.7;">Raised:</i> <strong>${{ singleCause.raisedAmount.toLocaleString() }}</strong></span> -
											<span class="causes-goal"><i style="opacity:.7;">Goal:</i> <strong>${{ singleCause.goalAmount.toLocaleString() }}</strong></span>
										</div>
									</a>
								</div>
							</div>
						</div>
					</header>

					<div class="payment-card">
						<form @submit.prevent="activePage='payment'" v-if="!activePage">
							<h4 class="mb-4">Choose donation amount</h4>
							<div class="mb-5">
								<div style="display:flex;gap:10px;">
									<div class="w-100 price-btn" v-for="(rates, idx) in votePricing" :key="idx">
										<button type="button" @click="makeVote(rates)" class="btn border w-100" :class="{'active': manualAmount==rates}">${{rates}}</button>
									</div>
									<div class="w-100 price-btn">
										<button type="button" @click="makeVote('manual')" class="btn border w-100" :class="{'active': !payAuto}">Other</button>
									</div>
								</div>
								<div class="row" style="display:flex;margin-top:15px;" v-if="!payAuto">
									<div class="col-md-12 position-relative">
										<div class="form-group">
											<span class="position-absolute d-inline-block" style="top:10px;left:20px;scale:.8;">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
											</span>
											<input v-model="manualAmount"
												type="number" min="200"
												placeholder="Enter amount"
												class="input"
												style="padding-left:30px;"
												required
											/>
										</div>
									</div>
								</div>
							</div>
							<p class="mb-5">
								<label class="d-block">
									<input type="checkbox" v-model="donateTerms" required />
									<span style="margin-left:7.5px;">I agree that all donations are final and non-refundable.</span>
								</label>
							</p>
							<p class="text-center">
								<button :disabled="manualAmount<1" style="scale:1.2;" type="submit" class="primary-button">Continue</button>
							</p>
						</form>
						<form @submit.prevent="activePage='checkout'" class="position-relative" v-if="activePage=='payment'">
							<p class="text-start mb-4">
								<a @click="activePage=null" aria-label="Close">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
								</a>
							</p>
							<h4>Donate ${{ manualAmount }} for this cause</h4>
							<div class="w-100 rounded-3 border border-gold p-3 mb-4 text-start">
								<p>Select payment method</p>
								<div class="row">
									<div class="col-md-12 pt-3" v-for="(method, idx) in payment_methods" :key="idx">
										<button type="button" @click="selectMethod(method)" class="btn w-100"
											:class="{'bg-primary text-light': selectedMethod?.name==method?.name}"
											style="display:flex;">
											<img :src="method?.icon" class="my-auto py-1"
												:alt="method?.name" width="45"
												style="padding:4px 0;"
											/>
											<div class="ps-2 my-auto text-gold" style="padding-left:7.5px;text-align:left;" :class="{'text-dark': selectedMethod?.name==method?.name}">
												<p style="margin:0;">{{ method.name }}</p>
												<small>{{ method.tag }}</small>
											</div>
											<span class="ms-auto text-muted" v-if="selectedMethod?.name==method?.name">copied!</span>
											<span class="ms-auto text-muted" v-else>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
													<path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
												</svg>
											</span>
										</button>
									</div>
									<div class="col-md-12" style="padding-top:25px;">
										<small class="text-danger d-block mt-1" v-if="formerr?.payment_method">{{ formerr?.payment_method }}</small>
										<p v-else-if="selectedMethod" class="d-block mt-3 mb-0">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
												<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
											</svg>
											Complete the payment of ${{ manualAmount }} via the selected payment method:<br />
											<span class="d-block pt-3">
												<img :src="selectedMethod?.icon" width="25" /> {{ selectedMethod?.name }}<br />
												<span v-if="selectedMethod?.tag" class="py-2 px-3 rounded d-block w-100" style="background:#eeeeee;padding:4px 8px;margin:3px 0;">{{ selectedMethod?.tag }}</span>
											</span>
										</p>
									</div>
								</div>
							</div>
							<p class="text-center">
								<button :disabled="loadData||!selectedMethod" type="submit" class="primary-button">
									<i class="spinner-border spinner-border-sm" v-if="loadData"></i> Continue
								</button>
							</p>
						</form>
						<form @submit.prevent="makeDonation" class="position-relative" v-if="activePage=='checkout'">
							<p class="text-start">
								<a @click.prevent="activePage='payment'" class="" aria-label="Close">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
								</a>
							</p>
							<h4 class="text-gold mb-4">Confirm and complete payment</h4>
							<!-- <p class="text-light text-uppercase h5 py-2">{{ nominee.name }}</p>
							<p class="text-gold mb-4">In Category: <span class="text-uppercase">{{ nominee.category }}</span></p> -->
							<div class="w-100 text-start mb-5"	style="border-radius:5px;border:1px solid #eee;padding:15px;">
								<div class="d-flex mb-3 p-2" style="border-bottom:1px dotted #cecece;">
									<span>Cause:</span>
									<span class="ms-auto">{{ singleCause.title }}</span>
								</div>
								<div class="d-flex mb-3 p-2" style="border-bottom:1px dotted #cecece;">
									<span>Goal:</span>
									<span class="ms-auto">${{ singleCause.goalAmount }}</span>
								</div>
								<div class="d-flex mb-3 p-2" style="border-bottom:1px dotted #cecece;">
									<span>Amount raised so far:</span>
									<span class="ms-auto">${{ singleCause.raisedAmount }}</span>
								</div>
								<div class="d-flex mb-3 p-2" style="border-bottom:1px dotted #cecece;">
									<span>Amount to donate:</span>
									<span class="ms-auto">${{ manualAmount }}</span>
								</div>
								<div class="d-flex p-2">
									<span class="my-auto">Payment method:</span>
									<span class="ms-auto my-auto text-end" style="max-width:75%;"><img :src="selectedMethod?.icon" width="35" /> {{ selectedMethod?.name }} <small v-if="selectedMethod?.tag">({{ selectedMethod?.tag }})</small></span>
								</div>
							</div>							
							<div class="row mb-5">
								<div class="col-md-12">
									<div class="d-flex mb-1">
										<label>Proof of payment:</label>
										<button v-if="files.length" class="btn p-0 text-danger ms-auto" type="button" @click="files=[];previews=[]">&times; clear</button>
									</div>
									<input type="file" accept="image/*" multiple @change="handleFileChange" class="d-none" />
									<button type="button" class="btn upload-box my-1 py-4 position-relative text-dark"
										onclick="document.querySelector('input[type=file]')?.click()">
										<i class="pe-1 display-2 mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
												<path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
												<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
											</svg>
										</i>
										<span class="d-block">{{ files.length ? `${previews.length} files selected` : 'Select files' }}</span>
										<small class="d-block pt-2" style="opacity:.6;">{{ files.length ? 'Add another file' : 'Upload reciept or payment photo.' }}</small>
									</button>
									<div class="row py-3" v-if="previews.length">
										<div class="col-md-3" v-for="(prev, x) in previews" :key="x">
											<div style="transform:scale(.9, .9);"	class="w-100 shadow h-100 bg-dark rounded"
												:style="`aspect-ratio:1 / 1;background-image:url(${prev});background-position:center;background-size:cover;`">
												<a href="#" class="text-white shadow" @click.prevent="removeFile(x)">
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
														<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
													</svg>
												</a>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-12" style="padding-top:15px;" :class="{'mt-4': !formerr?.payment_method}">
									<label class="mb-1 mt-3">Email address:</label>
									<input type="email" placeholder="Email address" v-model="formdata.email" class="input" required />
									<small class="text-danger d-block mt-1" v-if="formerr?.email">{{ formerr?.email }}</small>
								</div>
							</div>
							<p class="text-center d-block">
								<button :disabled="loadDonate" type="submit" class="primary-button px-4">
									<i v-if="loadDonate">loading...</i>
									<span v-else>Submit payment</span>
								</button>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<!-- <page-footer /> -->

</template>