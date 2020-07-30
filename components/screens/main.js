const QRCode = require('qrcode');
import TonWeb from 'tonweb';
import copy from 'copy-to-clipboard';
import {signals} from '../types';
const tonweb = new TonWeb(new TonWeb.HttpProvider('http://45.137.190.200:4800/api/v1/jsonRPC'));

async function getTransactions(last){
    const walletData = JSON.parse(sessionStorage.getItem('walletData'));
    const publicKey = Object.values(walletData.keyPair.publicKey);
    const wallet = tonweb.wallet.create({publicKey: publicKey, wc: 0});
    const address = await wallet.getAddress();
    return await tonweb.provider.getTransactions(address.toString(), 200);
}
async function getWalletInfo() {
    try {
        const walletData = JSON.parse(sessionStorage.getItem('walletData'));
        const publicKey = Object.values(walletData.keyPair.publicKey);
        const wallet = tonweb.wallet.create({publicKey: publicKey, wc: 0});
        const address = await wallet.getAddress();
        const addressInfo = await tonweb.provider.getAddressInfo(address.toString(true, true, true, false));
        let response = {
            deployed: false,
            balance: Math.round(addressInfo.balance / 1000000) / 1000
        };
        const secretKey = new Uint8Array(Object.values(walletData.keyPair.secretKey));
        const deploy = wallet.deploy(secretKey); // deploy method

        if (addressInfo.code !== ''){
            response.deployed = true;
        }else{
            const deploySended = await deploy.send() // deploy wallet contract to blockchain
        }
        return response;
    }catch(e){
        //window.location.reload(false);
    }
}

async function sendCoins(sendAddress, sendAmount, sendComment){
    let sended = false;
    try {
        const walletData = JSON.parse(sessionStorage.getItem('walletData'));
        const publicKey = Object.values(walletData.keyPair.publicKey);
        const secretKey = new Uint8Array(Object.values(walletData.keyPair.secretKey));
        const wallet = tonweb.wallet.create({publicKey: publicKey, wc: 0});

        const seqno = await wallet.methods.seqno().call(); // call get-method `seqno` of wallet smart contract
        const transfer = wallet.methods.transfer(
            {
                secretKey: secretKey,
                toAddress: sendAddress,
                amount: TonWeb.utils.toNano(sendAmount), // 0.01 Gram
                seqno: seqno,
                payload: sendComment,
                sendMode: 3,
            }
        );
        const transferQuery = await transfer.getQuery(); // get transfer query Cell

        const transferFee = await transfer.estimateFee();   // get estimate fee of transfer

        const transferSended = await transfer.send();  // send transfer query to blockchain

        sended = transferSended['@type'] == 'ok';
    } catch(e) {
        return sended;
    }
    return sended;
}

