<script setup lang="ts">
definePageMeta({
  layout: "landing"
});
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
const { $db } = useNuxtApp();

const route = useRoute();
const causeid = route.params.causeid as string;

const loadData = ref(true);
const loadReq = ref(true);
const Causes = ref<any[]>([]);
const singleCause = ref({} as any);
const payment_methods = ref<any[]>([]);

onMounted(async () => {
	// single contestants
	const CauseSnapshot = await getDoc(doc($db, "causes", causeid));
	singleCause.value =  { id: CauseSnapshot.id, ...CauseSnapshot.data() };
	loadData.value = false;
	// fetch contestants
	const causeSnapshot = await getDocs(collection($db, "causes"));
	Causes.value = causeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	loadReq.value = false;
	// fetch payment methods
	const paymentSnapshot = await getDocs(collection($db, "payment_methods"));
	payment_methods.value = paymentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	// console.log(payment_methods.value);
});
</script>

<template>

	<!-- Navbar -->
	<page-navbar />

	<header>
		<div id="page-header" style="margin-top:0;">
			<div class="section-bg" style="background-image: url('/assets/img/background-2.jpg');"></div>
			<div class="container">
				<div class="row">
					<div class="col-md-12">
						<div class="header-content">
							<h1>{{ singleCause.title }}</h1>
							<ul class="breadcrumb">
								<li><router-link to="/">Home</router-link></li>
								<li><a href="javascript:void(0)">Causes</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<div class="section">
		<div class="container">
			<div class="row">
				<main id="main" class="col-md-9">
					<p class="text-center" v-if="loadData">loading ...</p>
					<div class="article causes-details" v-else>
						<div class="article-img">
							<img :src="singleCause.banner" alt="" />
						</div>
						<div class="clearfix">
							<div class="causes-progress">
								<div class="causes-progress-bar">
									<div :style="`width: ${Math.round((singleCause.raisedAmount / singleCause.goalAmount) * 100)}%;`">
										<span>{{ Math.round((singleCause.raisedAmount / singleCause.goalAmount) * 100) }}%</span>
									</div>
								</div>
								<div>
									<span class="causes-raised">Raised: <strong>${{ singleCause.raisedAmount.toLocaleString() }}</strong></span>
									<span class="causes-goal">Goal: <strong>${{ singleCause.goalAmount.toLocaleString() }}</strong></span>
								</div>
							</div>
							<router-link :to="`${causeid}/pay`" class="primary-button causes-donate">Donate Now</router-link>
						</div>

						<div class="article-content">
							<h2 class="article-title">{{ singleCause.title }}</h2>
							<ul class="article-meta">
								<li>{{ singleCause.datetime }}</li>
								<li>By Admin</li>
								<li>0 Comments</li>
							</ul>
							<p>{{ singleCause.details }}</p>
						</div>
						<div class="article-tags-share">
							<ul class="tags">
								<li>TAGS:</li>
								<li style="text-transform:capitalize;" v-for="tag in singleCause.tags"><a href="#">{{ tag }}</a></li>
							</ul>
							<ul class="share">
								<li>SHARE:</li>
								<li><a href="#"><i class="fa fa-twitter"></i></a></li>
								<li><a href="#"><i class="fa fa-facebook"></i></a></li>
								<li><a href="#"><i class="fa fa-google-plus"></i></a></li>
								<li><a href="#"><i class="fa fa-pinterest"></i></a></li>
								<li><a href="#"><i class="fa fa-instagram"></i></a></li>
							</ul>
						</div>
						<div class="article-reply">
							<h3>Leave a reply</h3>
							<form>
								<div class="row">
									<div class="col-md-6">
										<div class="form-group">
											<input class="input" placeholder="Name" type="text">
										</div>
									</div>
									<div class="col-md-6">
										<div class="form-group">
											<input class="input" placeholder="Email" type="email">
										</div>
									</div>
									<div class="col-md-12">
										<div class="form-group">
											<textarea class="input" placeholder="Message"></textarea>
										</div>
										<button class="primary-button">Submit</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</main>

				<aside id="aside" class="col-md-3">
					<div class="widget">
						<h3 class="widget-title">Category</h3>
						<div class="widget-category">
							<ul>
								<li><a href="#">Health<span>(57)</span></a></li>
								<li><a href="#">Food<span>(86)</span></a></li>
								<li><a href="#">Education<span>(241)</span></a></li>
								<li><a href="#">Donation<span>(65)</span></a></li>
								<li><a href="#">Events<span>(14)</span></a></li>
							</ul>
						</div>
					</div>
					<p class="text-center" style="padding:25px 0;" v-if="loadReq">loading ...</p>
					<div class="widget" v-else>
						<h3 class="widget-title">Latest Causes</h3>
						<div class="widget-causes" v-for="causes in Causes">
							<router-link :to="`/${causes.id}`">
								<div class="widget-img">
									<img :src="causes.banner" alt="" />
								</div>
								<div class="widget-content">
									{{ causes.title.substring(0, 40) }}...
									<div class="causes-progress">
										<div class="causes-progress-bar">
											<div :style="`width: ${Math.round((causes.raisedAmount / causes.goalAmount) * 100)}%;`"></div>
										</div>
									</div>
								</div>
								<div>
									<span class="causes-raised"><i style="opacity:.7;">Raised:</i> <strong>${{ causes.raisedAmount.toLocaleString() }}</strong></span> -
									<span class="causes-goal"><i style="opacity:.7;">Goal:</i> <strong>${{ causes.goalAmount.toLocaleString() }}</strong></span>
								</div>
							</router-link>
						</div>
					</div>
				</aside>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<page-footer />

</template>