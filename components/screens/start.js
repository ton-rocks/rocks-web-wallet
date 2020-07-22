import TonWeb from 'tonweb';

const tonweb = new TonWeb(new TonWeb.HttpProvider('http://45.137.190.200:4800/api/v1/jsonRPC'));
import mnemonic from '../../lib/mnemonic';
import {signals} from '../types';

function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

async function generateWallet(){
    let mnemonicArray = await mnemonic.generateMnemonic();
    //localStorage.setItem('words', mnemonicArray.join(','));

    const keyPair = await mnemonic.mnemonicToKeyPair(mnemonicArray);


    const wallet = tonweb.wallet.create({publicKey: keyPair.publicKey, wc: 0}); // create interface to wallet smart contract (wallet v3 by default)

    const address = await wallet.getAddress();
    //localStorage.setItem('address',  address.toString(false));
    const walletData = {
        words: mnemonicArray,
        addressList: [address.toString(false)],
        keyPair: keyPair
    };
    //localStorage.setItem('walletData', JSON.stringify(walletData));
    wallet.deploy(keyPair.secretKey);

    return walletData;
}


class Content extends React.Component{
    constructor (props){
        super (props);
    }

    generateWallet = () => {
        generateWallet().then(data => {
            this.props.toParent({
                type: signals.MNEMONIC_WORDS,
                data
            });
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
                        <button onClick={this.generateWallet} className="btn-blue screen-btn">Create My Wallet</button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button id="start_importBtn" className="btn-lite" style={{ fontWeight: 'normal'}}>Import existing wallet</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Content;