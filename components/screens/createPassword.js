import {menus, signals} from '../types';
class Content extends React.Component{
    constructor (props){
        super (props);
        this.state = {
            field1: '',
            field2: ''
        };
    };
    handleChange(field, e){
        e.preventDefault();
        this.setState({
            [field]: e.target.value
        });
    };
    handleCancel(e){
        this.props.toParent({
            type: signals.LOAD_MAIN
        });
    }
    handleSubmit(e){
        e.preventDefault();
        if (this.state.field1 != this.state.field2){
            console.log('incorrect');
        }else{
            if (this.props.type === menus.CREATE_PASSWORD)
                this.props.toParent({
                    type: signals.PASSWORD_CREATED,
                    password: this.state.field1
                });

            if (this.props.type === menus.CHANGE_PASSWORD)
                this.props.toParent({
                    type: signals.PASSWORD_CHANGED,
                    password: this.state.field1
                });
        }
    };
    render(){
        return(
            <div id="createPassword" className="screen">
                <div className="middle">

                    <div className="screen-title">Secure Password</div>

                    <div className="screen-text">
                        Please choose a secure password<br />
                        for confirming your payments
                    </div>
                    <form>

                        <div style={{ marginTop: '54px' }}>
                            <input id="createPassword_input" value={this.state.field1} onChange={this.handleChange.bind(this, 'field1')} placeholder="Enter your password" type="password" />
                        </div>
                        <div>
                            <input id="createPassword_repeatInput" value={this.state.field2} onChange={this.handleChange.bind(this, 'field2')} placeholder="Repeat your password" type="password" />
                        </div>

                        <div>
                            <button id="createPassword_cancelBtn" onClick={this.handleCancel.bind(this)} className="btn-blue screen-btn" style={{ width: '100px', marginTop: '38px', marginBottom: '20px', marginRight: '20px', background: 'rgb(245 129 129)' }}>
                                Cancel
                            </button>
                            <button id="createPassword_continueBtn" onClick={this.handleSubmit.bind(this)}  className="btn-blue screen-btn" style={{ width: '100px', marginTop: '38px', marginBottom: '20px', marginLeft: '20px' }}>
                                Continue
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Content;