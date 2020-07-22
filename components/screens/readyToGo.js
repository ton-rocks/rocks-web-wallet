import {signals} from '../types';
class Content extends React.Component{
    constructor (props){
        super (props);
    }
    handleContinue(){
        this.props.toParent({
            type: signals.LOAD_MAIN
        });
    }
    render(){
        return(
            <div id="readyToGo" className="screen">
                <div className="middle">

                    <div className="screen-title">Ready to go!</div>

                    <div className="screen-text">
                        You're all set. Now you have a wallet that<br />
                        only you control - directly, without<br />
                        middlemen or bankers.
                    </div>

                    <div>
                        <button id="readyToGo_continueBtn" onClick={this.handleContinue.bind(this)} className="btn-blue screen-btn" style={{ marginTop: '170px', 'marginBottom': '20px' }}>
                            View My Wallet
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;