import {dev} from '$app/environment';
import {readdirSync} from 'fs';

const parentPath = '_app/immutable';

function getFilePathsFromFolder(path) {
	let filePaths = [];
	const fileNames = readdirSync(`./.svelte-kit/output/client/${path}`);
	for(let file of fileNames) {
		filePaths.push(`${path}/${file}`);
	}
	return filePaths;
}

export const load = () => {
	if(dev) {
		return {files: []}; // Need to figure out the directories for development
	}
	else {
		let fileNames = [];
		const folders = ['chunks', 'entry', 'nodes'];
		for(let folder of folders) {
			fileNames.push(getFilePathsFromFolder(`${parentPath}/${folder}`));
		}
		const flattenedFileNames = fileNames.flat();
		let files = [];
		for(let fileName of flattenedFileNames) {
			const isFromSvelteKit = !fileName.startsWith('/_app/immutable/nodes/2.');
			if(isFromSvelteKit) {
				files.push({
					name: fileName,
					licenseURL: 'https://www.jclark.com/xml/copying.txt',
					licenseName: 'Expat',
					sourceURL: 'https://github.com/sveltejs/kit',
					sourceName: 'SvelteKit'
				});
			}
			else {
				files.push({
					name: fileName,
					licenseURL: 'https://oss.oracle.com/licenses/upl/',
					licenseName: 'UPL-1.0',
					sourceURL: 'https://github.com/jacob-willden/poke-svelte/blob/main/src/routes/%2Bpage.svelte',
					sourceName: 'src/routes/+page.svelte'
				});
			}
		}
		return {files};
	}
}