const QRCode = require('qrcode');
import TonWeb from 'tonweb';
import copy from 'copy-to-clipboard';
import {signals} from '../types';
const tonweb = new TonWeb(new TonWeb.HttpProvider('http://45.137.190.200:4800/api/v1/jsonRPC'));

async function getBalance() {
    const walletData = JSON.parse(sessionStorage.getItem('walletData'));
    const publicKey = Object.values(walletData.keyPair.publicKey);
    const wallet = tonweb.wallet.create({publicKey: publicKey, wc: 0});
    const address = await wallet.getAddress();
    console.log('address2 = ' + address.toString(false));
    let balance = await tonweb.getBalance(address);
    balance = Math.round(balance / 1000000) / 1000;
    return balance;
}

class Content extends React.Component{
    constructor (props){
        super (props);
        this.state = {
            showReceive: false,
            qrCode: '',
            address: '',
            copiedToClipboard: false,
            balance: '000.000'
        };
    }
    componentDidMount(){
        const walletData = JSON.parse(sessionStorage.getItem('walletData'));
        this.setState({
            address: walletData['address']
        });
        getBalance().then((data) => {
            this.setState({
                balance: data
            });
        });
    }
    handleClickMenu(){
        this.props.toParent({
            type: signals.SWITCH_MENU_PANEL
        });
    }
    handleRefresh(){
        window.location.reload(false);
    }
    handleClickReceive(){
        this.props.toParent({
            type: signals.LOAD_MAIN
        });
        const $this = this;
        QRCode.toString(this.state.address, (err, string) => {
            if (err) throw err;
            $this.setState({
                qrCode: {__html: string},
                showReceive: !this.state.showReceive
            });
        });

    }
    handleShare(){
        copy('ton://transfer/' + this.state.address);
        this.setState({
            copiedToClipboard: true
        });
        setTimeout(() => {
            this.setState({
                copiedToClipboard: false
            });
        }, 2000);
    }

    render(){

        return (
            <div id="main" className="screen">
                <div className="head">
                    <div className="head-row">
                        <button id="main_refreshBtn" onClick={this.handleRefresh.bind(this)} className="btn-round" style={{ backgroundImage: 'url("/assets/refresh.svg")' }}></button>

                        <div id="updateLabel"></div>

                        <button id="main_settingsButton" onClick={this.handleClickMenu.bind(this)} className="btn-round" style={{ backgroundImage: 'url("/assets/menu.svg")' }}></button>
                    </div>

                    <div id="balance">{this.state.balance}</div>
                    <div className="your-balance">Your balance</div>

                    <button id="main_receiveBtn" className="btn-blue" onClick={this.handleClickReceive.bind(this)}>
                        <div className="btn-icon" style={{ backgroundImage: 'url("/assets/down-left.svg")' }}></div>
                        Receive
                    </button>

                    <button id="sendButton" className="btn-blue">
                        <div className="btn-icon" style={{ backgroundImage: 'url("/assets/down-left.svg")', transform: 'rotate(180deg)' }}></div>
                        Send
                    </button>
                </div>

                <div id="transactionsContainer">
                    <div id="transactionsList"></div>
                    <div id="walletCreated">
                        <div>Wallet Created</div>
                    </div>
                </div>


                {
                    this.state.showReceive ? (
                        <>
                            <div id="modal" style={{ display: 'block' }}></div>
                            <div id="receive" className="popup">
                                <div className="popup-title">Receive Grams</div>
                                <div className="popup-text">Share this address to receive Test Grams.<br />
                                    Note: this link won't work for real Grams.
                                </div>

                                <div className="qr-container">
                                    <div id="qr" dangerouslySetInnerHTML={this.state.qrCode}></div>
                                </div>

                                <div className="my-addr addr"></div>

                                <button id="receive_invoiceBtn" className="btn-lite">Create Invoice</button>

                                <button id="receive_shareBtn" className="btn-blue" onClick={this.handleShare.bind(this)}>Share Wallet Address</button>

                                <button id="receive_closeBtn" className="popup-close-btn" onClick={this.handleClickReceive.bind(this)}></button>
                            </div>
                            {
                                this.state.copiedToClipboard ? <div id="notify" style={{marginTop: '100px'}}>Transfer link copied to clipboard</div> : ''
                            }
                        </>
                    ) : ''
                }


            </div>
        );
    }
}

export default Content;

