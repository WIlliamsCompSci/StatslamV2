<script>
	// Add any state or API calls later
</script>

<svelte:head>
	<title>Statslam | Dashboard</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="/css/dashboard.css" />
</svelte:head>

<div class="container-fluid" style="font-family: Montserrat;">
	<div class="row" style="height: 100vh;">
		<div class="col-2 col-sm-3 col-xl-2" style="background-color: rgb(38, 38, 200);">
			<nav class="navbar border-bottom border-white mb-5">
				<div class="container-fluid">
					<img src="/img/StatSlamLogo.png" class="img-fluid" />
				</div>
			</nav>
			<nav class="navbar flex-column custom-text-style" style="align-items: center;">
				<a class="nav-link active custom-button-style" href="/">
					<i class="bi bi-house-fill"></i> <span class="d-none d-sm-inline ms-2">Dashboard</span>
				</a>
				<a class="nav-link custom-button-style" href="/masterstats">
					<i class="bi bi-bar-chart-fill"></i> <span class="d-none d-sm-inline ms-2">Master Stats</span>
				</a>
				<a class="nav-link custom-button-style" href="/searchplayer">
					<i class="bi bi-people-fill"></i> <span class="d-none d-sm-inline ms-2">Players</span>
				</a>
			</nav>
		</div>

		<div class="col-10 col-sm-9 col-xl-10 p-0 m-0">
			<div class="main-content">
				<div class="d-inline-flex blue-header">
					<div class="d-inline-flex" style="align-items: center; margin-left: 25px;">
						<img src="/img/LayUpBro.png" style="height: 140px;" class="img-fluid" />
						<div style="color: white;">
							<p style="margin-bottom: 0; font-size: 50px; font-weight: bold;">Dashboard</p>
							<p style="margin-bottom: 0; font-size: 15px; font-weight: 400;">
								Welcome back, <span style="font-weight: bold;">Steven!</span>
							</p>
						</div>
					</div>
					<div class="d-inline-flex" style="align-items: center; margin-right: 50px;">
						<img src="/img/ProfilePic.png" class="img-fluid" />
						<div style="color: white;">
							<p style="margin-bottom: 0; font-size: 20px; font-weight: bold;">Steven Williams</p>
							<p style="margin-bottom: 0; font-size: 15px; font-weight: 200;">Head Coach</p>
						</div>
					</div>
				</div>

				<div style="margin-top: 20px; max-width: 1250px;">
					<p style="margin-bottom: 10; color: rgb(168, 166, 166); font-weight: bold; font-size: 15px;">Quick Actions</p>
					<div class="row" style="justify-content: space-between;">
						<div class="quick-actions-tabs">
							<img src="/img/search-player.png" height="200" class="mb-3" />
							<div><a class="actions-button-style" href="/searchplayer">SEARCH PLAYER</a></div>
						</div>
						<div class="quick-actions-tabs">
							<img src="/img/master-stats.png" height="200" class="mb-3" />
							<div><a class="actions-button-style" href="/masterstats">MASTER STATS</a></div>
						</div>
						<div class="quick-actions-tabs">
							<img src="/img/input-metrics.png" height="200" class="mb-3" />
							<div><a class="actions-button-style" href="#">INPUT METRICS</a></div>
						</div>
					</div>
				</div>

				<!-- Bring over roster table here if needed -->
			</div>
		</div>
	</div>
</div>