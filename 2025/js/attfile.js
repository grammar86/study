$(document).ready(function () {
    AttFile.init();
});

/**
 * 첨부파일 함수 스크립트
 */
var AttFile = new function () {
    var fileCount = 1;
    var target, targetInfo, accept;
    this.init = function () {
        fileCount = 1;
        AttFile.unbindEvent();
        AttFile.bindMouseEvent();

        // 드래그 앤 드랍 기능 초기화 (DragDrop 객체가 있는 경우에만)
        if (typeof DragDrop !== 'undefined') {
            DragDrop.init();
        }

        // 페이지 로드 시 기존 파일 목록 표시
        setTimeout(function () {
            AttFile.showExistingFiles();
        }, 100);
    };
    /**
     * 이벤트 제거
     */
    this.unbindEvent = function () {
        //console.log("attfile unbind event");
        $('#file-btn').unbind('click');
        $('#file-btn').off('click');
        $('#btn_file').unbind('click');
        $('#btn_file').off('click');
        $('#find-file').unbind('click');
        $('#find-file').off('click');
    };
    /**
     * 마우스 이벤트 핸들러
     */
    this.bindMouseEvent = function () {
        //파일첨부
        $('#file-btn').off();
        $('#file-btn').on('click', function (e) {
            target = $('[name=' + $(this).data('target') + ']');
            targetInfo = $('.' + $(this).data('info'));
            //console.log(target)
            //초기화
            accept = $(this).data('accept');
            $('#div_files').empty();
            /*if(accept) $('#multipleFile').attr('accept', accept);
            $('#multipleFile').val('');*/
            $('#tbody_file').empty();
            $('#fileStatus').empty();
            $('.input-file-text').val(target.val());
            if (target.val() !== '') {
                Ajax.get({
                    url: '/file/list.do',
                    data: {
                        id: target.val()
                    },
                    success: function (d) {

                        // 응답 데이터 검증
                        if (!d) {
                            $('#modal_file').modal();
                            return;
                        }

                        var data;
                        var reader;

                        // 응답 형태 분석 및 처리
                        if (Array.isArray(d)) {
                            // 응답이 직접 배열인 경우
                            data = d;
                        } else if (d.list) {
                            // 응답이 {list: []} 형태인 경우
                            data = d.list;
                        } else {
                            // 다른 속성에 배열이 있는지 확인
                            for (var key in d) {
                                if (Array.isArray(d[key])) {
                                    data = d[key];
                                    break;
                                }
                            }
                        }

                        // 문자열 JSON인 경우 파싱 시도
                        if (typeof data === 'string' && data.trim().length > 0) {
                            try {
                                data = JSON.parse(data);
                            } catch (e) {
                                data = null;
                            }
                        }

                        //기존 업로드 파일이 있을 경우
                        if (data && Array.isArray(data) && data.length > 0) {
                            var tr, td;
                            var id = '';
                            var stIndex = $('#fileStatus input').length;
                            var errorImg = c.resPath + '/images/file.png';
                            $.each(data, function (i, v) {
                                // v가 객체인지 확인
                                if (typeof v !== 'object' || v === null) {
                                    return true; // continue
                                }

                                id = v.attcsrln;
                                tr = $('<tr>').attr('data-index', stIndex + i);
                                if (accept && accept.indexOf('image') > -1) tr.append($('<td>').append($('<img>').attr({
                                    'src': '/file/down.do?id=' + v.attcsrln + '&srn=' + v.attcfilesrln + '&menucd=' + c.menucd,
                                    'max-width': '480px',
                                    height: '200px',
                                    onError: 'this.src="' + errorImg + '"'
                                })));
                                else {
                                    var displayName;
                                    try {
                                        displayName = decodeURIComponent(v.attcfilename);
                                    } catch (e) {
                                        displayName = v.attcfilename;
                                    }
                                    tr.append($('<td>').text(' ' + displayName));
                                }
                                tr.append($('<td>').attr('class', 'text-right').text(Utils.sizeConvert(v.attcfilesize)));
                                td = $('<td>').attr('class', 'text-center');
                                td.append($('<button>').attr({
                                    'type': 'button',
                                    'class': 'btn btn-xs btn-outline-danger file-remove'
                                }).text('삭제'));
                                tr.append(td);
                                $('#tbody_file').append(tr);

                                $('#fileStatus').append($('<input>').attr({type: 'hidden', name: 'useyn'}).val('Y'));
                            });
                            AttFile.btnFileRemove();
                            $(document.forms.fileForm).find('[name=id]').val(id);
                            $('#modal_file').modal();
                        } else {

                            // 혹시 다른 속성에 파일 목록이 있는지 확인
                            for (var key in d) {
                                if (key !== 'list') {
                                    console.log('다른 속성 확인 - ' + key + ':', d[key]);
                                }
                            }

                            $('#modal_file').modal();
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('파일 목록 조회 실패:', error, 'status:', status, 'xhr:', xhr.responseText);
                        console.error('요청 URL:', '/file/list.do?id=' + target.val());
                        $('#modal_file').modal();
                    },
                    timeout: 10000 // 10초 타임아웃 추가
                });
            } else {
                $('#modal_file').modal();
            }
        });

        /**
         * 파일추가
         */
        $('#find-file').off();
        $('#find-file').on('click', function (e) {
            AttFile.createFileFormFileTag();
        });

        /**
         * 첨부
         * @returns
         */
        $('#btn_file').off();
        $('#btn_file').on('click', function () {
            var form = document.forms.fileForm;
            //console.log(form)
            //삭제파일 확인
            var isDel = false;
            $.each($(form).find('input[name=useyn]'), function (index, obj) {
                if (obj.value == 'N') isDel = true;
            });
            //변경사항 없을 경우
            if ($(form).find(".input-file").length == 0 && !isDel) {
                //파일목록
                $('#tbody_file').empty();
                //삭제여부
                $('#fileStatus').empty();
                $('#modal_file').modal('hide');
                return;
            }
            var errorHandler = function (jqxhr, textStatus, errorThrown) {
                $('#pre-loader').hide();
                jqxhr.data = jqxhr.responseJSON;
                //파일목록
                $('#tbody_file').empty();
                //삭제여부
                $('#fileStatus').empty();
                $('#modal_file').modal('hide');
                alertMsg("파일 크기가 너무 큽니다!");
                // 500: internal server error
                if (jqxhr.status === 500) {
                    if (jqxhr.data && jqxhr.data.message) {
                        console.log(jqxhr.data.stackTrace);
                        alertMsg(jqxhr.data.message);
                    } else alertMsg('서버 연결 불가!');
                    return false;
                }
            };


            // 폼 유효성 검사
            if (!form) {
                alertMsg('폼을 찾을 수 없습니다.');
                return;
            }

            $('#pre-loader').show();
            
            Ajax.post(form, {
                url: '/file/upload.do?empid=' + c.empid,
                success: function (json) {

                    // json이 없거나 null인 경우 처리
                    if (!json) {
                        $('#pre-loader').hide();
                        alertMsg('업로드 중 오류가 발생했습니다.');
                        return;
                    }

                    if (json && json.rmsg) {
                        $('#pre-loader').hide();
                        alertMsg('업로드 실패!\n' + json.rmsg);
                        return;
                    }
                    
                    // UI 정리 먼저 실행
                    $('.file-names').empty();
                    $('#tbody_file').empty();
                    $('#fileStatus').empty();
                    $('#modal_file').modal('hide');
                    $('#pre-loader').hide();

                    // DOM 조작이 완료된 후에 파일 렌더링 실행 (렌더링 완료 보장)
                    setTimeout(function() {
                        
                        var table, colgroup, col, thead, tbody, tr, th, td, aTag;
                        var target;

                        // json.file 처리 개선
                        var fileData = json.file;

                        // 문자열로 된 JSON 데이터를 파싱
                        if (typeof fileData === 'string') {
                            try {
                                fileData = JSON.parse(fileData);
                            } catch (e) {
                                fileData = null;
                            }
                        }

                        // 파일 데이터 파싱 개선 - 다양한 응답 형태 지원
                        if (!fileData) {
                            // json에서 파일 배열을 찾는 다른 방법들 시도
                            var possibleKeys = ['files', 'fileList', 'data', 'list', 'result'];
                            for (var key of possibleKeys) {
                                if (json[key]) {
                                    fileData = json[key];
                                    break;
                                }
                            }
                        }

                        // 여전히 데이터가 문자열인 경우 재파싱
                        if (typeof fileData === 'string') {
                            try {
                                fileData = JSON.parse(fileData);
                            } catch (e) {
                                fileData = null;
                            }
                        }

                        // 파일 데이터가 있고 배열이며 길이가 0보다 큰 경우
                        if (fileData && Array.isArray(fileData) && fileData.length > 0) {
                            
                            // AttFile.renderFileList 함수 사용 (기존 로직과 통일)
                            target = $('[name=attcsrln]');
                            target.val(json.id || '');
                            
                            // renderFileList 함수 호출
                            AttFile.renderFileList(fileData, $('.file-names'), json.id);
                        } else {
                            
                            // 파일이 정말 없는 경우에만 빈 메시지 표시
                            target = $('[name=attcsrln]');
                            if (!target.val() && (!json.id || json.id === '')) {
                                table = $('<table>').attr('class', 'table table-white table-bordered file-table');
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
                                tbody.append($('<tr><td colspan="2" class="text-center text-muted">첨부된 파일이 없습니다.</td></tr>'));
                                table.append(tbody);
                                $('.file-names').append(table);
                                target.val('');
                            } else {
                                // ID가 있으면 파일 목록 다시 조회
                                var existingId = json.id || target.val();
                                if (existingId) {
                                    target.val(existingId);
                                    // 파일 목록 재조회
                                    Ajax.get({
                                        url: '/file/list.do',
                                        data: {id: existingId},
                                        success: function(d) {
                                            var data = d.list || d;
                                            if (Array.isArray(data) && data.length > 0) {
                                                AttFile.renderFileList(data, $('.file-names'), existingId);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        
                        if (window.uploadFileData) {
                            Ajax.setSubmitting(false);
                            uploadFileData();
                        }
                    }, 100); // 100ms 지연으로 DOM 조작 완료 보장
                },
                error: function (jqxhr, textStatus, errorThrown) {
                    
                    $('#pre-loader').hide();
                    
                    // 타임아웃이나 중단된 요청인 경우
                    if (textStatus === 'timeout') {
                        alertMsg('업로드 시간이 초과되었습니다. 다시 시도해주세요.');
                        return;
                    }
                    
                    if (textStatus === 'abort') {
                        return;
                    }

                    errorHandler(jqxhr, textStatus, errorThrown);
                },
                timeout: 120000 // 2분 타임아웃
            });
            //파일전송 후 데이터 처리
        });

        //페이지 파일 추가
        $('#inputFile').off();
        $('#inputFile').on('change', function (e) {
            var files = e.target.files;
            var reade = new FileReader();
            var lastIndex = $(this).val().lastIndexOf('\\');
            var path = $(this).val().substr(0, lastIndex) + '\\';
            var stIndex = $('input[name=useyn]').length;
            var name, index, div, atag;
            $(this).select();
            $.each(files, function (i, file) {
                reader = new FileReader();
                reader.onload = function (e) {
                    index = this.index;
                    name = document.getElementById('inputFile').files[index].name;
                    div = $('<div>').attr({'class': 'file', 'data-index': stIndex + i});
                    div.append($('<p>').attr('class', 'text').text(name));
                    div.append($('<p>').attr('class', 'data').text(Utils.sizeConvert(document.getElementById('inputFile').files[index].size)));
                    atag = $('<a>').attr({'class': 'delete file-delete', 'href': '#'});
                    atag.append($('<i>').attr('class', 'i-delete').text('삭제'));
                    div.append(atag);
                    div.append($('<input/>').attr({type: 'hidden', name: 'attcfilesrlnStr'}).val(''));
                    div.append($('<input/>').attr({type: 'hidden', name: 'useyn'}).val('Y'));
                    $('#divFile').append(div);
                    AttFile.btnAttFileRemove();
                };
                reader.index = i;
                reader.readAsDataURL(file);
            });
        });

        //파일 다운로드 링크
        this.bindFileATag = function (target, d) {
            var aTag;
            target.empty();
            $.each(d, function (i, v) {
                aTag = $('<a>').attr({
                    href: '/file/down?id=' + v.attcsrln + '&srn=' + v.attcfilesrln + '&cd=' + $('[name=cd]').val(),
                    target: '_self'
                }).html(v.attcfilename);
                target.append(aTag);
                target.append('\n');
            });
        };
        //이미지 파일 확장자 여부
        this.isImage = function (str) {
            var result = false;
            if (str.indexOf('jpg') > -1 || str.indexOf('png') > -1 || str.indexOf('gif') > -1 || str.indexOf('bmp') > -1)
                result = true;
            return result;
        };
        /**
         * 모달 파일 삭제 이벤트
         */
        this.btnFileRemove = function () {
            $('.file-remove').off();
            $('.file-remove').on('click', function () {
                var index = $(this).parents('tr').data('index');
                $('#fileStatus').find('input').eq(index).val('N');
                $(this).parents('tr').remove();
            });
        };
        /**
         * 페이지 파일 삭제 이벤트
         */
        this.btnAttFileRemove = function () {
            $('.file-delete').off();
            $('.file-delete').on('click', function () {
                var index = $(this).parent().data('index');
                $(this).parent().find('input[name=useyn]').val('N');
                $(this).parent().css("display", "none");
            });
        };
        if ($('.file-delete').length) AttFile.btnAttFileRemove();
    };

    /**
     * File 태그 생성
     */
    this.createFileTag = function (target) {
        fileCount++;
        var div = $('<div>').attr('class', 'file');
        var btn = $('<button>').attr('class', 'btn btn-default find-file').text('파일 찾기');
        var input = $('<input>').attr({type: 'file', class: 'input-file hidden', name: 'file' + fileCount});
        var span = $('<span>').attr({class: 'file-name'});
        div.append(btn);
        div.append(input);
        div.append(span);
        target.append(div);
    };
    /**
     * File 태그 생성 - fileForm
     */
    this.createFileFormFileTag = function (accept) {
        fileCount++;
        var tagid = 'files' + fileCount;
        var input = $('<input>').attr({
            type: 'file',
            class: 'input-file hidden',
            id: tagid,
            name: tagid,
            accept: accept,
            multiple: 'true'
        });
        $('#div_files').append(input);
        $('#' + tagid).on('change', function (e) {
            var files = e.target.files;
            var reade = new FileReader();
            var lastIndex = $(this).val().lastIndexOf('\\');
            var path = $(this).val().substr(0, lastIndex) + '\\';
            var stIndex = $('#fileStatus input').length;
            var target = e.target;
            var name, index, tr, td, tdSize;
            var count = files.length;
            var accept = $(this).attr('accept');
            var errorImg = c.resPath + '/images/file.png';
            $(this).select();
            $.each(files, function (i, f) {
                reader = new FileReader();
                reader.onload = function (e) {
                    index = this.index;
                    name = document.getElementById(tagid).files[index].name;
                    tr = $('<tr>').attr('data-index', stIndex + i);
                    if (accept && accept.indexOf('image') > -1) tr.append($('<td>').append($('<img>').attr({
                        'src': e.target.result,
                        height: '200px',
                        'max-width': '480px',
                        onError: 'this.src="' + errorImg + '"'
                    })));
                    else tr.append($('<td>').text(name));
                    tr.append($('<td>').attr('class', 'text-right').text(Utils.sizeConvert(document.getElementById(tagid).files[index].size)));
                    td = $('<td>').attr('class', 'text-center');
                    td.append($('<button>').attr({
                        'type': 'button',
                        'class': 'btn btn-xs btn-outline-danger file-remove'
                    }).text('삭제'));
                    tr.append(td);
                    $('#tbody_file').append(tr);
                    $('#fileStatus').append($('<input>').attr({type: 'hidden', name: 'useyn'}).val('Y'));
                    AttFile.btnFileRemove();
                };
                reader.index = i;
                reader.readAsDataURL(f);
            });
        });
        $('#' + tagid).click();
    };
    /**
     * File 목록 태그 생성
     */
    this.createFileListTag = function (fileList, target) {
        //파일목록
        var fileHtml = "";
        if (fileList) {
            fileHtml = '<table class="table table-white table-bordered file-table">'
                + '<colgroup>'
                + '	<col width="85%">'
                + '	<col width="15%">'
                + '</colgroup>'
                + '<thead>'
                + '	<tr class="text-center text-nowrap">'
                + '		<th>파일명</th>'
                + '		<th class="text-right">용량</th>'
                + '	</tr>'
                + '  </thead>'
                + ' <tbody>';
            $.each(fileList, function (i, val) {
                var preview = '';
                c.extPreview.forEach(function (ext) {
                    if (val.attcfileext.toLowerCase().indexOf(ext) > -1) {
                        preview = ' <button type="button" class="btn btn-sm btn-gray ml-a mr-2" style="font-size: 10px;" onclick="Common.popupPreview(\'' + val.attcsrln + '\', \'' + val.attcfilesrln + '\', \'' + val.attcfileext + '\')">미리보기</button>';
                        return;
                    }
                });
                var td = '<tr>'
                    + '<td>'
                    + '<a href="/file/down.do?id=' + val.attcsrln + '&srn=' + val.attcfilesrln + '&menucd=' + c.menucd + '" target="_blank">' + val.attcfilename + '</a> '
                    + preview
                    + '</td>'
                    + '<td class="text-right">' + Utils.sizeConvert(val.attcfilesize) + '</td>'
                    + '</tr>';
                fileHtml += td;
            });
            fileHtml += '</tbody></table>';
        }
        target.html(fileHtml);
    };
    /**
     * 미리보기 이미지
     */
    this.imgPreview = function (parent, files) {
        $.each(files, function (i, file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                AttFile.createImgTag(parent, file.name, e.target.result);
            };
            reader.readAsDataURL(file);
        });
    };

    /**
     * 이미지 태크 생성
     * @param parent
     * @param name
     * @param src
     */
    this.createImgTag = function (parent, name, src) {
        $(parent).empty();
        if (!src) return;
        var stIndex = $('#fileStatus input').length;
        var errorImg = c.resPath + '/images/file.png';
        var liTag = $('<li>').attr('data-index', stIndex + 1);
        var divTag = $('<div>').attr({'class': 'img-bg hidden', title: name});
        var divIcon = $('<div>').attr({'class': 'img-icon hidden', title: name});
        var iTag = $('<i>').attr('class', 'fa fa-plus-circle expandIcon');
        divIcon.append(iTag);
        var iTag2 = $('<i>').attr('class', 'fa fa-minus-circle removeIcon');
        divIcon.append(iTag2);
        var imgTag = $('<img>').attr({'src': src, onError: 'this.src="' + errorImg + '"'});
        var inputTag = $('<input>').attr({type: 'hidden', name: 'useyn'}).val('Y');
        liTag.append(imgTag);
        liTag.append(divTag);
        liTag.append(divIcon);
        $(parent).append(liTag);
        $('#fileStatus').append(inputTag);
        AttFile.bindImgEvent();
    }
    /**
     * 이미지 이벤트 핸들러
     */
    this.bindImgEvent = function () {
        $('.img-view li').off();
        $('.img-view li').on('mouseover', function () {
            $(this).find('.img-bg').removeClass('hidden');
            $(this).find('.img-icon').removeClass('hidden');
        });
        $('.img-view li').on('mouseout', function () {
            $(this).find('.img-bg').addClass('hidden');
            $(this).find('.img-icon').addClass('hidden');
        });
        //삭제
        $('.removeIcon').off();
        $('.removeIcon').on('click', function (e) {
            if (window.deleteFileImg) deleteFileImg($(this).parent().parent().parent().attr('id'));
            var index = $(this).parents('li').data('index');
            $('#fileStatus').find('input').eq(index).val('N');
            $(this).parents('li').remove();
            e.stopPropagation();
        });
        //확대
        $('.expandIcon').off();
        $('.expandIcon').on('click', function (e) {
            const src = $(this).parent().parent().find('img').attr('src');
            const alt = $(this).parent().parent().find('img').attr('alt');
            if (src) AttFile.show(src, alt);
            e.stopPropagation();
        });
    };
    /**
     * 페이지 로드 시 기존 파일 목록 표시
     */
    this.showExistingFiles = function () {
        $('[name$="srln"]').each(function () {
            var input = $(this);
            var fileId = input.val();
            var targetClass = input.attr('name').replace('srln', '');
            var fileNamesDiv = $('.' + targetClass + '-names, .file-names');

            if (fileId && fileNamesDiv.length > 0) {

                // AJAX로 파일 목록 조회
                Ajax.get({
                    url: '/file/list.do',
                    data: {id: fileId},
                    success: function (d) {
                        var data = d.list || d;
                        if (Array.isArray(data) && data.length > 0) {
                            // DOM 조작 완료를 보장하기 위해 setTimeout 추가
                            setTimeout(function() {
                                AttFile.renderFileList(data, fileNamesDiv, fileId);
                            }, 50);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log('기존 파일 목록 조회 실패:', error);
                    }
                });
            }
        });
    };

    /**
     * 파일 목록을 렌더링하는 공통 함수
     */
    this.renderFileList = function (fileList, targetDiv, fileId) {
        var table = $('<table>').attr('class', 'table table-white table-bordered file-table');
        var colgroup = $('<colgroup>');
        colgroup.append($('<col>').attr('width', '85%'));
        colgroup.append($('<col>').attr('width', '15%'));
        table.append(colgroup);

        var thead = $('<thead>');
        var tr = $('<tr>').attr('class', 'text-center text-nowrap');
        tr.append($('<th>').text('파일명'));
        tr.append($('<th>').text('용량'));
        thead.append(tr);
        table.append(thead);

        const tbody = $('<tbody>');
        let hasValidRow = false;

        fileList.forEach((file, i) => {
            if (!file || typeof file !== 'object') {
                return;
            }

            // 다양한 파일명 속성 시도
            var fileName = file.name || file.attcfilename || file.filename || file.originalName || `파일${i + 1}`;
            var fileSize = file.size || file.attcfilesize || file.filesize || 0;
            var fileSrn = file.index || file.attcfilesrln || file.srn || i;

            // 유효한 파일 객체일 때만 tr 생성
            const tr = $('<tr>');
            
            // 파일명 디코딩 시도
            try {
                if (fileName && typeof fileName === 'string') {
                    fileName = decodeURIComponent(fileName);
                }
            } catch (e) {
                console.log('파일명 디코딩 실패, 원본 사용:', fileName, e);
            }

            const aTag = $('<a>')
                .attr({
                    href: `/file/down.do?id=${fileId}&srn=${fileSrn}&menucd=${typeof c !== 'undefined' ? c.menucd : ''}`,
                    target: '_blank'
                })
                .text(fileName);

            tr.append($('<td>').append(aTag));
            tr.append($('<td class="text-right">').text(Utils.sizeConvert(fileSize)));
            tbody.append(tr);
            hasValidRow = true;
        });

        if (!hasValidRow) {
            tbody.append($('<tr><td colspan="2" class="text-center text-muted">첨부된 파일이 없습니다!</td></tr>'));
        }

        table.append(tbody);

        // 항상 기존 내용을 비우고 새로 추가 (중복 방지)
        targetDiv.empty().append(table);
    };

    /**
     * 이미지 팝업
     * @param src
     * @param alt
     */
    this.show = function (src, alt) {
        let html = '<div class="img-view-popup">';
        html += '<div class="img-g"><img src="' + src + '" alt="' + alt + '" /></div>';
        html += '<a href="#" onclick="$(\'.img-view-popup\').remove();" class="btn-close">닫기</a></div>';
        $('body').append(html);
    }
};