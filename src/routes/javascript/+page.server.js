import {dev} from '$app/environment';
import {readdirSync} from 'fs';

const parentPath = '/_app/immutable';

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
		let files = [];
		const folders = ['chunks', 'entry', 'nodes'];
		for(let folder of folders) {
			files.push(getFilePathsFromFolder(`${parentPath}/${folder}`));
		}
		return {files: files.flat()};
	}
}