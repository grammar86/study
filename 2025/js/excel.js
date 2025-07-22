var Excel = new function() {

    /**
	 * 엑셀 업로드 이벤트
     * @param url
     * @param targetId
     */
	this.bindUpload = function(targetId) {
        $('#excelFileFormFile').off();
        $('#excelFileFormFile').on('change', function(e) {
        	var si = this.value.lastIndexOf("\\") + 1;
            var span = $('<span>').text(this.value.substr(si));
            $('.file-list').empty();
            $('.file-list').append(span);
        });
        $('#' + targetId).off();
        $('#' + targetId).on('click', function(e) {
        	e.preventDefault();
            $('#excelFileFormFile').click();
        });
	};

	/**
	 * 전체 엑셀저장 버튼 bind
	 */
	this.bindDownloadSelect = function(form, url, targetId) {
        $('#' + targetId).off();
		$('#' + targetId).on('click', function() {
			if($('.dataTable tbody .empty').length === 0) 
                Excel.download(form, url);
			else alert("내역이 없습니다.");
		});
	};

	/**
	 * 현재 페이지 엑셀 저장, 전체 엑셀저장 버튼 bind
	 */
	this.bindDownload = function(form, url, targetId, targetIdAll) {
        $('#' + targetId).off();
		$('#' + targetId).on('click', function(e) {
			e.preventDefault();
			Excel.downloadSelect(form, url + '/select.do');
		});
        $('#' + targetIdAll).off();
		$('#' + targetIdAll).on('click', function(e) {
			e.preventDefault();
			Excel.download(form, url);
		});
	};

	/**
	 * 전체 목록 다운로드
	 */
	this.download = function(form, url) {
		var queryString = $(form).serialize();
		var title = encodeURIComponent(document.title);
		if($('#pathNm').text() != null) {
			/*title = $('#pathNm').text();
			if(title.indexOf(">") > -1) title = title.substring( title.lastIndexOf(">") + 2);
			title = encodeURIComponent(title);*/
		}
		if(url.indexOf("?") < 0) location.href = url + '?_format=xlsx&name=' + title + '&' + queryString;
		else location.href = url + '&_format=xlsx&name=' + title + '&' + queryString;
		$('[name=excelPerPage]').remove();
	};

	/**
	 * 현재 페이지 목록 다운로드
	 */
	this.downloadSelect = function(form, url) {
		var queryString = $(form).serialize();
		location.href = url + '?_format=xlsx&seqArr=' + seqArr + "&" + queryString;
		$('[name=excelPerPage]').remove();
	}

};