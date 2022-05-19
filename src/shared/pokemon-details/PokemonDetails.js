import "./PokemonDetails.scss";
const PokemonDetails = (props) => {
    return (
        <div className='details-card__container'>
            <img className='details-card__img' src={props.imageSrc} />

            <div className='details-card__body'>
                <p className='details-card__name'>{props.name} </p>
                    <p className='details-card__description'>{
                        props.descriptionTranslation ?
                        (props.descriptionTranslation) : (props.description)
                    } </p>
                    
                    <button
                        className='details-card__translate-btn'
                        onClick={() => props.translateDescription()}
                    >
                        Translate!
                    </button>
                
                    {props.descriptionTranslation &&
                        <button
                            className='details-card__reset-btn'
                            onClick={() => props.resetTranslation()}
                        >
                            Reset
                        </button>
                    }
            </div>
        </div>
    );
}

export default PokemonDetails;