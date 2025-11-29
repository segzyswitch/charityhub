<template>
	<nav id="main-navbar" style="position:sticky;top:0;">
		<div class="container">
			<div class="navbar-header">

				<div class="navbar-brand">
					<router-link class="logo" to="/"><img src="@/assets/img/logo.png" alt="logo"></router-link>
				</div>


				<button class="navbar-toggle-btn">
					<i class="fa fa-bars"></i>
				</button>


				<button class="search-toggle-btn">
					<i class="fa fa-search"></i>
				</button>

			</div>

			<div class="navbar-search">
				<button class="search-btn"><i class="fa fa-search"></i></button>
				<div class="search-form">
					<form>
						<input class="input" type="text" name="search" placeholder="Search">
					</form>
				</div>
			</div>

			<!--
			<ul class="navbar-menu nav navbar-nav navbar-right">
				<li><a href="index-2.html">Home</a></li>
				<li><a href="#">About</a></li>
				<li class="has-dropdown"><a href="#">Causes</a>
					<ul class="dropdown">
						<li><a href="single-cause.html">Single Cause</a></li>
					</ul>
				</li>
				<li class="has-dropdown"><a href="#">Events</a>
					<ul class="dropdown">
						<li><a href="single-event.html">Single event</a></li>
					</ul>
				</li>
				<li class="has-dropdown"><a href="#">Blog</a>
					<ul class="dropdown">
						<li><a href="blog.html">Blog Page</a></li>
						<li><a href="single-blog.html">Single Blog</a></li>
					</ul>
				</li>
				<li><a href="#">Contact</a></li>
			</ul>
			-->

		</div>
	</nav>
</template>