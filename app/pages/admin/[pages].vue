<script setup lang="ts">
definePageMeta({
  layout: "admin"
});
import { collection, getDocs, Timestamp, query, orderBy,  } from "firebase/firestore";
import { useAdminAuth } from '~/composables/useAdminAuth';
import { openModal } from "~/utils/modal";
// SweetAlert
const { $swal } = useNuxtApp();
const { $db } = useNuxtApp();
const { user, logout, changeEmail, changePassword, loading, error } = useAdminAuth();
const router = useRouter();
const route = useRoute();

// redirect to login if not logged in
if (!user.value) router.push('/admin');

// page route
const slug = route.params.pages;

// Edit data
const editCause:any = ref(null);
function selectCause(nominee:any) {
  // nomineeForm.value?.makeEdit();
	if (nominee !== null) {
		editCause.value = nominee;
	}else editCause.value = {
		title: '',
		goalAmount: '',
		raisedAmount: '',
		details: '',
		datetime: '',
		banner: ''
	};
	
	openModal('newNominee');
}

const { deleteCause, deleteDonation } = useAdmin();
const removeCause:any = ref(null);
async function resolveCause(cause:any) {
	if (cause) {
		removeCause.value = cause;
		try {
			const result = await deleteCause(cause.id);
			if (!result.success) {
				$swal.fire({
					title: 'Sorry!',
					icon: 'warning',
					text: result?.error??'Unable to delete, try again',
				});
				return false;
			}
			$swal.fire({
				title: 'Success!',
				icon: 'success',
				text: 'Donation removed successfully!',
			});
			console.log(result);
			loadAll();
		} catch (err) {
			console.log(err)
		}
	}else removeCause.value = null;
}
// delete data
const removeDonation:any = ref(null);
async function resolveDonation(nominee:any) {
	if (nominee) {
		removeDonation.value = nominee;
		try {
			const result = await deleteDonation(nominee.id);
			if (!result.success) {
				$swal.fire({
					title: 'Sorry!',
					icon: 'warning',
					text: result?.error??'Unable to delete, try again',
				});
				return false;
			}
			$swal.fire({
				title: 'Success!',
				icon: 'success',
				text: 'Donation removed successfully!',
			});
			console.log(result);
			loadAll();
		} catch (err) {
			console.log(err)
		}
	}else removeDonation.value = null;
	
	// openModal('newNominee');
}

const { deletePaymentMethod } = useAdmin();
const removePaymentMethod:any = ref(null);
async function resolvePaymentMethod(payment:any) {
	if (payment) {
		removePaymentMethod.value = payment;
		try {
			const result = await deletePaymentMethod(payment.id);
			if (!result.success) {
				$swal.fire({
					title: 'Sorry!',
					icon: 'warning',
					text: result?.error??'Unable to delete, try again',
				});
				return false;
			}
			$swal.fire({
				title: 'Success!',
				icon: 'success',
				text: 'Payment method removed successfully!',
			});
			console.log(result);
			loadAll();
		} catch (err) {
			console.log(err)
		}
	}else removePaymentMethod.value = null;
}

// Edit payment method
const editMethod:any = ref(null);
function selectMethod(method:any) {
  // nomineeForm.value?.makeEdit();
	if (method) {
		editMethod.value = method;
	}else editMethod.value = null;
	// return console.log(method)
	openModal('newPaymentMethod');
}

const Donations = ref<any[]>([]);
const Causes = ref<any[]>([]);
const Contestants = ref<any[]>([]);
const paymentMethods = ref<any[]>([]);

// get single nominee
function getContestantById(id: string): any {
  return Contestants.value.find(c => c.id === id)
}

function formatFirestoreTimestamp(timestamp: Timestamp): string {
  // Convert Firestore Timestamp to JavaScript Date
  const date = timestamp.toDate();
  // Get parts of the date
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear().toString().slice(-2);
  // Format hours and minutes for 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
	// Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
	// Return formatted date string
  return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
}

const loadData = ref(true);

async function loadAll() {
	// fetch causes
	const causesSnapshot = await getDocs(
		query(collection($db, "causes"), orderBy("datetime", "desc"))
	);
	Causes.value = causesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	
	// fetch donations
	const donationsSnapshot = await getDocs(
		query(collection($db, "donations"), orderBy("createdAt", "desc"))
	);
	Donations.value = donationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

	// fetch contestants
	const constestSnapshot = await getDocs(
		query(collection($db, "contestants"), orderBy("createdAt", "desc"))
	);
	Contestants.value = constestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	// fetch payment methods
	const paymentSnapshot = await getDocs(collection($db, "payment_methods"));
	paymentMethods.value = paymentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	// fetch votes
	const donationSnapshot = await getDocs(
		query(collection($db, "donations"), orderBy("createdAt", "desc"))
	);
	Donations.value = donationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

	loadData.value = false;
}

