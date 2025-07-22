/**
 * 유틸 스크립트
 */
var Utils = new function() {
	
	/**
	 * 테이블 드래그로 체크박스 체크
	 * @param name
	 */
	this.tableDragCheckbox = function(name) {
		var target = $(name).find('tbody tr');
		var ckTarget;
		var tagIndex;
		var type;

		target.on('mousedown', function(e) {
			target.on('mousemove', function(e) {
				if(tagIndex === target.index(this)) return;
				tagIndex = target.index(this);
				ckTarget = $(e.target).parent('tr').find('input[type=checkbox]');
				type = ckTarget.prop('checked') ? false : true;
				ckTarget.prop('checked', type);
			});
		});

		target.on('mouseup', function(e) {
			tagIndex = -1;
			target.off('mousemove');
		});

		$(document).on('click', function() {
			tagIndex = -1;
			target.off('mousemove');
		});
	};
	
	/**
	 * 테이블 상위 체크박스 클릭시 전체 체크 및 해제
	 */
	this.bindHeaderCheckbox = function(name) {
		$(name).find('thead').find('input[type=checkbox]').on('click', function() {
			$(name).find('tbody').find('input[type=checkbox]').prop('checked', $(this).prop('checked'));
		});
	};
	
	/**
	 * 체크박스 클릭시 모달창 뜨는 이벤트 막기
	 */
	this.unclickCheckbox = function(name) {
		$(name).find('input[type=checkbox]').parent('td').off();
		$(name).find('input[type=checkbox]').parent('td').on('click', function(e) {
			e.stopPropagation();
		});		
		Utils.bindHeaderCheckbox(name);
	};

	/**
	 * 체크박스 전체 해제
	 */
	this.unCheckbox = function(name) {
		$.each($(name).find('tr'), function(i, v) {
			if($(v).find('input[type=checkbox]').prop('checked')) 
				$(v).find('input[type=checkbox]').prop('checked', false);
		});
	};

	/**
	 * 모든 객체 비활성화
	 */
	this.disabled = function(name) {
		$(name).find("input").attr("disabled", true);
		$(name).find("option").attr("disabled", true);
	}

	/**
	 * 모든 객체 비활성화
	 */
	this.enabled = function(name) {
		$(name).find("input").attr("disabled", false);
		$(name).find("option").attr("disabled", false);
	}
	
	/**
	 * 테이블 체크박스 체크된 data-id값 리턴
	 */
	this.tableCheckedData = function(name) {
		return Utils.tableCheckedDataId(name, 'id');
	};

	/**
	 * 테이블 체크박스 체크된 특정값 리턴
	 */
	this.tableCheckedDataId = function(name, id) {
		var ckList = $(name).find('tbody').find('input[type=checkbox]:checked');
		var len = ckList.length - 1;
		var val = '';
		$.each(ckList, function(i, target) {
			val += $(target).data(id);
			if(i < len) val += ',';
		});
		return val;
	};

	/**
	 * 테이블 체크박스 체크된 특정값 중복제거 리턴
	 */
	this.tableCheckedDataId1 = function(name, id) {
		var ckList = $(name).find('tbody').find('input[type=checkbox]:checked');
		var len = ckList.length - 1;
		var val = '';
		var tmp = '';
		$.each(ckList, function(i, target) {
			tmp = $(target).data(id);
			if( val.indexOf("," + tmp + ",") == -1 && val.indexOf( tmp + "," ) != 0) {
				val += tmp;
				if(i < len) val += ',';
			}
		});
		if(val.substring(val.length - 1) == ",") val = val.substring(0, val.length - 1);
		return val;
	};
	
	/**
	 * 테이블 체크박스 체크된 tr 인덱스값 리턴
	 */
	this.tableCheckedIndex = function(name) {
		var ckList = $(name).find('tbody').find('input[type=checkbox]:checked');
		var len = ckList.length - 1;
		var id = '';
		$.each(ckList, function(i, target) {
			id += $(target).parents('tr').index();
			if(i < len) id += ',';
		});		
		return id;
	};

	/**
	 * 숫자 콤마 추가
	 */
	this.numberWithCommas = function(d) {
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	/**
	 * 오늘일자
	 */
	this.getToday = function() {
        var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() > 8 ? now.getMonth() + 1 : '0' + ( now.getMonth() + 1 );
		var day = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();
		return "" + year + month + day; 
	};

	/**
	 * 파일 용량 변환
	 */
	this.sizeConvert = function(size, fixed) {
		if(fixed == undefined) fixed = 1;
		if(size < 1024) return size + "B";
		for (var multiples = ["KB", "MB", "GB", "TB"], cnt = 0, size = size / 1024; size > 1; size /= 1024, cnt++)
			str = size.toFixed(fixed) + multiples[cnt];
		return str;
	};

	/**
	 * 이미지 팝업
	 */	
	var imageObj = new Image();
	this.imagePopup = function(src) {
		imageObj.src = src;
		setTimeout("Utils.createImagePopup()", 100);
	}
	this.createImagePopup = function() {
		if (!imageObj.complete) {
			setTimeout("Utils.createImagePopup()", 100);
			return;
		}
		var imageWin = window.open("", "image", "width=" + imageObj.width + ", height=" + (imageObj.height + 1) + ", menubars=no, scrollbars=no");
		imageWin.document.write("<html><title>TIMS</title><body style='margin:0;overflow-x:hidden; overflow-y:hidden;'>") ;
		imageWin.document.write("<img src='" + imageObj.src + "' style='cursor:hand;' onclick='self.close()'>") ;
		imageWin.document.write("</body><html>") ;
	}

};