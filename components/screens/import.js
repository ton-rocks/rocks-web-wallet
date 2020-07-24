import TonWeb from "tonweb";
const tonweb = new TonWeb(new TonWeb.HttpProvider('http://45.137.190.200:4800/api/v1/jsonRPC'));
import {signals} from "../types";



async function importWallet(mnemonic){
    const bip39 = TonWeb.utils.bip39;
    const nacl = TonWeb.utils.nacl;
    mnemonic = mnemonic.join(' ');

    let seed = await bip39.mnemonicToSeed(mnemonic);

    const keyPair = nacl.sign.keyPair.fromSeed(seed.subarray(0, 32));

    const wallet = tonweb.wallet.create({publicKey: keyPair.publicKey, wc: 0}); // create interface to wallet smart contract (wallet v3 by default)

    const address = await wallet.getAddress();

    return {
        words: mnemonic,
        address: address.toString(false),
        keyPair: keyPair
    };
}

class Content extends React.Component{
    constructor (props){
        super (props);
        let fields = [];
        for (let i = 0; i < 12; i++){
            fields.push('');
        }
        this.state = {
            fields: fields
        };
    }
    handleSubmit(e){
        e.preventDefault();
        importWallet(this.state.fields).then(data => {
            this.props.toParent({
                type: signals.MNEMONIC_WORDS,
                data
            });
        });
    }
    handleChange(e){
        let fields = this.state.fields;
        fields[e.target.getAttribute('tabindex') - 1] = e.target.value;
        this.setState({
            fields
        });
    }
    render(){
        return (
            <div id="import" className="screen" style={{ textAlign: 'center' }}>
                <div className="screen-title" style={{ marginTop: '80px' }}>12 Secret Words</div>
                <div className="screen-text" style={{ marginBottom: '10px' }}>
                    Please restore access to your wallet by<br />
                    entering the 12 secret words you wrote<br />
                    down when creating the wallet.
                </div>

                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div id="importWords">
                        <div className="word-item">
                            <span className="word-num">1.</span>
                            <input type="text" tabIndex="1" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">7.</span>
                            <input type="text" tabIndex="7" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">2.</span>
                            <input type="text" tabIndex="2" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">8.</span>
                            <input type="text" tabIndex="8" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">3.</span>
                            <input type="text" tabIndex="3" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">9.</span>
                            <input type="text" tabIndex="9" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">4.</span>
                            <input type="text" tabIndex="4" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">10.</span>
                            <input type="text" tabIndex="10" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">5.</span>
                            <input type="text" tabIndex="5" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">11.</span>
                            <input type="text" tabIndex="11" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">6.</span>
                            <input type="text" tabIndex="6" onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className="word-item">
                            <span className="word-num">12.</span>
                            <input type="text" tabIndex="12" onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>

                    <div style={{ clear: 'both' }}>
                        <button id="import_continueBtn" type="submit" className="btn-blue screen-btn" style={{ marginTop: '30px', 'marginBottom': '20px' }}>
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Content;