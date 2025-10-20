<svelte:head>
	<title>Statslam | Search Player</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="/css/dashboard.css" />
	<link rel="stylesheet" href="/css/searchplayer.css" />
</svelte:head>

<div class="container-fluid" style="font-family: Montserrat;">
	<div class="row" style="height: 100vh;">
		<div class="col-2 col-sm-3 col-xl-2" style="background-color: rgb(38, 38, 200);">
			<nav class="navbar border-bottom border-white mb-5">
				<div class="container-fluid">
					<img src="/img/StatSlamLogo.png" style="margin: 0px 15px;" class="img-fluid" />
				</div>
			</nav>
			<nav class="navbar flex-column custom-text-style" style="align-items: center;">
				<a class="nav-link custom-button-style" href="/"><i class="bi bi-house-fill"></i> <span class="d-none d-sm-inline ms-2">Dashboard</span></a>
				<a class="nav-link custom-button-style" href="/masterstats"><i class="bi bi-bar-chart-fill"></i> <span class="d-none d-sm-inline ms-2">Master Stats</span></a>
				<a class="nav-link custom-button-style" href="#"><i class="bi bi-people-fill"></i> <span class="d-none d-sm-inline ms-2">Players</span></a>
			</nav>
		</div>

		<div class="col-10 col-sm-9 col-xl-10 p-0 m-0">
			<div class="main-content">
				<div class="d-inline-flex blue-header">
					<div class="d-inline-flex" style="align-items: center; margin-left: 25px;">
						<img src="/img/team-stats.png" style="height: 140px;" class="img-fluid" />
						<div style="color: white;">
							<p style="margin-bottom: 0; font-size: 50px; font-weight: bold;">Players</p>
							<p style="margin-bottom: 0; font-size: 15px; font-weight: 400;">Know more about the roster</p>
						</div>
					</div>
					<div class="d-inline-flex" style="align-items: center; margin-right: 50px;">
						<img src="/img/ProfilePic.png" style="margin: 0px 15px;" class="img-fluid" />
						<div style="color: white;">
							<p style="margin-bottom: 0; font-size: 20px; font-weight: bold;">Steven Williams</p>
							<p style="margin-bottom: 0; font-size: 15px; font-weight: 200;">Head Coach</p>
						</div>
					</div>
				</div>

				<div class="search-bar">
					<i class="icon-search">🔍</i>
					<input type="text" placeholder="Search player name and number" />
				</div>

				<script>
				  import { onMount } from 'svelte';
				  
				  let athletes = [];
				  let loading = true;
				  let error = null;
				  
				  onMount(async () => {
				    try {
				      const response = await fetch('/api/athletes');
				      if (!response.ok) throw new Error('Failed to fetch athletes');
				      athletes = await response.json();
				    } catch (e) {
				      error = e.message;
				    } finally {
				      loading = false;
				    }
				  });
				</script>

				<div class="team-roster">
					<h2>Team Rosters</h2>
					<table>
						<thead>
							<tr>
								<th>Player</th>
								<th>Position</th>
								<th>Number</th>
								<th>Last Game Play</th>
							</tr>
						</thead>
						<tbody>
							{#if loading}
							  <tr>
							    <td colspan="4" class="text-center">Loading...</td>
							  </tr>
							{:else if error}
							  <tr>
							    <td colspan="4" class="text-center text-red-500">Error: {error}</td>
							  </tr>
							{:else if athletes.length === 0}
							  <tr>
							    <td colspan="4" class="text-center">No athletes found</td>
							  </tr>
							{:else}
							  {#each athletes as athlete}
							    <tr>
							      <td>{athlete.name}</td>
							      <td>{athlete.position || '-'}</td>
							      <td>{athlete.number || '-'}</td>
							      <td>{athlete.lastPlay ? new Date(athlete.lastPlay).toLocaleDateString() : '-'}</td>
							    </tr>
							  {/each}
							{/if}
						</tbody>
					</table>
				</div>

				<footer>
					<ul class="footer-links">
						<li><a href="#">About Us</a></li>
						<li><a href="#">FAQs</a></li>
						<li><a href="#">Contact Us</a></li>
						<li><a href="#">License</a></li>
					</ul>
					<p>Copyright @ 2025, StatSlam</p>
				</footer>
			</div>
		</div>
	</div>
</div>