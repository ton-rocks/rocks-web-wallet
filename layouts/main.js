import Head from 'next/head'
import {signals} from '../components/types';

class Content extends React.Component{

    constructor (props){
        super (props);
    }

    componentDidMount(){
        if (sessionStorage.getItem('walletData') !== null && localStorage.getItem('walletData') !== null){
            this.props.toParent({
                type: signals.LOAD_MAIN
            });
        }else if(sessionStorage.getItem('walletData') === null && localStorage.getItem('walletData') !== null){
            this.props.toParent({
                type: signals.ENTER_PASSWORD
            });
        }else{
            this.props.toParent({
                type: signals.LOAD_START
            });
        }
    }

    handleAbout(){
        this.props.toParent({
            type: signals.LOAD_ABOUT
        });
    }
    handleChangePassword(){
        this.props.toParent({
            type: signals.CHANGE_PASSWORD
        });
    }
    handleBackUp(){
        const walletData = JSON.parse(sessionStorage.getItem('walletData'));
        this.props.toParent({
            type: signals.LOAD_BACKUP,
            data: walletData
        });
    }
    handleDelete(){
        if (window.confirm('Delete wallet?')){
            sessionStorage.clear();
            localStorage.clear();
            this.props.toParent({
                type: signals.LOAD_START
            });
        }
    }
    handleLogOut(){
        sessionStorage.clear();
        this.props.toParent({
            type: signals.ENTER_PASSWORD
        });
    }
    handleTransactions(){
        this.props.toParent({
            type: signals.LOAD_TRANSACTIONS
        });
    }

    render(){
        return (
            <>

                <Head>
                    <title>Rocks Wallet</title>
                    <link rel="icon" href="/assets/favicon.ico" />
                    <link rel="stylesheet" href="/css/main.css" />

                </Head>
                <div className="body-container">
                    {this.props.children}
                    {
                        this.props.menuPanel ? (
                            <div id="menuDropdown">
                                <div id="menu_about" className="dropdown-item" onClick={this.handleAbout.bind(this)}>About</div>
                                <div id="menu_transactions" className="dropdown-item" onClick={this.handleTransactions.bind(this)}>Transactions</div>
                                <div id="menu_changePassword" className="dropdown-item" onClick={this.handleChangePassword.bind(this)}>Change password</div>
                                <div id="menu_backupWallet" className="dropdown-item" onClick={this.handleBackUp.bind(this)}>Back up wallet</div>
                                <div id="menu_delete" className="dropdown-item" onClick={this.handleDelete.bind(this)}>Delete wallet</div>
                                <div id="menu_logout" className="dropdown-item" onClick={this.handleLogOut.bind(this)}>Log out</div>
                            </div>
                        ): ''
                    }


                    <div className="screen-text" style={{'fontSize': '12px', 'position': 'absolute', 'width': '100%', 'left': 0, 'bottom': 0, 'textAlign': 'center'}}>
                        Developed by <a href="https://t.me/ramauf" target="_blank">@ramauf</a>
                    </div>
                </div>
            </>

        )
    }
}

export default Content;