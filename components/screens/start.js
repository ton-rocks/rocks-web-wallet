import TonWeb from 'tonweb';
const tonweb = new TonWeb(new TonWeb.HttpProvider('http://45.137.190.200:4800/api/v1/jsonRPC'));
import {signals} from '../types';

async function createWallet(){
    const bip39 = TonWeb.utils.bip39;
    const nacl = TonWeb.utils.nacl;
    let mnemonic = bip39.generateMnemonic();

    //console.log('validate=', bip39.validateMnemonic(mnemonic));

    let seed = await bip39.mnemonicToSeed(mnemonic);

    const keyPair = nacl.sign.keyPair.fromSeed(seed.subarray(0, 32));



    /*let secretKey = keyPair.secretKey;
    console.log('secretKey=', TonWeb.utils.bytesToHex(secretKey));
    console.log('publicKey=', TonWeb.utils.bytesToHex(keyPair.publicKey));

    console.log(mnemonicArray);return;*/

    //const keyPair = await mnemonic.mnemonicToKeyPair(mnemonicArray);

    const wallet = tonweb.wallet.create({publicKey: keyPair.publicKey, wc: 0}); // create interface to wallet smart contract (wallet v3 by default)

    const address = await wallet.getAddress();
    const walletData = {
        words: mnemonic,
        address: address.toString(false),
        keyPair: keyPair
    };
    //wallet.deploy(keyPair.secretKey);

    return walletData;
}


class Content extends React.Component{
    constructor (props){
        super (props);
    }

    createWallet = () => {
        createWallet().then(data => {
            this.props.toParent({
                type: signals.MNEMONIC_WORDS,
                data
            });
        });
    };

    importWallet(){
        this.props.toParent({
            type: signals.LOAD_IMPORT
        });
    };

    render(){

        return (
            <div id="start" className="screen">
                <div className="middle">
                    <div className="screen-title">Gram Wallet</div>
                    <div className="screen-text">
                        Gram wallet allows you to make fast and<br />
                        secure blockchain-based payments<br />
                        without intermediaries.
                    </div>
                    <div style={{ marginTop: '95px' }}>
                        <button onClick={this.createWallet} className="btn-blue screen-btn">Create My Wallet</button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button onClick={this.importWallet.bind(this)} className="btn-lite" style={{ fontWeight: 'normal'}}>Import existing wallet</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Content;