const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const phone = document.getElementById('phone-login');
const phone2 = document.getElementById('phone-sign-up');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

phone.addEventListener('keydown', onlyNumberKey);
phone2.addEventListener('keydown', onlyNumberKey);

function onlyNumberKey(e) {
	var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
        var isCursorMoveOrDeleteAction = ([46,8,37,38,39,40].indexOf(e.keyCode) != -1);
        var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >=96 && e.keyCode <= 105);
		var isTabOrEnter = (e.keyCode == 9 || e.keyCode == 13)
        var cKey = 67,aKey = 65;
        switch(true){
            case isCursorMoveOrDeleteAction:
            case isModifierkeyPressed == false && isNumKeyPressed:
			case isTabOrEnter:
            case (e.metaKey || e.ctrlKey) && ([cKey,aKey].indexOf(e.keyCode) != -1):
                break;
            default:
                e.preventDefault();
        }
}