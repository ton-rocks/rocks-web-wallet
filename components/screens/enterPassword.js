import {signals} from '../types';
class Content extends React.Component{
    constructor (props){
        super (props);
        this.state = {
            wrongPassword: false
        };
    }
    handleChange(e){
        this.setState({
            password: e.target.value
        });
    }
    handleLogin(){
        try {
            const data = this.props.decrypt(localStorage.getItem('walletData'), this.props.hash(this.state.password));
            this.setState({
                wrongPassword: false
            });
            this.props.toParent({
                type: signals.PASSWORD_ENTERED,
                password: this.state.password
            });
        }catch(e){
            this.setState({
                wrongPassword: true
            });

        }
    }
    handleNewWallet(){
        sessionStorage.clear();
        localStorage.clear();
        this.props.toParent({
            type: signals.LOAD_START
        });
    }
    render(){
        return (
            <div id="enterPassword" className="popup" style={{ paddingBottom: '10px'}}>
                <div className="popup-title">Password</div>

                <input id="enterPassword_input" placeholder="Enter your password" onChange={this.handleChange.bind(this)} type="password" style={{ textAlign: 'center', width: '200px', marginLeft: '40px', fontSize: '15px'}} />

                {this.state.wrongPassword ? <div className="popup-footer">
                    <div style={{color: 'rgb(249 95 48)', 'fontSize': '10px', fontWeight: '700', background: '0 0', textAlign: 'center'}}>
                        WRONG PASSWORD
                    </div>
                </div> : <></>}
                <div className="popup-footer">
                    <button id="enterPassword_cancelBtn" className="btn-lite" onClick={this.handleNewWallet.bind(this)} style={{float: 'left'}}>NEW WALLET</button>
                    <button id="enterPassword_okBtn" className="btn-lite" onClick={this.handleLogin.bind(this)}>LOG IN</button>
                </div>
            </div>
        )
    }
}

export default Content;