class Content extends React.Component{
    constructor (props){
        super (props);
        this.state = {
            showReceive: false,
            showSend: false,
            qrCode: '',
            address: '',
            copiedToClipboard: false,
            balance: 'updating...',
            deployed: false,
            transactions: [],
            updateMessage: 'loading...',
            sendAddress: '',
            sendAmount: '',
            sendComment: '',
            sendInProgress: false,
            showTransaction: false,
            transactionInfo: {
                amount: 0,
                fee: 0,
                addr: '',
                date: ''
            }
        };
    }
    componentDidMount(){
        const walletData = JSON.parse(sessionStorage.getItem('walletData'));
        this.setState({
            address: walletData['address']
        });
        getWalletInfo().then(data => {
            this.setState({
                balance: data.balance,
                deployed: data.deployed,
                updateMessage: ''
            });
        });
        getTransactions().then(data => {
            this.setState({
                transactions: data.transactions
            });
        });
    }
    handleChangeField(type, e){
        this.setState({
            [type]: e.target.value
        });
    }
    handleClickMenu(){
        this.props.toParent({
            type: signals.SWITCH_MENU_PANEL
        });
    }
    handleClickRefresh(){
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
    handleClickSend(){
        this.props.toParent({
            type: signals.LOAD_MAIN
        });

        this.setState({
            showSend: !this.state.showSend
        });
    }
    handleClickSendSubmit(){
        this.setState({
            sendInProgress: true
        });

        sendCoins(this.state.sendAddress, this.state.sendAmount, this.state.sendComment).then(data => {
            this.setState({
                sendInProgress: false
            });
            console.log(data);
            if (data['@type'] == 'ok'){
                this.setState({
                    balance: this.state.balance - this.state.sendAmount
                });
            }
        });
    }
    handleClickTransaction(data){
        let transactionInfo = {
            amount: 0,
            fee: 0,
            addr: '',
            date: ''
        };
        if (data !== ''){
            let info = this.parseTransaction(data);
            transactionInfo.amount = info.amount;
            transactionInfo.fee = info.fee;
            transactionInfo.addr = info.addr;
            transactionInfo.date = info.date.toDateString()+ ' ' + info.date.getHours() + ':' + info.date.getMinutes() + ':' + info.date.getSeconds();
        }

        this.setState({
            showTransaction: !this.state.showTransaction,
            transactionInfo
        });
    }
    handleClickShare(){
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
    parseTransaction(data){
        let type = '';
        let outMsgValue = 0;
        let amount = 0;
        let addr = '';

        if (data.out_msgs.length > 0)
            outMsgValue = data.out_msgs[0].value*1;

        if (data.in_msg.value*1 == 0 && outMsgValue > 0){
            type = 'out';
            addr = new TonWeb.Address(data.out_msgs[0].destination.account_address).toString(false);
            amount = TonWeb.utils.fromNano(data.out_msgs[0].value).toString();
        }
        if (data.in_msg.value*1 > 0 && outMsgValue == 0){
            type = 'in';
            addr = new TonWeb.Address(data.in_msg.source.account_address).toString(false);
            amount = TonWeb.utils.fromNano(data.in_msg.value).toString();
        }
        if (data.in_msg.value*1 > 0 && outMsgValue > 0){
            type = 'exch';
        }
        if (data.in_msg.value*1 == 0 && outMsgValue == 0){
            type = 'func';
            addr = new TonWeb.Address(data.in_msg.destination.account_address).toString(false);
            amount = TonWeb.utils.fromNano(data.fee).toString();
        }
        let fee = TonWeb.utils.fromNano(data.fee).toString();
        let date = new Date(data.utime * 1000);
        return {type, amount, fee, addr, date};
    }

    render(){

        return (
            <div id="main" className="screen">
                <div className="head">
                    <div className="head-row">
                        <button id="main_refreshBtn" onClick={this.handleClickRefresh.bind(this)} className="btn-round" style={{ backgroundImage: 'url("/assets/refresh.svg")' }}></button>

                        <div id="updateLabel">
                            {
                                this.state.updateMessage
                            }
                        </div>

                        <button id="main_settingsButton" onClick={this.handleClickMenu.bind(this)} className="btn-round" style={{ backgroundImage: 'url("/assets/menu.svg")' }}></button>
                    </div>

                    <div id="balance">{this.state.balance}</div>
                    <div className="your-balance">Your balance</div>

                    <button id="main_receiveBtn" className="btn-blue" onClick={this.handleClickReceive.bind(this)}>
                        <div className="btn-icon" style={{ backgroundImage: 'url("/assets/down-left.svg")' }}></div>
                        Receive
                    </button>

                    <button id="sendButton" className="btn-blue" onClick={this.handleClickSend.bind(this)}>
                        <div className="btn-icon" style={{ backgroundImage: 'url("/assets/down-left.svg")', transform: 'rotate(180deg)' }}></div>
                        Send
                    </button>
                </div>

                <div id="transactionsContainer">
                    <div id="transactionsList">
                        <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                            <tr>
                                <th>Type</th>
                                <th>Address</th>
                                <th>Amount</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                        {this.state.transactions.map((val, ind) => {
                            let {type, amount, addr, date} = this.parseTransaction(val);
                            addr = addr.substr(0, 5) + '...' + addr.substr(addr.length - 3);

                            return (
                                <tr key={ind} onClick={this.handleClickTransaction.bind(this, val)}>
                                    <td>{type}</td>
                                    <td>{addr}</td>
                                    <td>{amount}</td>
                                    <td>{date.toDateString()}</td>
                                </tr>
                            );
                        })}
                            </tbody>
                        </table>
                    </div>
                    <div id="walletCreated" style={{ display: 'none' }}>
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

                                <button id="receive_shareBtn" className="btn-blue" onClick={this.handleClickShare.bind(this)}>Share Wallet Address</button>

                                <button id="receive_closeBtn" className="popup-close-btn" onClick={this.handleClickReceive.bind(this)}></button>
                            </div>
                            {
                                this.state.copiedToClipboard ? <div id="notify" style={{marginTop: '100px'}}>Transfer link copied to clipboard</div> : ''
                            }
                        </>
                    ) : ''
                }
                {
                    this.state.showTransaction ? (
                        <>
                            <div id="modal" style={{ display: 'block' }}></div>
                            <div id="receive" className="popup">
                                <div className="popup-title">Transaction info</div>

                                <div className="input-label">Amount</div>
                                <div className="popup-grey-text">{this.state.transactionInfo.amount}</div>
                                <div className="input-label">Fee</div>
                                <div className="popup-grey-text">{this.state.transactionInfo.fee}</div>
                                <div className="input-label">Address</div>
                                <div className="popup-grey-text" style={{ fontSize: '8px' }}>{this.state.transactionInfo.addr}</div>
                                <div className="input-label">Date</div>
                                <div className="popup-grey-text">{this.state.transactionInfo.date}</div>

                                <button id="receive_closeBtn" className="popup-close-btn" onClick={this.handleClickTransaction.bind(this, '')}></button>
                            </div>
                        </>
                    ) : ''
                }
                {
                    this.state.showSend ? (
                        <>
                            <div id="modal" style={{ display: 'block' }}></div>
                            <div id="send" className="popup">
                                <div className="popup-title">Send Grams</div>

                                <div className="input-label">Recipient wallet address</div>
                                <input id="recipient" type="text" onChange={this.handleChangeField.bind(this, 'sendAddress')} placeholder="Enter wallet address" readOnly={this.state.sendInProgress} />

                                <div className="popup-grey-text">
                                    Copy wallet address of the recipient here
                                </div>

                                <div style={{ position: 'relative', width: '100%' }}>
                                    <div className="input-label">Amount</div>
                                    <div id="sendBalance">Balance: {this.state.balance}</div>
                                </div>

                                <input id="amount" type="number" onChange={this.handleChangeField.bind(this, 'sendAmount')} placeholder="0.0" readOnly={this.state.sendInProgress} />
                                <input id="comment" type="text" onChange={this.handleChangeField.bind(this, 'sendComment')} placeholder="Comment (optional)" readOnly={this.state.sendInProgress} />

                                {
                                    this.state.sendInProgress ? <a>sending, please wait . . .</a> : <button id="send_btn" className="btn-blue" onClick={this.handleClickSendSubmit.bind(this)}>Send Grams</button>
                                }

                                <button id="send_closeBtn" className="popup-close-btn" onClick={this.handleClickSend.bind(this)}></button>
                            </div>
                        </>
                    ) : ''
                }

            </div>
        );
    }
}

export default Content;

