<div id="send" className="popup" style="display: none">
    <div className="popup-title">Send Grams</div>

    <div className="input-label">Recipient wallet address</div>
    <input id="toWalletInput" type="text" placeholder="Enter wallet address" />

    <div className="popup-grey-text">
        Copy the 48-letter wallet address of the
        recipient here or ask them to send you a
        ton:// link
    </div>

    <div style="position: relative; width: 100%">
        <div className="input-label">Amount</div>
        <div id="sendBalance">Balance:</div>
    </div>

    <input id="amountInput" type="number" placeholder="0.0" />
    <input id="commentInput" type="text" placeholder="Comment (optional)" />

    <button id="send_btn" className="btn-blue">Send Grams</button>

    <button id="send_closeBtn" className="popup-close-btn"></button>
</div>