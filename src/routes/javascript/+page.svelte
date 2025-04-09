<svelte:head>
	<title>JavaScript Licenses - Poké-Svelte</title>
</svelte:head>

<script>
	const {data} = $props();
</script>

<main>
	<table id="jslicense-labels1">
		<tbody>
			{#each data.files as file}
				<tr>
					<td><a href={file.name}>{file.name}</a></td>
					<td><a href={file.licenseURL}>{file.licenseName}</a></td>
					<td><a href={file.sourceURL}>{file.sourceName}</a></td>
				</tr>
			{/each}
		</tbody>
	</table>
	<a href="/javascript" rel="jslicense">JavaScript Licenses</a>
</main>