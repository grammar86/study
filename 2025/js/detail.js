/**
 * 화면 공통 스크립트
 */
var Detail = new function() {
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
	var listUrl;
	//데이터 타입
	this.id = { key: /[a-zA-Z0-9].{4,15}/, msg: '아이디는 최소 5자리 최대 15자리까지 가능합니다!' };
	this.password = { key: /^.*(?=.{9,20})(?=.*[~!@#$%^&*()-=+|<>?:{}_’])(?=.*[0-9])(?=.*[a-zA-Z]).*$/, msg: '비밀번호는 영대소문자/숫자/특수문자 조합으로 최소 9자리 이상 입력해 주세요!' };
	this.name = { key: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, msg: '이름은 한글만 가능합니다!' };
	this.email = { key: /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/, msg: '이메일을 확인해 주세요!' };
	this.number = { key: /^[0-9]/, msg: '숫자로 입력해 주세요!' };
	this.date = { key: /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/, msg: '일자를 정확히 입력해 주세요!' };
	this.time = { key: /^([01][0-9]|2[0-3]):([0-5][0-9])$/, msg: '시간을 정확히 입력해 주세요!' };
	//this.phone = { key: /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/, msg: '휴대폰번호 형식이 아닙니다!' };
	this.phone = { key: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/, msg: '휴대폰번호를 확인해 주세요!(010-1234-1234)' };
	
	/**
     * 데이터 타입 검증
     */
	var checkDataFormat = function(target, type) {
		var value = target.val();
		if(!type.key.test(value)) {
			alertMsgAndFocus(target, type.msg);
			return false;
		}
		return true;
	};

    /**
     * 이벤트 추가
     */
    var bindAddEvent = function () {
		//등록
        $('#btn_add').on('click', function() {
            updateYn = false;
			Detail.reset(document.forms.modalForm);
            Common.setDate();
			//키 가겨오기
            if(insertAction) {
                Ajax.get({
                    url: insertAction,
                    success: function (d) {
                        $('.modal [name=assetno]').val(Math.floor(d.no));
                        $('[name=attcsrln]').val('');
                    }
                });
            }
			$('.upd').show();
            $('[name=type]').val('I');
			$('.insert-type').attr('readonly', false);
			//첨부파일 데이터
			$('.file-names.file-a-list').html('');
			$('[name=attcsrln]').val('');
			//저장버튼
			$('#btn_save').removeClass('hidden');
			$('.submitBtn').removeClass('hidden');
			//삭제버튼
			$('#btn_delete').addClass('hidden');
			$('#btn_delete').attr('data-id', '');
			//승인취소버튼
			$('#btn_apply_cancel').attr('data-id', '');
			$('#btn_apply_cancel').addClass('hidden');
			//반려버튼
			$('#btn_reject').attr('data-id', '');
			$('#btn_reject').addClass('hidden');
			//취소버튼
			$('#btn_reject_cancel').attr('data-id', '');
			$('#btn_reject_cancel').addClass('hidden');
			$('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().hide();
            $('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().prev().hide();
            if(window.initData) window.initData();
            if(window.insertComplete) window.insertComplete();
			$('#modal_save').modal();
        });
		//보고서
		$('#btn_print').on('click', function() {
			var id = Utils.tableCheckedData(tableName);
            if(id === '') return alert('출력 대상을 선택해 주세요.');
			Common.popupPrint(path + "/print.do?id=" + id);
		});
		$('.btn_print2').on('click', function() {
			var obj = $(this);			
			window.onbeforeprint = function(){
				var pre = document.getElementsByTagName("pre");
				for(var i = 0; i < pre.length; i++){
					var lines = pre[i].innerHTML.split("\n");
					var html = ""; 
					for (var j = 0; j < lines.length; j++)
						html += lines[j] + "<br/>";
					pre[i].innerHTML = html;
					console.log(html);
				}
				//obj.hide();
				$('.d-print-none').hide();
			};
			window.onafterprint = function(){
				//obj.show();
				$('.d-print-none').show();
				window.close();
			};
			window.print();
		});
    };

    /**
     * 테이블 데이터 이벤트
     */
    var bindDetailEvent = function() {
		//테이블 정렬
		$.each($('.table-responsive .table thead tr').find('th'), function(i, v) {
			if($(v).data("id")) {
				$(v).css('cursor', 'pointer');
				$(v).on('click', function() {
					var form = document.forms.searchForm;
					var order = " ASC";
					if($(this).text().indexOf("▲") > -1) order = " DESC";
					$(form).find("[name=order]").val($(this).data("id") + order);
					$(form).submit();
				});
			}
		});
		//테이블 데이터 선택
        $('.table-responsive .table tbody tr td').on('click', function() {
            if($(this).parent().attr('class') == 'empty') return;
			//체크박스 전체해제 및 선택
			$(this).parent().parent().parent().find('thead').find('input[type=checkbox]').prop('checked', false);
			//체크박스 다중선택 제한
			if(!$(this).parent().hasClass('multi')) {
				$.each($(this).parent().parent().children(), function(i, v) {
					if($(v).find('input[type=checkbox]').prop('checked')) 
						$(v).find('input[type=checkbox]').prop('checked', false);
				});
				$(this).parent().find('input[type=checkbox]').prop('checked', true);
			} else {
				if($(this).attr('type') != 'checkbox' && $(this).find('input').attr('type') != 'checkbox') {
					if($(this).parent().find('input[type=checkbox]').prop('checked')) {
						$(this).parent().find('input[type=checkbox]').prop('checked', false);
						$(this).parent().parent().find('.allCk').prop('checked', false);
					} else $(this).parent().find('input[type=checkbox]').prop('checked', true);
				}
			}			
			//1~4번 컬럼만 조회, rowspan 테이블은 5번까지
			var limitIdx = 4;
			if($(this).parent().find('td:eq(1)').prop('rowspan') > 1) limitIdx = 5;
			if($(this).index() == 0 || $(this).index() > limitIdx) return;
			var id = $(this).parent().data('id');
			if(id) {
				//별도 이벤트
				var trClick = $(this).parent().attr('click');
				if(trClick) eval(trClick);
				else {
					//목록 조회 여부, 상세정보/파일목록
					if(listUrl) Detail.bindListEvent(id, listUrl);
					else getDetail(id, $(this).parent().find('.file-list').html());
				}
			}
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
		$.ajax({
			url: path + '/info.do',
			data: {
				id: id
			},
			success: function(d) {
				updateYn = true;
				Detail.setFormDataByName(form, d.data);
				//삭제버튼 권한
				if( !d.data.aprvseq && (d.data.regid == c.empid || $('#btn_delete').attr('auth') == "1") ) {
					$('#btn_delete').attr('data-id', id);
					$('#btn_delete').removeClass('hidden');
				} else {
					$('#btn_delete').addClass('hidden');
					$('#btn_delete').attr('data-id', '');
				}
				if( !d.data.aprvseq && (d.data.regid == c.empid || $('#btn_delete_modal').attr('auth') == "1") ) {
					$('#btn_delete_modal').attr('data-id', id);
					$('#btn_delete_modal').removeClass('hidden');
				} else {
					$('#btn_delete_modal').addClass('hidden');
					$('#btn_delete_modal').attr('data-id', '');
				}
				//저장버튼 권한
				if( !d.data.aprvseq && (!d.data.regid || d.data.regid == c.empid || $('#btn_save').attr('auth') == "1") ) {
					$('#btn_save').removeClass('hidden');
					$('.submitBtn').removeClass('hidden');
				} else {
					$('#btn_save').addClass('hidden');
					$('.submitBtn').addClass('hidden');
				}
				//승인취소 버튼
				if(d.data.aprvseq && $('#btn_apply_cancel').attr('auth') == "1") {
					$('#btn_apply_cancel').attr('data-id', d.data.aprvseq);
					$('#btn_apply_cancel').removeClass('hidden');
				} else {
					$('#btn_apply_cancel').attr('data-id', '');
					$('#btn_apply_cancel').addClass('hidden');
				}
				//반려 버튼
				if(!d.data.aprvseq && $('#btn_reject').attr('auth') == "1" && d.data.status != 'REJECT') {
					$('#btn_reject').attr('data-id', id);
					$('#btn_reject').removeClass('hidden');
				} else {
					$('#btn_reject').attr('data-id', '');
					$('#btn_reject').addClass('hidden');
				}
				//반려취소 버튼
				if( d.data.status == 'REJECT' && $('#btn_reject_cancel').attr('auth') == "1") {
					$('#btn_reject_cancel').attr('data-id', id);
					$('#btn_reject_cancel').removeClass('hidden');
				} else {
					$('#btn_reject_cancel').attr('data-id', '');
					$('#btn_reject_cancel').addClass('hidden');
				}
				//등록/수정 상태
				$('.upd').hide();
				$(form).find('[name=type]').val('U');
				//변경 불가능한 항목
				$(form).find('.insert-type').attr('readonly', true);
				$.each($('.insert-type'), function(i) {
					//자동완성값
					if($(this).data('type')) $(this).val(d.data[$(this).attr('id')]);
					//샐렉트박스
					var selectbox = $(this).attr('name');
					$.each($(form).find('[name=' + selectbox + ']').find("option"), function(i) {
						if($(this).val() != d.data[selectbox]) $(this).attr("disabled", true);
					});
				});
				//파일목록
				$('.file-names.file-a-list').html(fileText);
				$('#regdtm').val(moment(d.data.regdtm).format('YYYY-MM-DD'));
				if(d.data.mdfydtm) $('#mdfydtm').val(moment(d.data.mdfydtm).format('YYYY-MM-DD'));
				$('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().show();
				$('#regdtm, #regnm, #mdfydtm, #mdfynm').parent().prev().show();
				$('#modal_save').modal();

				//initData 펑션 호출
				if(window.initData) window.initData();
			}
		});
	};

	/**
     * 상세 목록 조회
     */
	this.bindListEvent = function(id, url) {
		$('#pre-loader').show();
		if(!url) url = listUrl;
		var data = "";
		if($("form[name=listSearchForm]")) 
			data = $("form[name=listSearchForm]").serialize();
		$.ajax({
			url: url + id,
			data: data,
			success: function(html) {
				//initDataList 펑션 호출
				if(window.initDataList) window.initDataList(html);
				$("#detailList").html(html);
				$('#pre-loader').hide();
				setTimeout(listPagingEvent, 1000);
			}
		});
	}
	var bindListEvent = function(id, listUrl) {
		Detail.bindListEvent(id, listUrl);
	}

	this.reset = function(form) {
		//기본값이 있을 경우 처리
		$(form).find('input.form-control').each(function(){
			if($(this).attr("value") != "") $(this).val($(this).attr("value"));
			else $(this).val('');
			if($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio") $(this).prop("checked", false);
		});
		$(form).find('textarea').val('');
		$('#textArea').val('');
		$.each($(form).find('select').find("option"), function(i) {
			$(this).attr("disabled", false);
		});
	};
	
	/**
	 * object값 기준으로 폼의 네임을 찾아 값을 입력
	 */
	this.setFormDataByName = function(form, d) {
		var tag;
		Detail.reset(form);
		//제조사로 자산종류 데이터 생성
		try {
			if($(form).find('[name=maker]') && $(form).find('[name=assettype]') && d.maker) 
				Detail.setSelectCode(d.maker, "assettype", 2);	
		} catch (e){}
		//자산종류로 모델 데이터 생성
		try {
			if($(form).find('[name=assettype]') && $(form).find('[name=model]') && d.assettype) 
				Detail.setSelectCode(d.assettype, "model", 3);
		} catch (e){}
		$.map(d, function(value, key) {
			//console.log(key + "=" + value);
			if(value > 0) value = value || '';
			tag = $(form).find('[name=' + key + ']');
			if(tag) {
				//값 채우기
				if(tag.attr('editor')) eval(key).setData(value);
				//checkbox 버튼
				else if(tag.attr('type') == 'checkbox') 
					$(form).find("input:checkbox[name=" + key + "][value=" + value + "]").prop("checked", true);
				//radio 버튼
				else if(tag.attr('type') == 'radio')
					$(form).find("input:radio[name=" + key + "]:radio[value=" + value + "]").prop("checked", true);
				else if(tag.attr('type') !== 'password' && tag.attr('type') !== 'radio' && key !== 'kind' && key !== 'itemkind') {
					//console.log(key + "=" + value);
					tag.val(value);
				}
			}
		});
		//기본값 세팅
		if($('.modal').find('[name=mngr1stid]')) 
            $('.modal').find('[name=mngr1stid]').prev().val(d.mngr1stid);
		if($('.modal').find('[name=mngr2ndid]')) 
            $('.modal').find('[name=mngr2ndid]').prev().val(d.mngr2ndid);
		if($('.modal').find('[name=reqid]')) 
            $('.modal').find('[name=reqid]').prev().val(d.reqid);
		if($('.modal').find('[name=mngrid]')) 
            $('.modal').find('[name=mngrid]').prev().val(d.mngrNm);
        if($('.modal').find('[name=chkId]')) 
            $('.modal').find('[name=chknm]').prev().val(d.empnm);
        if($('.modal').find('[name=chgrid]')) 
            $('.modal').find('[name=chgrid]').prev().val($('.modal').find('[name=chgrid]').next().val());
	};

	/**
	 * 코드 가져오기
	 */
	this.setSelectCode = function(code, select, lv, select2, option){
		if(code == null || code == '' || code == "undefined") return false;
		$('#' + select + "> option").remove();
		if(option) $('#' + select).append('<option value="">' + option + '</option>');
		$.ajax({
			type: "GET",
			url: '/code/info.do',
			data: {
				cdgrp: code,				
				lv: lv,
				useyn: "Y"
			},
			async: false,
			success: function(d) {
				if(d.data) {					
					var code;
					$.each(d.data, function(i, val) {
						if(i == 0) code = val.code;
						$('#' + select).append('<option value="' + val.code + '">' + val.cdnm + '</option>');
					});
					//연결 selectbox
					if(select2) {
						$('#' + select2 + "> option").remove();
						if(select2 != null) Detail.setSelectCode(code, select2, lv + 1);
					}
				}
			}
		});	   
	};

	/**
     * 상세 정보
     */
	this.getDetailEvent = function(id) {
		getDetail(id);
	};

    /**
     * 삭제 이벤트
     */
    var bindDelEvent = function() {
        $('#btn_delete').on('click', function(e) {
			e.preventDefault();
            if(!confirm('삭제 하시겠습니까?')) return;
			var id = $(this).data('id');
			listUrl = $(this).attr("listUrl");
            Ajax.get({
                url: path + '/delete.do',
                data: {
                    id: id,
                    empid: c.empid
                },
                success: function(d) {
					if(d.rcd == "-1") alert(d.rmsg);
                    else {
						if(listUrl) {
							//팝업제거
							$('.modal.fade.ui-draggable.show').removeClass("show");
							$('.modal-backdrop').remove();
							if(d.id) bindListEvent(d.id.split("_")[0], listUrl);
						} else location.reload();
					}
                }
            });
        });
    };

    /**
     * 저장 이벤트 - 아이디
     */
    var bindSubmitEvent = function() {
        $('#btn_save').on('click', function() {
            Detail.saveEvent(null, $(this).attr("listUrl"));
        });
		//다음
		if(!$("#btn_save_next").hasClass("hidden") != null) {
			$('#btn_save_next').on('click', function() {
				Detail.saveEvent("next");
			});
		}
		//이전
		if(!$("#btn_save_pre").hasClass("hidden") != null) {
			$('#btn_save_pre').on('click', function() {
				Detail.saveEvent("pre");
			});
		}
    };

	/**
     * 저장 이벤트 - 클래스
     */
    this.saveEvent = function(gubun, listUrl) {
		var form = document.forms.modalForm;
		/*if($('[name=empnm]').length > 0) {
			$('[name=empnm]').val($('#reqId').val());
		}*/
		if(Detail.validationCheck(form, validType, updateYn)) {
			Ajax.post(form, {
				url: path + '/save.do',
				data: {
					gubun: gubun
				},
				success: function(data) {
					if(data.rcd == "-1" || data.rcd == "-99") alert(data.rmsg);
					else if(gubun != null && !$("#btn_save_next").hasClass("hidden")) {
						//이전,다음
						if(data.id) getDetail(data.id);
						else {
							//팝업제거							
							$('.modal.fade.ui-draggable.show').removeClass("show");
							$('.modal-backdrop').remove();
							alert("데이터가 없습니다!");
							location.reload();
						}
					//상세 목록 재조회
					} else if(listUrl) {
						//팝업제거
						$('.modal-backdrop').remove();
						if(data.id) bindListEvent(data.id.split("_")[0], listUrl);
						else alert("데이터가 없습니다!");
					} else location.reload();
				}
			});
		}
	}

	/**
     * 저장 후 이벤트
     */
    function nextEvent() {
		$.ajax({
	        url: nextUrl,
	        type: 'get',
	        dataType: 'json',
	        success: function(d) {
				if(d.data.id) getDetail(d.data.id);
				else alert("데이터가 없습니다!");
			},
	        error: function(d) {
				alert("데이터가 없습니다!");
			}
	    });
	}

    /**
     * 저장 이벤트 - 클래스
     */
    function bindSubmitClassEvent() {
        $(submitClass).on('click', function () {
            var type = $(this).data('type');
            var form = type === 'history' ? document.forms.modalHistoryForm : document.forms.modalForm;
            var url = type === 'history' ? submitUrl : path + '/save.do';
            var validType = type === 'history' ? validTypeAr[1] : validTypeAr[0];

            if (Detail.validationCheck(form, validType, updateYn)) {
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
		//숭인
        $('#btn_apply').on('click', function() {
            var id = Utils.tableCheckedData(tableName);
            if(id === '') return alert('승인하실 건을 선택해 주세요!');
			var isPass = true;
			var ckList = $(tableName).find('tbody').find('input[type=checkbox]:checked');
			$.each(ckList, function(i, target) {
				if($(target).attr('class')) {
					isPass = false;
					return;
				}
				if(c.rolecd == 'ROLE_ADMIN' || c.rolecd == 'ROLE_MANAGER' || $(target).attr('data-deptid') == c.deptid)
					console.log($(target).attr('data-deptid'));
				else {
					isPass = false;
					return;
				}
			});
			if(!isPass) {
				alert('승인된 건이 선택 되었거나 권한이 없습니다!');
				return;
			}
			if(!confirm('승인 처리 하시겠습니까?')) return;
            Ajax.get({
                url: applyUrl,
                data: {
                    id: id
                },
                success: function() {
                    alert('승인 처리 되었습니다.');
                    location.reload();
                }
            });
        });
		//승인취소
        $('#btn_apply_cancel').on('click', function() {
            if(!confirm('승인 취소 처리 하시겠습니까?')) return;
            var id = $(this).data('id');
            Ajax.get({
                url: applyUrl.replace('.do', '') + '/cancel.do',
                data: {
                    id: id
                },
                success: function() {
                    alert('승인 취소 처리 되었습니다.');
                    location.reload();
                }
            });
        });
		//반려
        $('#btn_reject').on('click', function() {
            if(!confirm('반려 처리 하시겠습니까?')) return;
            var id = $(this).data('id');
            Ajax.get({
                url: applyUrl.replace('.do', '') + '/reject.do',
                data: {
                    id: id
                },
                success: function() {
                    alert('반려 처리 되었습니다.');
                    location.reload();
                }
            });
        });
		//반려 취소
        $('#btn_reject_cancel').on('click', function() {
            if(!confirm('반려 취소 처리 하시겠습니까?')) return;
            var id = $(this).data('id');
            Ajax.get({
                url: applyUrl.replace('.do', '') + '/reject/cancel.do',
                data: {
                    id: id
                },
                success: function() {
                    alert('반려 취소 처리 되었습니다.');
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
		//보기 버튼
        $('.textView').on('click', function(e) {
            e.stopPropagation();
            var value = $(this).next().val();
            $('#textArea').attr('readonly', true);
            $('#btn_text').addClass('hidden');
            $('#textArea').val(value);
            $('#modal_text').modal();
        });
		//내용 수정
        $('.textEdit').on('click', function() {
            var value = $(this).next().val() !== '' ? $(this).next().val() : '';
            selectTarget = $(this);
            $('#textArea').attr('readonly', false);
            $('#btn_text').removeClass('hidden');
            $('#textArea').val(value);
            $('#modal_text').modal();
        });
		//닫기 버튼
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
		   if($(this).data("url")) return false;
           var pageno = Number($(this).data('dt-idx'));
           if($(form).find('[name=pageno]').length === 0) 
               $(form).append($('<input>').attr({ type: 'hidden', name: 'pageno'}));
           $('[name=pageno]').val(pageno);
		   $(form).submit();
        });
    };

	/**
     * 상세 목록 페이징 클릭 이벤트
     */
    var listPagingEvent = function() {
        var form = document.forms.listSearchForm;
        $('.page-link[id=listPaging]').on('click', function(e) {
           e.preventDefault();
		   if(!$(this).data("url")) return false;
           var pageno = Number($(this).data('dt-idx'));
           $(form).append($('<input>').attr({ type: 'hidden', name: 'pageno', value: pageno}));
		   //상세 목록 조회
		   bindListEvent($(this).data('id'), $(this).data("url"));
        });
    };

    /**
     * 상세 이벤트 실행 함수
     */
    this.bindEvent = function(obj) {
        if(obj) { 
			path = obj.rootPath;
			msg = obj.deleteMsg;
			applyUrl = obj.applyUrl;
			submitUrl = obj.submitUrl;
			validType = obj.validType;
			submitClass = obj.submitClass;
			validTypeAr = obj.validTypeAr;
			insertAction = obj.insertAction;
			listUrl = obj.listUrl;
		}
		
        //전체 선택/해제
		Utils.bindHeaderCheckbox(tableName);
        //Utils.tableDragCheckbox(tableName);
		//페이징
        pagingEvent();
		//등록/수정
        bindAddEvent();
		//상세 이벤트 등록 여부
        if(obj && !obj.noneDetail) bindDetailEvent();
		//삭제
        bindDelEvent();
		//승인
        if(applyUrl) bindApplyEvent();
		//내용보기
        if(obj && obj.textArea) bindTextAreaEvent();
		//저장
        if(submitClass) bindSubmitClassEvent();
        else bindSubmitEvent();
		//엑셀다운로드
        if(obj && obj.excelDownUrl) 
            Excel.bindDownloadSelect(document.forms.searchForm, obj.excelDownUrl, obj.excelBtn || 'btn_excel');
		//엑셀 업로드
        if(obj && obj.excelUploadUrl) 
            Excel.bindUpload(obj.excelUploadUrl, obj.excelUploadBtn || 'btn_excel_upload', obj.excelUploadType);
    };

	/**
	 * 폼 데이터 유효성 검사
	 */
	this.validationCheck = function(form, arr, updType) {
		if(arr == null) return true;
		var validAr = arr;
		var obj;
		var attrObj;
		var target;
		for(var i = 0; i < validAr.length; ++i) {
			obj = validAr[i];
			target = $(form).find(obj.target);
			// 업데이트 상태이며 업데이트 무시 속성일시
			if(updType && obj.updPass) continue;
			//에디터 값 가져오기
			if(obj.type == 'editor') target.val(eval(obj.target.substr(1)).getData());
			// 빈값 체크
			if(!obj.empty && !target.val()) {
				alertMsgAndFocus(target, obj.msg);
				return false;
			} else if(target.attr('maxlength') && target.val().length > target.attr('maxlength')) {
				alertMsgAndFocus(target, '입력한 값은 최대 ' + target.attr('maxlength') + '자를 넘을 수 없습니다.');
				return false;
			}
			//일치 여부
			if(obj.equal) {
				if($(form).find(obj.equal).val() !== target.val()) {
					alertMsgAndFocus(target, obj.msg);
					return false;
				}
			}
			//불일치 여부
			if(obj.ne) {
				if($(form).find(obj.ne).val() == target.val()) {
					alertMsgAndFocus(target, obj.msg);
					return false;
				}
			}
			//큰값 여부
			if(obj.gt) {
				if(target.val() && $(form).find(obj.gt).val() > target.val()) {
					alertMsgAndFocus(target, obj.msg);
					return false;
				}
			}
			//작은값 여부
			if(obj.lt) {
				if(target.val() && $(form).find(obj.lt).val() < target.val()) {
					alertMsgAndFocus(target, obj.msg);
					return false;
				}
			}
			// 정규식 체크
			if( obj.check && (target.val() || $(form).find(obj.depend).val() ) ) {
				if(!checkDataFormat(target, obj.check)) 
					return false;
			}
		}
		return true;
	};
};

$(function(){
	modalTabEvt();
})

const modalTabEvt = function(){
	const target = $('.modal-tab-list');
	
	target.each(function(){
		const $this = $(this);
		const link = $this.find('>a');
		const cont = $this.siblings('.modal-tab-cont');
		const box = cont.find('>.tab-cont-box');
		

		link.on('click',function(){
			$(this).addClass('on').siblings().removeClass('on');
			box.eq($(this).index()).addClass('on').siblings().removeClass('on');
			return false;
		});
	})
};