// Logout
function Logout() {
	try {
		const result:any = logout;
		if ( !result.success ) {
			$swal.fire({
        title: 'Error!',
        icon: 'warning',
        text: result?.error,
      });
			loadData.value = false;
			router.push('/admin');
			return false;
		}
		loadData.value = false;
		router.push('/admin');
	} catch (err:any) {
		$swal.fire({
			title: 'Error!',
			icon: 'warning',
			text: err?.message??'An error occured, try again',
		});
		console.log(err);
	}
}

// View proof
const openProofs = ref(undefined);
function showProof(vote:any) {
	openProofs.value = vote.proofFile;
	openModal('proofModal');
}

// Settings
const settingsTab:any = ref(null);
// changeEmail
const loadEmail = ref(false);
const mailFD = ref({
	email: '',
	password: ''
});
async function changeAdminEmail() {
	loadEmail.value = true;
	const FD = mailFD.value;
	try {
		const result:any = await changeEmail(FD.email, FD.password);
		if ( result.success == false ) {
			loadEmail.value = false;
			$swal.fire({
        title: 'Sorry!',
        icon: 'warning',
        text: result?.error??"Operation failed, please try again",
      });
		}
		loadEmail.value = false;
		FD.email = '';
		FD.password = '';
		$swal.fire({
			title: 'Thank You!',
			icon: 'success',
			text: "Admin email successfully changed!",
		});
		console.log(result)
	} catch (err) {
		console.log(err);
			loadEmail.value = false;
			$swal.fire({
        title: 'Sorry!',
        icon: 'error',
        text: "Operation failed, please try again",
      });
	}
}

// changeEmail
const loadPass = ref(false);
const passFD = ref({
	password: '',
	new_password: '',
	con_password: ''
});
async function changeAdminPassword() {
	const FD = passFD.value;
	if ( FD.new_password !== FD.con_password ) {
		$swal.fire({
			title: 'Sorry!',
			icon: 'warning',
			text: "New passwords do not match!",
		});
		return false;
	}
	loadEmail.value = true;
	try {
		const result:any = await changePassword(FD.new_password, FD.password);
		if ( result.success == false ) {
			loadEmail.value = false;
			$swal.fire({
        title: 'Sorry!',
        icon: 'warning',
        text: result?.error??"Operation failed, please try again",
      });
			return false;
		}
		loadEmail.value = false;
		FD.password = '';
		FD.new_password = '';
		FD.con_password = '';
		$swal.fire({
			title: 'Thank You!',
			icon: 'success',
			text: "Admin password successfully changed!",
		});
		console.log(result)
	} catch (err) {
		console.log(err);
			loadEmail.value = false;
			$swal.fire({
        title: 'Sorry!',
        icon: 'error',
        text: "Operation failed, please try again",
      });
	}
}


// Fetch data on mount
onMounted( () => {
	loadAll();
	
  router.afterEach(() => {
    const offcanvasEl = document.getElementById('mobileMenu');
    const bootstrap = (window as any).bootstrap;
    if (offcanvasEl && bootstrap?.Offcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) bsOffcanvas.hide();
    }
  });
});
</script>

