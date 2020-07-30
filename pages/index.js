import Head from 'next/head'
const crypto = require('crypto');
import LayoutMain from '../layouts/main';
import ScreenStart from '../components/screens/start';
import ScreenBackup from '../components/screens/backup';
import ScreenCreatePassword from '../components/screens/createPassword';
import ScreenEnterPassword from '../components/screens/enterPassword';
import ScreenReadyToGo from '../components/screens/readyToGo';
import ScreenMain from '../components/screens/main';
import ScreenAbout from '../components/screens/about';
import ScreenImport from '../components/screens/import';
//import ScreenTransactions from '../components/screens/transaction';



import {menus, signals} from '../components/types';

class Home extends React.Component {

    constructor (props){
        super (props);
        this.toParent = this.toParent.bind(this);
        this.state = {
            menu: menus.START,
            words: [],
            menuPanel: false,
            address: '',
        };
    }

    toParent (data){
        console.log('toParent');
        console.log(data);
        let password;
        switch (data.type){
            case (signals.LOAD_BACKUP):
                this.setState({
                    words: data.data.words,
                    menu: menus.BACKUP
                });
                break;
            case (signals.LOAD_MAIN):
                this.setState({
                    menu: menus.MAIN
                });
                break;
            case (signals.LOAD_START):
                this.setState({
                    menu: menus.START
                });
                break;

            case (signals.LOAD_ABOUT):
                this.setState({
                    menu: menus.ABOUT
                });
                break;
            case (signals.LOAD_IMPORT):
                this.setState({
                    menu: menus.IMPORT
                });
                break;
            case (signals.MNEMONIC_WORDS):
                this.setState({
                    words: data.data.words,
                    address: data.data.address,
                    menu: menus.MNEMONICS
                });
                localStorage.setItem('walletData', JSON.stringify(data.data));
                sessionStorage.setItem('walletData', JSON.stringify(data.data));
                break;
            case (signals.CREATE_PASSWORD):
                this.setState({
                    menu: menus.CREATE_PASSWORD
                });
                break;
            case (signals.CHANGE_PASSWORD):
                this.setState({
                    menu: menus.CHANGE_PASSWORD
                });
                break;
            case (signals.ENTER_PASSWORD):
                this.setState({
                    menu: menus.ENTER_PASSWORD
                });
                break;
            case (signals.PASSWORD_CREATED):
                password = this.hash(data.password);
                this.setState({
                    menu: menus.PASSWORD_CREATED
                });
                localStorage.setItem('walletData', this.encrypt(localStorage.getItem('walletData'), password));
                sessionStorage.setItem('password', password);
                break;
            case (signals.PASSWORD_CHANGED):
                password = this.hash(data.password);
                localStorage.setItem('walletData', this.encrypt(sessionStorage.getItem('walletData'), password));
                sessionStorage.setItem('password', password);
                this.setState({
                    menu: menus.MAIN
                });
                break;
            case (signals.PASSWORD_ENTERED):
                password = this.hash(data.password);
                sessionStorage.setItem('walletData', this.decrypt(localStorage.getItem('walletData'), password));
                sessionStorage.setItem('password', password);
                this.setState({
                    menu: menus.MAIN
                });
                break;
            case (signals.SWITCH_MENU_PANEL):
                this.setState({
                    menuPanel: !this.state.menuPanel
                });
                break;
            case (signals.LOAD_TRANSACTIONS):
                this.setState({
                    menu: menus.TRANSACTIONS
                });
                break;
        }
        if (data.type !== signals.SWITCH_MENU_PANEL){
            this.setState({
                menuPanel: false
            });
        }
    }
    hash (data){
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
    }
    encrypt (data, password){
        let mykey1 = crypto.createCipher('aes-128-cbc', password);
        let mystr1 = mykey1.update(data, 'utf8', 'hex');
        mystr1 += mykey1.final('hex');
        return mystr1;
    }
    decrypt (data, password){
        if (password == '')
            return data;
        let mykey2 = crypto.createDecipher('aes-128-cbc', password);
        let mystr2 = mykey2.update(data, 'hex', 'utf8');
        mystr2 += mykey2.final('utf8');
        return mystr2;
    }

    render(){
        let page = <ScreenStart toParent={this.toParent} />;
        console.log(this.state.menu);
        switch (this.state.menu){
            case (menus.START):
                page = <ScreenStart toParent={this.toParent} />;
                break;
            case (menus.MNEMONICS):
            case (menus.BACKUP):
                page = <ScreenBackup toParent={this.toParent} words={this.state.words} type={this.state.menu} />;
                break;
            case (menus.CREATE_PASSWORD):
            case (menus.CHANGE_PASSWORD):
                page = <ScreenCreatePassword toParent={this.toParent} encrypt={this.encrypt} type={this.state.menu} />;
                break;
            case (menus.ENTER_PASSWORD):
                page = <ScreenEnterPassword toParent={this.toParent} decrypt={this.decrypt} hash={this.hash} />;
                break;
            case (menus.PASSWORD_CREATED):
                page = <ScreenReadyToGo toParent={this.toParent} />;
                break;
            case (menus.MAIN):
                page = <ScreenMain toParent={this.toParent} decrypt={this.decrypt} />;
                break;
            case (menus.ABOUT):
                page = <ScreenAbout toParent={this.toParent} />;
                break;
            case (menus.IMPORT):
                page = <ScreenImport toParent={this.toParent} encrypt={this.encrypt} />;
                break;
            /*case (menus.TRANSACTIONS):
                page = <ScreenTransactions toParent={this.toParent} encrypt={this.encrypt} />;
                break;*/
        }
        return (
            <LayoutMain menuPanel={this.state.menuPanel} toParent={this.toParent}>
                {page}
            </LayoutMain>
        )
    }
}

export default Home;