/**
 * 메시지 함수 스크립트
 */
var Message = new function() {
	/**
	 * 목록
	 */
	this.list = function() {
		$("#btn_message_del").hide();
		$("#btn_message_reply").hide();
		$('#text_receive_content').text('');
		$('#text_send_content').text('');

		Ajax.get({
			url: '/message/listPopup.do',
			success: function(data) {
				var receiveHtml = '';
				if (!data.receive.length) {
					receiveHtml = '<li><div class="text-box"><p class="text text-center">[받은 메시지가 없습니다]</p></div></li>';
				} else {
					for (let idx in data.receive) {
						let msg = data.receive[idx];
						if (!msg.messageid) continue;

						let readStatusClass = msg.readdtm ? '' : 'new';
						let readIcon = msg.readdtm ? '' : '<i class="i-new"></i>';
						let regTime = moment(msg.regdtm).fromNow();

						receiveHtml += '<li onclick="Message.info(\'' + msg.messageid + '\', 0, \'' + msg.empid + '\', this)" id="' + msg.messageid + '">';
						receiveHtml += '  <a href="#">';
						receiveHtml += '    <p class="img"></p>';
						receiveHtml += '    <div class="text-box">';
						receiveHtml += '      <p class="tit">' + msg.regnm + '</p>';
						receiveHtml += '      <p class="text">' + msg.title + ' ' + readIcon + '</p>';
						receiveHtml += '      <div class="text-view">';
						receiveHtml += '        <div class="message-body" style="margin-top: 8px; white-space: pre-wrap;">';
						receiveHtml +=              msg.content || '[본문 없음]';
						receiveHtml += '        </div>';
						receiveHtml += '        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">';
						receiveHtml += '          <span class="reg-date" style="color: #999; font-size: 12px;">' + moment(msg.regdtm).format('YYYY-MM-DD HH:mm') + '</span>';
						receiveHtml += '          <button onclick="event.stopPropagation(); Message.delete(\'' + msg.messageid + '\', 0);"';
						receiveHtml += '            style="background: none; border: none; color: #999; font-size: 12px; cursor: pointer;">삭제</button>';
						receiveHtml += '        </div>';
						receiveHtml += '      </div>';
						receiveHtml += '      <span class="status ' + readStatusClass + '">' + regTime + '</span>';
						receiveHtml += '    </div>';
						receiveHtml += '  </a>';
						receiveHtml += '</li>';
					}
				}

				$("#ul_receive").html(receiveHtml);
				Detail.tabEvent();

				$('#modal_message .header-alarm-box').addClass('on').css('visibility', 'visible');

				const modal = $('#modal_message');

				if (modal.hasClass('show')) {
					modal.one('hidden.bs.modal', function () {
						modal.modal('show');

						modal.find('.header-alarm-box')
							.addClass('on')
							.css('visibility', 'visible');
					});
					modal.modal('hide');
				} else {
					modal.modal('show');

					modal.find('.header-alarm-box')
						.addClass('on')
						.css('visibility', 'visible');
				}

			}
		});
	}



	/**
	 * 모두 읽음 처리
	 */
	this.markAllAsRead = function () {
		let unreadMessageIds = [];

		$("#ul_receive li").each(function () {
			if ($(this).find("i.i-new").length > 0) {
				const messageId = $(this).attr("id");
				if (messageId) unreadMessageIds.push(messageId);
			}
		});

		$("#ul_receive i.i-new").remove();
		$("#ul_receive .status.new").removeClass("new");

		if (unreadMessageIds.length === 0) return;

		const queryString = unreadMessageIds
			.map(id => 'messageIds=' + encodeURIComponent(id))
			.join('&');

		Ajax.post(null, {
			url: '/message/markAllRead.do?' + queryString + '&empid=' + encodeURIComponent(c.empid),
			xhrFields: { withCredentials: true },
			success: function (res) {
				if (res && res.result === 'ok') {
					Message.list();
				} else {
					console.warn("서버 응답 오류:", res);
				}
			},
			error: function (err) {
				console.error("Ajax 오류:", err);
			}
		});
	};



	/**
	 * 내용
	 * @param messageid
	 * @param gubun
	 */
	this.info = function(messageid, gubun, empid, liElement) {
		Ajax.get({
			url: '/message/info.do?messageid=' + messageid + '&gubun=' + gubun + '&empid=' + empid,
			success: function(d) {

				if (liElement) {
					const $li = $(liElement);
					$li.find('i.i-new').remove(); // 빨간 N 아이콘 제거
					$li.find('.status').removeClass('new'); // 파란 점 제거
				}
				//삭제
				$("#btn_message_del").show();
				/*$("#message_title").text(d.data.title);
                $("#message_content").text(d.data.content);
                $("#message_regdtm").text(moment(d.data.regdtm).format('YYYY-MM-DD HH:mm') + " " + d.data.regnm);*/
				$("#btn_message_del").attr('onclick', '').unbind('click');
				$("#btn_message_del").attr('onclick', 'Message.delete("' + d.data.messageid + '", "' + gubun + '")').bind('click');
				//답장
				$("#btn_message_reply").hide();
				$("#btn_message_reply").attr('onclick', '').unbind('click');
				//받은 메시지
				if(gubun == 0) {
					$('#tbody_receive tr').each(function(){
						$(this).removeClass('active');
					});
					$('#tbody_receive tr[id=' + messageid + ']').addClass("active");
					$('#text_receive_content').text(d.data.content);
					$("#btn_message_reply").show();
					$('#btn_message_reply').on('click', function() {
						$("#message_send_title").text("Message 답장");
						$(document.forms.modalForm_message_send).find('[name=type]').val("I");
						$(document.forms.modalForm_message_send).find('[name=empid]').val(d.data.regid);
						$(document.forms.modalForm_message_send).find('[name=empnm]').val(d.data.regnm);
						$(document.forms.modalForm_message_send).find('[name=title]').val("RE:" + d.data.title);
						$(document.forms.modalForm_message_send).find('[name=content]').val("");
						$('#modal_message_send').modal();
					});
					//보낸 메시지
				} else {
					$('#tbody_send tr').each(function(){
						$(this).removeClass('active');
					});
					$('#tbody_send tr[id=' + messageid + ']').addClass("active");
					$('#text_send_content').text(d.data.content);
				}
				//$('#modal_message_info').modal();

				if (!$('#modal_message').hasClass('show')) {
					$('#modal_message').modal('show');
				}
			}
		});
	}

	/**
	 * 발송
	 */
	this.send = function() {
		confirmPopup("메시지를 발송 하시겠습니까?", function () {
			Ajax.post(document.forms.modalForm_message_send, {
				url: '/message/save.do',
				success: function (d) {
					$('#modal_message_send').modal('hide');
					$('#modal_message_info').modal('hide');
					$('#modal_message').modal('hide');
					alertMsg("메시지가 발송 되었습니다.");
					//메시지 확인 팝업
					if ($(document.forms.modalForm_message_send).find('[name=type]').val() == "I") Message.list();
				}
			});
		}, '메시지 발송');
	}

	/**
	 * 삭제
	 * @param messageid
	 * @param gubun
	 */
	this.delete = function(messageid, gubun) {
		Ajax.get({
			url: "/message/delete.do"
			, data: {
				messageid: messageid
				, empid: c.empid
				, gubun: gubun
			}
			, success: function(d) {
				$('#modal_message_send').modal('hide');
				$('#modal_message_info').modal('hide');
				$('#modal_message').modal('hide');
				alertMsg('메시지가 삭제 되었습니다.');
			}
		});
		//메시지 조회
		setTimeout(Message.list, 100);
	}
};