import "./ErrorAlert.scss";

const ErrorAlert = (props) => {
    return (
        <div className="error-alert__container">
            <p className="error-alert__title">Oops... something went wrong</p>
            <p className="error-alert__error-string">{props.errorString}</p>
        </div>
    );
}

export default ErrorAlert;