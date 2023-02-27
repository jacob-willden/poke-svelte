<script>
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
        //get10Pokemon(0, sortSelection);
    });

    // Derived from async Fetch example in Vue: https://blog.bitsrc.io/requests-in-vuejs-fetch-api-and-axios-a-comparison-a0c13f241888
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
            for(let i = offset; i <= offset + 10; i++) {
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

    function toggleFavorite(pokemonProxy) {
        const pokemon = JSON.parse(JSON.stringify(pokemonProxy)); // To extract Proxy object data, from Mert on StackOverflow: https://stackoverflow.com/questions/66605274/accessing-a-proxy-object-in-vue3

            const index = favoritePokemon.findIndex(item => item.id.toString() === pokemon.id);
            if(index === -1) {
            favoritePokemon.push(pokemon);
        }
        else {
            favoritePokemon.splice(index, 1);
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

    function changeSelectedType(type) {
        selectedType = type;
        changeOffsetAndRefresh(0);
    }
</script>

