$(function() {
	/*检测是否记住用户名密码*/
	var remember = window.localStorage.getItem('remember-me');
	if(remember){
		$('#username').val(window.localStorage.getItem('uname'));
		$('#password').val(window.localStorage.getItem('pwd'));
		$('#remember-me').attr('checked','checked');
	}
	$('#login').click(function(e) {
		e.preventDefault();
		var u = $('#username').val();
		var p = $('#password').val();
		if (!u) {
			$('.errorinfo').html('<p>用户名不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!p) {
			$('.errorinfo').html('<p>密码不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if(jqchk('remember-me') == "on"){
			window.localStorage.setItem("uname",u);
			window.localStorage.setItem('pwd',p);
			window.localStorage.setItem("remember-me",true);
		}else{
			window.localStorage.removeItem("uname");
			window.localStorage.removeItem('pwd');
			window.localStorage.removeItem("remember-me");
		}
		$.ajax({
			type: "post",
			url: hosts + "/user/checkLogin",
			data: {
				uname: u,
				pwd: p
			},
			success: function(data) {
				if (data == "400") {
					$('.errorinfo').html('<p>用户名或密码错误！</p>').removeClass("none");
					setTimeout(function() {
						$('.errorinfo').addClass("none");
					}, 2000);
					return false;
				}

				/*记住用户标识*/
				window.sessionStorage.setItem("cid",data.id);
				window.sessionStorage.setItem("cname",data.name);
				window.sessionStorage.setItem('c_role_basic',data.role_basic);
				window.sessionStorage.setItem('c_role_manage',data.role_manage);
				window.sessionStorage.setItem('c_role_send',data.role_send);
				window.sessionStorage.setItem('c_role_custom',data.role_custom);
				window.sessionStorage.setItem('c_role_option',data.role_option);
				window.location = 'index.html';
			}
		});
	});
});

function jqchk(name)
{ //jquery获取复选框值
    var chk_value = '';
    $('input[name="' + name + '"]:checked').each(function ()
    {
        if (chk_value == "")
        {
            chk_value = $(this).val();
        }
        else
        {
            chk_value = chk_value + "*" + $(this).val();
        }
    }
    );
    return chk_value;
}