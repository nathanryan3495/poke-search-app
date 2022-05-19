import "./App.scss";
import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './shared/loading-spinner/LoadingSpinner';
import ErrorAlert from './shared/error-alert/ErrorAlert';
import PokemonDetails from './shared/pokemon-details/PokemonDetails';

const App = () => {
  const [hasError, setError] = useState(null);
  const [errorString, setErrorString] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [pokemonName, setPokemonName] = useState(null);
  const [pokemonSprite, setPokemonSprite] = useState(null);
  const [pokemonDescription, setPokemonDescription] = useState(null);
  const [descriptionTranslation, setDescriptionTranslation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rather than individually call mutliple hooks create a helper
  // function to call all the ones relevant at the same time for
  // both resetting errors and the form itself
  const resetErrors = () => {    
      setError(false);
      setErrorString('')
      setPokemonName(null);
  }

  const resetForm = () => {
      setPokemonName(null);
      setPokemonSprite(null);
      pokemonDescription(null);
      setDescriptionTranslation(null);
      resetErrors();
  }

  // Due to limitations within the pokemon api where by the description is only 
  // provided (that I could find) on the species endpoint. But the result of that
  // endpoint did not have the sprite.
  const findPokemon = async () => {
    resetErrors();    
    setIsLoading(true);
    setDescriptionTranslation(null);

    if (!searchQuery) {
      setError(true);
      setErrorString('Search query cannot be empty');
      setIsLoading(false);
      return;
    }

    if (searchQuery.length > 200) {
      setError(true);
      setErrorString('Search query cannot be longer than 200 characters.');
      setIsLoading(false);
      return;
    }

    await axios
      .get(`https://pokeapi.co/api/v2/pokemon-species/${searchQuery}`)
      .then((res) => {
        const description = res.data.flavor_text_entries.find((a) => a.language['name'] === 'en');
        setPokemonName(res.data.name);
        const formattedDescription = description ? description.flavor_text : null
        setPokemonDescription(formattedDescription)
        getPokemonSprite(res.data.name)
      })
      .catch((err) => {
        setError(true);
        setErrorString(`Pokemon with name '${searchQuery}' could not be found.`)
      });
    
    setIsLoading(false);
  }

  // This is why I have to make 2 calls firstly to get the name and 
  // description and then a second to get the sprite.
  const getPokemonSprite = async (pokemonName) => {
    await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((res) => {
        setPokemonSprite(res.data.sprites.front_shiny)
      })
      .catch((err) => {
        setError(true);
        setErrorString(`Unable to fetch ${pokemonName}'s image.`)
      });
  }

  const translateDescription = async () => {
    await axios
      .get(`https://api.funtranslations.com/translate/shakespeare.json?text=${pokemonDescription}`)
      .then((res) => {
        setDescriptionTranslation(res.data.contents.translated)
      })
      .catch((err) => {
        setError(true);
        setErrorString(`Unable to translate.`)
      });
  }

  const pokemonFound = pokemonSprite && pokemonName && pokemonDescription;
  return (
      <div className='poke-search__container'>
          <h1 className='poke-search__title'>Poke-Search</h1>
      
          <div className='poke-search__form-container'>
        <input
          placeholder="Please enter a name"
              className='poke-search__name-input'
              type='text'
              name="name"
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className='poke-search__submit-btn' onClick={findPokemon}>Search</button>
            {pokemonFound && <button className='poke-search__submit-btn' onClick={resetForm}>Reset</button>}
          </div>
          
          {pokemonFound &&
            <PokemonDetails
              imageSrc={pokemonSprite}
              name={pokemonName}
              description={pokemonDescription}
              descriptionTranslation={descriptionTranslation}
              translateDescription={translateDescription}
              resetTranslation={() => setDescriptionTranslation(null)}
            />
          }
        
        {isLoading && <LoadingSpinner />}
      
        {hasError && <ErrorAlert errorString={errorString} /> }
      </div>        
    );
};

export default App;