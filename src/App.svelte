<script>
    import 'bulma/css/bulma.min.css'; // From Carlos Roso: https://carlosroso.com/how-to-import-css-files-to-svelte/
    import { onMount } from "svelte";

    let pokemonToDisplay = [];
    let totalPokemon = 1279;
    let offset = 0;
    let sortSelection = 'id';
    let favoritePokemon = [];
    let modalVisible = false;
    let selectDisabled = true;
    let selectedType = 1;

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
            //console.log('typeList:', typeList);
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
            console.log('new offset:', offset);
            get10Pokemon(offset, sortSelection);
        }
    }

    function toggleFavorite(pokemon) {
        const index = favoritePokemon.findIndex(item => item.id.toString() === pokemon.id);
        if(index === -1) {
            favoritePokemon = [...favoritePokemon, pokemon]; // Reactive alternative to push, from the official Svelte tutorial: https://svelte.dev/tutorial/updating-arrays-and-objects
        }
        else {
            favoritePokemon = favoritePokemon.filter(item => item.id.toString() !== pokemon.id); // Reactive alternative to splice, from Tholle on StackOverflow: https://stackoverflow.com/questions/58964087/how-to-update-an-array-after-splice-in-svelte
        }
        //console.log('new favorites:', favoritePokemon);
    }

    function changeSort(selection) {
        sortSelection = selection;
        if(selection === 'id') {
            selectDisabled = true;
        }
        else if(selection === 'type') {
            selectDisabled = false;
        }
        changeOffsetAndRefresh(0);
    }

    function changeSelectedType(event) {
        selectedType = event.target.value;
        changeOffsetAndRefresh(0);
    }
</script>

<main>
    <h1 class="title">Pok??mon Vue App</h1>
    <div class="button-row">
        <span id="sort-buttons">
            <label class="radio">
                <input type="radio" on:change={() => changeSort('id')} name="sort-pokemon" value="id" checked>
                Sort by ID
            </label>
            <label class="radio">
                <input type="radio" on:change={() => changeSort('type')} name="sort-pokemon" value="type">
                Sort by Type
            </label>
        </span>
        <div class="select">
            <select on:change={(event) => changeSelectedType(event)} disabled={selectDisabled}>
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
    <button on:click={() => {modalVisible = true}} class="button favorites-button">View Favorites</button>

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
                    <input on:click={() => {toggleFavorite(pokemon)}} type="checkbox" class="checkbox favorite-button" checked={favoritePokemon.find(item => item.id === pokemon.id) ? true : false}>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>

    <div class="button-row">
        <button on:click={() => changeOffsetAndRefresh(-10)} class="button">Previous</button>
        <button on:click={() => changeOffsetAndRefresh(10)} class="button">Next</button>
    </div>

    <div class="modal {modalVisible ? 'is-active' : ''}">
        <div class="modal-background"></div>

        <div class="modal-content">
            <div class="box">
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
            </div>
        </div>

        <button on:click={() => {modalVisible = false}} class="modal-close is-large" aria-label="close"></button>
    </div>
    <p>This project is for educational uses only.</p>
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
</style>