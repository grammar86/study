/**
 * 화면 공통 스크립트
 */
var Page = new function() {
    var path;
    var msg;
    var applyUrl;
    var validType;
    var validTypeAr;
    var submitUrl;
    var submitClass;
    var insertAction;
    var updateYn = false;
    var tableName = '.table-responsive .table';

    /**
     * 페이지 공통 실행 함수
     */
    var pageInit = function() {
        Utils.unclickCheckbox(tableName);
        //Utils.tableDragCheckbox(tableName);
    };

    /**
     * 등록 이벤트
     */
    var bindAddEvent = function () {
        $('#btn_add').on('click', function() {
            updateYn = false;
			//전송
            if(insertAction) {
                Ajax.get({
                    url: insertAction,
                    success: function (d) {
                        Form.reset(document.forms.modalForm);
                        Common.setDate();

                        $('.upd').show();
                        $('[name=type]').val('I');
                        $('#btn_delete').addClass('hidden');
                        $('#btn_delete').attr('data-id', '');
                        $('.modal [name=asstno]').val(Math.floor(d.no));
                        $('[name=attcsrln]').val('');
                        $('.insert-type').attr('readonly', false);
                        $('.file-names.file-a-list').html('');
                        $('#btn_apply_cancel').attr('data-id', '');
                        $('#btn_apply_cancel').addClass('hidden');
                        $('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().hide();
                        $('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().prev().hide();
                        $('#modal_save').modal();
                    }
                });
			//팝업
            } else {
                Form.reset(document.forms.modalForm);
                Common.setDate();
                $('.upd').show();
                $('[name=type]').val('I');
                $('#btn_delete').addClass('hidden');
                $('#btn_delete').attr('data-id', '');
                $('.insert-type').attr('readonly', false);
                $('.file-names.file-a-list').html('');
                $('[name=attcsrln]').val('');
                $('#btn_apply_cancel').attr('data-id', '');
                $('#btn_apply_cancel').addClass('hidden');
                $('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().hide();
                $('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().prev().hide();
                $('#modal_save').modal();
            }
            if(window.initData) window.initData();
            if(window.insertComplete) window.insertComplete();
        });
    };

    /**
     * 상세 모달창 이벤트
     */
    var bindDetailEvent = function() {
        $('.table-responsive .table tbody tr td').on('click', function() {
            if($(this).parent().attr('class') == 'empty') return;
			//체크박스 전체해제 및 선택
			$.each($(this).parent().parent().children(), function(i, v) {
				if($(v).find('input[type=checkbox]').prop('checked')) 
					$(v).find('input[type=checkbox]').prop('checked', false);
			});
			$(this).parent().find('input[type=checkbox]').prop('checked', true);
			//1~4번 컬럼만 조회
			if($(this).index() == 0 || $(this).index() > 4) return;
			//id
			var id = $(this).parent().data('id');
			//상세정보, 파일목록
            getDetail(id, $(this).parent().find('.file-list').html());
        });
        if($('#index').val() !== '') 
            $('.table-responsive .table tbody tr').eq($('#index').val()).click();
    };
	
	/**
     * 상세 정보
     */
	var getDetail = function(id, fileText) {
		var form = document.forms.modalForm;
		//기존 파일목록 제거
		$('.file-names.file-a-list').empty();
		Ajax.get({
			url: path + '/info.do',
			data: {
				id: id
			},
			success: function(d) {
				updateYn = true;
				//Common.autoDataSet(d.data);
				Form.setFormDataByNamne(form, d.data);
				if((d.data.regid == c.empid && d.data.aprvseq == null) ||  $('#btn_delete').attr('auth') == "1") {
					$('#btn_delete').attr('data-id', id);
					$('#btn_delete').removeClass('hidden');
				} else {
					$('#btn_delete').addClass('hidden');
					$('#btn_delete').attr('data-id', '');
				}
				//저장 버튼
				if((d.data.regid == c.empid && d.data.aprvseq == null) || $('#btn_save').attr('auth') == "1") {
					$('#btn_save').removeClass('hidden');
					$('.submitBtn').removeClass('hidden');
				} else {
					$('#btn_save').addClass('hidden');
					$('.submitBtn').addClass('hidden');
				}
				//승인취소 버튼
				if(d.data.aprvseq) {
					$('#btn_apply_cancel').attr('data-id', d.data.aprvseq);
					$('#btn_apply_cancel').removeClass('hidden');
				}
				$('.upd').hide();
				$('[name=type]').val('U');
				$('.insert-type').attr('readonly', true);
				//파일목록
				$('.file-names.file-a-list').html(fileText);
				$('#regdtm').val(moment(d.data.regdtm).format('YYYY-MM-DD'));
				if(d.data.mdfydtm) $('#mdfydtm').val(moment(d.data.mdfydtm).format('YYYY-MM-DD'));
				$('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().show();
				$('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().prev().show();
				$('#modal_save').modal();

				if(window.initData) window.initData();
			}
		});
	};

	/**
     * 상세 정보
     */
	this.getDetailEvent = function(id) {
		getDetail(id);
	}

    /**
     * 삭제 이벤트
     */
    var bindRemoveEvent = function() {
        $('#btn_delete').on('click', function() {
            var ids = $(this).data('id');
            if(!confirm('삭제하시겠습니까?')) return;
            Ajax.get({
                url: path + '/delete.do',
                data: {
                    ids: ids,
                    empid: c.empid
                },
                success: function() {
                    //alert('삭제되었습니다.');
                    location.reload();
                }
            });
        });
    };

    /**
     * 저장 이벤트 - 아이디
     */
    var bindSubmitEvent = function() {
        $('#btn_save').on('click', function() {
            var form = document.forms.modalForm;
            /*if($('[name=empnm]').length > 0) {
                $('[name=empnm]').val($('#reqId').val());
            }*/
            if(validationCheck(form, validType, updateYn)) {
                Ajax.post(form, {
                    url: path + '/save.do',
                    data: {
                        empid: c.empid
                    },
                    success: function(data) {
						if(data.rcd == "-1") alert(data.rmsg);
						else location.reload();
                    }
                });
            }
        });
    };

    /**
     * 저장 이벤트 - 클래스
     */
    function bindSubmitClassEvent() {
        $(submitClass).on('click', function () {
            var type = $(this).data('type');
            var form = type === 'history' ? document.forms.modalHistoryForm : document.forms.modalForm;
            var url = type === 'history' ? submitUrl : path + '/save';
            var validType = type === 'history' ? validTypeAr[1] : validTypeAr[0];

            if (validationCheck(form, validType, updateYn)) {
                Ajax.post(form, {
                    url: url,
                    success: function () {
                        alert('저장되었습니다.');
                        location.reload();
                    }
                });
            }
        });
    }

    /**
     * 승인처리 이벤트
     */
    var bindApplyEvent = function() {
        $('#btn_apply').on('click', function() {
            var ids = Utils.tableCheckedData(tableName);
            var idxs = Utils.tableCheckedIndex(tableName);
            if(ids === '') return alert('승인하실 내역을 선택해 주세요.');
            if(!confirm('승인처리 하시겠습니까?')) return;
            if($('.dataTable tbody tr').eq(idxs).find('.not-action').length >= 1) 
                return alert('선택하신 내역은 승인 처리되었습니다.');
            Ajax.get({
                url: applyUrl,
                data: {
                    ids: ids
                },
                success: function() {
                    //alert('처리되었습니다.');
                    location.reload();
                }
            });
        });

        $('#btn_apply_cancel').on('click', function() {
            if(!confirm('승인취소 처리하시겠습니까?')) return;
            var id = $(this).data('id');
            Ajax.get({
                url: applyUrl + '/cancel.do',
                data: {
                    id: id
                },
                success: function() {
                    //alert('처리되었습니다.');
                    location.reload();
                }
            });
        });
    };

    /**
     * Textarea 이벤트
     */
    var bindTextAreaEvent = function() {
        var selectTarget;

        $('.textView').on('click', function(e) {
            e.stopPropagation();
            var value = $(this).next().val();
            $('#textArea').attr('readonly', true);
            $('#btn_text').addClass('hidden');
            $('#textArea').val(value);
            $('#modal_text').modal();
        });

        $('.textEdit').on('click', function() {
            var value = $(this).next().val() !== '' ? $(this).next().val() : '';
            selectTarget = $(this);
            $('#textArea').attr('readonly', false);
            $('#btn_text').removeClass('hidden');
            $('#textArea').val(value);
            $('#modal_text').modal();
        });

        $('#btn_text').on('click', function() {
            selectTarget.next().val($('#textArea').val());
            window.initData();
            $('#modal_text').modal('hide');
        });
    };

    /**
     * 페이징 클릭 이벤트
     */
    var pagingEvent = function() {
        var form = document.forms.searchForm;
        var url = location.pathname + location.search;
        $(form).attr('action', url);
        $('.page-link').on('click', function(e) {
           e.preventDefault();
           var form = document.forms.searchForm;
           var pageno = Number($(this).data('dt-idx'));
           if($(form).find('[name=pageno]').length === 0) 
               $(form).append($('<input>').attr({ type: 'hidden', name: 'pageno'}));
           $('[name=pageno]').val(pageno);
           $(form).submit();
        });
    };

    /**
     * 페이지 이벤트 실행 함수
     */
    this.bindEvent = function(obj) {
        path = obj.rootPath;
        msg = obj.deleteMsg;
        applyUrl = obj.applyUrl;
        submitUrl = obj.submitUrl;
        validType = obj.validType;
        submitClass = obj.submitClass;
        validTypeAr = obj.validTypeAr;
        insertAction = obj.insertAction;
		//페이징
        pageInit();
        pagingEvent();
		//등록/수정
        bindAddEvent();
		//상세
        if(!obj.noneDetail) bindDetailEvent();
        bindRemoveEvent();
		//승인
        if(applyUrl) bindApplyEvent();
		//내용보기
        if(obj.textArea) bindTextAreaEvent();
		//저장
        if(submitClass) bindSubmitClassEvent();
        else bindSubmitEvent();
		//엑셀다운로드
        if(obj.excelDownUrl) 
            Excel.bindDownloadSelect(document.forms.searchForm, obj.excelDownUrl, obj.excelBtn || 'btn_excel');
		//엑셀 업로드
        if(obj.excelUploadUrl) 
            Excel.bindUpload(obj.excelUploadUrl, obj.excelUploadBtn || 'btn_excel_upload', obj.excelUploadType);
    };

};