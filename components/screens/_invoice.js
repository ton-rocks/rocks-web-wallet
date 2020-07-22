<div id="invoice" className="popup" style="display: none">
    <div className="popup-title">Create Invoice</div>

    <div>
        <div className="input-label">Amount</div>
    </div>

    <input id="invoice_amountInput" type="number" placeholder="Amount in grams you expect to receive" />
    <input id="invoice_commentInput" type="text" placeholder="Comment (optional)" />

    <div className="popup-grey-text">
        You can specify the amount and purpose of<br />
        the payment to save the sender some time.
    </div>

    <div className="input-label" style="margin-top: 24px; margin-bottom: 18px">Invoice URL</div>

    <div id="invoice_link" className="popup-black-text">
        ton://transfer/
    </div>

    <div className="popup-grey-text" style="margin-top: 24px">
        Share this address to receive Test Grams.<br />
        Note: this link won't work for real Grams.
    </div>

    <button id="invoice_qrBtn" className="btn-lite">Generate QR Code</button>
    <button id="invoice_shareBtn" className="btn-blue">Share Invoice URL</button>

    <button id="invoice_closeBtn" className="popup-close-btn"></button>
</div>