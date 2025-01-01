{@html `<script>
/*
@licstart  The following is the entire license notice for the
JavaScript code in this page.

Copyright (c) 2023 Jacob Willden

The Universal Permissive License (UPL), Version 1.0

Subject to the condition set forth below, permission is hereby granted to any
person obtaining a copy of this software, associated documentation and/or data
(collectively the "Software"), free of charge and under any and all copyright
rights in the Software, and any and all patent rights owned or freely
licensable by each licensor hereunder covering either (i) the unmodified
Software as contributed to or provided by such licensor, or (ii) the Larger
Works (as defined below), to deal in both

(a) the Software, and
(b) any piece of software and/or hardware listed in the lrgrwrks.txt file if
one is included with the Software (each a "Larger Work" to which the Software
is contributed by such licensors),

without restriction, including without limitation the rights to copy, create
derivative works of, display, perform, and distribute the Software and make,
use, sell, offer for sale, import, export, have made, and have sold the
Software and the Larger Work(s), and to sublicense the foregoing rights on
either these or other terms.

This license is subject to the following condition:
The above copyright notice and either this complete permission notice or at
a minimum a reference to the UPL must be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

@licend  The above is the entire license notice
for the JavaScript code in this page.
*/
</script>`}

<svelte:head>
	<title>Poké-Svelte</title>
</svelte:head>

<script>
    import { onMount } from "svelte";

	const totalPokemon = 1279;
	let offset = 0;
	let sortSelection = 'id';
    let selectedType = 1;
    let modalElement;
    let pokemonToDisplay = $state([]);
    let favoritePokemon = $state([]);

    onMount(async () => {
        get10Pokemon(0, sortSelection);
    });

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
        catch(error) {
            console.error(error);
        }
    }

    async function get10Pokemon(offset, sortSelection) {
        if(sortSelection === 'id' && offset < totalPokemon - 10) {
            const data = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
            const pokemonList = [];
            for(let pokemon of data.results) {
                const id = pokemon.url.split('/')[6];
                const singlePokemonData = await getSinglePokemonData(id);
                pokemonList.push({
                    id,
                    name: pokemon.name,
                    type: singlePokemonData.primaryType,
                    image: singlePokemonData.image
                });
            }
            pokemonToDisplay = pokemonList;
        }
        else if(sortSelection === 'type') {
            const typeList = await fetchData(`https://pokeapi.co/api/v2/type/${selectedType}`);
            pokemonToDisplay = [];

            const idexesToFetch = [];
            for(let i = offset; i <= offset + 9; i++) {
                if(i < typeList.pokemon.length - 10) {
                    idexesToFetch.push(i);
                }
            }

            const pokemonList = [];
            for(let index of idexesToFetch) {
                const id = typeList.pokemon[index].pokemon.url.split('/')[6];
                const name = typeList.pokemon[index].pokemon.name;

                const singlePokemonData = await getSinglePokemonData(id);
                pokemonList.push({
                    id,
                    name,
                    type: singlePokemonData.primaryType,
                    image: singlePokemonData.image
                });
            }
            pokemonToDisplay = pokemonList;
        }
    }

    async function getSinglePokemonData(id) {
        const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const primaryType = data.types[0].type.name;
        const image = data.sprites.other['official-artwork'].front_default;
        return {primaryType, image};
    }

    function changeOffsetAndRefresh(number) {
        if(offset + number >= 0 && offset + number <= totalPokemon) {
            offset += number;
            get10Pokemon(offset, sortSelection);
        }
    }

    function toggleFavorite(pokemon) {
        const index = favoritePokemon.findIndex(item => item.id.toString() === pokemon.id);
        if(index === -1) {
			favoritePokemon.push(pokemon);
        }
        else {
			favoritePokemon.splice(index, 1);
        }
    }

    function changeSort(selection) {
        if(selection === 'type') {
            sortSelection = selection;
            changeOffsetAndRefresh(0);
        }
    }

    function changeSelectedType(event) {
        selectedType = event.target.value;
        changeOffsetAndRefresh(0);
    }
</script>

<main>
    <h1 class="title">Poké-Svelte</h1>
    <div class="button-row">
        <span id="sort-buttons">
            <label class="radio">
                <input type="radio" onchange={() => changeSort('id')} name="sort-pokemon" value="id" checked>
                Sort by ID
            </label>
            <label class="radio">
                <input type="radio" onchange={() => changeSort('type')} name="sort-pokemon" value="type">
                Sort by Type
            </label>
        </span>
        <div class="select">
            <label for="type-select">Type</label>
            <select id="type-select" onchange={(event) => changeSelectedType(event)}>
                <option value="1">Normal</option>
                <option value="2">Fighting</option>
                <option value="3">Flying</option>
                <option value="4">Poison</option>
                <option value="5">Ground</option>
                <option value="6">Rock</option>
                <option value="7">Bug</option>
                <option value="8">Ghost</option>
                <option value="9">Steel</option>
                <option value="10">Fire</option>
                <option value="11">Water</option>
                <option value="12">Grass</option>
                <option value="13">Electric</option>
                <option value="14">Psychic</option>
                <option value="15">Ice</option>
                <option value="16">Dragon</option>
                <option value="17">Dark</option>
                <option value="18">Fairy</option>
            </select>
        </div>
    </div>
    <button onclick={() => {modalElement.showModal()}} class="favorites-button">View Favorites</button>

    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Primary Type</th>
                <th>Image</th>
                <th>Favorite?</th>
            </tr>
        </thead>
        <tbody>
            {#each pokemonToDisplay as pokemon (pokemon.id)}
            <tr>
                <td>{pokemon.id}</td>
                <td>{pokemon.name}</td>
                <td>{pokemon.type}</td>
                <td><a href={pokemon.image}>View</a></td>
                <td>
                    <input onclick={() => {toggleFavorite(pokemon)}} type="checkbox" class="checkbox favorite-button" checked={favoritePokemon.find(item => item.id === pokemon.id) ? true : false}>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>

    <div class="button-row">
        <button onclick={() => changeOffsetAndRefresh(-10)} class="button">Previous</button>
        <button onclick={() => changeOffsetAndRefresh(10)} class="button">Next</button>
    </div>

    <dialog bind:this={modalElement}>
        <button onclick={() => {modalElement.close()}}>Close</button>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Primary Type</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {#each favoritePokemon as pokemon (pokemon.id)}
                <tr>
                    <td>{pokemon.id}</td>
                    <td>{pokemon.name}</td>
                    <td>{pokemon.type}</td>
                    <td><a href={pokemon.image}>View</a></td>
                </tr>
                {/each}
            </tbody>
        </table>
    </dialog>
    <p>This project uses the <a href="https://pokeapi.co/">the PokéAPI (Pokémon Application Programming Interface)</a>.</p>
	<a href="/javascript" rel="jslicense">JavaScript Licenses</a>
</main>

<style>
    main {
        padding: 2rem 1rem;
        max-width: 30rem;
        margin: 0 auto;
    }
	h1 {
		font-size: 2rem;
	}
	.button-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
	}
	.select {
		margin-left: 1rem;
	}
	.favorites-button {
		margin-bottom: 1rem;
	}
    table {
        width: 100%;
    }
    thead th {
        text-align: start;
    }
</style>