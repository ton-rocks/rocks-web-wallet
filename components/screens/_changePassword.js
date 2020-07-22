<div id="changePassword" className="popup" style="display: none; padding-bottom: 10px">
    <div className="popup-title">Change Password</div>

    <tgs-player data-name="changePassword" src="assets/lottie/lock.tgs" width="150" height="150"></tgs-player>

    <input id="changePassword_oldInput" placeholder="Enter your old password" type="password" style="text-align: center; width: 200px; margin-left: 40px; font-size: 15px" />
    <input id="changePassword_newInput" placeholder="Enter a new password" type="password" style="text-align: center; width: 200px; margin-left: 40px; font-size: 15px;margin-top: 20px" />
    <input id="changePassword_repeatInput" placeholder="Repeat the new password" type="password" style="text-align: center; width: 200px; margin-left: 40px; font-size: 15px" />

    <div className="popup-footer">
        <button id="changePassword_cancelBtn" className="btn-lite">CANCEL</button>
        <button id="changePassword_okBtn" className="btn-lite">SAVE</button>
    </div>
</div>