import {menus, signals} from '../types';

class Content extends React.Component{
    constructor (props){
        super (props);
    }

    handleContinue = () => {
        if (this.props.type === menus.MNEMONICS)
            this.props.toParent({type: signals.CREATE_PASSWORD});
        if (this.props.type === menus.BACKUP)
            this.props.toParent({type: signals.LOAD_MAIN});
    };
    render(){
        let wordsList = this.props.words.split(' ');
        let words = [];
        let half = Math.round(wordsList.length / 2);
        for (let i  = 1; i <= wordsList.length / 2; i++){
            words.push(<div className="create-word-item" key={i}><span className="word-num">{i}.</span> <span style={{ fontWeight: 'bold' }}>{wordsList[i - 1]}</span></div>);
            words.push(<div className="create-word-item" key={i + half}><span className="word-num">{i + half}.</span> <span style={{ fontWeight: 'bold' }}>{wordsList[i - 1 + half]}</span></div>);
        }
        return (
            <div id="backup" className="screen">

                <div className="middle">
                    <div className="screen-title">12 secret words</div>
                    <div className="screen-text">
                        Write down these 12 words in the correct<br />
                        order and store them in secret place.
                    </div>
                    <div style={{ marginTop: '95px' }}>
                        <button onClick={this.handleContinue} className="btn-blue screen-btn">Continue</button>
                    </div>
                    <div id="createWords">
                        {words}
                    </div>
                </div>
            </div>
        )
    }
}
export default Content;