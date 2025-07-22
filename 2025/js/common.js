$(document).ready(function() {
	if(window.init) init();
	Common.init();
});

/**
 * 공통 함수 스크립트
 */
var Common = new function() {
	this.searchType = false;
	var serverTime;
	var data, target, type;
	var ingType = false;
	var fileCount = 1;
	//자동완성 선택 값
	var dataSetting = function(d) {
		if(type === 'host') {
			if(target.next().attr("name") == "itemid") target.next().val(d.itemid);
			else if(target.next().attr("name") == "hostnm") {
				if(target.data('next')) $("#" + target.data('next')).val(d[target.data('next')]);
				target.next().val(d.hostnm);
			} else if(target.next().attr("name") == "assetm") target.next().val(d.assetnm);
		//사번, 담당자명
		} else if(type === 'empid' || type === 'empnm') {
			target.val(d.empnm);
			target.prev().val(d.empid);
			//부서명
			var inp = target.parent().parent().parent().find('[name=deptnm]');
			if(inp) inp.val(d.deptnm);
			//부서명
			inp = target.parent().parent().parent().find('[name=mngr1stdeptnm]');
			if(inp) inp.val(d.deptnm);
			//이메일
			inp = target.parent().parent().parent().find('[name=email]');
			if(inp) inp.val(d.email);
			//핸드폰
			inp = target.parent().parent().parent().find('[name=phone]');
			if(inp) inp.val(d.phone);
			if (typeof auto_test == 'function') auto_test(d.empid,d.empnm);
		//평가제목
		} else if(type === 'evatitle') {
			target.next().val(d.evaid);
			target.next().next().val(d.evatitle);
			if (typeof auto_test == 'function') auto_test(d.evaid, d.evatitle);
		}
	};
	this.init = function() {
		fileCount = 1;
		Common.bindDateEvent();
		Common.bindMouseEvent();
		Common.removeEmptyTd();
        Common.bindTooltipEvent();
        Common.bindAutoSearchEvent();
	};
	/**
	 * 툴팁 이벤트
	 */
	this.bindTooltipEvent = function() {
    	$('.link').on('mouseover', function(e) {
    		e.preventDefault();
			var title = $(this).data('title');
			var placement = $(this).data('placement');
			var top = $(this).offset().top;
			var left = $(this).offset().left - 10;
            var childTag1 = $('<div>').attr('class', 'arrow').css('left', '18px');
            var childTag2 = $('<div>').attr('class', 'tooltip-inner').text(title);
            if(placement === 'bottom') 
                top += $(this).height();
			var tooltipTag = $('<div>').attr({
				class: 'tooltip fade show bs-tooltip-' + placement,
				role: 'tooltip',
                'x-placement': placement
			}).css({top: top, left: left, 'z-index': 99999});
            tooltipTag.append(childTag1);
            tooltipTag.append(childTag2);
			$('body').append(tooltipTag);
            //tooltipTag.animate({opacity: 1}, 300);
		}).on('mouseout', function(e) {
			e.preventDefault();
            $('.tooltip.fade').remove();
            /*$('.tooltip.fade').animate({opacity: 0}, 200, null, function() {
                $('.tooltip.fade').remove();
			});*/
		});
	};
	//기본값 세팅
	this.defaultValue = function(d) {
		if(!d) return;
		$('.empid').val(d.empid);
		$('.empnm').val(d.empnm);
		$('.hostnm').val(d.hostnm);
		$('.evatitle').val(d.evatitle);
	};
	/**
	 * Datepicker 생성 및 이벤트
	 */
	this.bindDateEvent = function() {
        /****************************/
        // Basic Date Range Picker
        /****************************/
		$('.input-daterange').datepicker({
			zIndexOffset: 99999,
			orientation: "bottom auto",
			calendarWeeks: false,
			todayHighlight: true,
			autoclose: true,
			format: "yyyy-mm-dd",
			showMonthAfterYear: true,
			changeMonth: true,
			changeYear: true,
			language : "ko"
        }).on('show', function(e){
				/*var top = $(this).css("top");
				top = parseInt(top.replace("px", ""));
				$(".datepicker").css("top", top + 170 + "px");*/
				$(".datepicker").css("margin-top", "130px");
				$(".datepicker").css("margin-left", "30px");
			}).datepicker();
		/*//Date Ranges
		$( "#startdt, #enddt" ).datepicker({
            defaultDate: "+1w",
            format: "yyyy-mm-dd",
            changeMonth: true,
			autoclose: true,
            numberOfMonths: 1,
			yearSuffix: '년',
			language: "kr",
			prevText: '이전 달',
			nextText: '다음 달',
			monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			dayNames: ['일','월','화','수','목','금','토'],
			dayNamesShort: ['일','월','화','수','목','금','토'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
           onSelect: function( selectedDate ) {
               var option = this.id == "startdt" ? "minDate" : "maxDate",
                   instance = $( this ).data( "datepicker" ),
                   date = $.datepicker.parseDate(
                       instance.settings.dateFormat ||
                       $.datepicker._defaults.dateFormat,
                       selectedDate, instance.settings );
               dates.not( this ).datepicker( "option", option, date );
           }
        });*/
        /****************************/
        // Date & Time
        /****************************/
        $('.datetime').daterangepicker({
            timePicker: true,
            timePickerIncrement: 30
        });
        /****************************/
        //Calendars are not linked
        /****************************/
        $('.timeseconds').daterangepicker({
            timePicker: true,
            timePickerIncrement: 30,
            timePicker24Hour: true,
            timePickerSeconds: true
        });
        /****************************/
        // Single Date Range Picker
        /****************************/
        $('.singledate').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        });
        $('.singledate-month').daterangepicker({
			autoUpdateInput: false,
            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                format: 'YYYY-MM'
            }
        }, function(choose_date) {
			$(this.element[0]).val(choose_date.format('YYYY-MM'));
		});
        /****************************/
        // Auto Apply Date Range
        /****************************/
        $('.autoapply').daterangepicker({
            autoApply: true
        });
        /****************************/
        // Calendars are not linked
        /****************************/
        $('.linkedCalendars').daterangepicker({
            linkedCalendars: false
        });
        /****************************/
        // Date Limit
        /****************************/
        $('.dateLimit').daterangepicker({
            dateLimit: {
                days: 7
            }
        });
        /****************************/
        // Show Dropdowns
        /****************************/
        $('.showdropdowns').daterangepicker({
            showDropdowns: true
        });
        /****************************/
        // Show Week Numbers
        /****************************/
        $('.showweeknumbers').daterangepicker({
            showWeekNumbers: true
        });
        /****************************/
        // Date Ranges
        /****************************/
        $('.dateranges').daterangepicker({
            ranges: {
                '오늘': [moment(), moment()],
                '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '일주일': [moment().subtract(6, 'days'), moment()],
                '한달': [moment().subtract(29, 'days'), moment()],
                '이번달': [moment().startOf('month'), moment().endOf('month')],
                '1년': [moment().subtract(365, 'days'), moment()]
            },
            alwaysShowCalendars: true,
			calendarWeeks: false,
			todayHighlight: true,
			autoclose: true,
			format: "yyyy-mm-dd",
			language: "kr",
			onClose: function(selDate) {
				var name = $(this).attr("name");
				if(name == "startdt") optionName = "minDate";
				else optionName = "maxDate";
				$("[name=" + name + "]").datepicker("option", optionName, selDate);
			},
			prevText: '이전 달',
			nextText: '다음 달',
			monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			dayNames: ['일','월','화','수','목','금','토'],
			dayNamesShort: ['일','월','화','수','목','금','토'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
			showMonthAfterYear: true,
			changeMonth: true,
			changeYear: true,
			yearSuffix: '년'
			
        });		
		
        /****************************/
        // Always Show Calendar on Ranges
        /****************************/
        $('.shawCalRanges').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            alwaysShowCalendars: true
        });
        /****************************/
        // Top of the form-control open alignment
        /****************************/
        $('.drops').daterangepicker({
            drops: "up" // up/down
        });
        /****************************/
        // Custom button options
        /****************************/
        $('.buttonClass').daterangepicker({
            drops: "up",
            buttonClasses: "btn",
            applyClass: "btn-info",
            cancelClass: "btn-danger"
        });
        /****************************/
        // Language
        /****************************/
        $('.localeRange').daterangepicker({
            ranges: {
                "Aujourd'hui": [moment(), moment()],
                'Hier': [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Les 7 derniers jours': [moment().subtract('days', 6), moment()],
                'Les 30 derniers jours': [moment().subtract('days', 29), moment()],
                'Ce mois-ci': [moment().startOf('month'), moment().endOf('month')],
                'le mois dernier': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            locale: {
                format: 'YYYY-MM-DD',
                applyLabel: '확인',
                cancelLabel: '취소',
                daysOfWeek: ['일','월','화','수','목','금','토'],
                monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
            }
        });

        $('.input-group-append').on('click', function() {
        	$(this).prev().click();
		});

        /*if($('.singledate').parents('.search-form').length > 0) {
        	if(!$('.singledate').data('search'))
            	$('.singledate').val('');
        }
        if($('.singledate-month').parents('form').attr('name') != 'searchForm') {
            if(!$('.singledate').data('search'))
            	$('.singledate-month').val('');
        }*/

        $('.clockpicker').clockpicker({
            donetext: 'Done'
        }).find('input').change(function() {

        });
	};
	//기본값 채우기
	this.setDate = function() {
		//오늘일자
		$.each($('.singledate'), function(i, v) {
            if($(v).parents('form').attr('name') != 'searchForm' && !$(v).data('search') && $(v).data('status') != "empty") {
				console.log($.datepicker);
                $(v).val($.datepicker.formatDate('yy-mm-dd', new Date()));
            }
		});
		//이번달
        $.each($('.singledate-month'), function(i, v) {
            if($(v).parents().parents('form').attr('name') != 'searchForm') {
				console.log($.datepicker);
                $(v).val($.datepicker.formatDate('yy-mm', new Date()));
            }
        });
    };

	/**
	 * 마우스 이벤트 핸들러
	 */
	this.bindMouseEvent = function() {
		var target;
		var targetInfo;
		//숫자입력
        $('input[type=number]').on('blur', function() {
        	if(isNaN($(this).val())) {
        		$(this).val('');
        		alert('숫자만 입력 가능합니다.');
			}
		});
		//로그아웃
        $('.logout-btn').on('click', function(e) {
        	e.preventDefault();
        	if(!confirm('로그아웃 하시겠습니까?')) return;
        	location.href = $(this).attr('href');
		});
		$('.none-click').off();
		$('.none-click').on('click', function(e) {
			e.stopPropagation();
		});
		//닫기
		$('#closeBtn').off();
		$('#closeBtn').on('click', function() {
			$(this).parents('.modal.fade').modal('hide');
		});
		//팝업 이동
		// 2024.03.23 장영석 삭제조치 -> 2024.03.23 대표님 다시 노출 요청
		$(".modal").draggable({
		      handle: '.modal-header'
		});  
        $('.textEdit').on('focus', function() {
            $('.textEdit').click();
		});
        $('.textEdit').on('click', function() {
            var value = $(this).next().val() !== '' ? $(this).next().val() : '';
            selectTarget = $(this);
            $('#textArea').attr('readonly', false);
            $('#okBtn').removeClass('hidden');
            $('#textArea').val(value);
            $('#modalText').modal();
        });
        $('#okBtn').on('click', function() {
            selectTarget.next().val($('#textArea').val());
            initData();
            $('#modalText').modal('hide');
        });
		//파일첨부
		$('.file-btn').on('click', function() {
			target = $('[name=' + $(this).data('target') + ']');
			targetInfo = $('.' + $(this).data('info'));
			$('#tbody_file').empty();
			$('#fileStatus').empty();
			$('.input-file-text').val(target.val());
			if(target.val() !== '') {
				Ajax.get({
					url: '/file/list.do',
					data: {
						id: target.val()
					},
					success: function(d) {
						var data = d.list;
						var reader;
						//기존 업로드 파일이 있을 경우
						if(data) {
							var tr, td;
							var id = '';
                            var stIndex = $('#fileStatus input').length;
							$.each(data, function(i, v) {
								id = v.attcsrln;
								tr = $('<tr>').attr('data-index', stIndex + i);
								tr.append($('<td>').text(' ' + decodeURIComponent(v.attcfilename)));
								tr.append($('<td>').attr('class', 'text-right').text(Utils.sizeConvert(v.attcfilesize)));
								td = $('<td>').attr('class', 'text-center');
								td.append($('<button>').attr({'type' : 'button', 'class' : 'btn btn-xs btn-outline-danger file-remove'}).text('삭제'));
								tr.append(td);
								$('#tbody_file').append(tr);
                                $('#fileStatus').append($('<input>').attr({ type: 'hidden', name: 'useyn' }).val('Y'));
                                Common.btnFileRemove();
							});
							$(document.forms.fileForm).find('[name=id]').val(id);
							$('#modal_file').modal();
						}
					}
				});
			} else $('#modal_file').modal();
		});
		//파일찾기
		$('.find-file').on('click', function() {
			$('#multipleFile').click();
		});
		
		$('.search-select').next().attr('name', $('.search-select').val());
		$('.search-select').on('change', function() {
			$(this).next().attr('name', $(this).val());
		});

        /**
         * 첨부
         * @returns
         */
        $('#btn_file').off();
        $('#btn_file').on('click', function() {
            var form = document.forms.fileForm;
			//삭제파일 확인
			var isDel = false;
			$.each($(form).find('input[name=useyn]'), function (index, obj) {
				if(obj.value == 'N') isDel = true;
			});
			//변경사항 없을 경우
			if(!$(form).find("[name=files]").val() && !isDel) {
				//파일목록
				$('#tbody_file').empty();
				//삭제여부
				$('#fileStatus').empty();
				$('#modal_file').modal('hide');
				return;
			}
			var errorHandler = function(jqxhr, textStatus, errorThrown) {
				$('#pre-loader').hide();
				jqxhr.data = jqxhr.responseJSON;
				//파일목록
				$('#tbody_file').empty();
				//삭제여부
				$('#fileStatus').empty();
				$('#modal_file').modal('hide');
				alert("파일 크기가 너무 큽니다!");
				// 500: internal server error
				if(jqxhr.status === 500) {
					if (jqxhr.data.message) {
						console.log(jqxhr.data.stackTrace);
						alert(jqxhr.data.message);
					} else alert('서버 연결 불가!');            
					return false;
				}
			};
			$('#pre-loader').show();
            Ajax.post(form, {
                url: '/file/upload.do',
                success: function(json) {
					if(json.rmsg) {
						alert('업로드에 실패!\n' + json.rmsg);
						return;
					}
					var table, colgroup, col, thead, tbody, tr, th, td, aTag;
					targetInfo.empty();
					//파일목록
					$('#tbody_file').empty();
					//삭제여부
					$('#fileStatus').empty();
					$('#modal_file').modal('hide');
					if(json.file) {
						table = $('<table>').attr('class', 'table table-white table-bordered');
						colgroup = $('<colgroup>');
						col = $('<col>').attr('width', '85%');
						colgroup.append(col);
						col = $('<col>').attr('width', '15%');
						colgroup.append(col);
						table.append(colgroup);
						thead = $('<thead>');
						tr = $('<tr>').attr('class', 'text-center text-nowrap');
						th = $('<th>').text("파일명");
						tr.append(th);
						th = $('<th>').text("용량");
						tr.append(th);
						thead.append(tr);
						table.append(thead);
						tbody = $('<tbody>');
						$.each(json.file, function(i, v) {
							var kind = $('[name=kind]').val();
							var logLoc = $('#logloc').val();
							if(logLoc === "V") tr = decodeURIComponent(v.name);
							else {
								tr = $('<tr>');
								td = $('<td>');
								aTag = $('<a>').attr({ href: '/file/down.do?id=' + json.id + '&srn=' + v.index + '&cd=' + $('[name=cd]').val(), target: '_self' }).text(decodeURIComponent(v.name));
								td.append(aTag);
								tr.append(td);
								tr.append($('<td>').attr('class', 'text-right').text(Utils.sizeConvert(v.size)));				
							}
							tbody.append(tr);
						});
						table.append(tbody);
						targetInfo.append(table);
						target.val(json.file.length > 0 ? json.id : '');
					}
                },
				error: errorHandler
            });
        });

		$('#multipleFile').off();
		$('#multipleFile').on('change', function(e) {
			var files = e.target.files;
			var reade = new FileReader();
			var lastIndex = $(this).val().lastIndexOf('\\');
			var path = $(this).val().substr(0, lastIndex) + '\\';
			var stIndex = $('#fileStatus input').length;
			var target = e.target;
			var name, index, tr, td, tdSize;
			var count = files.length;
			$(this).select();
			$.each(files, function(i, f) {
				reader = new FileReader();
				reader.onload = function(e) {
					index = this.index;
                    name = document.getElementById('multipleFile').files[index].name;
					tr = $('<tr>').attr('data-index', stIndex + i);
					tr.append($('<td>').text(name));
					tr.append($('<td>').attr('class', 'text-right').text(Utils.sizeConvert(document.getElementById('multipleFile').files[index].size)));
					td = $('<td>').attr('class', 'text-center');
					td.append($('<button>').attr({'type' : 'button', 'class' : 'btn btn-xs btn-outline-danger file-remove'}).text('삭제'));
					tr.append(td);
					$('#tbody_file').append(tr);
					$('#fileStatus').append($('<input>').attr({ type: 'hidden', name: 'useyn' }).val('Y'));
                    Common.btnFileRemove();
				};
                reader.index = i;
				reader.readAsDataURL(f);
			});
		});
		//패스워드 보이기
		$('.fa-eye-slash').on('click',function(){
			$(this).parent().parent().parent().find('[placeholder=Password]').toggleClass('active');
			if($(this).parent().parent().parent().find('[placeholder=Password]').hasClass('active')){
				$(this).attr('class',"fa fa-eye fa-lg")
				.parent().parent().parent().find('[placeholder=Password]').attr('type',"text");
			}else{
				$(this).attr('class',"fa fa-eye-slash fa-lg")
				.parent().parent().parent().find('[placeholder=Password]').attr('type','Password');
			}
		});
		//서버 검색
		this.searchServer = function(params) {
			window.open("/search/server.do?" + params, "server", "width=1000, height=800, location=no, left=150, top=150");
		}
		//PDF 팝업
		this.popupPDF = function(path, title) {
			window.open("/common/pdf.jsp?file=" + path + "&title=" + title, "a", "width=1000, height=800, location=no, left=150, top=150");
		}
		//팝업
		this.popup = function(path) {
			window.open(path, "popup", "width=1000, height=800, location=no, left=150, top=150");
		}
		//팝업
		this.popupPrint = function(path) {
			window.open(path, "popup", "width=1200, height=800, location=no, left=150, top=150");
		}
		//파일 다운로드 링크
		this.bindFileATag = function(target, d) {
			var aTag;
			target.empty();
			$.each(d, function(i, v) {
				aTag = $('<a>').attr({ href: '/file/down?id=' + v.attcsrln + '&srn=' + v.attcfilesrln + '&cd=' + $('[name=cd]').val(), target: '_self' }).html(v.attcfilename);
				target.append(aTag);
				target.append('\n');
			});
		};
		//이미지 파일 확장자 여부
		this.isImage = function(str) {
			var result = false;
			if(str.indexOf('jpg') > -1 || str.indexOf('png') > -1 || str.indexOf('gif') > -1 || str.indexOf('bmp') > -1) 
                result = true;
            return result;
		};
		/**
		 * 파일 삭제 이벤트
		 */
		this.btnFileRemove = function() {
			$('.file-remove').off();
			$('.file-remove').on('click', function() {
				var index = $(this).parents('tr').data('index');
				$('#fileStatus').find('input').eq(index).val('N');
				$(this).parents('tr').remove();
			});
		};
	};
	
	/**
	 * File 태그 생성
	 */
	this.createFileTag = function(target) {
		fileCount++;
		
		var div = $('<div>').attr('class', 'file');
		var btn = $('<button>').attr('class', 'btn btn-default find-file').text('파일 찾기');
		var input = $('<input>').attr({ type: 'file', class: 'input-file hidden', name: 'file' + fileCount });
		var span = $('<span>').attr({ class: 'file-name' });
		
		div.append(btn);
		div.append(input);
		div.append(span);
		target.append(div);
	};
	
	/**
	 * 비어있는 td태그 삭제
	 */
	this.removeEmptyTd = function() {
		var tdList = $('.table-form').find('th');
		var value;
		
		$.each(tdList, function(i, v) {
			value = $.trim($(v).text());
			
			if(value === '') {
				$(v).remove();
			}
		});
	};

	/**
	 * 자동완성 선택
	 */
	var selectAction = function(target, d) {
        $('.ui-helper-hidden-accessible').remove();
        var index = target.index();
        searchType = true;
		//선택 값 처리
        if(d[index]) dataSetting(d[index]);
        $('.ui-menu li').css('top', '-500px');
    };

	var getSelectIndex = function(d) {
	    var liArr = $('.ui-menu li');
        var value;
        var result = 0;

	    $.each(liArr, function(i, v) {
            value = $(v).find('div').text();

            if(value === d) {
                result = i;

            }
        });

	    return result;
    };

	/**
	 * 자동완성 이벤트
	 */
	this.bindAutoSearchEvent = function() {
		$('.search-data').autocomplete({
            source: [],
            create: function(e, ui) {
            	$('.ui-menu').width(295);
            }
		});
		
		$('.search-data').on('blur', function() {
			if($(this).val() === '') Common.defaultValue({ empid: '', empnm: '', hostnm: '', ip: '' });
		});
		$('.search-data').on('keyup', function() {
			if(ingType) return;
			target = $(this);
			type = target.data('type');
			var value = encodeURIComponent(target.val());
			ingType = true;
			Ajax.get({
				url: '/search/data.do',
				data: {
					type: type,
					nm: value,
					itemkind: target.data('itemkind'),
					itemdetail: target.data('itemdetail')
				},
				success: function(d) {
					data = d.list;
					if(data == null) return false;
					var nmAr = [];					
					$.each(data, function(i, obj){
						if(type === 'host') nmAr.push({label: obj.hostnm, value:obj.hostnm, ip:obj.ip, itemid:obj.itemid});
						else if(type === 'empid') nmAr.push({label: obj.empnm + "[" + obj.deptnm + "]", value: obj.empnm, deptnm:obj.deptnm, phone:obj.phone, email:obj.email});
						else if(type === 'empnm') nmAr.push(obj.empnm);
						else if(type === 'evatitle') nmAr.push(obj.evatitle);
					});

					target.autocomplete({
			            source: nmAr,
                        matchContains: true,
			            open: function(e) {
			            	$('.ui-menu li').off();
                            $('.ui-menu li').on('click', function() {
                                selectAction($(this), data);
			            	});
                            $('.ui-menu').width(target.width());
			            },
			            close: function(e) {
                            var index = getSelectIndex($(e.target).val());
                            //selectAction($('.ui-menu li').eq(index), data);
			            	$('.ui-helper-hidden-accessible').remove();
			            	//$(e.target).val("");
			            },
			            focus: function(e) {
			            	e.preventDefault();
			            	$('.ui-menu').width(target.width());
			            },
                        input: function(e) {
                            e.preventDefault();
                        }
			        });
					ingType = false;
				}
			});
		});

		/**
		 * 새창 링크
		 */
		$('.window-link').on('click', function(e) {
			e.preventDefault();
			var url = $(this).text();
			if(url.indexOf("://") == -1) url = "http://" + url;
			window.open(url, '_blank');
		});
		
		/*$('.navbar-brand').on('click', function(e) {
			e.preventDefault();
		});*/

		$('.emptyBtn').on('click', function() {
			alert('준비중입니다!');
		});
	};
	/**
	 * 이동
	 */
	this.go = function(action, nm, val) {
		var form_go = $('<form></form>'); 
    	form_go.attr("name", "form_go"); 
    	form_go.attr("method", "post"); 
    	form_go.attr("action", action); 
    	form_go.append($('<input/>', {type: 'hidden', name: nm, value: val }));
    	form_go.appendTo('body');
		form_go.submit();
	};
	/**
	 * 메시지 확인
	 */
	this.bindMsgEvent = function() {
		//서버 시간
		serverTime = new Date(c.serverTime);
		//setInterval(Common.serverClock, 1000);
		//메시지알림
		toastr.options = {
		  "closeButton": false,
		  "debug": false,
		  "newestOnTop": false,
		  "progressBar": true,
		  "positionClass": "toast-top-right",
		  "preventDuplicates": false,
		  "onclick": null,
		  "showDuration": "1000",
		  "hideDuration": "1000",
		  "timeOut": "5000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		};
		setInterval(Common.getMessage, 60000);
	};
	//최근 메시지 가져오기
	this.getMessage = function() {
		//세션타임 체크
		if(c.sessionTime && c.sessionTime-- < 2) location.href = "/logout.do";
		if(!c.empid) return;
		Ajax.get({
			url: '/message/recent.do?empid=' + c.empid,
			success: function(d) {
				//안읽은 메시지
				if(d.receiveCnt == 0) img_message.src = "/images/i_notice.png";
				//최근 메시지
				if(d.receive[0]) {
					toastr.info('메시지가 도착했습니다.<br/>' + d.receive[0].title);
					img_message.src = "/images/i_notice_n.png";
				}
			},
			complete: function() {
				Ajax.setSubmitiIng(false);
			}
		});
	};
	//시간표시
	this.serverClock = function() {
		if(div_serverTime) {
			serverTime.setTime(serverTime.getTime() + 1000);
			var year = serverTime.getFullYear();
			var month = serverTime.getMonth();
			var date = serverTime.getDate();
			var day = serverTime.getDay();
			var week = ['일', '월', '화', '수', '목', '금', '토'];
			var hours = serverTime.getHours();
			var minutes = serverTime.getMinutes();
			var seconds = serverTime.getSeconds();
			if($.cookie("mode") == "Dark") 
				if(div_serverTime.style) div_serverTime.style.color = "#ffff";
			div_serverTime.innerText = 	`${year}-${month < 9 ? `0${month + 1}` : month + 1}-${date} ` +
				`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
		}
	};
};

/**
 * Ajax 통신 스크립트
 */
var Ajax = new function() {
	var submitiIng = false;

	var errorHandler = function(jqxhr, textStatus, errorThrown) {
		$('#pre-loader').hide();
        jqxhr.data = jqxhr.responseJSON;        
        if(textStatus === 'abort' || jqxhr.status === 0) return;
        
        if($.isEmptyObject(jqxhr.data)) {
            location.href = "/logout.do";
			return false;
        }        
        // 500: internal server error
        if(jqxhr.status === 500) {
            if (jqxhr.data.message) {
            	console.log(jqxhr.data.stackTrace);
                alert(jqxhr.data.message);
            } else alert('에러가 발생하였습니다!');            
            return false;
        }
	};

	var alwaysHandler = function() {
        submitiIng = false;
        $('#pre-loader').hide();
		//세션타임
		if(c.sessionTime) c.sessionTime = 60;
	};

	this.setSubmitiIng = function(t) {
        submitiIng = t;
	};
	
	this.get = function(obj) {
    	obj.data = $.extend(true, { _format: 'json' }, obj.data);
    	if(submitiIng) return;
        submitiIng = true;
        if(obj.sync) $('#pre-loader').show();
	    $.ajax({
	        url: obj.url,
	        type: 'get',
			async: obj.sync ? false:true,
	        dataType: 'json',
	        data: obj.data,
	        success: obj.success,
	        error: obj.error || errorHandler,
            complete: obj.complete || alwaysHandler
	    });
	};
	
	this.post = function(form, obj) {
        if(submitiIng) return;
        submitiIng = true;
        if(obj.sync) $('#pre-loader').show();
		var options = $.extend(true, {
    		type: 'post',
			async: (obj.sync) ? false:true,
    		dataType: 'json',
        	data: { _format: 'json' },
            success: obj.success,
            error: obj.error || errorHandler,
            complete: obj.complete || alwaysHandler
    	}, obj);
    	if(form) {
    		return $(form).ajaxSubmit(options).data('jqxhr');
    	} else {
    		return $.ajax(options);
    	}
	};
};

/**
 * 폼 타겟 포커스 및 오류 메시지 출력
 */
function alertMsgAndFocus(target, msg) {
	target.focus();
	alert(msg);
}


/* 2024-08 작업 */
$(function(){
	imgViewPop.init();
	tabLink();
});

const tabLink = function(){
	let idx = 0;
	$(document).on('click','.tab-link a',function(){
		idx = $(this).index();
		$(this).addClass('on').siblings().removeClass('on');
		$('.tab-cont-box .tab-cont').eq(idx).addClass('on').siblings().removeClass('on');
		return false;
	});
};
const imgViewPop = {
	set : function(src, alt){
		let html = '<div class="img-view-popup">';
			html += '<div class="btn-g"><a href="#" class="btn-prev">이전</a><a href="#" class="btn-next">다음</a></div>';
			html += '<div class="img-g"><img src="' + src + '" alt="' + alt + '" /></div>';
			html += '<a href="#" class="btn-close">닫기</a></div>';

		$('.img-view-popup').remove();
		$('body').append(html);
	},
	eventClick : function() {
		let idx = 0;
		const max = $('.file-photo-group .photo-view-box').length - 1;
		$(document).on('click','.file-photo-group .photo-view-box .img-click',function(){
			const src = $(this).find('img').attr('src');
			const alt = $(this).find('img').attr('alt');
			idx = $(this).parent().index();
			imgViewPop.set(src,alt);
		});

		/* 상세 팝업 클릭 */
		$(document).on('click','.img-view-popup .btn-prev',function(){
			idx == 0 ? idx = max : idx--;
			const src = $('.file-photo-group .photo-view-box').eq(idx).find('img').attr('src');
			const alt = $('.file-photo-group .photo-view-box').eq(idx).find('img').attr('alt');
			$('.img-view-popup .img-g img').attr({'src':src,'alt':alt})
			return false;
		});
		$(document).on('click','.img-view-popup .btn-next',function(){
			idx == max ? idx = 0 : idx++;
			const src = $('.file-photo-group .photo-view-box').eq(idx).find('img').attr('src');
			const alt = $('.file-photo-group .photo-view-box').eq(idx).find('img').attr('alt');
			$('.img-view-popup .img-g img').attr({'src':src,'alt':alt})
			return false;
		});
		$(document).on('click','.img-view-popup .btn-close',function(){
			$('.img-view-popup').remove();
			return false;
		});
	},
	init : function(){
		imgViewPop.eventClick();
	}
}