
/**
 * 유저 관련 스크립트
 */
var User = new function() {
	this.id = { key: /[a-zA-Z0-9].{5,15}/, msg: '아이디는 최소 6자리 최대 15자리까지 가능합니다!' };
	this.password = { key: /^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/, msg: '비밀번호는 영대소문자/숫자 조합으로 최소 8자리 이상 입력해 주세요!' };
	this.passwordTwo = { key: /^.*(?=.{8,20})(?=.*[~!@$%^&*-=+_’])(?=.*[0-9])(?=.*[a-zA-Z]).*$/, msg: '비밀번호는 영대소문자/숫자/특수문자 조합으로 최소 8자리 이상 입력해 주세요!' };
	this.name = { key: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, msg: '이름은 한글만 가능합니다!' };
	this.email = { key: /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/, msg: '이메일 형식이 아닙니다!' };
	this.phone = { key: /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/, msg: '핸드폰 형식이 아닙니다!' };
	this.checkDataFormat = function(target, type) {
		var value = target.val();
		if(type.key.toString() === 'password') {
            if(!type.key.test(value) || !User.passwordTwo.key.test(value)) {
                alert(type.msg);
                target.focus();
                return false;
            }
		} else {
            if(!type.key.test(value)) {
                alert(type.msg);
                target.focus();
                return false;
            }
		}
		return true;
	};
};

/**
 * 폼 데이터 유효성 검사
 */
function validationCheck(form, arr, updType) {
	if(arr == null) return true;
	var validAr = arr;
	var obj;
	var attrObj;
	var target;
	for(var i = 0; i < validAr.length; ++i) {
		obj = validAr[i];
		target = $(obj.target);
		// 업데이트 상태이며 업데이트 무시 속성일시
		if(updType && obj.updPass) continue;
		//에디터 값 가져오기
		if(obj.type == 'editor') target.val(eval(obj.target.substr(1)).getData());
		// 빈값 체크
		if(target.val() === '') {
			alertMsgAndFocus(target, obj.msg);
			return false;
		} else if(target.attr('maxlength') && target.val().length > target.attr('maxlength')) {
			alertMsgAndFocus(target, '입력한 값은 최대 ' + target.attr('maxlength') + '자를 넘을 수 없습니다.');
			return false;
		}
		// 대상과 값이 같은지 체크
		if(obj.equal) {
			if($(obj.equal).val() !== target.val()) {
				alertMsgAndFocus(target, obj.msg);
				return false;
			}
		}
		// 정규식 체크
		if(obj.check) {
			if(!User.checkDataFormat(target, obj.check)) 
				return false;
		}
	}
	return true;
}

/**
 * 폼 타겟 포커스 및 오류 메시지 출력
 */
function alertMsgAndFocus(target, msg) {
	target.focus();
	alert(msg);
}