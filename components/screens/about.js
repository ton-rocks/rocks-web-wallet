import {signals} from "../types";

class Content extends React.Component {
    constructor (props){
        super (props);
    }
    handleClose(){
        this.props.toParent({
            type: signals.LOAD_MAIN
        });
    }
    render(){
        return (
            <div id="about" className="popup" style={{ textAlign: 'center', paddingBottom: '10px' }}>

                <div className="middle">
                    <div className="popup-title">Gram Wallet</div>
                    <div className="popup-grey-text">
                        Version: 1
                    </div>
                    <div className="popup-grey-text">
                        Developed by <a href="https://t.me/ramauf" target="_blank">@ramauf</a>
                    </div>

                    <div className="popup-grey-text" style={{ lineHeight: '24px' }}>
                        <a href="https://github.com/ton-rocks/rocks-web-wallet" target="_blank">GitHub</a>
                    </div>

                    <div className="popup-footer">
                        <button id="about_closeBtn" className="btn-lite" onClick={this.handleClose.bind(this)}>CLOSE</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Content;
