/**
 * ��ƿ ��ũ��Ʈ
 */
var Utils = new function() {
	
	/**
	 * ���̺� �巡�׷� üũ�ڽ� üũ
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
	 * ���̺� ���� üũ�ڽ� Ŭ���� ��ü üũ �� ����
	 */
	this.bindHeaderCheckbox = function(name) {
		$(name).find('thead').find('input[type=checkbox]').on('click', function() {
			$(name).find('tbody').find('input[type=checkbox]').prop('checked', $(this).prop('checked'));
		});
	};
	
	/**
	 * üũ�ڽ� Ŭ���� ���â �ߴ� �̺�Ʈ ����
	 */
	this.unclickCheckbox = function(name) {
		$(name).find('input[type=checkbox]').parent('td').off();
		$(name).find('input[type=checkbox]').parent('td').on('click', function(e) {
			e.stopPropagation();
		});		
		Utils.bindHeaderCheckbox(name);
	};

	/**
	 * üũ�ڽ� ��ü ����
	 */
	this.unCheckbox = function(name) {
		$.each($(name).find('tr'), function(i, v) {
			if($(v).find('input[type=checkbox]').prop('checked')) 
				$(v).find('input[type=checkbox]').prop('checked', false);
		});
	};

	/**
	 * ��� ��ü ��Ȱ��ȭ
	 */
	this.disabled = function(name) {
		$(name).find("input").attr("disabled", true);
		$(name).find("option").attr("disabled", true);
	}

	/**
	 * ��� ��ü ��Ȱ��ȭ
	 */
	this.enabled = function(name) {
		$(name).find("input").attr("disabled", false);
		$(name).find("option").attr("disabled", false);
	}
	
	/**
	 * ���̺� üũ�ڽ� üũ�� data-id�� ����
	 */
	this.tableCheckedData = function(name) {
		return Utils.tableCheckedDataId(name, 'id');
	};

	/**
	 * ���̺� üũ�ڽ� üũ�� Ư���� ����
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
	 * ���̺� üũ�ڽ� üũ�� Ư���� �ߺ����� ����
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
	 * ���̺� üũ�ڽ� üũ�� tr �ε����� ����
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
	 * ���� �޸� �߰�
	 */
	this.numberWithCommas = function(d) {
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	/**
	 * ��������
	 */
	this.getToday = function() {
        var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() > 8 ? now.getMonth() + 1 : '0' + ( now.getMonth() + 1 );
		var day = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();
		return "" + year + month + day; 
	};

	/**
	 * ���� �뷮 ��ȯ
	 */
	this.sizeConvert = function(size, fixed) {
		if(fixed == undefined) fixed = 1;
		if(size < 1024) return size + "B";
		for (var multiples = ["KB", "MB", "GB", "TB"], cnt = 0, size = size / 1024; size > 1; size /= 1024, cnt++)
			str = size.toFixed(fixed) + multiples[cnt];
		return str;
	};

	/**
	 * �̹��� �˾�
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