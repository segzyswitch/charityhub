<script setup lang="ts">
definePageMeta({
  layout: "landing"
});
import { collection, getDocs, query, orderBy } from "firebase/firestore";
const { $db } = useNuxtApp();

const loadData = ref(true);
const Causes = ref<any[]>([]);

onMounted(async () => {
	// fetch contestants
	const causesSnapshot = await getDocs(
		query(collection($db, "causes"), orderBy("createdAt", "asc"))
	);
	Causes.value = causesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	// console.log(payment_methods.value);
	loadData.value = false;
});
</script>

<template>

	<!-- Navbar -->
	<page-navbar />

	<header id="home">
		<div id="home-owl" class="">
			<div class="home-item">
				<div class="section-bg" style="background-image: url('/assets/img/background-2.jpg');"></div>
				<div class="home">
					<div class="container">
						<div class="row">
							<div class="col-md-8">
								<div class="home-content">
									<h1>Save The Children</h1>
									<p class="lead">Our mission is simple yet urgent: to protect, educate, and empower children everywhere. From providing food and clean water in crisis-stricken areas, to ensuring access to quality education and healthcare, every donation fuels real, measurable change. <br /> When you give, you’re not just offering financial support — you’re giving a child hope, stability, and a brighter tomorrow.</p>
									<a href="#Causes" class="primary-button">View Causes</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--
			<div class="home-item">
				<div class="section-bg" style="background-image: url('/assets/img/background-2.jpg');"></div>
				<div class="home">
					<div class="container">
						<div class="row">
							<div class="col-md-8">
								<div class="home-content">
									<h1>Save The Children</h1>
									<p class="lead">Our mission is simple yet urgent: to protect, educate, and empower children everywhere. From providing food and clean water in crisis-stricken areas, to ensuring access to quality education and healthcare, every donation fuels real, measurable change. <br /> When you give, you’re not just offering financial support — you’re giving a child hope, stability, and a brighter tomorrow.</p>
									<a href="#" class="primary-button">View Causes</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			-->
		</div>
	</header>


	<div id="about" class="section">
		<div class="container">
			<div class="row">
				<div class="col-md-5">
					<div class="section-title">
						<h2 class="title">Welcome to CharityHub</h2>
						<p class="sub-title">Welcome to CharityHub, where compassion connects people and every act of kindness changes a life.</p>
					</div>
					<div class="about-content">
						<p style="margin:0;">At CharityHub, we work to bring relief and empowerment to those in need, providing food, shelter, education, and healthcare to vulnerable communities. Every donation and helping hand creates a ripple of change that reaches far beyond borders.</p>
						<a href="#" class="primary-button">Read More</a>
					</div>
				</div>
				<div class="col-md-offset-1 col-md-6">
					<a href="javascript:void(0)" class="about-video">
						<i class="play-icon fa fa-play"></i>
						<img src="@/assets/img/about.jpg" alt="" />
					</a>
				</div>
			</div>
		</div>
	</div>


	<div id="numbers" class="section">
		<div class="container">
			<div class="row">
				<div class="col-md-3 col-sm-6">
					<div class="number">
						<i class="fa fa-smile-o"></i>
						<h3>47k</h3>
						<span>Donors</span>
					</div>
				</div>
				<div class="col-md-3 col-sm-6">
					<div class="number">
						<i class="fa fa-heartbeat"></i>
						<h3>154K</h3>
						<span>Children Saved</span>
					</div>
				</div>
				<div class="col-md-3 col-sm-6">
					<div class="number">
						<i class="fa fa-money"></i>
						<h3>785K</h3>
						<span>Donated</span>
					</div>
				</div>
				<div class="col-md-3 col-sm-6">
					<div class="number">
						<i class="fa fa-handshake-o"></i>
						<h3>357</h3>
						<span>Volunteers</span>
					</div>
				</div>
			</div>
		</div>
	</div>


	<div id="Causes" class="section">
		<div class="container">
			<div class="row">
				<div class="col-md-8 col-md-offset-2">
					<div class="section-title text-center">
						<h2 class="title">Our Causes</h2>
						<p class="sub-title">We're dedicated to turning compassion into action by supporting life-changing causes around the world.</p>
					</div>
				</div>
			</div>
			<p class="text-center" v-if="loadData">loading ...</p>
			<div class="row" v-else>
				<div class="col-md-4" v-for="causes in Causes" :key="causes.id">
					<div class="causes">
						<div class="causes-img">
							<router-link :to="`/${causes.id}`"
								:style="`display:block;width:100%;aspect-ratio:1/.65;background-image:url(${causes.banner});background-position:center;background-size:cover;background-repeat: no-repeat;`">
								<!-- <img :src="causes.banner" alt="" /> -->
							</router-link>
						</div>
						<div class="causes-progress m-0">
							<div class="causes-progress-bar">
								<div :style="`width: ${Math.round((causes.raisedAmount / causes.goalAmount) * 100)}%;`">
									<span>{{ Math.round((causes.raisedAmount / causes.goalAmount) * 100) }}%</span>
								</div>
							</div>
							<div>
								<span class="causes-raised">Raised: <strong>${{ causes.raisedAmount.toLocaleString() }}</strong></span>
								<span class="causes-goal">Goal: <strong>${{ causes.goalAmount.toLocaleString() }}</strong></span>
							</div>
						</div>
						<div class="causes-content">
							<h3><router-link :to="`/${causes.id}`">{{ causes.title }}</router-link></h3>
							<p>{{ causes.details.substring(0, 190) }}...</p>
							<router-link :to="`/${causes.id}`" class="primary-button causes-donate">Donate Now</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<div id="cta" class="section">
		<div class="section-bg" style="background-image: url('/assets/img/background-1.jpg');" data-stellar-background-ratio="0.5">
		</div>
		<div class="container">
			<div class="row">
				<div class="col-md-offset-2 col-md-8">
					<div class="cta-content text-center">
						<h1>Become A Volunteer</h1>
						<p class="lead">Your time and passion can change lives. Join CharityHub and help bring hope, care, and opportunity to those who need it most.</p>
						<a href="#" class="primary-button">Join Us Now!</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--
	<div id="events" class="section">
		<div class="container">
			<div class="row">
				<div class="col-md-8 col-md-offset-2">
					<div class="section-title text-center">
						<h2 class="title">Upcoming Events</h2>
					</div>
				</div>
				<div class="col-md-6">
					<div class="event">
						<div class="event-img">
							<a href="single-event.html">
								<img src="@/assets/img/event-1.jpg" alt="">
							</a>
						</div>
						<div class="event-content">
							<h3><a href="single-event.html">Possit nostro aeterno eu vis, ut cum quem reque</a></h3>
							<ul class="event-meta">
								<li><i class="fa fa-clock-o"></i> 24 October, 2018 | 8:00AM - 11:00PM</li>
								<li><i class="fa fa-map-marker"></i> 2736 Hinkle Deegan Lake Road</li>
							</ul>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.</p>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="event">
						<div class="event-img">
							<a href="single-event.html">
								<img src="@/assets/img/event-2.jpg" alt="">
							</a>
						</div>
						<div class="event-content">
							<h3><a href="single-event.html">Vix fuisset tibique facilisis cu. Justo accusata ius at</a></h3>
							<ul class="event-meta">
								<li><i class="fa fa-clock-o"></i> 24 October, 2018 | 8:00AM - 11:00PM</li>
								<li><i class="fa fa-map-marker"></i> 2736 Hinkle Deegan Lake Road</li>
							</ul>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.</p>
						</div>
					</div>
				</div>
				<div class="clearfix visible-md visible-lg"></div>
				<div class="col-md-6">
					<div class="event">
						<div class="event-img">
							<a href="single-event.html">
								<img src="@/assets/img/event-3.jpg" alt="">
							</a>
						</div>
						<div class="event-content">
							<h3><a href="single-event.html">Possit nostro aeterno eu vis, ut cum quem reque</a></h3>
							<ul class="event-meta">
								<li><i class="fa fa-clock-o"></i> 24 October, 2018 | 8:00AM - 11:00PM</li>
								<li><i class="fa fa-map-marker"></i> 2736 Hinkle Deegan Lake Road</li>
							</ul>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.</p>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="event">
						<div class="event-img">
							<a href="single-event.html">
								<img src="@/assets/img/event-4.jpg" alt="">
							</a>
						</div>
						<div class="event-content">
							<h3><a href="single-event.html">Vix fuisset tibique facilisis cu. Justo accusata ius at</a></h3>
							<ul class="event-meta">
								<li><i class="fa fa-clock-o"></i> 24 October, 2018 | 8:00AM - 11:00PM</li>
								<li><i class="fa fa-map-marker"></i> 2736 Hinkle Deegan Lake Road</li>
							</ul>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<div id="blog" class="section">
		<div class="container">
			<div class="row">
				<div class="col-md-8 col-md-offset-2">
					<div class="section-title text-center">
						<h2 class="title">Our Blog</h2>
						<p class="sub-title">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua.</p>
					</div>
				</div>
				<div class="col-md-4">
					<div class="article">
						<div class="article-img">
							<a href="single-blog.html">
								<img src="@/assets/img/post-1.jpg" alt="">
							</a>
						</div>
						<div class="article-content">
							<h3 class="article-title"><a href="single-blog.html">Possit nostro aeterno eu vis, ut cum quem reque</a>
							</h3>
							<ul class="article-meta">
								<li>12 November 2018</li>
								<li>By John doe</li>
								<li>0 Comments</li>
							</ul>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.</p>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="article">
						<div class="article-img">
							<a href="single-blog.html">
								<img src="@/assets/img/post-2.jpg" alt="">
							</a>
						</div>
						<div class="article-content">
							<h3 class="article-title"><a href="single-blog.html">Vix fuisset tibique facilisis cu. Justo accusata ius
									at</a></h3>
							<ul class="article-meta">
								<li>12 November 2018</li>
								<li>By John doe</li>
								<li>0 Comments</li>
							</ul>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.</p>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="article">
						<div class="article-img">
							<a href="single-blog.html">
								<img src="@/assets/img/post-3.jpg" alt="">
							</a>
						</div>
						<div class="article-content">
							<h3 class="article-title"><a href="single-blog.html">Possit nostro aeterno eu vis, ut cum quem reque</a>
							</h3>
							<ul class="article-meta">
								<li>12 November 2018</li>
								<li>By John doe</li>
								<li>0 Comments</li>
							</ul>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<div id="testimonial" class="section">
		<div class="section-bg" :style="`background-image: url(${bg2});`" data-stellar-background-ratio="0.5">
		</div>
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<div id="testimonial-owl" class="owl-carousel owl-theme">
						<div class="testimonial">
							<div class="testimonial-meta">
								<div class="testimonial-img">
									<img src="@/assets/img/avatar-1.jpg" alt="">
								</div>
								<h3>John Doe</h3>
								<span>Volunteer</span>
							</div>
							<div class="testimonial-quote">
								<blockquote>
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
										labore et dolore magna aliqua.</p>
								</blockquote>
							</div>
						</div>


						<div class="testimonial">
							<div class="testimonial-meta">
								<div class="testimonial-img">
									<img src="@/assets/img/avatar-2.jpg" alt="">
								</div>
								<h3>John Doe</h3>
								<span>Volunteer</span>
							</div>
							<div class="testimonial-quote">
								<blockquote>
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
										labore et dolore magna aliqua.</p>
								</blockquote>
							</div>
						</div>


						<div class="testimonial">
							<div class="testimonial-meta">
								<div class="testimonial-img">
									<img src="@/assets/img/avatar-1.jpg" alt="">
								</div>
								<h3>John Doe</h3>
								<span>Volunteer</span>
							</div>
							<div class="testimonial-quote">
								<blockquote>
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
										labore et dolore magna aliqua.</p>
								</blockquote>
							</div>
						</div>


						<div class="testimonial">
							<div class="testimonial-meta">
								<div class="testimonial-img">
									<img src="@/assets/img/avatar-2.jpg" alt="">
								</div>
								<h3>John Doe</h3>
								<span>Volunteer</span>
							</div>
							<div class="testimonial-quote">
								<blockquote>
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
										labore et dolore magna aliqua.</p>
								</blockquote>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
	-->


	<!-- Footer -->
	<page-footer />

</template>