<template>
	<div class="container-fluid pb-5">
		<div class="row pb-4">
			<div class="col-sm-3 ps-0 d-none d-sm-block">
				<div class="bg-dark vh-100 text-light position-fixed start-0 top-0 col-3 p-0">
				<a class="navbar-brand d-inline-block m-2 mb-3 px-2" href="#">
					<img src="@/assets/img/logo.png" style="filter: invert(100%);" height="50" alt="">
				</a>

					<div class="w-100 sidenav pt-5">
						<sidenav :Logout="Logout" />
					</div>
				</div>
			</div>
			<div class="col-sm-9">
				<div class="navbar navbar-expand-lg navbar-dark row mb-5 sticky-top bg-dark" style="height:60px;">
					<div class="container-fluid">
						<a class="navbar-brand d-inline-block d-sm-none" href="#" style="position:relative;top:20px;padding:5px 0;"><PageLogo /></a>
						<button class="navbar-toggler ms-auto text-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Open menu">
							<span class="navbar-toggler-icon"></span>
						</button>
						<div class="collapse navbar-collapse" id="navbarSupportedContent">
							<ul class="navbar-nav ms-auto">
								<li class="nav-item dropdown">
									<a class="nav-link p-0" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										<i class="bi bi-person-circle h3"></i>
									</a>
									<ul class="dropdown-menu pt-0" aria-labelledby="navbarDropdown" style="left:auto;right:0;">
										<div class="w-100 p-2">
											<div class="w-100 p-2 px-3 rounded-3 text-light"
												style="background-color:rgba(255,255,255,.2);">
												<i class="bi bi-person"></i> ADMIN
											</div>
										</div>
										<li><hr class="dropdown-divider text-light"></li>
										<li><a class="dropdown-item" href="#">Settings</a></li>
										<li><a class="dropdown-item" href="#" @click.prevent="Logout">Logout</a></li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- mobile top space -->
				<div class="d-sm-none py-4"></div>

				<!-- Dashboard -->
				<section class="w-100" v-if="slug=='dashboard'">
					<h1 class="mb-4">Dashboard Overview</h1>
					<p class="text-center py-5" v-if="loadData"><i class="spinner-border"></i></p>
					<div class="row g-4" v-else>
						<div class="col-sm-6">
							<router-link to="/admin/causes" class="btn w-100 h-100 btn-success p-3 text-center">
								<p class="lead">Causes</p>
								<h1 class="display-2">{{ Causes.length }}</h1>
							</router-link>
						</div>
						<div class="col-sm-6">
							<router-link to="/admin/payments" class="btn w-100 h-100 btn-primary p-3 text-center">
								<p class="lead">Payment methods</p>
								<h1 class="display-2">{{ paymentMethods.length }}</h1>
							</router-link>
						</div>
						<div class="col-sm-6">
							<router-link to="/admin/donations" class="btn w-100 h-100 btn-warning p-3 text-center">
								<p class="lead">All Donations</p>
								<h1 class="display-2">{{ Donations.length }}</h1>
							</router-link>
						</div>
						<div class="col-sm-6">
							<router-link to="/admin/settings" class="btn w-100 h-100 btn-warning p-3 text-center">
								<p class="lead">Settings</p>
								<h1 class="display-2"><i class="bi bi-gear"></i></h1>
							</router-link>
						</div>
					</div>
				</section>

				<!-- Nominee -->
				<section class="w-100" v-if="slug=='causes'">
					<div class="d-flex mb-4">
						<h1 class="my-auto">All Causes</h1>
						<button @click="selectCause(null)" class="btn ms-auto btn-secondary my-auto">Add new</button>
					</div>
					<add-cause :cause="editCause" :reload-data="loadAll" />
					<p class="text-center py-5" v-if="loadData"><i class="spinner-border"></i></p>
					<div class="table-responsive" v-else>
						<table class="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Title</th>
									<th scope="col">Goal</th>
									<th scope="col">Amount raied</th>
									<th scope="col">Options</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(nom, idx) in Causes" :key="idx">
									<th scope="row">{{ idx + 1 }}</th>
									<td class="d-flex">
										<div class="overflow-hidden rounded bg-info"
											:style="`width:80px;height:50px;border-radius:5px;background-image:url(${nom.banner});background-size:cover;background-position:center;`">
											<!-- <img :src="nom.banner" width="50" :alt="nom.name" /> -->
										</div>
										<span class="ps-2 my-auto">{{ nom.title }}</span>
									</td>
									<td>${{ nom.goalAmount }}</td>
									<td>${{ nom.raisedAmount }}</td>
									<td>
										<a href="javascript:void(0)" class="btn text-primary p-1" @click="selectCause(nom)">edit</a>
										<a href="javascript:void(0)" class="btn text-danger p-1" @click="resolveCause(nom)">delete</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				<!-- Votes -->
				<section class="w-100" v-if="slug=='donations'">
					<h1 class="mb-4">All Donations</h1>
					<p class="text-center py-5" v-if="loadData"><i class="spinner-border"></i></p>
					<div class="table-responsive" v-else>
						<table class="table table-hover">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">User email</th>
									<th scope="col">Amount</th>
									<th scope="col">Payment method/proof</th>
									<th scope="col">Date</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(donation, idx) in Donations" :key="idx">
									<th scope="row">{{ idx + 1 }}</th>
									<td>{{ donation.email }}</td>
									<td>${{ donation.amount }}</td>
									<td>{{ donation.paymentMethod }} <a href="javascript:void(0)" @click.prevent="showProof(donation)" v-if="donation.proofFile!=''">Show reciept</a></td>
									<td>{{ formatFirestoreTimestamp(donation.createdAt) }}</td>
									<td>
										<a href="javascript:void(0)" class="btn text-danger p-1" @click="resolveDonation(donation)">delete</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				<!-- Payment Methods -->
				<section class="w-100" v-if="slug=='payments'">
					<div class="d-flex">
						<h1 class="mb-4">Payment methods</h1>
						<button class="btn ms-auto btn-secondary my-auto" @click="selectMethod(null)">Add new</button>
					</div>
					<payment-method :method="editMethod" :reload-data="loadAll" />
					<p class="text-center py-5" v-if="loadData"><i class="spinner-border"></i></p>
					<div class="table-responsive" v-else>
						<table class="table table-hover">
							<thead>
								<tr>
									<th>Payment method</th>
									<th colspan="2">Tag</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(payment, idx) in paymentMethods" :key="idx">
									<td>
										<img :src="payment.icon" :alt="payment.name" width="45">
										<span class="ps-3">{{ payment.name }}</span>
									</td>
									<td>{{ payment.tag }}</td>
									<td>
										<a href="#" class="btn p-1 text-primary" @click="selectMethod(payment)">edit</a>
										<a href="#" class="btn p-1 text-danger" @click.prevent="resolvePaymentMethod(payment)">delete</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				<!-- Settings -->
				<section class="w-100" v-if="slug=='settings'">
					<h1 class="mb-4">Settings</h1>
					<div class="row">
						<div class="col-sm-5 pb-4">
							<div class="w-100 rounded-3 p-3 shadow" style="background-color:rgba(255,255,255,.1);">
								<h1 class="mb-4 text-center text-muted" style="font-size:5em;"><i class="bi bi-person-circle"></i></h1>
								<div class="row my-tabs g-3">
									<div class="col-6 col-sm-12">
										<a href="#passwordTab" @click.prevent="settingsTab=null" class="btn border border-gold w-100" :class="{'active': !settingsTab}">Password</a>
									</div>
									<div class="col-6 col-sm-12">
										<a href="#emailTab" @click.prevent="settingsTab='email'" class="btn border border-gold w-100" :class="{'active': settingsTab=='email'}">Email</a>
									</div>
								</div>
							</div>
						</div>
						<div class="col-sm-7">
							<form id="passwordTab" v-if="!settingsTab" @submit.prevent="changeAdminPassword" class="w-100 bg-dark rounded-3 p-3 shadow" style="color:#ccc;">
								<h4 class="mb-4">Change password</h4>
								<div class="w-100 mb-3">
									<label class="mb-1">New password:</label>
									<input type="text" placeholder="Enter new password" v-model="passFD.new_password" class="form-control" required />
								</div>
								<div class="w-100 mb-3">
									<label class="mb-1">Confirm password:</label>
									<input type="text" placeholder="Retype new password" v-model="passFD.con_password" class="form-control" required />
								</div>
								<div class="w-100 mb-3">
									<label class="mb-1">Old password:</label>
									<input type="password" placeholder="Confirm old password" v-model="passFD.password" class="form-control" required />
								</div>
								<p class="ps-2 mb-0 pt-3">
									<button :disabled="loadEmail" style="scale:1.1;" type="submit" class="btn btn-warning px-4">
										<i class="spinner-border spinner-border-sm" v-if="loadEmail"></i> Change password
									</button>
								</p>
							</form>
							<form id="emailTab" v-else @submit.prevent="changeAdminEmail" class="w-100 bg-dark rounded-3 p-3 shadow" style="color:#ccc;">
								<h4 class="mb-4">Change Email</h4>
								<div class="w-100 mb-3">
									<label class="mb-1">New email address:</label>
									<input type="email" placeholder="Email address address" v-model="mailFD.email" class="form-control" required />
								</div>
								<div class="w-100 mb-3">
									<label class="mb-1">Enter password:</label>
									<input type="password" placeholder="Email password" v-model="mailFD.password" class="form-control" required />
								</div>
								<p class="ps-2 mb-0 pt-3">
									<button :disabled="loadEmail" style="scale:1.1;" type="submit" class="btn btn-warning px-4">
										<i class="spinner-border spinner-border-sm" v-if="loadEmail"></i> Change email
									</button>
								</p>
							</form>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

	
	<!-- mobile menu -->
	<div class="offcanvas offcanvas-start w-75 bg-dark text-light" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
		<div class="offcanvas-header">
			<h5 class="offcanvas-title" id="offcanvasExampleLabel">Bima Awards</h5>
			<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body px-0">
			<sidenav :Logout="Logout" />
		</div>
	</div>
	
	<div class="modal fade" id="proofModal" tabindex="-1">
		<div class="modal-dialog modal-sm">
			<div class="modal-content text-light">
				<div class="modal-header border-0 d-block">
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body d-flex flex-column gap-3">
					<img v-for="img in openProofs" :src="img" class="w-100 border rounded mb-3" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.dropdown-menu {
	background-color: #404040;
}
.dropdown-menu .dropdown-item { color: #cecece; }
.dropdown-menu .dropdown-item:hover { color: #6a6a6a; }
</style>