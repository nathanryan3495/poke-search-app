import "./LoadingSpinner.scss";

// This component I did not create years ago I found a useful
// free to use purely css loading spinner (3 dots) that works
// perfectly for any form of loading component
// Ref: https: //projects.lukehaas.me/css-loaders/

const LoadingSpinner = () => {
    return (
        <div className='loader'>
            Loading....
          </div>
    );
}

export default LoadingSpinner;