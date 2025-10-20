<svelte:head>
	<title>Statslam | Master Stats</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="/css/masterStats.css" />
</svelte:head>

<div class="container-fluid" style="font-family: Montserrat;">
	<div class="row" style="height: 100vh;">
		<div class="col-2 col-sm-3 col-xl-2" style="background-color: rgb(38, 38, 200);">
			<nav class="navbar border-bottom border-white mb-5" data-bs-theme="dark">
				<div class="container-fluid"><img src="/img/StatSlamLogo.png" class="img-fluid" /></div>
			</nav>
			<nav class="navbar flex-column custom-text-style" style="align-items: center;">
				<a class="nav-link custom-button-style" href="/"><i class="bi bi-house-fill"></i> <span class="d-none d-sm-inline ms-2">Dashboard</span></a>
				<a class="nav-link active custom-button-style" href="/masterstats"><i class="bi bi-bar-chart-fill"></i> <span class="d-none d-sm-inline ms-2">Master Stats</span></a>
			</nav>
		</div>

		<div class="col-10 col-sm-9 col-xl-10 p-0 m-0">
			<div class="main-content">
				<div class="d-inline-flex blue-header">
					<div class="d-inline-flex" style="align-items: center; margin-left: 25px;">
						<img src="/img/master-stats-header-icon.png" style="height: 110px;" class="img-fluid" />
						<div style="color: white;">
							<p style="margin-bottom: 0; font-size: 50px; font-weight: bold;">Master Stats</p>
							<p style="margin-bottom: 0; font-size: 15px; font-weight: 400;">All Player Stats</p>
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

				<div class="master-stats-table" style="margin-top: 50px; max-width: 1250px;">
					<table class="table">
						<thead>
							<tr>
								<td style="font-weight: bold;">Name</td>
								<td style="font-weight: bold;">Team</td>
								<td style="font-weight: bold;">PTS</td>
								<td style="font-weight: bold;">FGA</td>
								<td style="font-weight: bold;">FGM</td>
								<td style="font-weight: bold;">FG%</td>
								<td style="font-weight: bold;">3PA</td>
								<td style="font-weight: bold;">3PM</td>
								<td style="font-weight: bold;">3P%</td>
								<td style="font-weight: bold;">FTA</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Abrasaldo #10</td><td>USI FALCONS</td><td>9</td><td>3</td><td>1</td><td>20.0%</td><td>1</td><td>0</td><td>0.00%</td><td>0</td>
							</tr>
							<!-- Populate rest as needed -->
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>